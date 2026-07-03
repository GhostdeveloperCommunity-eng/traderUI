import React, { useState, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  onError?: (message: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  accept = "image/png, image/jpeg, image/webp",
  maxSizeMB = 2,
  onError,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
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

  const validateAndSelectFile = (file: File) => {
    // Check format
    const acceptedTypes = accept.split(",").map((t) => t.trim());
    if (acceptedTypes.length > 0 && !acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.replace("/*", ""));
      }
      return file.type === type;
    })) {
      if (onError) onError("Unsupported file format. Please upload PNG, JPG, or WEBP.");
      return;
    }

    // Check size
    if (file.size > maxSizeMB * 1024 * 1024) {
      if (onError) onError(`File is too large. Max size is ${maxSizeMB}MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[220px] group ${
        isDragActive
          ? "border-blue-500 bg-blue-50/50 shadow-inner"
          : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/30"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />

      <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${
        isDragActive ? "bg-blue-100 text-blue-600 scale-110" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"
      }`}>
        <FaCloudUploadAlt size={32} className={isDragActive ? "animate-bounce" : ""} />
      </div>

      <p className="text-sm font-semibold text-slate-700 text-center mb-1">
        Drag & drop banner image here
      </p>
      <p className="text-xs text-slate-400 text-center mb-4">
        or click to browse your files
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">PNG</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">JPG</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">WEBP</span>
        <span className="text-slate-300">•</span>
        <span>Max {maxSizeMB}MB</span>
      </div>
    </div>
  );
};

export default UploadZone;
