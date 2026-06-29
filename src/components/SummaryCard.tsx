import React from "react";

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: "positive" | "neutral" | "negative";
  gradientClass?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendType = "neutral",
  gradientClass = "from-blue-50 to-indigo-50/50 border-blue-100",
}) => {
  const getTrendColor = () => {
    switch (trendType) {
      case "positive":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "negative":
        return "bg-rose-50 text-rose-700 border-rose-200/50";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/50";
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${gradientClass} p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
    >
      {/* Decorative background shape */}
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
            {trend && (
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-semibold leading-none ${getTrendColor()}`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-xs text-slate-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
