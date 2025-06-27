<<<<<<< HEAD
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { ImCross } from 'react-icons/im';
import { FiAlignJustify } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { AiFillProduct } from 'react-icons/ai';

const DashboardLayout = ({ children }) => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className={`md:w-50 w-10 md:block bg-gray-800 min-h-screen text-white p-2  ${show ? "w-50" : "w-10"}`}>
                <h2 className={`text-2xl hidden md:block font-bold mb-6 ${show ? "block" : "hidden"}`}>My App</h2>
                <button className='md:hidden mt-3' onClick={() => setShow(!show)}>{show ? <ImCross size={24} /> : <FiAlignJustify size={24} />}</button>
                <nav className="space-y-5 mt-10">
                    <Link to="/dashboard" className={`flex items-center space-x-1 hover:text-blue-300 `}>
                        <MdDashboard size={24} />
                        <span className={`md:block ${show ? "block" : "hidden"}`} >Dashboard</span>
                    </Link>
                    <Link to="/billing" className={`flex items-center space-x-1 hover:text-blue-300 `}>
                        <CgProfile size={24} />
                        <span className={`md:block ${show ? "block" : "hidden"}`} >Billing</span>
                    </Link>
                    <Link to="/product" className={`flex items-center space-x-1 hover:text-blue-300 `}>
                        <AiFillProduct size={24} />
                        <span className={`md:block ${show ? "block" : "hidden"}`} >Product</span>
                    </Link>

                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold">Welcome, {auth.user?.name || 'User'}</h1>
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
                    {children}
                </main>
            </div>
        </div>
    );
=======
import React, { useContext } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";

const DashboardLayout = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">My App</h2>
        <nav className="space-y-2">
          {/* Admin (force show for testing) */}
          <Link to="/admin" className="block hover:text-blue-300">
            Admin
          </Link>

          <Link to="/dashboard" className="block hover:text-blue-300">
            Dashboard
          </Link>
          <Link to="/billing" className="block hover:text-blue-300">
            Billing
          </Link>
          <Link to="/product" className="block hover:text-blue-300">
            Product
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Welcome, {auth.user?.name || "User"}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443
};

export default DashboardLayout;
