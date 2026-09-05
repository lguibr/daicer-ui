import type { ReactElement, ReactNode } from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { ApolloClient, ApolloLink, InMemoryCache, Observable } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LandingPage from "@/pages/Landing";
import WorldConfigPage from "@/features/create-room/pages/WorldConfigPage";
import { WizardProvider } from "@/features/create-room/context/WizardContext";
import { WorldConfigRedirect } from "@/features/create-room/layout/CreateRoomLayout";
import PlayerCharacterPage from "../PlayerCharacterPage";
import { GameRoomPhase } from "../generated";
import type { PlayerRoomFragment } from "../generated";

vi.mock("@/hooks/useAuth", () => ({ default: () => ({ user: { documentId: "viewer", username: "Player" }, loading: false }) }));
vi.mock("@/i18n", () => ({ useI18n: () => ({ language: "en", t: (key: string, fallback?: string): string => fallback ?? key }) }));
vi.mock("@/components/layout/index.ts", () => ({ DynamicLayout: ({ children }: { children: ReactNode }): ReactNode => children }));
vi.mock("@/components/layout/JuicyLayout", () => ({ default: ({ children }: { children: ReactNode }): ReactNode => children }));
vi.mock("@/components/ui/background/BackgroundDiceField", () => ({ BackgroundDiceField: (): null => null }));
vi.mock("@/features/create-room/components/WorldPreview", () => ({ WorldPreview: (): null => null }));
vi.mock("@/components/pwa/PWAInstallPrompt", () => ({ PWAInstallPrompt: (): null => null }));
vi.mock("@/components/ui/LoadingOverlay", () => ({ LoadingOverlay: (): null => null }));
vi.mock("lucide-react", () => ({ Shield: (): null => null, Sparkles: (): null => null,
  RefreshCw: (): null => null, RotateCcw: (): null => null }));

const config: PlayerRoomFragment["world"]["config"] = {
  seed: "fixed", chunkSize: 16, detail: 4, fogRadius: 10, globalScale: 0.01, seaLevel: 0,
  elevationScale: 1, roughness: 0, moistureScale: 1, temperatureOffset: 0, roadDensity: 0,
  structureChance: 0, structureSpacing: 10, structureSizeAvg: 10, worldSize: "small", worldType: "terra",
};
const room: PlayerRoomFragment = { roomId: "canonical-document-id", code: "Mixed-UUID-code", revision: 1,
  phase: GameRoomPhase.Lobby, ownerUserId: "viewer", world: { worldId: "world", language: "en", description: "", config },
  players: [], visibleEntities: [], messages: { nodes: [], pageInfo: { hasPreviousPage: false } },
  capabilities: { canStart: false, canSubmit: false, canResolve: false } };
function Destination(): ReactElement { const location = useLocation(); return <p>Destination: {location.pathname}{location.search}</p>; }

describe("player entry contracts", () => {
  afterEach(() => { cleanup(); sessionStorage.clear(); });

  it("preserves the exact join code and navigates using the returned document ID", async () => {
    let receivedCode = "";
    const client = new ApolloClient({ cache: new InMemoryCache(), link: new ApolloLink((operation) => new Observable((observer) => {
      expect(operation.operationName).toBe("PlayerJoinRoom");
      receivedCode = operation.variables.input.code;
      expect(operation.variables.input.requestId).toBeTruthy();
      observer.next({ data: { joinRoom: room } }); observer.complete();
    })) });
    render(<ApolloProvider client={client}><MemoryRouter><Routes>
      <Route path="/" element={<LandingPage />} /><Route path="/play/:roomId" element={<Destination />} />
    </Routes></MemoryRouter></ApolloProvider>);
    const input = screen.getByLabelText("Room code");
    expect(input).not.toHaveAttribute("maxlength");
    fireEvent.change(input, { target: { value: "aBc-12345678-1234-5678-1234-AbCdEf123456" } });
    const form = input.closest("form");
    if (!form) throw new Error("Join form missing");
    fireEvent.submit(form);
    await screen.findByText("Destination: /play/canonical-document-id");
    expect(receivedCode).toBe("aBc-12345678-1234-5678-1234-AbCdEf123456"); client.stop();
  });

  it.each([false, true])("creates from the exact config and preserves debug target %s", async (debug) => {
    let called = false;
    const client = new ApolloClient({ cache: new InMemoryCache(), link: new ApolloLink((operation) => new Observable((observer) => {
      expect(operation.operationName).toBe("PlayerCreateRoom");
      expect(operation.variables.input).toMatchObject({ language: "en", worldConfig: config });
      expect(operation.variables.input.settings).toBeUndefined();
      called = true; observer.next({ data: { createRoom: room } }); observer.complete();
    })) });
    render(<ApolloProvider client={client}><MemoryRouter initialEntries={[`/create/world-generation${debug ? "?target=debug" : ""}`]}><Routes>
      <Route path="/create/world-generation" element={<WizardProvider initialValues={{ seed: "fixed", generationParams: config }}><WorldConfigPage /></WizardProvider>} />
      <Route path="/create/character-selection/:roomId" element={<Destination />} />
      <Route path="/debug/:roomId" element={<Destination />} />
    </Routes></MemoryRouter></ApolloProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Create room" }));
    await screen.findByText(`Destination: ${debug ? "/debug" : "/create/character-selection"}/canonical-document-id`);
    expect(called).toBe(true); client.stop();
  });

  it("preserves debug query parameters on the legacy DM redirect", async () => {
    render(<MemoryRouter><Routes>
      <Route path="/" element={<Link to="/create/dm-settings?target=debug">Legacy creation</Link>} />
      <Route path="/create/dm-settings" element={<WorldConfigRedirect />} />
      <Route path="/create/world-generation" element={<Destination />} />
    </Routes></MemoryRouter>);
    fireEvent.click(screen.getByRole("link", { name: "Legacy creation" }));
    expect(await screen.findByText("Destination: /create/world-generation?target=debug")).toBeInTheDocument();
  });

  it("selects a blueprint by document ID and returns to the canonical lobby", async () => {
    let selected = false;
    const client = new ApolloClient({ cache: new InMemoryCache(), link: new ApolloLink((operation) => new Observable((observer) => {
      if (operation.operationName === "PlayerBlueprints") observer.next({ data: { characterBlueprints: [
        { blueprintId: "blueprint-document", name: "Hero", description: "Ready for adventure" },
      ] } });
      else {
        expect(operation.operationName).toBe("PlayerSelectCharacter");
        expect(operation.variables.input).toMatchObject({ roomId: "canonical-document-id", blueprintId: "blueprint-document" });
        selected = true; observer.next({ data: { selectCharacter: room } });
      }
      observer.complete();
    })) });
    render(<ApolloProvider client={client}><MemoryRouter initialEntries={["/create/character-selection/canonical-document-id"]}><Routes>
      <Route path="/create/character-selection/:roomId" element={<PlayerCharacterPage />} />
      <Route path="/play/:roomId" element={<Destination />} />
    </Routes></MemoryRouter></ApolloProvider>);
    fireEvent.click(await screen.findByRole("radio"));
    fireEvent.click(screen.getByRole("button", { name: "Use character" }));
    await waitFor(() => expect(selected).toBe(true));
    expect(await screen.findByText("Destination: /play/canonical-document-id")).toBeInTheDocument(); client.stop();
  });
});
