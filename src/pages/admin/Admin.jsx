import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <p className="mb-4 text-gray-600">Choose an admin option:</p>

      <div className="space-x-4">
        <Link
          to="/admin/users"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Manage Users
        </Link>
        <Link
          to="/admin/billing/edit/1"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Edit Bill
        </Link>
      </div>
    </div>
  );
};

export default Admin;
