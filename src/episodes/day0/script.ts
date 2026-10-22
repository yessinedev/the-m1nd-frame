// "Day 0." — The M1nd Frame, episode 1.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.

import type { Caption, CounterKey, CounterTone, Music, Sfx } from '../../kit/Episode';

export { f, FPS } from '../../kit/time';

export type SceneId =
  | 'coldOpen'
  | 'bedDay1'
  | 'calendar'
  | 'temptation'
  | 'reach'
  | 'reset'
  | 'aftermath'
  | 'snooze'
  | 'loopNights'
  | 'deskStuck'
  | 'mirrorDim'
  | 'turningPoint'
  | 'morning'
  | 'run'
  | 'bag'
  | 'deskFocus'
  | 'urge'
  | 'bench'
  | 'mirrorClear'
  | 'payoff'
  | 'endCard';

// [id, start, end] in seconds. Scenes butt up against each other; each fades itself.
export const SCENES: [SceneId, number, number][] = [
  ['coldOpen', 0, 7],
  ['bedDay1', 7, 19],
  ['calendar', 19, 31],
  ['temptation', 31, 45],
  ['reach', 45, 53],
  ['reset', 53, 62],
  ['aftermath', 62, 74],
  ['snooze', 74, 79],
  ['loopNights', 79, 92],
  ['deskStuck', 92, 100],
  ['mirrorDim', 100, 112],
  ['turningPoint', 112, 132],
  ['morning', 132, 142],
  ['run', 142, 148],
  ['bag', 148, 154],
  ['deskFocus', 154, 161],
  ['urge', 161, 170],
  ['bench', 170, 176],
  ['mirrorClear', 176, 182],
  ['payoff', 182, 191],
  ['endCard', 191, 196],
];

export const DURATION_SEC = 196;

export const CAPTIONS: Caption[] = [
  { from: 1.0, to: 3.6, text: 'He made the same promise again.', pos: 'center' },
  { from: 3.9, to: 6.6, text: 'This time would be different.', pos: 'center' },
  { from: 8.5, to: 12.3, text: 'Day 1 always feels easy.' },
  { from: 13.0, to: 18.3, text: 'He left the phone on the nightstand.' },
  { from: 20.0, to: 24.5, text: 'Day 3. Day 4. Day 5.' },
  { from: 25.3, to: 30.2, text: 'He felt lighter.' },
  { from: 32.0, to: 35.6, text: 'Then came a quiet night.' },
  { from: 37.0, to: 42.0, text: 'Just once. Nobody would know.', tone: 'voice' },
  { from: 56.5, to: 60.6, text: 'Back to zero.' },
  { from: 63.0, to: 67.2, text: 'The rush lasted minutes.' },
  { from: 68.0, to: 73.4, text: 'The guilt stayed for days.' },
  { from: 80.0, to: 82.4, text: 'Again.' },
  { from: 84.2, to: 86.6, text: 'And again.' },
  { from: 88.0, to: 91.4, text: "Until it wasn't a choice anymore." },
  { from: 93.5, to: 99.3, text: 'He stopped finishing things.' },
  { from: 101.5, to: 105.7, text: 'He stopped looking himself in the eye.' },
  { from: 106.5, to: 111.3, text: "It didn't even feel good anymore." },
  { from: 116.8, to: 119.8, text: 'Day 0 again...' },
  { from: 120.4, to: 123.6, text: '...or Day 1?' },
  { from: 127.0, to: 131.4, text: 'He sat with the urge until it passed.' },
  { from: 134.0, to: 136.8, text: 'Day 1. Again.' },
  { from: 137.4, to: 141.2, text: 'This time, he filled the empty hours.' },
  { from: 143.5, to: 147.4, text: 'Morning runs instead of midnight scrolling.' },
  { from: 149.0, to: 153.4, text: 'He gave the restlessness somewhere to go.' },
  { from: 155.5, to: 160.4, text: 'He finished what he started.' },
  { from: 162.2, to: 165.4, text: 'The urge still came.' },
  { from: 166.0, to: 169.6, text: 'He just stopped obeying it.' },
  { from: 171.0, to: 175.4, text: 'He could look people in the eye again.' },
  { from: 177.4, to: 181.4, text: 'Even himself.' },
  { from: 183.4, to: 186.6, text: "Day 0 isn't failure." },
  { from: 187.2, to: 190.6, text: "It's where everyone starts." },
];

