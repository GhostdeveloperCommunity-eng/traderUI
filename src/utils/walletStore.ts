export interface WalletAccount {
  id: string; // Wallet ID (e.g. W-102948)
  userName: string;
  userEmail: string;
  role: "promoter" | "seller" | "user" | "admin";
  availableBalance: number;
  pendingBalance: number;
  lockedBalance: number;
  lifetimeEarnings: number;
  status: "Active" | "Frozen";
  lastTransaction: string;
  createdDate: string;
}

export interface WalletTransaction {
  id: string; // e.g. TX-482910
  walletId: string;
  userName: string;
  role: string;
  amount: number;
  type: "credit" | "debit";
  category: "commission" | "withdrawal" | "bonus" | "penalty" | "correction";
  status: "Completed" | "Pending" | "Failed" | "Hold" | "Processing";
  reference: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string; // e.g. WDR-382910
  walletId: string;
  userName: string;
  role: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  upi: string;
  requestedDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Processing" | "Completed" | "Hold";
  notes?: string;
}

export interface CommissionRule {
  id: string;
  name: string;
  role: "promoter" | "seller" | "user" | "all";
  commission: string; // e.g. "5% on checkout", "₹100 Flat"
  campaign: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Inactive";
}

export interface WalletSettings {
  minWithdrawal: number;
  maxWithdrawal: number;
  autoApproval: boolean;
  approvalFlow: "single" | "sequential";
  notifications: {
    email: boolean;
    sms: boolean;
    app: boolean;
  };
}

// ── DEFAULT SEED DATA ──
const DEFAULT_ACCOUNTS: WalletAccount[] = [
  {
    id: "W-847291",
    userName: "Amit Kumar",
    userEmail: "amit.kumar@lottmart.com",
    role: "promoter",
    availableBalance: 24500,
    pendingBalance: 3200,
    lockedBalance: 1500,
    lifetimeEarnings: 85000,
    status: "Active",
    lastTransaction: "2026-06-22T14:32:00Z",
    createdDate: "2025-10-12T08:15:00Z",
  },
  {
    id: "W-382910",
    userName: "Ramesh Sharma",
    userEmail: "ramesh.sharma@gmail.com",
    role: "seller",
    availableBalance: 142000,
    pendingBalance: 12500,
    lockedBalance: 5000,
    lifetimeEarnings: 450000,
    status: "Active",
    lastTransaction: "2026-06-22T18:45:00Z",
    createdDate: "2025-11-20T10:30:00Z",
  },
  {
    id: "W-984712",
    userName: "Neha Patel",
    userEmail: "neha.patel@outlook.com",
    role: "promoter",
    availableBalance: 0,
    pendingBalance: 1200,
    lockedBalance: 4000,
    lifetimeEarnings: 24000,
    status: "Frozen",
    lastTransaction: "2026-06-20T09:12:00Z",
    createdDate: "2026-01-05T14:20:00Z",
  },
  {
    id: "W-748291",
    userName: "Suresh Gupta",
    userEmail: "suresh.gupta@lottmart-vendor.com",
    role: "seller",
    availableBalance: 87500,
    pendingBalance: 0,
    lockedBalance: 12000,
    lifetimeEarnings: 310000,
    status: "Active",
    lastTransaction: "2026-06-22T11:20:00Z",
    createdDate: "2025-08-14T09:00:00Z",
  },
  {
    id: "W-294821",
    userName: "Vikram Malhotra",
    userEmail: "vikram.m@gmail.com",
    role: "user",
    availableBalance: 3200,
    pendingBalance: 450,
    lockedBalance: 0,
    lifetimeEarnings: 8900,
    status: "Active",
    lastTransaction: "2026-06-21T16:40:00Z",
    createdDate: "2026-03-18T17:45:00Z",
  },
  {
    id: "W-104928",
    userName: "Priya Nair",
    userEmail: "priya.nair@lottmart.com",
    role: "promoter",
    availableBalance: 12400,
    pendingBalance: 4800,
    lockedBalance: 2000,
    lifetimeEarnings: 56000,
    status: "Active",
    lastTransaction: "2026-06-22T20:10:00Z",
    createdDate: "2025-12-01T11:10:00Z",
  },
];

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "TXN-839210",
    walletId: "W-847291",
    userName: "Amit Kumar",
    role: "promoter",
    amount: 1500,
    type: "credit",
    category: "commission",
    status: "Completed",
    reference: "Order #ORD-948291",
    createdAt: "2026-06-22T14:32:00Z",
  },
  {
    id: "TXN-839211",
    walletId: "W-382910",
    userName: "Ramesh Sharma",
    role: "seller",
    amount: 12500,
    type: "credit",
    category: "commission",
    status: "Completed",
    reference: "Order #ORD-382911",
    createdAt: "2026-06-22T18:45:00Z",
  },
  {
    id: "TXN-839212",
    walletId: "W-104928",
    userName: "Priya Nair",
    role: "promoter",
    amount: 5000,
    type: "debit",
    category: "withdrawal",
    status: "Completed",
    reference: "Withdrawal #WDR-382901",
    createdAt: "2026-06-22T20:10:00Z",
  },
  {
    id: "TXN-839213",
    walletId: "W-748291",
    userName: "Suresh Gupta",
    role: "seller",
    amount: 2500,
    type: "credit",
    category: "bonus",
    status: "Completed",
    reference: "Campaign: Top Seller Reward",
    createdAt: "2026-06-22T11:20:00Z",
  },
  {
    id: "TXN-839214",
    walletId: "W-847291",
    userName: "Amit Kumar",
    role: "promoter",
    amount: 200,
    type: "debit",
    category: "penalty",
    status: "Completed",
    reference: "Correction: Ref #ORD-948291 Double Credit",
    createdAt: "2026-06-21T10:15:00Z",
  },
  {
    id: "TXN-839215",
    walletId: "W-294821",
    userName: "Vikram Malhotra",
    role: "user",
    amount: 150,
    type: "credit",
    category: "commission",
    status: "Completed",
    reference: "Referral Bonus for User Sign Up",
    createdAt: "2026-06-21T16:40:00Z",
  },
  {
    id: "TXN-839216",
    walletId: "W-984712",
    userName: "Neha Patel",
    role: "promoter",
    amount: 4000,
    type: "debit",
    category: "withdrawal",
    status: "Hold",
    reference: "Withdrawal #WDR-382902 - Pending verification",
    createdAt: "2026-06-20T09:12:00Z",
  },
];

