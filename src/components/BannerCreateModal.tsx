import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "./Button";
import { getCompleteUrlV1, uploadImage } from "../utils";
import { httpClient } from "../services/ApiService";
import { SearchableDropdown } from "./SearchableDropdown";
import { UploadZone } from "./UploadZone";
import { ImagePreview } from "./ImagePreview";
import { BannerPreview } from "./BannerPreview";
import { FaTimes, FaImage } from "react-icons/fa";
import { IBannerMetadata, IBannerItem } from "../types";

interface FormValues {
  title: string;
  contentType: string;
  contentId: string;
  position: string;
  platform: string;
  priority: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  categoryId?: string;
  masterDetails?: {
    name: string;
  };
}

interface BannerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>;
  bannerToEdit?: IBannerItem | null;
}

export const BannerCreateModal = ({
  isOpen,
  onClose,
  setRefreshList,
  bannerToEdit = null,
}: BannerCreateModalProps) => {
  const isEditMode = !!bannerToEdit;

  const [loader, setLoader] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  
  // Local states for image uploading and previewing
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(bannerToEdit?.media || null);
  const [imageError, setImageError] = useState<string | null>(null);

  const { control, handleSubmit, register, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      title: bannerToEdit?.metadata?.title || "",
      contentType: bannerToEdit?.contentType || "",
      contentId: bannerToEdit?.contentId || "",
      position: bannerToEdit?.metadata?.position || "Top Slider",
      platform: bannerToEdit?.metadata?.platform || "Web & Mobile",
      priority: bannerToEdit?.metadata?.priority || "Medium",
      status: bannerToEdit?.metadata?.status || "draft",
      startDate: bannerToEdit?.metadata?.startDate || new Date().toISOString().split("T")[0],
      endDate: bannerToEdit?.metadata?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      description: bannerToEdit?.metadata?.description || "",
    },
  });

  const selectedContentType = watch("contentType");

  // Fetch Category and Product lists for searchable selects
  useEffect(() => {
    (async function fetchCategories() {
      try {
        const res = await httpClient.get(getCompleteUrlV1("category/names"));
        const category = await res.json();
        setCategoryList(category.data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    })();

    (async function fetchProducts() {
      try {
        const res = await httpClient.get(getCompleteUrlV1("product"));
        const products = await res.json();
        setProductList(products.data || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    })();
  }, []);

  // Update image preview source when bannerToEdit changes
  useEffect(() => {
    if (bannerToEdit) {
      setPreviewSrc(bannerToEdit.media);
      setSelectedFile(null);
      setImageError(null);
      
      let initialContentId = bannerToEdit.contentId;
      if (bannerToEdit.contentType === "product" && productList.length > 0) {
        const matchProd = productList.find((p) => p.categoryId === bannerToEdit.contentId);
        if (matchProd) {
          initialContentId = matchProd._id;
        }
      }
      
      reset({
        title: bannerToEdit.metadata?.title || "",
        contentType: bannerToEdit.contentType || "",
        contentId: initialContentId || "",
        position: bannerToEdit.metadata?.position || "Top Slider",
        platform: bannerToEdit.metadata?.platform || "Web & Mobile",
        priority: bannerToEdit.metadata?.priority || "Medium",
        status: bannerToEdit.metadata?.status || "draft",
        startDate: bannerToEdit.metadata?.startDate || new Date().toISOString().split("T")[0],
        endDate: bannerToEdit.metadata?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: bannerToEdit.metadata?.description || "",
      });
    } else {
      setPreviewSrc(null);
      setSelectedFile(null);
      setImageError(null);
      reset({
        title: "",
        contentType: "",
        contentId: "",
        position: "Top Slider",
        platform: "Web & Mobile",
        priority: "Medium",
        status: "draft",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "",
      });
    }
  }, [bannerToEdit, reset, productList]);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setImageError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewSrc(null);
    setImageError(null);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (!previewSrc) {
        setImageError("A banner image is required.");
        return;
      }

      setLoader(true);

      let finalImageUrl = bannerToEdit?.media || "";

      // Upload image if a new file was dropped/selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (!uploadedUrl) {
          throw new Error("Failed to upload file to backend storage.");
        }
        finalImageUrl = uploadedUrl;
      }

      let apiContentId = data.contentId;
      if (data.contentType === "product") {
        const prod = productList.find((p) => p._id === data.contentId);
        if (prod && prod.categoryId) {
          apiContentId = prod.categoryId;
        }
      }

      const payload = {
        contentId: apiContentId,
        contentType: data.contentType,
        media: finalImageUrl,
      };

      console.log("[CMS Form Submit] Sending payload:", payload);

      let bannerId = bannerToEdit?._id || "";
      let response;

      if (isEditMode) {
        // Send PUT request to update
        response = await httpClient.put(
          getCompleteUrlV1(`banner/${bannerId}`),
          payload
        );
        console.log("[CMS Form Submit] PUT response status:", response.status);
        if (!response.ok) {
          const errMsg = await response.text();
          console.error("[CMS Form Submit] PUT failed:", errMsg);
          throw new Error(`Failed to update banner: ${errMsg || response.statusText}`);
        }
      } else {
        // Send POST request to create
        response = await httpClient.post(
          getCompleteUrlV1("banner"),
          payload
        );
        console.log("[CMS Form Submit] POST response status:", response.status);
        if (!response.ok) {
          const errMsg = await response.text();
          console.error("[CMS Form Submit] POST failed:", errMsg);
          throw new Error(`Failed to create banner: ${errMsg || response.statusText}`);
        }
        
        const result = await response.json();
        console.log("[CMS Form Submit] POST result:", result);
        // Extract new _id from server payload
        bannerId = result.data?._id || result.data?.id || `mock_${Date.now()}`;
      }

      // Sync custom metadata variables in localStorage
      if (bannerId) {
        const existingMetaStr = localStorage.getItem(`lottmart_banner_metadata_${bannerId}`);
        const existingMeta = existingMetaStr ? JSON.parse(existingMetaStr) : {};

        const updatedMetadata: IBannerMetadata = {
          title: data.title || `Banner for ${data.contentType}`,
          position: data.position,
          platform: data.platform,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          priority: data.priority,
          description: data.description,
          createdBy: existingMeta.createdBy || "Super Admin",
          updatedBy: "Super Admin",
          createdAt: existingMeta.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: existingMeta.views !== undefined ? existingMeta.views : Math.floor(Math.random() * 400) + 100,
          clicks: existingMeta.clicks !== undefined ? existingMeta.clicks : Math.floor(Math.random() * 20) + 5,
          ctr: 0,
        };
        
        // Calculate CTR
        const viewsCount = updatedMetadata.views;
        const clicksCount = updatedMetadata.clicks;
        updatedMetadata.ctr = viewsCount > 0 ? ((clicksCount / viewsCount) * 100).toFixed(1) : 0;

        localStorage.setItem(`lottmart_banner_metadata_${bannerId}`, JSON.stringify(updatedMetadata));
      }

      setRefreshList((prev) => !prev);
      onClose();
    } catch (error: any) {
      console.error("Error submitting banner CMS form:", error);
      setImageError(error?.message || "Submitting failed. Please make sure required fields are valid.");
    } finally {
      setLoader(false);
    }
  };

  const getDropdownOptions = () => {
    if (selectedContentType === "category") {
      return categoryList.map((c) => ({ label: c.name, value: c._id }));
    }
    if (selectedContentType === "product") {
      return productList.map((p) => ({
        label: p.masterDetails?.name || "Unnamed Product",
        value: p._id,
      }));
    }
    return [];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FaImage className="text-blue-500" />
              <span>{isEditMode ? "Edit Marketing Banner" : "Create Promotional Banner"}</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Configure parameters, validate media resolution and set targeted placements
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Modal Content Scroll Frame */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Side: Media Upload, Verification and Live Previews (Grid col span 5) */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-start">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Media Asset
                </span>
                
                {!previewSrc ? (
                  <UploadZone
                    onFileSelect={handleFileSelect}
                    onError={(msg) => setImageError(msg)}
                  />
                ) : (
                  <ImagePreview
                    src={previewSrc}
                    fileName={selectedFile?.name || "Current Banner Asset"}
                    fileSize={selectedFile?.size}
                    onRemove={handleRemoveImage}
                    onReplace={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/png, image/jpeg, image/webp";
                      input.onchange = (e: any) => {
                        if (e.target?.files?.[0]) handleFileSelect(e.target.files[0]);
                      };
                      input.click();
                    }}
                  />
                )}
                
                {imageError && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5 pt-1">
                    ⚠️ {imageError}
                  </p>
                )}
              </div>

              {previewSrc && (
                <div className="mt-2">
                  <BannerPreview
                    src={previewSrc}
                    contentType={selectedContentType}
                    contentName={
                      selectedContentType === "category"
                        ? categoryList.find((c) => c._id === watch("contentId"))?.name
                        : productList.find((p) => p._id === watch("contentId"))?.masterDetails?.name
                    }
                  />
                </div>
              )}
            </div>

            {/* Right Side: Marketing CMS Form Settings (Grid col span 7) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Banner Settings
                </span>
              </div>

              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Banner Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Festive Collection 2026"
                  {...register("title", { required: "Title is required" })}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                />
              </div>

              {/* Content Type select & Searchable dropdown mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Link Type</label>
                  <select
                    {...register("contentType", {
                      required: true,
                      onChange: () => {
                        setValue("contentId", ""); // Reset linked target
                      }
                    })}
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="">Select Link Type</option>
                    <option value="category">Category Link</option>
                    <option value="product">Product Link</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <Controller
                    name="contentId"
                    control={control}
                    rules={{ required: "Linked target is required" }}
                    render={({ field }) => (
                      <SearchableDropdown
                        label="Linked Target Item"
                        options={getDropdownOptions()}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          !selectedContentType
                            ? "Select Link Type first"
                            : selectedContentType === "category"
                            ? "Select Category..."
                            : "Select Product..."
                        }
                        disabled={!selectedContentType}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Position and platform rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Display Position</label>
                  <select
                    {...register("position", { required: true })}
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="Top Slider">Top Slider</option>
                    <option value="Middle">Middle Banner</option>
                    <option value="Bottom">Bottom Banner</option>
                    <option value="Sidebar">Sidebar</option>
                    <option value="Popup">Popup Overlay</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Target Platform</label>
                  <select
                    {...register("platform", { required: true })}
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="Web & Mobile">Web & Mobile</option>
                    <option value="Desktop Web">Desktop Web</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>
              </div>

              {/* Priority and Status settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Priority Engine Weight</label>
                  <select
                    {...register("priority", { required: true })}
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Publishing Status</label>
                  <select
                    {...register("status", { required: true })}
                    className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="expired">Expired</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Scheduling dates range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Display Start Date</label>
                  <input
                    type="date"
                    {...register("startDate", { required: true })}
                    className="w-full p-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Display End Date</label>
                  <input
                    type="date"
                    {...register("endDate", { required: true })}
                    className="w-full p-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-semibold">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Provide marketing campaigns detail notes, search keywords or target audiences details..."
                  {...register("description")}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                />
              </div>

            </div>

            {/* Hidden Submit Button triggered by standard actions footer */}
            <input type="submit" id="cms-submit-btn" className="hidden" />
          </form>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2.5 justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300/40 rounded-xl py-2 px-5 text-xs font-bold transition-colors"
            color="danger"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loader}
            onClick={() => document.getElementById("cms-submit-btn")?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-6 text-xs font-bold transition-all shadow-md shadow-blue-500/10"
            color="success"
          >
            {loader ? "Processing..." : isEditMode ? "Save Changes" : "Create Banner"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default BannerCreateModal;
