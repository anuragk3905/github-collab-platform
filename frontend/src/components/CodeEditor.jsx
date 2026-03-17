import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

export default function CodeEditor({ file }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    if (file) {
      setCode(file.content || "");
    }
  }, [file]);

  return (
    <div className="h-full">
      {file ? (
        <Editor
          height="100%"
          theme="vs-dark"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value)}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a file to view
        </div>
      )}
    </div>
  );
}