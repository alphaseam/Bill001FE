import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import Admin from "./pages/admin/Admin";
import BillEditPage from "./pages/admin/BillEditPage";
import PrivateRoute from "./Components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HotelList from "./Components/HotelList";
import HotelForm from "./Components/HotelForm";
import BillingPage from "./pages/admin/BillingPage";
import BillList from "./Components/BillList";
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
          path="/product/*"
          element={
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route
            path="billing"
            element={
              <PrivateRoute>
                <BillingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="billinglist"
            element={
              <PrivateRoute>
                <BillList />
              </PrivateRoute>
            }
          />
          <Route
            path="billing/edit/:billId"
            element={<BillEditPage />}
          />
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
        <Route
          path="/billling"
          element={
            <PrivateRoute>
              <BillingPage />
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