const DEFAULT_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: "WDR-382901",
    walletId: "W-104928",
    userName: "Priya Nair",
    role: "promoter",
    amount: 5000,
    bankName: "HDFC Bank",
    accountNumber: "XXXX-XXXX-9843",
    upi: "priya.nair@okhdfc",
    requestedDate: "2026-06-22T19:30:00Z",
    status: "Completed",
    notes: "Approved automatically under threshold.",
  },
  {
    id: "WDR-382902",
    walletId: "W-984712",
    userName: "Neha Patel",
    role: "promoter",
    amount: 4000,
    bankName: "ICICI Bank",
    accountNumber: "XXXX-XXXX-1122",
    upi: "neha.patel@okicici",
    requestedDate: "2026-06-20T09:00:00Z",
    status: "Hold",
    notes: "Holding due to account verification issue.",
  },
  {
    id: "WDR-382903",
    walletId: "W-847291",
    userName: "Amit Kumar",
    role: "promoter",
    amount: 15000,
    bankName: "SBI Bank",
    accountNumber: "XXXX-XXXX-4567",
    upi: "amit.kumar@oksbi",
    requestedDate: "2026-06-22T23:10:00Z",
    status: "Pending",
  },
  {
    id: "WDR-382904",
    walletId: "W-382910",
    userName: "Ramesh Sharma",
    role: "seller",
    amount: 50000,
    bankName: "Axis Bank",
    accountNumber: "XXXX-XXXX-8901",
    upi: "ramesh.sharma@okaxis",
    requestedDate: "2026-06-23T00:05:00Z",
    status: "Pending",
  },
  {
    id: "WDR-382905",
    walletId: "W-748291",
    userName: "Suresh Gupta",
    role: "seller",
    amount: 30000,
    bankName: "Punjab National Bank",
    accountNumber: "XXXX-XXXX-2345",
    upi: "suresh.g@okpnb",
    requestedDate: "2026-06-22T15:20:00Z",
    status: "Processing",
    notes: "Sent to bank gateway.",
  },
];

const DEFAULT_COMMISSION_RULES: CommissionRule[] = [
  {
    id: "RULE-001",
    name: "Standard Promoter Commission",
    role: "promoter",
    commission: "8% on checkout amount",
    campaign: "Summer Mega Festival",
    priority: "High",
    status: "Active",
  },
  {
    id: "RULE-002",
    name: "Seller Listing Commission",
    role: "seller",
    commission: "12% on product selling price",
    campaign: "Default Seller Rule",
    priority: "High",
    status: "Active",
  },
  {
    id: "RULE-003",
    name: "Connector Referral Incentive",
    role: "promoter",
    commission: "₹50 per verified referral",
    campaign: "User Onboarding Drive",
    priority: "Medium",
    status: "Active",
  },
  {
    id: "RULE-004",
    name: "Buyer Cashback",
    role: "user",
    commission: "1% cashback as wallet point",
    campaign: "First Purchase Offer",
    priority: "Low",
    status: "Inactive",
  },
];

