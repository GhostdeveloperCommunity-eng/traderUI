import { useForm } from "react-hook-form";
import { Card } from "./Card";
import { Button } from "./Button";
import { getCompleteUrlV1, uploadImage } from "../utils";
import { httpClient } from "../services/ApiService";
import React, { useState } from "react";

interface FormValues {
  name: string;
  description?: string;
  images: FileList | null;
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
  const { handleSubmit, register, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      images: null,
    },
  });

  const [loader, setLoader] = useState<boolean>(false);

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    try {
      setLoader(true);
      const { images, ...restDetails } = data;
      let imageUrl = "";

      if (images?.length) {
        imageUrl = await uploadImage(images[0]);
      }

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      const response = await httpClient.post(getCompleteUrlV1("banner"), {
        ...restDetails,
        media: imageUrl,
      });

      if (response.ok) {
        setRefreshList((prev) => !prev);
        reset();
        onClose();
      } else {
        console.error("Failed to submit category");
      }
    } catch (error) {
      console.error("Error submitting category:", error);
    } finally {
      setLoader(false);
    }
  };

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
            <input
              type="text"
              placeholder="Select Category"
              {...register("name", { required: true })}
              className="w-full p-2 border rounded"
            />

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
