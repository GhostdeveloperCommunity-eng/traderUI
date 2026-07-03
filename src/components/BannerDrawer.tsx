import React, { useEffect, useRef } from "react";
import { 
  FaTimes, 
  FaCalendarAlt, 
  FaUser, 
  FaLink, 
  FaEdit, 
  FaCopy, 
  FaTrash, 
  FaDownload, 
  FaMousePointer,
  FaEye,
  FaPercent
} from "react-icons/fa";
import { StatusBadge } from "./StatusBadge";
import { BannerPreview } from "./BannerPreview";
import { IBannerItem } from "../types";
import clsx from "clsx";

interface BannerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  banner: IBannerItem | null;
  onEdit: () => void;
  onDuplicate: () => void;
  onStatusToggle: () => void;
  onDelete: () => void;
}

export const BannerDrawer: React.FC<BannerDrawerProps> = ({
  isOpen,
  onClose,
  banner,
  onEdit,
  onDuplicate,
  onStatusToggle,
  onDelete,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !banner) return null;

  const isPublished = banner.metadata.status.toLowerCase() === "published";
  const priorityColor = 
    banner.metadata.priority?.toLowerCase() === "high" 
      ? "bg-red-50 text-red-700 border-red-200" 
      : banner.metadata.priority?.toLowerCase() === "medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  const handleDownload = () => {
    if (!banner.media) return;
    const a = document.createElement("a");
    a.href = banner.media;
    a.download = `${banner.metadata.title.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div
          ref={drawerRef}
          className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between border-l border-slate-100 transform transition-transform duration-300 slide-in-from-right-full h-full"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 truncate max-w-[280px]">
                {banner.metadata.title}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Banner ID: {banner._id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Drawer Body Scroll Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Visual Live Preview Frame */}
            <BannerPreview 
              src={banner.media} 
              contentType={banner.contentType} 
              contentName={banner.contentName} 
            />

            {/* Performance metrics dashboard */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <FaEye size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Views</span>
                  </div>
                  <span className="text-lg font-bold text-slate-700">{banner.metadata.views.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <FaMousePointer size={11} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Clicks</span>
                  </div>
                  <span className="text-lg font-bold text-slate-700">{banner.metadata.clicks.toLocaleString()}</span>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-blue-500/80 mb-1">
                    <FaPercent size={11} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">CTR</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{banner.metadata.ctr}%</span>
                </div>
              </div>
            </div>

            {/* Config metadata fields */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Details & Rules</h3>
              
              <div className="grid grid-cols-2 gap-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={banner.metadata.status} />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Priority</span>
                  <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border mt-1", priorityColor)}>
                    {banner.metadata.priority || "Medium"}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Linked Content</span>
                  <div className="flex items-center gap-2 mt-1.5 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <FaLink size={12} className="text-slate-400" />
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                      {banner.contentType}
                    </span>
                    <span className="font-semibold text-slate-700 truncate">
                      {banner.contentName}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Placement Platform</span>
                  <span className="font-semibold text-slate-700 block mt-1">{banner.metadata.platform}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Display Position</span>
                  <span className="font-semibold text-slate-700 block mt-1">{banner.metadata.position}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Schedule Duration</span>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold mt-1">
                    <FaCalendarAlt className="text-slate-400" />
                    <span>{banner.metadata.startDate}</span>
                    <span className="text-slate-300 font-normal">to</span>
                    <span>{banner.metadata.endDate}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Description</span>
                  <p className="text-slate-600 leading-relaxed font-medium mt-1">
                    {banner.metadata.description || "No description provided for this marketing banner."}
                  </p>
                </div>
              </div>
            </div>

            {/* Audit log details */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-[11px] text-slate-400 font-medium space-y-2">
              <div className="flex items-center gap-2">
                <FaUser size={10} className="text-slate-300" />
                <span>Created by: <span className="text-slate-600 font-bold">{banner.metadata.createdBy}</span></span>
              </div>
              {banner.metadata.updatedBy && (
                <div className="flex items-center gap-2">
                  <FaUser size={10} className="text-slate-300" />
                  <span>Last updated by: <span className="text-slate-600 font-bold">{banner.metadata.updatedBy}</span></span>
                </div>
              )}
              {banner.metadata.createdAt && (
                <div className="flex items-center gap-2">
                  <FaCalendarAlt size={10} className="text-slate-300" />
                  <span>Created: <span className="text-slate-600 font-semibold">{new Date(banner.metadata.createdAt).toLocaleString()}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaCalendarAlt size={10} className="text-slate-300" />
                <span>Updated: <span className="text-slate-600 font-semibold">{new Date(banner.metadata.updatedAt).toLocaleString()}</span></span>
              </div>
            </div>

          </div>

          {/* Sticky Actions Bar at the bottom */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2.5 justify-end">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FaDownload size={11} />
              <span>Download</span>
            </button>
            
            <button
              onClick={onStatusToggle}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer",
                isPublished
                  ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              )}
            >
              {isPublished ? "Pause" : "Publish"}
            </button>

            <button
              onClick={onDuplicate}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FaCopy size={11} />
              <span>Duplicate</span>
            </button>

            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FaEdit size={11} />
              <span>Edit</span>
            </button>

            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FaTrash size={11} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDrawer;
