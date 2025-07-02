import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { FiAlignJustify } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white p-4 transition-all duration-300 ${
          showSidebar ? "w-64" : "w-14"
        }`}
      >
        {/* Toggle Button (Mobile) */}
        <button
          className="block md:hidden mb-4"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <ImCross size={20} /> : <FiAlignJustify size={20} />}
        </button>

        {/* Title */}
        <h2
          className={`text-xl font-bold mb-6 ${
            showSidebar ? "block" : "hidden"
          }`}
        >
          Admin Panel
        </h2>

        {/* Navigation */}
        <nav className="space-y-3">
          <NavLink
            to="/admin/billing"
            className="block py-2 hover:bg-gray-700 px-2 rounded"
          >
            {showSidebar ? "Billing" : "B"}
          </NavLink>
          <NavLink
            to="/admin/billing/edit/1"
            className="block py-2 hover:bg-gray-700 px-2 rounded"
          >
            {showSidebar ? "Edit Bill" : "E"}
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-lg font-semibold text-center md:text-left">
            Admin Dashboard
          </h1>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 w-full sm:w-auto"
            >
              User Panel
            </button>

            <button
              onClick={() => alert("Logout logic here")}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white shadow p-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Hotel Admin Panel. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
};

export default Admin;
