import { useCommits } from "./hooks/useCommits";
import { mapCommitsToMusic } from "./utils/mapper";
import Layout from "./components/Layout";

function App() {
  const { commits, repoInfo, loading, error, progress, loadCommits } =
    useCommits();

  const musicData = mapCommitsToMusic(commits);

  const handleTest = () => {
    loadCommits("facebook/react", { perPage: 15 });
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        <button
          onClick={handleTest}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 rounded-lg font-medium transition-colors"
        >
          {loading ? "불러오는 중..." : "🧪 감정 분석 테스트 (facebook/react)"}
        </button>

        {loading && progress.total > 0 && (
          <p className="text-gray-400 text-sm">
            커밋 분석 중... {progress.current} / {progress.total}
          </p>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {repoInfo && (
          <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 w-full max-w-lg">
            <p className="font-semibold text-white">{repoInfo.name}</p>
          </div>
        )}

        {musicData.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-4 w-full max-w-lg max-h-80 overflow-y-auto">
            <p className="text-sm text-gray-400 mb-3">
              🎵 {musicData.length}개 커밋 → 음악 매핑 완료
            </p>
            {musicData.map((m) => (
              <div
                key={m.sha}
                className="py-2 border-b border-gray-800 last:border-0 text-sm"
              >
                <p className="text-gray-200 truncate">
                  {m.message.split("\n")[0]}
                </p>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  <span>🎹 {m.note}</span>
                  <span>🥁 {m.rhythm}</span>
                  <span>🔊 {m.volume.toFixed(2)}</span>
                  <span
                    className={
                      m.sentiment.label === "positive"
                        ? "text-green-400"
                        : m.sentiment.label === "negative"
                          ? "text-red-400"
                          : "text-gray-400"
                    }
                  >
                    {m.scale === "major" ? "🌞 장조" : "🌙 단조"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
