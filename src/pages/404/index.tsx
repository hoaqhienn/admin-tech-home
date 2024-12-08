import { Button, Container, Typography } from '@mui/material';
import { ArrowLeft, Box } from 'lucide-react';

const NotFound = () => {
  return (
    <Container className="min-h-screen flex items-center justify-center text-center">
      <Box className="py-16 px-4">
        <Typography className="text-9xl font-bold text-gray-200">404</Typography>

        <Typography className="mt-4 text-3xl font-semibold text-gray-700">
          Page Not Found
        </Typography>

        <Typography className="mt-4 text-lg text-gray-600">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </Typography>

        <Button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
          Go Back
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
