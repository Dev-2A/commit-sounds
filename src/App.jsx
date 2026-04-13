import { useState } from "react";
import { useCommits } from "./hooks/useCommits";
import { usePlayer } from "./hooks/usePlayer";
import { mapCommitsToMusic } from "./utils/mapper";
import { SPEED_OPTIONS } from "./constants/music";
import Layout from "./components/Layout";

// API 없이 테스트용 더미 커밋
const DUMMY_COMMITS = [
  {
    sha: "1",
    message: "🎉 프로젝트 초기화",
    date: "2025-01-01T09:00:00Z",
    author: "Dev-2A",
    avatarUrl: null,
    htmlUrl: "#",
    filesChanged: 12,
    additions: 300,
    deletions: 0,
    files: [],
  },
  {
    sha: "2",
    message: "✨ 로그인 기능 추가",
    date: "2025-01-01T10:30:00Z",
    author: "Dev-2A",
    avatarUrl: null,
    htmlUrl: "#",
    filesChanged: 5,
    additions: 80,
    deletions: 10,
    files: [],
  },
  {
    sha: "3",
    message: "🐛 로그인 버그 수정",
    date: "2025-01-01T11:00:00Z",
    author: "Dev-2A",
    avatarUrl: null,
    htmlUrl: "#",
    filesChanged: 1,
    additions: 5,
    deletions: 3,
    files: [],
  },
  {
    sha: "4",
    message: "♻️ 컴포넌트 리팩토링",
    date: "2025-01-01T15:00:00Z",
    author: "Dev-2A",
    avatarUrl: null,
    htmlUrl: "#",
    filesChanged: 20,
    additions: 200,
    deletions: 150,
    files: [],
  },
  {
    sha: "5",
    message: "🚀 배포 설정 완료",
    date: "2025-01-02T09:00:00Z",
    author: "Dev-2A",
    avatarUrl: null,
    htmlUrl: "#",
    filesChanged: 3,
    additions: 40,
    deletions: 5,
    files: [],
  },
  {
    sha: "6",
    message: "🔥 불필요한 파일 삭제",
    date: "2025-01-02T09:10:00Z",
    author: "Dev-2A",
    avatarUrl: null,
    htmlUrl: "#",
    filesChanged: 8,
    additions: 0,
    deletions: 120,
    files: [],
  },
  {
    sha: "7",
    message: "✨ 다크모드 구현",
    date: "2025-01-02T14:00:00Z",
    author: "Dev-2A",
    avatarUrl: null,
    htmlUrl: "#",
    filesChanged: 6,
    additions: 90,
    deletions: 20,
    files: [],
  },
  {
    sha: "8",
    message: "🚑 긴급 핫픽스 적용",
    date: "2025-01-02T14:05:00Z",
    author: "Dev-2A",
    avatarUrl: null,
    htmlUrl: "#",
    filesChanged: 1,
    additions: 2,
    deletions: 1,
    files: [],
  },
];

function App() {
  const { commits, repoInfo, loading, error, progress, loadCommits } =
    useCommits();
  const [useDummy, setUseDummy] = useState(false);

  const source = useDummy ? DUMMY_COMMITS : commits;
  const musicData = mapCommitsToMusic(source);
  const player = usePlayer(musicData);

  const handleApiTest = () => {
    setUseDummy(false);
    player.stop();
    loadCommits("Dev-2A/commit-sounds", { perPage: 10 });
  };

  const handleDummyTest = () => {
    setUseDummy(true);
    player.stop();
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        {/* 테스트 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleDummyTest}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
          >
            🎵 더미 데이터로 소리 테스트
          </button>
          <button
            onClick={handleApiTest}
            disabled={loading}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            {loading ? "불러오는 중..." : "🧪 API 테스트"}
          </button>
        </div>

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

        {/* 재생 컨트롤 */}
        {musicData.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={player.stop}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
              >
                ⏹
              </button>
              <button
                onClick={player.isPlaying ? player.pause : player.play}
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-xl transition-colors"
              >
                {player.isPlaying ? "⏸" : "▶️"}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2">
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => player.changeSpeed(opt.value)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    player.speed === opt.value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-gray-400">
              {player.currentIndex >= 0
                ? `${player.currentIndex + 1} / ${player.totalCount}`
                : `대기 중 · ${player.totalCount}개 커밋`}
            </div>

            {player.currentIndex >= 0 && musicData[player.currentIndex] && (
              <div className="bg-gray-800 rounded-lg p-3 text-sm">
                <p className="text-gray-200 truncate">
                  {musicData[player.currentIndex].message.split("\n")[0]}
                </p>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  <span>🎹 {musicData[player.currentIndex].note}</span>
                  <span>🥁 {musicData[player.currentIndex].rhythm}</span>
                  <span>
                    {musicData[player.currentIndex].scale === "major"
                      ? "🌞 장조"
                      : "🌙 단조"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
