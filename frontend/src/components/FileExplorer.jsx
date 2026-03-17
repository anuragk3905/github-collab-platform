import { useState } from "react";

export default function FileExplorer({ files, setSelectedFile }) {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (name) => {
    setOpenFolders((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderFiles = (fileList, level = 0) => {
    return fileList.map((file, index) => (
      <div key={index} style={{ paddingLeft: `${level * 12}px` }}>

        {file.type === "folder" ? (
          <div>
            <div className="flex items-center gap-2 hover:bg-[#161b22] px-2 py-1 rounded cursor-pointer">
  <span>{file.type === "folder" ? "📁" : "📄"}</span>
  <span>{file.name}</span>
</div>

            {openFolders[file.name] &&
              renderFiles(file.children || [], level + 1)}
          </div>
        ) : (
          <div
            className="cursor-pointer hover:text-green-400"
            onClick={() => setSelectedFile(file)}
          >
            📄 {file.name}
          </div>
        )}

      </div>
    ));
  };

  return (
    <div className="p-3 text-sm">
      <h2 className="mb-2 font-semibold">Files</h2>
      {renderFiles(files)}
    </div>
  );
}