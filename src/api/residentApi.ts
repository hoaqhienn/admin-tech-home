import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseApi } from 'config/apiConfig';
import { NewResident, Resident, ResidentViaApartment } from 'interface/Residents';
import { NewVehicle, Vehicle } from 'interface/Vehicle';
import { adApi } from './adApi';

export const residentApi = createApi({
  ...createBaseApi('admin'),
  reducerPath: 'residentApi',
  tagTypes: ['Resident', 'Vehicle', 'ServiceProvider'],
  endpoints: (builder) => ({
    getResidents: builder.query<ResidentViaApartment[], void>({
      query: () => ({
        url: '/resident/getAll',
        method: 'GET',
      }),
      transformResponse: (response: { data: ResidentViaApartment[] }) =>
        response.data.filter((resident) => resident.role === 'RESIDENT'),
      providesTags: ['Resident'],
    }),
    getProvider: builder.query<ResidentViaApartment[], void>({
      query: () => ({
        url: '/resident/getAll',
        method: 'GET',
      }),
      transformResponse: (response: { data: ResidentViaApartment[] }) =>
        response.data.filter((resident) => resident.role === 'SERVICEPROVIDER'),
      providesTags: ['ServiceProvider'],
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(adApi.util.invalidateTags(['ServiceProvider']));
        } catch (error) {
          console.error('Error deleting resident:', error);
        }
      },
      invalidatesTags: ['Resident', 'ServiceProvider'],
    }),

    // delete resident by idcard
    deleteResidentByIdcard: builder.mutation<void, string>({
      query: (idcard) => ({
        url: `/resident/idcard/${idcard}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(adApi.util.invalidateTags(['ServiceProvider']));
        } catch (error) {
          console.error('Error deleting resident:', error);
        }
      },
      invalidatesTags: ['Resident', 'ServiceProvider'],
    }),

    activeResident: builder.mutation<void, { residentId: number }>({
      query: ({ residentId }) => ({
        url: `/resident/${residentId}`,
        method: 'PUT',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(adApi.util.invalidateTags(['ServiceProvider']));
        } catch (error) {
          console.error('Error deleting resident:', error);
        }
      },
      invalidatesTags: ['Resident', 'ServiceProvider'],
    }),

    // update resident
    updateResident: builder.mutation<void, { residentId: number; resident: Resident }>({
      query: ({ residentId, resident }) => ({
        url: `/resident/update/${residentId}`,
        method: 'PUT',
        body: resident,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(adApi.util.invalidateTags(['ServiceProvider']));
        } catch (error) {
          console.error('Error updating resident:', error);
        }
      },
      invalidatesTags: ['Resident', 'ServiceProvider'],
    }),

    getVehicles: builder.query<Vehicle[], void>({
      query: () => '/vehicles/getAll',
      transformResponse: (response: { data: Vehicle[] }) => response.data,
      providesTags: ['Vehicle'],
    }),

    // add vehicle
    addVehicle: builder.mutation<void, { vehicle: NewVehicle }>({
      query: ({ vehicle }) => ({
        url: '/vehicles',
        method: 'POST',
        body: vehicle,
      }),
      invalidatesTags: ['Vehicle'],
    }),

    // update vehicle
    updateVehicle: builder.mutation<void, { vehicleId: number; vehicle: NewVehicle }>({
      query: ({ vehicleId, vehicle }) => ({
        url: `/vehicles/${vehicleId}`,
        method: 'PUT',
        body: vehicle,
      }),
      invalidatesTags: ['Vehicle'],
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
  useGetProviderQuery,

  useGetResidentsQuery,
  useAddResidentMutation,
  useDeleteResidentMutation,
  useDeleteResidentByIdcardMutation,
  useActiveResidentMutation,
  useUpdateResidentMutation,

  useGetVehiclesQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = residentApi;
