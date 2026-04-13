const API_BASE = "https://api.github.com";

/**
 * GitHub API fetch 래퍼 (rate limit 처리 포함)
 */
async function githubFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (res.status === 403) {
    const reset = res.headers.get("x-ratelimit-reset");
    const resetDate = reset ? new Date(Number(reset) * 1000) : null;
    const waitMin = resetDate
      ? Math.ceil((resetDate - Date.now()) / 60000)
      : "약 60";
    throw new Error(
      `GitHub API 요청 한도 초과! ${waitMin}분 후 다시 시도해주세요.`,
    );
  }

  if (res.status === 404) {
    throw new Error("레포를 찾을 수 없습니다. 공개 레포인지 확인해주세요.");
  }

  if (!res.ok) {
    throw new Error(`GitHub API 오류: ${res.status}`);
  }

  return res.json();
}

/**
 * 레포 URL 또는 "owner/repo" 문자열에서 owner, repo 추출
 */
export function parseRepoInput(input) {
  const trimmed = input.trim();

  const urlMatch = trimmed.match(/github\.com\/([^/]+)\/([^/]+)/i);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, "") };
  }

  const slashMatch = trimmed.match(/^([^/]+)\/([^/]+)$/);
  if (slashMatch) {
    return { owner: slashMatch[1], repo: slashMatch[2] };
  }

  return null;
}

/**
 * 커밋 메시지에서 변경 규모를 추정
 */
function estimateChanges(message) {
  const lower = message.toLowerCase();

  if (/refactor|restructure|rewrite|overhaul|migration/i.test(lower)) {
    return {
      filesChanged: 15 + Math.floor(Math.random() * 20),
      additions: 200,
      deletions: 150,
    };
  }
  if (/init|initial|setup|scaffold|boilerplate/i.test(lower)) {
    return {
      filesChanged: 10 + Math.floor(Math.random() * 15),
      additions: 300,
      deletions: 0,
    };
  }
  if (/feat|add|implement|create|new|support/i.test(lower)) {
    return {
      filesChanged: 3 + Math.floor(Math.random() * 8),
      additions: 80,
      deletions: 10,
    };
  }
  if (/fix|bug|patch|hotfix|resolve/i.test(lower)) {
    return {
      filesChanged: 1 + Math.floor(Math.random() * 3),
      additions: 15,
      deletions: 10,
    };
  }
  if (/doc|readme|comment|style|css|typo/i.test(lower)) {
    return {
      filesChanged: 1 + Math.floor(Math.random() * 2),
      additions: 10,
      deletions: 5,
    };
  }
  if (/remove|delete|deprecate|drop/i.test(lower)) {
    return {
      filesChanged: 2 + Math.floor(Math.random() * 5),
      additions: 0,
      deletions: 60,
    };
  }

  return {
    filesChanged: 2 + Math.floor(Math.random() * 5),
    additions: 30,
    deletions: 15,
  };
}

/**
 * 커밋 목록 페칭 (API 1회 호출)
 */
export async function fetchCommitsWithDetails(owner, repo, options = {}) {
  const { perPage = 30, onProgress } = options;

  const data = await githubFetch(
    `/repos/${owner}/${repo}/commits?per_page=${perPage}`,
  );

  const commits = data.map((commit, index) => {
    const estimated = estimateChanges(commit.commit.message);

    if (onProgress) {
      onProgress({ current: index + 1, total: data.length });
    }

    return {
      sha: commit.sha,
      message: commit.commit.message,
      date: commit.commit.author.date,
      author: commit.commit.author.name,
      avatarUrl: commit.author?.avatar_url || null,
      htmlUrl: commit.html_url,
      filesChanged: estimated.filesChanged,
      additions: estimated.additions,
      deletions: estimated.deletions,
      files: [],
    };
  });

  return commits.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * 레포 기본 정보
 */
export async function fetchRepoInfo(owner, repo) {
  const data = await githubFetch(`/repos/${owner}/${repo}`);

  return {
    name: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    language: data.language,
    defaultBranch: data.default_branch,
  };
}

/**
 * 남은 API 호출 횟수 확인
 */
export async function checkRateLimit() {
  const res = await fetch(`${API_BASE}/rate_limit`);
  const data = await res.json();
  return {
    remaining: data.rate.remaining,
    limit: data.rate.limit,
    resetAt: new Date(data.rate.reset * 1000),
  };
}
