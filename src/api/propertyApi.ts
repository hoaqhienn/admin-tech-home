import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Apartment, Building, Facility, Floor } from 'interface/Properties';

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
  tagTypes: ['Apartment', 'Building', 'Floor', 'Facility'],
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
    addFloor: builder.mutation<void, Omit<Floor, 'floorId'>>({
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
      providesTags: ['Apartment'],
    }),
    getApartmentsByFloor: builder.query<Apartment[], number>({
      query: (floorId) => `/apartment/floor/${floorId}`,
      transformResponse: (response: { data: Apartment[] }) => response.data,
      providesTags: ['Apartment'],
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
      query: () => '/facility/getAll',
      transformResponse: (response: { data: Facility[] }) => response.data,
      providesTags: ['Facility'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetBuildingsQuery,
  useAddBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
  useGetFloorsQuery,
  useGetFloorsByBuildingQuery,
  useAddFloorMutation,
  useUpdateFloorMutation,
  useDeleteFloorMutation,
  useGetApartmentsQuery,
  useGetApartmentsByFloorQuery,
  useSearchApartmentsMutation,
  useGetFacilitiesQuery,
} = propertyApi;
