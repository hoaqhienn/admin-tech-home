// authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseApi } from '../config/apiConfig';
import {
  Ad,
  AdDetail,
  OutsourcingService,
  OutsourcingServiceDetail,
  UpdateAd,
  UpdateOutsourcingService,
} from 'interface/Ad';
import { NewProvider } from 'interface/Residents';
import { residentApi } from './residentApi';

export const adApi = createApi({
  ...createBaseApi('advertisement'),
  tagTypes: ['Advertisement', 'Service', 'ServiceProvider'], // Add this if missing
  endpoints: (builder) => ({
    getAdvertisements: builder.query<Ad[], void>({
      query: () => '/getAllAdvertisements',
      transformResponse: (response: { data: Ad[] }) => response.data,
      providesTags: ['Advertisement'],
    }),

    // get by id advertisement
    getAdvertisementById: builder.query<AdDetail, number>({
      query: (id) => `/getAdvertisementById/${id}`,
      transformResponse: (response: { data: AdDetail }) => response.data,
    }),

    // update the existing advertisement
    updateAdvertisement: builder.mutation<void, UpdateAd>({
      query: (ad) => ({
        url: `/updateAdvertisementAdmin/${ad.advertisementId}`,
        method: 'PUT',
        body: ad,
      }),
      invalidatesTags: ['Advertisement'],
    }),

    // delete the existing advertisement
    deleteAdvertisement: builder.mutation<void, number>({
      query: (id) => ({
        url: `/deleteAdvertisement/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Advertisement'],
    }),

    // get all outsources services
    getOutsourcingServices: builder.query<OutsourcingService[], void>({
      query: () => '/getAllOutsourcingServices',
      transformResponse: (response: { data: OutsourcingService[] }) => response.data,
      providesTags: ['Service'],
    }),

    // get by id outsources services
    getOutsourcingServiceById: builder.query<OutsourcingServiceDetail, number>({
      query: (id) => `/getOutsourcingServiceById/${id}`,
      transformResponse: (response: { data: OutsourcingServiceDetail }) => response.data,
    }),

    // update the existing outsources services
    updateOutsourcingService: builder.mutation<void, UpdateOutsourcingService>({
      query: (os) => ({
        url: `/updateOutsourcingServiceAdmin/${os.outsourcingServiceId}`,
        method: 'PUT',
        body: os,
      }),
      invalidatesTags: ['Service'],
    }),

    // delete the existing outsources services
    deleteOutsourcingService: builder.mutation<void, number>({
      query: (id) => ({
        url: `/deleteOutsourcingService/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),

    addProvider: builder.mutation<void, NewProvider>({
      query: (resident) => ({
        url: '/registerServiceProvider',
        method: 'POST',
        body: resident,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Sau khi thêm provider mới, hãy gọi invalidate hoặc refetch dữ liệu từ residentApi
          dispatch(residentApi.util.invalidateTags(['ServiceProvider']));
        } catch (error) {
          console.error('Error adding provider:', error);
        }
      },
      invalidatesTags: ['ServiceProvider'],
    }),
  }),
});

export const {
  useGetAdvertisementsQuery,
  useGetAdvertisementByIdQuery,
  useUpdateAdvertisementMutation,
  useDeleteAdvertisementMutation,

  useGetOutsourcingServicesQuery,
  useGetOutsourcingServiceByIdQuery,
  useUpdateOutsourcingServiceMutation,
  useDeleteOutsourcingServiceMutation,

  useAddProviderMutation,
} = adApi;
