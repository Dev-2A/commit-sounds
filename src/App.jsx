import Layout from "./components/Layout";

function App() {
  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">🎵</p>
          <h2 className="text-2xl font-semibold text-gray-300">
            GitHub 레포를 입력하면 커밋이 음악이 됩니다
          </h2>
          <p className="text-gray-500">
            커밋 시간 → 리듬 · 변경 파일 수 → 음높이 · 커밋 감정 → 장조/단조
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default App;
