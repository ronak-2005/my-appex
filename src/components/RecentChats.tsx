// src/components/RecentChats.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Chat {
  id: string;
  title: string;
}

export default function RecentChats() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chat`, {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    };
    fetchChats();
  }, []);

  return (
    <div className="space-y-2 mt-4">
      {chats.length === 0 && <p className="text-sm text-gray-500">No recent chats</p>}
      {chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/start/chat/${chat.id}`}
          className="block text-sm text-white hover:underline"
        >
          {chat.title}
        </Link>
      ))}
    </div>
  );
}
