import { api } from 'apis';
import { Apartment } from 'interface/Properties';

interface Response {
  status: boolean;
  count: number;
  data: Apartment[];
}

export const ApartmentsByFloor = async (floorId: number) => {
  try {
    const response: any = await api.get<Response>(`/admin/floor/apartment/${floorId}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export interface SearchProps {
  floorId?: number[];
  buildingId?: number;
}

export const SearchApartments = async ({ floorId, buildingId }: SearchProps) => {
  console.log('Search Apartments:', { floorId, buildingId });

  try {
    const requestBody: SearchProps = {}; // Initialize empty object

    if (floorId && floorId.length > 0) {
      requestBody.floorId = floorId;
    }
    
    requestBody.buildingId = buildingId;

    const response = await api.post<Apartment[]>('/admin/apartment/search', requestBody);

    console.log('(API) Response: ', response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Search Apartments Error:', error.message);
    } else {
      console.error('Search Apartments Error:', error);
    }
    throw error;
  }
};

export const GetApartments = async () => {
  try {
    const response: any = await api.get<Response>('/admin/apartment/getAll');
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const PostApartment = async (apartment: Omit<Apartment, 'apartmentId'>) => {
  try {
    const response: any = await api.post<Response>('/admin/apartment', apartment);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const PutApartment = async (apartment: Apartment) => {
  try {
    const response: any = await api.put<Response>(
      `/admin/apartment/${apartment.apartmentId}`,
      apartment,
    );
    console.log(response);

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const DeleteApartment = async (apartmentId: number) => {
  try {
    const response: any = await api.delete<Response>(`/admin/apartment/${apartmentId}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
