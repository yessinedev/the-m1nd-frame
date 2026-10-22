// "He Locked His Phone Away for 90 Days." — The M1nd Frame, episode 11. Getting your attention back.
// Hook-first: frame 0 is his hand over an open drawer, the phone still lit, DAY 1 / 90 on screen.
// The phone drops, the drawer shuts, the key turns: click. The open questions are the experiment
// itself (what happens to him?) and day 90 (does he unlock it, and what's waiting?). Not a relapse
// story like episode 1: it's what comes back when the feed is gone.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';

export type SceneId =
  | 'hook'
  | 'why'
  | 'reach'
  | 'bored'
  | 'sleep'
  | 'book'
  | 'plans'
  | 'hard'
  | 'guitar'
  | 'eve'
  | 'unlock'
  | 'mattered'
  | 'delete'
  | 'after'
  | 'final'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['hook', 0, 5],
  ['why', 5, 13],
  ['reach', 13, 25],
  ['bored', 25, 37],
  ['sleep', 37, 49],
  ['book', 49, 61],
  ['plans', 61, 75],
  ['hard', 75, 89],
  ['guitar', 89, 103],
  ['eve', 103, 115],
  ['unlock', 115, 131],
  ['mattered', 131, 145],
  ['delete', 145, 161],
  ['after', 161, 176],
  ['final', 176, 194],
  ['endCard', 194, 200],
];

export const DURATION_SEC = 200;

// Moments inside scenes, in seconds from the scene start. Shared by animation and sound.
export const BEATS = {
  drop: 0.7, // hand lets go
  shut: 1.3, // drawer closed
  key: 1.9, // key turns: click
  reaches: [0.8, 2.2, 3.4, 4.8, 6.0, 7.4, 8.6, 9.8, 10.8],
  pageTurns: [1.5, 3.5, 5.5, 7.5, 9.0],
  shake: [2.0, 9.0] as [number, number], // the key trembling in his hand
  keyBack: 9.6,
  unlockKey: 1.0,
  powerOn: 3.6,
  flood: [4.4, 9.0] as [number, number],
  removes: [1.2, 2.0, 2.8, 3.6, 4.4, 5.2, 6.0, 6.8],
  parts: [0, 5, 10],
};

export const CAPTIONS: Caption[] = [
  { from: 0.2, to: 1.8, text: 'He locked his phone away.', pos: 'top' },
  { from: 2.1, to: 4.8, text: 'For 90 days.', pos: 'top' },

  { from: 5.4, to: 8.6, text: 'The night before, he saw this.' },
  { from: 9.0, to: 12.6, text: '11 hours a day. Most of his waking life.' },

  { from: 13.6, to: 17.6, text: 'Day 1. His hand kept reaching for it.' },
  { from: 18.2, to: 24.4, text: '23 times before lunch.' },

  { from: 25.6, to: 29.6, text: 'Day 3. Boredom felt like pain.' },
  { from: 30.2, to: 36.4, text: 'Everyone around him was somewhere else.' },

  { from: 37.6, to: 41.6, text: 'Day 7. He fell asleep before midnight.' },
  { from: 42.2, to: 48.4, text: "He hadn't done that in four years." },

  { from: 49.6, to: 53.6, text: 'Day 14. He finished a book.' },
  { from: 54.2, to: 60.4, text: 'His first since school.' },

  { from: 61.6, to: 65.6, text: 'Day 30. He made plans the old way.' },
  { from: 66.2, to: 69.6, text: '"Saturday. 10. Same café."', tone: 'quote' },
  { from: 70.0, to: 74.4, text: 'Nobody was late. Nobody looked down.' },

  { from: 75.6, to: 79.0, text: 'Day 45. The hardest night.' },
  { from: 79.6, to: 82.8, text: 'Just five minutes.', tone: 'voice' },
  { from: 85.0, to: 88.6, text: 'He put the key back.' },

  { from: 89.6, to: 93.6, text: 'Day 60. His hands needed something to do.' },
  { from: 94.2, to: 102.4, text: 'So he gave them something.' },

  { from: 103.6, to: 107.0, text: 'Day 89.' },
  { from: 107.4, to: 110.8, text: 'Tomorrow, he could open it.' },
  { from: 111.2, to: 114.6, text: "He wasn't sure he wanted to." },

  { from: 115.6, to: 118.6, text: 'Day 90.' },
  { from: 122.6, to: 126.0, text: '2,341 notifications.', pos: 'top' },
  { from: 126.6, to: 130.6, text: 'He read every single one.', pos: 'top' },

  { from: 131.6, to: 135.6, text: 'Sales. Likes. Updates. Arguments.', pos: 'top' },
  { from: 136.2, to: 140.0, text: 'Not one of them mattered.', pos: 'top' },
  { from: 140.4, to: 144.6, text: 'The people who mattered had already found him.', pos: 'top' },

  { from: 145.6, to: 149.6, text: "He didn't lock it away again.", pos: 'top' },
  { from: 150.2, to: 156.4, text: 'He deleted everything that had been using him.', pos: 'top' },

  { from: 161.6, to: 165.6, text: 'Screen time now: 48 minutes a day.' },
  { from: 166.2, to: 175.4, text: 'Everything else, he got back.' },

  { from: 176.6, to: 180.6, text: "You don't need 90 days." },
  { from: 181.2, to: 185.6, text: 'Try one.' },
  { from: 186.2, to: 193.4, text: 'Put it in a drawer tonight.' },
];

