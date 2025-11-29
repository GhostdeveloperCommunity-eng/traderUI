import React from "react";

interface SellerOnboardingCardProps {
  req: any;
  handleAction: (id: string, action: "accept" | "reject") => void;
}

export const SellerOnboardingCard: React.FC<SellerOnboardingCardProps> = ({
  req,
  handleAction,
}) => {
  if (req.type !== "seller_onboarding") return null;

  return (
    <div
      key={req._id}
      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex justify-between items-center"
    >
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Business:</span>{" "}
          {req.metadata.businessName}
        </p>
        <p>
          <span className="font-medium">GST:</span>{" "}
          {req.metadata.gstNumber || "N/A"}
        </p>
        <p>
          <span className="font-medium">Aadhaar:</span>{" "}
          {req.metadata.aadhaarNumber || "N/A"}
        </p>
        <p>
          <span className="font-medium">Status:</span> {req.status || "N/A"}
        </p>
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

export default SellerOnboardingCard;
