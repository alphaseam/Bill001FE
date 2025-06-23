import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';

const DashboardLayout = ({ children }) => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
                <h2 className="text-2xl font-bold mb-6">My App</h2>
                <nav className="space-y-2">
                    <Link to="/dashboard" className="block hover:text-blue-300">Dashboard</Link>
                    <Link to="/billing" className="block hover:text-blue-300">Billing</Link>
                    <Link to="/product" className="block hover:text-blue-300">Product</Link>
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
                <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