const day = (at: number, d: number, tone?: CounterKey['tone']): CounterKey => ({ at, tone, text: `DAY ${d} / 90` });

export const COUNTER: CounterKey[] = [
  day(0, 1),
  ...BEATS.reaches.map((t, i) => ({ at: 13 + t, tone: 'red' as const, text: `DAY 1 · REACHED FOR IT: ${[2, 5, 8, 11, 13, 16, 18, 21, 23][i]}` })),
  day(25, 3, 'red'),
  day(37, 7),
  day(49, 14),
  day(61, 30, 'amber'),
  day(75, 45, 'red'),
  day(89, 60, 'amber'),
  day(103, 89),
  day(115, 90, 'amber'),
  { at: 115 + BEATS.flood[0], tone: 'red', text: 'NOTIFICATIONS: 2,341' },
  { at: 136, tone: 'amber', text: 'THAT MATTERED: 0' },
  { at: 145, text: 'APPS: 41' },
  ...BEATS.removes.map((t, i) => ({ at: 145 + t, tone: 'amber' as const, text: `APPS: ${[36, 31, 25, 19, 14, 10, 8, 6][i]}` })),
  { at: 161, tone: 'amber', text: 'SCREEN TIME: 48m / DAY' },
  { at: 176, text: null },
];

export const SFX: Sfx[] = [
  { src: 'audio/sfx/message-pop.mp3', at: 0, volume: 0.55 },
  { src: 'audio/sfx/whoosh.mp3', at: BEATS.drop, volume: 0.35 },
  { src: 'audio/sfx/door-close.mp3', at: BEATS.shut - 0.15, volume: 0.45 },
  { src: 'audio/sfx/shutter.mp3', at: BEATS.key, volume: 0.9 },
  { src: 'audio/sfx/mouse-click.mp3', at: BEATS.key + 0.05, volume: 0.8 },
  ...BEATS.reaches.map((t) => ({ src: 'audio/sfx/mouse-click.mp3', at: 13 + t, volume: 0.2 })),
  { src: 'audio/sfx/car-ambience.mp3', at: 25, volume: 0.15, dur: 12 },
  { src: 'audio/sfx/crickets.mp3', at: 37, volume: 0.12, dur: 6 },
  ...BEATS.pageTurns.map((t) => ({ src: 'audio/sfx/whoosh.mp3', at: 49 + t, volume: 0.12 })),
  { src: 'audio/sfx/cafe-ambience.mp3', at: 61, volume: 0.18, dur: 14 },
  { src: 'audio/sfx/teens-laugh.mp3', at: 70.2, volume: 0.12, dur: 4 },
  ...[1.2, 1.9, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0].map((t) => ({ src: 'audio/sfx/heartbeat.mp3', at: 75 + t, volume: 0.5 })),
  { src: 'audio/sfx/shutter.mp3', at: 115 + BEATS.unlockKey, volume: 0.9 },
  { src: 'audio/sfx/login.mp3', at: 115 + BEATS.powerOn, volume: 0.4 },
  ...Array.from({ length: 14 }).map((_, i) => ({ src: 'audio/sfx/message-pop.mp3', at: 115 + BEATS.flood[0] + i * 0.32, volume: 0.25 + (i % 3) * 0.08 })),
  ...BEATS.removes.map((t) => ({ src: 'audio/sfx/bubble-pop.mp3', at: 145 + t, volume: 0.45 })),
];

// Tense for the lock → lonely withdrawal → light as things come back → near-silence and heartbeat for
// day 45 → warm for day 60 → wide and uneasy for day 90 → lift-off from the deletions to the end.
export const MUSIC: Music[] = [
  { src: 'audio/music/silent-descent.mp3', from: 0, to: 14, fadeIn: 0.2, fadeOutFrom: 12.4, volume: 0.45 },
  { src: 'audio/music/night-sky.mp3', from: 12.6, to: 50, fadeIn: 2, fadeOutFrom: 47, volume: 0.45 },
  { src: 'audio/music/happy-home.mp3', from: 48.6, to: 76, fadeIn: 2, fadeOutFrom: 73.6, volume: 0.45 },
  { src: 'audio/music/classical-vibes-2.mp3', from: 88.6, to: 116, fadeIn: 2, fadeOutFrom: 113, volume: 0.45 },
  { src: 'audio/music/vastness.mp3', from: 115, to: 146, fadeIn: 2, fadeOutFrom: 143, volume: 0.45 },
  { src: 'audio/music/raising-me-higher.mp3', from: 144.6, to: DURATION_SEC, fadeIn: 2, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.5 },
];
