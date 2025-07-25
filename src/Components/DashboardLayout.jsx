import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ImCross } from "react-icons/im";
import { FiAlignJustify, FiBook } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaBox, FaHotel } from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`md:w-50 w-10 md:block bg-gray-800 min-h-screen text-white p-2  ${show ? "w-50" : "w-10"}`}
      >
        <h2
          className={`text-2xl hidden md:block font-bold mb-6 ${show ? "block" : "hidden"}`}
        >
          My App
        </h2>
        <button className="md:hidden mt-3" onClick={() => setShow(!show)}>
          {show ? <ImCross size={24} /> : <FiAlignJustify size={24} />}
        </button>
        <nav className="space-y-5 mt-10">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-1 hover:text-blue-300 `}
          >
            <CgProfile size={24} />
            <span className={`md:block ${show ? "block" : "hidden"}`}>
              Admin
            </span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center space-x-1 hover:text-blue-300 `}
          >
            <MdDashboard size={24} />
            <span className={`md:block ${show ? "block" : "hidden"}`}>
              Dashboard
            </span>
          </Link>

          {/* <Link
            to="/billing"
            className={`flex items-center space-x-1 hover:text-blue-300 `}
          >
            <FiBook size={24} />
            <span className={`md:block ${show ? "block" : "hidden"}`}>
              Billing
            </span>
          </Link> */}
          {/* <Link
            to="/product"
            className={`flex items-center space-x-1 hover:text-blue-300 `}
          >
            <FaBox size={24} />
            <span className={`md:block ${show ? "block" : "hidden"}`}>
              Product
            </span>
          </Link> */}

          <Link
            to="/hotels/view"
            className={`flex items-center space-x-1 hover:text-blue-300 `}
          >
            <FaHotel size={24} />
            <span className={`md:block ${show ? "block" : "hidden"}`}>
              hotel
            </span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Welcome</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className=" bg-gray-50 md:flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
