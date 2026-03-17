import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SIdebar";
import Navbar from "../components/Navbar";
import React from "react";

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // 🔥 IMPORTANT

  useEffect(() => {
    const dummyRepos = [
      { name: "Code-Collab", description: "GitHub clone project", stars: 10 },
      { name: "AI-Project", description: "ML system", stars: 25 },
      { name: "Smart-Task-Manager", description: "Full stack app", stars: 15 },
    ];

    setTimeout(() => {
      setRepos(dummyRepos);
      setLoading(false);
    }, 1000);
  }, []);

  // ✅ LOADING
  if (loading) {
    return (
      <div className="text-gray-400 p-6">
        Loading repositories...
      </div>
    );
  }

  // ✅ EMPTY
  if (repos.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No repositories found 🚀
      </div>
    );
  }

  return (
    <div className="flex bg-[#0d1117] min-h-screen text-white">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Repositories</h1>
            <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
              New Repository
            </button>
          </div>

          {/* Repo List */}
          <div className="grid gap-4">
            {repos.map((repo, index) => (
              <div
                key={index}
                onClick={() => navigate(`/repo/${repo.name}`)} // 🔥 THIS IS THE LINE
                className="p-4 border border-gray-700 rounded-lg hover:bg-[#161b22] cursor-pointer"
              >
                <h2 className="text-lg font-semibold text-blue-400">
                  {repo.name}
                </h2>
                <p className="text-gray-400">{repo.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  ⭐ {repo.stars}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}