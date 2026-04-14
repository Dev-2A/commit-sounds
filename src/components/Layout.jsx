function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-indigo-950/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-purple-950/10 rounded-full blur-3xl" />
      </div>

      {/* 헤더 */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm bg-gray-950/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">🎵</span>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                Commit Sounds
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">
                Turn your git history into music
              </p>
            </div>
          </div>
          <a
            href="https://github.com/Dev-2A/commit-sounds"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-800 hover:border-gray-600"
          >
            <GithubIcon />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="relative z-10 flex-1 flex flex-col">{children}</main>

      {/* 푸터 */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-gray-950/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-gray-600">
          <span>
            Made with 🥤 and 💙 by{" "}
            <a
              href="https://github.com/Dev-2A"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dev-2A
            </a>
          </span>
          <span className="text-gray-700">Data Sonification</span>
        </div>
      </footer>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default Layout;
