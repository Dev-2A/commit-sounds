function CommitDetail({ musicData, currentIndex }) {
  if (!musicData || musicData.length === 0) return null;

  const current = currentIndex >= 0 ? musicData[currentIndex] : null;

  return (
    <div className="w-full max-w-lg">
      {current ? (
        <ActiveCommit commit={current} total={musicData.length} />
      ) : (
        <IdleState total={musicData.length} />
      )}
    </div>
  );
}

/**
 * 재생 대기 상태
 */
function IdleState({ total }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
      <p className="text-gray-600 text-sm">
        ▶ 재생을 시작하면 커밋 상세 정보가 여기에 표시됩니다
      </p>
      <p className="text-gray-700 text-xs mt-1">{total}개 커밋 준비됨</p>
    </div>
  );
}

/**
 * 재생 중인 커밋 상세 정보
 */
function ActiveCommit({ commit, total }) {
  const date = new Date(commit.date);
  const dateStr = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isMajor = commit.scale === "major";

  return (
    <div
      className={`bg-gray-900 border rounded-xl overflow-hidden transition-colors duration-300 ${
        isMajor ? "border-emerald-800/50" : "border-rose-800/50"
      }`}
    >
      {/* 상단 색상 바 */}
      <div className={`h-1 ${isMajor ? "bg-emerald-500" : "bg-rose-500"}`} />

      <div className="p-5 space-y-4">
        {/* 커밋 메시지 + 번호 */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white font-medium leading-snug">
              {commit.message.split("\n")[0]}
            </p>
            {/* 멀티라인 메시지 본문 */}
            {commit.message.includes("\n") && (
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                {commit.message.split("\n").slice(1).join(" ").trim()}
              </p>
            )}
          </div>
          <span className="shrink-0 text-xs text-gray-600 tabular-nums bg-gray-800 px-2 py-1 rounded">
            {commit.index + 1}/{total}
          </span>
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {commit.avatarUrl && (
            <img
              src={commit.avatarUrl}
              alt={commit.author}
              className="w-5 h-5 rounded-full"
            />
          )}
          <span className="text-gray-300">{commit.author}</span>
          <span className="text-gray-700">·</span>
          <span>{dateStr}</span>
          <span className="text-gray-700">·</span>
          <span>{timeStr}</span>
        </div>

        {/* 음악 매핑 정보 + 변경 통계 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 음악 정보 */}
          <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">
              Sound
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold tabular-nums ${
                  isMajor ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {commit.note}
              </span>
              <div className="space-y-0.5">
                <span
                  className={`block text-xs px-1.5 py-0.5 rounded ${
                    isMajor
                      ? "bg-emerald-900/50 text-emerald-400"
                      : "bg-rose-900/50 text-rose-400"
                  }`}
                >
                  {isMajor ? "🌞 장조" : "🌙 단조"}
                </span>
                <span className="block text-[10px] text-gray-500">
                  {rhythmLabel(commit.rhythm)} · {commit.rhythm}
                </span>
              </div>
            </div>
          </div>

          {/* 변경 통계 */}
          <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">
              Changes
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">📁 파일</span>
                <span className="text-white tabular-nums">
                  {commit.filesChanged}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-500">+ 추가</span>
                <span className="text-emerald-400 tabular-nums">
                  {commit.additions}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-500">- 삭제</span>
                <span className="text-rose-400 tabular-nums">
                  {commit.deletions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 변경 비율 바 */}
        <ChangeBar additions={commit.additions} deletions={commit.deletions} />

        {/* SHA + GitHub 링크 */}
        <div className="flex items-center justify-between pt-1">
          <code className="text-[10px] text-gray-600 font-mono">
            {commit.sha.slice(0, 7)}
          </code>
          {commit.htmlUrl && commit.htmlUrl !== "#" && (
            <a
              href={commit.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-indigo-400 transition-colors"
            >
              GitHub에서 보기 →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 추가/삭제 비율 바
 */
function ChangeBar({ additions, deletions }) {
  const total = additions + deletions;
  if (total === 0) return null;

  const addPercent = (additions / total) * 100;
  const delPercent = (deletions / total) * 100;

  return (
    <div className="space-y-1">
      <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-800">
        {addPercent > 0 && (
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${addPercent}%` }}
          />
        )}
        {delPercent > 0 && (
          <div
            className="bg-rose-500 transition-all duration-300"
            style={{ width: `${delPercent}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>
          +{additions} ({addPercent.toFixed(0)}%)
        </span>
        <span>
          -{deletions} ({delPercent.toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}

/**
 * 리듬 코드 → 한글 라벨
 */
function rhythmLabel(rhythm) {
  const map = {
    "16n": "매우 빠름",
    "8n": "빠름",
    "4n": "보통",
    "2n": "느림",
    "1n": "매우 느림",
  };
  return map[rhythm] || "보통";
}

export default CommitDetail;
