import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Product from "./pages/Product";
import Admin from "./pages/Admin";
import BillEditPage from "./pages/admin/BillEditPage";

import PrivateRoute from "./Components/PrivateRoute";
import DashboardLayout from "./Components/DashboardLayout";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes with shared layout */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/product" element={<Product />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/billing/edit/:billId" element={<BillEditPage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
