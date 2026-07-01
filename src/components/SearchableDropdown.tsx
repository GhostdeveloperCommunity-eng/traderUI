import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaSearch, FaTimes } from "react-icons/fa";

export interface DropdownOption {
  label: string;
  value: string;
}

interface SearchableDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
  onSearchChange?: (query: string) => void;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  disabled = false,
  error,
  onSearchChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options locally if no custom search is defined
  const filteredOptions = onSearchChange
    ? options
    : options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2.5 rounded-xl border text-left text-sm bg-slate-50/50 focus:outline-none focus:ring-2 transition-all flex items-center justify-between ${
            disabled
              ? "opacity-60 cursor-not-allowed border-slate-200"
              : error
              ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
              : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          }`}
        >
          <span className={selectedOption ? "text-slate-800 font-medium" : "text-slate-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1.5">
            {value && !disabled && (
              <span
                onClick={handleClear}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all"
                title="Clear selection"
              >
                <FaTimes size={11} />
              </span>
            )}
            <FaChevronDown
              size={12}
              className={`text-slate-400 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-[300px] flex flex-col">
            {/* Search Input */}
            <div className="relative border-b border-slate-100 p-2 flex-shrink-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                <FaSearch size={12} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs placeholder:text-slate-400 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-[220px] py-1 text-slate-700 text-sm">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-blue-50/50 font-semibold text-blue-600 hover:bg-blue-50"
                          : ""
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-xs text-slate-400 text-center italic">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
