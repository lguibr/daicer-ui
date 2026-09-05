import { useState } from "react";
import type { ReactElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client/react";
import useAuth from "@/hooks/useAuth";
import { PlayerBlueprintsDocument, PlayerSelectCharacterDocument } from "./generated";
import { useRoomMutation } from "./useRoomMutation";

function CharacterChoice({ roomId, viewerId }: { roomId: string; viewerId: string }): ReactElement {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const mutation = useRoomMutation(JSON.stringify([viewerId, roomId]));
  const { data, loading, error, refetch } = useQuery(PlayerBlueprintsDocument, {
    fetchPolicy: "no-cache", context: { queryDeduplication: false },
  });
  const select = async (): Promise<void> => {
    if (!selected) return;
    const result = await mutation.run(JSON.stringify(["select", roomId, selected]), async (requestId) => {
      const response = await client.mutate({ mutation: PlayerSelectCharacterDocument,
        variables: { input: { requestId, roomId, blueprintId: selected } }, fetchPolicy: "no-cache" });
      if (!response.data?.selectCharacter.roomId) throw new Error("Character selection was not confirmed.");
      return response.data.selectCharacter;
    });
    if (result) navigate(`/play/${result.roomId}`);
  };
  return <main className="space-y-6 text-shadow-100">
    <h1 className="text-2xl text-aurora-300">Choose your character</h1>
    {loading && <p role="status">Loading characters…</p>}
    {error && <p role="alert">{error.message} <button type="button" onClick={() => { refetch().catch(() => {}); }}>Retry</button></p>}
    {mutation.error && <p role="alert">{mutation.error}</p>}
    {!loading && !error && !data?.characterBlueprints.length && <p>No character blueprints are available yet.</p>}
    {!error && <div className="grid gap-4 sm:grid-cols-2">{data?.characterBlueprints.map((character) => <label key={character.blueprintId} className="card block p-6">
      <input type="radio" name="character" value={character.blueprintId} checked={selected === character.blueprintId}
        onChange={() => setSelected(character.blueprintId)} disabled={mutation.pending} /> {character.name}
      <p>{character.description}</p>
    </label>)}</div>}
    <button className="btn-primary" type="button" disabled={!selected || mutation.pending || Boolean(error)} onClick={select}>Use character</button>
    <Link className="btn-secondary" to={`/play/${roomId}`}>Back to lobby</Link>
  </main>;
}

export default function PlayerCharacterPage(): ReactElement {
  const { roomId = "" } = useParams();
  const { user, loading } = useAuth();
  if (loading || !user || !roomId) return <p role="status">Loading player…</p>;
  return <CharacterChoice key={JSON.stringify([roomId, user.documentId])} roomId={roomId} viewerId={user.documentId} />;
}
