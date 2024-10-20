export interface Resident {
  residentId: number;
  phonenumber: string;
  idcard: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  User: User;
}

export interface User {
  userId: number;
  avatar: string;
  fullname: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  roleId: number;
}
