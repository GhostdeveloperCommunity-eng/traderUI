import { useEffect, useState, useMemo, useCallback } from "react";
import { getCompleteUrlV1 } from "../utils";
import { httpClient } from "../services/ApiService";
import { Button } from "../components/Button";
import { BannerStatsCard } from "../components/BannerStatsCard";
import { BannerFilters } from "../components/BannerFilters";
import { BannerCard } from "../components/BannerCard";
import { BannerTable } from "../components/BannerTable";
import { BannerDrawer } from "../components/BannerDrawer";
import { BannerCreateModal } from "../components/BannerCreateModal";
import { IBannerList, IBannerItem, IBannerMetadata } from "../types";
import { 
  FaPlus, 
  FaUpload, 
  FaFileExport, 
  FaSyncAlt, 
  FaImage,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaDatabase
} from "react-icons/fa";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  masterDetails?: {
    name: string;
  };
}

interface FilterParams {
  search: string;
  status: string;
  contentType: string;
  position: string;
  platform: string;
  startDate: string;
  endDate: string;
  sortBy: string;
}

export const Banner = () => {
  const [banners, setBanners] = useState<IBannerItem[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshList, setRefreshList] = useState<boolean>(false);

  // Layout View Switch & Filter parameters
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    status: "",
    contentType: "",
    position: "",
    platform: "",
    startDate: "",
    endDate: "",
    sortBy: "newest",
  });

  // Modal / Drawer Selection triggers
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [selectedEditBanner, setSelectedEditBanner] = useState<IBannerItem | null>(null);
  const [selectedDrawerBanner, setSelectedDrawerBanner] = useState<IBannerItem | null>(null);

  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Category and Product list to resolve entity name references
  useEffect(() => {
    (async function fetchCRMEntities() {
      try {
        const catRes = await httpClient.get(getCompleteUrlV1("category/names"));
        const catData = await catRes.json();
        setCategoryList(catData.data || []);

        const prodRes = await httpClient.get(getCompleteUrlV1("product"));
        const prodData = await prodRes.json();
        setProductList(prodData.data || []);
      } catch (error) {
        console.error("Error fetching CRM products/categories:", error);
      }
    })();
  }, []);

  const getContentName = useCallback((type: string, id: string) => {
    if (type === "category") {
      return categoryList.find((cat) => cat._id === id)?.name || "Unknown Category";
    }
    if (type === "product") {
      const catMatch = categoryList.find((cat) => cat._id === id);
      if (catMatch) {
        return `${catMatch.name} (Product Category Link)`;
      }
      return productList.find((prod) => prod._id === id)?.masterDetails?.name || "Unknown Product";
    }
    return "N/A";
  }, [categoryList, productList]);

  // Fetch Banners and merge with localStorage metadata
  useEffect(() => {
    (async function getBanners() {
      try {
        setIsLoading(true);
        const response = await httpClient.get(getCompleteUrlV1("banner"));
        const result = await response.json();
        const apiBanners = (result.data || []) as IBannerList[];

        // Merge with local storage attributes
        const merged: IBannerItem[] = apiBanners.map((banner) => {
          const storedMetaStr = localStorage.getItem(`lottmart_banner_metadata_${banner._id}`);
          let meta: IBannerMetadata;

          if (storedMetaStr) {
            meta = JSON.parse(storedMetaStr);
          } else {
            // Generate deterministic mockup values for CRM records lacking localized metadata
            const randSeed = banner._id.charCodeAt(banner._id.length - 1) || 10;
            const viewsCount = Math.floor((randSeed * 38) + 120);
            const clicksCount = Math.floor((randSeed * 2.8) + 8);
            const ctrValue = viewsCount > 0 ? ((clicksCount / viewsCount) * 100).toFixed(1) : 0;

            const isProd = banner.contentType === "product";
            const mockTitle = isProd 
              ? `Exclusive Product Spotlight - ${getContentName(banner.contentType, banner.contentId)}`
              : `Seasonal Collection Highlight - ${getContentName(banner.contentType, banner.contentId)}`;

            meta = {
              title: mockTitle,
              position: randSeed % 3 === 0 ? "Middle" : randSeed % 5 === 0 ? "Bottom" : "Top Slider",
              platform: randSeed % 2 === 0 ? "Web & Mobile" : "Desktop Web",
              status: randSeed % 4 === 0 ? "draft" : randSeed % 7 === 0 ? "scheduled" : "published",
              startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              createdBy: "Super Admin",
              updatedBy: "Super Admin",
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              views: viewsCount,
              clicks: clicksCount,
              ctr: ctrValue,
              priority: randSeed % 3 === 0 ? "High" : "Medium",
              description: `Marketing banner campaign targeting increase in ${banner.contentType} conversions.`,
            };

            // Save back to keep persistence intact
            localStorage.setItem(`lottmart_banner_metadata_${banner._id}`, JSON.stringify(meta));
          }

          return {
            _id: banner._id,
            media: banner.media,
            contentType: banner.contentType,
            contentId: banner.contentId,
            contentName: getContentName(banner.contentType, banner.contentId),
            metadata: meta,
          };
        });

        setBanners(merged);
      } catch (error) {
        console.error("Error fetching/syncing banners list:", error);
        showToast("Failed to retrieve banners from API", "error");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshList, getContentName]);

  // Statistics Computations
  const stats = useMemo(() => {
    const total = banners.length;
    const published = banners.filter((b) => b.metadata.status.toLowerCase() === "published").length;
    const scheduled = banners.filter((b) => b.metadata.status.toLowerCase() === "scheduled").length;
    const draft = banners.filter((b) => b.metadata.status.toLowerCase() === "draft").length;
    const inactive = banners.filter((b) => b.metadata.status.toLowerCase() === "inactive" || b.metadata.status.toLowerCase() === "expired" || b.metadata.status.toLowerCase() === "archived").length;
    
    const homepage = banners.filter((b) => b.metadata.position === "Top Slider").length;
    const categoryBanners = banners.filter((b) => b.contentType === "category").length;
    
    // Performance CTR aggregation
    let totalViews = 0;
    let totalClicks = 0;
    banners.forEach((b) => {
      totalViews += b.metadata.views;
      totalClicks += b.metadata.clicks;
    });
    const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

    return {
      total,
      published,
      scheduled,
      draft,
      inactive,
      homepage,
      categoryBanners,
      avgCtr,
    };
  }, [banners]);

  // Filters and Sorting Logic
  const filteredBanners = useMemo(() => {
    let result = [...banners];

    // 1. Global Keyword Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.metadata.title.toLowerCase().includes(q) ||
          b.contentName.toLowerCase().includes(q) ||
          b.contentType.toLowerCase().includes(q) ||
          b._id.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (filters.status) {
      result = result.filter((b) => b.metadata.status.toLowerCase() === filters.status.toLowerCase());
    }

    // 3. Content Type Filter
    if (filters.contentType) {
      result = result.filter((b) => b.contentType.toLowerCase() === filters.contentType.toLowerCase());
    }

    // 4. Position Filter
    if (filters.position) {
      result = result.filter((b) => b.metadata.position.toLowerCase() === filters.position.toLowerCase());
    }

    // 5. Platform Filter
    if (filters.platform) {
      result = result.filter((b) => b.metadata.platform.toLowerCase() === filters.platform.toLowerCase());
    }

    // 6. Start/End Date Range Filters
    if (filters.startDate) {
      result = result.filter((b) => b.metadata.startDate >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter((b) => b.metadata.endDate <= filters.endDate);
    }

    // 7. Sort Parameters
    result.sort((a, b) => {
      if (filters.sortBy === "newest") {
        return new Date(b.metadata.createdAt || "").getTime() - new Date(a.metadata.createdAt || "").getTime();
      }
      if (filters.sortBy === "oldest") {
        return new Date(a.metadata.createdAt || "").getTime() - new Date(b.metadata.createdAt || "").getTime();
      }
      if (filters.sortBy === "recently-updated") {
        return new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime();
      }
      if (filters.sortBy === "most-viewed") {
        return b.metadata.views - a.metadata.views;
      }
      if (filters.sortBy === "most-clicked") {
        return b.metadata.clicks - a.metadata.clicks;
      }
      if (filters.sortBy === "highest-ctr") {
        return parseFloat(String(b.metadata.ctr)) - parseFloat(String(a.metadata.ctr));
      }
      return 0;
    });

    return result;
  }, [banners, filters]);

  // Operations/Action Handlers

  const handleEdit = (item: IBannerItem) => {
    setSelectedEditBanner(item);
    setSelectedDrawerBanner(null); // Close drawer if open
    setOpenCreateModal(true);
  };

  const handleDuplicate = async (item: IBannerItem) => {
    try {
      setIsLoading(true);
      const payload = {
        contentId: item.contentId,
        contentType: item.contentType,
        media: item.media,
      };

      const response = await httpClient.post(getCompleteUrlV1("banner"), payload);
      
      if (response.ok) {
        const result = await response.json();
        const newId = result.data?._id || result.data?.id;

        if (newId) {
          // Copy metadata to new duplicated banner ID
          const dupMeta = {
            ...item.metadata,
            title: `${item.metadata.title} (Duplicate)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            clicks: 0,
            ctr: 0,
          };
          localStorage.setItem(`lottmart_banner_metadata_${newId}`, JSON.stringify(dupMeta));
          showToast("Banner duplicated successfully!");
          setRefreshList((prev) => !prev);
        }
      } else {
        throw new Error("Duplicate API post request failed.");
      }
    } catch (error) {
      console.error("Duplicate failed:", error);
      showToast("Failed to duplicate banner", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = (item: IBannerItem) => {
    const isPub = item.metadata.status.toLowerCase() === "published";
    const nextStatus = isPub ? "inactive" : "published";
    
    // Update locally stored status
    const updatedMeta = {
      ...item.metadata,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(`lottmart_banner_metadata_${item._id}`, JSON.stringify(updatedMeta));
    
    // Update local state directly for fast response
    setBanners((prev) =>
      prev.map((b) => (b._id === item._id ? { ...b, metadata: updatedMeta } : b))
    );
    
    if (selectedDrawerBanner?._id === item._id) {
      setSelectedDrawerBanner((prev) => prev ? { ...prev, metadata: updatedMeta } : null);
    }

    showToast(`Banner status updated to ${nextStatus}!`);
  };

  const handleDelete = async (item: IBannerItem) => {
    const confirmed = window.confirm(`Are you sure you want to delete the banner "${item.metadata.title}"?`);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await httpClient.delete(getCompleteUrlV1(`banner/${item._id}`));
      
      // Clean local storage record
      localStorage.removeItem(`lottmart_banner_metadata_${item._id}`);
      showToast("Banner deleted successfully.");
      
      setSelectedDrawerBanner(null);
      setRefreshList((prev) => !prev);
    } catch (error) {
      console.error("Delete banner failed:", error);
      showToast("Failed to delete banner from database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = () => {
    showToast("Bulk upload folder ingestion is a future feature.", "info");
  };

  const handleExport = () => {
    // Trigger download of Banners Metadata JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(banners, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `lottmart-banners-export-${Date.now()}.json`);
    dlAnchorElem.click();
    showToast("Banner database schema exported!");
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className={`px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold ${
            toast.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : toast.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Banner Management</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Configure placement, scheduling and analyze performance for promotional assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => {
              setSelectedEditBanner(null);
              setOpenCreateModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <FaPlus size={10} />
            <span>Create Banner</span>
          </Button>

          <Button
            onClick={handleBulkUpload}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold transition-all cursor-pointer"
          >
            <FaUpload size={10} />
            <span>Bulk Upload</span>
          </Button>

          <Button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold transition-all cursor-pointer"
          >
            <FaFileExport size={10} />
            <span>Export</span>
          </Button>

          <button
            onClick={() => setRefreshList((prev) => !prev)}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="Refresh List"
          >
            <FaSyncAlt size={11} className={isLoading ? "animate-spin text-blue-500" : ""} />
          </button>
        </div>
      </div>

      {/* Top Analytics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <BannerStatsCard
          title="Total Banners"
          count={stats.total}
          icon={<FaImage size={16} />}
          onClick={() => setFilters({ ...filters, status: "" })}
          active={filters.status === ""}
        />
        <BannerStatsCard
          title="Published"
          count={stats.published}
          icon={<FaCheckCircle className="text-emerald-500" size={16} />}
          trend={{ value: "Live", label: "Active promos", isPositive: true }}
          onClick={() => setFilters({ ...filters, status: "published" })}
          active={filters.status === "published"}
        />
        <BannerStatsCard
          title="Scheduled"
          count={stats.scheduled}
          icon={<FaClock className="text-blue-500" size={16} />}
          trend={{ value: "Pending", label: "Upcoming promos", isPositive: true }}
          onClick={() => setFilters({ ...filters, status: "scheduled" })}
          active={filters.status === "scheduled"}
        />
        <BannerStatsCard
          title="Drafts"
          count={stats.draft}
          icon={<FaDatabase className="text-slate-400" size={16} />}
          onClick={() => setFilters({ ...filters, status: "draft" })}
          active={filters.status === "draft"}
        />
        <BannerStatsCard
          title="Inactive / Expired"
          count={stats.inactive}
          icon={<FaTimesCircle className="text-red-400" size={16} />}
          onClick={() => setFilters({ ...filters, status: "inactive" })}
          active={filters.status === "inactive"}
        />
        <BannerStatsCard
          title="Average CTR"
          count={`${stats.avgCtr}%`}
          icon={<span className="text-xs font-bold text-blue-600">%</span>}
          trend={{ value: "Avg", label: "User engagement", isPositive: true }}
        />
      </div>

      {/* Search & Filters */}
      <BannerFilters
        filters={filters}
        onChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Display: Grid vs List */}
      <div className="relative">
        {isLoading ? (
          // Skeleton Cards Loading Placeholder
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden h-[360px] flex flex-col justify-between p-5">
                <div className="w-full h-40 bg-slate-100 rounded-xl" />
                <div className="space-y-3 flex-1 pt-4">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
                <div className="h-10 bg-slate-50 border-t border-slate-100 rounded-lg mt-4" />
              </div>
            ))}
          </div>
        ) : filteredBanners.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBanners.map((item) => (
                <BannerCard
                  key={item._id}
                  media={item.media}
                  contentType={item.contentType}
                  contentName={item.contentName}
                  metadata={item.metadata}
                  onPreview={() => setSelectedDrawerBanner(item)}
                  onEdit={() => handleEdit(item)}
                  onDuplicate={() => handleDuplicate(item)}
                  onStatusToggle={() => handleStatusToggle(item)}
                  onDelete={() => handleDelete(item)}
                />
              ))}
            </div>
          ) : (
            <BannerTable
              banners={filteredBanners}
              onPreview={(item) => setSelectedDrawerBanner(item)}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
            />
          )
        ) : (
          // Empty State
          <div className="bg-white border border-slate-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="p-5 bg-blue-50/50 rounded-full border border-blue-100 text-blue-500 mb-6 animate-bounce">
              <FaImage size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No promo banners found</h3>
            <p className="text-xs text-slate-400 font-medium mt-2 max-w-sm">
              Create a new banner to publish seasonal promotions, target categories or feature special flash sale lists.
            </p>
            <Button
              onClick={() => {
                setSelectedEditBanner(null);
                setOpenCreateModal(true);
              }}
              className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 px-6 text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer animate-in fade-in"
            >
              <FaPlus size={10} />
              <span>Create Your First Banner</span>
            </Button>
          </div>
        )}
      </div>

      {/* Side Slide-Over Drawer Detail Panel */}
      <BannerDrawer
        isOpen={!!selectedDrawerBanner}
        onClose={() => setSelectedDrawerBanner(null)}
        banner={selectedDrawerBanner}
        onEdit={() => selectedDrawerBanner && handleEdit(selectedDrawerBanner)}
        onDuplicate={() => selectedDrawerBanner && handleDuplicate(selectedDrawerBanner)}
        onStatusToggle={() => selectedDrawerBanner && handleStatusToggle(selectedDrawerBanner)}
        onDelete={() => selectedDrawerBanner && handleDelete(selectedDrawerBanner)}
      />

      {/* Create / Edit Form Dialog Modal */}
      {openCreateModal && (
        <BannerCreateModal
          isOpen={openCreateModal}
          onClose={() => {
            setOpenCreateModal(false);
            setSelectedEditBanner(null);
          }}
          setRefreshList={setRefreshList}
          bannerToEdit={selectedEditBanner}
        />
      )}

    </div>
  );
};

export default Banner;
