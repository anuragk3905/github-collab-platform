import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import RepoHeader from "../components/RepoHeader";
import FileExplorer from "../components/FileExplorer";
import CodeEditor from "../components/CodeEditor";
import CommitHistory from "../components/CommitHistory";

export default function Repository() {
  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    API.get(`/repos/${id}`)
      .then((res) => setFiles(res.data.files))
      .catch(() => console.log("Error loading repo"));
  }, [id]);

  return (
    <div className="flex h-screen bg-[#0d1117] text-white">

      {/* File Explorer */}
      <div className="w-1/4 border-r border-gray-700 overflow-y-auto">
        <FileExplorer files={files} setSelectedFile={setSelectedFile} />
      </div>

      {/* Code Editor */}
      <div className="w-2/4">
        <CodeEditor file={selectedFile} />
      </div>

      {/* Commit History */}
      <div className="w-1/4 border-l border-gray-700 overflow-y-auto">
        <CommitHistory repoId={id} />
      </div>
      <div>
        <RepoHeader repo={{ name: "Repo Name", description: "Sample repo" }} />
      </div>

    </div>
  );
}