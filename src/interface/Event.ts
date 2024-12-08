import { Building } from "./Properties";

export interface EEvent {
    eventId: number;
    eventName: string;
    eventDescription: string;
    eventLocation: string;
    eventDate: string;
    createdAt: string;
    updatedAt: string;
    buildingId: number;
    Building: Building;
  }