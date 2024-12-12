export interface Service {
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
  buildingId?: number;
}

export interface NewService {
  serviceId?: number;
  serviceName: string;
  servicePrice: number;
  buildingId: number;
}
