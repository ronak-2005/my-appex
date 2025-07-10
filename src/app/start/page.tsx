'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SideNav from '@/components/SideNav';
import NewChatForm from '@/components/NewChatForm';
import ArchivedChats from '@/components/ArchivedChats';
import ChatView from '@/components/ChatView';

interface Chat {
  id: string;
  title: string;
}

export default function StartPage() {

  const [archivedChats, setArchivedChats] = useState<Chat[]>([]);
  const [view, setView] = useState<'new' | 'archived' | 'chat'>('new');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const router = useRouter();

  const handleNewChatClick = () => {
    setView('new');
    setActiveChatId(null);
  };

  const handleArchivedClick = () => {
    setView('archived');
    setActiveChatId(null);
  };

  const handleChatSelect = (chatId: string) => {
    setView('chat');
    setActiveChatId(chatId);
    router.push(`/start/chat/${chatId}`);
  };

  return (
    <div className="flex h-screen text-white bg-[#212121]">
      <SideNav
        onNewChat={handleNewChatClick}
        onArchive={handleArchivedClick}
        onChatSelect={handleChatSelect}
        onProfile={() => console.log('Profile')}
      />

      <div className="flex-1 p-4 overflow-auto" style={{backgroundColor:'#212121'}}>
        {view === 'new' && <NewChatForm />}
        {view === 'archived' && <ArchivedChats archived={archivedChats} onChatSelect={handleChatSelect} />}
        {view === 'chat' && activeChatId && <ChatView />}
      </div>
    </div>
  );
}
