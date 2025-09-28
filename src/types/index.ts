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
  description: string
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

interface ILotProduct {
  _id: string;
  name: string;
  media: string[];
  lot: Lot[];
  status: string;
  tags: string[];
  isFeatured: boolean;
  minPrice: number;
  maxPrice: number;
  masterId: string;
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
