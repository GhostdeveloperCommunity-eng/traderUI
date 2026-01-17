import { useEffect, useState } from "react";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import { ICategoryServer } from "../types";
import { Button } from "../components/Button";
import { Modal } from "../components/ImageModal";
import { CreateMasterProductModal } from "../components/CreateMasterProductModal";
import DebounceSearch from "../components/DebounceSearch";
import Breadcrumb from "../components/Breadcrumb";
import CardSkeleton from "../components/CardSkeleton";

export const MasterProductList = () => {
  const [products, setProducts] = useState<ICategoryServer[]>([]);
  const [openCreateMaster, setOpenCreateMaster] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<ICategoryServer[]>(
    [],
  );
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [refreshList, setRefreshList] = useState<boolean>(false);
  useEffect(() => {
    (async function getMatserProduct() {
      setIsLoading(true);
      const master = await httpClient.get(getCompleteUrlV1("master"));
      const products = await master.json();
      setProducts(products.data);
      setFilteredProducts(products.data);
      setIsLoading(false);
    })();
  }, [refreshList]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (imageUrl: string) => setSelectedImage(imageUrl);
  const closeImage = () => setSelectedImage(null);

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Master Product", to: "/master-product-list" },
          ]}
        />
        <div className="flex items-center justify-between mb-4">
          <DebounceSearch
            products={products}
            setSearchProduct={setFilteredProducts}
            placeholder="Search Products..."
          />

          <Button color="success" onClick={() => setOpenCreateMaster(true)}>
            Create Product
          </Button>
        </div>

        <table className="min-w-full text-sm font-light border-collapse">
          <thead className="bg-violet-800 text-white">
            <tr className="uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Product Name</th>
              <th className="py-3 px-6 text-left">SKU Code</th>
              <th className="py-3 px-6 text-left">Brand</th>
              <th className="py-3 px-6 text-left">Category Name</th>
              <th className="py-3 px-6 text-left">Size(s)</th>
              <th className="py-3 px-6 text-center">Image</th>
            </tr>
          </thead>
          {isloading ? (
            <>
              <CardSkeleton />
            </>
          ) : (
            <tbody className="text-gray-600 text-sm font-light">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(
                  ({
                    _id,
                    skuCode,
                    brand,
                    size,
                    media,
                    name,
                    categoryDetails,
                  }) => (
                    <tr
                      key={_id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">{name}</td>
                      <td className="py-3 px-6 text-left">{skuCode}</td>
                      <td className="py-3 px-6 text-left">{brand}</td>
                      <td className="py-3 px-6 text-left">
                        {categoryDetails?.name}
                      </td>
                      <td className="py-3 px-6 text-left">{size}</td>
                      <td className="py-2 px-2 text-center">
                        <Button
                          className="inline-block bg-purple-500 text-purple-100 px-3 py-1 rounded-md hover:bg-purple-400 transition"
                          onClick={() =>
                            media && media.length && openImage(media[0])
                          }
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {selectedImage && (
        <Modal onClose={closeImage}>
          <img
            src={selectedImage}
            alt="Product"
            className="max-w-full max-h-[60vh] object-contain rounded-lg"
          />
        </Modal>
      )}
      {openCreateMaster && (
        <CreateMasterProductModal
          isOpen={openCreateMaster}
          onClose={() => setOpenCreateMaster(false)}
          setRefreshList={setRefreshList}
        />
      )}
    </div>
  );
};
