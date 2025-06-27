<<<<<<< HEAD
import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Billing from "./pages/Billing"
import Login from "./pages/Login"
import PrivateRoute from "./Components/PrivateRoute"
import Product from "./pages/Product"


function App() {


  return (

    <Routes>
      <Route path="/login" element={<Login />} />


      {/* Protected Routes to protect access */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/billing" element={
        <PrivateRoute>
          <Billing />
        </PrivateRoute>
      } />

      <Route path="/Product/*" element={
        <PrivateRoute>
          <Product />
          <Routes>
            <Route path="edit/:id" element={<Product />} />
            <Route path="delete/:id" element={<Product />} />
          </Routes>
        </PrivateRoute>
      } />


      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>

  )
}

export default App
=======
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
>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443
