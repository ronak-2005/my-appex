export interface Chat {
  _id: string;
  userId?: string;
  user_id?: string;
  title: string;
  archived?: boolean;
  createdAt?: string;
  created_at?: string;
  messages?: Message[];
  message_count?: number;
  time?: string; // For display purposes
}

export interface Message {
  role: 'user' | 'assistant';
  content?: string;
  text?: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  chats: Chat[];
  total: number;
  has_more: boolean;
}