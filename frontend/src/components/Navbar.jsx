import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // later → remove token
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-[#161b22] border-b border-gray-800">
      
      <h1 className="text-white font-bold text-lg">Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-400">👤 User</span>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}