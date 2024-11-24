import React from 'react';

interface PdfViewerProps {
  pdfUrl: string;
  className?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, className }) => {
  return (
    <iframe
      src={`https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`}
      className={className}
      frameBorder="0"
    />
  );
};