// "She Lived in His Head Rent-Free." — The M1nd Frame, episode 7. A crush that ate his focus.
// The lesson: she isn't the distraction, the "maybe" is. He asks, she kindly says no, he takes it
// with grace, and gets his head back. Respectful to her throughout.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';

export const HER = { variant: 'nora' as const, name: 'Nora' };

export type SceneId =
  | 'coldOpen'
  | 'library'
  | 'daydream'
  | 'status'
  | 'analyse'
  | 'route'
  | 'slipping'
  | 'friends'
  | 'typing'
  | 'realize'
  | 'decide'
  | 'approach'
  | 'answer'
  | 'walkOut'
  | 'lifeBack'
  | 'final'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['coldOpen', 0, 7],
  ['library', 7, 19],
  ['daydream', 19, 31],
  ['status', 31, 44],
  ['analyse', 44, 56],
  ['route', 56, 68],
  ['slipping', 68, 82],
  ['friends', 82, 96],
  ['typing', 96, 110],
  ['realize', 110, 124],
  ['decide', 124, 134],
  ['approach', 134, 148],
  ['answer', 148, 160],
  ['walkOut', 160, 172],
  ['lifeBack', 172, 186],
  ['final', 186, 194],
  ['endCard', 194, 200],
];

export const DURATION_SEC = 200;

export const CAPTIONS: Caption[] = [
  { from: 1.0, to: 3.6, text: 'She said hi to him once.', pos: 'center' },
  { from: 3.9, to: 6.6, text: 'He thought about it for three months.', pos: 'center' },
  { from: 9.0, to: 10.6, text: '"hi!"', tone: 'quote' },
  { from: 11.2, to: 14.6, text: 'It was just a hi.' },
  { from: 15.2, to: 18.6, text: 'His brain turned it into a whole movie.' },
  { from: 20.4, to: 24.6, text: "He rehearsed conversations they'd never have." },
  { from: 25.2, to: 30.0, text: 'In his head, he was always smooth.' },
  { from: 32.4, to: 36.4, text: 'He checked if she was online.' },
  { from: 37.0, to: 40.0, text: 'Again.' },
  { from: 40.6, to: 43.6, text: 'And again.' },
  { from: 45.4, to: 49.6, text: '"haha yeah see u tmrw"', tone: 'quote' },
  { from: 50.2, to: 55.4, text: '"What did she mean by haha?"', tone: 'voice' },
  { from: 57.4, to: 61.6, text: 'He walked the long way, just to pass her café.' },
  { from: 62.2, to: 67.4, text: 'She was never there. He went anyway.' },
  { from: 69.4, to: 73.4, text: 'His assignments waited.' },
  { from: 74.0, to: 81.4, text: "His gym bag hadn't moved in weeks." },
  { from: 83.4, to: 87.4, text: 'His friends were right there.' },
  { from: 88.0, to: 95.4, text: 'His mind was somewhere else. Always.' },
  { from: 97.4, to: 101.4, text: 'She was typing…' },
  { from: 102.0, to: 104.6, text: "Then she wasn't." },
  { from: 105.2, to: 109.6, text: 'He lost sleep over three dots.' },
  { from: 111.4, to: 116.6, text: '94 days. His whole life, built around a maybe.' },
  { from: 117.2, to: 123.4, text: "She wasn't the distraction. The maybe was." },
  { from: 125.4, to: 129.6, text: 'He decided to end the maybe.' },
  { from: 130.2, to: 133.6, text: 'Ask her. Then let it go.' },
  { from: 136.4, to: 140.6, text: 'His heart was louder than the café.' },
  { from: 141.4, to: 147.0, text: '"Hey. Want to get coffee sometime?"', tone: 'quote' },
  { from: 149.4, to: 153.6, text: '"That\'s sweet, but I\'m seeing someone."', tone: 'quote' },
  { from: 154.4, to: 159.4, text: '"Oh. Okay. Glad I asked."', tone: 'quote' },
  { from: 161.4, to: 165.4, text: 'It took 30 seconds.' },
  { from: 166.0, to: 171.4, text: 'The no hurt less than the maybe.' },
  { from: 173.4, to: 177.6, text: 'And just like that, his head was his again.' },
  { from: 178.2, to: 185.4, text: 'Gym. Grades. Friends. All of him, back.' },
  { from: 186.6, to: 189.8, text: "Don't let a maybe live in your head." },
  { from: 190.2, to: 193.8, text: 'Ask. Then get your life back.' },
];

// Scene-local moments, seconds.
export const BEATS = {
  hi: 2.0,
  pop: 10.6,
  refresh: [1.0, 2.6, 4.0, 5.4, 6.8, 8.2, 9.6, 11.0],
  highlight: 6.2,
  typingOn: [1.0, 6.0],
  calendar: 1.0,
  note: [2.0, 5.0],
  walkIn: [0.4, 4.0],
  ask: 7.4,
  herTalk: [1.4, 5.4],
  himTalk: [6.4, 10.4],
};

const checked = (at: number, n: number, tone?: CounterKey['tone']): CounterKey => ({ at, tone, text: `STATUS CHECKS: ${n}` });

export const COUNTER: CounterKey[] = [
  { at: 0, text: null },
  checked(7, 3),
  ...BEATS.refresh.map((t, i) => checked(31 + t, [12, 24, 47, 63, 88, 101, 112, 126][i], i >= 3 ? 'red' : undefined)),
  checked(56, 140, 'red'),
  checked(82, 167, 'red'),
  checked(96, 212, 'red'),
  checked(124, 212),
  checked(160.4, 0, 'amber'),
  { at: 194, text: null },
];

export const SFX: Sfx[] = [
  { src: 'audio/sfx/bubble-pop.mp3', at: 19 + BEATS.pop, volume: 0.5 },
  ...BEATS.refresh.map((t) => ({ src: 'audio/sfx/mouse-click.mp3', at: 31 + t, volume: 0.4 })),
  { src: 'audio/sfx/message-pop.mp3', at: 44.6, volume: 0.4 },
  { src: 'audio/sfx/door-bell.mp3', at: 134.3, volume: 0.3, dur: 2 },
  { src: 'audio/sfx/cafe-ambience.mp3', at: 134, volume: 0.2, dur: 26 },
  ...[136.2, 137.1, 137.9, 138.6, 139.2, 139.8].map((at) => ({ src: 'audio/sfx/heartbeat.mp3', at, volume: 0.7 })),
  { src: 'audio/sfx/door-bell.mp3', at: 160.6, volume: 0.3, dur: 2 },
];

// Dreamy acoustic → night-time overthinking → near-silence for the ask → lift-off after the no.
export const MUSIC: Music[] = [
  { src: 'audio/music/happy-home.mp3', from: 0, to: 32, fadeIn: 2, fadeOutFrom: 29.6, volume: 0.6 },
  { src: 'audio/music/night-sky.mp3', from: 30, to: 134, fadeIn: 3, fadeOutFrom: 128, volume: 0.5 },
  { src: 'audio/music/raising-me-higher.mp3', from: 160.4, to: DURATION_SEC, fadeIn: 1.5, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.45 },
];
