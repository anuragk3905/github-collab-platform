import { useEffect, useState } from "react";
import API from "../services/api";

export default function CommitHistory({ repoId }) {
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    API.get(`/repos/${repoId}/commits`)
      .then((res) => setCommits(res.data))
      .catch(() => console.log("Error fetching commits"));
  }, [repoId]);

  return (
    <div className="p-4 text-sm">
      <h2 className="font-semibold mb-3">Commits</h2>

      {commits.map((commit) => (
        <div
          key={commit._id}
          className="border-b border-gray-700 py-2"
        >
          <p className="text-white">{commit.message}</p>
          <p className="text-gray-400 text-xs">
            {commit.author} • {new Date(commit.date).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}