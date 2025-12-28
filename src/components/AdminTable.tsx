import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Status } from "../types";
import { IFilterType } from "../pages/Products";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import moment from "moment";
import StatusTag from "./StatusTag";

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
  const products = response?.data || [];
  const pagination = response?.pagination || {
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/users" },
            { label: "Product", to: "/products" },
          ]}
        />
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

        <table className="min-w-full text-sm font-light border-collapse">
          <thead className="bg-violet-800 text-white">
            <tr className="uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Description</th>
              <th className="py-3 px-6 text-center">Min Price</th>
              <th className="py-3 px-6 text-center">Max Price</th>
              <th className="py-3 px-6 text-center">Max Discount</th>
              <th className="py-3 px-6 text-center">Date</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm font-light">
            {products.map((p, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-center">{p.description}</td>
                <td className="py-3 px-6 text-center">{p.minPrice}</td>
                <td className="py-3 px-6 text-center">{p.maxPrice}</td>
                <td className="py-3 px-6 text-center">{p.maxDiscount}</td>

                <td className="py-3 px-6 text-center">
                  {moment(p.mfg).format("DD-MM-YYYY")}
                </td>
                <td className="py-3 px-6 text-center">
                  <StatusTag status={p.status} />
                </td>
                <td className="py-2 px-2 text-center"></td>
              </tr>
            ))}
          </tbody>
        </table>

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
