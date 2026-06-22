import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./Button";
import { walletStore, WalletAccount } from "../utils/walletStore";
import { X, Search, Users, User, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2 } from "lucide-react";

interface ManualOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialWalletId?: string; // Optional: target account pre-selected
  initialType?: "credit" | "debit"; // Optional: operation pre-selected
}

interface FormValues {
  mode: "single" | "bulk";
  walletId: string;
  bulkEmails: string;
  type: "credit" | "debit";
  category: "bonus" | "penalty" | "correction";
  amount: number;
  notes: string;
}

export const WalletManualOperationModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialWalletId = "",
  initialType = "credit",
}: ManualOperationModalProps) => {
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      mode: "single",
      walletId: initialWalletId,
      bulkEmails: "",
      type: initialType,
      category: initialType === "credit" ? "bonus" : "penalty",
      amount: 0,
      notes: "",
    },
  });

  const mode = watch("mode");
  const type = watch("type");

  // Sync types and categories
  useEffect(() => {
    if (type === "credit") {
      setValue("category", "bonus");
    } else {
      setValue("category", "penalty");
    }
  }, [type, setValue]);

  useEffect(() => {
    const list = walletStore.getAccounts();
    setAccounts(list);

    if (initialWalletId) {
      const match = list.find((a) => a.id === initialWalletId);
      if (match) {
        setSelectedAccount(match);
        setValue("walletId", match.id);
      }
    }
  }, [initialWalletId, setValue, isOpen]);

  if (!isOpen) return null;

  const filteredAccounts = accounts.filter(
    (a) =>
      a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAccount = (acc: WalletAccount) => {
    setSelectedAccount(acc);
    setValue("walletId", acc.id);
    setSearchQuery("");
  };

  const handleClearSelected = () => {
    setSelectedAccount(null);
    setValue("walletId", "");
  };

  const onSubmit = (data: FormValues) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    // Set a tiny timeout to simulate real API processing and show loading states
    setTimeout(() => {
      if (data.amount <= 0) {
        setErrorMsg("Amount must be greater than zero.");
        setLoading(false);
        return;
      }

      if (data.mode === "single") {
        if (!data.walletId) {
          setErrorMsg("Please select a target wallet account.");
          setLoading(false);
          return;
        }

        const success = walletStore.creditDebitWallet(
          data.walletId,
          Number(data.amount),
          data.type,
          data.category,
          data.notes
        );

        if (success) {
          setSuccessMsg(`Successfully processed manual ${data.type} of ₹${data.amount}.`);
          setTimeout(() => {
            reset();
            handleClearSelected();
            onSuccess();
            onClose();
          }, 1500);
        } else {
          setErrorMsg("Failed to process transaction. Insufficient wallet balance for debit.");
        }
      } else {
        // Bulk Mode
        if (!data.bulkEmails.trim()) {
          setErrorMsg("Please enter at least one email address.");
          setLoading(false);
          return;
        }

        const emails = data.bulkEmails
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter((e) => e !== "");

        const result = walletStore.bulkCreditDebit(
          emails,
          Number(data.amount),
          data.type,
          data.category,
          data.notes
        );

        if (result.successCount > 0) {
          let msg = `Successfully processed ${data.type} for ${result.successCount} account(s).`;
          if (result.failedEmails.length > 0) {
            msg += ` Failed for: ${result.failedEmails.join(", ")} (not found or insufficient funds).`;
            setErrorMsg(`Some emails failed: ${result.failedEmails.join(", ")}`);
          }
          setSuccessMsg(msg);
          setTimeout(() => {
            reset();
            onSuccess();
            onClose();
          }, 3000);
        } else {
          setErrorMsg("No transactions were processed. Please check emails and balances.");
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg mx-auto relative animate-in zoom-in-95 duration-200">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Override standard Card classes to look clean in popup */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800">Manual Wallet Adjustment</h2>
            <p className="text-xs text-slate-400">Apply custom balances, bonuses, or penalties directly.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-600 animate-bounce" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Mode selection (Single/Bulk) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="single"
                  {...register("mode")}
                  className="peer sr-only"
                />
                <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-slate-500 peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm transition-all">
                  <User size={14} />
                  <span>Single Account</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="bulk"
                  {...register("mode")}
                  className="peer sr-only"
                />
                <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-slate-500 peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm transition-all">
                  <Users size={14} />
                  <span>Bulk Operation</span>
                </div>
              </label>
            </div>

            {/* Target Account Selection */}
            {mode === "single" ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Target Wallet
                </label>

                {selectedAccount ? (
                  <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {selectedAccount.userName[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{selectedAccount.userName}</p>
                        <p className="text-[10px] text-slate-400">{selectedAccount.userEmail} | {selectedAccount.id}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div className="text-[11px] font-semibold text-slate-600">
                        Bal: ₹{selectedAccount.availableBalance.toLocaleString()}
                      </div>
                      <button
                        type="button"
                        onClick={handleClearSelected}
                        className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search account by name, email, or wallet ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    />

                    {searchQuery && (
                      <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-xl z-20 divide-y divide-slate-50">
                        {filteredAccounts.length > 0 ? (
                          filteredAccounts.map((acc) => (
                            <button
                              key={acc.id}
                              type="button"
                              onClick={() => handleSelectAccount(acc)}
                              className="w-full text-left p-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors"
                            >
                              <div>
                                <p className="text-xs font-bold text-slate-800">{acc.userName}</p>
                                <p className="text-[10px] text-slate-400">{acc.userEmail}</p>
                              </div>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                                {acc.role}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-xs text-slate-400">No accounts found</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Target Emails (Comma-separated)
                </label>
                <textarea
                  {...register("bulkEmails")}
                  placeholder="e.g. amit.kumar@lottmart.com, ramesh.sharma@gmail.com"
                  rows={3}
                  className="w-full p-3 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-mono"
                />
              </div>
            )}

            {/* Adjust Type & Sub-type/Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Operation Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="credit"
                      {...register("type")}
                      className="peer sr-only"
                    />
                    <div className="flex items-center justify-center gap-1 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:border-emerald-200 transition-all">
                      <ArrowUpRight size={14} className="text-emerald-500" />
                      <span>Credit</span>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="debit"
                      {...register("type")}
                      className="peer sr-only"
                    />
                    <div className="flex items-center justify-center gap-1 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 peer-checked:bg-red-50 peer-checked:text-red-700 peer-checked:border-red-200 transition-all">
                      <ArrowDownRight size={14} className="text-red-500" />
                      <span>Debit</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Adjustment Category
                </label>
                <select
                  {...register("category")}
                  className="w-full p-2 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 cursor-pointer"
                >
                  {type === "credit" ? (
                    <>
                      <option value="bonus">Bonus / Incentive</option>
                      <option value="correction">Correction Credit</option>
                    </>
                  ) : (
                    <>
                      <option value="penalty">Penalty Deduction</option>
                      <option value="correction">Correction Debit</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Amount input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Transaction Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  {...register("amount", { required: true, min: 1 })}
                  className="w-full pl-7 pr-4 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 font-semibold"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Reason / Internal Notes
              </label>
              <textarea
                {...register("notes", { required: true })}
                placeholder="Please state the reason for this manual adjustments (e.g. Special campaign incentive, Double credit payout correction)..."
                rows={2}
                className="w-full p-3 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3">
              <Button
                type="button"
                onClick={onClose}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs"
                color="gray"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
                color="primary"
              >
                {loading ? "Processing..." : `Execute ${type === "credit" ? "Credit" : "Debit"}`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
