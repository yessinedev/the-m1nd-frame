// "She Wore the Same Shoes for 6 Years." — The M1nd Frame, episode 12. A mother's quiet sacrifice.
// Hook-first: frame 0 is a split close-up, his brand-new sneakers coming out of the box on the left,
// her taped, split shoes on the right, HER SHOES: 6 YEARS OLD already up. The open question is why,
// and the answer is in her notebook at 1:39: "New shoes — next month", crossed out for six years.
// The ending mirrors the hook: a new pair coming out of a box, and this time they're hers.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';

export type SceneId =
  | 'hook'
  | 'door'
  | 'ask'
  | 'rain'
  | 'glue'
  | 'rack'
  | 'leave'
  | 'notice'
  | 'memory'
  | 'ledger'
  | 'paycheck'
  | 'give'
  | 'walk'
  | 'shelf'
  | 'final'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['hook', 0, 5],
  ['door', 5, 13],
  ['ask', 13, 25],
  ['rain', 25, 37],
  ['glue', 37, 49],
  ['rack', 49, 61],
  ['leave', 61, 73],
  ['notice', 73, 85],
  ['memory', 85, 99],
  ['ledger', 99, 111],
  ['paycheck', 111, 125],
  ['give', 125, 143],
  ['walk', 143, 158],
  ['shelf', 158, 172],
  ['final', 172, 194],
  ['endCard', 194, 200],
];

export const DURATION_SEC = 200;

// Moments inside scenes, in seconds from the scene start. Shared by animation and sound.
export const BEATS = {
  lift: 0.5, // his sneakers rise out of the box
  runPast: [0.6, 3.6] as [number, number],
  give: 7.2, // she hands him the money
  splash: 5.4,
  glueDone: 5.6,
  wrap: 7.4,
  rackYears: [0, 2, 4, 6, 8, 10],
  hugAt: 4.4,
  carOff: 7.6,
  pickUp: 3.4,
  memories: [0, 4.6, 9.2],
  ledgerLines: [0.6, 1.8, 3.0, 4.2, 5.4, 6.6],
  pay: 1.0,
  pickBox: 7.6,
  boxOpen: 2.4,
  protest: 4.6,
  kneel: 9.6,
  spin: 6.0,
};

export const CAPTIONS: Caption[] = [
  { from: 0.2, to: 2.2, text: 'His new sneakers.', pos: 'top' },
  { from: 2.4, to: 4.9, text: 'Her shoes. Six years old.', pos: 'top' },

  { from: 5.5, to: 8.8, text: "He was 15. He didn't notice." },
  { from: 9.2, to: 12.6, text: 'Nobody does, at 15.' },

  { from: 13.6, to: 17.6, text: '"Mom, everyone has them."', tone: 'quote' },
  { from: 18.2, to: 24.4, text: 'She never said no. She just said "okay."' },

  { from: 25.6, to: 29.6, text: 'She walked to work. The bus cost money.' },
  { from: 30.2, to: 36.4, text: 'The rain came in through the left shoe.' },

  { from: 37.6, to: 41.6, text: 'At night, she glued them back together.' },
  { from: 42.2, to: 48.4, text: 'Then she wrapped his birthday present.' },

  { from: 49.6, to: 53.6, text: 'His shoes changed every year.' },
  { from: 54.2, to: 60.4, text: 'Hers never did.' },

  { from: 61.6, to: 65.6, text: 'At 18, he left for university.' },
  { from: 66.2, to: 72.4, text: 'She waved until the car was gone.' },

  { from: 73.6, to: 77.6, text: 'At 21, he came home for a weekend.' },
  { from: 78.2, to: 84.4, text: 'This time, he noticed.' },

  { from: 85.6, to: 89.4, text: 'Every "okay."' },
  { from: 90.2, to: 94.0, text: 'Every walk in the rain.' },
  { from: 94.8, to: 98.6, text: 'Every pair of his.' },

  { from: 99.6, to: 103.4, text: 'In the kitchen drawer: her notebook.' },
  { from: 104.0, to: 110.6, text: '"New shoes, next month." Crossed out. For six years.' },

  { from: 111.6, to: 115.6, text: 'His first paycheck came a month later.' },
  { from: 116.2, to: 124.4, text: 'He knew exactly what to buy.' },

  { from: 128.0, to: 131.4, text: '"These are too expensive!"', tone: 'quote' },
  { from: 132.0, to: 135.6, text: '"Not for you, Mom."', tone: 'quote' },
  { from: 136.2, to: 142.4, text: 'He put them on her himself.' },

  { from: 143.6, to: 147.6, text: 'She wore them everywhere.' },
  { from: 148.2, to: 157.4, text: 'She told every neighbour who bought them.' },

  { from: 158.6, to: 162.6, text: 'He kept the old pair.' },
  { from: 163.2, to: 171.4, text: "On his shelf, where he'd see them every day." },

  { from: 172.6, to: 176.6, text: "Look at your mom's shoes." },
  { from: 177.2, to: 181.6, text: 'Then look at yours.' },
  { from: 182.2, to: 193.4, text: "Some sacrifices don't make a sound." },
];

