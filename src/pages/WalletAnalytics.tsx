import { useState, useEffect, useMemo } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { walletStore, WalletAccount, WalletTransaction, WithdrawalRequest } from "../utils/walletStore";
import {
  TrendingUp,
  Award,
  Percent,
  ArrowDownCircle,
  Target,
  ShoppingBag,
} from "lucide-react";

// Mock Leaderboard details matching roles
const MOCK_PROMOTERS = [
  { name: "Amit Kumar", conversions: 48, earnings: 45000 },
  { name: "Priya Nair", conversions: 32, earnings: 28000 },
  { name: "Neha Patel", conversions: 24, earnings: 18000 },
];

const MOCK_CONNECTORS = [
  { name: "Vikram Malhotra", invites: 156, earnings: 8900 },
  { name: "Rahul Deshmukh", invites: 110, earnings: 6200 },
  { name: "Kunal Sen", invites: 88, earnings: 4800 },
];

const MOCK_SELLERS = [
  { name: "Ramesh Sharma", sales: 840, earnings: 450000 },
  { name: "Suresh Gupta", sales: 610, earnings: 310000 },
  { name: "Ananya Roy", sales: 490, earnings: 240000 },
];

export const WalletAnalytics = () => {
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  // Chart tooltip hover
  const [growthHover, setGrowthHover] = useState<{ x: number; y: number; val: number; label: string } | null>(null);

  useEffect(() => {
    setAccounts(walletStore.getAccounts());
    setTransactions(walletStore.getTransactions());
    setWithdrawals(walletStore.getWithdrawals());
  }, []);

  // Compute values
  const stats = useMemo(() => {
    const commissionTx = transactions.filter((t) => t.category === "commission" && t.status === "Completed");
    const totalCommission = commissionTx.reduce((s, t) => s + t.amount, 0);

    const totalWithdrawals = withdrawals
      .filter((w) => w.status === "Completed")
      .reduce((s, w) => s + w.amount, 0);

    // Calculate growth percentages
    const lastMonthCommission = 85000; // Mock reference
    const currentMonthCommission = totalCommission || 120000;
    const growthPercent = Math.round(((currentMonthCommission - lastMonthCommission) / lastMonthCommission) * 100);

    return { totalCommission, totalWithdrawals, growthPercent };
  }, [transactions, withdrawals]);

  // Monthly growth data points
  const growthData = [
    { label: "Jan", val: 32000 },
    { label: "Feb", val: 48000 },
    { label: "Mar", val: 56000 },
    { label: "Apr", val: 78000 },
    { label: "May", val: 94000 },
    { label: "Jun", val: 124000 },
  ];

  const maxGrowth = Math.max(...growthData.map((d) => d.val)) * 1.1;

  // Role wise distributions
  const roleDistribution = useMemo(() => {
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

  return (
    <div className="p-3 space-y-6">
      {/* ── Breadcrumb ── */}
      <div className="bg-white rounded-xl px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Wallet Module", to: "/wallet/dashboard" },
            { label: "Executive Analytics", to: "/wallet/analytics" },
          ]}
        />
      </div>

      {/* ── Executive Aggregations ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Commission Disbursed</span>
            <h3 className="text-2xl font-black text-slate-800">₹{stats.totalCommission.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 font-medium">Accumulated promoter & seller rules</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Percent size={20} strokeWidth={2.2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Net Withdrawals</span>
            <h3 className="text-2xl font-black text-slate-800">₹{stats.totalWithdrawals.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 font-medium">Cleared settlements to bank/UPI gateways</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownCircle size={20} strokeWidth={2.2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Month-on-Month Growth</span>
            <h3 className="text-2xl font-black text-emerald-600">+{stats.growthPercent}%</h3>
            <p className="text-[10px] text-slate-400 font-medium">Commission increase vs last month</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={20} strokeWidth={2.2} />
          </div>
        </div>
      </div>

      {/* ── Monthly Growth Graph & Role Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">MoM Commission Growth</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Platform commissions progression curve</p>
            </div>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> Projections
            </span>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1" />

              {(() => {
                const points = growthData.map((d, i) => {
                  const x = 40 + (i * 430) / 5;
                  const y = 170 - (d.val / maxGrowth) * 140;
                  return { x, y, val: d.val, label: d.label };
                });

                const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
                const areaD = `${pathD} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#growthGrad)" />
                    <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" />
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#10b981"
                        strokeWidth="2"
                        className="cursor-pointer"
                        onMouseEnter={() => setGrowthHover({ x: p.x - 30, y: p.y - 45, val: p.val, label: p.label })}
                        onMouseLeave={() => setGrowthHover(null)}
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            {growthHover && (
              <div
                className="absolute bg-slate-950 border border-slate-800 text-white rounded-xl shadow-xl p-2 text-[10px] pointer-events-none z-10"
                style={{ left: `${(growthHover.x / 500) * 100}%`, top: `${(growthHover.y / 200) * 100}%` }}
              >
                <p className="font-bold text-[9px] text-slate-400 uppercase tracking-wider">{growthHover.label}</p>
                <p className="font-extrabold text-[11px] text-emerald-400">₹{growthHover.val.toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between px-10 text-[11px] text-slate-400 font-medium">
            {growthData.map((d) => (
              <span key={d.label}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* Role Breakdown donut-bars */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Role Earnings Share</h3>
            <p className="text-[11px] text-slate-400">Net lifetime payout contribution</p>
          </div>

          <div className="space-y-4">
            {roleDistribution.map((item, idx) => {
              const colors = ["bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-slate-700"];
              return (
                <div key={item.role} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                    <span>{item.role === "USER" ? "USER / BUYER" : item.role}</span>
                    <span className="text-slate-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[idx % colors.length]}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Leaderboards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Promoters */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Award size={15} className="text-amber-500" />
              <span>Top Promoters</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Highest marketing referral conversions</p>
          </div>

          <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-center">
            {MOCK_PROMOTERS.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-300 w-4">#{idx + 1}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                    <span className="text-[10px] text-slate-400">{item.conversions} conversions</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">₹{item.earnings.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Connectors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Target size={15} className="text-blue-500" />
              <span>Top Connectors</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Leading network and lead creators</p>
          </div>

          <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-center">
            {MOCK_CONNECTORS.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-300 w-4">#{idx + 1}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                    <span className="text-[10px] text-slate-400">{item.invites} invites</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 font-semibold">₹{item.earnings.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <ShoppingBag size={15} className="text-violet-500" />
              <span>Top Sellers</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Highest marketplace sales commission</p>
          </div>

          <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-center">
            {MOCK_SELLERS.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-300 w-4">#{idx + 1}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                    <span className="text-[10px] text-slate-400">{item.sales} sales</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">₹{item.earnings.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
