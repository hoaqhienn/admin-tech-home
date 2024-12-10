import { ChangeEvent } from 'react';

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
export interface GalleryState {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
}

export interface MessagePanelProps {
  messages: Messages[];
  newMessage: string;
  onMessageChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onSendMessage: () => void;
  onImageClick: (files: string[], index: number) => void;
  files: File[];
  onFileSelect: (files: File[]) => void;
  onFileRemove: (file: File) => void;
}

export interface ChatHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface MessageListProps {
  messages: Messages[];
  onImageClick: (files: string[], index: number) => void;
}

export interface CustomFile {
  fileId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  file?: File; // For client-side handling
  size: number;
  preview?: string; // For image previews
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  type?: string;
}

export interface ChatInputProps {
  newMessage: string;
  onMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onSendMessage: () => void;
  files: FileUploadData[]; // Use FileUploadData for files being uploaded
  onFileSelect: (files: FileUploadData[]) => void;
  onFileRemove: (file: FileUploadData) => void;
}

export interface FileTypeConfig {
  image: {
    mimeTypes: string[];
    extensions: string[];
  };
  video: {
    mimeTypes: string[];
    extensions: string[];
  };
  document: {
    mimeTypes: string[];
    extensions: string[];
  };
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_FILE_TYPES: FileTypeConfig = {
  image: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
  video: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    extensions: ['.mp4', '.webm', '.mov'],
  },
  document: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    extensions: ['.pdf', '.doc', '.docx'],
  },
};

export interface FileUploadData {
  fileName: string;
  fileType: string;
  size: number;
  file: File;
  preview?: string;
}

export type FileType = 'image' | 'video' | 'document';
