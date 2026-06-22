import { useState, useEffect, useMemo } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { walletStore, WithdrawalRequest } from "../utils/walletStore";
import moment from "moment";
import { Check, X, Pause, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "../components/Button";

export const WalletWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Rejected" | "Processing" | "Completed">("Pending");

  // Interaction notes
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<WithdrawalRequest | null>(null);
  const [promptAction, setPromptAction] = useState<"Approved" | "Rejected" | "Hold" | "Completed">("Approved");
  const [adminNotes, setAdminNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = () => {
    setWithdrawals(walletStore.getWithdrawals());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredWithdrawals = useMemo(() => {
    // If active tab is Approved, show both Approved & Hold if they aren't completed, or keep it strict
    // Let's filter strictly by status.
    // If active tab is Approved, show "Approved" status.
    // If active tab is Completed, show "Completed" status.
    // If active tab is Rejected, show "Rejected" status.
    // If active tab is Processing, show "Processing" status.
    // If active tab is Pending, let's show "Pending" AND "Hold" status so that admins can easily see everything needing action!
    return withdrawals.filter((w) => {
      if (activeTab === "Pending") {
        return w.status === "Pending" || w.status === "Hold";
      }
      return w.status === activeTab;
    });
  }, [withdrawals, activeTab]);

  const openActionPrompt = (req: WithdrawalRequest, action: typeof promptAction) => {
    setCurrentRequest(req);
    setPromptAction(action);
    setAdminNotes(req.notes || "");
    setIsPromptOpen(true);
  };

  const handleExecuteAction = () => {
    if (!currentRequest) return;

    let targetStatus: WithdrawalRequest["status"] = "Pending";
    if (promptAction === "Approved") targetStatus = "Approved";
    else if (promptAction === "Rejected") targetStatus = "Rejected";
    else if (promptAction === "Hold") targetStatus = "Hold";
    else if (promptAction === "Completed") targetStatus = "Completed";

    const success = walletStore.updateWithdrawalStatus(currentRequest.id, targetStatus, adminNotes);

    if (success) {
      setSuccessMsg(`Successfully marked Request #${currentRequest.id} as ${targetStatus}.`);
      setIsPromptOpen(false);
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <div className="p-3 space-y-6">
      {/* ── Breadcrumb ── */}
      <div className="bg-white rounded-xl px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100 flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Wallet Module", to: "/wallet/dashboard" },
            { label: "Withdrawal Requests", to: "/wallet/withdrawals" },
          ]}
        />
        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
        >
          <RefreshCw size={12} />
          <span>Refresh List</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 animate-bounce" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── Status Tabs ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="border-b border-slate-100 bg-slate-50/50 flex p-2 gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: "Pending", label: "Pending / On Hold" },
            { id: "Processing", label: "Processing" },
            { id: "Approved", label: "Approved" },
            { id: "Completed", label: "Completed" },
            { id: "Rejected", label: "Rejected" },
          ].map((tab) => {
            const count = withdrawals.filter((w) => {
              if (tab.id === "Pending") return w.status === "Pending" || w.status === "Hold";
              return w.status === tab.id;
            }).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Table Grid ── */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/60 font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3.5">User Details</th>
                  <th className="px-4 py-3.5">Bank Payout Info</th>
                  <th className="px-4 py-3.5">UPI Payout Info</th>
                  <th className="px-4 py-3.5 text-right">Requested Payout</th>
                  <th className="px-4 py-3.5">Requested Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-center">Settlement Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredWithdrawals.length > 0 ? (
                  filteredWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50">
                      {/* User */}
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-bold text-slate-800 text-[13px]">{w.userName}</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">{w.role} • {w.walletId}</p>
                        </div>
                      </td>

                      {/* Bank Info */}
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-800">{w.bankName}</p>
                        <p className="text-[10px] text-slate-400 font-mono font-semibold">{w.accountNumber}</p>
                      </td>

                      {/* UPI Info */}
                      <td className="px-4 py-3.5 font-mono font-semibold text-slate-600">
                        {w.upi || <span className="text-slate-300">—</span>}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5 text-right font-black text-slate-800">
                        ₹{w.amount.toLocaleString("en-IN")}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-slate-400 font-semibold">
                        {moment(w.requestedDate).format("DD MMM YYYY, hh:mm A")}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          w.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : w.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : w.status === "Processing"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : w.status === "Hold"
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            w.status === "Completed"
                              ? "bg-emerald-500"
                              : w.status === "Pending"
                              ? "bg-amber-500 animate-pulse"
                              : w.status === "Processing"
                              ? "bg-blue-500"
                              : w.status === "Hold"
                              ? "bg-rose-500"
                              : "bg-red-500"
                          }`} />
                          {w.status}
                        </span>
                        {w.notes && (
                          <p className="text-[9px] text-slate-400 mt-1 max-w-[200px] truncate" title={w.notes}>
                            Note: {w.notes}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {w.status === "Pending" || w.status === "Hold" || w.status === "Processing" ? (
                            <>
                              <button
                                onClick={() => openActionPrompt(w, "Approved")}
                                className="p-1 bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                                title="Approve Request"
                              >
                                <Check size={14} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => openActionPrompt(w, "Rejected")}
                                className="p-1 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                title="Reject Request"
                              >
                                <X size={14} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => openActionPrompt(w, "Hold")}
                                className="p-1 bg-rose-50 border border-rose-200/60 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                title="Place On Hold"
                              >
                                <Pause size={14} strokeWidth={2.5} />
                              </button>
                            </>
                          ) : w.status === "Approved" ? (
                            <button
                              onClick={() => openActionPrompt(w, "Completed")}
                              className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 rounded-lg text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              Clear Payout <ChevronRight size={10} />
                            </button>
                          ) : (
                            <span className="text-slate-300 text-[10px] font-bold">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-12 text-slate-400 text-xs font-semibold">
                      No withdrawal requests in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Action Dialog Prompt ── */}
      {isPromptOpen && currentRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 relative animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-bold text-slate-800 mb-2">
              Confirm Withdrawal Action: {promptAction}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              You are updating Payout Request #{currentRequest.id} for user **{currentRequest.userName}** (Amount: ₹{currentRequest.amount.toLocaleString()}).
            </p>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Admin Resolution Notes / Reason
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Bank settlement transaction reference, verification hold details..."
                  rows={3}
                  className="w-full p-3 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsPromptOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs"
                  color="gray"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleExecuteAction}
                  className="w-1/2 font-semibold rounded-xl text-xs"
                  color={promptAction === "Approved" || promptAction === "Completed" ? "success" : "danger"}
                >
                  Confirm Action
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
