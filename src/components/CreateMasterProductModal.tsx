import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getCompleteUrlV1, uploadImage } from "../utils";
import { IMasterProduct } from "../types";
import { httpClient } from "../services/ApiService";
import { FormError } from "./FormError";
import { Button } from "./Button";

const defaultValues: IMasterProduct = {
  name: "",
  brand: "",
  categoryId: "",
  skuCode: "",
  mrp: "",
  productSubCategory: "",
  size: "",
  subCategory: "",
  images: null,
  description: "",
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CreateMasterProductModal({
  isOpen,
  onClose,
  setRefreshList,
}: Props) {
  const [categories, setCategories] = useState<
    { _id: string; name: string; subCategory: string }[]
  >([]);

  const [loader, setLoader] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IMasterProduct>({ defaultValues });

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md " +
    "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";

  useEffect(() => {
    httpClient
      .get(getCompleteUrlV1("category"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setCategories(data.data);
        }
      });
  }, []);

  const onSubmit = async (data: IMasterProduct) => {
    let imageUrl = "";
    if (data.images?.length) {
      imageUrl = await uploadImage(data.images[0]);
    }
    setLoader(true);

    await httpClient.post(getCompleteUrlV1("master"), {
      ...data,
      media: [imageUrl],
    });

    reset(defaultValues);
    setLoader(false);
    onClose();
    setRefreshList((prev) => !prev);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h1 className="text-xl font-semibold text-gray-800">
              Create Master Product
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <select
                {...register("categoryId", {
                  required: "Category is required",
                })}
                className={inputClass}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FormError errorText={errors.categoryId?.message} />
            </div>

            <div>
              <input
                {...register("name", { required: "Product Name is required" })}
                placeholder="Product Name"
                className={inputClass}
              />
              <FormError errorText={errors.name?.message} />
            </div>

            <div>
              <input
                {...register("skuCode", { required: "SkuCode is required" })}
                placeholder="SKU Code"
                className={inputClass}
              />
              <FormError errorText={errors.skuCode?.message} />
            </div>

            <div>
              <input
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Description"
                className={inputClass}
              />
              <FormError errorText={errors.description?.message} />
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                {...register("images", { required: "Image is required" })}
                className={inputClass}
              />
              <FormError errorText={errors.images?.message} />
            </div>

            <div>
              <input
                {...register("brand")}
                placeholder="Brand"
                className={inputClass}
              />
            </div>

            <div>
              <input
                {...register("subCategory")}
                placeholder="Sub Category"
                className={inputClass}
              />
            </div>

            <div>
              <input
                {...register("productSubCategory")}
                placeholder="Product Sub Category"
                className={inputClass}
              />
            </div>

            <div>
              <input
                {...register("size")}
                placeholder="Size"
                className={inputClass}
              />
            </div>

            <div>
              <input
                type="number"
                {...register("mrp")}
                placeholder="MRP"
                className={inputClass}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 border-t pt-4">
            <Button
              type="submit"
              color="danger"
              disabled={loader}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" color="success" disabled={loader}>
              {loader ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
