import { useEffect, useState } from "react";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import { IMasterProductServer } from "../types";
import { Button } from "../components/Button";
import { Modal } from "../components/ImageModal";
import { genders } from "../constants";

export const MasterProductList = () => {
  const [products, setProducts] = useState<
    {
      product_detail: IMasterProductServer;
      _id: string;
    }[]
  >([]);
  useEffect(() => {
    (async function getMatserProduct() {
      const master = await httpClient.get(
        getCompleteUrlV1("products/master_product")
      );
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
            <th className="py-3 px-6 text-left">Brand</th>
            <th className="py-3 px-6 text-left">Variant Name</th>
            <th className="py-3 px-6 text-left">Gender</th>

            <th className="py-3 px-6 text-left">Size(s)</th>
            <th className="py-3 px-6 text-center">Image</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {products.map((product) =>
            product.product_detail.varients.map((variant) => (
              <tr
                key={variant.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{product.product_detail.name}</td>
                <td className="py-3 px-6 text-left">
                  {product.product_detail.brand}
                </td>
                <td className="py-3 px-6 text-left">{variant.name}</td>
                <td className="py-3 px-6 text-left">
                  {genders.find((item) => item.code === variant.gender)?.name}
                </td>
                <td className="py-3 px-6 text-left">
                  Sizes - {variant.sizeMrp.length}
                </td>
                <td className="py-2 px-2 text-center">
                  <Button
                    className="bg-blue-500 text-white px-3 py-[6px] rounded hover:bg-blue-600"
                    onClick={() =>
                      variant.images && openImage(variant?.images[0])
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedImage && <Modal imageUrl={selectedImage} onClose={closeImage} />}
    </div>
  );
};
