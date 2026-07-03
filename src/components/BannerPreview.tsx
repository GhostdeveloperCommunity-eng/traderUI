import React, { useState } from "react";
import { FaLaptop, FaTabletAlt, FaMobileAlt } from "react-icons/fa";
import clsx from "clsx";

interface BannerPreviewProps {
  src: string; // image source URL (blob or path)
  contentType?: string;
  contentName?: string;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

export const BannerPreview: React.FC<BannerPreviewProps> = ({
  src,
  contentType = "category",
  contentName = "Summer Sale",
}) => {
  const [device, setDevice] = useState<DeviceMode>("desktop");

  const devices = [
    { mode: "desktop" as DeviceMode, icon: <FaLaptop size={14} />, label: "Desktop" },
    { mode: "tablet" as DeviceMode, icon: <FaTabletAlt size={14} />, label: "Tablet" },
    { mode: "mobile" as DeviceMode, icon: <FaMobileAlt size={14} />, label: "Mobile" },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center">
      {/* Device Toggle Header */}
      <div className="flex items-center justify-between w-full border-b border-slate-200/60 pb-3 mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Live Placement Preview
        </span>
        
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
          {devices.map((d) => (
            <button
              key={d.mode}
              type="button"
              onClick={() => setDevice(d.mode)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-200",
                device === d.mode
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/30"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {d.icon}
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Frame Wrapper */}
      <div className="w-full flex items-center justify-center py-6 bg-slate-100/50 border border-slate-200/30 rounded-xl overflow-hidden min-h-[260px]">
        {/* Desktop Browser Frame */}
        {device === "desktop" && (
          <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300">
            {/* Browser Header Bar */}
            <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 block" />
              <span className="w-2 h-2 rounded-full bg-yellow-400 block" />
              <span className="w-2 h-2 rounded-full bg-green-400 block" />
              <div className="h-4 bg-white rounded flex-1 mx-4 border border-slate-200 flex items-center justify-center text-[7px] text-slate-400 select-none">
                lottmart.com/store
              </div>
            </div>
            {/* Page Content / Hero banner mockup */}
            <div className="relative">
              {src ? (
                <img src={src} alt="Desktop Preview" className="w-full aspect-[21/9] object-cover" />
              ) : (
                <div className="w-full aspect-[21/9] bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]">
                  No image uploaded
                </div>
              )}
              {/* Marketing UI overlay mock */}
              <div className="absolute inset-0 bg-black/15 p-3 flex flex-col justify-end text-white select-none">
                <span className="text-[6px] font-bold uppercase bg-blue-600 self-start px-1 py-0.5 rounded leading-none mb-1">
                  Featured {contentType}
                </span>
                <h4 className="text-[10px] font-bold leading-none drop-shadow">{contentName}</h4>
              </div>
            </div>
          </div>
        )}

        {/* Tablet Mock Frame */}
        {device === "tablet" && (
          <div className="w-[300px] h-[200px] bg-slate-950 border-[6px] border-slate-800 rounded-2xl shadow-xl overflow-hidden relative transition-all duration-300 flex items-center justify-center">
            {/* Screen Content */}
            <div className="w-full h-full bg-white relative">
              {src ? (
                <img src={src} alt="Tablet Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]">
                  No image uploaded
                </div>
              )}
              {/* Marketing overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white select-none">
                <span className="text-[6px] uppercase text-slate-200 tracking-wider">Promotion</span>
                <h4 className="text-[9px] font-bold mt-0.5">{contentName}</h4>
              </div>
            </div>
            {/* Tablet Camera dot */}
            <div className="absolute top-1/2 left-1 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-900 border border-slate-700" />
          </div>
        )}

        {/* Mobile Smartphone Frame */}
        {device === "mobile" && (
          <div className="w-[150px] h-[260px] bg-slate-950 border-[6px] border-slate-900 rounded-[24px] shadow-2xl overflow-hidden relative transition-all duration-300 flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-900 rounded-b-lg z-20 flex items-center justify-center gap-1">
              <span className="w-4 h-0.5 rounded bg-slate-700" />
              <span className="w-1 h-1 rounded-full bg-slate-800" />
            </div>

            {/* Screen Content */}
            <div className="w-full h-full bg-white relative flex-1 flex flex-col justify-start">
              {/* Mock app header */}
              <div className="h-6 pt-3 px-2 flex justify-between items-center border-b border-slate-100 select-none bg-slate-50">
                <span className="text-[6px] font-bold text-slate-800">Lottmart</span>
                <span className="text-[5px] text-slate-400">Search...</span>
              </div>
              <div className="relative flex-1 flex items-center bg-slate-50">
                {src ? (
                  <img src={src} alt="Mobile Preview" className="w-full aspect-[4/3] object-cover border-y border-slate-100" />
                ) : (
                  <div className="w-full aspect-[4/3] bg-slate-200 flex items-center justify-center text-slate-400 text-[8px]">
                    No image
                  </div>
                )}
                {/* Visual Label */}
                <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white p-1 rounded select-none max-w-[100px] flex flex-col">
                  <span className="text-[5px] font-semibold truncate leading-none">{contentName}</span>
                </div>
              </div>
            </div>
            
            {/* Home indicator pill */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-800 rounded-full" />
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-400 text-center select-none font-medium mt-1">
        Banner adjusts dynamically across devices using responsive layouts.
      </div>
    </div>
  );
};

export default BannerPreview;
