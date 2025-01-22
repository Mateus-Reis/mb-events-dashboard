import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import Image from "next/image";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string | Date;
    location: string;
    price: number;
    attendees: number;
    imageUrl: string;
    availableTickets: number;
    categories: string[];
    createdBy: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] h-full">
      <div className="relative h-36 overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={event.title}
          layout="fill"
          objectFit="cover"
        />
      </div>

      <h3 className="py-2 px-3 text-lg font-semibold bg-white">
        <span className="bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FF8E53] bg-clip-text text-transparent">
          {event.title}
        </span>
      </h3>

      {/* Event Details */}
      <div className="p-3">
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-[#FF6B6B]" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center text-gray-700 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-[#FF6B6B]" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-700 text-sm">
            <Users className="w-4 h-4 mr-2 text-[#FF6B6B]" />
            <span>{event.attendees.toLocaleString()} participantes</span>
          </div>

          <div className="flex items-center text-gray-700 text-sm">
            <DollarSign className="w-4 h-4 mr-2 text-[#FF6B6B]" />
            <span>
              {event.price === 0 ? "Gratuito" : formatPrice(event.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
