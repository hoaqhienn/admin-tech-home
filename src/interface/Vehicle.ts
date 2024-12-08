interface UserProps {
  avatar: string;
  fullname: string;
  username: string;
  email: string;
}

interface ResidentProps {
  phonenumber: string;
  idcard: string;
  active: boolean;
  userId: string;
  User: UserProps;
}

export interface Vehicle {
  vehicleId: number;
  vehicleNumber: string;
  vehicleType: string;
  residentId: number;
  Resident: ResidentProps;
}
