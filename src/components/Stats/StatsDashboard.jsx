import { useMemo } from "react";
import { calcCommitStats } from "../../utils/stats";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const RHYTHM_LABELS = {
  "16n": "매우 빠름",
  "8n": "빠름",
  "4n": "보통",
  "2n": "느림",
  "1n": "매우 느림",
};

function StatsDashboard({ musicData, isOpen, onToggle }) {
  const stats = useMemo(() => calcCommitStats(musicData), [musicData]);

  if (!stats) return null;

  return (
    <div className="w-full max-w-4xl">
      {/* 토글 버튼 */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
      >
        <span
          className="transform transition-transform"
          style={{
            display: "inline-block",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </span>
        📊 커밋 통계 대시보드
      </button>

      {isOpen && (
        <div className="space-y-4">
          {/* 1행: 핵심 수치 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="총 커밋" value={stats.total} icon="📝" />
            <StatCard
              label="활동 기간"
              value={`${stats.spanDays}일`}
              icon="📅"
            />
            <StatCard label="총 파일 변경" value={stats.totalFiles} icon="📁" />
            <StatCard
              label="코드 변경"
              value={`+${stats.totalAdditions} / -${stats.totalDeletions}`}
              icon="📊"
            />
          </div>

          {/* 2행: 감정 분포 + 음표 랭킹 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 감정 분포 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                감정 분포
              </p>

              <div className="flex items-center gap-4">
                <MoodRing
                  majorPercent={Math.round(
                    (stats.majorCount / stats.total) * 100,
                  )}
                />
                <div className="space-y-1.5 flex-1">
                  <BarRow
                    label="🌞 긍정 (장조)"
                    count={stats.sentimentCounts.positive}
                    total={stats.total}
                    color="bg-emerald-500"
                  />
                  <BarRow
                    label="😐 중립 (장조)"
                    count={stats.sentimentCounts.neutral}
                    total={stats.total}
                    color="bg-slate-500"
                  />
                  <BarRow
                    label="🌙 부정 (단조)"
                    count={stats.sentimentCounts.negative}
                    total={stats.total}
                    color="bg-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* 자주 등장하는 음표 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Top 음표
              </p>
              <div className="space-y-2">
                {stats.topNotes.map(([note, count], i) => (
                  <div key={note} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-4 tabular-nums">
                      {i + 1}
                    </span>
                    <span className="text-sm font-mono text-white w-8">
                      {note}
                    </span>
                    <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 tabular-nums w-8 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3행: 리듬 분포 + 시간대 히트맵 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 리듬 분포 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                리듬 분포
              </p>
              <div className="space-y-2">
                {Object.entries(stats.rhythmCounts).map(([rhythm, count]) => (
                  <div key={rhythm} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-20">
                      {RHYTHM_LABELS[rhythm]}
                    </span>
                    <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{
                          width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 tabular-nums w-6 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 시간대별 히트맵 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                커밋 시간대
              </p>
              <div className="grid grid-cols-12 gap-1">
                {stats.hourly.map((count, hour) => {
                  const max = Math.max(...stats.hourly, 1);
                  const intensity = count / max;

                  return (
                    <div
                      key={hour}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full aspect-square rounded-sm transition-colors"
                        style={{
                          backgroundColor:
                            count > 0
                              ? `rgba(99, 102, 241, ${0.2 + intensity * 0.8})`
                              : "rgb(31, 41, 55)",
                        }}
                        title={`${hour}시: ${count}개`}
                      />
                      {hour % 3 === 0 && (
                        <span className="text-[8px] text-gray-600">{hour}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 요일별 바 */}
              <div className="flex items-end gap-2 h-12 mt-2">
                {stats.daily.map((count, day) => {
                  const max = Math.max(...stats.daily, 1);
                  const h = (count / max) * 100;

                  return (
                    <div
                      key={day}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full bg-indigo-500/60 rounded-sm transition-all"
                        style={{ height: `${Math.max(4, h)}%` }}
                      />
                      <span className="text-[9px] text-gray-600">
                        {DAY_LABELS[day]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4행: 가장 큰 커밋 */}
          {stats.biggestCommit && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                🏆 가장 큰 커밋
              </p>
              <p className="text-sm text-white truncate">
                {stats.biggestCommit.message.split("\n")[0]}
              </p>
              <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                <span>📁 {stats.biggestCommit.filesChanged} 파일</span>
                <span className="text-emerald-500">
                  +{stats.biggestCommit.additions}
                </span>
                <span className="text-rose-500">
                  -{stats.biggestCommit.deletions}
                </span>
                <span>🎹 {stats.biggestCommit.note}</span>
                <span>
                  {stats.biggestCommit.scale === "major"
                    ? "🌞 장조"
                    : "🌙 단조"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 핵심 수치 카드
 */
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-1">
      <p className="text-[10px] text-gray-600 uppercase tracking-wider">
        {icon} {label}
      </p>
      <p className="text-lg font-semibold text-white tabular-nums">{value}</p>
    </div>
  );
}

/**
 * 감정 분포 바 행
 */
function BarRow({ label, count, total, color }) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-400 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-gray-500 tabular-nums w-12 text-right">
        {count} ({percent}%)
      </span>
    </div>
  );
}

/**
 * 장조/단조 비율 링
 */
function MoodRing({ majorPercent }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (majorPercent / 100) * circumference;

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#34d399"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{majorPercent}%</span>
      </div>
    </div>
  );
}

export default StatsDashboard;
