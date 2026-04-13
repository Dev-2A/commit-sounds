import {
  POSITIVE_KEYWORDS,
  NEGATIVE_KEYWORDS,
  SENTIMENT_THRESHOLD,
} from "../constants/sentiment";

/**
 * 커밋 메시지의 감정 점수를 계산
 * @param {string} message - 커밋 메시지
 * @returns {number} -1.0 ~ 1.0 사이의 감정 점수
 */
export function analyzeSentiment(message) {
  const lower = message.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  for (const keyword of POSITIVE_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      positiveCount++;
    }
  }

  for (const keyword of NEGATIVE_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      negativeCount++;
    }
  }

  const total = positiveCount + negativeCount;
  if (total === 0) return 0;

  return (positiveCount - negativeCount) / total;
}

/**
 * 감정 점수를 기반으로 음악 모드 결정
 * @param {number} score - 감정 점수
 * @returns {'major' | 'minor'} 장조 또는 단조
 */
export function getMusicalMode(score) {
  if (score <= SENTIMENT_THRESHOLD.NEGATIVE) return "minor";
  return "major";
}

/**
 * 감정 점수를 라벨로 변환
 * @param {number} score
 * @returns {'positive' | 'negative' | 'neutral'}
 */
export function getSentimentLabel(score) {
  if (score >= SENTIMENT_THRESHOLD.POSITIVE) return "positive";
  if (score <= SENTIMENT_THRESHOLD.NEGATIVE) return "negative";
  return "neutral";
}

/**
 * 커밋 메시지를 분석해 감정 + 모드 정보를 반환
 * @param {string} message
 * @returns {{ score: number, label: string, mode: string }}
 */
export function analyzeCommitSentiment(message) {
  const score = analyzeSentiment(message);
  return {
    score,
    label: getSentimentLabel(score),
    mode: getMusicalMode(score),
  };
}