// Top-left day counter. `value: null` hides it. Zero after a relapse is shown in red.
type DayKey = { at: number; value: number | null; tone?: CounterTone };

const DAYS: DayKey[] = [
  { at: 0.4, value: 0 },
  { at: 7.0, value: 1 },
  { at: 19.0, value: 2 },
  { at: 20.5, value: 3 },
  { at: 22.0, value: 4 },
  { at: 23.5, value: 5 },
  { at: 25.0, value: 6 },
  { at: 53.0, value: null }, // the reset scene draws its own big counter
  { at: 62.0, value: 0, tone: 'red' },
  { at: 81.0, value: 3 },
  { at: 82.6, value: 0, tone: 'red' },
  { at: 84.0, value: 1 },
  { at: 85.6, value: 0, tone: 'red' },
  { at: 87.0, value: 5 },
  { at: 88.6, value: 0, tone: 'red' },
  { at: 131.6, value: null },
  { at: 132.0, value: 1 },
  { at: 142.0, value: 7 },
  { at: 148.0, value: 14 },
  { at: 154.0, value: 30 },
  { at: 161.0, value: 45 },
  { at: 170.0, value: 60 },
  { at: 176.0, value: 90, tone: 'amber' },
  { at: 191.0, value: null },
];

export const COUNTER: CounterKey[] = DAYS.map(({ at, value, tone }) => ({ at, tone, text: value === null ? null : `DAY ${value}` }));

// Moments inside scenes, in seconds from the scene start. Shared by animation and sound.
export const BEATS = {
  calendarMarks: [0.0, 1.5, 3.0, 4.5, 6.0], // Xs for days 2–6, in sync with COUNTER
  temptationBuzz: 2.0,
  reachGrab: 6.6,
  resetRoll: 1.4,
  resetLand: 2.0,
  snoozeSlap: 2.6,
  loopFlips: [2.0, 3.6, 5.0, 6.6, 8.0, 9.6], // abs 81.0 … 88.6
  turnBuzz: 1.0,
  turnReachStop: 3.4,
  turnGrab: 10.0,
  turnDrawerOpen: 11.0,
  turnDrawerShut: 14.0,
  bagHits: [1.2, 2.4, 3.6],
  urgeBuzz: 1.2,
  urgePocket: 4.8,
  payoffFive: 2.5,
};

// Absolute seconds. Files live in public/audio (Mixkit Free License).
export const SFX: Sfx[] = [
  { src: 'audio/sfx/message-pop.mp3', at: 31 + BEATS.temptationBuzz, volume: 0.7 },
  ...[46.4, 47.5, 48.5, 49.4, 50.2, 50.9, 51.5, 52.0].map((at) => ({ src: 'audio/sfx/heartbeat.mp3', at, volume: 0.9 })),
  { src: 'audio/sfx/punch.mp3', at: 53 + BEATS.resetLand, volume: 0.55 },
  { src: 'audio/sfx/alarm.mp3', at: 74.1, volume: 0.45, dur: BEATS.snoozeSlap - 0.1 },
  { src: 'audio/sfx/punch.mp3', at: 74 + BEATS.snoozeSlap, volume: 0.35 },
  { src: 'audio/sfx/message-pop.mp3', at: 112 + BEATS.turnBuzz, volume: 0.7 },
  ...[115.6, 116.6, 117.6, 118.6, 119.7, 120.9, 122.2].map((at) => ({ src: 'audio/sfx/heartbeat.mp3', at, volume: 0.85 })),
  { src: 'audio/sfx/whoosh.mp3', at: 141.4, volume: 0.5 },
  ...BEATS.bagHits.map((t) => ({ src: 'audio/sfx/punch.mp3', at: 148 + t - 0.05, volume: 0.75 })),
  { src: 'audio/sfx/message-pop.mp3', at: 161 + BEATS.urgeBuzz, volume: 0.55 },
  { src: 'audio/sfx/whoosh.mp3', at: 175.6, volume: 0.4 },
  { src: 'audio/sfx/alarm.mp3', at: 182 + BEATS.payoffFive, volume: 0.35, dur: 0.7 },
];

// Two-part score: melancholic first half, hopeful second half, with near-silence at the turning point.
export const MUSIC: Music[] = [
  { src: 'audio/music/silent-descent.mp3', from: 0, to: 125, fadeIn: 2, fadeOutFrom: 111, volume: 0.85 },
  { src: 'audio/music/discover.mp3', from: 128, to: DURATION_SEC, fadeIn: 1.5, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.8 },
];
