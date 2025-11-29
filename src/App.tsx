import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CreateMasterProduct } from "./pages/createMaster";
import { CreateCategory } from "./pages/createCategory";
import { MasterProductList } from "./pages/masterProductList";
import { LoginPage } from "./pages/Login";
import { ProtectRoute } from "./components/ProtectRoutes";
import { LotList } from "./pages/LotsList";
import { Approvals } from "./pages/Approvals";
import { Products } from "./pages/Products";
import Users from "./pages/Users";

const App = () => (
  <Router>
    <div className="bg-gray-50 flex flex-col gap-4 min-h-screen">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/create-category"
          element={
            <ProtectRoute>
              <CreateCategory />
            </ProtectRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectRoute>
              <Users />
            </ProtectRoute>
          }
        />
        <Route
          path="/create-master"
          element={
            <ProtectRoute>
              <CreateMasterProduct />
            </ProtectRoute>
          }
        />
        <Route
          path="/master-product-list"
          element={
            <ProtectRoute>
              <MasterProductList />
            </ProtectRoute>
          }
        />
        <Route
          path="/lot-list"
          element={
            <ProtectRoute>
              <LotList />
            </ProtectRoute>
          }
        />
        <Route
          path="/approvals"
          element={
            <ProtectRoute>
              <Approvals />
            </ProtectRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectRoute>
              <Products />
            </ProtectRoute>
          }
        />
      </Routes>
    </div>
  </Router>
);

export default App;
