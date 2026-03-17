import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications(prev => [data, ...prev]);
    });
  }, []);

  return (
    <div className="space-y-2">
      {notifications.map((n, i) => (
        <div key={i} className="bg-[#161b22] p-3 rounded">
          {n.message}
        </div>
      ))}
    </div>
  );
}