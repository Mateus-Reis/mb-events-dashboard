import { Timestamp, FieldValue } from "firebase/firestore";

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: Timestamp;
  time: string; 
  location: string;
  modality: 'Presencial' | 'Online';
  isHighlighted: boolean;
  price: string; 
  availableTickets: string; 
  categories: {
    id: string;
    name: string;
  }[];
  imageUrl?: string;
  createdBy?: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  attendees: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}