function RepoBadge({ repoInfo, commitCount, onClear }) {
  if (!repoInfo) return null;

  return (
    <div className="w-full max-w-lg bg-gray-900/80 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between animate-fade-in backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg shrink-0">📦</span>
        <div className="min-w-0">
          <a
            href={`https://github.com/${repoInfo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
          >
            {repoInfo.name}
          </a>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
            {repoInfo.language && <span>🗂️ {repoInfo.language}</span>}
            <span>⭐ {repoInfo.stars.toLocaleString()}</span>
            <span>🎵 {commitCount} commits</span>
          </div>
        </div>
      </div>
      <button
        onClick={onClear}
        className="text-gray-600 hover:text-white transition-all text-sm px-2 py-1 rounded-lg hover:bg-gray-800 active:scale-95"
        title="다른 레포 검색"
      >
        ✕
      </button>
    </div>
  );
}

export default RepoBadge;
