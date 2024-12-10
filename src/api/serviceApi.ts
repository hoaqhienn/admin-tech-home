import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Bill, Payment } from 'interface/Bill';
import { Service } from 'interface/Service';
import { Complaint } from 'interface/Utils';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
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
  tagTypes: ['Bill', 'Payment', 'Service', 'Event', 'Complaint', 'Notification'],
  endpoints: (builder) => ({
    // Other endpoints following similar patterns...
    getBills: builder.query<Bill[], void>({
      query: () => '/bills/getAll',
      transformResponse: (response: { data: Bill[] }) => response.data,
      providesTags: ['Bill'],
    }),

    getPayments: builder.query<Payment[], void>({
      query: () => '/payments/getAll',
      transformResponse: (response: { data: Payment[] }) => response.data,
      providesTags: ['Payment'],
    }),

    getComplaints: builder.query<Complaint[], void>({
      query: () => '/complaints/getAll',
      transformResponse: (response: { data: Complaint[] }) => response.data,
      providesTags: ['Complaint'],
    }),

    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications/getAll',
      transformResponse: (response: { data: Notification[] }) => response.data,
      providesTags: ['Notification'],
    }),

    getService: builder.query<Service[], void>({
      query: () => '/service/getAll',
      transformResponse: (response: { data: Service[] }) => response.data,
      providesTags: ['Service'],
    }),

    getEvents: builder.query<Event[], void>({
      query: () => '/event/getAll',
      transformResponse: (response: { data: Event[] }) => response.data,
      providesTags: ['Event'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetBillsQuery,
  useGetPaymentsQuery,
  useGetComplaintsQuery,
  useGetNotificationsQuery,
  useGetServiceQuery,
  useGetEventsQuery,
} = serviceApi;
