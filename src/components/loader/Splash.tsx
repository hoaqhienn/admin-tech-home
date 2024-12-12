import { Box, Stack, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, useEffect, useState } from 'react';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// const rotate = keyframes`
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// `;

// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const LogoContainer = styled(Box)({
  animation: `${pulse} 2s infinite ease-in-out`,
  width: 150, // Tăng kích thước để phù hợp với ảnh
  height: 150,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden', // Để crop ảnh nếu cần
});

const LogoImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain', // hoặc 'cover' tùy theo nhu cầu
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

// const SpinnerRing = styled(Box)(({ theme }) => ({
//   width: 60,
//   height: 60,
//   border: `4px solid ${theme.palette.grey[200]}`,
//   borderTop: `4px solid ${theme.palette.primary.main}`,
//   borderRadius: '50%',
//   animation: `${rotate} 1s linear infinite`,
// }));

// const LoadingText = styled(Typography)({
//   animation: `${fadeIn} 1s ease-out`,
//   marginTop: 20,
// });

interface SplashProps {
  message?: string;
  minDuration?: number;
  maxDuration?: number;
  onFinish?: () => void;
  isLoading?: boolean;
  // Thêm các props cho ảnh
  logoSrc?: string; // URL hoặc đường dẫn của ảnh
  logoAlt?: string; // Alt text cho ảnh
  logoWidth?: number; // Chiều rộng tùy chỉnh
  logoHeight?: number; // Chiều cao tùy chỉnh
  logoFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const Splash: FC<SplashProps> = ({
  // message = 'Loading...',
  minDuration = 2000,
  maxDuration = 5000,
  onFinish,
  isLoading = false,
  logoSrc,
  logoAlt = 'Logo',
  logoWidth = 150,
  logoHeight = 150,
  logoFit = 'contain',
}) => {
  const [show, setShow] = useState(true);
  const [fadeOutStart, setFadeOutStart] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const minTimer = setTimeout(() => {
      if (!isLoading) {
        setFadeOutStart(true);
      }
    }, minDuration);

    const maxTimer = setTimeout(() => {
      setFadeOutStart(true);
    }, maxDuration);

    let fadeOutTimer: NodeJS.Timeout | undefined;
    if (fadeOutStart) {
      fadeOutTimer = setTimeout(() => {
        setShow(false);
        if (onFinish) onFinish();
      }, 1000);
    }

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      if (fadeOutTimer) clearTimeout(fadeOutTimer);
    };
  }, [minDuration, maxDuration, isLoading, fadeOutStart, onFinish]);

  if (!show) return null;

  return (
    <Stack
      direction={'column'}
      alignItems="center"
      justifyContent="center"
      width={1}
      height="100vh"
      spacing={3}
      sx={{
        background: (theme) =>
          `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        animation: fadeOutStart ? `${fadeOut} 1s ease-out forwards` : 'none',
      }}
    >
      <LogoContainer
        sx={{
          width: logoWidth,
          height: logoHeight,
        }}
      >
        {logoSrc && !imageError ? (
          <LogoImage
            src={logoSrc}
            alt={logoAlt}
            onError={() => setImageError(true)}
            sx={{
              objectFit: logoFit,
            }}
          />
        ) : (
          // Fallback box khi không có ảnh hoặc ảnh lỗi
          <Box
            sx={{
              width: logoWidth * 0.5,
              height: logoHeight * 0.5,
              borderRadius: '12px',
              bgcolor: 'white',
              boxShadow: 3,
            }}
          />
        )}
      </LogoContainer>

      {/* <Box position="relative" display="flex" justifyContent="center" alignItems="center">
        <SpinnerRing />
      </Box>

      <LoadingText
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 'light',
          letterSpacing: 2,
        }}
      >
        {message}
      </LoadingText> */}
    </Stack>
  );
};

export default Splash;
