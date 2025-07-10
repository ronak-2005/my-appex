// // app/start/chat/[chatId]/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';

// interface ChatData {
//   _id: string;
//   userId: string;
//   title: string;
//   name: string;
//   email: string;
//   skills: string[];
//   goals: string;
//   domain: string;
//   experience: string;
//   archived: boolean;
//   createdAt: string;
//   messages: Array<{
//     role: 'user' | 'assistant';
//     content: string;
//     timestamp: string;
//   }>;
// }

// export default function ChatPage() {
//   const params = useParams();
//   const router = useRouter();
//   const chatId = params.chatId as string;
  
//   const [chatData, setChatData] = useState<ChatData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState('');
//   const [sending, setSending] = useState(false);

//   useEffect(() => {
//     fetchChatData();
//   }, [chatId]);

//   const getCurrentUserId = async () => {
//     try {
//       console.log('🔍 Calling verify-token endpoint...');
//       const response = await fetch('http://localhost:5000/api/verify-token', {
//         method: 'GET',
//         credentials: 'include'
//       });
  
//       console.log('📡 Response status:', response.status);
//       console.log('📡 Response ok:', response.ok);
  
//       if (response.ok) {
//         const data = await response.json();
//         console.log('📦 Full response data:', data); // ✅ Add this debug line
//         console.log('👤 UserId from response:', data.userId); // ✅ Add this debug line
//         console.log('👤 Username from response:', data.username); // ✅ Add this debug line
        
//         return data.userId;
//       }
//       return null;
//     } catch (error) {
//       console.error('❌ Error in getCurrentUserId:', error);
//       return null;
//     }
//   };


//   const fetchChatData = async () => {
//     try {
//       const userId=getCurrentUserId()
//       const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
//       const response = await fetch(`${apiUrl}/api/chat/${chatId}?user_id=userId`);
      
//       if (response.status === 404) {
//         // Chat not found, redirect to start page
//         console.log('Chat not found, redirecting to start page');
//         router.push('/start');
//         return;
//       }
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setChatData(data);
//     } catch (err) {
//       console.error('Error fetching chat:', err);
//       // If there's any error, redirect to start page
//       router.push('/start');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async () => {
//     if (!message.trim() || sending) return;
    
//     setSending(true);
//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      
//       // Send message to Flask backend
//       const response = await fetch(`${apiUrl}/api/chat/${chatId}/message`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: 'userId',
//           message: message
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
        
//         // Update local state with both user message and AI response
//         setChatData(prev => prev ? {
//           ...prev,
//           messages: [
//             ...prev.messages,
//             {
//               role: 'user',
//               content: data.user_message.content,
//               timestamp: data.user_message.timestamp
//             },
//             {
//               role: 'assistant',
//               content: data.ai_response.content,
//               timestamp: data.ai_response.timestamp
//             }
//           ]
//         } : null);
//       } else {
//         // Fallback to local-only update if backend fails
//         const userMessage = {
//           role: 'user' as const,
//           content: message,
//           timestamp: new Date().toISOString()
//         };

//         setChatData(prev => prev ? {
//           ...prev,
//           messages: [...prev.messages, userMessage]
//         } : null);

//         // Add a simple assistant response
//         setTimeout(() => {
//           const assistantMessage = {
//             role: 'assistant' as const,
//             content: `Thank you for your message. I understand you're asking about "${message}". Let me help you with that based on your career goals.`,
//             timestamp: new Date().toISOString()
//           };

//           setChatData(prev => prev ? {
//             ...prev,
//             messages: [...prev.messages, assistantMessage]
//           } : null);
//         }, 1000);
//       }

//       // Clear input
//       setMessage('');

//     } catch (err) {
//       console.error('Error sending message:', err);
//       alert('Failed to send message. Please try again.');
//     } finally {
//       setSending(false);
//     }
//   };

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-400">Loading your chat...</p>
//         </div>
//       </div>
//     );
//   }

//   // This should rarely show since we redirect on error, but keeping as fallback
//   if (error || !chatData) {
//     return (
//       <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//         <div className="text-center">
//           <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-4">
//             <h2 className="text-xl font-bold mb-2">Chat Not Found</h2>
//             <p>The chat you're looking for doesn't exist or has been deleted.</p>
//           </div>
//           <button
//             onClick={() => router.push('/start')}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
//           >
//             Go Back Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-950 flex flex-col">
//       {/* Header */}
//       <header className="bg-gray-900 border-b border-gray-800 p-4">
//         <div className="max-w-4xl mx-auto flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-bold text-white">{chatData.title}</h1>
//             <p className="text-gray-400 text-sm">
//               {chatData.name} • {chatData.domain || 'Career Guidance'}
//             </p>
//           </div>
//           <button
//             onClick={() => router.push('/start')}
//             className="text-gray-400 hover:text-white transition duration-200"
//           >
//             ← Back to Home
//           </button>
//         </div>
//       </header>

