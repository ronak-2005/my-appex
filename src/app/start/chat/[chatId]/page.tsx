'use client'


import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import SideNav from '@/components/SideNav'; 
import type { Chat } from '@/types/chat'; 

interface ChatData {
  _id: string;
  userId: string;
  title: string;
  archived: boolean;
  createdAt: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

interface MessageResponse {
  success: boolean;
  user_message: {
    role: 'user';
    content: string;
    timestamp: string;
  };
  ai_response: {
    role: 'assistant';
    content: string;
    timestamp: string;
  };
}

export default function ChatPage() {
  const { chatId } = useParams();
  const router = useRouter();

  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chatId) {
      initialize();
    }
  }, [chatId]);

  const initialize = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchChats(), fetchChat()]);
    } catch (e) {
      console.error('Initialization error:', e);
      setError('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchChats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/chats`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch chats: ${res.status}`);
      }

      const data = await res.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchChat = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/chat/${chatId}`, {
        credentials: 'include',
      });

      if (res.status === 404) {
        router.push('/start');
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch chat: ${res.status}`);
      }

      const data = await res.json();
      setChatData(data);
    } catch (error) {
      console.error('Error fetching chat:', error);
      setError('Failed to load chat');
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/chat/${chatId}/message`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Failed to send message: ${res.status}`);
      }

      const data: MessageResponse = await res.json();

      if (data.success) {
        setChatData(prev => prev ? {
          ...prev,
          messages: [
            ...prev.messages,
            {
              role: 'user',
              content: data.user_message.content,
              timestamp: data.user_message.timestamp,
            },
            {
              role: 'assistant',
              content: data.ai_response.content,
              timestamp: data.ai_response.timestamp,
            }
          ]
        } : null);
        setMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChatSelect = (id: string) => {
    router.push(`/start/chat/${id}`);
  };

  const handleNewChat = () => {
    router.push('/start');
  };

  const handleChatArchive = async (chatId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/chat/${chatId}/archive`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      });

      if (res.ok) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        if (chatId === chatData?._id) {
          router.push('/start');
        }
      }
    } catch (error) {
      console.error('Failed to archive chat:', error);
    }
  };

  const handleChatDelete = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/chat/${chatId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        if (chatId === chatData?._id) {
          router.push('/start');
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2">Loading chat...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/start')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <Sidebar className="flex h-screen text-white bg-[#212121]">
      <SideNav
        chats={chats}
        onNewChat={handleNewChat}
        onArchive={() => router.push('/start')}
        onChatSelect={handleChatSelect}
        onProfile={() => {}}
        onChatArchive={handleChatArchive}
        onChatDelete={handleChatDelete}
      />

      <div className="flex-1 flex flex-col">
        <header className="flex-shrink-0">
          <div className="flex items-center justify-between p-3">
            <div>
              <h1 className="text-xl font-bold text-white">{chatData?.title}</h1>
              <p className="text-gray-400 text-sm">
                {'Career Guidance'}
              </p>
            </div>
            <button
              onClick={() => router.push('/start')}
              className="text-gray-400 hover:text-white transition"
            >
              ← Back to Home
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {chatData?.messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${msg.role === 'user' ? 'max-w-xs lg:max-w-md' : 'w-full'} px-4 py-2 rounded-lg text-gray-100 border`}
                style={{ backgroundColor: '#181818', borderColor: '#2a2a2a' }}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="px-4 py-2 border rounded-lg" style={{ backgroundColor: '#181818', borderColor: '#2a2a2a' }}>
                  <p className="text-gray-400 text-sm italic">Typing...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 flex-shrink-0 px-4 py-3">
          <div className="max-w-4xl mx-auto flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your career path..."
              className="flex-1 bg-[#171717] border border-gray-700 rounded-lg px-4 py-2 text-white"
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded-lg"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
