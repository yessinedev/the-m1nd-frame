// "The Lobby Is Empty Now." — The M1nd Frame, episode 5. The old gaming squad.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';
import type { Variant } from '../../kit/Character';

export type Member = { variant: Variant; tag: string; glow: string; wall: string; poster: string };

// The squad. Order = quad panel order.
export const SQUAD: Member[] = [
  { variant: 'him', tag: 'FRAME', glow: '#6C8CC4', wall: '#14161C', poster: '#3A4A5C' },
  { variant: 'sam', tag: 'SAM_', glow: '#6E8C5E', wall: '#15171A', poster: '#4A3A2C' },
  { variant: 'jay', tag: 'JAYYY', glow: '#B07A4E', wall: '#17151A', poster: '#2C4A44' },
  { variant: 'leo', tag: 'LEO.exe', glow: '#7E6CB0', wall: '#131520', poster: '#5C3A4A' },
];

export type SceneId =
  | 'coldOpen'
  | 'quadNight'
  | 'lobby'
  | 'clutch'
  | 'victory'
  | 'oneMore'
  | 'leoLeaves'
  | 'quadThree'
  | 'duo'
  | 'solo'
  | 'dust'
  | 'loginAgain'
  | 'groupChat'
  | 'saturday'
  | 'join'
  | 'quadAdult'
  | 'playAgain'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['coldOpen', 0, 7],
  ['quadNight', 7, 21],
  ['lobby', 21, 33],
  ['clutch', 33, 41],
  ['victory', 41, 46],
  ['oneMore', 46, 58],
  ['leoLeaves', 58, 70],
  ['quadThree', 70, 82],
  ['duo', 82, 94],
  ['solo', 94, 106],
  ['dust', 106, 120],
  ['loginAgain', 120, 134],
  ['groupChat', 134, 150],
  ['saturday', 150, 160],
  ['join', 160, 172],
  ['quadAdult', 172, 188],
  ['playAgain', 188, 194],
  ['endCard', 194, 200],
];

export const DURATION_SEC = 200;

export const CAPTIONS: Caption[] = [
  { from: 1.0, to: 3.6, text: 'Every night at 9.', pos: 'center' },
  { from: 3.9, to: 6.6, text: 'Four friends. One lobby.', pos: 'center' },
  { from: 8.4, to: 13.6, text: 'School ended at 3. The real day started at 9.' },
  { from: 14.2, to: 20.4, text: 'They talked until 2 AM about nothing at all.' },
  { from: 22.4, to: 26.6, text: 'Four names in the lobby.' },
  { from: 27.2, to: 32.4, text: 'Always ready.' },
  { from: 34.0, to: 40.2, text: '1 HP. Last round. Nobody breathing.' },
  { from: 41.6, to: 45.6, text: 'His mom knocked twice that night.' },
  { from: 47.0, to: 50.4, text: '"One more game."', tone: 'quote' },
  { from: 51.0, to: 57.4, text: 'There was always one more game.' },
  { from: 59.4, to: 63.4, text: 'Then Leo got a job.' },
  { from: 64.0, to: 69.4, text: '3 out of 4 is still a squad, right?' },
  { from: 71.4, to: 75.4, text: 'Jay moved away for college.' },
  { from: 76.6, to: 81.4, text: 'The games got shorter.' },
  { from: 83.4, to: 86.6, text: '"gotta work at 6. gn man"', tone: 'quote' },
  { from: 87.2, to: 93.4, text: 'Sam logged off first that night. Then every night.' },
  { from: 95.4, to: 99.4, text: 'Then it was just him.' },
  { from: 100.0, to: 105.4, text: 'Waiting in a lobby nobody joined.' },
  { from: 107.4, to: 112.6, text: 'Eventually, he stopped logging in too.' },
  { from: 113.2, to: 119.4, text: 'Nobody said goodbye. They just stopped showing up.' },
  { from: 121.4, to: 125.4, text: 'Years later, he logged back in.' },
  { from: 126.0, to: 133.4, text: 'Last online: 6 years ago. All of them.' },
  { from: 135.4, to: 139.4, text: 'He found the old group chat.' },
  { from: 140.0, to: 143.6, text: 'His thumb hovered for a long time.' },
  { from: 146.6, to: 149.8, text: "Then his phone wouldn't stop buzzing." },
  { from: 151.4, to: 155.4, text: 'Saturday. 9 PM.' },
  { from: 156.0, to: 159.6, text: '1 out of 4.' },
  { from: 168.0, to: 171.6, text: '4 out of 4.' },
  { from: 173.4, to: 178.4, text: 'Older. Tired. Same stupid jokes.' },
  { from: 179.0, to: 187.0, text: 'Like no time had passed at all.' },
  { from: 188.6, to: 191.0, text: 'The lobby was never empty.' },
  { from: 191.3, to: 193.8, text: 'It was waiting for an invite.' },
];

