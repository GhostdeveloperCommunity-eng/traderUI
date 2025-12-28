import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

interface Size {
  size: string;
  mrp: string;
}

interface Category {
  name: string;
  images: File[] | null;
  slug: string;
  gender: string;
  sizeMrp: Size[];
}

interface IMasterProduct {
  name: string;
  brand: string;
  categoryId: string;
  skuCode: string;
  subCategory: string;
  productSubCategory: string;
  mrp: string;
  size: string;
  images: File[] | null;
  description: string;
}

interface CategoryFieldArrayProps {
  control: Control<IMasterProduct>;
  register: UseFormRegister<IMasterProduct>;
  setValue: UseFormSetValue<IMasterProduct>;
  getValues: UseFormGetValues<IMasterProduct>;
}

export interface ICategoryServer {
  _id: string;
  name: string;
  media: string[];
  brand: string;
  skuCode: string;
  active: boolean;
  size: string;
  categoryName: string;
  categoryId: string;
  categoryDetails: { [key: string]: any };
}

interface IMasterProductServer {
  name: string;
  brand: string;
  categoryId: string;
  varients: ICategoryServer[];
}

export interface ICategoryListServer {
  _id: string;
  name: string;
  media: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IBannerList {
  _id: string;
  contentType: string;
  media: string;
}
interface ILotProduct {
  _id: string;
  name: string;
  media: string[];
  lot: Lot[];
  status: Status;
  tags: string[];
  isFeatured: boolean;
  minPrice: number;
  maxPrice: number;
  masterId: string;
  masterDetails: IMasterProduct;
  categoryId: string;
  createdAt_EP: number;
  updatedAt_EP: number;
  expiry: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

interface Lot {
  quantity: number;
  price: number;
  originalPrice: number;
  _id: string;
}

// interface Pagination {
//   totalCount: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

export type {
  Size,
  Category,
  IMasterProduct,
  CategoryFieldArrayProps,
  IMasterProductServer,
  ILotProduct,
};

export enum Status {
  Pending = "pending",
  Active = "active",
  Inactive = "inactive",
}

export enum RequestStatus {
  Pending = "pending",
  Accept = "accept",
  Reject = "reject",
}

export enum AdminRequestsType {
  sellerOnboarding = "seller_onboarding",
  productApproval = "product_approval",
}

export interface IUser {
  role: string[];
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  affiliateId?: string;
  createdAt: string;
  seller?: {
    businessName: string;
    address?: string; // address1 not present in seller object, only address
    aadhaarNumber: string;
    gstNumber: string;
  };
}

export interface OrderItem {
  _id: string;
  quantity: number;
  totalAmount: number;
  brand?: string;
  promoterCommission?: number;
  media?: string[];
}

export interface Address {
  name?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  isActive: boolean;
}

export interface Order {
  _id: string;
  numericOrderId: number;
  createdAt: string;
  totalAmount: number;
  totalMrpWithQuantity: number;
  totalDiscountPercentage: number;
  totalDiscountWithQuantity?: number;
  paymentMethod: number;
  status: number;
  order_items: OrderItem[];
  address?: Address;
  statusChangeLogs: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  changedBy: string;
  oldStatus: number | string;
  newStatus: number;
  reason: string;
  timestamp: string;
}

export interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}
