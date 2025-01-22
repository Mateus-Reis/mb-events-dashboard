import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebase';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  attendees: number;
  imageUrl: string;
  availableTickets: number;
  categories: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const eventsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date.toDate().toISOString(),
            createdAt: data.createdAt.toDate().toISOString(),
            updatedAt: data.updatedAt.toDate().toISOString(),
          } as Event;
        });

        setEvents(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading, error };
}