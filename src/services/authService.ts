import { api } from 'apis';

interface LoginResponse {
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response: any = await api.post<LoginResponse>('/admin/sign-in', data);
    localStorage.setItem('_token', JSON.stringify(response.token));
    return response.token;
  } catch (error: any) {
    console.error('Error logging in:', error);

    // Check if the error is from the API
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);

      // Throw a custom error with the server response details
      throw new Error(
        `API request failed with status code ${error.response.status}: ${error.response.data.message}`,
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from the server');
    } else {
      // Something else happened in making the request
      console.error('Error setting up the request:', error.message);
      throw new Error('Error setting up the API request');
    }
  }
};

export const logoutUser = async () => {
  localStorage.removeItem('_token');
};
