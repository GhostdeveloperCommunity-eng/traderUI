import React, { useEffect, useState } from "react";
import { FaTrash, FaSync, FaExclamationTriangle, FaCheckCircle, FaImage } from "react-icons/fa";

interface ImagePreviewProps {
  src: string; // Blob URL or server URL
  fileName?: string;
  fileSize?: number; // in bytes
  onRemove: () => void;
  onReplace: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  fileName,
  fileSize,
  onRemove,
  onReplace,
}) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "warn">("loading");

  useEffect(() => {
    if (!src) return;

    setStatus("loading");
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setDimensions({ width: w, height: h });

      const newWarnings: string[] = [];
      const aspectRatio = w / h;

      // Rule 1: Resolution should not be too low
      if (w < 800) {
        newWarnings.push(`Low resolution (${w}px width). Recommended width is at least 1200px.`);
      }

      // Rule 2: Aspect ratio check (banners are typically landscape wide)
      if (aspectRatio < 1.3) {
        newWarnings.push("Low aspect ratio. Banners are typically wide landscape images (e.g., 16:9, 21:9).");
      }

      // Rule 3: File size warning
      if (fileSize && fileSize > 1.5 * 1024 * 1024) {
        newWarnings.push("Large file size. Optimizing below 1MB is recommended for faster page loads.");
      }

      setWarnings(newWarnings);
      setStatus(newWarnings.length > 0 ? "warn" : "success");
    };
    img.onerror = () => {
      setStatus("warn");
      setWarnings(["Failed to load image metadata."]);
    };
  }, [src, fileSize]);

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getAspectRatioStr = () => {
    if (!dimensions) return "";
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(dimensions.width, dimensions.height);
    const aspectW = dimensions.width / divisor;
    const aspectH = dimensions.height / divisor;
    
    // Check if it matches popular ratios approximately
    const ratio = dimensions.width / dimensions.height;
    if (Math.abs(ratio - 16/9) < 0.05) return "16:9 (Standard Wide)";
    if (Math.abs(ratio - 21/9) < 0.05) return "21:9 (Ultra Wide)";
    if (Math.abs(ratio - 4/3) < 0.05) return "4:3 (Landscape)";
    if (Math.abs(ratio - 1) < 0.05) return "1:1 (Square)";
    
    return `${aspectW}:${aspectH}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
      {/* Visual Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaImage className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px]">
            {fileName || "banner-media.png"}
          </span>
          {fileSize && (
            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border">
              {formatSize(fileSize)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReplace}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Replace Image"
          >
            <FaSync size={13} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Remove Image"
          >
            <FaTrash size={13} />
          </button>
        </div>
      </div>

      {/* Image Preview Window */}
      <div className="relative group overflow-hidden rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center min-h-[160px] max-h-[220px]">
        <img
          src={src}
          alt="Preview"
          className="max-h-[220px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Dimension Metrics */}
      {dimensions && (
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Resolution</span>
            <span className="text-xs font-bold text-slate-700 block mt-0.5">
              {dimensions.width} × {dimensions.height} px
            </span>
          </div>
          <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Aspect Ratio</span>
            <span className="text-xs font-bold text-slate-700 block mt-0.5">
              {getAspectRatioStr()}
            </span>
          </div>
        </div>
      )}

      {/* Validation Result */}
      <div className="pt-1">
        {status === "loading" ? (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-1.5 h-1.5 bg-slate-400 animate-pulse rounded-full" />
            Checking image quality...
          </div>
        ) : status === "success" ? (
          <div className="bg-emerald-50/50 border border-emerald-100 text-emerald-800 p-3 rounded-xl flex items-start gap-2.5 text-xs">
            <FaCheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Image verified</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Meets resolution, size, and layout guidelines.</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/55 border border-amber-100 text-amber-900 p-3 rounded-xl space-y-1.5">
            <div className="flex items-start gap-2.5 text-xs">
              <FaExclamationTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Quality recommendations</p>
                <ul className="list-disc pl-4 text-[11px] text-amber-700 mt-1 space-y-1">
                  {warnings.map((warn, idx) => (
                    <li key={idx}>{warn}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
