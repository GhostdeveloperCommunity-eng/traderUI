import React, { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaFilter, 
  FaThLarge, 
  FaList, 
  FaUndoAlt, 
  FaChevronDown, 
  FaChevronUp 
} from "react-icons/fa";
import clsx from "clsx";

interface FilterParams {
  search: string;
  status: string;
  contentType: string;
  position: string;
  platform: string;
  startDate: string;
  endDate: string;
  sortBy: string;
}

interface BannerFiltersProps {
  filters: FilterParams;
  onChange: (newFilters: FilterParams) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const BannerFilters: React.FC<BannerFiltersProps> = ({
  filters,
  onChange,
  viewMode,
  onViewModeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onChange({ ...filters, search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleFilterChange = (key: keyof FilterParams, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    setSearchTerm("");
    onChange({
      search: "",
      status: "",
      contentType: "",
      position: "",
      platform: "",
      startDate: "",
      endDate: "",
      sortBy: "newest",
    });
  };

  const hasActiveFilters = 
    filters.status || 
    filters.contentType || 
    filters.position || 
    filters.platform || 
    filters.startDate || 
    filters.endDate;

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 p-4 shadow-sm space-y-4">
      {/* Top Bar: Search, View Switch, Toggle Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Global Search Input */}
        <div className="relative w-full md:max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            placeholder="Search by name, category, product, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
          />
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Advanced Filters Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200",
              isOpen || hasActiveFilters
                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <FaFilter size={11} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            )}
            {isOpen ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
          </button>

          {/* Reset button (Only shown if filters are active) */}
          {(hasActiveFilters || filters.search) && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer"
              title="Reset Filters"
            >
              <FaUndoAlt size={10} />
              <span>Clear</span>
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 mx-1.5 hidden md:block" />

          {/* Grid / List View Switcher */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/50">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={clsx(
                "p-2 rounded-lg cursor-pointer transition-all",
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/20"
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="Grid View"
            >
              <FaThLarge size={14} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={clsx(
                "p-2 rounded-lg cursor-pointer transition-all",
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/20"
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="List View"
            >
              <FaList size={14} />
            </button>
          </div>

        </div>
      </div>

      {/* Advanced Filters Panel (Collapsible) */}
      {isOpen && (
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Banner Type Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Link Type</label>
            <select
              value={filters.contentType}
              onChange={(e) => handleFilterChange("contentType", e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Types</option>
              <option value="category">Category Link</option>
              <option value="product">Product Link</option>
            </select>
          </div>

          {/* Position Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Position</label>
            <select
              value={filters.position}
              onChange={(e) => handleFilterChange("position", e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Positions</option>
              <option value="Top Slider">Top Slider</option>
              <option value="Middle">Middle Banner</option>
              <option value="Bottom">Bottom Banner</option>
              <option value="Sidebar">Sidebar</option>
              <option value="Popup">Popup Overlay</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Platform</label>
            <select
              value={filters.platform}
              onChange={(e) => handleFilterChange("platform", e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Platforms</option>
              <option value="Web & Mobile">Web & Mobile</option>
              <option value="Desktop Web">Desktop Web</option>
              <option value="Mobile App">Mobile App</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sort Order</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="recently-updated">Recently Updated</option>
              <option value="most-viewed">Most Viewed</option>
              <option value="most-clicked">Most Clicked</option>
              <option value="highest-ctr">Highest CTR</option>
            </select>
          </div>

        </div>
      )}
    </div>
  );
};

export default BannerFilters;
