import * as Tone from "tone";

let synth = null;
let isInitialized = false;

/**
 * Tone.js 오디오 컨텍스트 초기화
 */
export async function initAudio() {
  if (isInitialized) return;

  await Tone.start();
  console.log("🔊 AudioContext state:", Tone.getContext().state);

  synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.4,
      release: 1.0,
    },
  }).toDestination();

  isInitialized = true;
  console.log("🎹 Synth ready");
}

/**
 * 단일 음 재생
 */
export function playNote(note, duration = "4n") {
  if (!synth || !isInitialized) {
    console.warn("⚠️ Synth not ready");
    return;
  }

  if (!note) {
    console.warn("⚠️ Note is undefined, skipping");
    return;
  }

  console.log(`🎵 Playing: ${note} (${duration})`);
  synth.triggerAttackRelease(note, duration, Tone.now() + 0.05);
}

/**
 * 음악 이벤트 하나를 재생
 */
export function playMusicEvent(event) {
  playNote(event.note, event.rhythm);
}

/**
 * 모든 음 정지
 */
export function stopAll() {
  if (synth) {
    synth.triggerRelease();
  }
}

/**
 * 오디오 리소스 정리
 */
export function disposeAudio() {
  if (synth) {
    synth.dispose();
    synth = null;
  }
  isInitialized = false;
}

/**
 * 초기화 상태 확인
 */
export function isAudioReady() {
  return isInitialized;
}
