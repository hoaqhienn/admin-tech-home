import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, CurrentUserResponse } from 'interface/auth/authInterface';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/admin',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('_token');

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Authorization'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/authentication',
        method: 'POST',
        body: credentials,
      }),
    }),

    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => '/current',
    }),

    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (credentials) => ({
        url: '/change-password',
        method: 'PUT',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useGetCurrentUserQuery, useChangePasswordMutation } = authApi;
