"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Archive, Plus, User, Bot, MoreHorizontal, Trash2, Settings, LogOut } from "lucide-react";
import { Chat } from '@/types/chat';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMain,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";

interface SideNavProps {
  chats?: Chat[];
  onNewChat?: () => void;
  onArchive?: () => void;
  onChatSelect?: (chatId: string) => void;
  onProfile?: () => void;
  onLogout?: () => void;
  onChatArchive?: (chatId: string) => void;
  onChatDelete?: (chatId: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({
  chats = [],
  onNewChat = () => console.log("New chat clicked"),
  onArchive = () => console.log("Archive clicked"),
  onChatSelect = (chatId: string) => console.log("Chat selected:", chatId),
  onProfile = () => console.log("Profile clicked"),
  onLogout = () => {},
  onChatArchive = (chatId: string) => console.log("Archive chat:", chatId),
  onChatDelete = (chatId: string) => console.log("Delete chat:", chatId),
}) => {
  const { isOpen } = useSidebar();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container') && !target.closest('.dropdown-trigger')) {
        setOpenDropdown(null);
        setUserDropdownOpen(false);
      }
    };

    if (openDropdown || userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown, userDropdownOpen]);

  const handleDropdownToggle = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenDropdown(prev => prev === chatId ? null : chatId);
  };

  const handleChatAction = (action: 'archive' | 'delete', chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (action === 'archive') {
      onChatArchive(chatId);
    } else {
      onChatDelete(chatId);
    }
    setOpenDropdown(null);
  };

  const handleUserDropdownToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setUserDropdownOpen(prev => !prev);
  };

  const handleUserAction = (action: 'settings' | 'profile' | 'logout', event: React.MouseEvent) => {
    event.stopPropagation();
    if (action === 'profile') {
      onProfile();
    } else if (action === 'logout') {
      onLogout();
    } else {
      console.log('Settings clicked');
    }
    setUserDropdownOpen(false);
  };

  return (
    <SidebarContent className="bg-gray-900">
      {/* Header */}
      <SidebarHeader className="flex items-center justify-between bg-gray-900">
        {isOpen ? (
          <>
            <div className="flex items-center gap-2">
              <Bot size={24} />
            </div>
            <SidebarTrigger />
          </>
        ) : (
          <div className="w-full flex flex-col items-center group relative">
            <Bot size={24} style={{ color: "#9333ea" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <SidebarTrigger variant="logo-hover" />
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* Main - Always render but conditionally show content */}
      <SidebarMain className="flex-1 overflow-hidden px-4 flex flex-col">
        {isOpen && (
          <>
            <div className="flex-shrink-0 mb-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    variant="purple"
                    onClick={onNewChat}
                    className="flex items-center gap-2 px-3"
                  >
                    <Plus size={20} />
                    <span className="text-lg font-bold">New Chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={onArchive} className="px-3">
                    <Archive size={18}/>
                    <span>Archive</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <hr/>

            <div className="mt-6 flex-1 flex flex-col min-h-0">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex-shrink-0">
                Recent Chats
              </h3>
              <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="text-gray-400 text-sm">No chats found.</div>
                ) : (
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <SidebarMenuItem key={chat._id} className="relative">
                        <div 
                          className="group relative rounded-lg transition-colors"
                          style={{ backgroundColor: 'transparent' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2a2a2a';
                          }}
                          onMouseLeave={(e) => {
                            if (openDropdown !== chat._id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <div className="flex items-center relative">
                            <div 
                              className="flex-1 cursor-pointer py-2 px-2"
                              onClick={() => onChatSelect(chat._id)}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <span className="text-sm truncate w-full text-white">
                                  {chat.title}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 ml-0 italic">
                                {chat.time}
                              </span>
                            </div>
                            
                            {/* Three dots menu - visible on hover */}
                            <div className="flex-shrink-0 px-2">
                              <button
                                className="dropdown-trigger p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                                style={{ 
                                  opacity: openDropdown === chat._id ? '1' : '0',
                                  transition: 'opacity 0.2s ease'
                                }}
                                onClick={(e) => handleDropdownToggle(chat._id, e)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = '1';
                                }}
                                ref={(el) => {
                                  if (el) {
                                    const parent = el.closest('.group');
                                    if (parent) {
                                      const showButton = () => {
                                        if (openDropdown !== chat._id) {
                                          el.style.opacity = '1';
                                        }
                                      };
                                      const hideButton = () => {
                                        if (openDropdown !== chat._id) {
                                          el.style.opacity = '0';
                                        }
                                      };
                                      
                                      parent.addEventListener('mouseenter', showButton);
                                      parent.addEventListener('mouseleave', hideButton);
                                      
                                      return () => {
                                        parent.removeEventListener('mouseenter', showButton);
                                        parent.removeEventListener('mouseleave', hideButton);
                                      };
                                    }
                                  }
                                }}
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </div>
                          
                          {/* Dropdown menu */}
                          {openDropdown === chat._id && (
                            <div 
                              className="dropdown-container absolute left-2 top-full mt-1 w-32 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="py-1">
                                <button
                                  onClick={(e) => handleChatAction('archive', chat._id, e)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                  <Archive size={14} />
                                  Archive
                                </button>
                                <button
                                  onClick={(e) => handleChatAction('delete', chat._id, e)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </SidebarMenuItem>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SidebarMain>

      {/* Footer - This will stick to bottom */}
      <SidebarFooter className="px-4 py-3 relative">
        {isOpen ? (
          <div className="relative">
            <button
              className="dropdown-trigger w-full flex items-center gap-2 py-2 rounded-lg transition-colors text-left"
              style={{ color: '#9333ea' }}
              onClick={handleUserDropdownToggle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <User size={23} />
              <span className="text-lg font-bold">User</span>
            </button>
            
            {/* User dropdown menu */}
            {userDropdownOpen && (
              <div 
                className="dropdown-container absolute w-full bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50"
                style={{
                  bottom: '100%',
                  left: '0',
                  marginBottom: '8px'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-1">
                  <button
                    onClick={(e) => handleUserAction('settings', e)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Settings size={14} />
                    Settings
                  </button>
                  <button
                    onClick={(e) => handleUserAction('profile', e)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <User size={14} />
                    Profile
                  </button>
                  <button
                    onClick={(e) => handleUserAction('logout', e)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <button
              onClick={onProfile}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-700"
            >
              <User size={18} />
            </button>
          </div>
        )}
      </SidebarFooter>
    </SidebarContent>
  );
};

export default SideNav;

// "use client";

// import React, { useState, useEffect } from "react";
// import { MessageCircle, Archive, Plus, User, Bot, MoreHorizontal, Trash2 } from "lucide-react";
// import { Chat } from '@/types/chat';

// import {
//   SidebarContent,
//   SidebarHeader,
//   SidebarMain,
//   SidebarFooter,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarTrigger,
//   useSidebar,
// } from "./ui/sidebar";

// interface SideNavProps {
//   chats?: Chat[];
//   onNewChat?: () => void;
//   onArchive?: () => void;
//   onChatSelect?: (chatId: string) => void;
//   onProfile?: () => void;
//   onLogout?: () => void;
//   onChatArchive?: (chatId: string) => void;
//   onChatDelete?: (chatId: string) => void;
// }

// const SideNav: React.FC<SideNavProps> = ({
//   chats = [],
//   onNewChat = () => console.log("New chat clicked"),
//   onArchive = () => console.log("Archive clicked"),
//   onChatSelect = (chatId: string) => console.log("Chat selected:", chatId),
//   onProfile = () => console.log("Profile clicked"),
//   onLogout = () => {},
//   onChatArchive = (chatId: string) => console.log("Archive chat:", chatId),
//   onChatDelete = (chatId: string) => console.log("Delete chat:", chatId),
// }) => {
//   const { isOpen } = useSidebar();
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest('.dropdown-container') && !target.closest('.dropdown-trigger')) {
//         setOpenDropdown(null);
//       }
//     };

//     if (openDropdown) {
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => document.removeEventListener('mousedown', handleClickOutside);
//     }
//   }, [openDropdown]);

//   const handleDropdownToggle = (chatId: string, event: React.MouseEvent) => {
//     event.stopPropagation();
//     event.preventDefault();
//     setOpenDropdown(prev => prev === chatId ? null : chatId);
//   };

//   const handleChatAction = (action: 'archive' | 'delete', chatId: string, event: React.MouseEvent) => {
//     event.stopPropagation();
//     if (action === 'archive') {
//       onChatArchive(chatId);
//     } else {
//       onChatDelete(chatId);
//     }
//     setOpenDropdown(null);
//   };

//   return (
//     <SidebarContent className="bg-gray-900">
//       {/* Header */}
//       <SidebarHeader className="flex items-center justify-between bg-gray-900">
//         {isOpen ? (
//           <>
//             <div className="flex items-center gap-2">
//               <Bot size={24} />
//             </div>
//             <SidebarTrigger />
//           </>
//         ) : (
//           <div className="w-full flex flex-col items-center group relative">
//             <Bot size={24} style={{ color: "#9333ea" }} />
//             <div className="absolute inset-0 flex items-center justify-center">
//               <SidebarTrigger variant="logo-hover" />
//             </div>
//           </div>
//         )}
//       </SidebarHeader>

//       {/* Main - Always render but conditionally show content */}
//       <SidebarMain className="flex-1 overflow-hidden px-4 flex flex-col">
//         {isOpen && (
//           <>
//             <div className="flex-shrink-0 mb-4">
//               <SidebarMenu>
//                 <SidebarMenuItem>
//                   <SidebarMenuButton
//                     variant="purple"
//                     onClick={onNewChat}
//                     className="flex items-center gap-2 px-2"
//                   >
//                     <Plus size={20} />
//                     <span className="text-lg font-bold">New Chat</span>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//                 <SidebarMenuItem>
//                   <SidebarMenuButton 
//                       onClick={onArchive}
//                       className="px-2"
//                   >
//                     <Archive size={18}/>
//                     <span>Archive</span>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               </SidebarMenu>
//             </div>

//             <hr/>

//             <div className="mt-6 flex-1 flex flex-col min-h-0">
//               <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex-shrink-0">
//                 Recent Chats
//               </h3>
//               <div className="flex-1 overflow-y-auto">
//                 {chats.length === 0 ? (
//                   <div className="text-gray-400 text-sm">No chats found.</div>
//                 ) : (
//                   <div className="space-y-1">
//                     {chats.map((chat) => (
//                       <SidebarMenuItem key={chat._id} className="relative">
//                         <div 
//                           className="group relative rounded-lg transition-colors"
//                           style={{ backgroundColor: 'transparent' }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.backgroundColor = '#2a2a2a';
//                           }}
//                           onMouseLeave={(e) => {
//                             if (openDropdown !== chat._id) {
//                               e.currentTarget.style.backgroundColor = 'transparent';
//                             }
//                           }}
//                         >
//                           <div className="flex items-center relative">
//                             <div 
//                               className="flex-1 cursor-pointer py-2 px-2"
//                               onClick={() => onChatSelect(chat._id)}
//                             >
//                               <div className="flex items-center gap-2 w-full">
//                                 <span className="text-sm truncate w-full text-white">
//                                   {chat.title}
//                                 </span>
//                               </div>
//                               <span className="text-xs text-gray-500 ml-0 italic">
//                                 {chat.time}
//                               </span>
//                             </div>
                            
//                             {/* Three dots menu - visible on hover */}
//                             <div className="flex-shrink-0 px-2">
//                               <button
//                                 className="dropdown-trigger p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
//                                 style={{ 
//                                   opacity: openDropdown === chat._id ? '1' : '0',
//                                   transition: 'opacity 0.2s ease'
//                                 }}
//                                 onClick={(e) => handleDropdownToggle(chat._id, e)}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.opacity = '1';
//                                 }}
//                                 ref={(el) => {
//                                   if (el) {
//                                     const parent = el.closest('.group');
//                                     if (parent) {
//                                       const showButton = () => {
//                                         if (openDropdown !== chat._id) {
//                                           el.style.opacity = '1';
//                                         }
//                                       };
//                                       const hideButton = () => {
//                                         if (openDropdown !== chat._id) {
//                                           el.style.opacity = '0';
//                                         }
//                                       };
                                      
//                                       parent.addEventListener('mouseenter', showButton);
//                                       parent.addEventListener('mouseleave', hideButton);
                                      
//                                       return () => {
//                                         parent.removeEventListener('mouseenter', showButton);
//                                         parent.removeEventListener('mouseleave', hideButton);
//                                       };
//                                     }
//                                   }
//                                 }}
//                               >
//                                 <MoreHorizontal size={16} />
//                               </button>
//                             </div>
//                           </div>
                          
//                           {/* Dropdown menu */}
//                           {openDropdown === chat._id && (
//                             <div 
//                               className="dropdown-container absolute left-2 top-full mt-1 w-32 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               <div className="py-1">
//                                 <button
//                                   onClick={(e) => handleChatAction('archive', chat._id, e)}
//                                   className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
//                                 >
//                                   <Archive size={14} />
//                                   Archive
//                                 </button>
//                                 <button
//                                   onClick={(e) => handleChatAction('delete', chat._id, e)}
//                                   className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
//                                 >
//                                   <Trash2 size={14} />
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </SidebarMenuItem>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </SidebarMain>

//       {/* Footer - This will stick to bottom */}
//       <SidebarFooter className="px-4 py-3">
//         {isOpen ? (
//           <SidebarMenuButton
//             variant="purple"
//             className="flex items-center gap-2 px-2"
//             onClick={onProfile}
//           >
//             <User size={23} />
//             <span className="text-lg font-bold">User</span>
//           </SidebarMenuButton>
//         ) : (
//           <div className="flex justify-center w-full">
//             <button
//               onClick={onProfile}
//               className="p-2 rounded-md text-gray-500 hover:bg-gray-700"
//             >
//               <User size={18} />
//             </button>
//           </div>
//         )}
//       </SidebarFooter>
//     </SidebarContent>
//   );
// };

// export default SideNav;