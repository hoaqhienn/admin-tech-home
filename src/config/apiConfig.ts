// config/apiConfig.ts
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query';

interface ApiConfig {
  baseUrl: string;
  endpoints: {
    auth: string;
    admin: string;
    chat: string;
    socket: string;
    advertisement: string;
  };
}

// API configurations for different environments
const apiConfigs: Record<string, ApiConfig> = {
  development: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://api.techhomeapt.site/api',
    endpoints: {
      auth: '/admin',
      admin: '/admin',
      chat: '/chat',
      advertisement: '/advertisement',
      socket: '', 
    },
  },
  production: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://api.techhomeapt.site/api',
    endpoints: {
      auth: '/admin',
      admin: '/admin',
      chat: '/chat',
      advertisement: '/advertisement',
      socket: '',
    },
  },
  staging: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://api.techhomeapt.site/api',
    endpoints: {
      auth: '/admin',
      admin: '/admin',
      chat: '/chat',
      advertisement: '/advertisement',
      socket: '',
    },
  },
};

// Get current configuration based on environment
export const getCurrentConfig = (): ApiConfig => {
  const env = import.meta.env.MODE;
  return apiConfigs[env] || apiConfigs.development;
};

// Create dynamic base query with error handling
export const createBaseQuery = (endpoint: keyof ApiConfig['endpoints']) => {
  const config = getCurrentConfig();
  const baseUrl = `${config.baseUrl}${config.endpoints[endpoint]}`;

  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const baseQueryWithErrorHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    try {
      const result = await baseQuery(args, api, extraOptions);

      if (result.error) {
        // Handle authentication errors
        if (result.error.status === 401 || result.error.status === 403) {
          localStorage.removeItem('_email');
          localStorage.removeItem('_token');
          localStorage.removeItem('_longToken');
        }
      }
      return result;
    } catch (error) {
      console.error('API Error:', error);
      return { error: { status: 500, data: error } as FetchBaseQueryError };
    }
  };

  return baseQueryWithErrorHandling;
};

// Base API configuration for RTK Query
export const createBaseApi = (endpoint: keyof ApiConfig['endpoints']) => {
  // Validate endpoint
  if (!endpoint) {
    throw new Error('Endpoint must be specified when creating base API');
  }

  return {
    reducerPath: `${endpoint}Api`,
    baseQuery: createBaseQuery(endpoint),
    // Add default tag types if none specified
    tagTypes: ['default'],
    // Add default empty endpoints if none specified
    endpoints: () => ({}),
  };
};

// Export socket configuration
export const getSocketConfig = () => {
  const config = getCurrentConfig();
  return {
    url: config.baseUrl,
    options: {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    },
  };
};
