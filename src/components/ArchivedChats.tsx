// src/components/ArchivedChats.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Chat } from '@/types/chat';

interface ArchivedChatsProps {
  archived: Chat[];
  onChatSelect: (chatId: string) => void;
}

const ArchivedChats: React.FC<ArchivedChatsProps> = ({ archived = [], onChatSelect }) => {
  const router = useRouter();

  const handleClick = (chatId: string) => {
    onChatSelect(chatId);
    router.push(`/start/chat/${chatId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Archived Chats</h2>
      
      {archived.length === 0 ? (
        <p className="text-gray-400">No archived chats found.</p>
      ) : (
        <ul className="space-y-3">
          {archived.map((chat: Chat) => (
            <li
              key={chat._id}
              className="bg-[#2c2c2c] text-white px-4 py-3 rounded-md cursor-pointer hover:bg-[#3a3a3a] transition"
              onClick={() => handleClick(chat._id)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{chat.title}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArchivedChats;