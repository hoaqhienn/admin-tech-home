export interface Bill {
  billId: number;
  billName: string;
  residentId: number;
  billAmount: string;
  billDate: string | null;
  billStatus: string;
  serviceBookingId: string | null;
  residentName: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Payment {
  paymentId: number;
  paymentAmount: string;
  paymentDate: string | null;
  paymentStatus: string;
  orderCode: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
