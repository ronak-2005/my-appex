// 'use client';

// import { useState , useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import SideNav from '@/components/SideNav';
// import NewChatForm from '@/components/NewChatForm';
// import ArchivedChats from '@/components/ArchivedChats';
// import ChatView from '@/components/ChatView';
// import { Chat } from '@/types/chat';


// export default function StartPage() {

//   const [archivedChats, setArchivedChats] = useState<Chat[]>([]);
//   const [view, setView] = useState<'new' | 'archived' | 'chat'>('new');
//   const [activeChatId, setActiveChatId] = useState<string | null>(null);
//   const router = useRouter();
//   const [chats, setChats] = useState([]);


//  useEffect(() => {
//   const fetchChats = async () => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chats`, {
//       method: 'GET',
//       credentials: 'include',
//     });
//     const data = await res.json();
//     setChats(data.chats || []);
//   };
//   fetchChats();
// }, []);

//   const fetchArchivedChats = async () => {
//    try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chats?archived=true`, {
//       method: 'GET',
//       credentials: 'include',
//     });
//     const data = await res.json();
//     setArchivedChats(data.chats || []);
//   } catch (error) {
//     console.error('Error fetching archived chats:', error);
//   }
// };

//   const handleNewChatClick = () => {
//     setView('new');
//     setActiveChatId(null);
//   };

//   const handleArchivedClick = () => {
//     setView('archived');
//     setActiveChatId(null);
//   };

//   const handleChatSelect = (chatId: string) => {
//     setView('chat');
//     setActiveChatId(chatId);
//     router.push(`/start/chat/${chatId}`);
//   };

//   const handleChatArchive = async (chatId: string) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chat/${chatId}/archive`, {
//         method: 'PUT',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ archived: true }),
//       });

//       if (res.ok) {
//         // Remove from regular chats and refetch
//         setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
//         console.log('Chat archived successfully');
//       }
//     } catch (error) {
//       console.error('Error archiving chat:', error);
//     }
//   };

//   const handleChatDelete = async (chatId: string) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chat/${chatId}`, {
//         method: 'DELETE',
//         credentials: 'include',
//       });

//       if (res.ok) {
//         // Remove from both regular and archived chats
//         setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
//         setArchivedChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
//         console.log('Chat deleted successfully');
//       }
//     } catch (error) {
//       console.error('Error deleting chat:', error);
//     }
//   };

//   return (
//     <div className="flex h-screen text-white bg-[#212121]">
//          <SideNav
//         chats={chats}
//         onNewChat={handleNewChatClick}
//         onArchive={handleArchivedClick}
//         onChatSelect={handleChatSelect}
//         onProfile={() => console.log('Profile')}
//         onChatArchive={handleChatArchive}
//         onChatDelete={handleChatDelete}
//       />

//       <div className="flex-1 p-4 overflow-auto" style={{backgroundColor:'#212121'}}>
//         {view === 'new' && <NewChatForm />}
//         {view === 'archived' && <ArchivedChats archived={archivedChats} onChatSelect={handleChatSelect} />}
//         {view === 'chat' && activeChatId && <ChatView />}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideNav from '@/components/SideNav';
import NewChatForm from '@/components/NewChatForm';
import ArchivedChats from '@/components/ArchivedChats';
import ChatView from '@/components/ChatView';
import { Chat } from '@/types/chat';

export default function StartPage() {
  const [archivedChats, setArchivedChats] = useState<Chat[]>([]);
  const [view, setView] = useState<'new' | 'archived' | 'chat'>('new');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);

  // Fetch regular chats (non-archived)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chats?archived=false`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch chats');
        }
        
        const data = await res.json();
        setChats(data.chats || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setChats([]);
      }
    };
    fetchChats();
  }, []);

  // Function to fetch archived chats
  const fetchArchivedChats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chats?archived=true`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch archived chats');
      }
      
      const data = await res.json();
      setArchivedChats(data.chats || []);
    } catch (error) {
      console.error('Error fetching archived chats:', error);
      setArchivedChats([]);
    }
  };

  const handleNewChatClick = () => {
    setView('new');
    setActiveChatId(null);
  };

  const handleArchivedClick = async () => {
    setView('archived');
    setActiveChatId(null);
    // Fetch archived chats when Archive is clicked
    await fetchArchivedChats();
  };

  const handleChatSelect = (chatId: string) => {
    setView('chat');
    setActiveChatId(chatId);
    router.push(`/start/chat/${chatId}`);
  };

  const handleLogout = async () => {
    try {
      console.log('Logout initiated...');
      localStorage.removeItem('authToken');
      localStorage.clear();
      sessionStorage.clear(); 
      console.log('Storage cleared, redirecting...');
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      router.push('/login');
    }
  };


  const handleChatArchive = async (chatId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chat/${chatId}/archive`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ archived: true }),
      });

      if (res.ok) {
        // Remove from regular chats and refetch
        setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
        console.log('Chat archived successfully');
      }
    } catch (error) {
      console.error('Error archiving chat:', error);
    }
  };

  const handleChatDelete = async (chatId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/chat/${chatId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        // Remove from both regular and archived chats
        setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
        setArchivedChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
        console.log('Chat deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className="flex h-screen text-white bg-[#212121]">
      <SideNav
        onLogout={handleLogout}
        chats={chats}
        onNewChat={handleNewChatClick}
        onArchive={handleArchivedClick}
        onChatSelect={handleChatSelect}
        onProfile={() => console.log('Profile')}
        onChatArchive={handleChatArchive}
        onChatDelete={handleChatDelete}
      />

      <div className="flex-1 p-4 overflow-auto" style={{ backgroundColor: '#212121' }}>
        {view === 'new' && <NewChatForm />}
        {view === 'archived' && <ArchivedChats archived={archivedChats} onChatSelect={handleChatSelect} />}
        {view === 'chat' && activeChatId && <ChatView />}
      </div>
    </div>
  );
}