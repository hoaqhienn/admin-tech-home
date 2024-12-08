import { useRef } from 'react';
import { IconButton, Paper } from '@mui/material';
import { X, Paperclip, File, Video } from 'lucide-react';

interface FileUploadProps {
  files: File[];
  onFileSelect: (files: File[]) => void;
  onFileRemove: (file: File) => void;
}

const FileUpload = (props: FileUploadProps) => {
  const { files, onFileSelect, onFileRemove } = props;
  const fileInputRef: any = useRef(null);

  const handleFileSelect = (event: any) => {
    if (event.target.files) {
      onFileSelect(Array.from(event.target.files));
    }
  };

  const getFilePreview = (file: any) => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="relative w-20 h-20 group">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
          <button
            onClick={() => onFileRemove(file)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    } else if (file.type.startsWith('video/')) {
      return (
        <div className="relative w-20 h-20 bg-gray-100 rounded flex items-center justify-center group">
          <Video className="w-8 h-8 text-gray-500" />
          <button
            onClick={() => onFileRemove(file)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    } else {
      return (
        <div className="relative w-20 h-20 bg-gray-100 rounded flex items-center justify-center group">
          <File className="w-8 h-8 text-gray-500" />
          <button
            onClick={() => onFileRemove(file)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }
  };

  return (
    <Paper className="p-2 mt-2">
      <div className="flex items-center gap-2">
        <IconButton onClick={() => fileInputRef.current?.click()} size="small">
          <Paperclip className="w-5 h-5" />
        </IconButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
          accept="image/*,video/*,application/pdf"
        />
      </div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((file, index) => (
            <div key={index}>{getFilePreview(file)}</div>
          ))}
        </div>
      )}
    </Paper>
  );
};

export default FileUpload;
