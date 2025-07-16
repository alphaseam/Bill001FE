import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { FiAlignJustify } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdEditNote } from "react-icons/md";
import { FaHotel } from "react-icons/fa6";
import { AuthContext } from "../../context/AuthContext";

const Admin = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 p-3 md:w-56 w-14 ${
          showSidebar ? "w-56" : "w-14"
        }`}
      >
        {/* Toggle Button */}
        <button
          className="md:hidden mb-6"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <ImCross size={24} /> : <FiAlignJustify size={24} />}
        </button>

        {/* Title */}
        <h2
          className={`text-xl font-bold mb-6 ${
            showSidebar ? "block" : "hidden"
          } hidden md:block`}
        >
          Admin Panel
        </h2>

        {/* Navigation */}
        <nav className="space-y-5 mt-10">
          <Link
            to="/admin/billing"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FaFileInvoiceDollar size={20} />
            <span className={`${showSidebar ? "block" : "hidden"} md:block`}>
              Billing
            </span>
          </Link>

          <Link
            to="/admin/billinglist"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <MdEditNote size={20} />
            <span className={`${showSidebar ? "block" : "hidden"} md:block`}>
              Bill List
            </span>
          </Link>

          <Link
            to="/admin/hotels"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FaHotel size={20} />
            <span className={`${showSidebar ? "block" : "hidden"} md:block`}>
              Hotel List
            </span>
          </Link>

          <Link
            to="/admin/hotels/add"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FaHotel size={20} />
            <span className={`${showSidebar ? "block" : "hidden"} md:block`}>
              Add Hotel
            </span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <h1 className="text-lg font-semibold text-center md:text-left">
            Admin Dashboard
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-center md:justify-end">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
            >
              User Panel
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white text-center text-sm text-gray-500 p-4 shadow">
          &copy; {new Date().getFullYear()} Hotel Admin Panel. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
};

export default Admin;
