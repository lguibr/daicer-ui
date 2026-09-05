import { useState } from "react";
import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import { useApolloClient } from "@apollo/client/react";
import useAuth from "@/hooks/useAuth";
import JuicyLayout from "@/components/layout/JuicyLayout";
import { GameOperationStatus, GameRoomPhase, GameSubmissionKind, PlayerResolveTurnDocument, PlayerSetReadyDocument,
  PlayerStartGameDocument, PlayerSubmitActionDocument } from "./generated";
import type { SubmissionReceipt } from "./generated";
import { useRoomView } from "./useRoomView";
import { CompletedOperationError, useRoomMutation } from "./useRoomMutation";
import { PlayerLobby } from "./PlayerLobby";
import { PlayerTurn } from "./PlayerTurn";
import { PlayerMessages } from "./PlayerMessages";
import { PlayerMap } from "./PlayerMap";

/** Route identity and authenticated identity jointly own every local game state. */
export default function PlayerRoomPage(): ReactElement {
  const { roomId = "" } = useParams();
  const { user, loading } = useAuth();
  if (loading || !user) return <p role="status">Loading player…</p>;
  return <PlayerSession key={JSON.stringify([roomId, user.documentId])} roomId={roomId} viewerId={user.documentId} />;
}

export function PlayerSession({ roomId, viewerId }: { roomId: string; viewerId: string }): ReactElement {
  const client = useApolloClient();
  const projection = useRoomView(roomId, viewerId);
  const mutation = useRoomMutation(viewerId && roomId ? JSON.stringify([viewerId, roomId]) : "");
  const { view } = projection;
  const [suggestion, setSuggestion] = useState<{ id: number; turn: number; text: string } | null>(null);
  const disabled = mutation.pending || projection.status !== "ready";
  const ready = async (value: boolean): Promise<void> => {
    const result = await mutation.run(JSON.stringify(["ready", roomId, value]), async (requestId) => {
      const response = await client.mutate({ mutation: PlayerSetReadyDocument,
        variables: { input: { requestId, roomId, ready: value } }, fetchPolicy: "no-cache" });
      if (!response.data?.setReady) throw new Error("Readiness was not confirmed.");
      return response.data.setReady;
    });
    if (result) projection.refresh();
  };
  const start = async (): Promise<void> => {
    const result = await mutation.run(JSON.stringify(["start", roomId]), async (requestId) => {
      const response = await client.mutate({ mutation: PlayerStartGameDocument,
        variables: { input: { requestId, roomId } }, fetchPolicy: "no-cache" });
      if (!response.data?.startGame) throw new Error("Starting the game was not confirmed.");
      if (response.data.startGame.status === GameOperationStatus.Failed) throw new CompletedOperationError("Starting the game failed. Please retry.");
      return response.data.startGame;
    });
    if (result) projection.refresh();
  };
  const submit = async (kind: GameSubmissionKind, text?: string): Promise<SubmissionReceipt | null> => {
    if (!view?.turn || !view.capabilities.canSubmit || disabled) return null;
    const input = { roomId, turnNumber: view.turn.number, kind, ...(kind === GameSubmissionKind.Intent ? { text } : {}) };
    const result = await mutation.run(JSON.stringify(["submit", input]), async (requestId) => {
      const response = await client.mutate({ mutation: PlayerSubmitActionDocument,
        variables: { input: { ...input, requestId } }, fetchPolicy: "no-cache" });
      if (!response.data?.submitAction) throw new Error("Submission was not confirmed.");
      return response.data.submitAction;
    });
    if (result) projection.refresh();
    return result ?? null;
  };
  const resolve = async (): Promise<void> => {
    if (!view?.turn || !view.capabilities.canResolve || disabled) return;
    const input = { roomId, turnNumber: view.turn.number };
    const result = await mutation.run(JSON.stringify(["resolve", input]), async (requestId) => {
      const response = await client.mutate({ mutation: PlayerResolveTurnDocument,
        variables: { input: { ...input, requestId } }, fetchPolicy: "no-cache" });
      if (!response.data?.resolveTurn) throw new Error("Turn resolution was not confirmed.");
      if (response.data.resolveTurn.status === GameOperationStatus.Failed) throw new CompletedOperationError("Turn resolution failed. Please retry.");
      return response.data.resolveTurn;
    });
    if (result) projection.refresh();
  };
  return <JuicyLayout showNavbar><main className="mx-auto max-w-6xl space-y-6 p-6 text-shadow-100">
    <Link to="/room" className="btn-secondary">Back to rooms</Link>
    {projection.error && <p role="alert">{projection.error} <button type="button" onClick={projection.refresh}>Retry connection</button></p>}
    {mutation.error && <p role="alert">{mutation.error}</p>}
    {!view ? <p role="status">{projection.status === "error" ? "Room unavailable." : "Loading room…"}</p> : <>
      <header><h1 className="text-2xl font-display text-aurora-300">Your adventure</h1><p>Room code: <code>{view.code}</code></p></header>
      {projection.status === "reconnecting" && <p role="status">Reconnecting. Actions will resume after the room refreshes.</p>}
      {view.phase === GameRoomPhase.Lobby ? <PlayerLobby view={view} viewerId={viewerId} disabled={disabled} onReady={ready} onStart={start} /> :
        view.phase === GameRoomPhase.Gameplay ? <>
          <PlayerTurn key={view.turn?.number ?? "opening"} view={view} disabled={disabled} onSubmit={submit} onResolve={resolve}
            suggestedIntent={suggestion?.turn === view.turn?.number ? suggestion ?? undefined : undefined} />
          <PlayerMap view={view} disabled={disabled} onSuggestIntent={(text) => {
            if (view.turn && view.capabilities.canSubmit && !disabled) setSuggestion((previous) => ({ id: (previous?.id ?? 0) + 1, turn: view.turn!.number, text }));
          }} />
        </> : <p role="status">{view.phase === GameRoomPhase.Starting ? "Preparing the opening…" : `Room phase: ${view.phase}`}</p>}
      <PlayerMessages messages={view.messages} />
    </>}
  </main></JuicyLayout>;
}
