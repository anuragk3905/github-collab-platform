import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/SIdebar";
import Navbar from "../components/Navbar";

export default function RepoPage() {
  const { id } = useParams(); // 👈 important
  const navigate = useNavigate();

  const files = ["index.js", "App.jsx", "README.md"];

  return (
    <div className="flex bg-[#0d1117] min-h-screen text-white">
      
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          {/* Repo Header */}
          <h1 className="text-2xl font-bold text-blue-400">
            Repo ID: {id}
          </h1>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-700 mb-4">
            
            {/* CODE TAB */}
            <span className="pb-2 border-b-2 border-white cursor-pointer">
              Code
            </span>

            {/* 🔥 ISSUES TAB (NAVIGATES) */}
            <span
              onClick={() => navigate(`/repos/${id}/issues`)}
              className="pb-2 cursor-pointer text-gray-400 hover:text-white"
            >
              Issues
            </span>

            {/* 🔥 PR TAB (NAVIGATES) */}
            <span
              onClick={() => navigate(`/repos/${id}/pulls`)}
              className="pb-2 cursor-pointer text-gray-400 hover:text-white"
            >
              Pull Requests
            </span>

          </div>

          {/* Code Section */}
          <div className="border border-gray-700 rounded-lg p-4">
            <h2 className="mb-3 text-lg">Files</h2>

            {files.map((file, index) => (
              <div
                key={index}
                className="p-2 border-b border-gray-700 hover:bg-[#161b22]"
              >
                📄 {file}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}