import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { AuthResponse, CurrentUserResponse, LoginCredentials } from 'interface/auth/authInterface';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://cb2a-116-111-185-128.ngrok-free.app/admin',
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
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/authentication',
        method: 'POST',
        body: credentials,
      }),
      // transformResponse: (response : any) => {
      //   console.log('API Response:', response);
      //   return response.data;
      // },
    }),

    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => '/current',
      providesTags: ['Authorization'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const fetchError = error as { error: FetchBaseQueryError };
          if (fetchError.error.status === 401 || fetchError.error.status === 403) {
            // Clear auth state on unauthorized
            localStorage.removeItem('_email');
            localStorage.removeItem('_token');
            localStorage.removeItem('_longToken');
          }
        }
      },
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
