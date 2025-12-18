import { Audio } from "expo-av";

type Station = { id: string; name: string; streamUrl: string };

let sound: Audio.Sound | null = null;
let active: Station | null = null;
let isPlaying = false;

let initialized = false;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return { sound, active, isPlaying };
}

export async function initAudioMode() {
  if (initialized) return;
  initialized = true;

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}

export async function playStation(station: Station) {
  await initAudioMode();

  // stop previous
  if (sound) {
    await sound.stopAsync().catch(() => {});
    await sound.unloadAsync().catch(() => {});
    sound = null;
  }

  const created = await Audio.Sound.createAsync(
    { uri: station.streamUrl },
    { shouldPlay: true }
  );

  sound = created.sound;
  active = station;
  isPlaying = true;
  notify();
}

export async function togglePause() {
  if (!sound) return;

  if (isPlaying) {
    await sound.pauseAsync().catch(() => {});
    isPlaying = false;
  } else {
    await sound.playAsync().catch(() => {});
    isPlaying = true;
  }

  notify();
}

export async function stop() {
  if (sound) {
    await sound.stopAsync().catch(() => {});
    await sound.unloadAsync().catch(() => {});
  }
  sound = null;
  active = null;
  isPlaying = false;
  notify();
}