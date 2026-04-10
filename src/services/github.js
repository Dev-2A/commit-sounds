import { Octokit } from "octokit";

const octokit = new Octokit();

/**
 * 레포 URL 또는 "owner/repo" 문자열에서 owner, repo 추출
 */
export function parseRepoInput(input) {
  const trimmed = input.trim();

  // https://github.com/owner/repo 형태
  const urlMatch = trimmed.match(/github\.com\/([^/]+)\/([^/]+)/i);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, "") };
  }

  // owner/repo 형태
  const slashMatch = trimmed.match(/^([^/]+)\/([^/]+)$/);
  if (slashMatch) {
    return { owner: slashMatch[1], repo: slashMatch[2] };
  }

  return null;
}

/**
 * 커밋 목록 페칭 (최대 100개, 페이지네이션 가능)
 */
export async function fetchCommits(owner, repo, options = {}) {
  const { perPage = 100, page = 1 } = options;

  const response = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: perPage,
    page,
  });

  return response.data.map((commit) => ({
    sha: commit.sha,
    message: commit.commit.message,
    date: commit.commit.author.date,
    author: commit.commit.author.name,
    avatarUrl: commit.author?.avatar_url || null,
    htmlUrl: commit.html_url,
  }));
}

/**
 * 단일 커밋 상세 정보 (변경 파일 수, additions, deletions)
 */
export async function fetchCommitDetail(owner, repo, sha) {
  const response = await octokit.rest.repos.getCommit({
    owner,
    repo,
    ref: sha,
  });

  const { files, stats } = response.data;

  return {
    filesChanged: files?.length || 0,
    additions: stats?.additions || 0,
    deletions: stats?.deletions || 0,
    files: (files || []).map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
    })),
  };
}

/**
 * 커밋 목록 + 상세 정보를 한번에 가져오기
 * (rate limit 고려해 순차 처리 + 딜레이)
 */
export async function fetchCommitsWithDetails(owner, repo, options = {}) {
  const { perPage = 30, onProgress } = options;

  // 1. 커밋 목록 가져오기
  const commits = await fetchCommits(owner, repo, { perPage });

  // 2. 각 커밋의 상세 정보 순차 페칭
  const enriched = [];

  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];

    try {
      const detail = await fetchCommitDetail(owner, repo, commit.sha);
      enriched.push({ ...commit, ...detail });
    } catch {
      // rate limit 등 에러 시 기본값
      enriched.push({
        ...commit,
        filesChanged: 1,
        additions: 0,
        deletions: 0,
        files: [],
      });
    }

    // 진행률 콜백
    if (onProgress) {
      onProgress({ current: i + 1, total: commits.length });
    }

    // rate limit 방지 딜레이 (100ms)
    if (i < commits.length - 1) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  // 3. 시간순 정렬 (오래된 것 → 최신)
  return enriched.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * 레포 기본 정보 가져오기
 */
export async function fetchRepoInfo(owner, repo) {
  const response = await octokit.rest.repos.get({ owner, repo });

  return {
    name: response.data.full_name,
    description: response.data.description,
    stars: response.data.stargazers_count,
    language: response.data.language,
    defaultBranch: response.data.default_branch,
  };
}
