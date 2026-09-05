import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import type { PlayerRoomFragment } from "./generated";

type Props = { view: PlayerRoomFragment; viewerId: string; disabled: boolean;
  onReady: (ready: boolean) => Promise<void>; onStart: () => Promise<void> };

export function PlayerLobby({ view, viewerId, disabled, onReady, onStart }: Props): ReactElement {
  const myself = view.players.find((player) => player.userId === viewerId);
  return <section className="card space-y-4 p-6" aria-label="Lobby">
    <h2 className="text-xl">Lobby</h2>
    <ul>{view.players.map((player) => <li key={player.userId}>
      {player.name}{player.userId === view.ownerUserId ? " (owner)" : ""}: {player.characterName ?? "Choose a character"} — {player.ready ? "Ready" : "Not ready"}
    </li>)}</ul>
    <Link className="btn-secondary" to={`/create/character-selection/${view.roomId}`}>Choose character</Link>
    <button className="btn-secondary" type="button" disabled={disabled || !myself?.characterSheetId}
      onClick={() => onReady(!myself?.ready)}>{myself?.ready ? "Not ready" : "Ready"}</button>
    {view.ownerUserId === viewerId && <button className="btn-primary" type="button"
      disabled={disabled || !view.capabilities.canStart} onClick={onStart}>Start game</button>}
    <p>Each player chooses a character and confirms readiness before the owner starts.</p>
  </section>;
}
