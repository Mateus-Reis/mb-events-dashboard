import EventForm from "@/components/forms/EventForm";
import Sidebar from "../../components/layout/Sidebar";

export default function CreateEventPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          <EventForm />
        </div>
      </main>
    </div>
  );
}
