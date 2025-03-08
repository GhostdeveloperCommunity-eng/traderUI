import { Link, Navigate } from "react-router-dom";

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("user");
  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-100 shadow-xs">
        <Link to="/create-category" className="text-rose-600 underline">
          Create Category
        </Link>
        <Link to="/create-master" className="text-rose-600 underline">
          Create Master
        </Link>
        <Link to="/master-product-list" className="text-rose-600 underline">
          Master Product List
        </Link>
      </nav>
      {children}
    </div>
  );
};
