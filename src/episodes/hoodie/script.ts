// "The Hoodie She Left Behind." — The M1nd Frame, episode 4. Getting over a breakup.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';

export type SceneId =
  | 'coldOpen'
  | 'bedEmpty'
  | 'hoodieChair'
  | 'typing'
  | 'profile'
  | 'carNight'
  | 'memory'
  | 'friendsDoor'
  | 'hoodieSleep'
  | 'mirror'
  | 'rainWindow'
  | 'cookSelf'
  | 'cafe'
  | 'plant'
  | 'fold'
  | 'carDay'
  | 'walk'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['coldOpen', 0, 7],
  ['bedEmpty', 7, 19],
  ['hoodieChair', 19, 31],
  ['typing', 31, 44],
  ['profile', 44, 55],
  ['carNight', 55, 68],
  ['memory', 68, 82],
  ['friendsDoor', 82, 96],
  ['hoodieSleep', 96, 108],
  ['mirror', 108, 118],
  ['rainWindow', 118, 130],
  ['cookSelf', 130, 139],
  ['cafe', 139, 148],
  ['plant', 148, 157],
  ['fold', 157, 172],
  ['carDay', 172, 186],
  ['walk', 186, 194],
  ['endCard', 194, 200],
];

export const DURATION_SEC = 200;

export const CAPTIONS: Caption[] = [
  { from: 1.0, to: 3.6, text: 'She took everything with her.', pos: 'center' },
  { from: 3.9, to: 6.6, text: 'Except one hoodie.', pos: 'center' },
  { from: 8.4, to: 12.4, text: 'He still woke up reaching for her.' },
  { from: 13.0, to: 18.2, text: 'Her side of the bed stayed cold.' },
  { from: 20.4, to: 24.4, text: 'She left her hoodie on the chair.' },
  { from: 25.0, to: 30.4, text: 'It still smelled like her.' },
  { from: 32.4, to: 36.6, text: 'He typed it a hundred times.' },
  { from: 37.4, to: 43.0, text: 'He never sent it.' },
  { from: 45.4, to: 49.0, text: '2 AM. Her profile. Again.' },
  { from: 49.6, to: 54.6, text: 'She looked happy. That hurt the most.' },
  { from: 56.4, to: 60.4, text: 'Then their song came on.' },
  { from: 61.0, to: 67.0, text: "He couldn't make it to the chorus." },
  { from: 69.4, to: 74.6, text: 'He replayed the good days.' },
  { from: 75.4, to: 81.4, text: 'Never the reasons it ended.' },
  { from: 83.4, to: 87.6, text: 'His friends kept knocking.' },
  { from: 88.2, to: 95.0, text: 'He kept saying, "not tonight."' },
  { from: 97.4, to: 101.4, text: 'He slept holding the last piece of her.' },
  { from: 102.0, to: 107.4, text: 'As if it could bring her back.' },
  { from: 109.4, to: 113.0, text: 'He was waiting for her to come back.' },
  { from: 113.6, to: 117.6, text: "She wasn't coming back." },
  { from: 119.6, to: 123.6, text: "Healing doesn't feel like healing." },
  { from: 124.2, to: 129.6, text: 'It feels like one normal day.' },
  { from: 131.0, to: 138.4, text: 'He learned to cook for one.' },
  { from: 140.0, to: 147.4, text: 'He said yes to his friends again.' },
  { from: 149.0, to: 156.4, text: 'Some things grow back slowly.' },
  { from: 158.4, to: 163.4, text: "He didn't throw it away." },
  { from: 164.0, to: 171.0, text: 'He just stopped holding on to it.' },
  { from: 173.6, to: 177.4, text: 'Then their song came on again.' },
  { from: 178.4, to: 185.0, text: 'This time, he let it play.' },
  { from: 186.6, to: 189.6, text: "You don't get over it." },
  { from: 190.0, to: 193.6, text: 'You grow around it.' },
];

const day = (at: number, n: number | null, tone?: CounterKey['tone']): CounterKey => ({ at, tone, text: n === null ? null : `DAY ${n} WITHOUT HER` });

