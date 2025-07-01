import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Product from "./pages/Product";
import BillEditPage from "./pages/admin/BillEditPage";
import PrivateRoute from "./Components/PrivateRoute";
import HotelList from "./components/HotelList";
import HotelForm from "./components/HotelForm";



function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

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
      {/* ****************************** */}
  
      {/* ✅ Hotel Management Routes */}
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
      {/* ************************************* */}


      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
