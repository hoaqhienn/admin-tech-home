import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ResidentViaApartment } from 'interface/Residents';
import { Vehicle } from 'interface/Vehicle';

export const residentApi = createApi({
  reducerPath: 'residentApi',
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
  tagTypes: ['Resident', 'Vehicle'],
  endpoints: (builder) => ({
    getResidents: builder.query<ResidentViaApartment[], void>({
      query: () => '/resident/getAll',
      transformResponse: (response: { data: ResidentViaApartment[] }) => response.data,
      providesTags: ['Resident'],
    }),

    getVehicles: builder.query<Vehicle[], void>({
      query: () => '/vehicles/getAll',
      transformResponse: (response: { data: Vehicle[] }) => response.data,
      providesTags: ['Vehicle'],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetResidentsQuery, useGetVehiclesQuery } = residentApi;
