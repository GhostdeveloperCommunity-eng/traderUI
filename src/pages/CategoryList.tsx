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
  ProductCategoryTable,
  IProductCategoryListServer,
} from "../components/ProductCategoryTable";
import { ProductCategoryModal } from "../components/ProductCategoryModal";
import {
  SubCategoryTable,
  ISubCategoryListServer,
} from "../components/SubCategoryTable";
import { SubCategoryModal } from "../components/SubCategoryModal";
import {
  FaPlus,
  FaSearch,
  FaTags,
  FaFolder,
  FaFolderMinus,
  FaFilter,
} from "react-icons/fa";

type ViewState = "category" | "product-category" | "sub-category";

export const CategoryList = () => {
  // Navigation View State
  const [viewState, setViewState] = useState<ViewState>("category");
  const [selectedCategory, setSelectedCategory] = useState<ICategoryListServer | null>(null);
  const [selectedProductCategory, setSelectedProductCategory] = useState<IProductCategoryListServer | null>(null);

  // Data Lists
  const [categories, setCategories] = useState<ICategoryListServer[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategoryListServer[]>([]);

  const [productCategories, setProductCategories] = useState<IProductCategoryListServer[]>([]);
  const [filteredProductCategories, setFilteredProductCategories] = useState<IProductCategoryListServer[]>([]);

  const [subCategories, setSubCategories] = useState<ISubCategoryListServer[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<ISubCategoryListServer[]>([]);

  // States to keep track of all items for counts
  const [allProductCategories, setAllProductCategories] = useState<IProductCategoryListServer[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<ISubCategoryListServer[]>([]);

  // Loading & Refresh State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshList, setRefreshList] = useState<boolean>(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // 'all' | 'active' | 'inactive'

  // Fetch All Taxonomy items for counts
  useEffect(() => {
    (async function fetchAllTaxonomy() {
      try {
        const pcRes = await httpClient.get(getCompleteUrlV1("category/product-category"));
        if (pcRes.ok) {
          const payload = await pcRes.json();
          setAllProductCategories(payload.data || []);
        }
        const scRes = await httpClient.get(getCompleteUrlV1("category/sub-category"));
        if (scRes.ok) {
          const payload = await scRes.json();
          setAllSubCategories(payload.data || []);
        }
      } catch (err) {
        console.error("Error loading taxonomy counts:", err);
      }
    })();
  }, [refreshList]);

  // Modal & Popup States
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ICategoryListServer | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ICategoryListServer | null>(null);

  const [openProductCategoryModal, setOpenProductCategoryModal] = useState<boolean>(false);
  const [editingProductCategory, setEditingProductCategory] = useState<IProductCategoryListServer | null>(null);
  const [deletingProductCategory, setDeletingProductCategory] = useState<IProductCategoryListServer | null>(null);

  const [openSubCategoryModal, setOpenSubCategoryModal] = useState<boolean>(false);
  const [editingSubCategory, setEditingSubCategory] = useState<ISubCategoryListServer | null>(null);
  const [deletingSubCategory, setDeletingSubCategory] = useState<ISubCategoryListServer | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Clear query and filters on view switch
  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("all");
  }, [viewState]);

  // Fetch Items based on View State
  useEffect(() => {
    (async function fetchItems() {
      try {
        setIsLoading(true);
        if (viewState === "category") {
          const res = await httpClient.get(getCompleteUrlV1("category"));
          if (res.ok) {
            const payload = await res.json();
            setCategories(payload.data || []);
          }
        } else if (viewState === "product-category" && selectedCategory) {
          const res = await httpClient.get(
            getCompleteUrlV1("category/product-category", { categoryId: selectedCategory._id })
          );
          if (res.ok) {
            const payload = await res.json();
            setProductCategories(payload.data || []);
          }
        } else if (viewState === "sub-category" && selectedProductCategory) {
          const res = await httpClient.get(
            getCompleteUrlV1("category/sub-category", {
              categoryId: selectedCategory?._id,
              productCategoryId: selectedProductCategory._id,
            })
          );
          if (res.ok) {
            const payload = await res.json();
            setSubCategories(payload.data || []);
          }
        }
      } catch (error) {
        console.error("Error loading items:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [viewState, selectedCategory, selectedProductCategory, refreshList]);

  // Centralized hook to reset active parent selection states based on current viewState
  useEffect(() => {
    if (viewState === "category") {
      setSelectedCategory(null);
      setSelectedProductCategory(null);
    } else if (viewState === "product-category") {
      setSelectedProductCategory(null);
    }
  }, [viewState]);

  // Client-side Search and Filter Combination for Categories
  useEffect(() => {
    if (viewState !== "category") return;
    let result = [...categories];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (cat) =>
          cat.name?.toLowerCase().includes(q) ||
          cat.description?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      const targetActive = statusFilter === "active";
      result = result.filter((cat) => {
        const isActive = (cat as any).isActive !== false;
        return isActive === targetActive;
      });
    }
    setFilteredCategories(result);
  }, [categories, searchQuery, statusFilter, viewState]);

  // Client-side Search and Filter Combination for Product Categories
  useEffect(() => {
    if (viewState !== "product-category") return;
    let result = [...productCategories];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (pc) =>
          pc.name?.toLowerCase().includes(q) ||
          pc.description?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      const targetActive = statusFilter === "active";
      result = result.filter((pc) => {
        const isActive = pc.isActive !== false;
        return isActive === targetActive;
      });
    }
    setFilteredProductCategories(result);
  }, [productCategories, searchQuery, statusFilter, viewState]);

  // Client-side Search and Filter Combination for Sub Categories
  useEffect(() => {
    if (viewState !== "sub-category") return;
    let result = [...subCategories];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (sc) =>
          sc.name?.toLowerCase().includes(q) ||
          sc.description?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      const targetActive = statusFilter === "active";
      result = result.filter((sc) => {
        const isActive = sc.isActive !== false;
        return isActive === targetActive;
      });
    }
    setFilteredSubCategories(result);
  }, [subCategories, searchQuery, statusFilter, viewState]);

  // CRUD Trigger Handlers
  const handleOpenCreate = () => {
    if (viewState === "category") {
      setEditingCategory(null);
      setOpenCategoryModal(true);
    } else if (viewState === "product-category") {
      setEditingProductCategory(null);
      setOpenProductCategoryModal(true);
    } else if (viewState === "sub-category") {
      setEditingSubCategory(null);
      setOpenSubCategoryModal(true);
    }
  };

  const handleOpenEdit = (item: any) => {
    if (viewState === "category") {
      setEditingCategory(item);
      setOpenCategoryModal(true);
    } else if (viewState === "product-category") {
      setEditingProductCategory(item);
      setOpenProductCategoryModal(true);
    } else if (viewState === "sub-category") {
      setEditingSubCategory(item);
      setOpenSubCategoryModal(true);
    }
  };

  // Delete Action Confirmations
  const handleConfirmCategoryDelete = async () => {
    if (!deletingCategory) return;
    try {
      setIsDeleting(true);
      const res = await httpClient.delete(
        getCompleteUrlV1(`category/${deletingCategory._id}`)
      );
      if (res.ok) {
        setRefreshList((prev) => !prev);
      } else {
        console.error("Failed to delete category");
        setCategories((prev) => prev.filter((c) => c._id !== deletingCategory._id));
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setCategories((prev) => prev.filter((c) => c._id !== deletingCategory._id));
    } finally {
      setIsDeleting(false);
      setDeletingCategory(null);
    }
  };

  const handleConfirmProductCategoryDelete = async () => {
    if (!deletingProductCategory) return;
    try {
      setIsDeleting(true);
      const res = await httpClient.delete(
        getCompleteUrlV1(`category/product-category/${deletingProductCategory._id}`)
      );
      if (res.ok) {
        setRefreshList((prev) => !prev);
      } else {
        console.error("Failed to delete sub category");
        setProductCategories((prev) => prev.filter((c) => c._id !== deletingProductCategory._id));
      }
    } catch (err) {
      console.error("Error deleting sub category:", err);
      setProductCategories((prev) => prev.filter((c) => c._id !== deletingProductCategory._id));
    } finally {
      setIsDeleting(false);
      setDeletingProductCategory(null);
    }
  };

  const handleConfirmSubCategoryDelete = async () => {
    if (!deletingSubCategory) return;
    try {
      setIsDeleting(true);
      const res = await httpClient.delete(
        getCompleteUrlV1(`category/sub-category/${deletingSubCategory._id}`)
      );
      if (res.ok) {
        setRefreshList((prev) => !prev);
      } else {
        console.error("Failed to delete product sub category");
        setSubCategories((prev) => prev.filter((c) => c._id !== deletingSubCategory._id));
      }
    } catch (err) {
      console.error("Error deleting product sub category:", err);
      setSubCategories((prev) => prev.filter((c) => c._id !== deletingSubCategory._id));
    } finally {
      setIsDeleting(false);
      setDeletingSubCategory(null);
    }
  };

  // Manage Children Handlers (Navigation Transitions)
  const handleManageProductCategories = (cat: ICategoryListServer) => {
    setSelectedCategory(cat);
    setViewState("product-category");
  };

  const handleManageSubCategories = (pc: IProductCategoryListServer) => {
    setSelectedProductCategory(pc);
    setViewState("sub-category");
  };

  // KPI Counts computation
  let totalCount = 0;
  let activeCount = 0;
  let inactiveCount = 0;

  if (viewState === "category") {
    totalCount = categories.length;
    activeCount = categories.filter((c) => (c as any).isActive !== false).length;
    inactiveCount = totalCount - activeCount;
  } else if (viewState === "product-category") {
    totalCount = productCategories.length;
    activeCount = productCategories.filter((c) => c.isActive !== false).length;
    inactiveCount = totalCount - activeCount;
  } else if (viewState === "sub-category") {
    totalCount = subCategories.length;
    activeCount = subCategories.filter((c) => c.isActive !== false).length;
    inactiveCount = totalCount - activeCount;
  }

  // Dynamic Breadcrumb Setup
  const breadcrumbItems: { label: string; to?: string; onClick?: () => void }[] = [
    { label: "Dashboard", to: "/dashboard" },
  ];
  if (viewState === "category") {
    breadcrumbItems.push({ label: "Category Management" });
  } else if (viewState === "product-category") {
    breadcrumbItems.push(
      { label: "Category Management", onClick: () => setViewState("category") },
      { label: selectedCategory?.name || "Category" },
      { label: "Sub Categories" }
    );
  } else if (viewState === "sub-category") {
    breadcrumbItems.push(
      { label: "Category Management", onClick: () => setViewState("category") },
      {
        label: selectedCategory?.name || "Category",
        onClick: () => setViewState("product-category"),
      },
      { label: selectedProductCategory?.name || "Sub Category" },
      { label: "Product Sub Categories" }
    );
  }

  // Header Details Setup
  let headerTitle = "Category Management";
  let headerSubtitle = "Create, manage and organize sub categories";

  if (viewState === "product-category") {
    headerTitle = `${selectedCategory?.name} - Sub Categories`;
    headerSubtitle = "Manage sub categories within this taxonomy level";
  } else if (viewState === "sub-category") {
    headerTitle = `${selectedProductCategory?.name} - Product Sub Categories`;
    headerSubtitle = "Manage product sub categories within this taxonomy level";
  }

  return (
    <div className="space-y-6">
      {/* Upper Navigation & Breadcrumb Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">
            {headerTitle}
          </h1>
          <p className="text-sm text-slate-400 font-medium">{headerSubtitle}</p>
        </div>

        {/* Create Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 self-start md:self-auto">
          {viewState === "category" && (
            <>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setOpenCategoryModal(true);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
              >
                <FaPlus size={12} />
                Create Category
              </button>
              <button
                onClick={() => {
                  setEditingProductCategory(null);
                  setOpenProductCategoryModal(true);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-2"
              >
                <FaPlus size={12} />
                Create Sub Category
              </button>
              <button
                onClick={() => {
                  setEditingSubCategory(null);
                  setOpenSubCategoryModal(true);
                }}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-violet-500/10 flex items-center gap-2"
              >
                <FaPlus size={12} />
                Create Product Sub Category
              </button>
            </>
          )}

          {viewState === "product-category" && (
            <>
              <button
                onClick={() => {
                  setEditingProductCategory(null);
                  setOpenProductCategoryModal(true);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
              >
                <FaPlus size={12} />
                Create Sub Category
              </button>
              <button
                onClick={() => {
                  setEditingSubCategory(null);
                  setOpenSubCategoryModal(true);
                }}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-violet-500/10 flex items-center gap-2"
              >
                <FaPlus size={12} />
                Create Product Sub Category
              </button>
            </>
          )}

          {viewState === "sub-category" && (
            <button
              onClick={() => {
                setEditingSubCategory(null);
                setOpenSubCategoryModal(true);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
            >
              <FaPlus size={12} />
              Create Product Sub Category
            </button>
          )}
        </div>
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
              {viewState === "category"
                ? "Total Categories"
                : viewState === "product-category"
                ? "Total Sub Categories"
                : "Total Product Sub Categories"}
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
              Active Count
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
              Inactive Count
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
              placeholder={
                viewState === "category"
                  ? "Search by category name..."
                  : viewState === "product-category"
                  ? "Search by sub category name..."
                  : "Search by product sub category name..."
              }
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
              <option value="all">All Items</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Dynamic Table Rendering */}
        {viewState === "category" && (
          <CategoryTable
            categories={filteredCategories.map((cat) => {
              const subs = allProductCategories.filter((pc) => pc.categoryId === cat._id);
              const prodSubs = allSubCategories.filter((sc) => sc.categoryId === cat._id);
              return {
                ...cat,
                subCategoriesCount: subs.length,
                productSubCategoriesCount: prodSubs.length,
              };
            })}
            isLoading={isLoading}
            onView={setSelectedImage}
            onEdit={handleOpenEdit}
            onDelete={setDeletingCategory}
            onManageProductCategories={handleManageProductCategories}
            onCreateTrigger={handleOpenCreate}
          />
        )}

        {viewState === "product-category" && (
          <ProductCategoryTable
            productCategories={filteredProductCategories.map((pc) => {
              const prodSubs = allSubCategories.filter((sc) => sc.productCategoryId === pc._id);
              return {
                ...pc,
                productSubCategoriesCount: prodSubs.length,
              };
            })}
            isLoading={isLoading}
            onView={setSelectedImage}
            onEdit={handleOpenEdit}
            onDelete={setDeletingProductCategory}
            onManageSubCategories={handleManageSubCategories}
            onCreateTrigger={handleOpenCreate}
          />
        )}

        {viewState === "sub-category" && (
          <SubCategoryTable
            subCategories={filteredSubCategories}
            isLoading={isLoading}
            onView={setSelectedImage}
            onEdit={handleOpenEdit}
            onDelete={setDeletingSubCategory}
            onCreateTrigger={handleOpenCreate}
          />
        )}
      </div>

      {/* Full Image View Modal */}
      {selectedImage && (
        <Modal onClose={() => setSelectedImage(null)}>
          <div className="p-2">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[50vh] object-contain rounded-2xl shadow-xl mx-auto"
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

      {/* Create / Edit Sub Category Modal */}
      <ProductCategoryModal
        isOpen={openProductCategoryModal}
        onClose={() => setOpenProductCategoryModal(false)}
        setRefreshList={setRefreshList}
        editingProductCategory={editingProductCategory}
        defaultCategoryId={selectedCategory?._id}
      />

      {/* Create / Edit Product Sub Category Modal */}
      <SubCategoryModal
        isOpen={openSubCategoryModal}
        onClose={() => setOpenSubCategoryModal(false)}
        setRefreshList={setRefreshList}
        editingSubCategory={editingSubCategory}
        defaultCategoryId={selectedCategory?._id}
        defaultProductCategoryId={selectedProductCategory?._id}
      />

      {/* Category Deletion Overlay */}
      <ConfirmDeleteModal
        isOpen={!!deletingCategory}
        title="Delete Category"
        message={
          deletingCategory
            ? `Are you sure you want to delete the category "${deletingCategory.name}"? This action cannot be undone and may affect associated products.`
            : ""
        }
        isDeleting={isDeleting}
        onConfirm={handleConfirmCategoryDelete}
        onCancel={() => setDeletingCategory(null)}
      />

      {/* Sub Category Deletion Overlay */}
      <ConfirmDeleteModal
        isOpen={!!deletingProductCategory}
        title="Delete Sub Category"
        message={
          deletingProductCategory
            ? `Are you sure you want to delete the sub category "${deletingProductCategory.name}"? This action cannot be undone and may affect associated products.`
            : ""
        }
        isDeleting={isDeleting}
        onConfirm={handleConfirmProductCategoryDelete}
        onCancel={() => setDeletingProductCategory(null)}
      />

      {/* Product Sub Category Deletion Overlay */}
      <ConfirmDeleteModal
        isOpen={!!deletingSubCategory}
        title="Delete Product Sub Category"
        message={
          deletingSubCategory
            ? `Are you sure you want to delete the product sub category "${deletingSubCategory.name}"? This action cannot be undone and may affect associated products.`
            : ""
        }
        isDeleting={isDeleting}
        onConfirm={handleConfirmSubCategoryDelete}
        onCancel={() => setDeletingSubCategory(null)}
      />
    </div>
  );
};