//       {/* Chat Area */}
//       <div className="flex-1 overflow-y-auto p-4">
//         <div className="max-w-4xl mx-auto space-y-4">
//           {/* Welcome Message */}
//           <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
//             <h2 className="text-lg font-semibold text-white mb-2">Welcome to your Career Chat!</h2>
//             <div className="text-gray-300 text-sm space-y-1">
//               <p><strong>Goals:</strong> {chatData.goals}</p>
//               <p><strong>Skills:</strong> {chatData.skills.join(', ') || 'None specified'}</p>
//               <p><strong>Experience:</strong> {chatData.experience || 'Not specified'}</p>
//               {chatData.domain && <p><strong>Domain:</strong> {chatData.domain}</p>}
//             </div>
//           </div>

//           {/* Messages */}
//           {chatData.messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div
//                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                   msg.role === 'user'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-800 text-gray-100 border border-gray-700'
//                 }`}
//               >
//                 <p className="text-sm">{msg.content}</p>
//                 <p className="text-xs opacity-70 mt-1">
//                   {new Date(msg.timestamp).toLocaleTimeString()}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {/* Typing indicator */}
//           {sending && (
//             <div className="flex justify-start">
//               <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="bg-gray-900 border-t border-gray-800 p-4">
//         <div className="max-w-4xl mx-auto flex space-x-4">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//             placeholder="Ask about your career path..."
//             className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             disabled={sending}
//           />
//           <button
//             onClick={sendMessage}
//             disabled={sending || !message.trim()}
//             className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition duration-200"
//           >
//             {sending ? 'Sending...' : 'Send'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/start/chat/[chatId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ChatData {
  _id: string;
  userId: string;
  title: string;
  name: string;
  email: string;
  skills: string[];
  goals: string;
  domain: string;
  experience: string;
  archived: boolean;
  createdAt: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    initializePage();
  }, [chatId]);

  const initializePage = async () => {
    try {
      // First verify authentication
      const user = await getCurrentUser();
      if (!user) {
        console.log('No authenticated user, redirecting to login');
        router.push('/login');
        return;
      }
      
      setCurrentUser(user);
      
      // Then fetch chat data
      await fetchChatData();
    } catch (err) {
      console.error('Error initializing page:', err);
      setError('Failed to initialize page');
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      console.log('🔍 Calling verify-token endpoint...');
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/verify-token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
  
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Full response data:', data);
        console.log('👤 UserId from response:', data.userId);
        console.log('👤 Username from response:', data.username);
        
        return data;
      }
      return null;
    } catch (error) {
      console.error('❌ Error in getCurrentUser:', error);
      return null;
    }
  };

  const fetchChatData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/chat/${chatId}`, {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Fetch chat response status:', response.status);
      
      if (response.status === 404) {
        console.log('Chat not found, redirecting to start page');
        router.push('/start');
        return;
      }
      
      if (response.status === 401) {
        console.log('Unauthorized, redirecting to login');
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Chat data received:', data);
      setChatData(data);
    } catch (err) {
      console.error('Error fetching chat:', err);
      setError('Failed to load chat');
      // Don't automatically redirect on error, let user see the error
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || sending || !currentUser) return;
    
    setSending(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/chat/${chatId}/message`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message
        })
      });

      console.log('Send message response status:', response.status);

      if (response.status === 401) {
        console.log('Unauthorized, redirecting to login');
        router.push('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Message sent successfully:', data);
        
        // Update local state with both user message and AI response
        setChatData(prev => prev ? {
          ...prev,
          messages: [
            ...prev.messages,
            {
              role: 'user',
              content: data.user_message.content,
              timestamp: data.user_message.timestamp
            },
            {
              role: 'assistant',
              content: data.ai_response.content,
              timestamp: data.ai_response.timestamp
            }
          ]
        } : null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Clear input
      setMessage('');

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your chat...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !chatData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error || 'Chat not found or access denied'}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/start')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Go Back Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{chatData.title}</h1>
            <p className="text-gray-400 text-sm">
              {chatData.name} • {chatData.domain || 'Career Guidance'}
            </p>
          </div>
          <button
            onClick={() => router.push('/start')}
            className="text-gray-400 hover:text-white transition duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Welcome Message */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-2">Welcome to your Career Chat!</h2>
            <div className="text-gray-300 text-sm space-y-1">
              <p><strong>Goals:</strong> {chatData.goals}</p>
              <p><strong>Skills:</strong> {chatData.skills.join(', ') || 'None specified'}</p>
              <p><strong>Experience:</strong> {chatData.experience || 'Not specified'}</p>
              {chatData.domain && <p><strong>Domain:</strong> {chatData.domain}</p>}
            </div>
          </div>

          {/* Messages */}
          {chatData.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your career path..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !message.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition duration-200"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}