import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getCompleteUrlV1, uploadImage } from "../utils";
import { IMasterProduct } from "../types";
import { httpClient } from "../services/ApiService";
import { FormError } from "../components/FormError";

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

export function CreateMasterProduct() {
  const [categories, setCategories] = useState<
    { _id: string; name: string; subCategory: string }[]
  >([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IMasterProduct>({
    defaultValues,
  });



  const onSubmit = async (data: IMasterProduct) => {
    const { images } = data;
    let imageUrl = "";
    if (images?.length) {
      imageUrl = await uploadImage(images[0]);
    }
    console.log(data);
    try {
      const master = await httpClient.post(
        getCompleteUrlV1("master"),
        {
          ...data,
          media: [imageUrl],
        }
      );
      console.log("Master product response:", await master.json());
      reset({ ...defaultValues });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    httpClient
      .get(
        getCompleteUrlV1("category"),
      )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setCategories(data.data);
        }
      });
  }, []);

  return (
    <div className="flex justify-center items-center mt-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 bg-white shadow-md rounded-lg p-6 w-full max-w-6xl"
      >
        <h1 className="text-2xl font-semibold  text-gray-800">
          Master Product
        </h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <select
              {...register("categoryId", { required: "Category is required" })}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FormError errorText={errors.categoryId?.message} />
          </div>

          <div>
            <input
              type="text"
              placeholder="Product Name"
              {...register("name", { required: "Product Name is required" })}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
            />
            <FormError errorText={errors.name?.message} />
          </div>
          <div>
            <input
              type="text"
              placeholder="Sku Code"
              {...register("skuCode", { required: "SkuCode is required" })}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
            />
            <FormError errorText={errors.skuCode?.message} />
          </div>
          <div>
            <input
              type="text"
              placeholder="Description..."
              {...register("description", { required: "description is required" })}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
            />
            <FormError errorText={errors.description?.message} />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              {...register(`images`, {
                required: "Image is required",
              })}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
            />

            <FormError errorText={errors.images?.message} />
          </div>
          <div>
            <input
              type="text"
              placeholder="Brand Name"
              {...register("brand")}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Subcategory"
              {...register("subCategory")}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Product Subcategory"
              {...register("productSubCategory")}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600 focus:outline-none focus:border-teal-600"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Size"
              {...register("size")}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Mrp"
              {...register("mrp")}
              className="w-full p-2 border border-gray-100 rounded focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 font-semibold rounded hover:bg-teal-600 min-w-xs mx-auto cursor-pointer"
          >
            Add +
          </button>
        </div>
      </form>
    </div>
  );
}
