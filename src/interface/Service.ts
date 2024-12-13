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

export interface ServiceBooking {
  serviceBookingId?: number;
  serviceId?: number;
  residentId?: number;
  bookingDate?: string;
  bookingStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}
