import clsx from "clsx";

export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "complete"
  | 1
  | 2
  | true
  | false;

interface StatusTagProps {
  status: StatusType;
}

const StatusTag = ({ status }: StatusTagProps) => {
  const isSuccess =
    status === "active" ||
    status === "complete" ||
    status === 1 ||
    status === true;

  const isPending = status === "pending" || status === 2;

  const isInactive = status === "inactive" || status === false;

  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize",
        {
          "bg-green-100 text-green-700": isSuccess,
          "bg-red-100 text-red-600": isInactive,
          "bg-yellow-100 text-yellow-700": isPending,
        }
      )}
    >
      {String(status)}
    </span>
  );
};

export default StatusTag;
