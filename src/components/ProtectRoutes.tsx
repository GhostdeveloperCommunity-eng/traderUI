import { Link, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaUserCircle,
  FaList,
  FaClipboardCheck,
  FaTags,
  FaThLarge,
  FaCube,
  FaUsers,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("user");
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  if (!token) {
    return <Navigate to="/" />;
  }

  const navItems = [
    { path: "/users", label: "Users", icon: <FaUsers /> },

    { path: "/create-category", label: "Create Category", icon: <FaTags /> },
    { path: "/create-master", label: "Create Master", icon: <FaThLarge /> },
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
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-16"
        } transition-all bg-violet-500 duration-300 flex flex-col text-white`}
      >
        {/* Sidebar Top with Toggle */}
        <div className="flex items-center justify-between p-4">
          {isOpen && <span className="font-bold">Menu</span>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 cursor-pointer rounded hover:bg-voilet-800"
          >
            <FiMenu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                location.pathname === item.path
                  ? "bg-violet-700"
                  : "hover:bg-violet-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-4 py-3">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
          <FaUserCircle size={28} className="text-gray-600 cursor-pointer" />
        </header>

        {/* Content */}
        <main className="flex-1 p-2 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
