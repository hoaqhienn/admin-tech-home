import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChatDetail, GroupChat, Messages } from 'interface/chat/ChatInterface';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://cb2a-116-111-185-128.ngrok-free.app/chat',
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
      transformResponse: (response: { data: GroupChat[] }) =>
        response.data.filter((chat) => chat.chatType !== 'bot'),
      providesTags: ['Chat', 'Messages'],
    }),

    // Get chat details by chatId
    getChatDetails: builder.query<ChatDetail, { chatId: number }>({
      query: ({ chatId }) => `/getChatById/${chatId}`,
      transformResponse: (response: { data: ChatDetail }) => response.data,
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
      providesTags: ['Messages', 'Chat'],
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
      invalidatesTags: ['Messages'],
    }),

    // create chat chatName : string; chatType: 'admin', 'resident'; residentIds: number[]
    createChat: builder.mutation<
      GroupChat,
      { chatName: string; chatType: string; residentIds: number[] }
    >({
      query: ({ chatName, chatType, residentIds }) => ({
        url: '/createChat',
        method: 'POST',
        body: { chatName, chatType, residentIds },
      }),
      transformResponse: (response: { data: GroupChat }) => response.data,
      invalidatesTags: ['Chat'],
    }),

    // add one member to chat with /addMember/:chatId/ - body JSON object memberId: number
    addMember: builder.mutation<GroupChat, { chatId: number; memberId: number }>({
      query: ({ chatId, memberId }) => ({
        url: `/addMember/${chatId}`,
        method: 'POST',
        body: { memberId },
      }),
      transformResponse: (response: { data: GroupChat }) => response.data,
      invalidatesTags: ['Chat'],
    }),

    // remove one member from chat with /removeMember/:chatId/ - body JSON object memberId: number
    removeMember: builder.mutation<GroupChat, { chatId: number; memberId: number }>({
      query: ({ chatId, memberId }) => ({
        url: `/removeMember/${chatId}`,
        method: 'DELETE',
        body: { memberId },
      }),
      transformResponse: (response: { data: GroupChat }) => response.data,
      invalidatesTags: ['Chat'],
    }),

    // delete chat with /deleteChat/:chatId/
    deleteChat: builder.mutation<GroupChat, { chatId: number }>({
      query: ({ chatId }) => ({
        url: `/deleteChat/${chatId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: GroupChat }) => response.data,
      invalidatesTags: ['Chat'],
    }),

    // delete message with /deleteMessage/:messageId/
    deleteMessage: builder.mutation<Messages, { id: number }>({
      query: ({ id }) => ({
        url: `/deleteMessage/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: Messages }) => response.data,
      invalidatesTags: ['Messages'],
    }),

    // get all files by chat id with /getAllFilesByChatId/:id
    getAllFilesByChatId: builder.query<string[], { chatId: number }>({
      query: ({ chatId }) => `/getAllFilesByChatId/${chatId}`,
      transformResponse: (response: { files: string[] }) => response.files,
      providesTags: ['Messages'],
    }),
  }),
});

export const {
  useCreateChatMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useDeleteChatMutation,

  useSendMessageMutation,
  useDeleteMessageMutation,

  useGetAllChatsQuery,
  useGetChatDetailsQuery,
  useGetMessagesByChatIdQuery,
  useGetAllFilesByChatIdQuery,
} = chatApi;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
