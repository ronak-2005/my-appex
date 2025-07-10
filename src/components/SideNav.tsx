"use client";

import React from "react";
import { MessageCircle, Archive, Plus, User, Bot } from "lucide-react";

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

interface Chat {
  id: string;
  title: string;
  time: string;
}

interface SideNavProps {
  chats?: Chat[];
  onNewChat?: () => void;
  onArchive?: () => void;
  onChatSelect?: (chatId: string) => void;
  onProfile?: () => void;
  onLogout?: () => void;
}

const SideNav: React.FC<SideNavProps> = ({
  chats = [],
  onNewChat = () => console.log("New chat clicked"),
  onArchive = () => console.log("Archive clicked"),
  onChatSelect = (chatId: string) => console.log("Chat selected:", chatId),
  onProfile = () => console.log("Profile clicked"),
  onLogout = () => {},
}) => {
  const { isOpen } = useSidebar();

  return (
    <SidebarContent className="bg-gray-900">
      {/* Header */}
      <SidebarHeader className="flex items-center justify-between px-4 py-3 bg-gray-900">
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

      {/* Main - This will take up remaining space */}
      {isOpen && (
        <SidebarMain className="flex-1 overflow-hidden px-4 flex flex-col">
          <div className="flex-shrink-0 mb-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  variant="purple"
                  onClick={onNewChat}
                  className="flex items-center gap-2"
                >
                  <Plus size={20} />
                  <span className="text-lg font-bold">New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onArchive}>
                  <Archive size={18} />
                  <span>Archive</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

           <hr/>

          <div className="mt-6 flex-1 flex flex-col min-h-screen">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex-shrink-0">
              Recent Chats
            </h3>
            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 ? (
                <div className="text-gray-400 text-sm">No chats found.</div>
              ) : (
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        className="flex-col items-start gap-1 h-auto py-2"
                        onClick={() => onChatSelect(chat.id)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <MessageCircle size={16} />
                          <span className="text-sm truncate w-full">
                            {chat.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 ml-6 italic">
                          {chat.time}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SidebarMain>
      )}

      {/* Footer - This will stick to bottom */}
      <SidebarFooter className="px-4 py-3">
        {isOpen ? (
          <SidebarMenuButton
            variant="purple"
            className="flex items-center gap-2"
            onClick={onProfile}
          >
            <User size={23} />
            <span className="text-lg font-bold">User</span>
          </SidebarMenuButton>
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