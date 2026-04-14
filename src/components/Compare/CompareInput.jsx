import { useState } from "react";

function CompareInput({ onSubmit, loading }) {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [perPage, setPerPage] = useState(20);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputA.trim() || !inputB.trim() || loading) return;
    onSubmit(inputA.trim(), inputB.trim(), { perPage });
  };

  return (
    <div className="w-full max-w-lg space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 레포 A */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
            A
          </span>
          <input
            type="text"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            placeholder="첫 번째 레포 (예: facebook/react)"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors"
          />
        </div>

        {/* VS 구분선 */}
        <div className="flex items-center gap-3 px-8">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-600 font-bold">VS</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* 레포 B */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
            B
          </span>
          <input
            type="text"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            placeholder="두 번째 레포 (예: vuejs/core)"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 disabled:opacity-50 transition-colors"
          />
        </div>

        {/* 커밋 수 + 버튼 */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[10, 20, 30].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPerPage(n)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  perPage === n
                    ? "bg-gray-700 text-white"
                    : "bg-gray-900 text-gray-500 hover:bg-gray-800"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || !inputA.trim() || !inputB.trim()}
            className="flex-1 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium text-sm transition-colors"
          >
            {loading ? "분석 중..." : "🎵 비교 재생"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompareInput;
