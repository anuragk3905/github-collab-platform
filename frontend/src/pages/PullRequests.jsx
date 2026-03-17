import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import DiffViewer from "../components/DiffViewer";

export default function PRDetail() {
  const { id } = useParams();
  const [diff, setDiff] = useState({ old: "", new: "" });

  useEffect(() => {
    API.get(`/pull-requests/${id}/diff`)
      .then(res => setDiff(res.data))
      .catch(() => console.log("Error loading diff"));
  }, [id]);

  if (!prs.length) {
  return <div className="text-gray-400 p-6">Loading PRs...</div>;
}
  return (
    <div className="bg-[#0d1117] min-h-screen text-white">
      <h1 className="p-4 text-xl">Code Changes</h1>
      <DiffViewer oldCode={diff.old} newCode={diff.new} />
    </div>
  );
}