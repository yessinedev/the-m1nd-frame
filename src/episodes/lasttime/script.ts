// "Nobody Tells You It's the Last Time." — The M1nd Frame, episode 3. Childhood friendship.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';
import type { ChatMsg } from '../../kit/props3';
import { f } from '../../kit/time';

export const STREET = 'MAPLE ST';

export type SceneId =
  | 'coldOpen'
  | 'bikes'
  | 'hill'
  | 'games'
  | 'lastRide'
  | 'moving'
  | 'chat'
  | 'office'
  | 'post'
  | 'alone'
  | 'photo'
  | 'dial'
  | 'answer'
  | 'rideAgain'
  | 'corner'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['coldOpen', 0, 7],
  ['bikes', 7, 19],
  ['hill', 19, 31],
  ['games', 31, 41],
  ['lastRide', 41, 56],
  ['moving', 56, 66],
  ['chat', 66, 84],
  ['office', 84, 96],
  ['post', 96, 108],
  ['alone', 108, 122],
  ['photo', 122, 136],
  ['dial', 136, 150],
  ['answer', 150, 162],
  ['rideAgain', 162, 184],
  ['corner', 184, 193],
  ['endCard', 193, 200],
];

export const DURATION_SEC = 200;

export const CAPTIONS: Caption[] = [
  { from: 1.0, to: 3.6, text: "Nobody tells you it's the last time.", pos: 'center' },
  { from: 3.9, to: 6.6, text: 'You just live it.', pos: 'center' },
  { from: 8.4, to: 12.4, text: 'Summer. Two bikes. One best friend.' },
  { from: 13.0, to: 18.2, text: 'Every day felt like it would last forever.' },
  { from: 20.4, to: 24.6, text: 'They made big plans.' },
  { from: 25.2, to: 30.4, text: 'Same school. Same city. Forever.' },
  { from: 32.2, to: 36.0, text: 'Sam came over every day after school.' },
  { from: 36.6, to: 40.4, text: 'And never let him forget who won.' },
  { from: 43.6, to: 46.6, text: '"See you tomorrow!"', tone: 'quote' },
  { from: 47.6, to: 51.4, text: 'It was the last time they rode together.' },
  { from: 52.0, to: 55.4, text: 'Neither of them knew.' },
  { from: 57.4, to: 61.0, text: "Sam's family moved across town." },
  { from: 61.6, to: 65.4, text: 'Just across town. Nothing would change.' },
  { from: 67.6, to: 71.4, text: 'Plans became "soon."' },
  { from: 72.4, to: 76.6, text: '"Soon" became "someday."' },
  { from: 77.4, to: 83.0, text: '"Someday" became nothing at all.' },
  { from: 85.4, to: 89.6, text: 'Work. Bills. A life that got busy.' },
  { from: 90.2, to: 95.4, text: 'He told himself Sam was busy too.' },
  { from: 97.6, to: 101.4, text: "He watched Sam's life in photos." },
  { from: 102.0, to: 107.0, text: 'A like instead of a call.' },
  { from: 109.6, to: 113.6, text: 'He had 600 friends online.' },
  { from: 114.2, to: 121.0, text: 'And nobody to call at 2 AM.' },
  { from: 123.8, to: 127.6, text: 'Then he found the photo.' },
  { from: 128.4, to: 134.6, text: 'He remembered the last day. Every detail.' },
  { from: 137.6, to: 141.0, text: '"What if it\'s weird?"', tone: 'voice' },
  { from: 141.6, to: 144.6, text: '"What if he forgot?"', tone: 'voice' },
  { from: 145.6, to: 149.4, text: 'He pressed call anyway.' },
  { from: 151.8, to: 154.8, text: '"...Hello?"', tone: 'quote' },
  { from: 155.4, to: 158.6, text: '"Hey. It\'s me."', tone: 'quote' },
  { from: 159.0, to: 161.8, text: '"DUDE."', tone: 'quote' },
  { from: 163.6, to: 167.4, text: "Some friendships don't end." },
  { from: 168.2, to: 173.4, text: 'They just wait for someone to call first.' },
  { from: 185.4, to: 188.2, text: '"Same time next week?"', tone: 'quote' },
  { from: 188.6, to: 192.4, text: '"Same time next week."', tone: 'quote' },
];

