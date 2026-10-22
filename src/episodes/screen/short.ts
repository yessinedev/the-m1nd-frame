// "He Chose the Screen Over Her." — 9:16 Short. Clips are cut from the episode (episode seconds); music is in Short seconds.
import type { Music } from '../../kit/Episode';
import { Clip, shortDuration } from '../../kit/Short';

export const HOOK = 'He chose the *screen* over her.';

export const CLIPS: Clip[] = [
  { from: 8.2, to: 12.8, cam: { x: 960 } }, // she laughed at his worst jokes
  { from: 55.0, to: 63.8, cam: { x: 960, y: 540, s: 1.15 } }, // "Just one more." — he swipes her away
  { from: 89.4, to: 95.9, cam: { x: 990 } }, // same couch, different worlds
  { from: 113.6, to: 121.9, cam: { x: 1000, s: 1.11 } }, // she waited for him to look up
  { from: 132.6, to: 139.6, cam: { x: 1050 } }, // she wasn't. He finally looked up.
  { from: 141.6, to: 150.9, cam: { x: 880, y: 620, s: 1.2, push: 0.15 } }, // lust takes, love gives
  { from: 185.4, to: 190.6, cam: { x: 930, y: 618, s: 1.11 } }, // hands: look up while they're still there
];

export const SHORT_SEC = shortDuration(CLIPS);

// Love theme for the opening beat, the screen theme through the fall, the love theme once he looks up.
export const SHORT_MUSIC: Music[] = [
  { src: 'audio/music/skyline.mp3', from: 0, to: 5.4, fadeIn: 0.3, fadeOutFrom: 3.8, volume: 0.7, trimBefore: 8.2 },
  { src: 'audio/music/ode-to-loneliness.mp3', from: 4.0, to: 35.6, fadeIn: 1, fadeOutFrom: 33.4, volume: 0.75, trimBefore: 15 },
  { src: 'audio/music/skyline.mp3', from: 35.4, to: SHORT_SEC, fadeIn: 1.2, fadeOutFrom: SHORT_SEC - 1.5, volume: 0.7, trimBefore: 3 }, // skip the track's silent intro
];
