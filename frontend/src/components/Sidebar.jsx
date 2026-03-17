import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#0d1117] border-r border-gray-800 min-h-screen p-4">
      
      <h2 className="text-white text-lg font-bold mb-6">GitHub Clone</h2>

      <nav className="flex flex-col gap-3">
        <Link to="/dashboard" className="text-gray-400 hover:text-white">
          🏠 Dashboard
        </Link>

         

        <Link to="/activity" className="text-gray-400 hover:text-white">
          📊 Activity
        </Link>
      </nav>
    </div>
  );
}