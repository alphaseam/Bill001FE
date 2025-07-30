import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { FiAlignJustify } from "react-icons/fi";
import { FaDashcube, FaFileInvoiceDollar } from "react-icons/fa";
import { MdEditNote } from "react-icons/md";
import { FaHotel } from "react-icons/fa6";
import { AuthContext } from "../../context/AuthContext";

const Admin = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isDashboard = location.pathname === "/admin/dashboard";

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
            to="/admin/dashboard"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FaDashcube size={20} />
            <span className={`${showSidebar ? "block" : "hidden"} md:block`}>
              Dashboard
            </span>
          </Link>

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
              Hotel Edit
            </span>
          </Link>

          <Link
            to="/admin/hotels/view"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FaHotel size={20} />
            <span className={`${showSidebar ? "block" : "hidden"} md:block`}>
              View Hotels
            </span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-4 py-3 flex justify-end items-center">
          {isDashboard && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                User Panel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
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
