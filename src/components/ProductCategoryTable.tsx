import React, { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { FaEye, FaEdit, FaTrashAlt, FaFolderOpen, FaPlus } from "react-icons/fa";
import moment from "moment";

export interface IProductCategoryListServer {
  _id: string;
  name: string;
  media: string;
  categoryId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive?: boolean;
  categoryDetails?: {
    _id: string;
    media: string;
    name: string;
  };
  subCategoryCount?: number;
}

interface ProductCategoryTableProps {
  productCategories: IProductCategoryListServer[];
  isLoading: boolean;
  onView: (imageUrl: string) => void;
  onEdit: (productCategory: IProductCategoryListServer) => void;
  onDelete: (productCategory: IProductCategoryListServer) => void;
  onManageSubCategories: (productCategory: IProductCategoryListServer) => void;
  onCreateTrigger?: () => void;
}

export const ProductCategoryTable: React.FC<ProductCategoryTableProps> = ({
  productCategories,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onManageSubCategories,
  onCreateTrigger,
}) => {
  // Local Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(productCategories.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = productCategories.slice(startIndex, startIndex + itemsPerPage);



  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/75 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-left">Image</th>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left">Parent Category</th>
                <th className="py-4 px-6 text-left">Description</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Products Count</th>
                <th className="py-4 px-6 text-left">Created Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-slate-100 rounded w-28" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-slate-100 rounded w-28" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-slate-100 rounded w-48" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 bg-slate-100 rounded-full w-16" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-slate-100 rounded w-12" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-slate-100 rounded w-20" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                      <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                      <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (productCategories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100/50">
          <FaFolderOpen size={40} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Sub Categories Found</h3>
        <p className="text-slate-400 text-sm mt-1 max-w-sm leading-relaxed">
          Create sub category items to further structure and classify your catalogue.
        </p>
        {onCreateTrigger && (
          <button
            onClick={onCreateTrigger}
            className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
          >
            <FaPlus size={12} />
            Create Sub Category
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
      <div className="min-w-full overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50/75 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6 text-left">Image</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Parent Category</th>
              <th className="py-4 px-6 text-left">Description</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Product Sub Categories</th>
              <th className="py-4 px-6 text-left">Created Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
            {paginatedCategories.map((pc) => {
              const isActive = pc.isActive !== false;
              const parentName = pc.categoryDetails?.name || "N/A";
              return (
                <tr
                  key={pc._id}
                  className="hover:bg-slate-50/40 transition-colors group"
                >
                  {/* Image */}
                  <td className="py-3 px-6 whitespace-nowrap">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:shadow-sm transition-all">
                      {pc.media ? (
                        <img
                          src={pc.media}
                          alt={pc.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-slate-300 font-semibold text-sm">
                          {pc.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      {pc.media && (
                        <button
                          type="button"
                          onClick={() => onView(pc.media)}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          title="View Larger"
                        >
                          <FaEye size={14} />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-6 whitespace-nowrap">
                    <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                      {pc.name}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                      ID: {pc._id.substring(0, 8)}...
                    </div>
                  </td>

                  {/* Parent Category */}
                  <td className="py-3 px-6 whitespace-nowrap text-slate-600 font-medium">
                    {parentName}
                  </td>

                  {/* Description */}
                  <td className="py-3 px-6 max-w-xs">
                    <div className="text-slate-500 font-medium truncate text-sm">
                      {pc.description || <span className="text-slate-300 italic">No description provided</span>}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-6 whitespace-nowrap">
                    <StatusBadge active={isActive} />
                  </td>

                  {/* Product Sub Categories Count */}
                  <td className="py-3 px-6 whitespace-nowrap">
                    <button
                      onClick={() => onManageSubCategories(pc)}
                      className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/50 hover:bg-blue-100 active:bg-blue-200 transition-all cursor-pointer"
                      title="View Product Sub Categories"
                    >
                      {(pc as any).productSubCategoriesCount || 0} Product Sub Categories
                    </button>
                  </td>

                  {/* Created Date */}
                  <td className="py-3 px-6 whitespace-nowrap text-slate-500 font-medium">
                    {moment(pc.createdAt || pc.updatedAt).format("MMM DD, YYYY")}
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-6 whitespace-nowrap text-right">
                    <div className="inline-flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => onManageSubCategories(pc)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all"
                        title="Manage Product Sub Categories"
                      >
                        <span className="flex items-center gap-1 text-xs font-semibold">
                          <FaFolderOpen size={14} />
                          <span className="hidden sm:inline">Product Sub Categories</span>
                        </span>
                      </button>
                      {pc.media && (
                        <button
                          type="button"
                          onClick={() => onView(pc.media)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all"
                          title="View Image"
                        >
                          <FaEye size={15} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onEdit(pc)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-50 rounded-xl transition-all"
                        title="Edit Sub Category"
                      >
                        <FaEdit size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(pc)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-xl transition-all"
                        title="Delete Sub Category"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-xs text-slate-400 font-semibold">
            Showing <span className="text-slate-600">{startIndex + 1}</span> to{" "}
            <span className="text-slate-600">
              {Math.min(startIndex + itemsPerPage, productCategories.length)}
            </span>{" "}
            of <span className="text-slate-600">{productCategories.length}</span> sub categories
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    currentPage === p
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 bg-white border border-slate-200"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategoryTable;
