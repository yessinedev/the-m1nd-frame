// "Day 0." — 9:16 Short. Clips are cut from the episode (episode seconds); music is in Short seconds.
import type { Music } from '../../kit/Episode';
import { Clip, shortDuration } from '../../kit/Short';

export const HOOK = 'Why you always relapse on *Day 6*.';

export const CLIPS: Clip[] = [
  { from: 20.2, to: 25.4, cam: { x: 900, s: 1.35 } }, // Day 3 … Day 6 on the calendar
  { from: 32.0, to: 41.8, cam: { x: 470 } }, // the quiet night, "Just once."
  { from: 48.0, to: 53.0, cam: { x: 1250, y: 600, s: 1.2 } }, // the reach
  { from: 53.0, to: 60.8, cam: { x: 960, y: 540 } }, // DAY 1 → DAY 0
  { from: 80.0, to: 86.8, cam: { x: 600 } }, // again, and again
  { from: 116.6, to: 123.8, cam: { x: 480, y: 540, s: 1.4 } }, // Day 0 again… or Day 1?
  { from: 183.2, to: 191.0, cam: { x: 640, s: 1.2 } }, // Day 90: "It's where everyone starts."
];

export const SHORT_SEC = shortDuration(CLIPS);

// Same tracks as the film, at the same places in each track: dark until the turning point,
// near-silence under its heartbeats, the hopeful theme for the payoff.
export const SHORT_MUSIC: Music[] = [
  { src: 'audio/music/silent-descent.mp3', from: 0, to: 37.6, fadeIn: 0.3, fadeOutFrom: 34.8, volume: 0.85, trimBefore: 20.2 },
  { src: 'audio/music/discover.mp3', from: 41.6, to: SHORT_SEC, fadeIn: 0.8, fadeOutFrom: SHORT_SEC - 1.5, volume: 0.8, trimBefore: 55.2 },
];
