import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Login from "./pages/Login";
import PrivateRoute from "./Components/PrivateRoute";
import Product from "./pages/Product";
import BillEditPage from "./pages/admin/BillEditPage";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
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
        path="/product"
        element={
          <PrivateRoute>
            <Product />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/billing/edit/:billId"
        element={
          <PrivateRoute>
            <BillEditPage />
          </PrivateRoute>
        }
      />

      {/* Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
