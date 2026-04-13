import { useState } from "react";

const EXAMPLE_REPOS = [
  { label: "React", value: "facebook/react" },
  { label: "Vue", value: "vuejs/core" },
  { label: "Svelte", value: "sveltejs/svelte" },
  { label: "Vite", value: "vitejs/vite" },
  { label: "Tailwind", value: "tailwindlabs/tailwindcss" },
];

function RepoInput({ onSubmit, loading, progress }) {
  const [input, setInput] = useState("");
  const [perPage, setPerPage] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSubmit(input.trim(), { perPage });
  };

  const handleExample = (value) => {
    if (loading) return;
    setInput(value);
    onSubmit(value, { perPage });
  };

  return (
    <div className="w-full max-w-lg space-y-4">
      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="owner/repo 또는 GitHub URL"
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium text-sm transition-colors shrink-0"
        >
          {loading ? "분석 중" : "🎵 재생"}
        </button>
      </form>

      {/* 커밋 수 설정 */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-xs text-gray-500">커밋 수</span>
        <div className="flex gap-1">
          {[10, 30, 50, 100].map((n) => (
            <button
              key={n}
              onClick={() => setPerPage(n)}
              disabled={loading}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                perPage === n
                  ? "bg-gray-700 text-white"
                  : "bg-gray-900 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-gray-600 ml-auto">
          비인증 API: 시간당 60회 제한
        </span>
      </div>

      {/* 로딩 프로그레스 */}
      {loading && progress.total > 0 && (
        <div className="space-y-1.5">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            커밋 분석 중... {progress.current} / {progress.total}
          </p>
        </div>
      )}

      {/* 예시 레포 */}
      {!loading && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-gray-600">예시:</span>
          {EXAMPLE_REPOS.map((repo) => (
            <button
              key={repo.value}
              onClick={() => handleExample(repo.value)}
              className="px-2.5 py-1 text-xs bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white rounded-full transition-colors"
            >
              {repo.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-indigo-400"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default RepoInput;
