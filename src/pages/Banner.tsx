import { useEffect, useState } from "react";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import { Button } from "../components/Button";
import DebounceSearch from "../components/DebounceSearch";
import { Modal } from "../components/ImageModal";
import { IBannerList } from "../types";
import CardSkeleton from "../components/CardSkeleton";
import BannerCreateModal from "../components/BannerCreateModal";

export const Banner = () => {
  const [banner, setBanner] = useState<IBannerList[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IBannerList[]>([]);
  const [openBannerModal, setOpenBannerModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    (async function getBannerList() {
      try {
        setIsLoading(true);
        const response = await httpClient.get(getCompleteUrlV1("banner"));
        const result = await response.json();
        setBanner(result.data);
        setFilteredProducts(result.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshList]);

  const openImage = (imageUrl: string) => setSelectedImage(imageUrl);
  const closeImage = () => setSelectedImage(null);

  const getContentName = (type: string, id: string) => {
    if (type === "category") {
      return (
        categoryList.find((cat) => cat._id === id)?.name || "Unknown Category"
      );
    }

    if (type === "product") {
      return (
        productList.find((prod) => prod._id === id)?.masterDetails?.name ||
        "Unknown Product"
      );
    }

    return "N/A";
  };

  useEffect(() => {
    (async function getMatserProduct() {
      setLoader(true);
      const master = await httpClient.get(getCompleteUrlV1("category"));
      const category = await master.json();
      setCategoryList(category.data);
      setLoader(false);
    })();
  }, []);

  useEffect(() => {
    (async function getMatserProduct() {
      setLoader(true);
      const master = await httpClient.get(getCompleteUrlV1("product"));
      const products = await master.json();
      setProductList(products.data);
      setLoader(false);
    })();
  }, []);

  if (loader) {
    <>
      <div>Loading...</div>
    </>;
  }

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
        {/* Search */}
        <div className="flex items-center justify-between mb-4">
          <DebounceSearch
            products={banner}
            setSearchProduct={setFilteredProducts}
            placeholder="Search banner..."
          />
          <div>
            <Button color={"success"} onClick={() => setOpenBannerModal(true)}>
              Add Banner
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-violet-800 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Content Type</th>
                <th className="py-3 px-6 text-left">Content Name</th>
                <th className="py-3 px-6 text-right">Image</th>
              </tr>
            </thead>

            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center">
                    <CardSkeleton />
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map(
                  ({ _id, contentType, contentId, media }) => (
                    <tr
                      key={_id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left capitalize">
                        {contentType}
                      </td>

                      <td className="py-3 px-6 text-left font-medium">
                        {getContentName(contentType, contentId)}
                      </td>

                      <td className="py-3 px-6 text-right">
                        <Button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() => media && openImage(media)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-6">
                    No banners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Modal onClose={closeImage}>
          <img
            src={selectedImage}
            alt="Banner"
            className="max-w-full max-h-[60vh] object-contain rounded-lg"
          />
        </Modal>
      )}

      {/* Banner Modal */}
      {openBannerModal && (
        <BannerCreateModal
          isOpen={openBannerModal}
          onClose={() => setOpenBannerModal(false)}
          setRefreshList={setRefreshList}
        />
      )}
    </div>
  );
};
