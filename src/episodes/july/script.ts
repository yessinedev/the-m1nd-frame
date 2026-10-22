// "He Wore a Hoodie in July." — The M1nd Frame, episode 6. Body shame, and learning to stop hiding.
// Deliberately NOT a transformation story: his body never changes; how he speaks to it does.
// No weights, sizes, food or diet talk anywhere in the film.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';

export const BUILD = 1.5; // his body, the whole film
export const TEE = '#C9A15A';

export type SceneId =
  | 'coldOpen'
  | 'heatStreet'
  | 'hallway'
  | 'mirror'
  | 'photoTag'
  | 'poolInvite'
  | 'fittingRoom'
  | 'voices'
  | 'stairs'
  | 'feed'
  | 'mirrorAgain'
  | 'walks'
  | 'hoodieOff'
  | 'poolEdge'
  | 'jump'
  | 'sunset'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['coldOpen', 0, 7],
  ['heatStreet', 7, 19],
  ['hallway', 19, 32],
  ['mirror', 32, 44],
  ['photoTag', 44, 56],
  ['poolInvite', 56, 69],
  ['fittingRoom', 69, 83],
  ['voices', 83, 97],
  ['stairs', 97, 111],
  ['feed', 111, 124],
  ['mirrorAgain', 124, 136],
  ['walks', 136, 146],
  ['hoodieOff', 146, 158],
  ['poolEdge', 158, 170],
  ['jump', 170, 182],
  ['sunset', 182, 194],
  ['endCard', 194, 200],
];

export const DURATION_SEC = 200;

export const CAPTIONS: Caption[] = [
  { from: 1.0, to: 3.6, text: 'It was 34 degrees outside.', pos: 'center' },
  { from: 3.9, to: 6.6, text: 'He wore a hoodie anyway.', pos: 'center' },
  { from: 8.4, to: 12.4, text: 'Everyone else wore t-shirts.' },
  { from: 13.0, to: 18.4, text: 'He wore the same hoodie every day of summer.' },
  { from: 20.4, to: 24.0, text: '"Bro, you\'re HUGE."', tone: 'voice' },
  { from: 24.6, to: 31.4, text: 'Everyone laughed. So he laughed too.' },
  { from: 33.4, to: 37.6, text: 'He stopped looking in mirrors.' },
  { from: 38.2, to: 43.4, text: 'Easier not to see what they saw.' },
  { from: 45.4, to: 49.4, text: 'Every photo, he untagged himself.' },
  { from: 50.0, to: 55.4, text: 'As if he could delete himself from the memory.' },
  { from: 57.4, to: 61.4, text: '"pool party saturday!!"', tone: 'quote' },
  { from: 62.0, to: 64.8, text: '"can\'t. busy."', tone: 'quote' },
  { from: 65.2, to: 68.6, text: "He wasn't busy. He was scared." },
  { from: 70.4, to: 74.4, text: 'He tried on a t-shirt once.' },
  { from: 75.0, to: 78.6, text: '"Everyone will stare."', tone: 'voice' },
  { from: 79.2, to: 82.6, text: '"Just keep the hoodie."', tone: 'voice' },
  { from: 84.4, to: 89.0, text: 'The voice in his head was louder than anyone.' },
  { from: 89.6, to: 96.4, text: "It said things he'd never say to a friend." },
  { from: 98.4, to: 102.4, text: '"You\'ve worn that hoodie for three summers."', tone: 'quote' },
  { from: 103.0, to: 106.4, text: '"Nobody sees you the way you do."', tone: 'quote' },
  { from: 107.0, to: 110.6, text: "He'd never thought of it that way." },
  { from: 112.4, to: 116.6, text: 'He unfollowed every account that made him hate himself.' },
  { from: 117.2, to: 123.4, text: 'His feed got kinder. Then so did he.' },
  { from: 125.4, to: 129.4, text: 'He started small.' },
  { from: 130.0, to: 135.4, text: 'He looked in the mirror. Just looked.' },
  { from: 137.4, to: 141.4, text: 'He went on walks with Sam.' },
  { from: 142.0, to: 145.6, text: 'For fun. Not as punishment.' },
  { from: 147.4, to: 151.4, text: 'One morning, he left the hoodie on the bed.' },
  { from: 152.0, to: 157.4, text: 'It was terrifying. He went anyway.' },
  { from: 159.4, to: 163.4, text: "His heart was pounding at the pool's edge." },
  { from: 164.0, to: 169.4, text: '"Come on, get in!"', tone: 'quote' },
  { from: 171.4, to: 175.0, text: 'He was scared the whole time.' },
  { from: 175.6, to: 181.4, text: 'He jumped anyway.' },
  { from: 183.4, to: 187.6, text: "His body didn't change that summer." },
  { from: 188.2, to: 193.6, text: 'The way he talked to it did.' },
];

