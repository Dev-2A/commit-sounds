/**
 * 커밋 음악 데이터에서 통계 추출
 */
export function calcCommitStats(musicData) {
  if (!musicData || musicData.length === 0) return null;

  const total = musicData.length;

  // 감정 분포
  const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
  musicData.forEach((m) => {
    sentimentCounts[m.sentiment.label]++;
  });

  // 장조/단조 비율
  const majorCount = musicData.filter((m) => m.scale === "major").length;
  const minorCount = total - majorCount;

  // 음표 빈도
  const noteFreq = {};
  musicData.forEach((m) => {
    noteFreq[m.note] = (noteFreq[m.note] || 0) + 1;
  });
  const topNotes = Object.entries(noteFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 리듬 분포
  const rhythmCounts = { "16n": 0, "8n": 0, "4n": 0, "2n": 0, "1n": 0 };
  musicData.forEach((m) => {
    if (rhythmCounts[m.rhythm] !== undefined) rhythmCounts[m.rhythm]++;
  });

  // 시간대별 커밋 분포 (0~23시)
  const hourly = new Array(24).fill(0);
  musicData.forEach((m) => {
    const hour = new Date(m.date).getHours();
    hourly[hour]++;
  });

  // 요일별 커밋 분포
  const daily = new Array(7).fill(0);
  musicData.forEach((m) => {
    const day = new Date(m.date).getDay();
    daily[day]++;
  });

  // 변경 규모 통계
  const totalAdditions = musicData.reduce((s, m) => s + (m.additions || 0), 0);
  const totalDeletions = musicData.reduce((s, m) => s + (m.deletions || 0), 0);
  const totalFiles = musicData.reduce((s, m) => s + (m.filesChanged || 0), 0);
  const avgAdditions = Math.round(totalAdditions / total);
  const avgDeletions = Math.round(totalDeletions / total);

  // 가장 큰 커밋
  const biggestCommit = [...musicData].sort(
    (a, b) => b.additions + b.deletions - (a.additions + a.deletions),
  )[0];

  // 활동 기간
  const firstDate = new Date(musicData[0].date);
  const lastDate = new Date(musicData[musicData.length - 1].date);
  const spanDays = Math.max(
    1,
    Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)),
  );

  return {
    total,
    sentimentCounts,
    majorCount,
    minorCount,
    topNotes,
    rhythmCounts,
    hourly,
    daily,
    totalAdditions,
    totalDeletions,
    totalFiles,
    avgAdditions,
    avgDeletions,
    biggestCommit,
    firstDate,
    lastDate,
    spanDays,
  };
}
