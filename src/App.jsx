import { useState, useCallback } from "react";
import { useCommits } from "./hooks/useCommits";
import { usePlayer } from "./hooks/usePlayer";
import { useCompare } from "./hooks/useCompare";
import { mapCommitsToMusic } from "./utils/mapper";
import {
  parseRepoInput,
  fetchCommitsWithDetails,
  fetchRepoInfo,
} from "./services/github";
import Layout from "./components/Layout";
import RepoInput from "./components/RepoInput/RepoInput";
import RepoBadge from "./components/RepoInput/RepoBadge";
import PlayerControls from "./components/Player/PlayerControls";
import Timeline from "./components/Timeline/Timeline";
import ParticleCanvas from "./components/Particles/ParticleCanvas";
import CommitDetail from "./components/CommitDetail/CommitDetail";
import CompareInput from "./components/Compare/CompareInput";
import CompareView from "./components/Compare/CompareView";

function App() {
  const { commits, repoInfo, loading, error, progress, loadCommits, reset } =
    useCommits();
  const musicData = mapCommitsToMusic(commits);
  const player = usePlayer(musicData);
  const [hasSearched, setHasSearched] = useState(false);

  // 모드 전환
  const [mode, setMode] = useState("single"); // 'single' | 'compare'

  // 비교 모드 상태
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);
  const [compareDataA, setCompareDataA] = useState([]);
  const [compareDataB, setCompareDataB] = useState([]);
  const [compareInfoA, setCompareInfoA] = useState(null);
  const [compareInfoB, setCompareInfoB] = useState(null);

  const musicA = mapCommitsToMusic(compareDataA);
  const musicB = mapCommitsToMusic(compareDataB);
  const compare = useCompare(musicA, musicB);

  // 단일 모드 핸들러
  const handleSubmit = useCallback(
    (input, options) => {
      player.stop();
      setHasSearched(true);
      loadCommits(input, options);
    },
    [player, loadCommits],
  );

  const handleClear = useCallback(() => {
    player.stop();
    reset();
    setHasSearched(false);
  }, [player, reset]);

  // 비교 모드 핸들러
  const handleCompareSubmit = useCallback(
    async (inputA, inputB, options) => {
      const parsedA = parseRepoInput(inputA);
      const parsedB = parseRepoInput(inputB);

      if (!parsedA || !parsedB) {
        setCompareError("올바른 레포 형식이 아닙니다.");
        return;
      }

      compare.stop();
      setCompareLoading(true);
      setCompareError(null);
      setCompareDataA([]);
      setCompareDataB([]);
      setCompareInfoA(null);
      setCompareInfoB(null);

      try {
        const [infoA, infoB, commitsA, commitsB] = await Promise.all([
          fetchRepoInfo(parsedA.owner, parsedA.repo),
          fetchRepoInfo(parsedB.owner, parsedB.repo),
          fetchCommitsWithDetails(parsedA.owner, parsedA.repo, {
            perPage: options.perPage,
          }),
          fetchCommitsWithDetails(parsedB.owner, parsedB.repo, {
            perPage: options.perPage,
          }),
        ]);

        setCompareInfoA(infoA);
        setCompareInfoB(infoB);
        setCompareDataA(commitsA);
        setCompareDataB(commitsB);
      } catch (err) {
        setCompareError(
          err.message || "레포 데이터를 불러오는 중 오류가 발생했습니다.",
        );
      } finally {
        setCompareLoading(false);
      }
    },
    [compare],
  );

  const handleBackFromCompare = useCallback(() => {
    compare.stop();
    setCompareDataA([]);
    setCompareDataB([]);
    setCompareInfoA(null);
    setCompareInfoB(null);
    setCompareError(null);
  }, [compare]);

  const showWelcome = mode === "single" && !hasSearched && commits.length === 0;
  const showCompareResult =
    mode === "compare" && musicA.length > 0 && musicB.length > 0;

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center gap-6 p-6">
        {/* 모드 토글 */}
        <div className="flex bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setMode("single")}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              mode === "single"
                ? "bg-gray-700 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            🎵 단일 재생
          </button>
          <button
            onClick={() => setMode("compare")}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              mode === "compare"
                ? "bg-gray-700 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            🔀 비교 모드
          </button>
        </div>

        {/* ====== 단일 모드 ====== */}
        {mode === "single" && (
          <>
            {showWelcome && (
              <div className="text-center space-y-3 mt-4 mb-2">
                <p className="text-5xl">🎵</p>
                <h2 className="text-2xl font-semibold text-gray-200">
                  커밋을 음악으로 들어보세요
                </h2>
                <p className="text-gray-500 text-sm max-w-md">
                  GitHub 레포의 커밋 히스토리를 분석해서 음악으로 변환합니다.
                  커밋 시간 → 리듬, 변경 파일 수 → 음높이, 커밋 감정 → 장조/단조
                </p>
              </div>
            )}

            {!repoInfo ? (
              <RepoInput
                onSubmit={handleSubmit}
                loading={loading}
                progress={progress}
              />
            ) : (
              <RepoBadge
                repoInfo={repoInfo}
                commitCount={musicData.length}
                onClear={handleClear}
              />
            )}

            {error && (
              <div className="w-full max-w-lg bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {musicData.length > 0 && (
              <>
                <ParticleCanvas
                  currentIndex={player.currentIndex}
                  musicData={musicData}
                />
                <div className="w-full max-w-4xl flex flex-col items-center gap-6">
                  <Timeline
                    musicData={musicData}
                    currentIndex={player.currentIndex}
                    onSeek={player.seekTo}
                  />
                  <div className="w-full flex flex-col lg:flex-row gap-6 items-start justify-center">
                    <PlayerControls player={player} musicData={musicData} />
                    <CommitDetail
                      musicData={musicData}
                      currentIndex={player.currentIndex}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ====== 비교 모드 ====== */}
        {mode === "compare" && (
          <>
            {!showCompareResult && (
              <div className="text-center space-y-2 mt-4 mb-2">
                <p className="text-4xl">🔀</p>
                <h2 className="text-xl font-semibold text-gray-200">
                  두 레포의 커밋 사운드를 비교해보세요
                </h2>
                <p className="text-gray-500 text-sm">
                  레포 A는 왼쪽 스피커, 레포 B는 오른쪽 스피커로 동시 재생됩니다
                </p>
              </div>
            )}

            {!showCompareResult && (
              <CompareInput
                onSubmit={handleCompareSubmit}
                loading={compareLoading}
              />
            )}

            {compareLoading && (
              <p className="text-gray-400 text-sm">
                두 레포의 커밋을 불러오는 중...
              </p>
            )}

            {compareError && (
              <div className="w-full max-w-lg bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{compareError}</p>
              </div>
            )}

            {showCompareResult && (
              <CompareView
                compare={compare}
                dataA={musicA}
                dataB={musicB}
                infoA={compareInfoA}
                infoB={compareInfoB}
                onBack={handleBackFromCompare}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default App;
