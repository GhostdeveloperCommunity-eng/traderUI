import { useEffect, useState } from "react";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import { ICategoryServer } from "../types";
import { Button } from "../components/Button";
import { Modal } from "../components/ImageModal";

export const MasterProductList = () => {
  const [products, setProducts] = useState<ICategoryServer[]>([]);
  useEffect(() => {
    (async function getMatserProduct() {
      const master = await httpClient.get(getCompleteUrlV1("master"));
      const products = await master.json();
      setProducts(products.data);
    })();
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (imageUrl: string) => setSelectedImage(imageUrl);
  const closeImage = () => setSelectedImage(null);
  return (
    <div className="p-4">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Product Name</th>
            <th className="py-3 px-6 text-left">SKU Code</th>
            <th className="py-3 px-6 text-left">Brand</th>
            <th className="py-3 px-6 text-left">Category Name</th>
            <th className="py-3 px-6 text-left">Size(s)</th>
            <th className="py-3 px-6 text-center">Image</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {products.map(
            ({ _id, skuCode, brand, size, media, name, categoryDetails }) => (
              <tr
                key={_id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{name}</td>
                <td className="py-3 px-6 text-left">{skuCode}</td>
                <td className="py-3 px-6 text-left">{brand}</td>
                <td className="py-3 px-6 text-left">{categoryDetails?.name}</td>
                <td className="py-3 px-6 text-left">{size}</td>
                <td className="py-2 px-2 text-center">
                  <Button
                    className="bg-blue-500 text-white px-3 py-[6px] rounded hover:bg-blue-600"
                    onClick={() => media && media.length && openImage(media[0])}
                  >
                    View
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {selectedImage && (
        <Modal onClose={closeImage}>
          <img
            src={selectedImage}
            alt="Product"
            className="max-w-full max-h-[60vh] object-contain rounded-lg"
          />
        </Modal>
      )}
    </div>
  );
};