const DEFAULT_SETTINGS: WalletSettings = {
  minWithdrawal: 500,
  maxWithdrawal: 50000,
  autoApproval: false,
  approvalFlow: "single",
  notifications: {
    email: true,
    sms: false,
    app: true,
  },
};

// ── STORAGE MANAGEMENT HELPERS ──
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const walletStore = {
  getAccounts: (): WalletAccount[] => {
    return getStorageItem<WalletAccount[]>("wallet_accounts", DEFAULT_ACCOUNTS);
  },

  setAccounts: (accounts: WalletAccount[]): void => {
    setStorageItem("wallet_accounts", accounts);
  },

  getTransactions: (): WalletTransaction[] => {
    const txs = getStorageItem<WalletTransaction[]>("wallet_transactions", DEFAULT_TRANSACTIONS);
    // Sort transactions by date descending
    return txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  setTransactions: (transactions: WalletTransaction[]): void => {
    setStorageItem("wallet_transactions", transactions);
  },

  getWithdrawals: (): WithdrawalRequest[] => {
    return getStorageItem<WithdrawalRequest[]>("wallet_withdrawals", DEFAULT_WITHDRAWALS);
  },

  setWithdrawals: (withdrawals: WithdrawalRequest[]): void => {
    setStorageItem("wallet_withdrawals", withdrawals);
  },

  getCommissionRules: (): CommissionRule[] => {
    return getStorageItem<CommissionRule[]>("wallet_commission_rules", DEFAULT_COMMISSION_RULES);
  },

  setCommissionRules: (rules: CommissionRule[]): void => {
    setStorageItem("wallet_commission_rules", rules);
  },

  getSettings: (): WalletSettings => {
    return getStorageItem<WalletSettings>("wallet_settings", DEFAULT_SETTINGS);
  },

  setSettings: (settings: WalletSettings): void => {
    setStorageItem("wallet_settings", settings);
  },

  // ── CORE OPERATIONS ──

  // Perform Manual Credit/Debit Operation
  creditDebitWallet: (
    walletId: string,
    amount: number,
    type: "credit" | "debit",
    category: "bonus" | "penalty" | "correction",
    notes: string
  ): boolean => {
    const accounts = walletStore.getAccounts();
    const accountIndex = accounts.findIndex((a) => a.id === walletId);

    if (accountIndex === -1) return false;

    const account = accounts[accountIndex];

    if (type === "debit" && account.availableBalance < amount) {
      return false; // Insufficient balance for debit
    }

    // Update balances
    const change = type === "credit" ? amount : -amount;
    account.availableBalance += change;
    if (type === "credit") {
      account.lifetimeEarnings += amount;
    }
    account.lastTransaction = new Date().toISOString();

    accounts[accountIndex] = account;
    walletStore.setAccounts(accounts);

    // Append Transaction
    const transactions = walletStore.getTransactions();
    const newTx: WalletTransaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      walletId: account.id,
      userName: account.userName,
      role: account.role,
      amount,
      type,
      category,
      status: "Completed",
      reference: notes || `Manual Admin ${type === "credit" ? "Credit" : "Debit"}`,
      createdAt: new Date().toISOString(),
    };
    transactions.push(newTx);
    walletStore.setTransactions(transactions);

    return true;
  },

  // Perform Bulk Operations
  bulkCreditDebit: (
    targetEmails: string[],
    amount: number,
    type: "credit" | "debit",
    category: "bonus" | "penalty" | "correction",
    notes: string
  ): { successCount: number; failedEmails: string[] } => {
    const accounts = walletStore.getAccounts();
    const transactions = walletStore.getTransactions();
    let successCount = 0;
    const failedEmails: string[] = [];

    const updatedAccounts = accounts.map((acc) => {
      if (targetEmails.includes(acc.userEmail.trim().toLowerCase())) {
        if (type === "debit" && acc.availableBalance < amount) {
          failedEmails.push(acc.userEmail);
          return acc;
        }

        const change = type === "credit" ? amount : -amount;
        acc.availableBalance += change;
        if (type === "credit") {
          acc.lifetimeEarnings += amount;
        }
        acc.lastTransaction = new Date().toISOString();

        // Create transaction
        const newTx: WalletTransaction = {
          id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          walletId: acc.id,
          userName: acc.userName,
          role: acc.role,
          amount,
          type,
          category,
          status: "Completed",
          reference: notes || `Bulk Admin ${type === "credit" ? "Credit" : "Debit"}`,
          createdAt: new Date().toISOString(),
        };
        transactions.push(newTx);
        successCount++;
      }
      return acc;
    });

    // Save
    walletStore.setAccounts(updatedAccounts);
    walletStore.setTransactions(transactions);

    // Identify which emails in targetEmails were not found in accounts
    const accountEmails = accounts.map(a => a.userEmail.trim().toLowerCase());
    targetEmails.forEach(email => {
      const formatted = email.trim().toLowerCase();
      if (!accountEmails.includes(formatted) && !failedEmails.includes(email)) {
        failedEmails.push(email);
      }
    });

    return { successCount, failedEmails };
  },

  // Update Withdrawal Request Status
  updateWithdrawalStatus: (
    requestId: string,
    newStatus: "Approved" | "Rejected" | "Processing" | "Completed" | "Hold" | "Pending",
    notes?: string
  ): boolean => {
    const withdrawals = walletStore.getWithdrawals();
    const accounts = walletStore.getAccounts();
    const wIndex = withdrawals.findIndex((w) => w.id === requestId);

    if (wIndex === -1) return false;

    const request = withdrawals[wIndex];
    const prevStatus = request.status;

    if (prevStatus === newStatus) return true;

    request.status = newStatus;
    if (notes) request.notes = notes;
    withdrawals[wIndex] = request;
    walletStore.setWithdrawals(withdrawals);

    // Handle wallet balance transitions if withdrawal state changes:
    // If it's APPROVED or COMPLETED, we officially debit the amount from the available balance (if not already done).
    // In our simplified mock flow:
    // When a withdrawal request is created: the amount should be locked or pending.
    // Let's adjust available/pending/locked balance based on state transitions.
    const accIndex = accounts.findIndex((a) => a.id === request.walletId);
    if (accIndex !== -1) {
      const account = accounts[accIndex];

      if (newStatus === "Approved" || newStatus === "Completed") {
        if (prevStatus === "Pending" || prevStatus === "Hold" || prevStatus === "Processing") {
          // Officially complete the withdrawal
          // Deduct from available/pending balance (let's assume pending withdrawal amount is cleared)
          // Add transaction
          const transactions = walletStore.getTransactions();
          const alreadyExists = transactions.some(
            (t) => t.category === "withdrawal" && t.reference.includes(request.id) && t.status === "Completed"
          );

          if (!alreadyExists) {
            // Deduct available balance
            if (account.availableBalance >= request.amount) {
              account.availableBalance -= request.amount;
            }
            
            const newTx: WalletTransaction = {
              id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
              walletId: account.id,
              userName: account.userName,
              role: account.role,
              amount: request.amount,
              type: "debit",
              category: "withdrawal",
              status: "Completed",
              reference: `Withdrawal Request #${request.id}`,
              createdAt: new Date().toISOString(),
            };
            transactions.push(newTx);
            walletStore.setTransactions(transactions);
          }
        }
      } else if (newStatus === "Rejected") {
        // If rejected, refund any pending/locked amounts back to available (in our case we didn't deduct it yet, or we release it)
        // Add refund/cancellation log
        const transactions = walletStore.getTransactions();
        const cancelTx: WalletTransaction = {
          id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          walletId: account.id,
          userName: account.userName,
          role: account.role,
          amount: request.amount,
          type: "credit",
          category: "correction",
          status: "Completed",
          reference: `Rejected Withdrawal #${request.id} - Refunded`,
          createdAt: new Date().toISOString(),
        };
        transactions.push(cancelTx);
        walletStore.setTransactions(transactions);
      }

      account.lastTransaction = new Date().toISOString();
      accounts[accIndex] = account;
      walletStore.setAccounts(accounts);
    }

    return true;
  },

  // Toggle Wallet Status (Freeze/Unfreeze)
  toggleWalletFreeze: (walletId: string): string => {
    const accounts = walletStore.getAccounts();
    const idx = accounts.findIndex((a) => a.id === walletId);
    if (idx === -1) return "Not Found";

    const newStatus = accounts[idx].status === "Active" ? "Frozen" : "Active";
    accounts[idx].status = newStatus;
    accounts[idx].lastTransaction = new Date().toISOString();
    walletStore.setAccounts(accounts);
    return newStatus;
  },

  // Create Commission Rule
  addCommissionRule: (rule: Omit<CommissionRule, "id">): CommissionRule => {
    const rules = walletStore.getCommissionRules();
    const newRule: CommissionRule = {
      ...rule,
      id: `RULE-${Math.floor(100 + Math.random() * 900)}`,
    };
    rules.push(newRule);
    walletStore.setCommissionRules(rules);
    return newRule;
  },

  // Toggle Commission Rule Status
  toggleCommissionRule: (id: string): string => {
    const rules = walletStore.getCommissionRules();
    const idx = rules.findIndex((r) => r.id === id);
    if (idx === -1) return "Not Found";

    const newStatus = rules[idx].status === "Active" ? "Inactive" : "Active";
    rules[idx].status = newStatus;
    walletStore.setCommissionRules(rules);
    return newStatus;
  }
};
