interface User {
  id: number;
  avatar: string;
  fullname: string;
  username: string;
  email: string;
}

interface Admin {
  adminId: number;
}

export interface CurrentUserResponse {
  user: User;
  admin: Admin;
}

