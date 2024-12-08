import { Card } from '@mui/material';
import React, { useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  // Add other message properties as needed
}

interface MessagePanelProps {
  messages: Message[];
  newMessage: string;
  onMessageChange: (message: string) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  onSendMessage: () => void;
  onImageClick: (imageUrl: string) => void;
  onFileSelect: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'application/pdf',
]);

const MessagePanel: React.FC<MessagePanelProps> = ({
  messages,
  newMessage,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  onImageClick,
  onFileSelect,
  onFileRemove,
}) => {
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File ${file.name} exceeds 5MB limit`,
      };
    }

    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return {
        isValid: false,
        error: `File ${file.name} has invalid type: ${file.type}`,
      };
    }

    return { isValid: true };
  };

  const handleFileSelect = useCallback(
    (selectedFiles: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      selectedFiles.forEach((file) => {
        const { isValid, error } = validateFile(file);
        if (isValid) {
          validFiles.push(file);
        } else if (error) {
          errors.push(error);
        }
      });

      // Log all errors together
      if (errors.length > 0) {
        console.error('File validation errors:', errors);
      }

      onFileSelect(validFiles);
    },
    [onFileSelect],
  );

  return (
    <Card className="flex flex-col justify-end h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-y-auto bg-white">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} onImageClick={onImageClick} />
      </div>
      <div className="p-4 border-t">
        <ChatInput
          value={newMessage}
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          onSend={onSendMessage}
          onFileSelect={handleFileSelect}
          onFileRemove={onFileRemove}
        />
      </div>
    </Card>
  );
};

// Type for MessageList component
interface MessageListProps {
  messages: Message[];
  onImageClick: (imageUrl: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <div key={message.id} className="break-words">
          {message.content}
        </div>
      ))}
    </div>
  );
};

// Type for ChatInput component
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  onSend: () => void;
  onFileSelect: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSend,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
      />
      <button
        onClick={onSend}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </div>
  );
};

export default MessagePanel;
