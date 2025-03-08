import { useEffect } from "react";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";

export const MasterProductList = () => {
  useEffect(() => {
    (async function getMatserProduct() {
      const master = await httpClient.get(
        getCompleteUrlV1("products/master_product"),
      );
      const products = await master.json();
      console.log({ products });
    })();
  }, []);
  return <div className="p-4"></div>;
};
