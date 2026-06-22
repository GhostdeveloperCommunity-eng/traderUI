import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { walletStore, WalletAccount, WalletTransaction, WithdrawalRequest } from "../utils/walletStore";
import { WalletManualOperationModal } from "../components/WalletManualOperationModal";
import {
  Wallet,
  CheckCircle,
  Clock,
  Lock,
  Percent,
  TrendingUp,
  Calendar,
  ArrowDownCircle,
  ArrowUpRight,
  ArrowDownRight,
  ListFilter,
  Layers,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export const WalletDashboard = () => {
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"credit" | "debit">("credit");

  // Hover states for custom chart tooltips
  const [dailyTooltip, setDailyTooltip] = useState<{ x: number; y: number; val: number; label: string } | null>(null);
  const [monthlyTooltip, setMonthlyTooltip] = useState<{ x: number; y: number; val: number; label: string } | null>(null);

  const loadData = () => {
    setAccounts(walletStore.getAccounts());
    setTransactions(walletStore.getTransactions());
    setWithdrawals(walletStore.getWithdrawals());
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── METRICS COMPUTATION ──
  const metrics = useMemo(() => {
    const totalWalletBalance = accounts.reduce((s, a) => s + a.availableBalance + a.pendingBalance + a.lockedBalance, 0);
    const availableBalance = accounts.reduce((s, a) => s + a.availableBalance, 0);
    const pendingBalance = accounts.reduce((s, a) => s + a.pendingBalance, 0);
    const lockedBalance = accounts.reduce((s, a) => s + a.lockedBalance, 0);

    const commissionTx = transactions.filter((t) => t.category === "commission" && t.status === "Completed");
    const totalCommission = commissionTx.reduce((s, t) => s + t.amount, 0);

    const todayStr = new Date().toISOString().split("T")[0];
    const todayCommission = commissionTx
      .filter((t) => t.createdAt.startsWith(todayStr))
      .reduce((s, t) => s + t.amount, 0);

    const thisMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyCommission = commissionTx
      .filter((t) => t.createdAt.startsWith(thisMonthStr))
      .reduce((s, t) => s + t.amount, 0);

    const totalWithdrawals = withdrawals
      .filter((w) => w.status === "Completed")
      .reduce((s, w) => s + w.amount, 0);

    return {
      totalWalletBalance,
      availableBalance,
      pendingBalance,
      lockedBalance,
      totalCommission,
      todayCommission,
      monthlyCommission,
      totalWithdrawals,
    };
  }, [accounts, transactions, withdrawals]);

  // ── QUICK ACTIONS CLICK HANDLERS ──
  const openOperationModal = (type: "credit" | "debit") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  // ── CHART DATA MOCKING (BASED ON REAL PATTERNS) ──
  const dailyCommissionData = [
    { label: "Mon", val: 4200 },
    { label: "Tue", val: 5100 },
    { label: "Wed", val: 3800 },
    { label: "Thu", val: 6200 },
    { label: "Fri", val: 5800 },
    { label: "Sat", val: 8400 },
    { label: "Sun", val: 9100 },
  ];

  const monthlyCommissionData = [
    { label: "Jan", val: 45000 },
    { label: "Feb", val: 52000 },
    { label: "Mar", val: 68000 },
    { label: "Apr", val: 59000 },
    { label: "May", val: 74000 },
    { label: "Jun", val: 82000 },
  ];

  const withdrawalTrendData = [
    { label: "Jan", val: 20000 },
    { label: "Feb", val: 35000 },
    { label: "Mar", val: 30000 },
    { label: "Apr", val: 45000 },
    { label: "May", val: 40000 },
    { label: "Jun", val: 60000 },
  ];

  const roleEarnings = useMemo(() => {
    const roles = { promoter: 0, seller: 0, user: 0, admin: 0 };
    accounts.forEach((a) => {
      if (a.role in roles) {
        roles[a.role as keyof typeof roles] += a.lifetimeEarnings;
      }
    });
    const total = Object.values(roles).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(roles).map(([role, val]) => ({
      role: role.toUpperCase(),
      val,
      percentage: Math.round((val / total) * 100),
    }));
  }, [accounts]);

  // ── SVG CHART RENDER HELPERS ──
  const maxDaily = Math.max(...dailyCommissionData.map((d) => d.val)) * 1.15;
  const maxMonthly = Math.max(...monthlyCommissionData.map((d) => d.val)) * 1.15;
  const maxWithdrawal = Math.max(...withdrawalTrendData.map((d) => d.val)) * 1.15;

  return (
    <div className="p-3 space-y-6">
      {/* ── Breadcrumb & Top Bar ── */}
      <div className="bg-white rounded-2xl px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Wallet Module", to: "/wallet/dashboard" },
            { label: "Overview", to: "/wallet/dashboard" },
          ]}
        />
        <div className="flex gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Sync Payouts</span>
          </button>
        </div>
      </div>

      {/* ── Top KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Wallet Balance */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Total Wallet Balance</span>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ₹ {metrics.totalWalletBalance.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 flex items-center gap-1">
            <span className="text-emerald-500 font-bold flex items-center">↑ 4.2%</span> vs last week
          </p>
        </div>

        {/* KPI 2: Available Balance */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Available Balance</span>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ₹ {metrics.availableBalance.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 flex items-center gap-1">
            <span className="text-emerald-500 font-bold">92%</span> of total balance liquid
          </p>
        </div>

        {/* KPI 3: Pending Balance */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Pending Balance</span>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ₹ {metrics.pendingBalance.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 flex items-center gap-1">
            Awaiting clearance cycles
          </p>
        </div>

        {/* KPI 4: Locked Balance */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Locked Balance</span>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ₹ {metrics.lockedBalance.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Lock size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 flex items-center gap-1">
            Held due to compliance/disputes
          </p>
        </div>

        {/* KPI 5: Total Commission */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Total Commission Paid</span>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ₹ {metrics.totalCommission.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Percent size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 flex items-center gap-1">
            Aggregated platform payout
          </p>
        </div>

        {/* KPI 6: Today's Commission */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Today's Commission</span>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ₹ {metrics.todayCommission.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <TrendingUp size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 flex items-center gap-1">
            Realtime campaign commissions
          </p>
        </div>

        {/* KPI 7: Monthly Commission */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Monthly Commission</span>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ₹ {metrics.monthlyCommission.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Calendar size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 flex items-center gap-1">
            Accumulated this month
          </p>
        </div>

        {/* KPI 8: Total Withdrawals */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[120px] group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">Total Withdrawals</span>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ₹ {metrics.totalWithdrawals.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 flex items-center gap-1">
            Cleared to users' bank/UPI
          </p>
        </div>
      </div>

      {/* ── Quick Actions & Role-wise Earnings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Quick Actions</h3>
            <p className="text-xs text-slate-400 mb-6">Perform instantaneous manual operations or jump to specific tables.</p>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <Link
              to="/wallet/transactions"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:bg-blue-50/40 hover:border-blue-200/50 transition-all group"
            >
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                <ListFilter size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-700">Transactions</span>
            </Link>

            <Link
              to="/wallet/withdrawals"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:bg-emerald-50/40 hover:border-emerald-200/50 transition-all group"
            >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                <ArrowDownCircle size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-700">Withdrawals</span>
            </Link>

            <button
              onClick={() => openOperationModal("credit")}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:bg-indigo-50/40 hover:border-indigo-200/50 transition-all group text-left cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                <ArrowUpRight size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Manual Credit</p>
                <span className="text-[10px] text-slate-400">Add funds</span>
              </div>
            </button>

            <button
              onClick={() => openOperationModal("debit")}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:bg-rose-50/40 hover:border-rose-200/50 transition-all group text-left cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
                <ArrowDownRight size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Manual Debit</p>
                <span className="text-[10px] text-slate-400">Deduct funds</span>
              </div>
            </button>
          </div>
        </div>

        {/* Role Wise Earnings (Progress-based Breakdown) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Role Wise Earnings</h3>
              <span className="text-xs text-slate-400">Aggregated lifetime earnings</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Distribution of commissions and payouts by user roles.</p>
          </div>

          <div className="space-y-4">
            {roleEarnings.map((item, idx) => {
              const bgColors = ["bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-slate-700"];
              const bgLight = ["bg-blue-50", "bg-violet-50", "bg-amber-50", "bg-slate-100"];
              const colorText = ["text-blue-700", "text-violet-700", "text-amber-700", "text-slate-700"];

              const color = bgColors[idx % bgColors.length];
              const lightColor = bgLight[idx % bgLight.length];
              const textCol = colorText[idx % colorText.length];

              return (
                <div key={item.role} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      {item.role === "USER" ? "USER / BUYER" : item.role}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">₹{item.val.toLocaleString("en-IN")}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${lightColor} ${textCol}`}>
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Commission (SVG Area Chart with Tooltip) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Daily Commission</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Last 7 days commission activity</p>
            </div>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> Area Trend
            </span>
          </div>

          <div className="h-64 w-full relative">
            {/* SVG Chart */}
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1" />

              {/* Area & Line */}
              {(() => {
                const points = dailyCommissionData.map((d, i) => {
                  const x = 40 + (i * 440) / 6;
                  const y = 170 - (d.val / maxDaily) * 150;
                  return { x, y, val: d.val, label: d.label };
                });

                const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
                const areaD = `${pathD} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#dailyGrad)" />
                    <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#ffffff"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={() => {
                          setDailyTooltip({
                            x: p.x - 30,
                            y: p.y - 45,
                            val: p.val,
                            label: p.label,
                          });
                        }}
                        onMouseLeave={() => setDailyTooltip(null)}
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Custom Tooltip */}
            {dailyTooltip && (
              <div
                className="absolute bg-slate-950 border border-slate-800 text-white rounded-xl shadow-xl p-2 text-[10px] pointer-events-none z-10"
                style={{ left: `${(dailyTooltip.x / 500) * 100}%`, top: `${(dailyTooltip.y / 200) * 100}%` }}
              >
                <p className="font-bold text-[9px] text-slate-400 uppercase tracking-wider">{dailyTooltip.label}</p>
                <p className="font-extrabold text-[11px] text-emerald-400">₹{dailyTooltip.val}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between px-8 text-[11px] text-slate-400 font-medium">
            {dailyCommissionData.map((d) => (
              <span key={d.label}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* Chart 2: Monthly Commission (SVG Bar Chart) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Monthly Commission</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Last 6 months commission payout volume</p>
            </div>
            <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Layers size={12} /> Bar Chart
            </span>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1" />

              {monthlyCommissionData.map((d, i) => {
                const x = 60 + (i * 420) / 5;
                const barHeight = (d.val / maxMonthly) * 140;
                const y = 170 - barHeight;
                const barWidth = 24;

                return (
                  <g key={d.label}>
                    {/* Defs/Gradients inside are not allowed, reuse page level or standard colors */}
                    <rect
                      x={x - barWidth / 2}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      fill="#6366f1"
                      className="cursor-pointer hover:fill-indigo-600 transition-colors"
                      onMouseEnter={() => {
                        setMonthlyTooltip({
                          x: x - 40,
                          y: y - 45,
                          val: d.val,
                          label: d.label,
                        });
                      }}
                      onMouseLeave={() => setMonthlyTooltip(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom Tooltip */}
            {monthlyTooltip && (
              <div
                className="absolute bg-slate-950 border border-slate-800 text-white rounded-xl shadow-xl p-2 text-[10px] pointer-events-none z-10"
                style={{ left: `${(monthlyTooltip.x / 500) * 100}%`, top: `${(monthlyTooltip.y / 200) * 100}%` }}
              >
                <p className="font-bold text-[9px] text-slate-400 uppercase tracking-wider">{monthlyTooltip.label}</p>
                <p className="font-extrabold text-[11px] text-indigo-400">₹{monthlyTooltip.val.toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between px-10 text-[11px] text-slate-400 font-medium">
            {monthlyCommissionData.map((d) => (
              <span key={d.label}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* Chart 3: Withdrawal Trend (SVG Curved Line Chart) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Withdrawal Trend</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Monthly total withdrawals volume</p>
            </div>
            <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> Volume Line
            </span>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1" />

              {(() => {
                const points = withdrawalTrendData.map((d, i) => {
                  const x = 50 + (i * 400) / 5;
                  const y = 170 - (d.val / maxWithdrawal) * 140;
                  return { x, y, val: d.val, label: d.label };
                });

                // Quadratic/cubic curve formulation
                let pathD = `M ${points[0].x} ${points[0].y}`;
                for (let i = 0; i < points.length - 1; i++) {
                  const xMid = (points[i].x + points[i + 1].x) / 2;
                  const yMid = (points[i].y + points[i + 1].y) / 2;
                  pathD += ` Q ${points[i].x} ${points[i].y}, ${xMid} ${yMid}`;
                }
                pathD += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;

                return (
                  <>
                    <path d={pathD} fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#f43f5e"
                        strokeWidth="2.5"
                      />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="flex justify-between px-10 text-[11px] text-slate-400 font-medium">
            {withdrawalTrendData.map((d) => (
              <span key={d.label}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* Top Promoters & Sellers Summary Mini List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Top Performing Wallets</h3>
              <Link to="/wallet/accounts" className="text-[11px] text-blue-600 font-bold hover:underline flex items-center">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Highest lifetime payouts on Lottmart CRM</p>
          </div>

          <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-center">
            {accounts
              .sort((a, b) => b.lifetimeEarnings - a.lifetimeEarnings)
              .slice(0, 4)
              .map((acc) => (
                <div key={acc.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {acc.userName[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{acc.userName}</p>
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 uppercase">
                        {acc.role}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">₹{acc.lifetimeEarnings.toLocaleString("en-IN")}</p>
                    <p className="text-[9px] text-slate-400">Lifetime Earnings</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Manual Operation Popup Modal */}
      <WalletManualOperationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
        initialType={modalType}
      />
    </div>
  );
};
