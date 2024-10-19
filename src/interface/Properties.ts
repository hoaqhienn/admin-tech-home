export interface Building {
  buildingId: number;
  buildingName: string;
  buildingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Apartment {
  apartmentId: number;
  apartmentNumber: string;
  apartmentType: string;
  createdAt: string;
  updatedAt: string;
  floorId: number;
}

export interface Floor {
  floorId: number;
  floorNumber: string;
  createdAt: string;
  updatedAt: string;
  buildingId: number;
}

