import React from "react";

interface StatusBadgeProps {
  active: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ active }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors ${
        active
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
          : "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
};

export default StatusBadge;
