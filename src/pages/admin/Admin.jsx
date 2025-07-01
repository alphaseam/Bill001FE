import { NavLink, Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-xl mb-4">Admin Panel</h2>
        <nav>
          <NavLink
            to="/admin/billing/edit/1"
            className="block py-2 hover:bg-gray-700"
          >
            Edit Bill
          </NavLink>
          <NavLink
            to="/admin/manage-users"
            className="block py-2 hover:bg-gray-700"
          >
            Manage Users
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
