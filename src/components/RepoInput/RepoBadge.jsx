function RepoBadge({ repoInfo, commitCount, onClear }) {
  if (!repoInfo) return null;

  return (
    <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg">📦</span>
        <div className="min-w-0">
          <a
            href={`https://github.com/${repoInfo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
          >
            {repoInfo.name}
          </a>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            {repoInfo.language && <span>🗂️ {repoInfo.language}</span>}
            <span>⭐ {repoInfo.stars}</span>
            <span>🎵 {commitCount} commits</span>
          </div>
        </div>
      </div>
      <button
        onClick={onClear}
        className="text-gray-600 hover:text-gray-300 transition-colors text-sm px-2"
        title="다른 레포 검색"
      >
        ✕
      </button>
    </div>
  );
}

export default RepoBadge;
