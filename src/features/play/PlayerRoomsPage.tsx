import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import useAuth from "@/hooks/useAuth";
import JuicyLayout from "@/components/layout/JuicyLayout";
import { PlayerRoomsDocument } from "./generated";

function Memberships({ viewerId }: { viewerId: string }): ReactElement {
  const { data, loading, error, refetch } = useQuery(PlayerRoomsDocument, {
    fetchPolicy: "no-cache", context: { queryDeduplication: false },
  });
  return <main className="mx-auto max-w-6xl space-y-6 p-6 text-shadow-100">
    <h1 className="text-2xl font-display text-aurora-300">Your rooms</h1>
    <Link to="/create" className="btn-primary">Create room</Link> <Link to="/" className="btn-secondary">Join room</Link>
    {loading && <p role="status">Loading rooms…</p>}
    {error && <p role="alert">{error.message} <button type="button" onClick={() => { refetch().catch(() => {}); }}>Retry</button></p>}
    {!loading && !error && !data?.myRooms.length && <p>No rooms yet.</p>}
    {!error && <ul className="space-y-4">{data?.myRooms.map((room) => <li key={room.roomId} className="card p-6">
      <p>Room <code>{room.code}</code> · {room.phase} {room.ownerUserId === viewerId ? "· Owner" : ""}</p>
      <Link to={`/play/${room.roomId}`} className="btn-secondary">Enter room</Link>
    </li>)}</ul>}
  </main>;
}

export default function PlayerRoomsPage(): ReactElement {
  const { user, loading } = useAuth();
  return <JuicyLayout showNavbar>{loading || !user ? <p role="status">Loading player…</p> :
    <Memberships key={user.documentId} viewerId={user.documentId} />}</JuicyLayout>;
}
