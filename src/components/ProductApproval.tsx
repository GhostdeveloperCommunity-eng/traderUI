import React from "react";
import { RequestType } from "../pages/Approvals";

interface ProductApprovalCardProps {
  req: any;
  handleAction: (req: any, type: RequestType) => void;
}

export const ProductApprovalCard: React.FC<ProductApprovalCardProps> = ({
  req,
  handleAction,
}) => {
  console.log(req.type, "fsdbfjhsdb");
  if (req.type !== "product_approval") return null;

  const product = req?.metadata || {};
  // if (!req?.metadata?.masterDetails) return null;
  return (
    <div
      key={req._id}
      className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md transition flex justify-between items-center"
    >
      <div className="flex items-center gap-4">
        {product.masterDetails?.media?.[0] && (
          <img
            src={product.masterDetails.media[0]}
            alt={product.name}
            className="w-24 h-24 "
          />
        )}
        <div className="text-sm text-gray-700 space-y-1">
          <p className="text-lg text-black">{product.masterDetails?.name}</p>
          {product?.description && <p> {product.description}</p>}
          {product?.mrp && <p>MRP: ₹{product.mrp}</p>}
        </div>
      </div>

      {req.status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction(req, "accept")}
            className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction(req, "reject")}
            className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductApprovalCard;