export const COUNTER: CounterKey[] = [
  day(0, null),
  day(7, 1),
  day(19, 2),
  day(31, 6),
  day(44, 9),
  day(55, 14),
  day(82, 19),
  day(96, 23),
  day(108, 31),
  day(118, 41),
  day(130, 52),
  day(139, 67),
  day(148, 80),
  day(157, 92),
  day(172, 120, 'amber'),
  day(194, null),
];

// Scene-local moments, seconds.
export const BEATS = {
  reach: [1.4, 3.2],
  pick: 2.0,
  smell: 4.0,
  // [text, start typing, fully typed, deleted]
  drafts: [
    ['i miss you', 0.8, 2.0, 3.2],
    ['can we talk?', 4.2, 5.6, 6.8],
    ["i hope you're okay", 7.8, 9.6, 11.0],
  ] as [string, number, number, number][],
  zoom: [4.0, 5.2],
  radioOn: 1.2,
  radioOff: 8.6,
  spin: 3.0,
  drain: [9.6, 11.4],
  knock: [0.8, 1.3],
  doorOpen: 2.0,
  doorShut: 10.4,
  rainStops: [5.0, 8.5],
  fold: [1.0, 7.0],
  intoBox: 8.0,
  tape: 10.6,
  reachRadio: 4.0,
  letPlay: 5.6,
};

export const SFX: Sfx[] = [
  ...BEATS.drafts.map(([, a]) => ({ src: 'audio/sfx/phone-typing.mp3', at: 31 + a, volume: 0.4, dur: 1.3 })),
  { src: 'audio/sfx/car-ambience.mp3', at: 55, volume: 0.25, dur: 13 },
  { src: 'audio/sfx/radio-static.mp3', at: 55 + BEATS.radioOn - 0.3, volume: 0.25 },
  { src: 'audio/sfx/radio-static.mp3', at: 55 + BEATS.radioOff, volume: 0.35 },
  ...BEATS.knock.map((t) => ({ src: 'audio/sfx/knock.mp3', at: 82 + t, volume: 0.7, dur: 0.6 })),
  { src: 'audio/sfx/door-close.mp3', at: 82 + BEATS.doorShut - 1.0, volume: 0.6 },
  { src: 'audio/sfx/rain.mp3', at: 118, volume: 0.35, dur: 8.5 },
  { src: 'audio/sfx/frying.mp3', at: 130.2, volume: 0.2, dur: 8.6 },
  { src: 'audio/sfx/tape.mp3', at: 157 + BEATS.tape, volume: 0.5 },
  { src: 'audio/sfx/car-ambience.mp3', at: 172, volume: 0.2, dur: 14 },
  { src: 'audio/sfx/radio-static.mp3', at: 172 + BEATS.radioOn - 0.3, volume: 0.2 },
];

// Piano grief → their song on the radio → piano → hopeful strings → their song again, kept.
export const MUSIC: Music[] = [
  { src: 'audio/music/classical-7-boosted.mp3', from: 0, to: 57.5, fadeIn: 2, fadeOutFrom: 55.6, volume: 0.8 },
  { src: 'audio/music/their-song-radio.mp3', from: 55 + BEATS.radioOn, to: 55 + BEATS.radioOff + 0.2, fadeIn: 0.4, fadeOutFrom: 55 + BEATS.radioOff, volume: 0.55 },
  { src: 'audio/music/classical-7-boosted.mp3', from: 64.2, to: 122, fadeIn: 2.5, fadeOutFrom: 118, volume: 0.8, trimBefore: 57 },
  { src: 'audio/music/classical-vibes-2.mp3', from: 119, to: 174, fadeIn: 3, fadeOutFrom: 172, volume: 0.7 },
  { src: 'audio/music/their-song-radio.mp3', from: 172 + BEATS.radioOn, to: 188, fadeIn: 0.6, fadeOutFrom: 185.6, volume: 0.7, trimBefore: 20 },
  { src: 'audio/music/classical-vibes-2.mp3', from: 185, to: DURATION_SEC, fadeIn: 2.5, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.7, trimBefore: 60 },
];
