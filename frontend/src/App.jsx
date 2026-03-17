 import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Repository from "./pages/Repository";
import PullRequests from "./pages/PullRequests";
import Issues from "./pages/Issues";
import Notifications from "./pages/Notifications";
import Activity from "./pages/Activity";
import RepoPage from "./pages/RepoPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repo/:id" element={<Repository />} />
        <Route path="/pull-requests/:id" element={<PullRequests />} />
        <Route path="/issues/:id" element={<Issues />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/activity/:id" element={<Activity />} />
        <Route path="/repos/:id" element={<RepoPage />} />
        
<Route path="/repos/:id/issues" element={<Issues />} />
<Route path="/repos/:id/pulls" element={<PullRequests />} />
        <Route path="/repo/:name" element={<RepoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;