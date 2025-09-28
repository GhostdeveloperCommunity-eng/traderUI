import { useEffect, useState } from "react";
import { httpClient } from "../services/ApiService";
import { getCompleteUrlV1 } from "../utils";

interface Seller {
  businessName: string;
  aadhaarNumber: string;
  gstNumber: string;
  status: string;
  _id: string;
}

interface SellerRequest {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  seller: Seller;
}

export const Approvals = () => {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function getSellerRequests() {
    setLoading(true);
    try {
      const response = await httpClient.get(
        getCompleteUrlV1("auth/onboard/seller")
      );
      const approvalRequests = await response.json();
      setRequests(approvalRequests.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  useEffect(() => {
    getSellerRequests();
  }, []);

  const handleAction = async (
    sellerId: string,
    action: "accept" | "reject"
  ) => {
    try {
      await httpClient.put(getCompleteUrlV1(`auth/onboard/seller`), {
        status: action,
        userId: sellerId,
        reason: action == "reject" ? "Please provide correct details" : "",
      });
      getSellerRequests();
    } catch (err) {
      console.error(`Failed to ${action} seller`, err);
    }
  };

  if (loading)
    return <div className="text-gray-500 p-6">Loading requests...</div>;

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Seller Approvals
      </h2>
      {requests.length === 0 ? (
        <p className="text-sm text-gray-500">No pending requests</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Business:</span>{" "}
                  {req.seller.businessName}
                </p>
                <p>
                  <span className="font-medium">GST:</span>{" "}
                  {req.seller.gstNumber || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {req.email}
                </p>
                <p>
                  <span className="font-medium">Name:</span> {req.firstName}{" "}
                  {req.lastName}
                </p>
                <p>
                  <span className="font-medium">Aadhaar:</span>{" "}
                  {req.seller.aadhaarNumber || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {req.seller.status || "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(req._id, "accept")}
                  className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req._id, "reject")}
                  className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
