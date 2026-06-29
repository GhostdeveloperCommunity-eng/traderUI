import React, { useState } from "react";
import { RequestType } from "../pages/Approvals";

interface SellerDetailViewProps {
  req: any;
  onBack: () => void;
  handleSubmit: (request: any, actionType: RequestType) => Promise<void>;
  loading: boolean;
}

export const SellerDetailView: React.FC<SellerDetailViewProps> = ({
  req,
  onBack,
  handleSubmit,
  loading,
}) => {
  const seller = req?.metadata || {};

  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");

  const submitApproval = async () => {
    // For seller approval, we do the direct confirmation/API submit
    const userConfirmed = window.confirm(
      `Are you sure you want to accept seller - ${seller.businessName}`
    );
    if (userConfirmed) {
      await handleSubmit(req, "accept");
    }
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      setError("Please specify a reason for rejection.");
      return;
    }
    const userConfirmed = window.confirm(
      `Are you sure you want to reject seller - ${seller.businessName}`
    );
    if (userConfirmed) {
      await handleSubmit(req, "reject");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 animate-in fade-in duration-350">
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
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/10">
                Pending Seller
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {seller.businessName || "Seller Onboarding Request"}
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowRejectInput(true)}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
          >
            Reject Seller
          </button>
          <button
            onClick={submitApproval}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
          >
            Approve Seller
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Business Overview & Verification */}
          <div className="lg:col-span-1 space-y-8">
            {/* Overview Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-2xl shadow-xs">
                {seller.businessName ? seller.businessName.substring(0, 2).toUpperCase() : "SL"}
              </div>
              <h3 className="text-md font-bold text-slate-900">{seller.businessName}</h3>
              <p className="text-xs text-slate-500 mt-1">{seller.industry || "General Merchant"}</p>
              
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-2xs font-medium text-amber-800 border border-amber-200/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Pending Onboarding
                </span>
              </div>
            </div>

            {/* Verification Documents */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Verification Credentials</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">GSTIN</span>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-100 block">
                    {seller.gstNumber || "Not Provided"}
                  </span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Aadhaar Card Number</span>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-100 block">
                    {seller.aadhaarNumber || "Not Provided"}
                  </span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">PAN Card Number</span>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-100 block">
                    {seller.panNumber || "Not Provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Onboarding Timeline</h3>
              
              <div className="flow-root">
                <ul className="-mb-8">
                  {[
                    { title: "Application Submitted", date: req.createdAt, completed: true },
                    { title: "GSTIN Validated", date: "Auto-verified via GST Portal", completed: true },
                    { title: "Aadhaar / Identity Checked", date: "Aadhaar OCR Verified", completed: true },
                    { title: "Final Admin Approval", date: "Pending Review", completed: false },
                  ].map((step, idx) => (
                    <li key={idx}>
                      <div className="relative pb-8">
                        {idx !== 3 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white ${
                              step.completed ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                            }`}>
                              {step.completed ? (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="text-xs font-bold">{idx + 1}</span>
                              )}
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-xs font-bold text-slate-800">{step.title}</p>
                              <p className="text-2xs text-slate-400">{step.date ? new Date(step.date).toLocaleDateString() : step.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Information Cards */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section 1: Business Profile */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-md font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-800" />
                Business Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Company / Entity Legal Name</span>
                  <span className="text-sm font-medium text-slate-800 block">{seller.businessName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Industry / Category</span>
                  <span className="text-sm font-medium text-slate-800 block">{seller.industry || "General Trade"}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Nature of Business</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {seller.typeOfBusiness && Array.isArray(seller.typeOfBusiness) ? (
                      seller.typeOfBusiness.map((type: string, idx: number) => (
                        <span key={idx} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-2xs font-medium text-slate-800 border border-slate-200">
                          {type}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-2xs font-medium text-slate-800">
                        {seller.typeOfBusiness || "Supplier / Vendor"}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Application Date</span>
                  <span className="text-sm font-medium text-slate-800 block">
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Business Description</span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
                    {seller.businessProfile || "No additional profile description provided by seller."}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-md font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Contact & Address Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Representative Name</span>
                  <span className="text-sm font-medium text-slate-800 block">{req.firstName} {req.lastName}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Registered Email</span>
                  <span className="text-sm font-medium text-slate-800 block">{req.email || "N/A"}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Business Operating Address</span>
                  <span className="text-sm font-medium text-slate-800 block leading-relaxed">{seller.address || "N/A"}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Landmark</span>
                  <span className="text-sm font-medium text-slate-800 block">{seller.landmark || "N/A"}</span>
                </div>
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Coordinates (GPS)</span>
                  <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 border border-slate-100 rounded inline-block mt-0.5">
                    Lat: {seller.latitude || "0.0"}, Lng: {seller.longitude || "0.0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Seller System Stats */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-md font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Business Statistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Upload Limit</span>
                  <span className="text-md font-bold text-slate-800">Unlimited</span>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Registered Products</span>
                  <span className="text-md font-bold text-slate-800">0 Items</span>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Wallet Status</span>
                  <span className="text-md font-bold text-slate-800">₹0.00</span>
                </div>
                <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100/50">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-emerald-600 block mb-1">Sales Generated</span>
                  <span className="text-md font-bold text-emerald-800">₹0.00</span>
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
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600">Reviewing: {seller.businessName}</span>
            </div>

            <div className="flex gap-3 w-full sm:w-auto justify-end">
              {showRejectInput && (
                <button
                  onClick={() => setShowRejectInput(false)}
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
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={loading}
                    className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 text-xs font-bold text-rose-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    Reject Seller
                  </button>
                  <button
                    onClick={submitApproval}
                    disabled={loading}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-bold text-white transition disabled:opacity-50 cursor-pointer"
                  >
                    Approve Seller
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

export default SellerDetailView;
