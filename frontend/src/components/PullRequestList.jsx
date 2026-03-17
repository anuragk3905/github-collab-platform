import { useNavigate } from "react-router-dom";

export default function PullRequestList({ prs }) {
  const navigate = useNavigate();

  if (!prs.length) {
  return (
    <div className="text-center text-gray-400 mt-10">
      No Pull Requests yet 🚀
    </div>
  );
}
  return (
    <div className="space-y-3">
      {prs.map(pr => (
        <div
          key={pr._id}
          className="border border-gray-700 p-3 rounded cursor-pointer hover:bg-[#161b22]"
          onClick={() => navigate(`/pull-requests/${pr._id}`)}
        >
          <h2 className="text-blue-400">{pr.title}</h2>
          <p className="text-sm text-gray-400">
            {pr.author} • {pr.status}
          </p>
        </div>
      ))}
    </div>
  );
}