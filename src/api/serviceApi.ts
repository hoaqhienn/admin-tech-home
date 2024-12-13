import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Bill, Payment } from 'interface/Bill';
import { NewService, Service, ServiceBooking } from 'interface/Service';
import { Complaint, NewEvent, NewNotify } from 'interface/Utils';

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

    deletePayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payment'],
    }),

    getComplaints: builder.query<Complaint[], void>({
      query: () => '/complaints/getAll',
      transformResponse: (response: { data: Complaint[] }) => response.data,
      providesTags: ['Complaint'],
    }),

    // update complaint status
    updateComplaintStatus: builder.mutation<void, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/complaints/status/${id}`,
        method: 'PUT',
        body: { complaintStatus: status },
      }),
      invalidatesTags: ['Complaint'],
    }),

    deleteComplaint: builder.mutation<void, number>({
      query: (id) => ({
        url: `/complaints/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Complaint'],
    }),

    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications/getAll',
      transformResponse: (response: { data: Notification[] }) => response.data,
      providesTags: ['Notification'],
    }),

    // add notify
    addNotification: builder.mutation<void, NewNotify>({
      query: (notification) => ({
        url: '/notifications',
        method: 'POST',
        body: notification,
      }),
      invalidatesTags: ['Notification'],
    }),

    // update notify
    updateNotification: builder.mutation<void, { id: number; notification: NewNotify }>({
      query: ({ id, notification }) => ({
        url: `/notifications/${id}`,
        method: 'PUT',
        body: notification,
      }),
      invalidatesTags: ['Notification'],
    }),

    // delete notify
    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),

    getService: builder.query<Service[], void>({
      query: () => '/service/getAll',
      transformResponse: (response: { data: Service[] }) => response.data,
      providesTags: ['Service'],
    }),

    // add service
    addService: builder.mutation<void, NewService>({
      query: (service) => ({
        url: '/service',
        method: 'POST',
        body: service,
      }),
      invalidatesTags: ['Service'],
    }),

    // update service
    updateService: builder.mutation<void, { id: number; service: Service }>({
      query: ({ id, service }) => ({
        url: `/service/${id}`,
        method: 'PUT',
        body: service,
      }),
      invalidatesTags: ['Service'],
    }),

    deleteService: builder.mutation<void, number>({
      query: (id) => ({
        url: `/service/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),

    getEvents: builder.query<Event[], void>({
      query: () => '/event/getAll',
      // transformResponse: (response: { data: Event[] }) => response.data,
      providesTags: ['Event'],
    }),

    // add events
    addEvent: builder.mutation<void, NewEvent>({
      query: (event) => ({
        url: '/event',
        method: 'POST',
        body: event,
      }),
      invalidatesTags: ['Event'],
    }),

    // update events
    updateEvent: builder.mutation<void, { id: number; event: NewEvent }>({
      query: ({ id, event }) => ({
        url: `/event/${id}`,
        method: 'PUT',
        body: event,
      }),
      invalidatesTags: ['Event'],
    }),

    // delete events
    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/event/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),

    sendNotification: builder.mutation<void, { notificationId: number; residentIds: number[] }>({
      query: ({ notificationId, residentIds }) => ({
        url: '/notifications/send',
        method: 'POST',
        body: { notificationId, residentIds },
      }),
      invalidatesTags: ['Notification'],
    }),

    getServiceBookings: builder.query<ServiceBooking[], void>({
      query: () => '/servicebooking/getAllServiceBookings',
      transformResponse: (response: { data: ServiceBooking[] }) => response.data,
    }),

    deleteServiceBooking: builder.mutation<void, number>({
      query: (id) => ({
        url: `/servicebooking/deleteServiceBooking/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetBillsQuery,

  useGetPaymentsQuery,
  useDeletePaymentMutation,

  useGetComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,

  useGetNotificationsQuery,
  useAddNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useSendNotificationMutation,

  useGetServiceQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,

  useGetEventsQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,

  useGetServiceBookingsQuery,
  useDeleteServiceBookingMutation,
} = serviceApi;
