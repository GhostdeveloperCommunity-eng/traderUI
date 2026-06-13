import { useEffect, useState } from "react";
import { httpClient } from "../services/ApiService";
import { getCompleteUrlV1 } from "../utils";
import { ApiResponse, ProductAdminTable } from "../components/AdminTable";
import { Status } from "../types";
import { ProductDetail } from "./ProductDetail";
import { ProductEditModal } from "../components/ProductEditModal";
import CardSkeleton from "../components/CardSkeleton";

export interface IFilterType {
  page: number;
  status: Status | null;
  search?: string;
  categoryId?: string;
}

export const Products = () => {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [filters, setFilters] = useState<IFilterType>({
    page: 1,
    status: null,
    search: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [productData, setProductData] = useState<any>({});
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  
  // Edit Modal states
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Fetch Categories on mount
  useEffect(() => {
    (async function getCategories() {
      try {
        const res = await httpClient.get(getCompleteUrlV1("category"));
        if (res.ok) {
          const payload = await res.json();
          setCategories(payload.data || []);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  // Fetch Products based on page, status, search and category filters
  useEffect(() => {
    (async function getMatserProduct() {
      // Build clean query params - remove empty fields
      const cleanFilters: Record<string, any> = { page: filters.page };
      if (filters.status) cleanFilters.status = filters.status;
      if (filters.search) cleanFilters.search = filters.search;
      if (filters.categoryId) cleanFilters.categoryId = filters.categoryId;

      try {
        if (filters.status === Status.Inactive) {
          const cleanFiltersInactive = { ...cleanFilters, status: Status.Inactive };
          const cleanFiltersPending = { ...cleanFilters, status: Status.Pending };

          const [inactiveRes, pendingRes] = await Promise.all([
            httpClient.get(getCompleteUrlV1("product", cleanFiltersInactive)),
            httpClient.get(getCompleteUrlV1("product", cleanFiltersPending)),
          ]);

          const [inactiveJson, pendingJson] = await Promise.all([
            inactiveRes.json(),
            pendingRes.json(),
          ]);

          const mergedData = [
            ...(inactiveJson.data || []),
            ...(pendingJson.data || []),
          ];

          const totalCount = (inactiveJson.pagination?.totalCount || 0) + (pendingJson.pagination?.totalCount || 0);
          const limit = inactiveJson.pagination?.limit || pendingJson.pagination?.limit || 10;
          const totalPages = Math.ceil(totalCount / limit) || 1;

          setResponse({
            type: inactiveJson.type || "success",
            message: inactiveJson.message || "",
            data: mergedData,
            pagination: {
              totalCount,
              page: filters.page,
              limit,
              totalPages,
            },
          });
        } else {
          const master = await httpClient.get(
            getCompleteUrlV1("product", cleanFilters)
          );
          const products = await master.json();
          setResponse(products);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      }
    })();
  }, [filters, refreshTrigger]);

  const handleOpenEdit = (prod: any) => {
    setEditingProduct(prod);
    setOpenEditModal(true);
  };

  return (
    <div>
      {openDetail ? (
        <ProductDetail
          product={productData}
          onEdit={() => handleOpenEdit(productData)}
          onBack={() => setOpenDetail(false)}
        />
      ) : (
        <>
          {response !== null ? (
            <ProductAdminTable
              response={response}
              filters={filters}
              categories={categories}
              onPageChange={(num) => {
                setFilters({ ...filters, page: num });
              }}
              onStatusFilterSelect={(newFilters) => setFilters(newFilters)}
              setOpenDetail={setOpenDetail}
              setProductData={setProductData}
              setRefreshTrigger={setRefreshTrigger}
              onEdit={handleOpenEdit}
            />
          ) : (
            <div className="p-4">
              <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
                <CardSkeleton />
              </div>
            </div>
          )}
        </>
      )}

      {openEditModal && (
        <ProductEditModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          setRefreshTrigger={setRefreshTrigger}
          product={editingProduct}
        />
      )}
    </div>
  );
};
