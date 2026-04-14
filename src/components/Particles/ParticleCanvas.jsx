import { useRef, useEffect, useCallback } from "react";
import { PARTICLE_COLORS } from "../../constants/music";

const MAX_PARTICLES = 120;
const SPAWN_COUNT = 12; // 커밋당 생성 파티클 수

function ParticleCanvas({ currentIndex, musicData }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const prevIndexRef = useRef(-1);

  // 파티클 생성
  const spawnParticles = useCallback((item) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const sentiment = item.sentiment?.label || "neutral";
    const colors =
      PARTICLE_COLORS[sentiment.toUpperCase()] || PARTICLE_COLORS.NEUTRAL;
    const scale = item.scale;

    for (let i = 0; i < SPAWN_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / SPAWN_COUNT + Math.random() * 0.5;
      const speed = 1 + Math.random() * 3;
      const size = 2 + Math.random() * 4;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particlesRef.current.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color,
        alpha: 1,
        decay: 0.008 + Math.random() * 0.012,
        // 장조: 위로 퍼짐, 단조: 아래로 퍼짐
        gravity: scale === "major" ? -0.02 : 0.02,
        // 파일 수에 비례한 회전
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        // 모양: 장조=원, 단조=다이아몬드
        shape: scale === "major" ? "circle" : "diamond",
      });
    }

    // 파티클 수 제한
    if (particlesRef.current.length > MAX_PARTICLES) {
      particlesRef.current = particlesRef.current.slice(-MAX_PARTICLES);
    }
  }, []);

  // 새 커밋 재생 시 파티클 생성
  useEffect(() => {
    if (
      currentIndex >= 0 &&
      currentIndex !== prevIndexRef.current &&
      musicData?.[currentIndex]
    ) {
      spawnParticles(musicData[currentIndex]);
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex, musicData, spawnParticles]);

  // 애니메이션 루프
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // 잔상 효과
      ctx.fillStyle = "rgba(3, 7, 18, 0.15)";
      ctx.fillRect(0, 0, w, h);

      const alive = [];

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0) continue;
        alive.push(p);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;

        if (p.shape === "diamond") {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.7, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.7, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // 글로우 효과
        ctx.globalAlpha = p.alpha * 0.3;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      particlesRef.current = alive;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl h-36 sm:h-48 rounded-xl overflow-hidden bg-gray-950/80 border border-gray-800/50 backdrop-blur-sm">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* 현재 음표 표시 오버레이 */}
      {currentIndex >= 0 && musicData?.[currentIndex] && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-5xl font-bold text-white/10 select-none">
            {musicData[currentIndex].note}
          </span>
        </div>
      )}
    </div>
  );
}

export default ParticleCanvas;
