// "He Chose the Screen Over Her." — The M1nd Frame, episode 2. Lust vs love.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';

export const HER_NAME = 'Maya';

export type SceneId =
  | 'coldOpen'
  | 'couchLove'
  | 'kitchen'
  | 'parkWalk'
  | 'bedScroll'
  | 'feed'
  | 'dinner'
  | 'unread'
  | 'couchApart'
  | 'compare'
  | 'leaving'
  | 'empty'
  | 'phoneDown'
  | 'letter'
  | 'aloneWalk'
  | 'doorstep'
  | 'bench'
  | 'hands'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['coldOpen', 0, 7],
  ['couchLove', 7, 19],
  ['kitchen', 19, 30],
  ['parkWalk', 30, 41],
  ['bedScroll', 41, 54],
  ['feed', 54, 64],
  ['dinner', 64, 76],
  ['unread', 76, 88],
  ['couchApart', 88, 101],
  ['compare', 101, 112],
  ['leaving', 112, 127],
  ['empty', 127, 140],
  ['phoneDown', 140, 152],
  ['letter', 152, 160],
  ['aloneWalk', 160, 168],
  ['doorstep', 168, 177],
  ['bench', 177, 185],
  ['hands', 185, 191],
  ['endCard', 191, 196],
];

export const DURATION_SEC = 196;

export const CAPTIONS: Caption[] = [
  { from: 1.0, to: 3.6, text: 'He had someone real.', pos: 'center' },
  { from: 3.9, to: 6.6, text: 'And a screen that never said no.', pos: 'center' },
  { from: 8.5, to: 12.6, text: 'She laughed at his worst jokes.' },
  { from: 13.2, to: 18.2, text: "He'd never felt so seen." },
  { from: 20.4, to: 24.2, text: 'Love was small things.' },
  { from: 24.8, to: 29.4, text: 'Remembered. Repeated. Chosen.' },
  { from: 31.4, to: 35.6, text: 'It was slow. It asked for effort.' },
  { from: 36.2, to: 40.4, text: 'And it was worth it.' },
  { from: 42.6, to: 46.6, text: 'Then the screen got faster.' },
  { from: 47.2, to: 53.2, text: 'It asked for nothing. It never said no.' },
  { from: 55.0, to: 57.4, text: 'Just one more.', tone: 'voice' },
  { from: 60.4, to: 63.6, text: 'He swiped her away.' },
  { from: 65.6, to: 69.6, text: "She'd tell him about her day." },
  { from: 70.2, to: 75.4, text: "He'd nod without hearing a word." },
  { from: 77.6, to: 81.2, text: 'Her messages waited.' },
  { from: 81.8, to: 86.8, text: 'The feed never made him wait.' },
  { from: 89.6, to: 92.2, text: 'Same couch.' },
  { from: 92.8, to: 95.8, text: 'Different worlds.' },
  { from: 96.6, to: 100.4, text: 'She reached for him.' },
  { from: 102.4, to: 106.6, text: 'Real love started to feel slow.' },
  { from: 107.2, to: 111.4, text: 'Next to something built to never end.' },
  { from: 113.6, to: 118.2, text: 'She waited for him to look up.' },
  { from: 119.2, to: 121.8, text: "He didn't." },
  { from: 128.4, to: 131.8, text: 'The screen was still there.' },
  { from: 132.6, to: 135.4, text: "She wasn't." },
  { from: 136.2, to: 139.6, text: 'He finally looked up.' },
  { from: 141.8, to: 145.6, text: 'Lust takes your attention.' },
  { from: 146.4, to: 150.8, text: 'Love asks you to give it.' },
  { from: 153.4, to: 158.8, text: 'He wrote what he should have said.' },
  { from: 161.2, to: 166.6, text: 'He learned to be where he was.' },
  { from: 169.6, to: 173.0, text: 'No excuses this time.' },
  { from: 173.6, to: 176.6, text: 'Just his full attention.' },
  { from: 178.4, to: 181.4, text: "Love isn't found on a screen." },
  { from: 181.8, to: 184.8, text: "It's chosen. Every day." },
  { from: 185.6, to: 190.4, text: "Look up while they're still there." },
];

// Top-left: his daily screen time. Climbs while he drifts, falls once he looks up.
const st = (at: number, time: string | null, tone?: CounterKey['tone']): CounterKey => ({
  at,
  tone,
  text: time === null ? null : `SCREEN TIME  ${time}`,
});

export const COUNTER: CounterKey[] = [
  st(0, null),
  st(7, '0h 40m'),
  st(41, '2h 10m', 'red'),
  st(64, '3h 52m', 'red'),
  st(76, '4h 37m', 'red'),
  st(88, '5h 20m', 'red'),
  st(112, '6h 08m', 'red'),
  st(127, '6h 31m', 'red'),
  st(152, '2h 05m'),
  st(160, '1h 10m'),
  st(168, '0h 25m', 'amber'),
  st(191, null),
];

// Moments inside scenes, in seconds from the scene start. Shared by animation and sound.
export const BEATS = {
  couchLaugh: 2.2,
  kitchenOffer: 3.4,
  kitchenTaste: 4.6,
  feedBanner: 3.5,
  feedSwipe: 5.6,
  unreadMsgs: [1.4, 3.4, 5.4, 7.2, 8.6],
  unreadClear: 9.8,
  apartReach: 8.4,
  leavingTurn: 8.4,
  leavingDoor: 9.0,
  leavingShut: 12.6,
  emptyLower: 6.6,
  phoneFlip: 0.8,
  phoneBuzz: 3.4,
  knock: [2.2, 2.6],
  doorOpen: 3.8,
  handsTouch: 4.0,
};

export const SFX: Sfx[] = [
  { src: 'audio/sfx/frying.mp3', at: 19.3, volume: 0.22, dur: 10.4 },
  { src: 'audio/sfx/message-pop.mp3', at: 54 + BEATS.feedBanner, volume: 0.6 },
  { src: 'audio/sfx/whoosh.mp3', at: 54 + BEATS.feedSwipe - 0.1, volume: 0.35 },
  ...BEATS.unreadMsgs.map((t) => ({ src: 'audio/sfx/message-pop.mp3', at: 76 + t, volume: 0.45 })),
  { src: 'audio/sfx/whoosh.mp3', at: 76 + BEATS.unreadClear - 0.1, volume: 0.3 },
  { src: 'audio/sfx/door-close.mp3', at: 112 + BEATS.leavingShut - 1.2, volume: 0.8 },
  { src: 'audio/sfx/message-pop.mp3', at: 140 + BEATS.phoneBuzz, volume: 0.35 },
  { src: 'audio/sfx/whoosh.mp3', at: 151.6, volume: 0.3 },
  ...BEATS.knock.map((t) => ({ src: 'audio/sfx/knock.mp3', at: 168 + t - 0.05, volume: 0.7, dur: 0.6 })),
];

// Love theme → screen theme → silence → love theme returns.
export const MUSIC: Music[] = [
  { src: 'audio/music/skyline.mp3', from: 0, to: 44, fadeIn: 2, fadeOutFrom: 39, volume: 0.7 },
  { src: 'audio/music/ode-to-loneliness.mp3', from: 40, to: 141, fadeIn: 3, fadeOutFrom: 134, volume: 0.75 },
  { src: 'audio/music/skyline.mp3', from: 143, to: DURATION_SEC, fadeIn: 3, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.7 },
];
