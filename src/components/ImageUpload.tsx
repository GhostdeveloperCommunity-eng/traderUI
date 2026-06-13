import React, { useState, useRef } from "react";
import { FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";

interface ImageUploadProps {
  value: File | string | null;
  onChange: (file: File) => void;
  onClear: () => void;
  error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onClear,
  error,
}) => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onChange(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Determine preview URL
  let previewUrl = "";
  if (value) {
    if (value instanceof File) {
      previewUrl = URL.createObjectURL(value);
    } else if (typeof value === "string") {
      previewUrl = value;
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        Category Image
      </label>

      {previewUrl ? (
        <div className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 h-48 flex items-center justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onButtonClick}
              className="p-2.5 bg-white text-slate-700 rounded-full shadow-lg hover:bg-slate-100 transition-colors"
              title="Change Image"
            >
              <FaCloudUploadAlt size={18} />
            </button>
            <button
              type="button"
              onClick={onClear}
              className="p-2.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
              title="Remove Image"
            >
              <FaTrashAlt size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${
            isDragActive
              ? "border-blue-500 bg-blue-50/50"
              : error
              ? "border-red-300 bg-red-50/20 hover:border-red-400"
              : "border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/10"
          }`}
        >
          <div className={`p-3 rounded-full ${error ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500"} transition-colors`}>
            <FaCloudUploadAlt size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Drag & drop image here, or{" "}
              <span className="text-blue-600 hover:underline">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPEG, PNG, WEBP (Max 2MB)
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {error && <p className="text-xs font-medium text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
