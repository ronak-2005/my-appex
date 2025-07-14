"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Send } from "lucide-react";

interface ApiResponse {
  success?: boolean;
  chatId?: string;
  chat_id?: string;
  _id?: string;
  error?: string;
  message?: string;
}

export default function NewChatForm() {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/verify-token`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Token verification response:", data);
          setUsername(data.username);
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        router.push("/login");
      }
    };

    fetchUsername();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
    
      // Create a more appropriate title - limit to 30 characters for better display
      const title = userInput.trim()
      
      const requestBody = {
        title: title,
        userInput: userInput.trim(),
        goals: userInput.trim(), // Keep for backward compatibility if needed
      };

      console.log("Sending request:", requestBody);

      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse = await res.json();
      console.log("Chat creation response:", data);

      if (!res.ok) {
        throw new Error(data.error || `HTTP error! status: ${res.status}`);
      }

      // Check for chat ID in response
      const chatId = data.chatId || data.chat_id || data._id;
      
      if (chatId) {
        console.log("Redirecting to chat:", chatId);
        router.push(`/start/chat/${chatId}`);
      } else {
        console.error("No chat ID in response:", data);
        throw new Error("No chat ID returned from server");
      }

    } catch (err) {
      console.error("Submit failed:", err);
      setError(err instanceof Error ? err.message : "Failed to create chat");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-start justify-center px-4 overflow-hidden"
      style={{ paddingTop: "20%" }}
    >
      <div className="text-white w-full max-w-none overflow-hidden" style={{ width: "55%" }}>
        {username && (
          <h2 
            className="font-bold mb-6 truncate" 
            style={{ fontSize: "300%" }}
            title={`Hi, ${username}`}
          >
            Hi, {username}
          </h2>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-600/50 rounded-lg text-red-200 overflow-hidden">
            <p className="break-words">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl mx-auto rounded-2xl px-4 py-2 overflow-hidden"
          style={{
            backgroundColor: "#2f2f2f",
            borderColor: "#2a2a2a",
          }}
        >
          <div className="w-full overflow-hidden">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Tell me about yourself — your skills, interests, and what kind of career you're aiming for."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-transparent text-white placeholder-gray-400 text-base resize-none focus:outline-none px-2 py-2 leading-snug overflow-hidden break-words"
              style={{ 
                minHeight: "40px",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap"
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={() => console.log("Plus clicked")}
              className="text-white p-2 hover:bg-gray-700 rounded-md transition-colors flex-shrink-0"
              disabled={isSubmitting}
            >
              <Plus size={20} />
            </button>

            <button
              type="submit"
              disabled={isSubmitting || userInput.trim() === ""}
              className="text-white p-2 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent flex-shrink-0"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Plus, Send } from "lucide-react";

// interface ApiResponse {
//   success?: boolean;
//   chatId?: string;
//   chat_id?: string;
//   _id?: string;
//   error?: string;
//   message?: string;
// }

// export default function NewChatForm() {
//   const router = useRouter();
//   const [userInput, setUserInput] = useState("");
//   const [username, setUsername] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement | null>(null);

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, [userInput]);


//   useEffect(() => {
//     const fetchUsername = async () => {
//       try {
//         const apiUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
//         const res = await fetch(`${apiUrl}/api/verify-token`, {
//           method: "GET",
//           credentials: "include",
//         });

//         if (res.ok) {
//           const data = await res.json();
//           console.log("Token verification response:", data);
//           setUsername(data.username);
//         } else if (res.status === 401) {
//           router.push("/login");
//         }
//       } catch (err) {
//         console.error("Error verifying token:", err);
//         router.push("/login");
//       }
//     };

//     fetchUsername();
//   }, [router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
    
//       const title = userInput.length > 50 ? userInput.substring(0, 50) + "..." : userInput;
      
//       const requestBody = {
//         title: title,
//         userInput: userInput.trim(),
//         goals: userInput.trim(), // Keep for backward compatibility if needed
//       };

//       console.log("Sending request:", requestBody);

//       const res = await fetch(`${apiUrl}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(requestBody),
//       });

//       const data: ApiResponse = await res.json();
//       console.log("Chat creation response:", data);

//       if (!res.ok) {
//         throw new Error(data.error || `HTTP error! status: ${res.status}`);
//       }

//       // Check for chat ID in response
//       const chatId = data.chatId || data.chat_id || data._id;
      
//       if (chatId) {
//         console.log("Redirecting to chat:", chatId);
//         router.push(`/start/chat/${chatId}`);
//       } else {
//         console.error("No chat ID in response:", data);
//         throw new Error("No chat ID returned from server");
//       }

//     } catch (err) {
//       console.error("Submit failed:", err);
//       setError(err instanceof Error ? err.message : "Failed to create chat");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e as any);
//     }
//   };

//   return (
//     <div
//       className="h-screen w-full flex items-start justify-center px-4 overflow-hidden"
//       style={{ paddingTop: "20%" }}
//     >
//       <div className="text-white w-full max-w-none overflow-hidden" style={{ width: "55%" }}>
//         {username && (
//           <h2 className="font-bold mb-6" style={{ fontSize: "300%" }}>
//             Hi, {username}
//           </h2>
//         )}

//         {error && (
//           <div className="mb-4 p-3 bg-red-600/20 border border-red-600/50 rounded-lg text-red-200 overflow-hidden">
//             {error}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="w-full max-w-3xl mx-auto rounded-2xl px-4 py-2 overflow-hidden"
//           style={{
//             backgroundColor: "#2f2f2f",
//             borderColor: "#2a2a2a",
//           }}
//         >
//           <div className="w-full overflow-hidden">
//             <textarea
//               ref={textareaRef}
//               rows={1}
//               placeholder="Tell me about yourself — your skills, interests, and what kind of career you're aiming for."
//               value={userInput}
//               onChange={(e) => setUserInput(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full bg-transparent text-white placeholder-gray-400 text-base resize-none focus:outline-none px-2 py-2 leading-snug overflow-hidden break-words"
//               style={{ minHeight: "40px" }}
//               disabled={isSubmitting}
//             />
//           </div>

//           <div className="flex justify-between items-center mt-2">
//             <button
//               type="button"
//               onClick={() => console.log("Plus clicked")}
//               className="text-white p-2 hover:bg-gray-700 rounded-md transition-colors"
//               disabled={isSubmitting}
//             >
//               <Plus size={20} />
//             </button>

//             <button
//               type="submit"
//               disabled={isSubmitting || userInput.trim() === ""}
//               className="text-white p-2 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
//             >
//               {isSubmitting ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               ) : (
//                 <Send size={20} />
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }