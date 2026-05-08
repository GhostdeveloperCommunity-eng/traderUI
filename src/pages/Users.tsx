import { useEffect, useMemo, useState } from "react";
import { httpClient } from "../services/ApiService";
import { getCompleteUrlV1 } from "../utils";
import { IUser } from "../types";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import moment from "moment";
import { motion } from "framer-motion";
import {
  Users as UsersIcon,
  ShoppingCart,
  Store,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  Search,
  ChevronDown,
  Download,
  UserPlus,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   ROLE BADGE — color-coded pill for table cells
   ═══════════════════════════════════════════════════ */
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
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide uppercase ${colors}`}
    >
      {role}
    </span>
  );
};

/* ═══════════════════════════════════════════════════
   AFFILIATE CHIP — modern tag for affiliate IDs
   ═══════════════════════════════════════════════════ */
const AffiliateChip = ({ id }: { id?: string }) => {
  if (!id || id === "-") return <span className="text-slate-300">—</span>;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[11px] font-mono font-medium border border-slate-200/60">
      {id}
    </span>
  );
};

/* ═══════════════════════════════════════════════════
   STAT CARD — Premium glassmorphism card
   ═══════════════════════════════════════════════════ */
type RoleStatProps = {
  title: string;
  subtitle?: string;
  count: number;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  iconColor: string;
  trend?: number;
  isActive: boolean;
  onClick: () => void;
  index: number;
};

const RoleStatCard = ({
  title,
  subtitle,
  count,
  icon: Icon,
  gradient,
  iconBg,
  iconColor,
  trend,
  isActive,
  onClick,
  index,
}: RoleStatProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    onClick={onClick}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    className={`
      group relative rounded-2xl overflow-hidden cursor-pointer select-none
      transition-shadow duration-400
      ${
        isActive
          ? `${gradient} shadow-[0_8px_32px_rgba(54,68,214,0.28),0_0_0_1px_rgba(54,68,214,0.15)] ring-1 ring-white/20`
          : "bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]"
      }
    `}
  >
    {/* Top gradient border accent */}
    {!isActive && (
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${gradient} opacity-60`} />
    )}

    <div className="relative z-10 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p
            className={`text-[13px] font-medium tracking-wide ${
              isActive ? "text-white/70" : "text-slate-400"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-[32px] font-extrabold leading-none tracking-tight ${
              isActive ? "text-white" : "text-slate-900"
            }`}
          >
            {count.toLocaleString()}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 pt-1">
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/15 text-white/90"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <TrendingUp size={10} strokeWidth={2.5} />+{trend}%
              </span>
              {subtitle && (
                <span
                  className={`text-[10px] ${
                    isActive ? "text-white/50" : "text-slate-400"
                  }`}
                >
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
            transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
            ${isActive ? "bg-white/15 text-white" : `${iconBg} ${iconColor}`}
          `}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════
   PREMIUM TABLE — Enterprise-grade data table
   ═══════════════════════════════════════════════════ */
const PremiumTable = ({ users, activeRole }: { users: IUser[]; activeRole: string }) => {
  const getRoleStr = (u: IUser) => {
    if (Array.isArray(u.role)) return u.role[0] || "";
    return (u.role as unknown as string) || "";
  };

  const showSellerCols = activeRole === "seller" || activeRole === "";
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Register Date",
    "Role",
    "Affiliate ID",
    ...(showSellerCols ? ["Business", "GST No"] : []),
  ];

  return (
    <div className="rounded-xl border border-slate-200/70 overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-50/80 backdrop-blur-sm"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {users.map((u, idx) => (
              <motion.tr
                key={`${u.email}-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.015, 0.3) }}
                className={`group transition-colors duration-150 hover:bg-blue-50/40 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                }`}
              >
                {/* Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                      {(u.firstName?.[0] || "").toUpperCase()}
                      {(u.lastName?.[0] || "").toUpperCase()}
                    </div>
                    <p className="font-medium text-slate-800 text-[13px] leading-tight">
                      {u.firstName} {u.lastName}
                    </p>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-3.5 text-[13px] text-slate-600">
                  {u.email}
                </td>

                {/* Phone */}
                <td className="px-5 py-3.5 text-[13px] text-slate-600 font-mono">
                  {u.phoneNumber}
                </td>

                {/* Date */}
                <td className="px-5 py-3.5 text-[13px] text-slate-500">
                  {moment(u.createdAt).format("DD MMM YYYY")}
                </td>

                {/* Role Badge */}
                <td className="px-5 py-3.5">
                  <RoleBadge role={getRoleStr(u)} />
                </td>

                {/* Affiliate */}
                <td className="px-5 py-3.5">
                  <AffiliateChip id={u.affiliateId} />
                </td>

                {/* Seller columns */}
                {showSellerCols && (
                  <>
                    <td className="px-5 py-3.5 text-[13px] text-slate-600">
                      {u.seller?.businessName || (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">
                      {u.seller?.gstNumber || (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-[12px] text-slate-400">
        <span>
          Showing {users.length} result{users.length !== 1 ? "s" : ""}
        </span>
        <span>Lottmart CRM</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   ROLE CARDS CONFIG
   ═══════════════════════════════════════════════════ */
const ROLE_CARDS = [
  {
    key: "",
    title: "Total Users",
    icon: UsersIcon,
    gradient: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    trend: 12,
    subtitle: "vs last month",
  },
  {
    key: "user",
    title: "Buyers / Users",
    icon: ShoppingCart,
    gradient: "bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-700",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    trend: 8,
    subtitle: "vs last month",
  },
  {
    key: "seller",
    title: "Sellers",
    icon: Store,
    gradient: "bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    trend: 5,
    subtitle: "vs last month",
  },
  {
    key: "promoter",
    title: "Promoters",
    icon: Megaphone,
    gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    trend: 15,
    subtitle: "vs last month",
  },
  {
    key: "admin",
    title: "Admins",
    icon: ShieldCheck,
    gradient: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
] as const;

/* ═══════════════════════════════════════════════════
   TOOLBAR ROLE DROPDOWN OPTIONS
   ═══════════════════════════════════════════════════ */
const DROPDOWN_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "user", label: "User / Buyer" },
  { value: "seller", label: "Seller" },
  { value: "promoter", label: "Promoter" },
  { value: "admin", label: "Admin" },
];

/* ═══════════════════════════════════════════════════
   MAIN USERS PAGE
   ═══════════════════════════════════════════════════ */
const Users = () => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  // Active role filter — "" = all users (default)
  const [activeRole, setActiveRole] = useState<string>("");
  // Toolbar dropdown syncs with card selection
  const [dropdownRole, setDropdownRole] = useState<string>("");

  const fetchUsers = async () => {
    const query = new URLSearchParams();
    if (search) query.append("search", search.toLowerCase());
    const url = getCompleteUrlV1(`profile/getAllProfiles?${query.toString()}`);
    const res = await httpClient.get(url);
    const json = await res.json();
    const data = json.data ?? [];

    const mapped: IUser[] = data.map((u: any) => ({
      role: u.role,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      affiliateId: u.affiliateId,
      phoneNumber: u.phoneNumber,
      createdAt: u.createdAt,
      status: u.status,
      seller: u.seller
        ? {
            businessName: u.seller.businessName,
            address: u.seller.address,
            aadhaarNumber: u.seller.aadhaarNumber,
            gstNumber: u.seller.gstNumber,
          }
        : undefined,
    }));
    setAllUsers(mapped);
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  // ── Helpers ──
  const getRoleString = (u: IUser) => {
    if (Array.isArray(u.role)) return u.role[0]?.toLowerCase() || "";
    return (u.role as unknown as string)?.toLowerCase() || "";
  };

  // ── Role counts ──
  const roleCounts = useMemo(
    () => ({
      "": allUsers.length,
      user: allUsers.filter((u) => {
        const r = getRoleString(u);
        return r === "user" || r === "buyer";
      }).length,
      seller: allUsers.filter((u) => getRoleString(u) === "seller").length,
      promoter: allUsers.filter((u) => getRoleString(u) === "promoter").length,
      admin: allUsers.filter((u) => getRoleString(u) === "admin").length,
    }),
    [allUsers]
  );

  // ── Filtered users ──
  const filteredUsers = useMemo(() => {
    if (activeRole === "") return allUsers;
    if (activeRole === "user") {
      return allUsers.filter((u) => {
        const r = getRoleString(u);
        return r === "user" || r === "buyer";
      });
    }
    return allUsers.filter((u) => getRoleString(u) === activeRole);
  }, [allUsers, activeRole]);

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (value) {
        p.set("search", value);
      } else {
        p.delete("search");
      }
      return p;
    });
  };

  const handleCardClick = (roleKey: string) => {
    setActiveRole(roleKey);
    setDropdownRole(roleKey);
  };

  const handleDropdownChange = (value: string) => {
    setDropdownRole(value);
    setActiveRole(value);
  };

  const handleExport = () => {
    // Basic CSV export
    const headers = ["Name", "Email", "Phone", "Register Date", "Role", "Affiliate ID"];
    const rows = filteredUsers.map((u) => [
      `${u.firstName} ${u.lastName}`,
      u.email,
      u.phoneNumber,
      moment(u.createdAt).format("DD MMM YYYY"),
      getRoleString(u),
      u.affiliateId || "-",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lottmart-users-${moment().format("YYYY-MM-DD")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3">
      <div className="space-y-5">
        {/* ── Breadcrumb ── */}
        <div className="bg-white rounded-xl px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100">
          <Breadcrumb
            items={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Users", to: "/users" },
            ]}
          />
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ROLE_CARDS.map((card, i) => (
            <RoleStatCard
              key={card.key}
              title={card.title}
              subtitle={card.subtitle}
              count={roleCounts[card.key as keyof typeof roleCounts] || 0}
              icon={card.icon}
              gradient={card.gradient}
              iconBg={card.iconBg}
              iconColor={card.iconColor}
              trend={card.trend}
              isActive={activeRole === card.key}
              onClick={() => handleCardClick(card.key)}
              index={i}
            />
          ))}
        </div>

        {/* ── PREMIUM TOOLBAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="bg-white rounded-xl px-5 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
              />
            </div>

            {/* Role dropdown */}
            <div className="relative">
              <select
                value={dropdownRole}
                onChange={(e) => handleDropdownChange(e.target.value)}
                className="appearance-none pl-3.5 pr-9 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all hover:border-slate-300"
              >
                {DROPDOWN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Export button */}
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            >
              <Download size={15} strokeWidth={2} />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Add User button */}
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-sm hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer">
              <UserPlus size={15} strokeWidth={2} />
              <span className="hidden sm:inline">Add User</span>
            </button>

            {/* Results count */}
            <div className="ml-auto hidden md:flex items-center gap-1.5 text-[12px] text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {filteredUsers.length} result
              {filteredUsers.length !== 1 ? "s" : ""}
            </div>
          </div>
        </motion.div>

        {/* ── DATA TABLE ── */}
        <div className="hidden md:block">
          <PremiumTable users={filteredUsers} activeRole={activeRole} />
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="md:hidden space-y-3">
          {filteredUsers.map((u, idx) => (
            <motion.div
              key={`${u.email}-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-sm"
            >
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                  {(u.firstName?.[0] || "").toUpperCase()}
                  {(u.lastName?.[0] || "").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-[12px] text-slate-400 truncate">{u.email}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <RoleBadge role={getRoleString(u)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[13px]">
                <div>
                  <span className="text-slate-400">Phone</span>
                  <p className="font-medium text-slate-700 font-mono">
                    {u.phoneNumber}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Registered</span>
                  <p className="font-medium text-slate-700">
                    {moment(u.createdAt).format("DD MMM YYYY")}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Affiliate</span>
                  <p>
                    <AffiliateChip id={u.affiliateId} />
                  </p>
                </div>
                {u.seller?.businessName && (
                  <div>
                    <span className="text-slate-400">Business</span>
                    <p className="font-medium text-slate-700">
                      {u.seller.businessName}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── EMPTY STATE (only when truly zero data) ── */}
        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl border border-slate-100 py-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <UsersIcon size={24} className="text-slate-300" strokeWidth={1.5} />
            </div>
            <p className="text-slate-500 text-sm font-medium">No users found</p>
            <p className="text-slate-400 text-[13px] mt-1">
              Try adjusting your search or filter
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Users;
