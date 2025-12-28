interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PaginationControl: React.FC<{
  pagination: Pagination;
  onPageChange: (page: number) => void;
}> = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination;

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="text-sm text-gray-600">
        Showing page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-md bg-white border text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded-md bg-white border text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControl;
