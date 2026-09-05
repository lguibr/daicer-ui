import type { ReactElement } from "react";
import { GameMessageAudience } from "./generated";
import type { PlayerRoomFragment } from "./generated";

export function PlayerMessages({ messages }: { messages: PlayerRoomFragment["messages"] }): ReactElement {
  return <section className="card space-y-4 p-6" aria-label="Adventure chat">
    <h2 className="text-xl">Adventure log</h2>
    {!messages.nodes.length && <p>No messages yet.</p>}
    <ol className="space-y-3">{messages.nodes.map((message) => <li key={message.messageId}>
      <p className="text-sm text-aurora-300">{message.senderName}{message.audience === GameMessageAudience.Self ? " · Only you" : ""}</p>
      <p className="whitespace-pre-wrap">{message.content}</p>
    </li>)}</ol>
    {messages.pageInfo.hasPreviousPage && <p>Showing the latest messages.</p>}
  </section>;
}
