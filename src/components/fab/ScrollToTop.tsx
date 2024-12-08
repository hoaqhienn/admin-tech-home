import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material';
import { styled } from '@mui/system';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
}));

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <ScrollToTopButton
          color="primary"
          size="large"
          onClick={handleScrollToTop}
          aria-label="scroll to top"
        >
          <ChevronUp />
        </ScrollToTopButton>
      )}
    </>
  );
};

export default ScrollToTop;
