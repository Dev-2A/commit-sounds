import { useCommits } from "./hooks/useCommits";
import Layout from "./components/Layout";

function App() {
  const { commits, repoInfo, loading, error, progress, loadCommits } =
    useCommits();

  const handleTest = () => {
    loadCommits("Dev-2A/commit-sounds", { perPage: 10 });
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        {/* 테스트 버튼 */}
        <button
          onClick={handleTest}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 rounded-lg font-medium transition-colors"
        >
          {loading ? "불러오는 중..." : "🧪 API 테스트 (Dev-2A/commit-sounds)"}
        </button>

        {/* 진행률 */}
        {loading && progress.total > 0 && (
          <p className="text-gray-400 text-sm">
            커밋 분석 중... {progress.current} / {progress.total}
          </p>
        )}

        {/* 에러 */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* 레포 정보 */}
        {repoInfo && (
          <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 w-full max-w-md">
            <p className="font-semibold text-white">{repoInfo.name}</p>
            <p className="text-gray-500">
              {repoInfo.description || "설명 없음"}
            </p>
            <p className="mt-2">
              ⭐ {repoInfo.stars} · 🗂️ {repoInfo.language}
            </p>
          </div>
        )}

        {/* 커밋 목록 */}
        {commits.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-4 w-full max-w-md max-h-64 overflow-y-auto">
            <p className="text-sm text-gray-400 mb-2">
              총 {commits.length}개 커밋 로드 완료
            </p>
            {commits.map((c) => (
              <div
                key={c.sha}
                className="py-2 border-b border-gray-800 last:border-0 text-sm"
              >
                <p className="text-gray-200 truncate">
                  {c.message.split("\n")[0]}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  📁 {c.filesChanged}개 파일 · +{c.additions} -{c.deletions}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
