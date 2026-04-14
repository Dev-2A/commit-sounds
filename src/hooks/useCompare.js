import { useState, useRef, useCallback, useEffect } from "react";
import {
  initAudio,
  playMusicEvent,
  stopAll,
  disposeAudio,
} from "../services/sound";

export function useCompare(musicDataA, musicDataB) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [indexA, setIndexA] = useState(-1);
  const [indexB, setIndexB] = useState(-1);
  const [speed, setSpeed] = useState(1);
  const [audioReady, setAudioReady] = useState(false);

  const timerRef = useRef(null);
  const idxARef = useRef(-1);
  const idxBRef = useRef(-1);
  const speedRef = useRef(1);
  const dataARef = useRef(musicDataA);
  const dataBRef = useRef(musicDataB);

  useEffect(() => {
    dataARef.current = musicDataA;
  }, [musicDataA]);
  useEffect(() => {
    dataBRef.current = musicDataB;
  }, [musicDataB]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      disposeAudio();
    };
  }, []);

  const rhythmToMs = useCallback((rhythm) => {
    const base = {
      "16n": 125,
      "8n": 250,
      "4n": 500,
      "2n": 1000,
      "1n": 2000,
    };
    return (base[rhythm] || 500) / speedRef.current;
  }, []);

  const playNext = useCallback(
    (iA, iB) => {
      const dA = dataARef.current;
      const dB = dataBRef.current;
      const doneA = !dA || iA >= dA.length;
      const doneB = !dB || iB >= dB.length;

      if (doneA && doneB) {
        setIsPlaying(false);
        setIndexA(-1);
        setIndexB(-1);
        idxARef.current = -1;
        idxBRef.current = -1;
        return;
      }

      // 현재 재생할 이벤트
      const eventA = !doneA ? dA[iA] : null;
      const eventB = !doneB ? dB[iB] : null;

      // 인덱스 업데이트
      if (eventA) {
        idxARef.current = iA;
        setIndexA(iA);
      }
      if (eventB) {
        idxBRef.current = iB;
        setIndexB(iB);
      }

      // 동시 재생
      if (eventA) playMusicEvent(eventA, "A");
      if (eventB) playMusicEvent(eventB, "B");

      // 다음 스텝 딜레이 (두 이벤트 중 짧은 쪽 기준)
      const delayA = eventA ? rhythmToMs(eventA.rhythm) : Infinity;
      const delayB = eventB ? rhythmToMs(eventB.rhythm) : Infinity;
      const delay = Math.min(delayA, delayB);

      timerRef.current = setTimeout(() => {
        playNext(doneA ? iA : iA + 1, doneB ? iB : iB + 1);
      }, delay);
    },
    [rhythmToMs],
  );

  const play = useCallback(async () => {
    const dA = dataARef.current;
    const dB = dataBRef.current;
    if ((!dA || dA.length === 0) && (!dB || dB.length === 0)) return;

    try {
      if (!audioReady) {
        await initAudio();
        setAudioReady(true);
        await new Promise((r) => setTimeout(r, 200));
      }

      setIsPlaying(true);
      const startA = idxARef.current >= 0 ? idxARef.current : 0;
      const startB = idxBRef.current >= 0 ? idxBRef.current : 0;
      playNext(startA, startB);
    } catch (err) {
      console.error("🔇 Audio init failed:", err);
    }
  }, [audioReady, playNext]);

  const pause = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopAll();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopAll();
    setIsPlaying(false);
    setIndexA(-1);
    setIndexB(-1);
    idxARef.current = -1;
    idxBRef.current = -1;
  }, []);

  const changeSpeed = useCallback((v) => setSpeed(v), []);

  return {
    isPlaying,
    indexA,
    indexB,
    speed,
    audioReady,
    play,
    pause,
    stop,
    changeSpeed,
    totalA: musicDataA?.length || 0,
    totalB: musicDataB?.length || 0,
  };
}
