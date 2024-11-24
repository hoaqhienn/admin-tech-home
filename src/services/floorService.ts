import { api } from 'apis';
import { Floor } from 'interface/Properties';

interface Response {
  status: boolean;
  data: Floor[];
}

export const GetFloors = async (): Promise<Floor[]> => {
  console.log('Fetching floors... (API request)');

  try {
    const response: any = await api.get<Response[]>('/admin/floor/getAll');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching buildings:', error);

    // Check if the error is from the API
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);

      // Throw a custom error with the server response details
      throw new Error(
        `API request failed with status code ${error.response.status}: ${error.response.data.message}`,
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from the server');
    } else {
      // Something else happened in making the request
      console.error('Error setting up the request:', error.message);
      throw new Error('Error setting up the API request');
    }
  }
};

export const GetFloorsByBuildingId = async (buildingId: number): Promise<Floor[]> => {
  console.log('(API) Fetching floors for building:', buildingId);
  try {
    const response: any = await api.get<Response[]>(`/admin/building/${buildingId}`);
    return response.data.floors;
  } catch (error: any) {
    console.error('Error fetching floors for building:', error);
    throw error;
  }
};

export const PostFloor = async (floor: Omit<Floor, 'floorId'>): Promise<Floor> => {
  console.log('(API) Adding new floor:', floor);
  try {
    const response: any = await api.post<Response>('/admin/floor', floor);
    return response.data;
  } catch (error: any) {
    console.error('Error adding new floor:', error);
    throw error;
  }
};

export const PutFloor = async (floor: Floor): Promise<Floor> => {
  console.log('(API) Updating floor:', floor);
  try {
    const response: any = await api.put<Response>(`/admin/floor/${floor.floorId}`, floor);
    return response.data;
  } catch (error: any) {
    console.error('Error updating floor:', error);
    throw error;
  }
};

export const DeleteFloor = async (floorId: number): Promise<void> => {
  console.log('(API) Deleting floor:', floorId);
  try {
    await api.delete(`/admin/floor/${floorId}`);
  } catch (error: any) {
    console.error('Error deleting floor:', error);
    throw error;
  }
};