const age = (at: number, y: number, tone?: CounterKey['tone']): CounterKey => ({ at, tone, text: `HER SHOES: ${y} YEAR${y === 1 ? '' : 'S'} OLD` });

export const COUNTER: CounterKey[] = [
  age(0, 6, 'red'),
  age(5, 1),
  age(37, 2),
  ...BEATS.rackYears.slice(1).map((t, i) => age(49 + t, [2, 3, 3, 4, 4][i], i >= 3 ? 'red' : undefined)),
  age(61, 4, 'red'),
  age(73, 6, 'red'),
  { at: 99, tone: 'red', text: 'HER SHOES: 6 YEARS OLD' },
  { at: 111 + BEATS.pay, tone: 'amber', text: 'FIRST PAYCHECK: $1,240' },
  { at: 125 + BEATS.boxOpen, tone: 'amber', text: 'HER SHOES: 0 DAYS OLD' },
  { at: 158, text: null },
];

export const SFX: Sfx[] = [
  { src: 'audio/sfx/whoosh.mp3', at: 0, volume: 0.5 },
  { src: 'audio/sfx/shutter.mp3', at: BEATS.lift, volume: 0.4 },
  { src: 'audio/sfx/door-close.mp3', at: 5 + BEATS.runPast[1] - 0.2, volume: 0.6 },
  { src: 'audio/sfx/frying.mp3', at: 13, volume: 0.12, dur: 12 },
  { src: 'audio/sfx/rain.mp3', at: 25, volume: 0.35, dur: 12 },
  { src: 'audio/sfx/jump-water.mp3', at: 25 + BEATS.splash, volume: 0.25 },
  { src: 'audio/sfx/crickets.mp3', at: 37, volume: 0.1, dur: 12 },
  { src: 'audio/sfx/car-ambience.mp3', at: 61 + BEATS.carOff - 1, volume: 0.3, dur: 5 },
  { src: 'audio/sfx/door-close.mp3', at: 73.4, volume: 0.4 },
  ...BEATS.ledgerLines.map((t) => ({ src: 'audio/sfx/mouse-click.mp3', at: 99 + t + 0.6, volume: 0.15 })),
  { src: 'audio/sfx/message-pop.mp3', at: 111 + BEATS.pay, volume: 0.5 },
  { src: 'audio/sfx/door-bell.mp3', at: 111 + 5, volume: 0.25, dur: 2.5 },
  { src: 'audio/sfx/whoosh.mp3', at: 125 + BEATS.boxOpen - 0.1, volume: 0.35 },
];

// Gentle piano for the years → quiet strings for the realisation → warm lift from the paycheck on.
export const MUSIC: Music[] = [
  { src: 'audio/music/piano-reflections.mp3', from: 0, to: 74, fadeIn: 0.3, fadeOutFrom: 71, volume: 0.5 },
  { src: 'audio/music/ode-to-loneliness.mp3', from: 72.6, to: 112, fadeIn: 2, fadeOutFrom: 109, volume: 0.5 },
  { src: 'audio/music/tears-of-joy.mp3', from: 110.6, to: DURATION_SEC, fadeIn: 2, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.55 },
];
