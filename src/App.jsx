import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Product from "./pages/Product";
import Admin from "./pages/admin/Admin";
import BillEditPage from "./pages/admin/BillEditPage";
import PrivateRoute from "./Components/PrivateRoute";
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

<<<<<<< HEAD
        {/* Protected Routes with shared layout */}
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

        <Route path="/admin/*" element={
          <PrivateRoute>
            <Product />
            <Routes>
              <Route path="/billing/edit/:billId" element={<BillEditPage />} />
            </Routes>
          </PrivateRoute>
        } />
=======
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
>>>>>>> 7ab4cc71d5dd9388b3e09ca26832a2d9d7cdfce2

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

<<<<<<< HEAD
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
=======
      {/* ✅ Admin Layout Route */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      >
        {/* ✅ Nested Admin Routes (inside Admin layout) */}
        <Route path="billing/edit/:billId" element={<BillEditPage />} />
      </Route>
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
>>>>>>> 7ab4cc71d5dd9388b3e09ca26832a2d9d7cdfce2
  );
}

export default App;
