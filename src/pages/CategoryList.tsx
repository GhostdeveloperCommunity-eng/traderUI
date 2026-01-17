import { useEffect, useState } from "react";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import { Button } from "../components/Button";
import DebounceSearch from "../components/DebounceSearch";
import CreateCategory from "../components/CreateCategory";
import moment from "moment";
import { Modal } from "../components/ImageModal";
import { ICategoryListServer } from "../types";
import Breadcrumb from "../components/Breadcrumb";
import CardSkeleton from "../components/CardSkeleton";

export const CategoryList = () => {
  const [products, setProducts] = useState<ICategoryListServer[]>([]);
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<
    ICategoryListServer[]
  >([]);

  const [isloading, setIsLoading] = useState<boolean>(true);
  const [refreshList, setRefreshList] = useState<boolean>(false);
  useEffect(() => {
    (async function getMatserProduct() {
      setIsLoading(true);
      const master = await httpClient.get(getCompleteUrlV1("category"));
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
            { label: "Category", to: "/category-list" },
          ]}
        />
        <div className="flex items-center justify-between mb-4">
          <DebounceSearch
            products={products}
            setSearchProduct={setFilteredProducts}
            placeholder="Search categories..."
          />
          <Button color="success" onClick={() => setOpenCategoryModal(true)}>
            Create Category
          </Button>
        </div>
        <table className="min-w-full text-sm font-light border-collapse">
          <thead className="bg-violet-800 text-white">
            <tr className="uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-center">Image</th>
            </tr>
          </thead>
          {isloading ? (
            <div className="w-full">
              <CardSkeleton />
            </div>
          ) : (
            <tbody className="text-gray-600 text-sm font-light">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(
                  ({ _id, name, media, description, updatedAt }) => (
                    <tr
                      key={_id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">{name}</td>
                      <td className="py-3 px-6 text-left">{description}</td>
                      <td className="py-3 px-6 text-left">
                        {moment(updatedAt).format("DD-MM-YYYY")}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <Button
                          className="inline-block bg-purple-500 text-purple-100 px-3 py-1 rounded-md hover:bg-purple-400 transition"
                          onClick={() => media?.length && openImage(media)}
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
      {openCategoryModal && (
        <CreateCategory
          isOpen={openCategoryModal}
          onClose={() => setOpenCategoryModal(false)}
          setRefreshList={setRefreshList}
        />
      )}
    </div>
  );
};
