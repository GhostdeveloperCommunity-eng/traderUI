import React, { useState } from "react";
import { RequestType } from "../pages/Approvals";

interface ProductDetailViewProps {
  req: any;
  onBack: () => void;
  handleSubmit: (request: any, actionType: RequestType, fees?: any) => Promise<void>;
  loading: boolean;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  req,
  onBack,
  handleSubmit,
  loading,
}) => {
  const product = req?.metadata || {};
  const master = product.masterDetails || {};
  
  // Media handling
  const mediaList = master.media || ["/placeholder-product.png"];
  const [selectedImage, setSelectedImage] = useState(mediaList[0]);
  const [zoomActive, setZoomActive] = useState(false);

  // Rejection/Approval states
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showApproveFees, setShowApproveFees] = useState(false);
  const [fees, setFees] = useState({
    messengerFee: "",
    connectorFee: "",
    platformFee: "3", // default 3%
  });
  const [error, setError] = useState("");

  const handleApproveClick = () => {
    setShowRejectInput(false);
    setShowApproveFees(true);
  };

  const handleRejectClick = () => {
    setShowApproveFees(false);
    setShowRejectInput(true);
  };

  const submitApproval = async () => {
    setError("");
    const m = parseInt(fees.messengerFee);
    const c = parseInt(fees.connectorFee);
    const p = parseInt(fees.platformFee);

    if (isNaN(m) || isNaN(c) || isNaN(p)) {
      setError("All commission fields must be valid numbers");
      return;
    }

    const payloadFees = {
      promoterCommission: m,
      connectorCommission: c,
      platformFee: p,
    };

    // Call handleSubmit with custom fees injection
    // To match handleSubmit in Approvals.tsx, we pass the custom fees state so Approvals.tsx can use it
    // Wait! handleSubmit in Approvals.tsx uses a state `fees` defined in Approvals.tsx.
    // If we pass the fees as third argument, how does it process?
    // Let's look at Approvals.tsx handleSubmit:
    //   const handleSubmit = async (request: any, requestType: RequestType) => { ... }
    // It reads from the `fees` state *within* Approvals.tsx.
    // So we need to make sure that our page controller's handleSubmit can accept fees or that we update Approvals.tsx accordingly.
    // That's perfect, we will update Approvals.tsx to take fees as an argument or update its internal fees state!
    // Yes! Let's pass the fees in the callback.
    await handleSubmit(req, "accept", payloadFees);
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    // For rejection, we call handleSubmit with "reject"
    await handleSubmit(req, "reject");
  };

  const discountPercent = product.mrp && product.sellingPrice 
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      {/* Top sticky header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Approvals Queue
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/10">
                Pending Product
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {master.name || "Product Request Details"}
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRejectClick}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
          >
            Reject Request
          </button>
          <button
            onClick={handleApproveClick}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
          >
            Approve...
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Visual Assets & Documents */}
          <div className="lg:col-span-1 space-y-8">
            {/* Image Gallery Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Product Images</h3>
              
              <div 
                className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 border border-slate-100 cursor-zoom-in"
                onClick={() => setZoomActive(!zoomActive)}
              >
                <img
                  src={selectedImage}
                  alt={master.name || "Product Image"}
                  className={`h-full w-full object-contain transition-transform duration-300 ${
                    zoomActive ? "scale-150" : "scale-100"
                  }`}
                />
                <div className="absolute right-3 bottom-3 rounded-lg bg-black/60 px-2 py-1 text-2xs text-white backdrop-blur-xs">
                  {zoomActive ? "Click to Zoom Out" : "Click to Zoom In"}
                </div>
              </div>

              {mediaList.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {mediaList.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`h-16 w-16 overflow-hidden rounded-lg border-2 bg-slate-50 transition ${
                        selectedImage === imgUrl ? "border-slate-900" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} className="h-full w-full object-contain" alt="thumbnail" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Verification Documents Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Verification Documents</h3>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                  Ready to Verify
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: "GST Certificate", format: "PDF", size: "2.4 MB" },
                  { name: "PAN Card Copy", format: "PNG", size: "1.1 MB" },
                  { name: "Trade License", format: "PDF", size: "3.7 MB" },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 font-bold text-xs">
                        {doc.format}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{doc.name}</p>
                        <p className="text-2xs text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition cursor-pointer">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Information Grids */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section 1: Product Information */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-md font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-800" />
                Product Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Product Name</span>
                  <span className="text-sm font-medium text-slate-800 block">{master.name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Master Product SKU</span>
                  <span className="text-sm font-mono text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">{req._id}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Category</span>
                  <span className="text-sm font-medium text-slate-800 block">{master.categoryId?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Brand / Manufacturer</span>
                  <span className="text-sm font-medium text-slate-800 block">{product.brandName || "Lottmart Direct"}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Product Description</span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">{product.description || "No description provided."}</p>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing details */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-md font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Pricing Details
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">MRP</span>
                  <span className="text-xl font-bold text-slate-800">₹{product.mrp || 0}</span>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Selling Price</span>
                  <span className="text-xl font-bold text-slate-800">₹{product.sellingPrice || 0}</span>
                </div>
                <div className="bg-indigo-50/30 rounded-xl p-4 border border-indigo-100/50">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-indigo-500 block mb-1">Discount</span>
                  <span className="text-xl font-bold text-indigo-700">{discountPercent}% Off</span>
                </div>
                <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100/50">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-emerald-500 block mb-1">Lot Price</span>
                  <span className="text-xl font-bold text-emerald-700">₹{(product.sellingPrice || 0) * (product.lotSize || 1)}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Inventory details */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-md font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Inventory & Logistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Lot Size</span>
                  <span className="text-sm font-semibold text-slate-800">{product.lotSize || 1} units / lot</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Min Order Qty (MOQ)</span>
                  <span className="text-sm font-semibold text-slate-800">{product.moq || 1} lots</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Current Stock</span>
                  <span className="text-sm font-semibold text-slate-800">{product.stock || 0} lots available</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Mfg Date</span>
                  <span className="text-sm font-medium text-slate-700">{product.mfgDate ? new Date(product.mfgDate).toLocaleDateString() : "N/A"}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Expiry Date</span>
                  <span className="text-sm font-medium text-slate-700">{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Section 4: Seller Info */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-md font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                Seller Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Business Name</span>
                  <span className="text-sm font-bold text-slate-800">{req.firstName} {req.lastName}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Email ID</span>
                  <span className="text-sm font-medium text-slate-800">{req.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">GST Registration</span>
                  <span className="text-sm font-mono text-slate-800">{product.gstNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Verification Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-2xs font-medium text-blue-700 border border-blue-100 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Pending Verification
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-6 py-4 shadow-xl backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div className="mb-3 rounded-lg bg-rose-50 border border-rose-100 px-4 py-2.5 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* Expanded input states for approval commission/rejection reason */}
          {showApproveFees && (
            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Set Commission Commissions & Platform Fees</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-2xs font-semibold text-slate-500 uppercase block mb-1">Messenger Commission (%)</label>
                  <input
                    type="number"
                    placeholder="Messenger Commission"
                    value={fees.messengerFee}
                    onChange={(e) => setFees({ ...fees, messengerFee: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="text-2xs font-semibold text-slate-500 uppercase block mb-1">Connector Commission (%)</label>
                  <input
                    type="number"
                    placeholder="Connector Commission"
                    value={fees.connectorFee}
                    onChange={(e) => setFees({ ...fees, connectorFee: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="text-2xs font-semibold text-slate-500 uppercase block mb-1">Platform Margin (%)</label>
                  <input
                    type="number"
                    placeholder="Platform Margin"
                    value={fees.platformFee}
                    onChange={(e) => setFees({ ...fees, platformFee: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {showRejectInput && (
            <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50/20 p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">Specify Rejection Reason</h4>
              <textarea
                placeholder="Enter rejection notes (this will be sent to the seller)..."
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600">Reviewing: {master.name}</span>
            </div>

            <div className="flex gap-3 w-full sm:w-auto justify-end">
              {(showApproveFees || showRejectInput) && (
                <button
                  onClick={() => {
                    setShowApproveFees(false);
                    setShowRejectInput(false);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white transition hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {showRejectInput ? (
                <button
                  onClick={submitRejection}
                  disabled={loading}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-xs font-bold text-white transition disabled:opacity-50 cursor-pointer"
                >
                  Confirm Rejection
                </button>
              ) : showApproveFees ? (
                <button
                  onClick={submitApproval}
                  disabled={loading}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition disabled:opacity-50 cursor-pointer"
                >
                  Complete Approval
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRejectClick}
                    disabled={loading}
                    className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 text-xs font-bold text-rose-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApproveClick}
                    disabled={loading}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-bold text-white transition disabled:opacity-50 cursor-pointer"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
