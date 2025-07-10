// src/components/ArchivedChats.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Chat {
  id: string;
  title: string;
}

interface ArchivedChatsProps {
  archived: Chat[]; // ✅ Declare this properly
  onChatSelect: (chatId: string) => void;
}

const ArchivedChats: React.FC<ArchivedChatsProps> = ({ archived = [], onChatSelect }) => {
  const router = useRouter();

  const handleClick = (chatId: string) => {
    onChatSelect(chatId); // notify parent
    router.push(`/start/chat/${chatId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Archived Chats</h2>
      <ul className="space-y-3">
        {archived.map((chat) => (
          <li
            key={chat.id}
            className="bg-[#2c2c2c] text-white px-4 py-3 rounded-md cursor-pointer hover:bg-[#3a3a3a] transition"
            onClick={() => handleClick(chat.id)}
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArchivedChats;