const age = (at: number, n: number | null, tone?: CounterKey['tone']): CounterKey => ({ at, tone, text: n === null ? null : `AGE ${n}` });

export const COUNTER: CounterKey[] = [
  age(0, null),
  age(7, 11),
  age(41, 12),
  age(56, 13),
  age(66, 15),
  age(71.2, 18),
  age(75.6, 22),
  age(79.6, 26),
  age(84, 27),
  age(108, 29),
  age(162, 29, 'amber'),
  age(193, null),
];

// Moments inside scenes, in seconds from the scene start.
export const BEATS = {
  gameWin: 6.2,
  lastStop: 2.6,
  lastWave: 2.8,
  lastSplit: 5.0,
  lastFreeze: 6.4,
  photoFlash: 6.0,
  dialPress: 9.4,
  answerPick: 1.6,
  cornerStop: 1.4,
  cornerSplit: 6.6,
};

// The thread, scene-local frames. Year headers line up with the AGE counter.
export const THREAD: ChatMsg[] = [
  { from: 'them', text: 'dude come over saturday!!', at: f(0.6), year: '2011' },
  { from: 'me', text: 'YES. bring the controller', at: f(1.6) },
  { from: 'me', text: 'we gotta hang soon', at: f(5.2), year: '2014' },
  { from: 'them', text: 'for sure man', at: f(6.4) },
  { from: 'them', text: 'happy bday bro!!', at: f(9.6), year: '2018' },
  { from: 'me', text: 'thanks man', at: f(10.8) },
  { from: 'me', text: 'we should catch up sometime', at: f(13.6), year: '2022' },
  { from: 'them', text: 'yeah for sure', at: f(14.8), seen: true },
];

export const SFX: Sfx[] = [
  { src: 'audio/sfx/bike-pedal.mp3', at: 7.2, volume: 0.25, dur: 11.6 },
  { src: 'audio/sfx/bike-bell.mp3', at: 9.0, volume: 0.35, dur: 1.4 },
  { src: 'audio/sfx/game-coin.mp3', at: 33.0, volume: 0.25 },
  { src: 'audio/sfx/game-coin.mp3', at: 34.4, volume: 0.25 },
  { src: 'audio/sfx/game-win.mp3', at: 31 + BEATS.gameWin, volume: 0.35 },
  { src: 'audio/sfx/bike-pedal.mp3', at: 41.0, volume: 0.22, dur: 6.4 },
  { src: 'audio/sfx/bike-bell.mp3', at: 41 + BEATS.lastWave, volume: 0.3, dur: 1.4 },
  ...[0.6, 1.6, 5.2, 6.4, 9.6, 10.8, 13.6, 14.8].map((t) => ({ src: 'audio/sfx/message-pop.mp3', at: 66 + t, volume: 0.35 })),
  { src: 'audio/sfx/whoosh.mp3', at: 122 + BEATS.photoFlash - 0.1, volume: 0.3 },
  { src: 'audio/sfx/ringing.mp3', at: 136 + BEATS.dialPress + 0.3, volume: 0.45, dur: 150 - 136 - BEATS.dialPress - 0.3 + BEATS.answerPick },
  { src: 'audio/sfx/bike-pedal.mp3', at: 162.2, volume: 0.25, dur: 21.6 },
  { src: 'audio/sfx/bike-bell.mp3', at: 165.0, volume: 0.35, dur: 1.4 },
  { src: 'audio/sfx/bike-bell.mp3', at: 176.4, volume: 0.35, dur: 1.4 },
];

// Nostalgic piano → melancholic strings → hopeful strings.
export const MUSIC: Music[] = [
  { src: 'audio/music/classical-2-boosted.mp3', from: 0, to: 58, fadeIn: 2, fadeOutFrom: 54, volume: 0.8 },
  { src: 'audio/music/love-in-the-air.mp3', from: 55, to: 137, fadeIn: 3, fadeOutFrom: 131, volume: 0.7 },
  { src: 'audio/music/classical-vibes-4.mp3', from: 146, to: DURATION_SEC, fadeIn: 3, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.75 },
];
