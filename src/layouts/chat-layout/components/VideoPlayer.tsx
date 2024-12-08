import React from 'react';

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className }) => {
  return (
    <video src={src} className={className} controls>
      Your browser does not support the video tag.
    </video>
  );
};