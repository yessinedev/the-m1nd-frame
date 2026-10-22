import { Easing, interpolate, random } from 'remotion';
import { FPS } from './time';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Tween `from`→`to` between two times in seconds (scene-local), eased.
export const tween = (frame: number, t0: number, t1: number, from: number, to: number, easing = EASE_IN_OUT) =>
  interpolate(frame, [t0 * FPS, t1 * FPS], [from, to], { ...clamp, easing });

// Piecewise keyframes: times in seconds, eased between each pair.
export const keys = (frame: number, times: number[], values: number[], easing = EASE_IN_OUT) =>
  interpolate(frame, times.map((t) => t * FPS), values, { ...clamp, easing });

// Scene-level fade from/to black.
export const sceneFade = (frame: number, dur: number, inF = 12, outF = 12) =>
  Math.min(
    inF > 0 ? interpolate(frame, [0, inF], [0, 1], clamp) : 1,
    outF > 0 ? interpolate(frame, [dur - outF, dur], [1, 0], clamp) : 1,
  );

// Smooth pseudo-noise for trembles and camera shake.
export const wobble = (frame: number, seed: number, speed = 0.35) =>
  Math.sin(frame * speed + seed) * 0.6 + Math.sin(frame * speed * 2.3 + seed * 3.1) * 0.4;

export const jitter = (frame: number, seed: string) => random(`${seed}-${frame}`) * 2 - 1;

// Eyes blink for ~4 frames roughly every 3.5 s; `offset` desyncs characters.
export const blink = (frame: number, offset = 0) => {
  const p = (frame + offset) % 105;
  return p < 4 ? [1, 0.25, 0.1, 0.5][p] : 1;
};
