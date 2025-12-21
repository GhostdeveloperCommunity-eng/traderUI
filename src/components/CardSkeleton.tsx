const CardSkeleton = () => {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="flex bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 animate-pulse"
        >
          {/* Image */}
          <div className="w-36 h-36 flex-shrink-0 bg-gray-200 p-2" />

          <div className="flex-1 p-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="w-full">
                <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-full bg-gray-200 rounded mb-1" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />

                {/* Badges */}
                <div className="mt-3 flex gap-2">
                  <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  <div className="h-5 w-14 bg-gray-200 rounded-full" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>

                {/* Fees */}
                <div className="mt-3 flex gap-4">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>

              {/* View Button */}
              <div className="h-9 w-20 bg-gray-200 rounded-md" />
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default CardSkeleton;
