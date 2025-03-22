import { useForm } from "react-hook-form";
import CategoryFieldArray from "../components/CategoryFieldArray";
import { useEffect, useState } from "react";
import { getCompleteUrlV1 } from "../utils";
import { IMasterProduct } from "../types";
import { httpClient } from "../services/ApiService";

const defaultValues: IMasterProduct = {
  name: "",
  brand: "",
  categoryId: "",
  varients: [
    {
      name: "",
      images: null,
      slug: "",
      gender: "3",
      sizeMrp: [{ size: "", mrp: "" }],
    },
  ],
};

export function CreateMasterProduct() {
  const [categories, setCategories] = useState<
    { _id: string; name: string; subCategory: string }[]
  >([]);
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IMasterProduct>({
    defaultValues,
  });

  const uploadImage = async (file: File) => {
    if (!file) return null;

    const uploadUrl = getCompleteUrlV1("categories/upload_Image");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await httpClient.post(uploadUrl, formData);
      const data = await response.json();
      return data.data?.[0] || null;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const onSubmit = async (data: IMasterProduct) => {
    const productName = getValues("name");

    const { varients } = data;
    const clonedVariants = window.structuredClone(varients);

    await Promise.all(
      clonedVariants.map(async (variant, index) => {
        if (variant.images?.length) {
          const imageUrl = await uploadImage(variant.images[0]);
          if (imageUrl) {
            clonedVariants[index].images = [imageUrl];
          }
        }
        if (!getValues(`varients.${index}.name`)) {
          setValue(`varients.${index}.name`, productName);
          clonedVariants[index].name = productName;
        }
      })
    );

    data.varients = clonedVariants;
    try {
      const master = await httpClient.post(
        getCompleteUrlV1("products/master_product"),
        data
      );
      console.log("Master product response:", await master.json());
      reset({ ...defaultValues });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    httpClient
      .get(getCompleteUrlV1("categories"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setCategories(data.data);
        }
      });
  }, []);

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 bg-white shadow-md rounded-lg p-6 w-full max-w-6xl"
      >
        <h1 className="text-2xl font-semibold  text-gray-800">
          Product Variants
        </h1>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          <div>
            <select
              {...register("categoryId", { required: "Category is required" })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name} - {category.subCategory}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500">{errors.categoryId.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Brand Name"
              {...register("brand")}
              className="w-full p-2 border rounded"
            />
            {errors.brand && (
              <p className="text-red-500">{errors.brand.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Product Name"
              {...register("name", { required: "Product Name is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>

        <CategoryFieldArray {...{ control, register, getValues, setValue }} />

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
