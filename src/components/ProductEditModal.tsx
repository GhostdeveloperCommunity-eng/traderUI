import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { httpClient } from "../services/ApiService";
import { getCompleteUrlV1, uploadImage } from "../utils";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";

interface FormValues {
  description: string;
  minPrice: number;
  maxPrice: number;
  minDiscount: number;
  maxDiscount: number;
  mrp: number;
  status: string;
  mfg: string;
  expiry: string;
  promoterCommission: number;
  connectorCommission: number;
  platformFee: number;
  isFeatured: boolean;
  availableInventory: number;
}

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  product: any;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  setRefreshTrigger,
  product,
}) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Media and Lot list states
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lots, setLots] = useState<{ quantity: number; price: number; originalPrice: number; _id?: string }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  // Pre-fill form
  useEffect(() => {
    if (product) {
      reset({
        description: product.description || "",
        minPrice: product.minPrice || 0,
        maxPrice: product.maxPrice || 0,
        minDiscount: product.minDiscount || 0,
        maxDiscount: product.maxDiscount || 0,
        mrp: product.mrp || 0,
        status: product.status || "active",
        mfg: product.mfg ? new Date(product.mfg).toISOString().split("T")[0] : "",
        expiry: product.expiry ? new Date(product.expiry).toISOString().split("T")[0] : "",
        promoterCommission: product.promoterCommission || 0,
        connectorCommission: product.connectorCommission || 0,
        platformFee: product.platformFee || 0,
        isFeatured: !!product.isFeatured,
        availableInventory: product.availableInventory || 0,
      });
      setMediaUrls(product.media || []);
      setLots(product.lot || []);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [product, reset, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddLot = () => {
    setLots((prev) => [...prev, { quantity: 0, price: 0, originalPrice: 0 }]);
  };

  const handleRemoveLot = (index: number) => {
    setLots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLotChange = (index: number, field: "quantity" | "price" | "originalPrice", value: number) => {
    setLots((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoader(true);
      setGeneralError(null);

      let updatedMedia = [...mediaUrls];
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          updatedMedia = [uploadedUrl, ...updatedMedia];
        }
      }

      const payload = {
        description: data.description,
        minPrice: Number(data.minPrice),
        maxPrice: Number(data.maxPrice),
        minDiscount: Number(data.minDiscount),
        maxDiscount: Number(data.maxDiscount),
        mrp: Number(data.mrp),
        status: data.status,
        mfg: data.mfg ? new Date(data.mfg).toISOString() : undefined,
        expiry: data.expiry ? new Date(data.expiry).toISOString() : undefined,
        promoterCommission: Number(data.promoterCommission),
        connectorCommission: Number(data.connectorCommission),
        platformFee: Number(data.platformFee),
        isFeatured: data.isFeatured,
        availableInventory: Number(data.availableInventory),
        media: updatedMedia,
        lot: lots.map(l => ({
          quantity: Number(l.quantity),
          price: Number(l.price),
          originalPrice: Number(l.originalPrice),
          _id: l._id
        })),
      };

      const response = await httpClient.put(
        getCompleteUrlV1("product"),
        {
          id: product._id,
          ...payload,
        }
      );

      if (response.ok) {
        setRefreshTrigger((prev) => !prev);
        onClose();
      } else {
        const errText = await response.text();
        console.error("Failed to update product", errText);
        setGeneralError("Failed to save product. Please verify fields and try again.");
      }
    } catch (error: any) {
      console.error("Error submitting product:", error);
      setGeneralError(error?.message || "An unexpected error occurred.");
    } finally {
      setLoader(false);
    }
  };

  if (!isOpen || !product) return null;

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] z-10">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Edit Product Details
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Modify details for <span className="font-semibold text-slate-600">{product.masterDetails?.name || "this product"}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
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

          {/* Product Images Section */}
          <div className="space-y-2">
            <label className={labelClass}>Product Images</label>
            <div className="flex flex-wrap gap-3 items-center">
              {mediaUrls.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden group shadow-sm">
                  <img src={url} alt="product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(idx)}
                    className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
              
              {imagePreview && (
                <div className="relative w-20 h-20 rounded-xl border border-blue-200 overflow-hidden group ring-2 ring-blue-500/30 shadow-sm">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              )}

              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 transition-colors flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-blue-500 bg-slate-50/50">
                <FaPlus size={14} />
                <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              placeholder="Product description..."
              {...register("description", { required: "Description is required" })}
              className={`${inputClass} resize-none`}
            />
            {errors.description && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Pricing & MRP Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Min Price (₹)</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                {...register("minPrice", { required: "Min Price is required", min: 0 })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Max Price (₹)</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                {...register("maxPrice", { required: "Max Price is required", min: 0 })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>MRP (₹)</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                {...register("mrp", { required: "MRP is required", min: 0 })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Discount Range Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Min Discount (%)</label>
              <input
                type="number"
                step="any"
                placeholder="0"
                {...register("minDiscount", { min: 0, max: 100 })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Max Discount (%)</label>
              <input
                type="number"
                step="any"
                placeholder="0"
                {...register("maxDiscount", { min: 0, max: 100 })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Manufacturing Date</label>
              <input type="date" {...register("mfg")} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Expiry Date</label>
              <input type="date" {...register("expiry")} className={inputClass} />
            </div>
          </div>

          {/* Commissions & Platform Fee Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Promoter Comm. (₹/%)</label>
              <input
                type="number"
                step="any"
                placeholder="0"
                {...register("promoterCommission")}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Connector Comm. (₹/%)</label>
              <input
                type="number"
                step="any"
                placeholder="0"
                {...register("connectorCommission")}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Platform Fee (₹/%)</label>
              <input
                type="number"
                step="any"
                placeholder="0"
                {...register("platformFee")}
                className={inputClass}
              />
            </div>
          </div>

          {/* Status & Inventory & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80">
            <div className="space-y-1">
              <label className={labelClass}>Product Status</label>
              <select {...register("status")} className={`${inputClass} bg-white`}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className={labelClass}>Inventory</label>
              <input
                type="number"
                placeholder="0"
                {...register("availableInventory", { required: "Inventory is required", min: 0 })}
                className={`${inputClass} bg-white`}
              />
            </div>

            <div className="flex items-center gap-3 pt-5 justify-center sm:justify-start sm:pl-3">
              <input
                id="isFeatured"
                type="checkbox"
                {...register("isFeatured")}
                className="w-4 h-4 rounded border-slate-300 accent-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                Featured Product
              </label>
            </div>
          </div>

          {/* Lot Details (Lott Size) List */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className={labelClass}>Lot Sizes (Lott Size)</label>
              <button
                type="button"
                onClick={handleAddLot}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all cursor-pointer border border-blue-100/50"
              >
                <FaPlus size={10} />
                <span>Add New Lot</span>
              </button>
            </div>

            {lots.length > 0 ? (
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-100 text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                      <th className="px-4 py-2 text-left font-semibold">Price (₹)</th>
                      <th className="px-4 py-2 text-left font-semibold">Original Price (₹)</th>
                      <th className="px-4 py-2 text-center font-semibold w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {lots.map((l, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={l.quantity}
                            onChange={(e) => handleLotChange(index, "quantity", Number(e.target.value))}
                            className="w-full px-2 py-1 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Qty"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            step="any"
                            value={l.price}
                            onChange={(e) => handleLotChange(index, "price", Number(e.target.value))}
                            className="w-full px-2 py-1 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Price"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            step="any"
                            value={l.originalPrice}
                            onChange={(e) => handleLotChange(index, "originalPrice", Number(e.target.value))}
                            className="w-full px-2 py-1 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Original Price"
                            required
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveLot(index)}
                            className="p-1 rounded text-red-500 hover:bg-red-50 transition-all cursor-pointer flex items-center justify-center mx-auto"
                          >
                            <FaTrash size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-400 font-medium text-xs bg-slate-50/30">
                No lots specified for this product. Click "Add New Lot" to add one.
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loader}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={loader}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 cursor-pointer"
          >
            {loader ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;
