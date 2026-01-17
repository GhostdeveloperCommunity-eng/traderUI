import Skeleton from "./Skeleton";

const MetricCardSkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
};

export default MetricCardSkeleton;
