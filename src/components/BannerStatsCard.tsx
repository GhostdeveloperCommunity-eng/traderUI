import React from "react";
import clsx from "clsx";

interface Trend {
  value: number | string;
  label: string;
  isPositive: boolean;
}

interface BannerStatsCardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  trend?: Trend;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export const BannerStatsCard: React.FC<BannerStatsCardProps> = ({
  title,
  count,
  icon,
  trend,
  className,
  onClick,
  active = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "p-6 rounded-2xl bg-white border cursor-pointer select-none transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-md",
        active
          ? "border-blue-500 ring-2 ring-blue-500/10"
          : "border-slate-100/80 hover:border-slate-200 hover:-translate-y-0.5",
        className
      )}
    >
      {/* Decorative Background Blob */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 rounded-full transition-transform duration-500 group-hover:scale-110 -z-0 opacity-60" />

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-2 flex-1 min-w-0">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block truncate">
            {title}
          </span>
          <span className="text-3xl font-bold text-slate-800 block tracking-tight">
            {count}
          </span>
        </div>

        <div
          className={clsx(
            "p-3 rounded-xl transition-colors duration-200 flex items-center justify-center",
            active
              ? "bg-blue-50 text-blue-600"
              : "bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700"
          )}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 relative z-10">
          <span
            className={clsx(
              "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border",
              trend.isPositive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                : "bg-red-50 text-red-700 border-red-200/50"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}
          </span>
          <span className="text-xs text-slate-400 tracking-wide truncate">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default BannerStatsCard;
