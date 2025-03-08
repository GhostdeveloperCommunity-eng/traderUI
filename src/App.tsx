import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { CreateMasterProduct } from "./pages/createMaster";
import { CreateCategory } from "./pages/createCategory";
import { MasterProductList } from "./pages/masterProductList";
import { LoginPage } from "./pages/Login";
import { ProtectRoute } from "./components/ProtectRoutes";

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
      </Routes>
    </div>
  </Router>
);

export default App;
