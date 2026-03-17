export default function RepoHeader({ repo }) {
  return (
    <div className="p-4 border-b border-gray-700 flex justify-between items-center">

      <div>
        <h1 className="text-xl text-blue-400">{repo.name}</h1>
        <p className="text-sm text-gray-400">{repo.description}</p>
      </div>

      <div className="flex gap-2">
        <button className="bg-[#21262d] px-3 py-1 rounded border border-gray-600">
          🌿 main
        </button>

        <button className="bg-green-600 px-3 py-1 rounded">
          New File
        </button>

        <button className="bg-blue-600 px-3 py-1 rounded">
          Commit
        </button>
      </div>
    </div>
  );
}