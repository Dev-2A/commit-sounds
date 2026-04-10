import { useState, useCallback } from "react";
import {
  parseRepoInput,
  fetchCommitsWithDetails,
  fetchRepoInfo,
} from "../services/github";

export function useCommits() {
  const [commits, setCommits] = useState([]);
  const [repoInfo, setRepoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const loadCommits = useCallback(async (input, options = {}) => {
    const parsed = parseRepoInput(input);
    if (!parsed) {
      setError("올바른 레포 형식이 아닙니다. (예: owner/repo)");
      return;
    }

    setLoading(true);
    setError(null);
    setCommits([]);
    setRepoInfo(null);
    setProgress({ current: 0, total: 0 });

    try {
      // 레포 정보
      const info = await fetchRepoInfo(parsed.owner, parsed.repo);
      setRepoInfo(info);

      // 커밋 + 상세 정보
      const data = await fetchCommitsWithDetails(parsed.owner, parsed.repo, {
        perPage: options.perPage || 30,
        onProgress: setProgress,
      });

      setCommits(data);
    } catch (err) {
      if (err.status === 404) {
        setError("레포를 찾을 수 없습니다. 공개 레포인지 확인해주세요.");
      } else if (err.status === 403) {
        setError(
          "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
        );
      } else {
        setError(
          err.message || "커밋 데이터를 불러오는 중 오류가 발생했습니다.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCommits([]);
    setRepoInfo(null);
    setLoading(false);
    setError(null);
    setProgress({ current: 0, total: 0 });
  }, []);

  return {
    commits,
    repoInfo,
    loading,
    error,
    progress,
    loadCommits,
    reset,
  };
}
