export interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessageCount: number;
  online: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: number;
  timestamp: string;
}

export interface GroupChat {
  chatId: number;
  chatName: string;
  adminId: number;
  chatType: string;
  chatDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Messages {
  messageId: number;
  content: string;
  senderId: number;
  sentAt: string;
  chatId: number;
  createdAt: string;
  updatedAt: string;
  Files: CustomFile[];
  avatar: string;
}

export interface CustomFile {
  fileId: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document';
  fileName?: string;
}

export interface GalleryState {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
}

export interface MessagePanelProps {
  messages: Messages[];
  newMessage: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onSendMessage: () => void;
  onImageClick: (files: string[], index: number) => void;
  
}

export interface ChatHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface MessageListProps {
  messages: Messages[];
  onImageClick: (files: string[], index: number) => void;
}
