// interfaces.ts
export interface User {
  userId: number;
  avatar: string;
  fullname: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  roleId: number;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface Admin {
  adminId: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  buildingId: number;
}

export interface AdminCreateRequest {
  userId: number;
  buildingId: number;
}

export interface Resident {
  residentId?: number;
  fullname?: string;
  email?: string;
  phonenumber: string;
  idcard: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  User?: User;
}

export interface ResidentViaApartment {
  residentId: number;
  fullname: string;
  avatar: string;
  username: string;
  idcard: string;
  phonenumber: string;
  email: string;
  fcmToken?: string;
  status: boolean;
  role: string;
}

export interface NewResident {
  fullname: string;
  idcard: string;
  apartmentId?: number | null;
  phonenumber?: string;
  email?: string;
  role?: string;
}

export interface NewProvider {
  fullname: string;
  username?: string;
  idcard: string;
  phonenumber?: string;
}
