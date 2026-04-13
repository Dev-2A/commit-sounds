import { useState, useCallback } from "react";
import { useCommits } from "./hooks/useCommits";
import { usePlayer } from "./hooks/usePlayer";
import { mapCommitsToMusic } from "./utils/mapper";
import Layout from "./components/Layout";
import RepoInput from "./components/RepoInput/RepoInput";
import RepoBadge from "./components/RepoInput/RepoBadge";
import PlayerControls from "./components/Player/PlayerControls";
import Timeline from "./components/Timeline/Timeline";
import ParticleCanvas from "./components/Particles/ParticleCanvas";
import CommitDetail from "./components/CommitDetail/CommitDetail";

function App() {
  const { commits, repoInfo, loading, error, progress, loadCommits, reset } =
    useCommits();
  const musicData = mapCommitsToMusic(commits);
  const player = usePlayer(musicData);
  const [hasSearched, setHasSearched] = useState(false);

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

  const showWelcome = !hasSearched && commits.length === 0;

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center gap-6 p-6">
        {/* 환영 메시지 */}
        {showWelcome && (
          <div className="text-center space-y-3 mt-8 mb-4">
            <p className="text-5xl">🎵</p>
            <h2 className="text-2xl font-semibold text-gray-200">
              커밋을 음악으로 들어보세요
            </h2>
            <p className="text-gray-500 text-sm max-w-md">
              GitHub 레포의 커밋 히스토리를 분석해서 음악으로 변환합니다. 커밋
              시간 → 리듬, 변경 파일 수 → 음높이, 커밋 감정 → 장조/단조
            </p>
          </div>
        )}

        {/* 레포 입력 / 배지 */}
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

        {/* 에러 */}
        {error && (
          <div className="w-full max-w-lg bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* 파티클 캔버스 */}
        {musicData.length > 0 && (
          <ParticleCanvas
            currentIndex={player.currentIndex}
            musicData={musicData}
          />
        )}

        {/* 타임라인 + 플레이어 + 커밋 상세 */}
        {musicData.length > 0 && (
          <div className="w-full max-w-4xl flex flex-col items-center gap-6">
            <Timeline
              musicData={musicData}
              currentIndex={player.currentIndex}
              onSeek={player.seekTo}
            />

            {/* 플레이어 + 커밋 상세 가로 배치 */}
            <div className="w-full flex flex-col lg:flex-row gap-6 items-start justify-center">
              <PlayerControls player={player} musicData={musicData} />
              <CommitDetail
                musicData={musicData}
                currentIndex={player.currentIndex}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
