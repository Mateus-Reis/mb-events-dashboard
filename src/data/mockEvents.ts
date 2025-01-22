export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  createdBy: string;
  categories: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  attendees: number;
}

export const mockEvents = [
  {
    id: "1",
    title: "Conferência de Inovação Tecnológica 2024",
    description: "Um evento premier mostrando os últimos avanços em tecnologia.",
    date: "2024-09-20T14:00:00",
    location: "Centro de Convenções, Centro da Cidade",
    price: 550,
    availableTickets: 1000,
    createdBy: "João Silva",
    categories: ["tecnologia", "inovação"],
    tags: ["tech", "startup", "inovação"],
    createdAt: new Date(),
    updatedAt: new Date(),
    attendees: 2854
  },
  {
    id: "2",
    title: "Festival de Música Eletrônica",
    description: "O maior festival de música eletrônica do ano.",
    date: "2024-08-15T18:00:00",
    location: "Parque de Exposições",
    price: 180,
    availableTickets: 5000,
    createdBy: "Maria Santos",
    categories: ["música", "entretenimento"],
    tags: ["música", "eletrônica", "festival"],
    createdAt: new Date(),
    updatedAt: new Date(),
    attendees: 5000
  },
  {
    id: "3",
    title: "Workshop de Marketing Digital",
    description: "Aprenda as últimas estratégias de marketing digital.",
    date: "2024-07-10T09:00:00",
    location: "Hotel Business Center",
    price: 297,
    availableTickets: 100,
    createdBy: "Pedro Costa",
    categories: ["educação", "marketing"],
    tags: ["marketing", "digital", "workshop"],
    createdAt: new Date(),
    updatedAt: new Date(),
    attendees: 150
  },
  {
    id: "4",
    title: "Expo Gastronomia 2024",
    description: "Uma exposição dos melhores chefs e restaurantes.",
    date: "2024-10-05T11:00:00",
    location: "Centro Gastronômico",
    price: 85,
    availableTickets: 2000,
    createdBy: "Ana Oliveira",
    categories: ["gastronomia", "cultura"],
    tags: ["food", "culinária", "expo"],
    createdAt: new Date(),
    updatedAt: new Date(),
    attendees: 3200
  },
  {
    id: "5",
    title: "Feira de Artesanato",
    description: "Mostra de artesanato local e regional.",
    date: "2024-06-28T10:00:00",
    location: "Praça Central",
    price: 0,
    availableTickets: 1000,
    createdBy: "Carlos Mendes",
    categories: ["arte", "cultura"],
    tags: ["artesanato", "arte", "feira"],
    createdAt: new Date(),
    updatedAt: new Date(),
    attendees: 1500
  }
];