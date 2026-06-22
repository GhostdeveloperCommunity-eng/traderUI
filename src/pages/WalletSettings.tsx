import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../components/Breadcrumb";
import { walletStore, WalletSettings as SettingsType } from "../utils/walletStore";
import { Settings, Save, CheckCircle2, ShieldAlert, Mail, MessageSquare, Bell } from "lucide-react";
import { Button } from "../components/Button";

interface SettingsFormValues {
  minWithdrawal: number;
  maxWithdrawal: number;
  autoApproval: boolean;
  approvalFlow: "single" | "sequential";
  notifyEmail: boolean;
  notifySms: boolean;
  notifyApp: boolean;
}

export const WalletSettings = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<SettingsFormValues>();

  useEffect(() => {
    const s = walletStore.getSettings();
    reset({
      minWithdrawal: s.minWithdrawal,
      maxWithdrawal: s.maxWithdrawal,
      autoApproval: s.autoApproval,
      approvalFlow: s.approvalFlow,
      notifyEmail: s.notifications.email,
      notifySms: s.notifications.sms,
      notifyApp: s.notifications.app,
    });
  }, [reset]);

  const onSubmit = (data: SettingsFormValues) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    setTimeout(() => {
      if (Number(data.minWithdrawal) <= 0) {
        setErrorMsg("Minimum withdrawal limit must be greater than 0.");
        setLoading(false);
        return;
      }

      if (Number(data.maxWithdrawal) < Number(data.minWithdrawal)) {
        setErrorMsg("Maximum withdrawal limit cannot be less than minimum limit.");
        setLoading(false);
        return;
      }

      const payload: SettingsType = {
        minWithdrawal: Number(data.minWithdrawal),
        maxWithdrawal: Number(data.maxWithdrawal),
        autoApproval: data.autoApproval,
        approvalFlow: data.approvalFlow,
        notifications: {
          email: data.notifyEmail,
          sms: data.notifySms,
          app: data.notifyApp,
        },
      };

      walletStore.setSettings(payload);
      setSuccessMsg("Wallet configurations updated successfully.");
      setLoading(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 600);
  };

  return (
    <div className="p-3 space-y-6">
      {/* ── Breadcrumb ── */}
      <div className="bg-white rounded-xl px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Wallet Module", to: "/wallet/dashboard" },
            { label: "Wallet Settings", to: "/wallet/settings" },
          ]}
        />
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-bold flex items-center gap-2 max-w-2xl">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-2 max-w-2xl">
          <ShieldAlert size={16} className="text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Settings Form ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <Settings size={18} className="text-slate-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Settlement Preferences</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Threshold Limits */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 pb-1.5 border-b border-slate-50 flex items-center gap-1.5">
              <span>Withdrawal Threshold Limits</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Minimum Withdrawal (₹)
                </label>
                <input
                  type="number"
                  {...register("minWithdrawal", { required: true })}
                  className="w-full p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Maximum Withdrawal (₹)
                </label>
                <input
                  type="number"
                  {...register("maxWithdrawal", { required: true })}
                  className="w-full p-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Auto Approvals */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-800 pb-1.5 border-b border-slate-50">
              Auto Approvals & Payout Flow
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 bg-slate-50/20 rounded-2xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="autoApproval"
                  {...register("autoApproval")}
                  className="mt-1 cursor-pointer w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div>
                  <label htmlFor="autoApproval" className="block text-xs font-bold text-slate-700 cursor-pointer">
                    Enable Auto-Approvals
                  </label>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Automatically clear settlements that fall below the minimum threshold.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Authorization Workflow
                </label>
                <select
                  {...register("approvalFlow")}
                  className="w-full p-2.5 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none cursor-pointer font-semibold text-slate-600"
                >
                  <option value="single">Single Payout Manager Approval</option>
                  <option value="sequential">Sequential Multi-tier Admin Payout Flow</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification settings */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-800 pb-1.5 border-b border-slate-50">
              Notification Dispatches
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="p-3.5 border border-slate-100 bg-slate-50/20 rounded-2xl flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("notifyEmail")}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Mail size={14} className="text-blue-500" />
                  <span>Email Alerts</span>
                </div>
              </label>

              <label className="p-3.5 border border-slate-100 bg-slate-50/20 rounded-2xl flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("notifySms")}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <MessageSquare size={14} className="text-indigo-500" />
                  <span>SMS Alerts</span>
                </div>
              </label>

              <label className="p-3.5 border border-slate-100 bg-slate-50/20 rounded-2xl flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("notifyApp")}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Bell size={14} className="text-violet-500" />
                  <span>App Alerts</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs px-5 py-2.5 flex items-center gap-1.5"
              color="primary"
            >
              <Save size={14} />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
