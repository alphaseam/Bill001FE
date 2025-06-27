import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Product from "./pages/Product";
import Admin from "./pages/admin/Admin";
import BillEditPage from "./pages/admin/BillEditPage";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes with shared layout */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <PrivateRoute>
            <Billing />
          </PrivateRoute>
        }
      />

      <Route
        path="/Product/*"
        element={
          <PrivateRoute>
            <Product />
            <Routes>
              <Route path="edit/:id" element={<Product />} />
              <Route path="delete/:id" element={<Product />} />
            </Routes>
          </PrivateRoute>
        }
      />

      {/* ✅ Admin Panel Main */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />

      {/* ✅ Edit Bill Page (separate route, not nested) */}
      <Route
        path="/admin/billing/edit/:billId"
        element={
          <PrivateRoute>
            <BillEditPage />
          </PrivateRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
