import { useState, useRef, useCallback, useEffect } from "react";
import {
  initAudio,
  playMusicEvent,
  stopAll,
  disposeAudio,
} from "../services/sound";

export function usePlayer(musicData) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [speed, setSpeed] = useState(1);
  const [audioReady, setAudioReady] = useState(false);

  const timerRef = useRef(null);
  const indexRef = useRef(-1);
  const speedRef = useRef(1);
  const dataRef = useRef(musicData);

  useEffect(() => {
    dataRef.current = musicData;
  }, [musicData]);

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
    (idx) => {
      const data = dataRef.current;
      if (!data || idx >= data.length) {
        setIsPlaying(false);
        setCurrentIndex(-1);
        indexRef.current = -1;
        return;
      }

      const event = data[idx];
      indexRef.current = idx;
      setCurrentIndex(idx);

      console.log(
        `▶ [${idx + 1}/${data.length}] ${event.note} ${event.rhythm} ${event.message.split("\n")[0].slice(0, 30)}`,
      );
      playMusicEvent(event);

      const delay = rhythmToMs(event.rhythm);
      timerRef.current = setTimeout(() => {
        playNext(idx + 1);
      }, delay);
    },
    [rhythmToMs],
  );

  const play = useCallback(async () => {
    const data = dataRef.current;
    if (!data || data.length === 0) return;

    try {
      if (!audioReady) {
        await initAudio();
        setAudioReady(true);
        // AudioContext 안정화 대기
        await new Promise((r) => setTimeout(r, 200));
      }

      setIsPlaying(true);
      const startIdx = indexRef.current >= 0 ? indexRef.current : 0;
      playNext(startIdx);
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
    setCurrentIndex(-1);
    indexRef.current = -1;
  }, []);

  const seekTo = useCallback(
    (index) => {
      const wasPlaying = isPlaying;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      stopAll();

      indexRef.current = index;
      setCurrentIndex(index);

      if (wasPlaying) {
        playNext(index);
      }
    },
    [isPlaying, playNext],
  );

  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
  }, []);

  return {
    isPlaying,
    currentIndex,
    speed,
    audioReady,
    play,
    pause,
    stop,
    seekTo,
    changeSpeed,
    totalCount: musicData?.length || 0,
  };
}
