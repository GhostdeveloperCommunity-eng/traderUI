import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaUserCircle,
  FaList,
  FaClipboardCheck,
  FaTags,
  FaCube,
  FaUsers,
  FaImage,
  FaThLarge,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { FaShop } from "react-icons/fa6";

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("user");
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  if (!token) {
    return <Navigate to="/" />;
  }

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaThLarge /> },
    { path: "/users", label: "Users", icon: <FaUsers /> },

    { path: "/category-list", label: "Category List", icon: <FaTags /> },
    // { path: "/create-master", label: "Create Master", icon: <FaThLarge /> },
    {
      path: "/master-product-list",
      label: "Master Product List",
      icon: <FaList />,
    },
    {
      path: "/approvals",
      label: "Approvals",
      icon: <FaClipboardCheck />,
    },
    { path: "/products", label: "Products", icon: <FaCube /> },

    { path: "/orders", label: "Orders", icon: <FaShop /> },
    { path: "/banners", label: "Banners", icon: <FaImage /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out bg-[#0f172a] flex flex-col text-white shadow-2xl z-30 relative`}
      >
        {/* Sidebar Top with Toggle */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-2xl p-2 shadow-lg">
                <img
                  src="/lottmart-logo.png"
                  alt="Lottmart"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Lottmart
              </span>
            </div>
          ) : (
             <div className="mx-auto bg-white rounded-xl p-1.5 shadow-lg">
                <img
                  src="/lottmart-logo.png"
                  alt="Lottmart"
                  className="h-10 w-10 object-contain"
                />
             </div>
          )}
          {isOpen && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 cursor-pointer rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              <FiMenu size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 p-3 mt-4 overflow-y-auto overflow-x-hidden custom-scrollbar flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-100"
              }`}
            >
              <span className={`text-xl transition-all duration-300 ${
                location.pathname === item.path ? "scale-110" : "group-hover:scale-110"
              }`}>
                {item.icon}
              </span>
              {isOpen && (
                <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                  {item.label}
                </span>
              )}
              {!isOpen && (
                 <div className="absolute left-16 bg-slate-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-slate-700">
                    {item.label}
                 </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a]/50 backdrop-blur-sm">
          {!isOpen && (
             <button
                onClick={() => setIsOpen(true)}
                className="mx-auto block p-2 text-slate-400 hover:text-white transition-colors"
             >
                <FiMenu size={20} />
             </button>
          )}
          {isOpen && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
            >
              <FaUserCircle size={22} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-8 py-4 border-b border-slate-200 shadow-sm z-20">
          <div className="flex items-center gap-5">
            <img
              src="/lottmart-logo.png"
              alt="Lottmart"
              className="h-20 w-auto object-contain"
            />
            <h1
              onClick={() => navigate("/dashboard")}
              className="text-2xl font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-all flex items-center gap-2"
            >
              {navItems.find((item) => location.pathname === item.path)?.label || "Overview"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="relative">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-700 leading-none">Administrator</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Super Admin</p>
                </div>
                <div className="relative">
                  <FaUserCircle
                    size={36}
                    className="text-slate-300 group-hover:text-blue-600 transition-all shadow-inner rounded-full"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {openMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 mb-2">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Account</p>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    onClick={() => setOpenMenu(false)}
                  >
                    My Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    onClick={() => setOpenMenu(false)}
                  >
                    Settings
                  </button>
                  <div className="h-px bg-slate-50 my-1"></div>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
