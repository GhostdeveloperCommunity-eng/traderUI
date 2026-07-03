import React from "react";
import { 
  FaEye, 
  FaEdit, 
  FaCopy, 
  FaTrash, 
  FaLaptop, 
  FaUser, 
  FaCalendarAlt,
  FaArrowRight
} from "react-icons/fa";
import { StatusBadge } from "./StatusBadge";
import { IBannerMetadata } from "../types";
import clsx from "clsx";

interface BannerCardProps {
  media: string;
  contentType: string;
  contentName: string;
  metadata: IBannerMetadata;
  onPreview: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onStatusToggle: () => void;
  onDelete: () => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({
  media,
  contentType,
  contentName,
  metadata,
  onPreview,
  onEdit,
  onDuplicate,
  onStatusToggle,
  onDelete,
}) => {
  const isPublished = metadata.status.toLowerCase() === "published";

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      {/* Banner Preview Area (With Hover Overlay) */}
      <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-100 flex-shrink-0">
        <img
          src={media}
          alt={metadata.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Soft background dark overlay */}
        <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/40 transition-all duration-300" />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className="p-3 bg-white text-slate-700 hover:text-blue-600 rounded-xl shadow-md transition-all duration-200 hover:scale-110 cursor-pointer"
            title="Detailed Preview"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-3 bg-white text-slate-700 hover:text-blue-600 rounded-xl shadow-md transition-all duration-200 hover:scale-110 cursor-pointer"
            title="Edit Banner"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="p-3 bg-white text-slate-700 hover:text-blue-600 rounded-xl shadow-md transition-all duration-200 hover:scale-110 cursor-pointer"
            title="Duplicate"
          >
            <FaCopy size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onStatusToggle(); }}
            className={clsx(
              "p-3 bg-white rounded-xl shadow-md transition-all duration-200 hover:scale-110 cursor-pointer",
              isPublished ? "text-amber-500 hover:text-amber-600" : "text-emerald-500 hover:text-emerald-600"
            )}
            title={isPublished ? "Pause Banner" : "Publish Banner"}
          >
            <StatusBadge status={isPublished ? "inactive" : "published"} tooltip="Toggle Status" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-3 bg-white text-slate-700 hover:text-red-600 rounded-xl shadow-md transition-all duration-200 hover:scale-110 cursor-pointer"
            title="Delete Banner"
          >
            <FaTrash size={14} />
          </button>
        </div>

        {/* Floating Quick Badges on Card */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          <StatusBadge status={metadata.status} />
        </div>

        <div className="absolute bottom-3 right-3 z-10 bg-slate-900/80 backdrop-blur-md text-[10px] text-white font-bold px-2 py-0.5 rounded-md border border-white/10 select-none">
          {metadata.position}
        </div>
      </div>

      {/* Card Content details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
              {metadata.title}
            </h3>
          </div>

          {/* Linked CRM Object details */}
          <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-100 rounded-xl p-2.5">
            <span className="font-semibold text-[10px] uppercase text-slate-400 select-none">Link</span>
            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
              {contentType}
            </span>
            <FaArrowRight size={10} className="text-slate-300" />
            <span className="font-semibold text-slate-600 truncate max-w-[120px]">
              {contentName}
            </span>
          </div>

          {/* Mini Metadata grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-1 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 min-w-0">
              <FaLaptop className="text-slate-400 flex-shrink-0" size={12} />
              <span className="truncate">{metadata.platform}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <FaUser className="text-slate-400 flex-shrink-0" size={12} />
              <span className="truncate">{metadata.createdBy}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 min-w-0">
              <FaCalendarAlt className="text-slate-400 flex-shrink-0" size={12} />
              <span className="truncate">
                {metadata.startDate} to {metadata.endDate}
              </span>
            </div>
          </div>
        </div>

        {/* Small stats summary border top */}
        <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-center justify-between text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Views</span>
            <span className="text-xs font-bold text-slate-700">{metadata.views.toLocaleString()}</span>
          </div>
          <div className="w-px h-6 bg-slate-100" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Clicks</span>
            <span className="text-xs font-bold text-slate-700">{metadata.clicks.toLocaleString()}</span>
          </div>
          <div className="w-px h-6 bg-slate-100" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">CTR</span>
            <span className="text-xs font-bold text-blue-600">{metadata.ctr}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
