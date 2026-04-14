import { SPEED_OPTIONS } from "../../constants/music";

function CompareView({ compare, dataA, dataB, infoA, infoB, onBack }) {
  const currentA = compare.indexA >= 0 ? dataA[compare.indexA] : null;
  const currentB = compare.indexB >= 0 ? dataB[compare.indexB] : null;

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* 상단: 뒤로가기 + 컨트롤 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          ← 돌아가기
        </button>
        <div className="flex items-center gap-3">
          {/* 속도 */}
          <div className="flex gap-1">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => compare.changeSpeed(opt.value)}
                className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                  compare.speed === opt.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 재생/정지 */}
          <button
            onClick={compare.isPlaying ? compare.pause : compare.play}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center transition-colors"
          >
            {compare.isPlaying ? "⏸" : "▶️"}
          </button>
          <button
            onClick={compare.stop}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ⏹
          </button>
        </div>
      </div>

      {/* 듀얼 패널 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RepoPanel
          label="A"
          color="indigo"
          repoInfo={infoA}
          current={currentA}
          index={compare.indexA}
          total={compare.totalA}
          data={dataA}
        />
        <RepoPanel
          label="B"
          color="amber"
          repoInfo={infoB}
          current={currentB}
          index={compare.indexB}
          total={compare.totalB}
          data={dataB}
        />
      </div>

      {/* 비교 통계 */}
      {dataA.length > 0 && dataB.length > 0 && (
        <CompareStats dataA={dataA} dataB={dataB} infoA={infoA} infoB={infoB} />
      )}
    </div>
  );
}

/**
 * 레포 패널 (A/B 각각)
 */
function RepoPanel({ label, color, repoInfo, current, index, total, data }) {
  const borderColor =
    color === "indigo" ? "border-indigo-800/50" : "border-amber-800/50";
  const badgeBg = color === "indigo" ? "bg-indigo-600" : "bg-amber-600";
  const progressBg = color === "indigo" ? "bg-indigo-500" : "bg-amber-500";

  const percent = total > 0 && index >= 0 ? ((index + 1) / total) * 100 : 0;

  return (
    <div
      className={`bg-gray-900 border ${borderColor} rounded-xl overflow-hidden`}
    >
      {/* 프로그레스 */}
      <div className="h-1 bg-gray-800">
        <div
          className={`h-full ${progressBg} transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="p-4 space-y-3">
        {/* 레포 정보 */}
        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 ${badgeBg} rounded-full flex items-center justify-center text-[10px] font-bold`}
          >
            {label}
          </span>
          <span className="text-sm font-semibold text-white truncate">
            {repoInfo?.name || "로딩 중..."}
          </span>
          {index >= 0 && (
            <span className="ml-auto text-xs text-gray-600 tabular-nums">
              {index + 1}/{total}
            </span>
          )}
        </div>

        {/* 현재 커밋 */}
        {current ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-300 truncate">
              {current.message.split("\n")[0]}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2 py-0.5 rounded-full ${
                  current.scale === "major"
                    ? "bg-emerald-900/50 text-emerald-400"
                    : "bg-rose-900/50 text-rose-400"
                }`}
              >
                {current.note} {current.scale === "major" ? "🌞" : "🌙"}
              </span>
              <span className="text-gray-500">{current.rhythm}</span>
              <span className="text-gray-500">📁 {current.filesChanged}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-600">대기 중</p>
        )}

        {/* 미니 타임라인 */}
        <div className="flex gap-[2px] items-end h-6">
          {data.map((item, i) => {
            const isActive = i === index;
            const isPast = i < index;
            const h = Math.max(
              4,
              Math.min(
                24,
                4 + Math.sqrt((item.additions || 0) + (item.deletions || 0)),
              ),
            );

            return (
              <div
                key={item.sha}
                className={`rounded-sm transition-all duration-200 ${
                  isActive
                    ? "opacity-100"
                    : isPast
                      ? "opacity-50"
                      : "opacity-20"
                }`}
                style={{
                  width: "3px",
                  height: `${h}px`,
                  backgroundColor: isActive
                    ? color === "indigo"
                      ? "#818cf8"
                      : "#fbbf24"
                    : item.sentiment?.label === "positive"
                      ? "#34d399"
                      : item.sentiment?.label === "negative"
                        ? "#fb7185"
                        : "#64748b",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 비교 통계
 */
function CompareStats({ dataA, dataB, infoA, infoB }) {
  const statsA = calcStats(dataA);
  const statsB = calcStats(dataB);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
        비교 통계
      </p>
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <StatRow label="커밋 수" valueA={statsA.count} valueB={statsB.count} />
        <StatRow
          label="장조 비율"
          valueA={`${statsA.majorPercent}%`}
          valueB={`${statsB.majorPercent}%`}
        />
        <StatRow
          label="평균 변경"
          valueA={statsA.avgChanges}
          valueB={statsB.avgChanges}
        />
      </div>
    </div>
  );
}

function StatRow({ label, valueA, valueB }) {
  return (
    <div className="space-y-1">
      <p className="text-gray-600">{label}</p>
      <div className="flex items-center justify-center gap-3">
        <span className="text-indigo-400 font-medium tabular-nums">
          {valueA}
        </span>
        <span className="text-gray-700">vs</span>
        <span className="text-amber-400 font-medium tabular-nums">
          {valueB}
        </span>
      </div>
    </div>
  );
}

function calcStats(data) {
  const count = data.length;
  const majorCount = data.filter((d) => d.scale === "major").length;
  const majorPercent = count > 0 ? Math.round((majorCount / count) * 100) : 0;
  const totalChanges = data.reduce(
    (s, d) => s + (d.additions || 0) + (d.deletions || 0),
    0,
  );
  const avgChanges = count > 0 ? Math.round(totalChanges / count) : 0;

  return { count, majorPercent, avgChanges };
}

export default CompareView;
