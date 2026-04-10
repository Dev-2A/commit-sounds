// 음계 매핑 상수
export const NOTES = {
  MAJOR: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
  MINOR: ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"],
};

// 변경 파일 수 → 음높이 매핑 범위
export const PITCH_MAP = {
  MIN_FILES: 1,
  MAX_FILES: 50,
  MIN_INDEX: 0,
  MAX_INDEX: 7,
};

// 커밋 시간 → 리듬 매핑 (BPM 기반 노트 길이)
export const RHYTHM = {
  VERY_FAST: "16n", // 커밋 간격 < 10분
  FAST: "8n", // 10분 ~ 1시간
  NORMAL: "4n", // 1시간 ~ 4시간
  SLOW: "2n", // 4시간 ~ 1일
  VERY_SLOW: "1n", // 1일 이상
};

// 재생 속도 프리셋
export const SPEED_OPTIONS = [
  { label: "0.5x", value: 0.5 },
  { label: "1x", value: 1 },
  { label: "2x", value: 2 },
  { label: "4x", value: 4 },
];

// 파티클 색상 (감정별)
export const PARTICLE_COLORS = {
  POSITIVE: ["#4ade80", "#22d3ee", "#a78bfa", "#60a5fa"],
  NEGATIVE: ["#f87171", "#fb923c", "#fbbf24", "#e879f9"],
  NEUTRAL: ["#94a3b8", "#cbd5e1", "#e2e8f0", "#f1f5f9"],
};
