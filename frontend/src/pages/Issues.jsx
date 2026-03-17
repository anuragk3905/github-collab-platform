 import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import IssueList from "../components/IssueList";

export default function Issues() {
  const { id } = useParams();

  const [issues, setIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: ""
  });

  // 🔥 Fetch issues
  const fetchIssues = () => {
    API.get(`/repos/${id}/issues`)
      .then(res => setIssues(res.data))
      .catch(() => console.log("Error"));
  };

  useEffect(() => {
    fetchIssues();
  }, [id]);

  // 🔥 Create Issue
  const handleCreateIssue = async () => {
    if (!newIssue.title) return;

    try {
      await API.post(`/repos/${id}/issues`, newIssue);

      // refresh list
      fetchIssues();

      // reset form
      setNewIssue({ title: "", description: "" });
      setShowForm(false);
    } catch (err) {
      console.log("Error creating issue");
    }
  };

  return (
    <div className="bg-[#0d1117] min-h-screen text-white p-6">

      <h1 className="text-xl mb-4">Issues</h1>

      {/* 🔥 New Issue Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
      >
        {showForm ? "Cancel" : "New Issue"}
      </button>

      {/* 🔥 Issue Form */}
      {showForm && (
        <div className="mb-4 p-4 border border-gray-700 rounded">

          <input
            type="text"
            placeholder="Issue title"
            value={newIssue.title}
            onChange={(e) =>
              setNewIssue({ ...newIssue, title: e.target.value })
            }
            className="w-full mb-2 p-2 bg-[#0d1117] border border-gray-600 rounded"
          />

          <textarea
            placeholder="Description"
            value={newIssue.description}
            onChange={(e) =>
              setNewIssue({ ...newIssue, description: e.target.value })
            }
            className="w-full mb-2 p-2 bg-[#0d1117] border border-gray-600 rounded"
          />

          <button
            onClick={handleCreateIssue}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      )}

      {/* 🔥 Issues List */}
      {!issues.length ? (
        <div className="text-gray-400">No issues found</div>
      ) : (
        <IssueList issues={issues} />
      )}

    </div>
  );
}