const heat = (at: number, deg: number, on: boolean, tone?: CounterKey['tone']): CounterKey => ({ at, tone, text: `${deg}°C · HOODIE ${on ? 'ON' : 'OFF'}` });

export const COUNTER: CounterKey[] = [
  { at: 0, text: null },
  heat(7, 34, true),
  { at: 19, text: 'AGE 12' },
  heat(32, 35, true),
  heat(56, 36, true),
  heat(83, 33, true),
  heat(124, 31, true),
  heat(148, 33, false, 'amber'),
  { at: 194, text: null },
];

// Scene-local moments, seconds.
export const BEATS = {
  joke: 1.2,
  laugh: 5.4,
  tagPress: 4.0,
  invite: 1.4,
  reply: [4.0, 6.0], // typing → sent
  teeOn: 1.2,
  hoodieBack: 8.6,
  unfollow: [1.4, 2.6, 3.8, 5.0],
  towelLift: [2.0, 3.6],
  hoodieOff: 2.0,
  run: 1.8,
  leap: 2.8,
  splash: 3.3,
};

export const SFX: Sfx[] = [
  { src: 'audio/sfx/crickets.mp3', at: 7, volume: 0.18, dur: 12 },
  { src: 'audio/sfx/teens-laugh.mp3', at: 19 + BEATS.laugh - 0.6, volume: 0.35, dur: 5 },
  { src: 'audio/sfx/shutter.mp3', at: 44.6, volume: 0.4 },
  { src: 'audio/sfx/mouse-click.mp3', at: 44 + BEATS.tagPress, volume: 0.5 },
  { src: 'audio/sfx/message-pop.mp3', at: 56 + BEATS.invite, volume: 0.45 },
  { src: 'audio/sfx/phone-typing.mp3', at: 56 + BEATS.reply[0], volume: 0.3, dur: 1.6 },
  { src: 'audio/sfx/message-pop.mp3', at: 56 + BEATS.reply[1], volume: 0.4 },
  { src: 'audio/sfx/whispers.mp3', at: 83.6, volume: 0.35, dur: 7.6 },
  ...BEATS.unfollow.map((t) => ({ src: 'audio/sfx/mouse-click.mp3', at: 111 + t, volume: 0.5 })),
  { src: 'audio/sfx/crickets.mp3', at: 158, volume: 0.15, dur: 12 },
  { src: 'audio/sfx/jump-water.mp3', at: 170 + BEATS.splash - 0.15, volume: 0.7 },
  { src: 'audio/sfx/teens-laugh.mp3', at: 170 + BEATS.splash + 1.2, volume: 0.25, dur: 6 },
];

// Gentle piano through the hiding; warm acoustic joy from the morning he leaves the hoodie behind.
export const MUSIC: Music[] = [
  { src: 'audio/music/piano-reflections.mp3', from: 0, to: 150, fadeIn: 2, fadeOutFrom: 146, volume: 0.6 },
  { src: 'audio/music/tears-of-joy.mp3', from: 147, to: DURATION_SEC, fadeIn: 2.5, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.6 },
];
