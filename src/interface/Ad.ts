export interface Ad {
  advertisementId: number;
  advertisementName: string;
  advertisementContent: string;
  advertisementImage: string;
  adverLocation: string;
  advertisementStatus: string;
  residentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdDetail {
  advertisementId: number | null;
  advertisementName: string;
  advertisementContent: string;
  advertisementImage: string;
  adverLocation: string;
  advertisementStatus: string;
  createdAt: string | null;
  updatedAt: string | null;
  fullname: string;
  avatar: string;
  email: string;
  phonenumber: string;
}

export interface UpdateAd {
  advertisementId: number | null;
  advertisementName: string | null;
  advertisementContent: string | null;
  adverLocation: string | null;
  advertisementStatus: string | null;
}

export interface OutsourcingService {
  outsourcingServiceId: number;
  outsourcingServiceName: string;
  outsourcingServiceDescription: string;
  outsourcingServiceImage: string;
  outsourcingServiceStatus: string;
  outsourceServicePrice: number;
  outsourceServiceLocation: string;
  outsourcingServiceType: string;
  residentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface OutsourcingServiceDetail {
  outsourcingServiceId: number | null;
  outsourcingServiceName: string;
  outsourcingServiceDescription: string;
  outsourcingServiceImage: string;
  outsourcingServiceStatus: string;
  outsourceServicePrice: number | null;
  outsourceServiceLocation: string;
  outsourcingServiceType: string;
  createdAt: string | null;
  updatedAt: string | null;
  fullname: string;
  avatar: string;
  email: string;
  phonenumber: string;
}

export interface UpdateOutsourcingService {
  outsourcingServiceId: number | null;
  outsourcingServiceName: string | null;
  outsourcingServiceDescription: string | null;
  outsourcingServiceStatus: string | null;
  outsourceServicePrice: number | null;
  outsourceServiceLocation: string | null;
  outsourcingServiceType: string | null;
}
