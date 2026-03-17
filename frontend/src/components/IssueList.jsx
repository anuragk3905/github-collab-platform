export default function IssueList({ issues }) {
  if (!issues.length) {
  return (
    <div className="text-center text-gray-400 mt-10">
      No Issues yet 🚀
    </div>
  );
}
    return (
    <div className="space-y-3">
      {issues.map(issue => (
        <div key={issue._id} className="border p-3 border-gray-700 rounded">
          <h2 className="text-yellow-400">{issue.title}</h2>
          <p className="text-sm text-gray-400">{issue.status}</p>
        </div>
      ))}
    </div>
  );
}