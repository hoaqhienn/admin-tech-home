import { authApi } from './authApi';
import { chatApi } from './chatApi';
import { propertyApi } from './propertyApi';
import { residentApi } from './residentApi';
import { serviceApi } from './serviceApi';

// Define the combined API
export const combinedApi = {
  authApi,
  chatApi,
  propertyApi,
  residentApi,
  serviceApi,
};

export const API_URL = 'https://169e-116-111-185-128.ngrok-free.app/';