'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ChatMessage {
  role: string;
  text: string;
  timestamp?: string;
}

interface ChatData {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export default function ChatView() {
  const { chatId } = useParams();
  const [chat, setChat] = useState<ChatData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChat = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const token = localStorage.getItem("access_token"); // fetch inside useEffect
        const res = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) {
          throw new Error('Chat not found');
        }
  
        const data: ChatData = await res.json();
        setChat(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }
    };
  
    if (chatId) fetchChat();
  }, [chatId]);

  if (error) return <div className="text-red-500">{error}</div>;

  if (!chat) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{chat.title}</h1>
      <ul className="mt-2 space-y-2">
        {chat.messages.map((msg, i) => (
          <li key={i} className="border p-2 rounded">
            <strong>{msg.role}:</strong> {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
