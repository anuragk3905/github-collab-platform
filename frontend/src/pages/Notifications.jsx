import NotificationPanel from "../components/NotificationPanel";

export default function Notifications() {
  return (
    <div className="bg-[#0d1117] min-h-screen text-white p-6">
      <h1 className="text-xl mb-4">Notifications</h1>
      <NotificationPanel />
    </div>
  );
}