import ReactDiffViewer from "react-diff-viewer-continued";

export default function DiffViewer({ oldCode, newCode }) {
  return (
    <div className="p-4">
      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
      />
    </div>
  );
}