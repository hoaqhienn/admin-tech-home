import { useState } from 'react';
import { Box, Typography, Link, Modal } from '@mui/material';
import { File as FileIcon, Image as ImageIcon, FileText, Video } from 'lucide-react';

// File preview modal component
const FilePreviewModal = ({
  open,
  onClose,
  url,
}: {
  open: boolean;
  onClose: () => void;
  url: string;
}) => (
  <Modal open={open} onClose={onClose} className="flex items-center justify-center">
    <Box className="outline-none max-w-[90vw] max-h-[90vh]">
      <img src={url} alt="Preview" className="max-w-full max-h-[90vh] object-contain" />
    </Box>
  </Modal>
);

// File attachment component
const FileAttachment = ({
  file,
}: {
  file: {
    fileId: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
  };
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const getFileIcon = () => {
    switch (file.fileType) {
      case 'image':
        return <ImageIcon size={20} />;
      case 'video':
        return <Video size={20} />;
      case 'document':
      case 'text':
        return <FileText size={20} />;
      default:
        return <FileIcon size={20} />;
    }
  };

  if (file.fileType === 'image') {
    return (
      <>
        <Box
          className="cursor-pointer max-w-[200px] rounded-lg overflow-hidden"
          onClick={() => setPreviewOpen(true)}
        >
          <img src={file.fileUrl} alt={file.fileName} className="w-full h-full object-cover" />
        </Box>
        <FilePreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          url={file.fileUrl}
        />
      </>
    );
  }

  return (
    <Link href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
      <Box className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors">
        {getFileIcon()}
        <Typography variant="body2" className="text-gray-700">
          {file.fileName}
        </Typography>
      </Box>
    </Link>
  );
};

export default FileAttachment;
