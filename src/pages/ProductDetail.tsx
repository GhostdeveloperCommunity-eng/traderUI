import moment from "moment";
import { Button } from "../components/Button";

type ProductDetailProps = {
  product: any;
};

export const ProductDetail = ({ product }: ProductDetailProps) => {
  const {
    description,
    media,
    lot,
    bestSellerLot,
    status,
    tags,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    mrp,
    availableInventory,
    brand,
    masterDetails,
    sellerDetails,
    createdAt,
  } = product;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {masterDetails?.name}
        </h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <img
            src={media?.[0]}
            alt="product"
            className="w-full h-96 object-cover rounded-xl shadow"
          />

          <div className="flex gap-3 mt-4">
            {media?.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:ring-2 hover:ring-blue-500"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <p className="text-gray-600">{description}</p>

          <div className="flex gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-500">Price Range</p>
              <p className="text-lg font-semibold text-blue-600">
                ₹{minPrice} – ₹{maxPrice}
              </p>
            </div>

            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-500">Discount</p>
              <p className="text-lg font-semibold text-green-600">
                {minDiscount}% – {maxDiscount}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Info label="Brand" value={brand} />
            <Info label="MRP" value={`₹${mrp}`} />
            <Info label="Inventory" value={availableInventory} />
            <Info
              label="Created On"
              value={moment(createdAt).format("DD MMM YYYY")}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button color="primary">Edit Product</Button>
            <Button color="danger">Deactivate</Button>
          </div>
        </div>
      </div>

      {/* Best Seller Lot */}
      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Best Seller Lot</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <Stat label="Quantity" value={bestSellerLot?.quantity} />
          <Stat label="Price" value={`₹${bestSellerLot?.price}`} />
          <Stat label="Discount" value={`${bestSellerLot?.discount}%`} />
          <Stat label="Final Price" value={`₹${bestSellerLot?.price}`} />
        </div>
      </div>

      {/* Lot Table */}
      <div className="mt-10 bg-white rounded-xl shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-6">Lot Details</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Discount</th>
            </tr>
          </thead>
          <tbody>
            {lot?.map((l: any) => (
              <tr key={l._id} className="border-t">
                <td className="px-6 py-3">{l.quantity}</td>
                <td className="px-6 py-3">₹{l.price}</td>
                <td className="px-6 py-3">{l.discount}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seller Info */}
      {sellerDetails && (
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
          <p className="text-gray-700">
            {sellerDetails.firstName} {sellerDetails.lastName}
          </p>
        </div>
      )}
    </div>
  );
};

/* Reusable Components */

const Info = ({ label, value }: any) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const Stat = ({ label, value }: any) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);
