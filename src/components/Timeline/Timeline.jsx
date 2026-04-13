import { useState, useRef, useEffect } from "react";

function Timeline({ musicData, currentIndex, onSeek }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 현재 재생 중인 아이템으로 자동 스크롤
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const active = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();

      if (
        activeRect.left < containerRect.left ||
        activeRect.right > containerRect.right
      ) {
        active.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  if (!musicData || musicData.length === 0) return null;

  const groups = groupByDate(musicData);
  const hoveredItem = hoveredIndex !== null ? musicData[hoveredIndex] : null;

  return (
    <div className="w-full max-w-4xl space-y-2">
      <h3 className="text-xs text-gray-500 uppercase tracking-wider px-1">
        Timeline
      </h3>

      {/* 가로 스크롤 타임라인 */}
      <div ref={containerRef} className="overflow-x-auto scrollbar-thin pb-2">
        <div className="flex gap-4 min-w-max px-1">
          {groups.map((group) => (
            <div key={group.date} className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-600 tabular-nums">
                {group.dateLabel}
              </span>

              <div className="flex gap-1 items-end">
                {group.commits.map((item) => {
                  const isActive = item.index === currentIndex;
                  const isPast = item.index < currentIndex;
                  const isHovered = item.index === hoveredIndex;

                  return (
                    <button
                      key={item.sha}
                      ref={isActive ? activeRef : null}
                      onClick={() => onSeek(item.index)}
                      onMouseEnter={() => setHoveredIndex(item.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`
                        relative rounded-sm transition-all duration-200 cursor-pointer
                        ${isActive || isHovered ? "opacity-100 scale-110" : isPast ? "opacity-60" : "opacity-40"}
                        hover:opacity-100
                      `}
                      style={{
                        width: `${barWidth(item)}px`,
                        height: `${barHeight(item)}px`,
                        backgroundColor: barColor(item, isActive),
                      }}
                    >
                      {isActive && (
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 호버/재생 정보 패널 */}
      <InfoPanel
        item={
          hoveredItem || (currentIndex >= 0 ? musicData[currentIndex] : null)
        }
      />

      {/* 범례 */}
      <div className="flex items-center gap-4 px-1 text-[10px] text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-emerald-500" /> 장조
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-rose-500" /> 단조
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-slate-500" /> 중립
        </span>
        <span className="text-gray-700">|</span>
        <span>높이 = 변경 규모 · 너비 = 파일 수</span>
      </div>
    </div>
  );
}

/**
 * 호버/재생 중인 커밋 정보 표시 패널
 */
function InfoPanel({ item }) {
  return (
    <div className="h-10 flex items-center px-2">
      {item ? (
        <div className="flex items-center gap-3 text-xs w-full">
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full ${
              item.scale === "major"
                ? "bg-emerald-900/50 text-emerald-400"
                : "bg-rose-900/50 text-rose-400"
            }`}
          >
            {item.scale === "major" ? "🌞" : "🌙"} {item.note}
          </span>
          <p className="text-gray-300 truncate">
            {item.message.split("\n")[0]}
          </p>
          <span className="shrink-0 text-gray-600 tabular-nums">
            📁 {item.filesChanged} · +{item.additions} -{item.deletions}
          </span>
        </div>
      ) : (
        <p className="text-xs text-gray-700">커밋 바에 마우스를 올려보세요</p>
      )}
    </div>
  );
}

function groupByDate(musicData) {
  const map = new Map();
  for (const item of musicData) {
    const d = new Date(item.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!map.has(key)) {
      map.set(key, {
        date: key,
        dateLabel: `${d.getMonth() + 1}/${d.getDate()}`,
        commits: [],
      });
    }
    map.get(key).commits.push(item);
  }
  return Array.from(map.values());
}

function barWidth(item) {
  const files = item.filesChanged || 1;
  return Math.min(24, Math.max(8, 6 + files * 1.2));
}

function barHeight(item) {
  const total = (item.additions || 0) + (item.deletions || 0);
  return Math.min(56, Math.max(16, 16 + Math.sqrt(total) * 2));
}

function barColor(item, isActive) {
  if (isActive) return "#818cf8";
  const label = item.sentiment?.label;
  if (label === "positive") return "#34d399";
  if (label === "negative") return "#fb7185";
  return "#94a3b8";
}

export default Timeline;
