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
  categoryDetails: {[key:string]: any}
}

interface IMasterProductServer {
  name: string;
  brand: string;
  categoryId: string;
  varients: ICategoryServer[];
}

export type {
  Size,
  Category,
  IMasterProduct,
  CategoryFieldArrayProps,
  IMasterProductServer,
};
