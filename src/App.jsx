import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import Admin from "./pages/admin/Admin";
import BillEditPage from "./pages/admin/BillEditPage";
import PrivateRoute from "./context/PrivateRoute"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HotelList from "./Components/HotelList";
import HotelForm from "./Components/HotelForm";
import BillingPage from "./pages/admin/BillingPage";
import BillList from "./Components/BillList";
import HotelViewOnlyPage from "./pages/admin/HotelViewOnlyPage";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import DashboardLayout from "./Components/DashboardLayout";
function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}

        <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:hotelId" element={<Product />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="billinglist" element={<BillList />} />
          <Route path="billing/edit/:billId" element={<BillEditPage />} />
          <Route path="hotels" element={<HotelList />} />
          <Route path="hotels/add" element={<HotelForm />} />
          <Route path="hotels/view" element={<HotelViewOnlyPage />} />
        </Route>


        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>}>
          <Route path="billing" element={<BillingPage />} />
          <Route path="product/:hotelId" element={<Product />} />
          <Route path="product" element={<Product />} />
          <Route path="dashboard" element={<AnalyticsDashboard />} />
          <Route path="billinglist" element={<BillList />} />
          <Route path="billing/edit/:billId" element={<BillEditPage />} />
          <Route path="hotels" element={<HotelList />} />
          <Route path="hotels/add" element={<HotelForm />} />
          <Route path="hotels/view" element={<HotelViewOnlyPage />} />
          <Route path="hotels/edit/:id" element={<HotelForm />} />

        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;
