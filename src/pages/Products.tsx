import { useEffect, useState } from "react";
import { httpClient } from "../services/ApiService";
import { getCompleteUrlV1 } from "../utils";
import {
  ApiResponse,
  ProductAdminTable,
} from "../components/AdminTable";
import { Status } from "../types";

export interface IFilterType {
  page: number;
  status: Status | null;
}

export const Products = () => {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [filters, setFilters] = useState<IFilterType>({
    page: 1,
    status: null,
  });

  useEffect(() => {
    (async function getMatserProduct() {
      const master = await httpClient.get(
        getCompleteUrlV1(
          "product",
          filters as unknown as Record<
            string,
            string | number | boolean | undefined | null
          >
        )
      );
      const products = await master.json();
      console.log(products);
      setResponse(products);
    })();
  }, [filters]);

  return (
    <div>
      {response !== null ? (
        <ProductAdminTable
          response={response}
          filters={filters}
          onPageChange={(num) => {
            setFilters({ ...filters, page: num });
          }}
          onStatusFilterSelect={(filters) => setFilters(filters)}
        />
      ) : (
        <p>Loading....</p>
      )}
    </div>
  );
};
