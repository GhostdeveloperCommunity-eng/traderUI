import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Status } from "../types";
import { IFilterType } from "../pages/Products";

// Reusable paginated table for admin dashboard
// Usage: <ProductAdminTable response={apiResponse} onPageChange={(p)=>{/* fetch new page */}} />

type Lot = {
  quantity: number;
  price: number;
  originalPrice: number;
  discount: number;
  _id: string;
};

type MasterDetails = {
  _id: string;
  name: string;
  media?: string[];
  brand?: string;
  description?: string;
  skuCode?: string;
  mrp?: number | null;
  size?: string;
};

export type Product = {
  _id: string;
  description?: string;
  expiry?: string;
  mfg?: string;
  media?: string[];
  lot?: Lot[];
  bestSellerLot?: Lot;
  status: Status;
  tags?: string[];
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  maxDiscount?: number;
  minDiscount?: number;
  mrp?: number;
  masterDetails?: MasterDetails;
  categoryDetails?: any;
  connectorCommission?: number;
  promoterCommission?: number;
  platformFee?: number;
};

type Pagination = {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiResponse = {
  type: string;
  message: string;
  data: Product[];
  pagination: Pagination;
};

// ---------- Small reusable UI pieces ----------
const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <span
    className={
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 " +
      className
    }
  >
    {children}
  </span>
);

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

const TableHeaderCell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <th className="py-2 pr-4 text-left text-xs text-gray-500">{children}</th>;

const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="py-2 pr-4">{children}</td>
);

// ---------- Main Reusable Table Component ----------
export function ProductAdminTable({
  response,
  filters,
  onPageChange,
  onStatusFilterSelect,
}: {
  response: ApiResponse;
  filters: IFilterType;
  onPageChange: (page: number) => void;
  onStatusFilterSelect: (filters: IFilterType) => void;
}) {
  const [expandedLotsFor, setExpandedLotsFor] = useState<string | null>(null);

  const products = response?.data || [];
  const pagination = response?.pagination || {
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const getMedia = (p: Product) => {
    if (p.media && p.media.length) return p.media[0];
    if (p.masterDetails?.media && p.masterDetails.media.length)
      return p.masterDetails.media[0];
    if (p.categoryDetails?.media) return p.categoryDetails.media;
    return null;
  };

  return (
    <div className="p-6">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Products</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-md p-1 shadow-sm">
              <button
                onClick={() =>
                  onStatusFilterSelect({ ...filters, status: null })
                }
                className={`px-3 py-1 rounded-md text-sm ${
                  filters.status === null
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() =>
                  onStatusFilterSelect({ ...filters, status: Status.Active })
                }
                className={`px-3 py-1 rounded-md text-sm ${
                  filters.status === "active"
                    ? "bg-green-600 text-white"
                    : "text-gray-700"
                }`}
              >
                Active
              </button>
              <button
                onClick={() =>
                  onStatusFilterSelect({ ...filters, status: Status.Pending })
                }
                className={`px-3 py-1 rounded-md text-sm ${
                  filters.status === Status.Pending
                    ? "bg-red-600 text-white"
                    : "text-gray-700"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() =>
                  onStatusFilterSelect({ ...filters, status: Status.Inactive })
                }
                className={`px-3 py-1 rounded-md text-sm ${
                  filters.status === "inactive"
                    ? "bg-red-600 text-white"
                    : "text-gray-700"
                }`}
              >
                Inactive
              </button>
            </div>

            <div className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-medium">{pagination.totalCount}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {products.map((p) => (
            <article
              key={p._id}
              className="flex bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-36 h-36 flex-shrink-0 flex items-center justify-center p-1">
                {getMedia(p) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={String(getMedia(p))}
                    alt={p.masterDetails?.name || "product"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-xs text-gray-400">No Image</div>
                )}
              </div>

              <div className="flex-1 p-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      {p.masterDetails?.name || "—"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {p.description ||
                        p.masterDetails?.description ||
                        "No description"}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <Badge>{p.masterDetails?.brand || "Unknown brand"}</Badge>
                      {p.tags?.slice(0, 3).map((t) => (
                        <Badge key={t} className="bg-gray-50 text-gray-600">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-600">
                        Connector fee: {p?.connectorCommission ?? "-"}
                      </p>
                      <p className="text-xs font-semibold text-gray-600">
                        Promoter fee: {p?.promoterCommission ?? "-"}
                      </p>
                      <p className="text-xs font-semibold text-gray-600">
                        Platform fee: {p?.platformFee ?? "-"}
                      </p>
                    </div>
                  </div>

                  {/* <div className="text-right">
                    {p.status != "inactive" && (
                      <button
                        // onClick={() => onStatusToggle(p)}
                        className={`px-3 py-1 cursor-pointer rounded text-xs font-medium ${
                          p.status === "active"
                            ? "bg-red-50 text-red-400"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {p.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </div> */}
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="text-sm">
                    <div className="text-xs text-gray-400">Min Price</div>
                    <div className="font-medium text-gray-800">
                      ₹{p.minPrice ?? "-"}
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-xs text-gray-400">Max Price</div>
                    <div className="font-medium text-gray-800">
                      ₹{p.maxPrice ?? "-"}
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-xs text-gray-400">Max Discount</div>
                    <div className="font-medium text-gray-800">
                      {p.maxDiscount ?? "-"}
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-xs text-gray-400">MRP</div>
                    <div className="font-medium text-gray-800">
                      {(p.mrp || p.masterDetails?.mrp) ?? "-"}
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-xs text-gray-400">Total Lots</div>
                    <button
                      onClick={() =>
                        setExpandedLotsFor((cur) =>
                          cur === p._id ? null : p._id
                        )
                      }
                      className=" inline-flex items-center gap-2 rounded-full text-sm bg-white"
                    >
                      {p.lot?.length ?? 0} lots
                      <FaChevronDown
                        className={`w-3 h-3 text-blue-600 transform ${
                          expandedLotsFor === p._id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {expandedLotsFor === p._id && (
                  <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
                    <div className="w-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                      Lots
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr>
                            <TableHeaderCell>#</TableHeaderCell>
                            <TableHeaderCell>Quantity</TableHeaderCell>
                            <TableHeaderCell>Price</TableHeaderCell>
                            <TableHeaderCell>Discount</TableHeaderCell>
                          </tr>
                        </thead>
                        <tbody>
                          {p.lot && p.lot.length ? (
                            p.lot.map((l, i) => (
                              <tr
                                key={l._id}
                                className="border-b border-gray-200 last:border-b-0"
                              >
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{l.quantity}</TableCell>
                                <TableCell>₹{l.price}</TableCell>
                                <TableCell>{l.discount}</TableCell>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="py-4 text-sm text-gray-500"
                              >
                                No lots available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}

          {/* empty state */}
          {products.length === 0 && (
            <div className="bg-white p-8 rounded-2xl text-center text-gray-500 shadow-sm">
              No products match the filter.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 bg-white rounded-lg border border-gray-100">
          <PaginationControl
            pagination={pagination}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}
