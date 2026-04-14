import { SPEED_OPTIONS } from "../../constants/music";

function PlayerControls({ player, musicData }) {
  const current =
    player.currentIndex >= 0 ? musicData[player.currentIndex] : null;

  const progressPercent =
    player.totalCount > 0 && player.currentIndex >= 0
      ? ((player.currentIndex + 1) / player.totalCount) * 100
      : 0;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden w-full lg:w-80 shrink-0 border border-gray-800/50 animate-fade-in">
      {/* 프로그레스 바 */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* 현재 커밋 정보 */}
        <div className="min-h-14 flex items-center">
          {current ? (
            <div className="w-full animate-fade-in">
              <p className="text-gray-200 text-sm truncate">
                {current.message.split("\n")[0]}
              </p>
              <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
                <span className="text-xs text-gray-500">
                  {new Date(current.date).toLocaleDateString("ko-KR")}
                </span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">{current.author}</span>
                <span className="text-xs text-gray-600">·</span>
                <NoteChip note={current.note} scale={current.scale} />
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              ▶ 재생 버튼을 눌러 커밋 사운드를 들어보세요
            </p>
          )}
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <ControlButton
            onClick={() => player.seekTo(0)}
            disabled={player.totalCount === 0}
            title="처음으로"
          >
            ⏮
          </ControlButton>

          <ControlButton
            onClick={() => player.seekTo(Math.max(0, player.currentIndex - 1))}
            disabled={player.currentIndex <= 0}
            title="이전 커밋"
          >
            ⏪
          </ControlButton>

          <button
            onClick={player.isPlaying ? player.pause : player.play}
            disabled={player.totalCount === 0}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all active:scale-90 ${
              player.isPlaying
                ? "bg-indigo-600 hover:bg-indigo-500 animate-pulse-glow"
                : "bg-indigo-600 hover:bg-indigo-500"
            } disabled:bg-gray-700 disabled:shadow-none`}
            title={player.isPlaying ? "일시정지" : "재생"}
          >
            {player.isPlaying ? "⏸" : "▶️"}
          </button>

          <ControlButton
            onClick={() =>
              player.seekTo(
                Math.min(player.totalCount - 1, player.currentIndex + 1),
              )
            }
            disabled={player.currentIndex >= player.totalCount - 1}
            title="다음 커밋"
          >
            ⏩
          </ControlButton>

          <ControlButton
            onClick={player.stop}
            disabled={player.currentIndex < 0 && !player.isPlaying}
            title="정지"
          >
            ⏹
          </ControlButton>
        </div>

        {/* 속도 + 카운터 */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => player.changeSpeed(opt.value)}
                className={`px-2.5 py-1 text-xs rounded-full transition-all active:scale-95 ${
                  player.speed === opt.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-500 tabular-nums">
            {player.currentIndex >= 0
              ? `${player.currentIndex + 1} / ${player.totalCount}`
              : `${player.totalCount} commits`}
          </span>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ onClick, disabled, title, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 sm:w-9 sm:h-9 text-gray-400 hover:text-white disabled:text-gray-700 transition-all active:scale-90 text-sm rounded-full hover:bg-gray-800/50"
      title={title}
    >
      {children}
    </button>
  );
}

function NoteChip({ note, scale }) {
  const isMajor = scale === "major";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
        isMajor
          ? "bg-emerald-900/50 text-emerald-400"
          : "bg-rose-900/50 text-rose-400"
      }`}
    >
      <span>{isMajor ? "🌞" : "🌙"}</span>
      <span>{note}</span>
    </span>
  );
}

export default PlayerControls;
