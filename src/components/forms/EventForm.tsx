import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, Upload, X, Loader } from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/firebase";
import { Event, Category } from "@/types/types";

import defaultEventImage from "@/images/mb-events-banner-default.png";

interface EventFormProps {
  eventId?: string;
  event?: Event;
}

export default function EventForm({ eventId, event }: EventFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [modality, setModality] = useState<"Presencial" | "Online">(
    "Presencial"
  );
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [price, setPrice] = useState("");
  const [availableTickets, setAvailableTickets] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);

  const DEFAULT_IMAGE_URL = defaultEventImage.src;

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);

      let formattedDate = "";
      let formattedTime = "";

      const dateObj = event.date.toDate();
      formattedDate = dateObj
        .toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "/");

      formattedTime = dateObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setDate(formattedDate);
      setTime(formattedTime);

      setLocation(event.location);
      setModality(event.modality);
      setIsHighlighted(event.isHighlighted);
      setPrice(formatPrice(event.price));
      setAvailableTickets(event.availableTickets);
      setSelectedCategories(event.categories || []);
      setImagePreview(event.imageUrl || DEFAULT_IMAGE_URL);
    }
  }, [event, DEFAULT_IMAGE_URL]);

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
      }));
      setCategories(categoriesData);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (input: string) => {
    const cleanInput = input.replace(/\D/g, "");
    let formattedInput = cleanInput;

    if (cleanInput.length >= 3) {
      formattedInput = `${cleanInput.slice(0, 2)}/${cleanInput.slice(2)}`;
    }
    if (cleanInput.length >= 5) {
      formattedInput = `${cleanInput.slice(0, 2)}/${cleanInput.slice(
        2,
        4
      )}/${cleanInput.slice(4, 8)}`;
    }

    return formattedInput.slice(0, 10);
  };

  const formatPrice = (input: string) => {
    const cleanInput = input.replace(/[^\d,]/g, "");

    return `R$ ${cleanInput.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const cleanPrice = (formattedPrice: string) => {
    return formattedPrice
      .replace("R$ ", "")
      .replace(/\./g, "")
      .replace(",", ".");
  };

  const handleCategoryClick = (category: Category) => {
    const isSelected = selectedCategories.some((c) => c.id === category.id);
    if (isSelected) {
      setSelectedCategories(
        selectedCategories.filter((c) => c.id !== category.id)
      );
    } else {
      setSelectedCategories([
        ...selectedCategories,
        { id: category.id, name: category.name },
      ]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = event?.imageUrl || DEFAULT_IMAGE_URL;
      if (imageFile) {
        const storage = getStorage();
        const fileRef = ref(
          storage,
          `event-images/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(fileRef);
      } else if (!imagePreview) {
        imageUrl = DEFAULT_IMAGE_URL;
      }

      const [day, month, year] = date.split("/");
      const [hours, minutes] = time.split(":");

      const eventDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );
      const eventTimestamp = Timestamp.fromDate(eventDateTime);

      const eventData: Omit<
        Event,
        "id" | "createdBy" | "createdAt" | "attendees"
      > = {
        title,
        description,
        date: eventTimestamp,
        time,
        location,
        modality,
        isHighlighted,
        price: cleanPrice(price),
        availableTickets,
        categories: selectedCategories,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (eventId) {
        await updateDoc(doc(db, "events", eventId), eventData);
      } else {
        const newEventData = {
          ...eventData,
          createdBy: user?.uid,
          createdAt: serverTimestamp(),
          attendees: 0,
        };

        const docRef = await addDoc(collection(db, "events"), newEventData);
        await updateDoc(doc(db, "events", docRef.id), { id: docRef.id });
      }

      router.push("/events");
    } catch (error) {
      console.error("Erro ao criar/atualizar evento:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={() => router.push("/events")}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold ml-2">
          {eventId ? "Editar Evento" : "Criar Evento"}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FF6B6B] focus:border-[#FF6B6B] sm:text-sm"
          />
        </div>

        {/* Descrição */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FF6B6B] focus:border-[#FF6B6B] sm:text-sm resize-none"
          />
        </div>

        {/* Data e Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data
            </label>
            <input
              type="text"
              id="date"
              value={date}
              onChange={(e) => setDate(formatDate(e.target.value))}
              required
              placeholder="00/00/0000"
              maxLength={10}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FF6B6B] focus:border-[#FF6B6B] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Hora
            </label>
            <input
              type="text"
              id="time"
              value={time}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length <= 4) {
                  value = value.replace(/^(\d{1,2})(\d{0,2})/, "$1:$2");
                  if (value.length === 2 && parseInt(value) > 23) {
                    value = "23";
                  } else if (
                    value.length === 5 &&
                    parseInt(value.slice(3)) > 59
                  ) {
                    value = value.slice(0, 3) + "59";
                  }
                  setTime(value);
                }
              }}
              required
              placeholder="00:00"
              maxLength={5}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FF6B6B] focus:border-[#FF6B6B] sm:text-sm"
            />
          </div>
        </div>

        {/* Modalidade e Local */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="modality"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Modalidade
            </label>
            <select
              id="modality"
              value={modality}
              onChange={(e) =>
                setModality(e.target.value as "Presencial" | "Online")
              }
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FF6B6B] focus:border-[#FF6B6B] sm:text-sm"
            >
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {modality === "Presencial" ? "Endereço" : "Link do Evento"}
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FF6B6B] focus:border-[#FF6B6B] sm:text-sm"
            />
          </div>
        </div>

        {/* Destacar Evento */}
        <div className="flex items-center">
          <label
            htmlFor="highlight"
            className="mr-3 text-sm font-medium text-gray-700"
          >
            Destacar Evento
          </label>
          <div
            onClick={() => setIsHighlighted(!isHighlighted)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              isHighlighted ? "bg-[#FF6B6B]" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isHighlighted ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Imagem do Evento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagem do Evento
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
            <div className="space-y-1 text-center w-full">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(DEFAULT_IMAGE_URL);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full cursor-pointer">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm text-gray-600">
                      Selecionar arquivo
                    </span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF até 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preço e Ingressos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preço
            </label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => {
                const numericInput = e.target.value.replace(/[^\d,]/g, "");
                setPrice(formatPrice(numericInput));
              }}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FF6B6B] focus:border-[#FF6B6B] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="availableTickets"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ingressos Disponíveis
            </label>
            <input
              type="text"
              id="availableTickets"
              value={availableTickets}
              onChange={(e) => {
                const numericInput = e.target.value.replace(/\D/g, "");
                setAvailableTickets(numericInput);
              }}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#FF6B6B] focus:border-[#FF6B6B] sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categorias
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                  selectedCategories.some((c) => c.id === category.id)
                    ? "bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FF8E53] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                title={category.description}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Envio */}
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FF8E53] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5 mr-2" />
              ) : eventId ? (
                "Atualizar Evento"
              ) : (
                "Criar Evento"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
