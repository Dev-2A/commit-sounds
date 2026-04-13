import { NOTES, PITCH_MAP, RHYTHM } from "../constants/music";
import { analyzeCommitSentiment } from "./sentiment";

/**
 * 변경 파일 수 → 음계 인덱스 매핑
 */
function filesToPitchIndex(filesChanged) {
  const files = filesChanged || 1;
  const clamped = Math.max(
    PITCH_MAP.MIN_FILES,
    Math.min(PITCH_MAP.MAX_FILES, files),
  );
  const ratio =
    (clamped - PITCH_MAP.MIN_FILES) /
    (PITCH_MAP.MAX_FILES - PITCH_MAP.MIN_FILES);
  return Math.min(Math.round(ratio * PITCH_MAP.MAX_INDEX), PITCH_MAP.MAX_INDEX);
}

/**
 * 두 커밋 사이의 시간 간격 → 음표 길이 매핑
 */
function intervalToRhythm(intervalMs) {
  const minutes = intervalMs / (1000 * 60);

  if (minutes < 10) return RHYTHM.VERY_FAST;
  if (minutes < 60) return RHYTHM.FAST;
  if (minutes < 240) return RHYTHM.NORMAL;
  if (minutes < 1440) return RHYTHM.SLOW;
  return RHYTHM.VERY_SLOW;
}

/**
 * 커밋 배열을 음악 데이터로 변환
 */
export function mapCommitsToMusic(commits) {
  if (!commits || commits.length === 0) return [];

  return commits.map((commit, index) => {
    const sentiment = analyzeCommitSentiment(commit.message);

    const scale = sentiment.mode === "minor" ? NOTES.MINOR : NOTES.MAJOR;
    const pitchIndex = filesToPitchIndex(commit.filesChanged);
    const note = scale[pitchIndex] || "C4"; // fallback

    let rhythm = RHYTHM.NORMAL;
    if (index > 0) {
      const prevDate = new Date(commits[index - 1].date);
      const currDate = new Date(commit.date);
      const interval = currDate - prevDate;
      rhythm = intervalToRhythm(interval);
    }

    const totalChanges = (commit.additions || 0) + (commit.deletions || 0);
    const volume = Math.min(1.0, Math.max(0.3, totalChanges / 500 + 0.3));

    return {
      index,
      sha: commit.sha,
      message: commit.message,
      date: commit.date,
      author: commit.author,
      avatarUrl: commit.avatarUrl,
      htmlUrl: commit.htmlUrl,
      filesChanged: commit.filesChanged || 0,
      additions: commit.additions || 0,
      deletions: commit.deletions || 0,
      files: commit.files || [],
      note,
      rhythm,
      volume,
      sentiment,
      scale: sentiment.mode,
    };
  });
}
