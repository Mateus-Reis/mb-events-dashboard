import Link from "next/link";
import Sidebar from "../components/layout/Sidebar";
import { Calendar, Ticket, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import EventCard from "@/components/EventCardComponent";
import { useEvents } from "@/hooks/useEvent";

export default function HomePage() {
  const { user, userDetails } = useAuth();
  const { events, loading, error } = useEvents();

  const recentEvents = events.slice(0, 4);

  const stats = [
    {
      icon: Calendar,
      label: "Eventos Ativos",
      value: events.length.toString(),
      change: "+2 este mês",
    },
    {
      icon: Ticket,
      label: "Ingressos Vendidos",
      value: "200",
      change: "+15% vs último mês",
    },
    {
      icon: Users,
      label: "Total de Participantes",
      value: events
        .reduce((acc, event) => acc + (event.attendees || 0), 0)
        .toLocaleString(),
      change: "+8% vs média",
    },
    {
      icon: TrendingUp,
      label: "Receita Total",
      value: `R$ 8.000`,
      change: "+12% este mês",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Olá, {userDetails?.name || "Usuário"}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Bem-vindo ao MB Dashboard. Confira os seus eventos mais recentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className="w-10 h-10 bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FF8E53] bg-clip-text text-transparent" />
                </div>
                <p className="mt-1 text-xs bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FF8E53] bg-clip-text text-transparent font-medium">
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Seus Eventos
              </h2>
              <Link
                href="/events"
                className="text-[#FF6B6B] hover:text-[#FF8E53] font-medium transition-colors"
              >
                Ver todos
              </Link>
            </div>

            <div className="mb-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse bg-gray-200 rounded-xl h-64"
                    ></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-600">
                  Erro ao carregar eventos: {error}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Nenhum evento encontrado
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
