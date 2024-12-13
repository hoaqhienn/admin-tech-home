// authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { AuthResponse, CurrentUserResponse, LoginCredentials } from 'interface/auth/authInterface';
import { createBaseApi } from '../config/apiConfig';

export const authApi = createApi({
  ...createBaseApi('auth'),
  tagTypes: ['Auth'], // Add this if missing
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/authentication',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => '/current',
      providesTags: ['Auth'],
    }),
    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (credentials) => ({
        url: '/change-password',
        method: 'PUT',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery, useChangePasswordMutation } = authApi;
