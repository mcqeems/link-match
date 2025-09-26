// Types for messaging components

export interface User {
  id: string;
  name: string;
  email: string;
  image_url: string | null;
  profile?: {
    headline: string | null;
  } | null;
  roles?: {
    name: string;
  } | null;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: string;
  content: string;
  created_at: Date | string | null;
  User: {
    id: string;
    name: string;
    image_url: string | null;
  };
}

export interface ConversationParticipant {
  conversation_id: number;
  user_id: string;
  User: User;
}

export interface Conversation {
  id: number;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  conversation_participants: ConversationParticipant[];
  messages?: Message[];
  otherParticipant?: User | null;
  lastMessage?: Message | null;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}
