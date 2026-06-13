import { useEffect, useState } from "react";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import { ICategoryListServer } from "../types";
import Breadcrumb from "../components/Breadcrumb";
import { Modal } from "../components/ImageModal";
import { CategoryTable } from "../components/CategoryTable";
import { CategoryModal } from "../components/CategoryModal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import {
  FaPlus,
  FaSearch,
  FaTags,
  FaFolder,
  FaFolderMinus,
  FaFilter,
} from "react-icons/fa";

export const CategoryList = () => {
  const [categories, setCategories] = useState<ICategoryListServer[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategoryListServer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshList, setRefreshList] = useState<boolean>(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // 'all' | 'active' | 'inactive'

  // Modal & Popup States
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ICategoryListServer | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ICategoryListServer | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch Categories
  useEffect(() => {
    (async function getCategories() {
      try {
        setIsLoading(true);
        const res = await httpClient.get(getCompleteUrlV1("category"));
        if (res.ok) {
          const payload = await res.json();
          const list = payload.data || [];
          setCategories(list);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshList]);

  // Client-side Search and Filter Combination
  useEffect(() => {
    let result = [...categories];

    // 1. Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (cat) =>
          cat.name?.toLowerCase().includes(q) ||
          cat.description?.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter !== "all") {
      const targetActive = statusFilter === "active";
      result = result.filter((cat) => {
        const isActive = (cat as any).isActive !== false;
        return isActive === targetActive;
      });
    }

    setFilteredCategories(result);
  }, [categories, searchQuery, statusFilter]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setOpenCategoryModal(true);
  };

  const handleOpenEdit = (cat: ICategoryListServer) => {
    setEditingCategory(cat);
    setOpenCategoryModal(true);
  };

  const handleOpenDelete = (cat: ICategoryListServer) => {
    setDeletingCategory(cat);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      setIsDeleting(true);
      const res = await httpClient.delete(
        getCompleteUrlV1(`category/${deletingCategory._id}`)
      );
      if (res.ok) {
        setRefreshList((prev) => !prev);
      } else {
        console.error("Failed to delete category on server");
        // Fallback: local optimistic delete if backend doesn't support DELETE
        setCategories((prev) => prev.filter((c) => c._id !== deletingCategory._id));
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      // Fallback
      setCategories((prev) => prev.filter((c) => c._id !== deletingCategory._id));
    } finally {
      setIsDeleting(false);
      setDeletingCategory(null);
    }
  };

  // KPI Computations
  const totalCount = categories.length;
  const activeCount = categories.filter((c) => (c as any).isActive !== false).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="space-y-6">
      {/* Upper Navigation & Breadcrumb Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Category Management", to: "/category-list" },
            ]}
          />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">
            Category Management
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Create, manage and organize product categories
          </p>
        </div>

        {/* Create Category Button */}
        <button
          onClick={handleOpenCreate}
          className="self-start md:self-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
        >
          <FaPlus size={12} />
          Create Category
        </button>
      </div>

      {/* KPI Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FaTags size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Total Categories
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {isLoading ? "..." : totalCount}
            </h3>
          </div>
        </div>

        {/* Active Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FaFolder size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Active Categories
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {isLoading ? "..." : activeCount}
            </h3>
          </div>
        </div>

        {/* Inactive Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl">
            <FaFolderMinus size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Inactive Categories
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {isLoading ? "..." : inactiveCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
        {/* Filters and Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
          {/* Search Area */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by category name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <FaFilter size={11} /> Filter Status
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Elegant Category Table Component */}
        <CategoryTable
          categories={filteredCategories}
          isLoading={isLoading}
          onView={setSelectedImage}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onCreateTrigger={handleOpenCreate}
        />
      </div>

      {/* Full Image View Modal */}
      {selectedImage && (
        <Modal onClose={() => setSelectedImage(null)}>
          <div className="p-2">
            <img
              src={selectedImage}
              alt="Category Preview"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-xl mx-auto"
            />
          </div>
        </Modal>
      )}

      {/* Create / Edit Category Modal */}
      <CategoryModal
        isOpen={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        setRefreshList={setRefreshList}
        editingCategory={editingCategory}
      />

      {/* Confirm Deletion overlay */}
      <ConfirmDeleteModal
        isOpen={!!deletingCategory}
        title="Delete Category"
        message={
          deletingCategory
            ? `Are you sure you want to delete the category "${deletingCategory.name}"? This action cannot be undone and may affect associated products.`
            : ""
        }
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  );
};
