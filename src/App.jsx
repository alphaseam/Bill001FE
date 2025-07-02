import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BillingPage from "./Components/BillingPage"; // ✅ Ensure this path is correct
import Product from "./pages/Product";
import Admin from "./pages/admin/Admin";
import BillEditPage from "./pages/admin/BillEditPage";
import PrivateRoute from "./Components/PrivateRoute";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import HotelList from "./Components/HotelList";
import HotelForm from "./Components/HotelForm";

function App() {
  return (
    <>
      <ToastContainer />
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
              <BillingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/product/*"
          element={
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route path="billing/edit/:billId" element={<BillEditPage />} />
        </Route>

        <Route
          path="/hotels"
          element={
            <PrivateRoute>
              <HotelList />
            </PrivateRoute>
          }
        />

        <Route
          path="/hotels/add"
          element={
            <PrivateRoute>
              <HotelForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/hotels/edit/:id"
          element={
            <PrivateRoute>
              <HotelForm />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;
