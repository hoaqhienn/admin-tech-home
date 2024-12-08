import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GroupChat, Messages } from 'interface/chat/ChatInterface';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/chat',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Chat', 'Messages'],
  endpoints: (builder) => ({
    // Get all chats
    getAllChats: builder.query<GroupChat[], void>({
      query: () => '/getAllChats',
      providesTags: ['Chat'],
    }),

    // Get messages by chat ID
    getMessagesByChatId: builder.query<
      Messages[],
      { chatId: number; offset?: number; limit?: number }
    >({
      query: ({ chatId, offset = 0, limit = 100 }) => ({
        url: `/getAllMessagesByChatId/${chatId}`,
        params: { offset, limit },
      }),
      transformResponse: (response: { messages: Messages[] }) => response.messages,
      providesTags: (_result, _error, { chatId }) => [{ type: 'Messages', id: chatId }],
    }),

    // Send message
    sendMessage: builder.mutation<Messages, { chatId: number; message: string; files?: File[] }>({
      async queryFn({ chatId, message, files }, _queryApi, _extraOptions, baseQuery) {
        try {
          const formData = new FormData();
          formData.append('message', message.trim());
          formData.append('chatId', chatId.toString());

          if (files?.length) {
            files.forEach((file) => {
              if (file.size <= MAX_FILE_SIZE) {
                formData.append('files', file);
              }
            });
          }

          const result = await baseQuery({
            url: `/sendMessages/${chatId}`,
            method: 'POST',
            body: formData,
          });

          return { data: result.data as Messages };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
    }),
  }),
});

export const { useGetAllChatsQuery, useGetMessagesByChatIdQuery, useSendMessageMutation } = chatApi;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