// Scene-local moments, seconds.
export const BEATS = {
  lobbyReady: [1.4, 2.4, 3.4, 4.4],
  clutchWin: 7.6, // abs 40.6 → victory screen at 41
  leoOff: 1.6,
  jayOff: 6.0,
  samOff: 4.6,
  login: 1.0,
  typeStart: 3.0,
  typeEnd: 5.2,
  send: 9.4,
  replies: [11.2, 12.2, 13.2, 14.4],
  joins: [1.2, 3.6, 6.0],
};

const online = (at: number, year: string, n: number, tone?: CounterKey['tone']): CounterKey => ({ at, tone, text: `${year} · ${n}/4 ONLINE` });

export const COUNTER: CounterKey[] = [
  { at: 0, text: null },
  online(7, '2012', 4),
  online(46, '2014', 4),
  online(58 + BEATS.leoOff, '2016', 3),
  online(70 + BEATS.jayOff, '2018', 2),
  online(82 + BEATS.samOff, '2019', 1),
  online(106, '2021', 0),
  online(113, '2024', 0),
  online(120 + BEATS.login, '2025', 1),
  online(160 + BEATS.joins[0], '2025', 2),
  online(160 + BEATS.joins[1], '2025', 3),
  online(160 + BEATS.joins[2], '2025', 4, 'amber'),
  { at: 194, text: null },
];

export const SFX: Sfx[] = [
  { src: 'audio/sfx/keyboard.mp3', at: 7.2, volume: 0.12, dur: 13.6 },
  ...BEATS.lobbyReady.map((t) => ({ src: 'audio/sfx/ready.mp3', at: 21 + t, volume: 0.35 })),
  { src: 'audio/sfx/keyboard.mp3', at: 33.2, volume: 0.22, dur: 7.4 },
  { src: 'audio/sfx/game-win.mp3', at: 41.0, volume: 0.4 },
  { src: 'audio/sfx/message-pop.mp3', at: 82 + 1.2, volume: 0.35 },
  { src: 'audio/sfx/login.mp3', at: 120 + BEATS.login, volume: 0.4 },
  { src: 'audio/sfx/phone-typing.mp3', at: 134 + BEATS.typeStart, volume: 0.35, dur: BEATS.typeEnd - BEATS.typeStart },
  { src: 'audio/sfx/message-pop.mp3', at: 134 + BEATS.send, volume: 0.45 },
  ...BEATS.replies.map((t) => ({ src: 'audio/sfx/message-pop.mp3', at: 134 + t, volume: 0.45 })),
  ...BEATS.joins.map((t) => ({ src: 'audio/sfx/player-join.mp3', at: 160 + t, volume: 0.45 })),
  ...BEATS.joins.map((t) => ({ src: 'audio/sfx/ready.mp3', at: 160 + t + 0.6, volume: 0.3 })),
  { src: 'audio/sfx/login.mp3', at: 189.2, volume: 0.35 },
];

// Chill beat → ambient emptiness → upbeat reunion (kicks in when Sam joins).
export const MUSIC: Music[] = [
  { src: 'audio/music/game-boy.mp3', from: 0, to: 58, fadeIn: 2, fadeOutFrom: 55, volume: 0.55, trimBefore: 12 },
  { src: 'audio/music/vastness.mp3', from: 56, to: 161, fadeIn: 3, fadeOutFrom: 154, volume: 0.5 },
  { src: 'audio/music/space-game.mp3', from: 160 + BEATS.joins[0] - 0.2, to: DURATION_SEC, fadeIn: 0.8, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.4 },
];
