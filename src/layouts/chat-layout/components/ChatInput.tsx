import React, { useRef, ChangeEvent, useCallback, useMemo } from 'react';
import { TextField, IconButton, InputAdornment, Box, Chip, Stack } from '@mui/material';
import { Camera, Paperclip, Video, Send } from 'lucide-react';
import {
  ALLOWED_FILE_TYPES,
  ChatInputProps,
  FileTypeConfig,
  FileUploadData,
  FileValidationResult,
  MAX_FILE_SIZE,
} from 'interface/chat/ChatInterface';

const validateFile = (file: File): FileValidationResult => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File ${file.name} exceeds ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB limit`,
    };
  }

  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  const mimeType = file.type.toLowerCase();

  // Check each file type category
  for (const [category, config] of Object.entries(ALLOWED_FILE_TYPES)) {
    const isValidMimeType = config.mimeTypes.includes(mimeType);
    const isValidExtension = config.extensions.includes(fileExtension);

    // If either MIME type or extension matches, consider it valid
    if (isValidMimeType || isValidExtension) {
      return {
        valid: true,
        type: category as keyof FileTypeConfig,
      };
    }
  }

  return {
    valid: false,
    error: `Unsupported file type: ${file.name}`,
  };
};

const convertBrowserFileToFileUploadData = (file: File): FileUploadData => {
  return {
    fileName: file.name,
    fileType: file.type.split('/')[0], // 'image', 'video', 'application'
    size: file.size,
    file: file,
    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  };
};

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  files,
  onFileSelect,
  onFileRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const browserFiles = Array.from(event.target.files || []);
      const validatedFiles: FileUploadData[] = [];
      const errors: string[] = [];

      browserFiles.forEach((file) => {
        const validation = validateFile(file);
        if (validation.valid && validation.type) {
          validatedFiles.push(convertBrowserFileToFileUploadData(file));
        } else if (validation.error) {
          errors.push(validation.error);
        }
      });

      if (errors.length) {
        console.error('File validation errors:', errors.join(', '));
      }

      if (validatedFiles.length) {
        onFileSelect(validatedFiles);
      }

      // Reset input
      event.target.value = '';
    },
    [onFileSelect],
  );

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const triggerFileInput = useCallback((inputType: 'camera' | 'video' | 'file') => {
    if (!fileInputRef.current) return;

    const getAcceptString = (type: 'camera' | 'video' | 'file'): string => {
      if (type === 'camera') {
        const { mimeTypes, extensions } = ALLOWED_FILE_TYPES.image;
        return [...mimeTypes, ...extensions].join(',');
      }
      if (type === 'video') {
        const { mimeTypes, extensions } = ALLOWED_FILE_TYPES.video;
        return [...mimeTypes, ...extensions].join(',');
      }
      // For 'file', include all accepted types
      return Object.values(ALLOWED_FILE_TYPES)
        .flatMap((config) => [...config.mimeTypes, ...config.extensions])
        .join(',');
    };

    fileInputRef.current.accept = getAcceptString(inputType);
    fileInputRef.current.click();
  }, []);

  const formatFileSize = useMemo(
    () =>
      (size: number): string => {
        const units = ['B', 'KB', 'MB'];
        let value = size;
        let unitIndex = 0;

        while (value >= 1024 && unitIndex < units.length - 1) {
          value /= 1024;
          unitIndex++;
        }

        return `${value.toFixed(1)} ${units[unitIndex]}`;
      },
    [],
  );

  const getFileIcon = (file: FileUploadData) => {
    switch (file.fileType) {
      case 'image':
        return <Camera className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <Paperclip className="w-4 h-4" />;
    }
  };

  return (
    <Box className="p-4 bg-white border-t">
      {files.length > 0 && (
        <Stack direction="row" spacing={1} className="mb-2 flex-wrap gap-2">
          {files.map((file, index) => (
            <Chip
              key={`${file.fileName}-${index}`}
              icon={getFileIcon(file)}
              label={`${file.fileName} (${formatFileSize(file.size)})`}
              onDelete={() => onFileRemove(file)}
              className="bg-blue-50"
            />
          ))}
        </Stack>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        multiple
        accept={Object.values(ALLOWED_FILE_TYPES).flat().join(',')}
      />

      <TextField
        variant="outlined"
        placeholder="Type a message"
        value={newMessage}
        onChange={onMessageChange}
        onKeyPress={onKeyPress}
        multiline
        maxRows={4}
        fullWidth
        className="bg-white"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <div className="flex space-x-2">
                <IconButton
                  onClick={() => triggerFileInput('file')}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <Paperclip className="w-5 h-5" />
                </IconButton>
                <IconButton
                  onClick={() => triggerFileInput('camera')}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <Camera className="w-5 h-5" />
                </IconButton>
                <IconButton
                  onClick={() => triggerFileInput('video')}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <Video className="w-5 h-5" />
                </IconButton>
                <IconButton
                  onClick={onSendMessage}
                  className="text-blue-500 hover:text-blue-600"
                  disabled={!newMessage.trim() && files.length === 0}
                >
                  <Send className="w-5 h-5" />
                </IconButton>
              </div>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default React.memo(ChatInput);
