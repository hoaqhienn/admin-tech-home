import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseApi } from 'config/apiConfig';
import { Ad } from 'interface/Ad';
import type { Bill, Payment } from 'interface/Bill';
import { NewService, Service, ServiceBooking } from 'interface/Service';
import { Complaint, NewEvent, NewNotify } from 'interface/Utils';

export const serviceApi = createApi({
  ...createBaseApi('admin'),
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
      transformResponse: (response: { data: Complaint[] }) => {
        return response.data.sort((a, b) => {
          // Sort by updatedAt in descending order (most recent first)
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      },
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
      // sort events by eventDate in descending order
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

    getAllAd: builder.query<Ad[], void>({
      query: () => '/advertisement/getAll',
      transformResponse: (response: { data: Ad[] }) => response.data,
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
