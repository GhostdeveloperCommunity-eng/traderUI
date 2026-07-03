import React, { useState } from "react";
import { 
  FaEye, 
  FaEdit, 
  FaCopy, 
  FaTrash, 
  FaSort, 
  FaSortUp, 
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight
} from "react-icons/fa";
import { StatusBadge } from "./StatusBadge";
import { IBannerItem } from "../types";
import clsx from "clsx";

interface BannerTableProps {
  banners: IBannerItem[];
  onPreview: (item: IBannerItem) => void;
  onEdit: (item: IBannerItem) => void;
  onDuplicate: (item: IBannerItem) => void;
  onStatusToggle: (item: IBannerItem) => void;
  onDelete: (item: IBannerItem) => void;
}

type SortField = "title" | "contentType" | "views" | "clicks" | "ctr" | "updatedAt";
type SortOrder = "asc" | "desc";

export const BannerTable: React.FC<BannerTableProps> = ({
  banners,
  onPreview,
  onEdit,
  onDuplicate,
  onStatusToggle,
  onDelete,
}) => {
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortedBanners = () => {
    return [...banners].sort((a, b) => {
      let valA: any = "";
      let valB: any = "";

      if (sortField === "title") {
        valA = a.metadata.title.toLowerCase();
        valB = b.metadata.title.toLowerCase();
      } else if (sortField === "contentType") {
        valA = a.contentType.toLowerCase();
        valB = b.contentType.toLowerCase();
      } else if (sortField === "views") {
        valA = a.metadata.views;
        valB = b.metadata.views;
      } else if (sortField === "clicks") {
        valA = a.metadata.clicks;
        valB = b.metadata.clicks;
      } else if (sortField === "ctr") {
        valA = parseFloat(String(a.metadata.ctr));
        valB = parseFloat(String(b.metadata.ctr));
      } else if (sortField === "updatedAt") {
        valA = new Date(a.metadata.updatedAt).getTime();
        valB = new Date(b.metadata.updatedAt).getTime();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedBanners = getSortedBanners();
  const totalPages = Math.ceil(sortedBanners.length / itemsPerPage);
  const paginatedBanners = sortedBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <FaSort className="text-slate-300 ml-1 inline" size={10} />;
    return sortOrder === "asc" ? (
      <FaSortUp className="text-blue-500 ml-1 inline" size={10} />
    ) : (
      <FaSortDown className="text-blue-500 ml-1 inline" size={10} />
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-4 px-6 w-20">Thumbnail</th>
              <th className="py-4 px-6 cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort("title")}>
                Banner Name <SortIcon field="title" />
              </th>
              <th className="py-4 px-6 cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort("contentType")}>
                Placement <SortIcon field="contentType" />
              </th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Schedule</th>
              <th className="py-4 px-4 text-right cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort("views")}>
                Views <SortIcon field="views" />
              </th>
              <th className="py-4 px-4 text-right cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort("clicks")}>
                Clicks <SortIcon field="clicks" />
              </th>
              <th className="py-4 px-4 text-right cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort("ctr")}>
                CTR <SortIcon field="ctr" />
              </th>
              <th className="py-4 px-6 text-right cursor-pointer hover:bg-slate-100/60 transition-colors" onClick={() => handleSort("updatedAt")}>
                Updated <SortIcon field="updatedAt" />
              </th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 text-sm divide-y divide-slate-100">
            {paginatedBanners.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-3 px-6">
                  <div 
                    onClick={() => onPreview(item)} 
                    className="w-12 h-8 rounded-lg overflow-hidden border border-slate-100 bg-slate-900 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500/30 transition-all flex-shrink-0"
                  >
                    <img src={item.media} alt={item.metadata.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-3 px-6 font-semibold text-slate-800">
                  <div className="max-w-[200px] truncate" title={item.metadata.title}>
                    {item.metadata.title}
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                        {item.contentType}
                      </span>
                      <FaArrowRight size={8} className="text-slate-300" />
                      <span className="text-xs text-slate-500 font-semibold truncate max-w-[100px]" title={item.contentName}>
                        {item.contentName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {item.metadata.position} • {item.metadata.platform}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <StatusBadge status={item.metadata.status} />
                </td>
                <td className="py-3 px-6 text-xs text-slate-500 font-medium">
                  <div className="whitespace-nowrap">{item.metadata.startDate}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">to</div>
                  <div className="whitespace-nowrap">{item.metadata.endDate}</div>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-slate-700">
                  {item.metadata.views.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-slate-700">
                  {item.metadata.clicks.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-bold text-blue-600">
                  {item.metadata.ctr}%
                </td>
                <td className="py-3 px-6 text-right text-xs text-slate-400 font-medium whitespace-nowrap">
                  {new Date(item.metadata.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onPreview(item)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Quick Details"
                    >
                      <FaEye size={12} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => onDuplicate(item)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate"
                    >
                      <FaCopy size={12} />
                    </button>
                    <button
                      onClick={() => onStatusToggle(item)}
                      className={clsx(
                        "p-1.5 rounded-lg transition-colors cursor-pointer text-xs",
                        item.metadata.status.toLowerCase() === "published"
                          ? "text-amber-500 hover:bg-amber-50"
                          : "text-emerald-500 hover:bg-emerald-50"
                      )}
                      title={item.metadata.status.toLowerCase() === "published" ? "Unpublish" : "Publish"}
                    >
                      {item.metadata.status.toLowerCase() === "published" ? "Pause" : "Run"}
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-8 text-slate-400 font-medium">
                  No banners matching current filter conditions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 select-none bg-slate-50/30">
          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="font-semibold text-slate-600">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-semibold text-slate-600">
              {Math.min(currentPage * itemsPerPage, banners.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-600">{banners.length}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <FaChevronLeft size={10} />
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all",
                  currentPage === index + 1
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800"
                )}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerTable;
