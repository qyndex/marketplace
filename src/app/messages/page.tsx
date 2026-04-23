"use client";

import { useEffect, useState } from "react";

interface MessageItem {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);

  useEffect(() => {
    fetch("/api/messages").then((r) => r.json()).then(setMessages);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      {messages.map((m) => (
        <div key={m.id} className="border-b py-2">{m.body}</div>
      ))}
    </main>
  );
}
