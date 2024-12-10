import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
  Paper,
  Stack,
  Chip,
  InputAdornment,
  styled,
} from '@mui/material';
import { Send, Paperclip, File as FileIcon } from 'lucide-react';
import { useSendMessageMutation } from 'api/chatApi';

// Styled components using MUI's styled API
const InputWrapper = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const FilePreviewWrapper = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const FileChip = styled(Chip)(({ theme }) => ({
  maxWidth: '100%',
  '& .MuiChip-label': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const MessageInput = ({ chatId }: { chatId: number | null }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatId || (!message.trim() && files.length === 0)) return;
    console.log('Sending message:', message, files);

    try {
      await sendMessage({
        chatId,
        message: message.trim(),
        files: files,
      }).unwrap();

      setMessage('');
      setFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      const fileType = file.type.split('/')[0];
      const isValidType = ['image', 'video', 'document', 'application', 'text'].includes(fileType);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were skipped due to invalid type or size (max 5MB)');
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!chatId) return null;

  return (
    <InputWrapper elevation={3}>
      {/* File Upload Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        style={{ display: 'none' }}
        accept="image/*,video/*,.doc,.docx,.pdf,.txt"
      />

      {/* File Previews */}
      {files.length > 0 && (
        <FilePreviewWrapper direction="row" flexWrap="wrap">
          {files.map((file, index) => (
            <FileChip
              key={index}
              icon={<FileIcon size={16} />}
              label={
                <Typography noWrap variant="body2" component="span">
                  {file.name} ({formatFileSize(file.size)})
                </Typography>
              }
              onDelete={() => removeFile(index)}
              variant="outlined"
              sx={{ maxWidth: 250 }}
            />
          ))}
        </FilePreviewWrapper>
      )}

      {/* Message Input Form */}
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  size="small"
                  color="primary"
                  sx={{ ml: -1 }}
                >
                  <Paperclip size={20} />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="submit"
                  disabled={isLoading || (!message.trim() && files.length === 0)}
                  color="primary"
                  size="small"
                  sx={{ mr: -1 }}
                >
                  {isLoading ? <CircularProgress size={20} /> : <Send size={20} />}
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              '&.Mui-focused': {
                boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}1A`,
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
            },
          }}
        />
      </Box>
    </InputWrapper>
  );
};

export default MessageInput;
