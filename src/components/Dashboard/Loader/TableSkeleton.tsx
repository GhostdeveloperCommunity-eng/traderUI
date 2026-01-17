import Skeleton from "./Skeleton";

type Props = {
  rows?: number;
};

const TableSkeleton = ({ rows = 5 }: Props) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <Skeleton className="h-5 w-40" />

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
