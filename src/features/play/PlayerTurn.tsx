import { useState } from "react";
import type { ReactElement } from "react";
import { GameSubmissionKind, GameSubmissionStatus } from "./generated";
import type { PlayerRoomFragment, SubmissionReceipt } from "./generated";

const MAX_INTENT_LENGTH = 4000;
type Props = { view: Pick<PlayerRoomFragment, "roomId" | "turn" | "players" | "myself" | "mySubmission" | "capabilities">; disabled: boolean;
  suggestedIntent?: { id: number; text: string };
  onSubmit: (kind: GameSubmissionKind, text?: string) => Promise<SubmissionReceipt | null>; onResolve: () => Promise<void> };

export function PlayerTurn({ view, disabled, onSubmit, onResolve, suggestedIntent }: Props): ReactElement {
  const [draft, setDraft] = useState(view.mySubmission?.text ?? "");
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  // Retire the bridge once observed so later projections remain authoritative.
  if (receipt && view.mySubmission?.submissionId === receipt.submissionId) setReceipt(null);
  const submit = async (kind: GameSubmissionKind): Promise<void> => {
    const response = await onSubmit(kind, draft);
    if (response) setReceipt(response);
  };
  const projected = !receipt || view.mySubmission?.submissionId === receipt.submissionId;
  const status = projected ? view.mySubmission?.status : receipt.status;
  const blocked = disabled || !view.capabilities.canSubmit || status === GameSubmissionStatus.Proposing || status === GameSubmissionStatus.Submitted;
  const [appliedSuggestion, setAppliedSuggestion] = useState<number | null>(null);
  // Each incoming suggestion is consumed once by this room/viewer/turn-keyed form.
  if (suggestedIntent && appliedSuggestion !== suggestedIntent.id) {
    setAppliedSuggestion(suggestedIntent.id);
    if (!blocked) setDraft(suggestedIntent.text);
  }
  return <section className="card space-y-4 p-6" aria-label="Turn">
    <h2 className="text-xl">Turn {view.turn?.number ?? "—"}</h2>
    <p>{view.turn?.submittedCount ?? 0} / {view.turn?.requiredCount ?? 0} players submitted · {view.turn?.status ?? "Preparing"}</p>
    <ul>{view.players.map((player) => <li key={player.userId}>{player.name}: {player.submitted ? "Submitted" : "Waiting"}</li>)}</ul>
    {view.myself && <p>{view.myself.name} · HP {view.myself.currentHp}/{view.myself.maxHp} · AC {view.myself.ac}</p>}
    {status === GameSubmissionStatus.Proposing && <p role="status">Preparing your action. Your intent is saved.</p>}
    {status === GameSubmissionStatus.NeedsRevision && <p role="status">Revise your action.</p>}
    {status === GameSubmissionStatus.Submitted && <p role="status">Your action is submitted; waiting for resolution.</p>}
    {projected && view.mySubmission?.feedback && <p role="alert">{view.mySubmission.feedback}</p>}
    <label className="block" htmlFor={`action-${view.myself?.characterSheetId ?? view.roomId}`}>Your action</label>
    <textarea id={`action-${view.myself?.characterSheetId ?? view.roomId}`} className="w-full rounded bg-midnight-900 p-3"
      value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={MAX_INTENT_LENGTH}
      disabled={blocked} placeholder="Describe what your character attempts." />
    <p className="text-sm">{draft.length} / {MAX_INTENT_LENGTH} characters</p>
    <div className="flex flex-wrap gap-3">
      <button type="button" className="btn-primary" disabled={blocked || !draft.trim() || draft.length > MAX_INTENT_LENGTH}
        onClick={() => submit(GameSubmissionKind.Intent)}>Submit action</button>
      <button type="button" className="btn-secondary" disabled={blocked}
        onClick={() => submit(GameSubmissionKind.Pass)}>Pass turn</button>
      <button type="button" className="btn-primary" disabled={disabled || !view.capabilities.canResolve}
        onClick={onResolve}>Resolve turn</button>
    </div>
  </section>;
}
