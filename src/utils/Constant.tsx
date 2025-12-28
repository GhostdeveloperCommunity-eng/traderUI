export const STATUS_LABEL: Record<number | string, string> = {
  0: "PENDING",
  1: "APPROVED",
  2: "REJECTED",
  3: "CANCELLED",
  4: "DELIVERED",
  5: "RTO",
};

export const STATUS_COLOR: Record<number, string> = {
  0: "bg-yellow-100 text-yellow-700 border-yellow-300",
  1: "bg-blue-100 text-blue-700 border-blue-300",
  2: "bg-red-100 text-red-700 border-red-300",
  3: "bg-gray-100 text-gray-700 border-gray-300",
  4: "bg-green-100 text-green-700 border-green-300",
  5: "bg-purple-100 text-purple-700 border-purple-300",
};

export const PAYMENT_METHODS: Record<number | string, string> = {
  1: "COD",
  2: "ONLINE",
  3: "PARTIALLY_PAID",
};
