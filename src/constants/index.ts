import { AdminRequestsType, RequestStatus } from "../types";

const baseUrl = import.meta.env.VITE_BASE_URL;
const genders = [
  {
    name: "Unisex",
    code: "3",
  },
  {
    name: "Male",
    code: "2",
  },
  {
    name: "Female",
    code: "1",
  },
];

const requestStatusOptions = [
  { label: "Pending", value: RequestStatus.Pending },
  { label: "Accept", value: RequestStatus.Accept },
  { label: "Reject", value: RequestStatus.Reject },
];

const requestTypeOptions = [
  { label: "Seller Approvals", value: AdminRequestsType.sellerOnboarding },
  { label: "Product Approvals", value: AdminRequestsType.productApproval },
];

export { baseUrl, genders, requestStatusOptions, requestTypeOptions };
