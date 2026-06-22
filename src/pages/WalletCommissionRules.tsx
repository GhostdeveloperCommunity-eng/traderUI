import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../components/Breadcrumb";
import { walletStore, CommissionRule } from "../utils/walletStore";
import { Plus, X, Layers, AlertCircle, ToggleLeft, ToggleRight, Settings } from "lucide-react";
import { Button } from "../components/Button";

interface RuleForm {
  name: string;
  role: "promoter" | "seller" | "user" | "all";
  commission: string;
  campaign: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Inactive";
}

export const WalletCommissionRules = () => {
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { register, handleSubmit, reset } = useForm<RuleForm>({
    defaultValues: {
      name: "",
      role: "promoter",
      commission: "",
      campaign: "",
      priority: "Medium",
      status: "Active",
    },
  });

  const loadData = () => {
    setRules(walletStore.getCommissionRules());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      return roleFilter ? r.role === roleFilter : true;
    });
  }, [rules, roleFilter]);

  const handleToggleStatus = (id: string) => {
    walletStore.toggleCommissionRule(id);
    loadData();
  };

  const onSubmitRule = (data: RuleForm) => {
    walletStore.addCommissionRule(data);
    loadData();
    setSuccessMsg(`Successfully created commission rule: "${data.name}"`);
    setIsModalOpen(false);
    reset();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="p-3 space-y-6">
      {/* ── Breadcrumb ── */}
      <div className="bg-white rounded-xl px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Wallet Module", to: "/wallet/dashboard" },
            { label: "Commission Rules", to: "/wallet/commission-rules" },
          ]}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Create Payout Rule</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={15} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── Filter Toolbar ── */}
      <div className="bg-white rounded-xl px-5 py-3 border border-slate-100 shadow-sm flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filters:</span>
        <button
          onClick={() => setRoleFilter("")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            roleFilter === "" ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          All Roles
        </button>
        <button
          onClick={() => setRoleFilter("promoter")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            roleFilter === "promoter" ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Promoters
        </button>
        <button
          onClick={() => setRoleFilter("seller")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            roleFilter === "seller" ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Sellers
        </button>
        <button
          onClick={() => setRoleFilter("user")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            roleFilter === "user" ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Buyers / Users
        </button>
      </div>

      {/* ── Card Layout Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRules.map((rule) => {
          const isHigh = rule.priority === "High";
          const isMedium = rule.priority === "Medium";
          const priorityBadge = isHigh
            ? "bg-red-50 text-red-700 border-red-200"
            : isMedium
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-slate-100 text-slate-600 border-slate-200";

          return (
            <div
              key={rule.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Top border decor based on role */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                rule.role === "promoter" ? "bg-amber-500" : rule.role === "seller" ? "bg-violet-500" : "bg-blue-500"
              }`} />

              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 font-mono">{rule.id}</span>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">{rule.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${priorityBadge}`}>
                    {rule.priority} Priority
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3.5 pt-2 text-[11px] font-semibold text-slate-500">
                  <div>
                    <span className="text-slate-400 font-sans text-[10px]">Target Role</span>
                    <p className="text-slate-700 font-bold uppercase mt-0.5">{rule.role}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-sans text-[10px]">Associated Campaign</span>
                    <p className="text-slate-700 font-bold mt-0.5">{rule.campaign || "Default"}</p>
                  </div>
                  <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-sans text-[9px]">Commission Payout Structure</span>
                      <p className="text-xs font-bold text-blue-600 mt-0.5">{rule.commission}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Settings size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and actions */}
              <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-50">
                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  rule.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {rule.status}
                </span>

                <button
                  onClick={() => handleToggleStatus(rule.id)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {rule.status === "Active" ? (
                    <>
                      <ToggleRight size={22} className="text-emerald-500" />
                      <span>Deactivate</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={22} className="text-slate-300" />
                      <span>Activate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Create Rule Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 relative animate-in zoom-in-95 duration-200">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <Layers size={16} className="text-blue-600" />
              <span>Create Payout Commission Rule</span>
            </h3>

            <form onSubmit={handleSubmit(onSubmitRule)} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Rule Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Seller referral high priority payout"
                  {...register("name", { required: true })}
                  className="w-full p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Target Role
                  </label>
                  <select
                    {...register("role")}
                    className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="promoter">Promoter</option>
                    <option value="seller">Seller</option>
                    <option value="user">User / Buyer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Rule Priority
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Commission Structure
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5% on checkout amount, ₹100 Flat per referral"
                  {...register("commission", { required: true })}
                  className="w-full p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Campaign / Drive (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Mega Payout Q2"
                  {...register("campaign")}
                  className="w-full p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs"
                  color="gray"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs"
                  color="primary"
                >
                  Create Rule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
