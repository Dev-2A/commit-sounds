import * as Tone from "tone";

let synthA = null;
let synthB = null;
let isInitialized = false;

/**
 * Tone.js 오디오 컨텍스트 초기화 (듀얼 채널)
 */
export async function initAudio() {
  if (isInitialized) return;

  await Tone.start();
  console.log("🔊 AudioContext state:", Tone.getContext().state);

  // Synth A: 왼쪽 패닝, triangle
  const panA = new Tone.Panner(-0.5).toDestination();
  synthA = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.4,
      release: 1.0,
    },
  }).connect(panA);

  // Synth B: 오른쪽 패닝, square (비교 시 구별)
  const panB = new Tone.Panner(0.5).toDestination();
  synthB = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.3,
      release: 0.8,
    },
    volume: -10,
  }).connect(panB);

  isInitialized = true;
  console.log("🎹 Dual synths ready");
}

/**
 * 채널별 음 재생
 * @param {'A' | 'B'} channel
 */
export function playNote(note, duration = "4n", channel = "A") {
  const synth = channel === "B" ? synthB : synthA;

  if (!synth || !isInitialized) {
    console.warn("⚠️ Synth not ready");
    return;
  }

  if (!note) return;

  synth.triggerAttackRelease(note, duration, Tone.now() + 0.05);
}

/**
 * 음악 이벤트 재생 (채널 지정)
 */
export function playMusicEvent(event, channel = "A") {
  playNote(event.note, event.rhythm, channel);
}

/**
 * 모든 음 정지
 */
export function stopAll() {
  if (synthA) synthA.triggerRelase();
  if (synthB) synthB.triggerRelase();
}

/**
 * 오디오 리소스 정리
 */
export function disposeAudio() {
  if (synthA) {
    synthA.dispose();
    synthA = null;
  }
  if (synthB) {
    synthB.dispose();
    synthB = null;
  }
  isInitialized = false;
}

/**
 * 초기화 상태 확인
 */
export function isAudioReady() {
  return isInitialized;
}
