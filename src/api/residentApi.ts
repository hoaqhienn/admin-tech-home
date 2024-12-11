import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewResident, ResidentViaApartment } from 'interface/Residents';
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

    addResident: builder.mutation<void, NewResident>({
      query: (resident) => ({
        url: '/registerResident',
        method: 'POST',
        body: resident,
      }),
      invalidatesTags: ['Resident'],
    }),

    deleteResident: builder.mutation<void, number>({
      query: (residentId) => ({
        url: `/resident/${residentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resident'],
    }),

    // delete resident by idcard
    deleteResidentByIdcard: builder.mutation<void, string>({
      query: (idcard) => ({
        url: `/resident/idcard/${idcard}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resident'],
    }),

    activeResident: builder.mutation<void, { residentId: number }>({
      query: ({ residentId }) => ({
        url: `/resident/${residentId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Resident'],
    }),

    getVehicles: builder.query<Vehicle[], void>({
      query: () => '/vehicles/getAll',
      transformResponse: (response: { data: Vehicle[] }) => response.data,
      providesTags: ['Vehicle'],
    }),

    deleteVehicle: builder.mutation<void, number>({
      query: (vehicleId) => ({
        url: `/vehicles/${vehicleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetResidentsQuery,
  useAddResidentMutation,
  useDeleteResidentMutation,
  useDeleteResidentByIdcardMutation,
  useActiveResidentMutation,
  useGetVehiclesQuery,
  useDeleteVehicleMutation,
} = residentApi;
