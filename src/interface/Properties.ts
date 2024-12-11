export interface Building {
  buildingId: number;
  buildingName: string;
  buildingAddress: string;
  createdAt: string;
  updatedAt: string;
  totalFloors: number;
  totalApartments: number;
  totalResidents: number;
}

export interface Floor {
  floorId: number;
  floorNumber: string;
  createdAt: string;
  updatedAt: string;
  buildingId: number;
  buildingName: string;
  totalResidents: number;
}

export interface ApartmentResident {
  residentId: number;
  fullname: string;
}

export interface Apartment {
  apartmentId: number;
  apartmentNumber: string;
  apartmentType: string;
  createdAt: string;
  updatedAt: string;
  floorId: number;
  floorNumber: number;
  buildingId: number;
  buildingName: string;
  residents: ApartmentResident[];
  area?: string;
}

export interface Facility {
  facilityId: number;
  facilityName: string;
  facilityDescription: string;
  facilityLocation: string;
}

export interface NewBuilding {
  buildingName: string;
  numOfFloor: number | null;
  numOfApartment: number | null;
}

export interface NewFloor {
  buildingId: number | null;
  floorNumber: number | null;
}
