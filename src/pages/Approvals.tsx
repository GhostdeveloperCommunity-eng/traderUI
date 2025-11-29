import { SetStateAction, useEffect, useState } from "react";
import { httpClient } from "../services/ApiService";
import { getCompleteUrlV1 } from "../utils";
import { AdminRequestsType, RequestStatus } from "../types";
import SelectField from "../components/SelectField";
import { requestStatusOptions, requestTypeOptions } from "../constants";
import SellerOnboardingCard from "../components/SellerOnboarding";
import ProductApprovalCard from "../components/ProductApproval";
import { Modal } from "../components/ImageModal";

interface Seller {
  businessName: string;
  aadhaarNumber: string;
  gstNumber: string;
  _id: string;
}

interface SellerRequest {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  metadata: Seller;
  status: string;
  type: "seller_onboarding" | "product_approval";
}

interface IInitialFees {
  messengerFee: string;
  connectorFee: string;
  platformFee: string;
}
const initialFees: IInitialFees = {
  messengerFee: "",
  connectorFee: "",
  platformFee: "",
};

export type RequestType = "accept" | "reject";

export const Approvals = () => {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<RequestType | null>(null);

  const [filters, setFilters] = useState<{
    status: RequestStatus;
    type: AdminRequestsType;
  }>({
    status: RequestStatus.Pending,
    type: AdminRequestsType.sellerOnboarding,
  });

  const [fees, setFees] = useState(initialFees);
  const [error, setError] = useState("");

  const handleSubmit = async (request: any, requestType: RequestType) => {
    const selectedRequest = request;
    let data: any = {
      id: selectedRequest?._id,
      status: requestType,
    };
    if (
      requestType == "accept" &&
      selectedRequest.type === "product_approval"
    ) {
      const { messengerFee, connectorFee, platformFee } = fees;
      const m = parseInt(messengerFee);
      const c = parseInt(connectorFee);
      const p = parseInt(platformFee);
      if (isNaN(m) || isNaN(c) || isNaN(p)) {
        setError("All fields must be valid numbers");
        return;
      }
      data["metadata"] = {
        promoterCommission: m,
        connectorCommission: c,
        platformFee: p || 3,
      };
    }
    await httpClient.put(getCompleteUrlV1(`request`), data);
    resetState();
  };

  const resetState = () => {
    setError("");
    onModalClose();
    setFilters({ ...filters });
    setSelectedRequest(null);
  };

  async function getSellerRequests() {
    setRequests([]);
    setLoading(true);
    try {
      const response = await httpClient.get(
        getCompleteUrlV1("request/admin-requests", filters)
      );

      const [approvalRequests] = await Promise.all([
        response.json(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);
      setRequests(approvalRequests.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSellerRequests();
  }, [filters]);

  const onConfirm = (request: any, requestType: RequestType) => {
    handleSubmit(request, requestType);
  };

  const handleSellerReqAction = async (
    request: any,
    requestType: RequestType
  ) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to ${requestType} seller - ${request.metadata?.businessName}`
    );
    if (userConfirmed) {
      // OK CLICKED
      onConfirm(request, requestType); // call your success callback
    }
  };

  const onModalClose = () => {
    setSelectedRequest(null);
    setFees({ ...initialFees });
  };

  return (
    <div className="p-6">
      <div className="flex mb-2 items-center">
        <h2 className="text-lg flex flex-1 font-semibold text-gray-700">
          Approval Requests
        </h2>
        <div className="flex gap-8">
          <SelectField<AdminRequestsType>
            options={requestTypeOptions}
            value={filters.type}
            onChange={(value) =>
              setFilters({
                ...filters,
                type: value,
              })
            }
            placeholder="Select status"
          />
          <SelectField<RequestStatus>
            options={requestStatusOptions}
            value={filters.status}
            onChange={(value) =>
              setFilters({
                ...filters,
                status: value,
              })
            }
            placeholder="Select status"
          />
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Loading requests...</div>
      )}
      {requests.length === 0 && !loading ? (
        <p className="text-sm text-gray-500">No pending requests</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            if (req.type == "seller_onboarding") {
              return (
                <SellerOnboardingCard
                  req={req}
                  handleAction={handleSellerReqAction}
                />
              );
            } else if (req.type == "product_approval") {
              return (
                <ProductApprovalCard
                  req={req}
                  handleAction={(value, type) => {
                    setSelectedRequest(value);
                    setActionType(type);
                  }}
                />
              );
            }
          })}
        </div>
      )}
      {Boolean(selectedRequest?._id) &&
        selectedRequest.type == "product_approval" && (
          <ProductApprovalModal
            fees={fees}
            setFees={setFees}
            selectedRequest={selectedRequest}
            error={error}
            handleSubmit={handleSubmit}
            onModalClose={onModalClose}
            key={"productApproval"}
            actionType={actionType}
          />
        )}
    </div>
  );
};

interface IProductApproval {
  selectedRequest: any;
  onModalClose: () => void;
  fees: IInitialFees;
  setFees: (fees: SetStateAction<IInitialFees>) => void;
  error: string;
  handleSubmit: (request: any, type: RequestType) => Promise<void>;
  actionType: RequestType | null;
}
const ProductApprovalModal = ({
  selectedRequest,
  onModalClose,
  fees,
  setFees,
  error,
  handleSubmit,
  actionType,
}: IProductApproval) => {
  return (
    <Modal key={selectedRequest?._id} onClose={onModalClose}>
      {selectedRequest?.status == "pending" && actionType === "accept" ? (
        <div className="fee__form">
          <h3 className="text-md font-semibold mb-4">
            Activate - {selectedRequest?.metadata?.masterDetails.name}
          </h3>
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Messenger Fee"
              value={fees.messengerFee}
              onChange={(e) =>
                setFees({ ...fees, messengerFee: e.target.value })
              }
              className="w-full border-1 rounded-md border-gray-200 px-3 py-2 text-sm focus:border-violet-500 outline-none"
            />
            <input
              type="number"
              placeholder="Connector Fee"
              value={fees.connectorFee}
              onChange={(e) =>
                setFees({ ...fees, connectorFee: e.target.value })
              }
              className="w-full border-1 rounded-md border-gray-200 px-3 py-2 text-sm focus:border-violet-500 outline-none"
            />
            <input
              type="number"
              placeholder="Platform Fee"
              value={fees.platformFee}
              onChange={(e) =>
                setFees({ ...fees, platformFee: e.target.value })
              }
              className="w-full border-1 rounded-md  border-gray-200 px-3 py-2 text-sm focus:border-violet-500 outline-none"
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => handleSubmit(selectedRequest, "accept")}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="m-4"> Are you sure reject</h2>
          <button
            onClick={() => handleSubmit(selectedRequest, "reject")}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 cursor-pointer"
          >
            Submit
          </button>
        </>
      )}
    </Modal>
  );
};
