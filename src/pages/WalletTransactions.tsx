import { useState, useEffect, useMemo } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { walletStore, WalletTransaction } from "../utils/walletStore";
import moment from "moment";
import { Search, ChevronDown, Download, RefreshCw, Calendar } from "lucide-react";

// Role-badge mapping
const ROLE_BADGE_MAP: Record<string, string> = {
  user: "bg-blue-50 text-blue-700 border-blue-200/80",
  buyer: "bg-blue-50 text-blue-700 border-blue-200/80",
  seller: "bg-violet-50 text-violet-700 border-violet-200/80",
  promoter: "bg-amber-50 text-amber-700 border-amber-200/80",
  admin: "bg-rose-50 text-rose-700 border-rose-200/80",
};

const RoleBadge = ({ role }: { role: string }) => {
  const r = role.toLowerCase();
  const colors = ROLE_BADGE_MAP[r] || "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide uppercase ${colors}`}>
      {role}
    </span>
  );
};

export const WalletTransactions = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = () => {
    setTransactions(walletStore.getTransactions());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.walletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRole = roleFilter ? tx.role === roleFilter : true;
      const matchStatus = statusFilter ? tx.status === statusFilter : true;
      const matchType = typeFilter ? tx.type === typeFilter : true;
      const matchCategory = categoryFilter ? tx.category === categoryFilter : true;

      // Date ranges matching
      let matchDate = true;
      if (startDate) {
        matchDate = matchDate && moment(tx.createdAt).isSameOrAfter(moment(startDate).startOf("day"));
      }
      if (endDate) {
        matchDate = matchDate && moment(tx.createdAt).isSameOrBefore(moment(endDate).endOf("day"));
      }

      return matchSearch && matchRole && matchStatus && matchType && matchCategory && matchDate;
    });
  }, [transactions, searchQuery, roleFilter, statusFilter, typeFilter, categoryFilter, startDate, endDate]);

  const handleExport = () => {
    const headers = [
      "Transaction ID",
      "Wallet ID",
      "User",
      "Role",
      "Amount",
      "Type",
      "Category",
      "Reference",
      "Status",
      "Created At",
    ];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.walletId,
      tx.userName,
      tx.role,
      tx.amount,
      tx.type,
      tx.category,
      tx.reference,
      tx.status,
      moment(tx.createdAt).format("DD MMM YYYY HH:mm:ss"),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lottmart-transactions-${moment().format("YYYY-MM-DD")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("");
    setStatusFilter("");
    setTypeFilter("");
    setCategoryFilter("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="p-3 space-y-6">
      {/* ── Breadcrumb ── */}
      <div className="bg-white rounded-xl px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Wallet Module", to: "/wallet/dashboard" },
            { label: "Transactions", to: "/wallet/transactions" },
          ]}
        />
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-slate-50 text-xs rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Reload</span>
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Advanced Payout Filters Toolbar ── */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, user, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50/50 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            />
          </div>

          {/* Role selector */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-9 py-2 border border-slate-200 bg-white text-xs rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-semibold text-slate-600"
            >
              <option value="">All Roles</option>
              <option value="promoter">Promoter</option>
              <option value="seller">Seller</option>
              <option value="user">User / Buyer</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Status selector */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-9 py-2 border border-slate-200 bg-white text-xs rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-semibold text-slate-600"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Hold">Hold</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Type selector */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-9 py-2 border border-slate-200 bg-white text-xs rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-semibold text-slate-600"
            >
              <option value="">All Types</option>
              <option value="credit">Credit (+)</option>
              <option value="debit">Debit (-)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-9 py-2 border border-slate-200 bg-white text-xs rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-semibold text-slate-600"
            >
              <option value="">All Categories</option>
              <option value="commission">Commission</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="bonus">Bonus</option>
              <option value="penalty">Penalty</option>
              <option value="correction">Correction</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-all px-2 py-1 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-50 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1 text-slate-400">
            <Calendar size={14} /> Custom Date Filter:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-1.5 border border-slate-200 rounded-xl bg-slate-50/50 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 cursor-pointer"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-1.5 border border-slate-200 rounded-xl bg-slate-50/50 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ── Enterprise Grid Data Table ── */}
      <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/60 font-semibold text-slate-500 uppercase tracking-wider text-left">
                <th className="px-5 py-4">Transaction ID</th>
                <th className="px-5 py-4">User Details</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4 text-right">Adjustment Amount</th>
                <th className="px-5 py-4">Flow Type</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Reference Source</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    className={`group transition-colors hover:bg-blue-50/20 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"
                    }`}
                  >
                    {/* ID */}
                    <td className="px-5 py-4 font-mono font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                      {tx.id}
                    </td>

                    {/* User */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-slate-800 text-[13px]">{tx.userName}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Wallet: {tx.walletId}</p>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <RoleBadge role={tx.role} />
                    </td>

                    {/* Amount */}
                    <td className={`px-5 py-4 text-right font-extrabold ${tx.type === "credit" ? "text-emerald-600" : "text-slate-600"}`}>
                      {tx.type === "credit" ? "+" : "-"} ₹{tx.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Flow Type */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        tx.type === "credit" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>{tx.type}</span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 uppercase text-[10px] font-bold text-slate-400">
                      {tx.category}
                    </td>

                    {/* Reference */}
                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {tx.reference}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        tx.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : tx.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : tx.status === "Processing"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          tx.status === "Completed"
                            ? "bg-emerald-500"
                            : tx.status === "Pending"
                            ? "bg-amber-500 animate-pulse"
                            : tx.status === "Processing"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`} />
                        {tx.status}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-5 py-4 text-slate-400 text-[11px] font-semibold">
                      {moment(tx.createdAt).format("DD MMM YYYY, hh:mm A")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center p-12 text-slate-400 text-xs font-semibold">
                    No transactions matching the criteria were found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-slate-400 text-[11px] font-bold flex justify-between bg-slate-50/20">
          <span>Showing {filteredTransactions.length} transaction entries</span>
          <span>Lottmart Admin Audit</span>
        </div>
      </div>

      {/* ── Mobile Layout ── */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm">
            <div className="flex justify-between items-start pb-2 border-b border-slate-50">
              <div>
                <p className="text-xs font-bold text-slate-800">{tx.userName}</p>
                <p className="text-[9px] text-slate-400 font-mono">{tx.id} | {tx.walletId}</p>
              </div>
              <RoleBadge role={tx.role} />
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-[11px] font-medium text-slate-500">
              <div>
                <span>Amount</span>
                <p className={`text-xs font-bold ${tx.type === "credit" ? "text-emerald-600" : "text-slate-700"}`}>
                  {tx.type === "credit" ? "+" : "-"} ₹{tx.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <span>Category</span>
                <p className="text-xs font-bold text-slate-600 uppercase text-[10px]">{tx.category}</p>
              </div>
              <div>
                <span>Reference</span>
                <p className="text-xs font-bold text-slate-700">{tx.reference}</p>
              </div>
              <div>
                <span>Status</span>
                <p>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    tx.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>{tx.status}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-semibold text-right">
              {moment(tx.createdAt).format("DD MMM YYYY, hh:mm A")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
