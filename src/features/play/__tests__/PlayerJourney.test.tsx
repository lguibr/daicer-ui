import type { ReactNode } from "react";
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ApolloClient, ApolloLink, InMemoryCache, Observable } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlayerSession } from "../PlayerRoomPage";
import { PlayerTurn } from "../PlayerTurn";
import { GameMessageAudience, GameRoomPhase, GameSubmissionKind, GameSubmissionStatus, GameTurnStatus } from "../generated";
import type { PlayerRoomFragment, SubmissionReceipt } from "../generated";

vi.mock("@/components/layout/JuicyLayout", () => ({ default: ({ children }: { children: ReactNode }): ReactNode => children }));
vi.mock("../PlayerMap", () => ({ PlayerMap: (): null => null }));

const tick = async (milliseconds = 0): Promise<void> => { await act(async () => { await vi.advanceTimersByTimeAsync(milliseconds); }); };
const entity = (id: string): NonNullable<PlayerRoomFragment["myself"]> => ({
  characterSheetId: `sheet-${id}`, name: `Hero ${id}`, type: "player", currentHp: 10, maxHp: 10, ac: 12,
  position: { x: 0, y: 0, z: 0 },
});

describe("two viewer player journey (mocked GraphQL boundary)", () => {
  afterEach(() => { cleanup(); vi.useRealTimers(); });

  it("shows saved progress, preserves revision drafts, and reconciles receipts with later projections", async () => {
    const submission = { submissionId: "old", turnNumber: 1, kind: GameSubmissionKind.Intent,
      text: "Saved intent", status: GameSubmissionStatus.Proposing, feedback: null };
    const view = { roomId: "room", players: [], myself: null, turn: null, mySubmission: submission,
      capabilities: { canStart: false, canSubmit: false, canResolve: false } };
    const onSubmit = vi.fn<() => Promise<SubmissionReceipt | null>>()
      .mockResolvedValueOnce({ submissionId: "revised", turnNumber: 1, status: GameSubmissionStatus.NeedsRevision, submittedCount: 0, requiredCount: 2 })
      .mockResolvedValue({ submissionId: "accepted", turnNumber: 1, status: GameSubmissionStatus.Submitted, submittedCount: 1, requiredCount: 2 });
    const onResolve = async (): Promise<void> => {};
    const { rerender } = render(<PlayerTurn view={view} disabled={false} onSubmit={onSubmit} onResolve={onResolve} />);
    expect(screen.getByText("Preparing your action. Your intent is saved.")).toBeInTheDocument();
    expect(screen.getByLabelText("Your action")).toBeDisabled();
    const recoverable = { ...view, capabilities: { ...view.capabilities, canSubmit: true },
      mySubmission: { ...submission, status: GameSubmissionStatus.NeedsRevision, feedback: "Proposal expired" } };
    rerender(<PlayerTurn view={recoverable} disabled={false} onSubmit={onSubmit} onResolve={onResolve} />);
    expect(screen.getByLabelText("Your action")).toHaveValue("Saved intent");
    expect(screen.getByLabelText("Your action")).toHaveAttribute("maxlength", "4000");
    fireEvent.change(screen.getByLabelText("Your action"), { target: { value: "x".repeat(4000) } });
    expect(screen.getByRole("button", { name: "Submit action" })).toBeEnabled();
    fireEvent.change(screen.getByLabelText("Your action"), { target: { value: "x".repeat(4001) } });
    expect(screen.getByRole("button", { name: "Submit action" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Your action"), { target: { value: "Revised intent" } });
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Submit action" })); });
    expect(screen.getByText("Revise your action.")).toBeInTheDocument();
    expect(screen.queryByText("Your action is submitted; waiting for resolution.")).not.toBeInTheDocument();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Submit action" })); });
    expect(screen.getByRole("button", { name: "Submit action" })).toBeDisabled();
    expect(screen.queryByText("Proposal expired")).not.toBeInTheDocument();
    const matching = { ...recoverable, mySubmission: { ...recoverable.mySubmission, submissionId: "accepted", status: GameSubmissionStatus.Submitted } };
    rerender(<PlayerTurn view={matching} disabled={false} onSubmit={onSubmit} onResolve={onResolve} />);
    rerender(<PlayerTurn view={{ ...matching, mySubmission: { ...matching.mySubmission, status: GameSubmissionStatus.NeedsRevision } }} disabled={false} onSubmit={onSubmit} onResolve={onResolve} />);
    expect(screen.getByRole("button", { name: "Submit action" })).toBeEnabled();
    expect(screen.getByLabelText("Your action")).toHaveValue("Revised intent");
  });
  it("uses a map suggestion only once and never replaces a submitted draft", () => {
    const view = { roomId: "room", players: [], myself: null, turn: null, mySubmission: null,
      capabilities: { canStart: false, canSubmit: true, canResolve: false } };
    const onSubmit = async (): Promise<SubmissionReceipt | null> => null;
    const onResolve = async (): Promise<void> => {};
    const suggestion = { id: 1, text: "I move to tile (-1, 0, 0)." };
    const { rerender } = render(<PlayerTurn view={view} disabled={false} onSubmit={onSubmit} onResolve={onResolve} suggestedIntent={suggestion} />);
    expect(screen.getByLabelText("Your action")).toHaveValue(suggestion.text);
    fireEvent.change(screen.getByLabelText("Your action"), { target: { value: "My edited move" } });
    rerender(<PlayerTurn view={view} disabled onSubmit={onSubmit} onResolve={onResolve} suggestedIntent={suggestion} />);
    rerender(<PlayerTurn view={view} disabled={false} onSubmit={onSubmit} onResolve={onResolve} suggestedIntent={suggestion} />);
    expect(screen.getByLabelText("Your action")).toHaveValue("My edited move");
    rerender(<PlayerTurn view={{ ...view, capabilities: { ...view.capabilities, canSubmit: false } }} disabled={false}
      onSubmit={onSubmit} onResolve={onResolve} suggestedIntent={{ id: 2, text: "Unexpected move" }} />);
    expect(screen.getByLabelText("Your action")).toHaveValue("My edited move");
  });
  it("readies both players, starts, submits, and resolves exactly one turn with private projections", async () => {
    vi.useFakeTimers();
    let phase = GameRoomPhase.Lobby;
    let turnNumber = 0;
    const readiness = new Set<string>();
    const submitted = new Set<string>();
    let failSubmission = true;
    let failStart = true;
    let failResolve = true;
    const calls: { name: string; viewer: string; requestId: string; kind?: string; text?: string }[] = [];
    const projection = (viewer: string): PlayerRoomFragment => ({
      roomId: "document-room", code: "mixed-Case-UUID-code", revision: readiness.size + turnNumber * 10 + submitted.size,
      phase, ownerUserId: "a", myself: entity(viewer), visibleEntities: [entity(viewer)],
      world: { worldId: "world", language: "en", description: "", config: {
        seed: "seed", chunkSize: 16, detail: 1, fogRadius: 4, globalScale: 1, seaLevel: 0, elevationScale: 1,
        roughness: 1, moistureScale: 1, temperatureOffset: 0, roadDensity: 0, structureChance: 0,
        structureSpacing: 1, structureSizeAvg: 1, worldSize: "small", worldType: "terra",
      } },
      players: ["a", "b"].map((id) => ({ userId: id, name: `Player ${id}`, characterSheetId: `sheet-${id}`,
        characterName: `Hero ${id}`, ready: readiness.has(id), submitted: submitted.has(id) })),
      turn: turnNumber ? { number: turnNumber, status: GameTurnStatus.Collecting, lastResolvedNumber: turnNumber - 1,
        submittedCount: submitted.size, requiredCount: 2 } : null,
      mySubmission: submitted.has(viewer) ? { submissionId: `submission-${viewer}`, turnNumber,
        kind: GameSubmissionKind.Pass, status: GameSubmissionStatus.Submitted } : null,
      messages: { nodes: [{ messageId: `private-${viewer}`, audience: GameMessageAudience.Self,
        content: `Secret for ${viewer}`, senderName: "Guide", senderType: "dm", timestamp: "2026-09-04T00:00:00Z" }],
      pageInfo: { hasPreviousPage: false } },
      capabilities: { canStart: viewer === "a" && readiness.size === 2 && !turnNumber,
        canSubmit: Boolean(turnNumber) && !submitted.has(viewer), canResolve: viewer === "a" && submitted.size === 2 },
    });
    const clientFor = (viewer: string): ApolloClient => new ApolloClient({ cache: new InMemoryCache(),
      link: new ApolloLink((operation) => new Observable((observer) => {
        const name = operation.operationName ?? "";
        if (name === "PlayerRoom") {
          expect(operation.variables.roomId).toBe("document-room");
          observer.next({ data: { gameView: projection(viewer) } }); observer.complete(); return;
        }
        const input = operation.variables.input;
        calls.push({ name, viewer, requestId: input.requestId, kind: input.kind, text: input.text });
        expect(input.roomId).toBe("document-room");
        if (name === "PlayerSetReady") {
          if (input.ready) readiness.add(viewer); else readiness.delete(viewer);
          observer.next({ data: { setReady: projection(viewer) } });
        } else if (name === "PlayerStartGame") {
          if (failStart) { failStart = false; observer.next({ data: { startGame: { operationId: "start", roomId: "document-room", phase, status: "failed" } } }); observer.complete(); return; }
          phase = GameRoomPhase.Gameplay; turnNumber = 1;
          observer.next({ data: { startGame: { operationId: "start", roomId: "document-room", phase, turnNumber, status: "complete" } } });
        } else if (name === "PlayerSubmitAction") {
          expect(input.turnNumber).toBe(1);
          if (failSubmission) { failSubmission = false; observer.error(new Error("Connection lost")); return; }
          submitted.add(viewer);
          observer.next({ data: { submitAction: { submissionId: `submission-${viewer}`, turnNumber,
            status: "submitted", submittedCount: submitted.size, requiredCount: 2 } } });
        } else if (name === "PlayerResolveTurn") {
          expect(viewer).toBe("a"); expect(submitted.size).toBe(2); expect(input.turnNumber).toBe(1);
          if (failResolve) { failResolve = false; observer.next({ data: { resolveTurn: { operationId: "resolve", roomId: "document-room", phase, turnNumber, status: "failed" } } }); observer.complete(); return; }
          turnNumber = 2; submitted.clear();
          observer.next({ data: { resolveTurn: { operationId: "resolve", roomId: "document-room", phase, turnNumber, status: "complete" } } });
        } else observer.error(new Error(`Unexpected operation ${name}`));
        observer.complete();
      })) });
    const clients = [clientFor("a"), clientFor("b")];
    render(<MemoryRouter>{clients.map((client, index) => <div key={index} data-testid={`viewer-${index}`}>
      <ApolloProvider client={client}><PlayerSession roomId="document-room" viewerId={index ? "b" : "a"} /></ApolloProvider>
    </div>)}</MemoryRouter>);
    await tick();
    const owner = within(screen.getByTestId("viewer-0"));
    const guest = within(screen.getByTestId("viewer-1"));
    expect(owner.queryByText("Secret for b")).not.toBeInTheDocument();
    expect(guest.queryByText("Secret for a")).not.toBeInTheDocument();
    expect(owner.getByRole("button", { name: "Start game" })).toBeDisabled();
    fireEvent.click(owner.getByRole("button", { name: "Ready" })); await tick();
    fireEvent.click(guest.getByRole("button", { name: "Ready" })); await tick(2000);
    fireEvent.click(owner.getByRole("button", { name: "Start game" })); await tick();
    expect(owner.getByText("Starting the game failed. Please retry.")).toBeInTheDocument();
    fireEvent.click(owner.getByRole("button", { name: "Start game" })); await tick(2000);
    fireEvent.change(owner.getByLabelText("Your action"), { target: { value: "I move east." } });
    fireEvent.click(owner.getByRole("button", { name: "Submit action" })); await tick();
    expect(owner.getByLabelText("Your action")).toHaveValue("I move east.");
    expect(owner.getByText("Connection lost")).toBeInTheDocument();
    fireEvent.click(owner.getByRole("button", { name: "Submit action" })); await tick();
    fireEvent.click(guest.getByRole("button", { name: "Pass turn" })); await tick(2000);
    expect(guest.getByRole("button", { name: "Resolve turn" })).toBeDisabled();
    fireEvent.click(owner.getByRole("button", { name: "Resolve turn" })); await tick();
    expect(owner.getByText("Turn resolution failed. Please retry.")).toBeInTheDocument();
    fireEvent.click(owner.getByRole("button", { name: "Resolve turn" })); await tick(2000);
    expect(owner.getByRole("heading", { name: "Turn 2" })).toBeInTheDocument();
    expect(guest.getByRole("heading", { name: "Turn 2" })).toBeInTheDocument();
    expect(owner.getByLabelText("Your action")).toHaveValue("");
    const attempts = calls.filter((call) => call.name === "PlayerSubmitAction" && call.viewer === "a");
    expect(attempts).toHaveLength(2);
    expect(attempts[0]?.requestId).toBe(attempts[1]?.requestId);
    for (const operation of ["PlayerStartGame", "PlayerResolveTurn"]) {
      const operations = calls.filter((call) => call.name === operation);
      expect(operations).toHaveLength(2);
      expect(operations[0]?.requestId).not.toBe(operations[1]?.requestId);
    }
    expect(calls.find((call) => call.viewer === "b" && call.name === "PlayerSubmitAction")).toMatchObject({ kind: "pass", text: undefined });
    clients.forEach((client) => client.stop());
  });
});
