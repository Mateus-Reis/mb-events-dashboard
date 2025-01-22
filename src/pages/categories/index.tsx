import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import Sidebar from "@/components/layout/Sidebar";
import CategoryModal from "@/components/modal/CategoryModal";
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal";
import { Category } from "@/types/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    category: null as Category | null,
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      setCategories(categoriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = async (data: { name: string; description: string }) => {
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: data.name,
        description: data.description,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await updateDoc(docRef, {
        id: docRef.id,
      });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleUpdate = async (data: { name: string; description: string }) => {
    if (!selectedCategory) return;

    try {
      await updateDoc(doc(db, "categories", selectedCategory.id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;

    try {
      await deleteDoc(doc(db, "categories", deleteModal.category.id));
      setDeleteModal({ open: false, category: null });
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Categorias
              </h1>
              <p className="text-gray-500">
                Gerencie as categorias dos seus eventos
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setModalOpen(true);
              }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FF8E53] text-white flex items-center gap-2 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Nova Categoria
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      {category.description || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors"
                          title="Editar categoria"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({ open: true, category })
                          }
                          className="p-2 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors"
                          title="Excluir categoria"
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
      </main>

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={selectedCategory ? handleUpdate : handleCreate}
        category={selectedCategory}
        title={selectedCategory ? "Editar Categoria" : "Nova Categoria"}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, category: null })}
        onConfirm={handleDelete}
        title={deleteModal.category?.name || ""}
      />
    </div>
  );
}
