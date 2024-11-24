import { api } from 'apis';
import { Building } from 'interface/Properties';

interface Response {
  status: boolean;
  data: Building[];
}

export const GetBuildings = async (): Promise<Building[]> => {
  try {
    const response: any = await api.get<Response[]>('/admin/building/getAll');
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching buildings from the server');
  }
};

export const PostBuilding = async (building: Omit<Building, 'buildingId'>): Promise<void> => {
  try {
    await api.post<Building>('/admin/building', building);
  } catch (error: any) {
    throw new Error('Error adding building to the server');
  }
};

export const PutBuilding = async (building: Building): Promise<void> => {
  try {
    await api.put<Building>(`/admin/building/${building.buildingId}`, building);
  } catch (error: any) {
    throw new Error('Error updating building on the server');
  }
};

export const DeleteBuilding = async (buildingId: number): Promise<void> => {
  console.log('buildingId:', buildingId);

  try {
    await api.delete(`/admin/building/${buildingId}`);
  } catch (error: any) {
    throw new Error('Error deleting building from the server');
  }
};

export const AllBuildings = async (): Promise<Building[]> => {
  try {
    const response: any = await api.get<Response[]>('/admin/building/getAll');
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

export const BuildingById = async (buildingId: number): Promise<Building> => {
  try {
    const response: any = await api.get<Response[]>(`/admin/building/${buildingId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching building:', error);

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
