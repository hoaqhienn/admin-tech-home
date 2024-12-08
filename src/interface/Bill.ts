export interface Bill {
  billId: number;
  billName: string;
  residentId: number;
  billAmount: string;
  billDate: string | null;
  billStatus: string;
  serviceBookingId: string | null;
  residentName: string;
}

export interface Payment {
  paymentId: number;
  paymentAmount: string;
  paymentDate: string | null;
  paymentStatus: string;
  orderCode: number | null;
}
