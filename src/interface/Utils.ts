export interface Complaint {
  complaintId: number;
  complaintTitle: string;
  complaintDescription: string;
  complaintDate: string;
  complaintStatus: string;
  buildingId: number;
  floorId: number;
  apartmentId: number;
  residentId: number;
  buildingName: string;
  floorNumber: number;
  apartmentNumber: number;
  residentName: string;
}

export interface Notify {
  notificationId: number;
  notificationTitle: string;
  notificationBody: string;
}

export interface NotifyResponse {
  status: boolean;
  data: Notify[];
  message?: string;
}

export interface NotifyResult {
  token: string;
  success: boolean;
  response?: any;
  error?: string;
}

export interface PushNotifyResponse {
  status: boolean;
  message: string;
  results?: {
    successful: NotifyResult[];
    failed: NotifyResult[];
    totalAttempted: number;
    totalSuccessful: number;
    totalFailed: number;
  };
  error?: string;
}

export interface SendNotifyParams {
  tokens: string[];
  title: string;
  body: string;
}

export interface NewNotify {
  notificationTitle: string;
  notificationBody: string;
}

export interface NewEvent {
  eventId?: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  buildingId: number;
}
