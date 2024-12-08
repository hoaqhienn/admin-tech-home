import React, { useCallback, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { VideoPlayer } from './VideoPlayer';
import { PdfViewer } from './PdfViewer';
import { CustomFile } from 'interface/chat/ChatInterface';
import { ChevronLeft, ChevronRight } from 'lucide-react';


interface ImageGalleryProps {
  files: CustomFile[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  files,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      else if (e.key === 'ArrowRight')
        setCurrentIndex((prev) => (prev < files.length - 1 ? prev + 1 : prev));
      else if (e.key === 'Escape') onClose();
    },
    [files.length, onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex items-center justify-center relative">
      <IconButton
        onClick={() => setCurrentIndex((prev) => prev - 1)}
        disabled={currentIndex === 0}
        className="absolute left"
      >
        <ChevronLeft />
      </IconButton>

      {files[currentIndex].fileType === 'image' ? (
        <img
          src={files[currentIndex].fileUrl}
          alt={`File ${currentIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          loading="lazy"
        />
      ) : files[currentIndex].fileType === 'video' ? (
        <VideoPlayer
          src={files[currentIndex].fileUrl}
          className="max-h-[90vh] max-w-[90vw] rounded-lg"
        />
      ) : files[currentIndex].fileType === 'document' ? (
        <PdfViewer
          pdfUrl={files[currentIndex].fileUrl}
          className="max-h-[90vh] max-w-[90vw] rounded-lg"
        />
      ) : null}

      <IconButton
        onClick={() => setCurrentIndex((prev) => prev + 1)}
        disabled={currentIndex === files.length - 1}
        className="absolute right"
      >
        <ChevronRight />
      </IconButton>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white">
        {currentIndex + 1} / {files.length}
      </div>
    </div>
  );
};