import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseApi } from 'config/apiConfig';
import { NewResident, Resident, ResidentViaApartment } from 'interface/Residents';
import { NewVehicle, Vehicle } from 'interface/Vehicle';

export const residentApi = createApi({
  ...createBaseApi('admin'),
  reducerPath: 'residentApi',
  tagTypes: ['Resident', 'Vehicle'],
  endpoints: (builder) => ({
    getResidents: builder.query<ResidentViaApartment[], void>({
      query: () => ({
        url: '/resident/getAll',
        method: 'GET',
      }),
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

    // update resident
    updateResident: builder.mutation<void, { residentId: number; resident: Resident }>({
      query: ({ residentId, resident }) => ({
        url: `/resident/update/${residentId}`,
        method: 'PUT',
        body: resident,
      }),
      invalidatesTags: ['Resident'],
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
