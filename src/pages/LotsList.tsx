import { useEffect, useState } from "react";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import { ILotProduct } from "../types";
import { Button } from "../components/Button";
import { Modal } from "../components/ImageModal";

export const LotList = () => {
  const [products, setProducts] = useState<ILotProduct[]>([]);
  const [updateFeature, setUpdateFeature] = useState<{
    id: string;
    isFeatured: boolean | null;
  }>({
    id: "",
    isFeatured: null,
  });
  useEffect(() => {
    (async function getMatserProduct() {
      const master = await httpClient.get(getCompleteUrlV1("product"));
      const products = await master.json();
      setProducts(products.data);
    })();
  }, [updateFeature]);

  const [selectedProductLot, setSelectedProductLot] = useState<ILotProduct| null>(
    null
  );

  const closeLots = () => setSelectedProductLot(null);
  const getDate = (expiry: string) => {
    return new Date(expiry).toDateString();
  };

  const clickFeaturedHandler = (isFeatured: boolean, id: string) => {
    return async function update() {
      try {
        const update = await httpClient.put(
          getCompleteUrlV1("product/featured"),
          {
            id,
            isFeatured: !isFeatured,
          }
        );
        console.log(update);
        setUpdateFeature({
          id,
          isFeatured: !isFeatured,
        });
      } catch (error) {
        console.log(error);
      }
    };
  };
  return (
    <div className="p-4">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Product Name</th>
            <th className="py-3 px-6 text-left">Best Price</th>
            <th className="py-3 px-6 text-left">Expiry</th>
            <th className="py-3 px-6 text-left">Lot(s)</th>
            <th className="py-3 px-6 text-left ">Featured</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {products.map((product) => {
            const { _id, isFeatured, name, minPrice, expiry, lot } = product;
            return <tr
              key={_id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">{name}</td>
              <td className="py-3 px-6 text-left">{minPrice}</td>
              <td className="py-3 px-6 text-left">{getDate(expiry)}</td>

              <td className="py-3 px-6 text-left">
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedProductLot(product);
                  }}
                >
                  {lot?.length}
                </a>
              </td>
              <td className="py-3 px-6 text-left">
                {isFeatured ? (
                  <Button
                    className="bg-red-600 py-[5px]  hover:bg-red-700"
                    onClick={clickFeaturedHandler(isFeatured, _id)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    className="py-[5px]"
                    onClick={clickFeaturedHandler(isFeatured, _id)}
                  >
                    Add
                  </Button>
                )}
              </td>
            </tr>
          })}
        </tbody>
      </table>

      {!!(selectedProductLot && selectedProductLot.lot?.length) && (
        <Modal onClose={closeLots}>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Product Name</th>
                <th className="py-3 px-6 text-left"> Price</th>
                <th className="py-3 px-6 text-left">Lot Size</th>
                <th className="py-3 px-6 text-left">MRP</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {selectedProductLot.lot.map(
                ({ _id, quantity, price, originalPrice }) => (
                  <tr
                    key={_id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">{selectedProductLot.name}</td>
                    <td className="py-3 px-6 text-left">{price}</td>
                    <td className="py-3 px-6 text-left">{quantity}</td>
                    <td className="py-3 px-6 text-left">{originalPrice}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  );
};
