import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CurrentUserResponse } from 'interface/auth/authInterface';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/admin',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('_token');
      if (token) {
        headers.set('authorization', `Bearer ${JSON.parse(token)}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Authorization'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<{ token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/authentication',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: { token: string }) => response,
    }),

    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => '/current',
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useGetCurrentUserQuery } = authApi;
