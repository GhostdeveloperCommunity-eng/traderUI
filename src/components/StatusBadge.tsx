import React from "react";
import { 
  FaRegFileAlt, 
  FaCheckCircle, 
  FaClock, 
  FaCalendarTimes, 
  FaTimesCircle, 
  FaArchive 
} from "react-icons/fa";

interface StatusBadgeProps {
  active?: boolean;
  status?: string;
  tooltip?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ active, status, tooltip }) => {
  if (status) {
    const s = status.toLowerCase();
    let config = {
      bg: "bg-slate-50 text-slate-600 border-slate-200",
      dot: "bg-slate-400",
      icon: <FaTimesCircle size={10} />,
      label: "Inactive"
    };

    if (s === "published" || s === "active") {
      config = {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
        dot: "bg-emerald-500 animate-pulse",
        icon: <FaCheckCircle size={10} />,
        label: "Published"
      };
    } else if (s === "draft") {
      config = {
        bg: "bg-gray-100 text-gray-700 border-gray-300/50",
        dot: "bg-gray-400",
        icon: <FaRegFileAlt size={10} />,
        label: "Draft"
      };
    } else if (s === "scheduled") {
      config = {
        bg: "bg-blue-50 text-blue-700 border-blue-200/50",
        dot: "bg-blue-500",
        icon: <FaClock size={10} />,
        label: "Scheduled"
      };
    } else if (s === "expired") {
      config = {
        bg: "bg-amber-50 text-amber-700 border-amber-200/50",
        dot: "bg-amber-500",
        icon: <FaCalendarTimes size={10} />,
        label: "Expired"
      };
    } else if (s === "archived") {
      config = {
        bg: "bg-purple-50 text-purple-700 border-purple-200/50",
        dot: "bg-purple-500",
        icon: <FaArchive size={10} />,
        label: "Archived"
      };
    } else if (s === "inactive") {
      config = {
        bg: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
        icon: <FaTimesCircle size={10} />,
        label: "Inactive"
      };
    }

    return (
      <span
        title={tooltip}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all ${config.bg}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className="flex items-center gap-1 text-[11px]">
          {config.icon}
          {config.label}
        </span>
      </span>
    );
  }

  // Fallback to active boolean
  const isActive = active ?? false;
  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
          : "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

export default StatusBadge;

