import clsx from "clsx";

export type StatusType = "active" | "inactive" | "pending";

interface StatusTagProps {
  status: StatusType;
}

const StatusTag = ({ status }: StatusTagProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize",
        {
          "bg-green-100 text-green-700": status === "active",
          "bg-red-100 text-red-600": status === "inactive",
          "bg-yellow-100 text-yellow-700": status === "pending",
        }
      )}
    >
      {status}
    </span>
  );
};

export default StatusTag;
