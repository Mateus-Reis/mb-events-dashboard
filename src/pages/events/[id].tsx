import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Sidebar from "../../components/layout/Sidebar";
import EventForm from "@/components/forms/EventForm";

interface Event {
  id: string;
  title: string;
  description: string;
  time: string;
  date: any;
  location: string;
  modality: "Presencial" | "Online";
  isHighlighted: boolean;
  price: string;
  availableTickets: string;
  categories: { id: string; name: string }[];
  imageUrl?: string;
  createdBy: string;
  attendees: number;
}

export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvent = async (eventId: string) => {
      try {
        setLoading(true);
        const eventDoc = await getDoc(doc(db, "events", eventId));

        if (!eventDoc.exists()) {
          setError("Evento não encontrado");
          router.push("/events");
          return;
        }

        const eventData = eventDoc.data() as Event;
        setEvent({
          ...eventData,
          id: eventDoc.id,
          price: `R$ ${eventData.price.replace(/\./g, "").replace(",", ".")}`,
          availableTickets: String(eventData.availableTickets),
        });
      } catch (err) {
        setError("Erro ao carregar o evento");
        console.error("Erro ao buscar evento:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getEvent(id as string);
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {event && <EventForm eventId={event.id} event={event} />}
        </div>
      </main>
    </div>
  );
}
