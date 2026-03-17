import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function Activity() {
  const { id } = useParams();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    API.get(`/repos/${id}/activity`)
      .then(res => setActivities(res.data))
      .catch(() => console.log("Error"));
  }, [id]);

  if (!activities.length) {
  return <div className="text-gray-400 p-6">Loading Activity...</div>;
}

  return (
    <div className="bg-[#0d1117] min-h-screen text-white p-6">
      <h1 className="text-xl mb-4">Activity Timeline</h1>

      {activities.map((act, i) => (
        <div key={i} className="border-l-2 border-gray-600 pl-4 mb-4">
          <p className="text-blue-400">{act.type}</p>
          <p className="text-gray-400 text-sm">{act.message}</p>
        </div>
      ))}
    </div>
  );
}