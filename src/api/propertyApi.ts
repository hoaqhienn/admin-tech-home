import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Apartment,
  Building,
  Facility,
  Floor,
  NewBuilding,
  NewFloor,
} from 'interface/Properties';

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
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
  tagTypes: ['Apartment', 'Building', 'Floor', 'Facility', 'joinApartment'],

  endpoints: (builder) => ({
    // Building endpoints
    getBuildings: builder.query<Building[], void>({
      query: () => '/building/getAll',
      transformResponse: (response: { data: Building[] }) => response.data,
      providesTags: ['Building'],
    }),

    addBuilding: builder.mutation<void, Omit<Building, 'buildingId'>>({
      query: (building) => ({
        url: '/building',
        method: 'POST',
        body: building,
      }),
      invalidatesTags: ['Building'],
    }),

    newBuilding: builder.mutation<void, Omit<NewBuilding, 'buildingId'>>({
      query: (building) => ({
        url: '/building/new',
        method: 'POST',
        body: building,
      }),
      invalidatesTags: ['Building'],
    }),

    updateBuilding: builder.mutation<void, Building>({
      query: (building) => ({
        url: `/building/${building.buildingId}`,
        method: 'PUT',
        body: building,
      }),
      invalidatesTags: ['Building'],
    }),

    deleteBuilding: builder.mutation<void, number>({
      query: (id) => ({
        url: `/building/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Building'],
    }),

    // Floor endpoints
    getFloors: builder.query<Floor[], void>({
      query: () => '/floor/getAll',
      transformResponse: (response: { data: Floor[] }) => response.data,
      providesTags: ['Floor'],
    }),
    getFloorsByBuilding: builder.query<Floor[], number>({
      query: (buildingId) => `/building/${buildingId}`,
      transformResponse: (response: { data: { floors: Floor[] } }) => response.data.floors,
      providesTags: ['Floor'],
    }),

    addFloor: builder.mutation<void, Omit<NewFloor, 'floorId'>>({
      query: (floor) => ({
        url: '/floor',
        method: 'POST',
        body: floor,
      }),
      invalidatesTags: ['Floor'],
    }),

    updateFloor: builder.mutation<void, Floor>({
      query: (floor) => ({
        url: `/floor/${floor.floorId}`,
        method: 'PUT',
        body: floor,
      }),
      invalidatesTags: ['Floor'],
    }),
    deleteFloor: builder.mutation<void, number>({
      query: (id) => ({
        url: `/floor/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Floor'],
    }),

    // Apartment endpoints
    getApartments: builder.query<Apartment[], void>({
      query: () => '/apartment/getAll',
      transformResponse: (response: { data: Apartment[] }) => response.data,
      providesTags: ['Apartment', 'joinApartment'],
    }),
    getApartmentsByFloor: builder.query<Apartment[], number>({
      query: (floorId) => `/apartment/floor/${floorId}`,
      transformResponse: (response: { data: Apartment[] }) => response.data,
      providesTags: ['Apartment', 'joinApartment'],
    }),

    getApartmentById: builder.query<Apartment, number>({
      query: (id) => `/apartment/${id}`,
      transformResponse: (response: { data: Apartment }) => response.data,
      providesTags: ['joinApartment'],
    }),

    updateApartment: builder.mutation<void, Apartment>({
      query: (apartment) => ({
        url: `/apartment/${apartment.apartmentId}`,
        method: 'PUT',
        body: apartment,
      }),
      invalidatesTags: ['Apartment'],
    }),

    joinToApartment: builder.mutation<void, { apartmentId: number; residentId: number[] }>({
      query: ({ residentId, apartmentId }) => ({
        url: `/apartment/join/${apartmentId}`,
        method: 'PUT',
        body: { residentId },
      }),
      invalidatesTags: ['joinApartment'],
    }),

    leaveOutApartment: builder.mutation<void, { apartmentId: number; residentId: number[] }>({
      query: ({ residentId, apartmentId }) => ({
        url: `/apartment/leave/${apartmentId}`,
        method: 'PUT',
        body: { residentId },
      }),
      invalidatesTags: ['joinApartment'],
    }),

    deleteApartment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/apartment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Apartment'],
    }),
    searchApartments: builder.mutation<Apartment[], { floorId?: number[]; buildingId?: number }>({
      query: (searchParams) => ({
        url: '/apartment/search',
        method: 'POST',
        body: searchParams,
      }),
      invalidatesTags: ['Apartment'],
    }),

    // Facility endpoints
    getFacilities: builder.query<Facility[], void>({
      query: () => '/facilities/getAll',
      transformResponse: (response: { data: Facility[] }) => response.data,
      providesTags: ['Facility'],
    }),

    // create a new facility
    addFacility: builder.mutation<void, Facility>({
      query: (facility) => ({
        url: '/facilities',
        method: 'POST',
        body: facility,
      }),
      invalidatesTags: ['Facility'],
    }),

    // update a facility
    updateFacility: builder.mutation<void, Facility>({
      query: (facility) => ({
        url: `/facilities/${facility.facilityId}`,
        method: 'PUT',
        body: facility,
      }),
      invalidatesTags: ['Facility'],
    }),

    // delete a facility
    deleteFacility: builder.mutation<void, number>({
      query: (id) => ({
        url: `/facilities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Facility'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetBuildingsQuery,
  useAddBuildingMutation,
  useNewBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,

  useGetFloorsQuery,
  useGetFloorsByBuildingQuery,
  useAddFloorMutation,
  useUpdateFloorMutation,
  useDeleteFloorMutation,

  useGetApartmentsQuery,
  useGetApartmentByIdQuery,
  useGetApartmentsByFloorQuery,
  useSearchApartmentsMutation,
  useUpdateApartmentMutation,
  useJoinToApartmentMutation,
  useLeaveOutApartmentMutation,
  useDeleteApartmentMutation,

  useGetFacilitiesQuery,
  useAddFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
} = propertyApi;
