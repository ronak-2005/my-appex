'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const PreviousChats = ({ userId }: { userId: string }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chats/${userId}`);
      const data = await res.json();
      setChats(data);
    };

    fetchChats();
  }, [userId]);

  return (
    <div className="space-y-2">
      {chats.map((chat: any) => (
        <Link key={chat._id} href={`/start/chat/${chat._id}`}>
          <div className="p-2 text-white hover:bg-purple-800 rounded">
            {chat.title}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PreviousChats;
