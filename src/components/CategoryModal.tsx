import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ICategoryListServer } from "../types";
import { ImageUpload } from "./ImageUpload";
import { getCompleteUrlV1, uploadImage } from "../utils";
import { httpClient } from "../services/ApiService";
import { FaTimes } from "react-icons/fa";

interface FormValues {
  name: string;
  description: string;
  imageFile: File | string | null;
  isActive: boolean;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>;
  editingCategory: ICategoryListServer | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  setRefreshList,
  editingCategory,
}) => {
  const isEdit = !!editingCategory;
  const [loader, setLoader] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      imageFile: null,
      isActive: true,
    },
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name || "",
        description: editingCategory.description || "",
        imageFile: editingCategory.media || null,
        // Default to active, or parse if any active flag exists in custom structures
        isActive: (editingCategory as any).isActive !== false,
      });
    } else {
      reset({
        name: "",
        description: "",
        imageFile: null,
        isActive: true,
      });
    }
  }, [editingCategory, reset, isOpen]);

  const nameVal = watch("name");
  const imageVal = watch("imageFile");
  const descriptionVal = watch("description") || "";

  // Check custom validity (since standard react-hook-form can't easily validate complex File | string type directly)
  const isSubmitDisabled = !nameVal || !imageVal || loader;

  const onSubmit = async (data: FormValues) => {
    try {
      setLoader(true);
      setGeneralError(null);
      let imageUrl = "";

      if (data.imageFile instanceof File) {
        imageUrl = await uploadImage(data.imageFile);
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      } else if (typeof data.imageFile === "string") {
        imageUrl = data.imageFile;
      }

      if (!imageUrl) {
        throw new Error("Image is required to proceed.");
      }

      const payload = {
        name: data.name,
        description: data.description,
        media: imageUrl,
        isActive: data.isActive,
      };

      let response;
      if (isEdit && editingCategory) {
        response = await httpClient.put(
          getCompleteUrlV1(`category/${editingCategory._id}`),
          payload
        );
      } else {
        response = await httpClient.post(
          getCompleteUrlV1("category"),
          payload
        );
      }

      if (response.ok) {
        setRefreshList((prev) => !prev);
        reset();
        onClose();
      } else {
        const errText = await response.text();
        console.error("Failed to submit category", errText);
        setGeneralError("Failed to save category. Please try again.");
      }
    } catch (error: any) {
      console.error("Error submitting category:", error);
      setGeneralError(error?.message || "An unexpected error occurred.");
    } finally {
      setLoader(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEdit ? "Edit Category" : "Create New Category"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit
                ? "Update category settings and details"
                : "Add a brand new category to the platform"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {generalError && (
            <div className="p-3.5 bg-red-50 border border-red-200/50 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {generalError}
            </div>
          )}

          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Smart Electronics"
              {...register("name", {
                required: "Category name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 text-sm placeholder:text-slate-400 bg-slate-50/50 focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                  : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">
                Description
              </label>
              <span className="text-xs text-slate-400 font-medium">
                {descriptionVal.length}/500 chars
              </span>
            </div>
            <textarea
              placeholder="Write a brief overview of what this category represents..."
              rows={4}
              maxLength={500}
              {...register("description")}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Custom ImageUpload Component Integration */}
          <Controller
            name="imageFile"
            control={control}
            rules={{ required: !isEdit && "Category image is required" }}
            render={({ field, fieldState }) => (
              <ImageUpload
                value={field.value}
                onChange={(file) => setValue("imageFile", file, { shouldValidate: true })}
                onClear={() => setValue("imageFile", null, { shouldValidate: true })}
                error={fieldState.error?.message}
              />
            )}
          />

          {/* Status Toggle Switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Status Toggle
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Determine if this category is publicly active
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    field.value ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      field.value ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              )}
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loader}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitDisabled}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
          >
            {loader ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Category"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
