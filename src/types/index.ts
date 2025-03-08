import { Control, UseFormGetValues, UseFormRegister, UseFormSetValue } from "react-hook-form";

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
  brandName: string;
  categoryId: string;
  varients: Category[];
}

interface CategoryFieldArrayProps {
    control: Control<IMasterProduct>;
    register: UseFormRegister<IMasterProduct>;
    setValue: UseFormSetValue<IMasterProduct>;
    getValues: UseFormGetValues<IMasterProduct>;
  }

export type { Size, Category, IMasterProduct, CategoryFieldArrayProps };
