import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X, Home, CalendarDays, LogOut, Tags } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: CalendarDays, label: "Eventos", href: "/events" },
    { icon: Tags, label: "Categorias", href: "/categories" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const isActiveRoute = (href: string) => {
    return router.pathname === href;
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-gray-700 hover:text-[#FF6B6B] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:sticky md:top-0 z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FF8E53] bg-clip-text text-transparent">
              MB Events
            </h1>
          </div>

          <nav className="flex-1 px-4">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center space-x-2 p-3 rounded-lg mb-2 transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FF8E53] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#FF6B6B]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon
                    size={20}
                    className={isActive ? "text-white" : "text-gray-700"}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-3 rounded-lg w-full text-gray-700 hover:bg-gray-50 hover:text-[#FF6B6B] transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
