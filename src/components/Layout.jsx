function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎵</span>
          <h1 className="text-xl font-bold tracking-tight">Commit Sounds</h1>
        </div>
        <p className="text-sm text-gray-500 hidden sm:block">
          Turn your git history into music
        </p>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* 푸터 */}
      <footer className="border-t border-gray-800 px-6 py-3 text-center text-xs text-gray-600">
        Made with 🥤 and 💙 by{" "}
        <a
          href="https://github.com/Dev-2A"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Dev-2A
        </a>
      </footer>
    </div>
  );
}

export default Layout;
