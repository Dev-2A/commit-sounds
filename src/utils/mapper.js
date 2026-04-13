import { NOTES, PITCH_MAP, RHYTHM } from "../constants/music";
import { analyzeCommitSentiment } from "./sentiment";

/**
 * 변경 파일 수 → 음계 인덱스 매핑
 */
function filesToPitchIndex(filesChanged) {
  const clamped = Math.max(
    PITCH_MAP.MIN_FILES,
    Math.min(PITCH_MAP.MAX_FILES, filesChanged),
  );
  const ratio =
    (clamped - PITCH_MAP.MAX_FILES) /
    (PITCH_MAP.MAX_FILES - PITCH_MAP.MIN_FILES);
  return Math.round(ratio * PITCH_MAP.MAX_INDEX);
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
 * @param {Array} commits - enriched 커밋 배열 (시간순 정렬)
 * @returns {Array} 음악 이벤트 배열
 */
export function mapCommitsToMusic(commits) {
  return commits.map((commit, index) => {
    // 감정 분석
    const sentiment = analyzeCommitSentiment(commit.message);

    // 음계 선택 (장조/단조)
    const scale = sentiment.mode === "minor" ? NOTES.MINOR : NOTES.MAJOR;

    // 변경 파일 수 → 음높이
    const pitchIndex = filesToPitchIndex(commit.filesChanged);
    const note = scale[pitchIndex];

    // 커밋 간격 → 리듬
    let rhythm = RHYTHM.NORMAL;
    if (index > 0) {
      const prevDate = new Date(commits[index - 1].date);
      const currDate = new Date(commit.date);
      const interval = currDate - prevDate;
      rhythm = intervalToRhythm(interval);
    }

    // 변경 규모 → 볼륨 (0.3 ~ 1.0)
    const totalChanges = commit.additions + commit.deletions;
    const volume = Math.min(1.0, Math.max(0.3, totalChanges / 500 + 0.3));

    return {
      index,
      sha: commit.sha,
      message: commit.message,
      date: commit.date,
      author: commit.author,
      avatarUrl: commit.avatarUrl,
      htmlUrl: commit.htmlUrl,
      filesChanged: commit.filesChanged,
      additions: commit.additions,
      deletions: commit.deletions,
      files: commit.files,
      // 음악 매핑 결과
      note,
      rhythm,
      volume,
      sentiment,
      scale: sentiment.mode,
    };
  });
}
