import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCardComponent";

interface CarouselProps {
  events: Array<{
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
  }>;
}

export default function EventsCarousel({ events }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const getVisibleCards = () => {
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    return 1;
  };

  const totalPages = Math.ceil(events.length / getVisibleCards());

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      const scrollPosition = index * cardWidth;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const newIndex = currentIndex + 1 >= totalPages ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  };

  const handlePrev = () => {
    const newIndex = currentIndex - 1 < 0 ? totalPages - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  };

  if (events.length === 0) return null;

  return (
    <div className="relative">
      {totalPages > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </>
      )}

      <div ref={carouselRef} className="overflow-hidden px-2">
        <div className="flex gap-4 transition-transform duration-300 snap-x snap-mandatory">
          {events.map((event) => (
            <div
              key={event.id}
              className="min-w-[calc(25%-12px)] md:min-w-[calc(33.333%-12px)] lg:min-w-[calc(25%-12px)] snap-start"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-1">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                scrollToCard(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-[#e33392] w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
