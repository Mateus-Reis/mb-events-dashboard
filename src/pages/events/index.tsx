import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Pencil,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  Ticket,
} from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../services/firebase";
import Sidebar from "../../components/layout/Sidebar";
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal";
import { Event } from "@/types/types";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    event: null as Event | null,
  });
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Event;

        const normalizedEvent = {
          ...data,
          date:
            typeof data.date === "object" && data.date !== null
              ? (data.date as any).toDate().toLocaleDateString("pt-BR")
              : data.date || "",
        };

        return {
          id: doc.id,
          ...normalizedEvent,
        };
      }) as Event[];

      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return "";

    if (typeof date === "string") {
      return date;
    }

    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const formatPrice = (price: string) => {
    const priceNum =
      typeof price === "string" ? parseFloat(price.replace(",", ".")) : price;

    return priceNum.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleDelete = async (event: Event) => {
    setDeleteModal({ open: true, event });
  };

  const confirmDelete = async () => {
    if (!deleteModal.event) return;

    try {
      if (deleteModal.event.imageUrl) {
        const imageRef = ref(storage, deleteModal.event.imageUrl);
        await deleteObject(imageRef);
      }

      await deleteDoc(doc(db, "events", deleteModal.event.id!));
      setDeleteModal({ open: false, event: null });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEdit = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
              <p className="text-gray-500">
                Gerencie todos os seus eventos em um só lugar
              </p>
            </div>
            <button
              onClick={() => router.push("/events/create-event")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FF8E53] text-white flex items-center gap-2 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Criar Evento
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    {[
                      { icon: Tag, label: "Título", align: "text-left" },
                      { icon: Calendar, label: "Data", align: "text-center" },
                      { icon: MapPin, label: "Local", align: "text-center" },
                      { icon: Tag, label: "Categorias", align: "text-center" },
                      {
                        icon: DollarSign,
                        label: "Valor",
                        align: "text-center",
                      },
                      {
                        icon: Ticket,
                        label: "Ingressos",
                        align: "text-center",
                      },
                      { label: "Ações", align: "text-center" },
                    ].map((header, index) => (
                      <th
                        key={index}
                        className={`px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider ${header.align}`}
                      >
                        <div
                          className={`flex items-center ${
                            header.align === "text-left"
                              ? "justify-start"
                              : "justify-center"
                          } gap-2`}
                        >
                          {header.icon && <header.icon className="w-4 h-4" />}
                          {header.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={event.imageUrl || "/placeholder.png"}
                            alt={event.title}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                          <div
                            className="font-medium text-gray-900 max-w-[200px] truncate"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-center">
                        {event.location}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {event.categories?.map((category, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF6B6B]/10 text-[#FF6B6B]"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                        {formatPrice(event.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-1">
                          <Ticket className="w-4 h-4 text-[#FF8E53]" />
                          {event.availableTickets}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(event.id!)}
                            className="p-2 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors"
                            title="Editar evento"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(event)}
                            className="p-2 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors"
                            title="Excluir evento"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, event: null })}
        onConfirm={confirmDelete}
        title={deleteModal.event?.title || ""}
      />
    </div>
  );
}
