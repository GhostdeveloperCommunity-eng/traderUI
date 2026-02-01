import { useForm } from "react-hook-form";
import { Card } from "./Card";
import { Button } from "./Button";
import { getCompleteUrlV1, uploadImage } from "../utils";
import { httpClient } from "../services/ApiService";
import React, { useEffect, useState } from "react";

interface FormValues {
  contentId: string;
  contentType?: string;
  images: FileList | null;
}
interface Category {
  _id: string;
  name: string;
}
interface Product {
  _id: string;
  masterDetails: MasterDetails;
}
export interface MasterDetails {
  _id: string;
  name: string;
  media: string[];
}

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BannerCreateModal = ({
  isOpen,
  onClose,
  setRefreshList,
}: BannerModalProps) => {
  const { handleSubmit, register, reset, watch } = useForm<FormValues>({
    defaultValues: {
      contentType: "",
      contentId: "",
      images: null,
    },
  });

  const selectedContentType = watch("contentType");

  const [loader, setLoader] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    try {
      setLoader(true);

      const { images, contentType, contentId } = data;

      let imageUrl = "";

      if (images?.length) {
        imageUrl = await uploadImage(images[0]);
      }

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      const payload = {
        contentId: contentId,
        contentType: contentType,
        media: imageUrl,
      };

      const response = await httpClient.post(
        getCompleteUrlV1("banner"),
        payload,
      );

      if (response.ok) {
        setRefreshList((prev) => !prev);
        reset();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting banner:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    (async function getMatserProduct() {
      setLoader(true);
      const master = await httpClient.get(getCompleteUrlV1("category"));
      const category = await master.json();
      setCategoryList(category.data);
      setLoader(false);
    })();
  }, []);

  useEffect(() => {
    (async function getMatserProduct() {
      setLoader(true);
      const master = await httpClient.get(getCompleteUrlV1("product"));
      const products = await master.json();
      setProductList(products.data);
      setLoader(false);
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md mx-auto">
        <Card>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create Banner</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <select
              {...register("contentType", { required: true })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Content Type</option>
              <option value="category">Category</option>
              <option value="product">Product</option>
            </select>

            {selectedContentType === "category" && (
              <select
                {...register("contentId", { required: true })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categoryList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            )}

            {selectedContentType === "product" && (
              <select
                {...register("contentId", { required: true })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Product</option>
                {productList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item?.masterDetails?.name}
                  </option>
                ))}
              </select>
            )}

            <input
              type="file"
              accept="image/*"
              {...register("images", { required: true })}
              className="w-full p-2 border rounded"
            />

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                onClick={onClose}
                className="w-1/2 bg-gray-300 text-black"
                color="danger"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-1/2"
                disabled={loader}
                color="success"
              >
                {loader ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BannerCreateModal;
