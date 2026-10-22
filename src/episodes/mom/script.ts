// "His Mom Called. He Pressed Decline." — The M1nd Frame, episode 8. Calling your parents back.
// Built hook-first: frame 0 is already the ringing phone and the decline lands at 1.7 s, so there is
// no black cold open. The 47 declined calls are counted month by month toward a number the viewer
// already knows, and "she stopped calling" stays an open question until the porch at 2:28.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';

export type SceneId =
  | 'hook'
  | 'log'
  | 'busy'
  | 'texts'
  | 'friends'
  | 'sunday'
  | 'birthday'
  | 'voicemail'
  | 'last'
  | 'silence'
  | 'play'
  | 'calling'
  | 'drive'
  | 'porch'
  | 'together'
  | 'pickUp'
  | 'final'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['hook', 0, 4.5],
  ['log', 4.5, 11],
  ['busy', 11, 22],
  ['texts', 22, 33],
  ['friends', 33, 44],
  ['sunday', 44, 56],
  ['birthday', 56, 68],
  ['voicemail', 68, 80],
  ['last', 80, 92],
  ['silence', 92, 106],
  ['play', 106, 121],
  ['calling', 121, 133],
  ['drive', 133, 144],
  ['porch', 144, 160],
  ['together', 160, 174],
  ['pickUp', 174, 187],
  ['final', 187, 194],
  ['endCard', 194, 200],
];

export const DURATION_SEC = 200;

// Moments inside scenes, in seconds from the scene start. Shared by animation and sound.
export const BEATS = {
  hookTap: 1.7, // thumb hits Decline
  busyFlip: 4.6, // he turns the ringing phone face down without looking
  chatMsgs: [0.4, 1.6, 2.8, 4.4, 6.6, 8.6],
  cafeRing: 2.0,
  cafeFlip: 4.2,
  sundayDial: 1.2,
  sundayLower: 6.0,
  sundayCover: 8.4,
  bdayText: 1.0,
  bdayDial: 7.6,
  bdayLower: 10.4,
  vmNotice: 0.8,
  vmSwipe: 7.2,
  lastRing: 0.6,
  lastTap: 3.2,
  silenceDays: [0, 3, 6, 9, 12],
  playTap: 0.6,
  playFace: 7.4, // cut from the phone to his face
  dial: 0.8,
  noAnswer: 8.8,
  knock: [1.2, 1.6],
  doorOpen: 3.2,
  hug: 13.2,
  pickRing: 0.2,
  pickTap: 1.1,
  pickSplit: 4.6,
};

export const CAPTIONS: Caption[] = [
  { from: 0.15, to: 1.6, text: 'His mom called.', pos: 'top' },
  { from: 1.9, to: 4.4, text: 'He pressed decline. Again.', pos: 'top' },
  { from: 4.8, to: 7.5, text: '47 times that year.' },
  { from: 7.9, to: 10.8, text: 'Then one day, she stopped calling.' },

  { from: 11.6, to: 15.2, text: 'He was always busy.' },
  { from: 15.6, to: 18.4, text: '"It\'s okay. Call me later."', tone: 'quote' },
  { from: 18.8, to: 21.6, text: 'He never called later.' },

  { from: 22.6, to: 26.6, text: 'Her messages were long.' },
  { from: 27.4, to: 32.4, text: 'His were two words.' },

  { from: 33.6, to: 37.6, text: 'He had time for everyone.' },
  { from: 38.2, to: 43.4, text: 'Everyone but her.' },

  { from: 44.6, to: 48.8, text: 'Every Sunday, she still cooked for two.' },
  { from: 49.4, to: 55.4, text: 'Just in case he came home.' },

  { from: 56.6, to: 60.4, text: 'On her birthday, he sent three words.' },
  { from: 61.0, to: 63.8, text: 'She read them eleven times.' },
  { from: 64.2, to: 67.6, text: 'Then she called to say thank you.' },

  { from: 68.6, to: 72.4, text: 'She left him a voicemail.' },
  { from: 73.0, to: 79.4, text: 'Forty-one seconds. He never played it.' },

  { from: 80.6, to: 84.4, text: 'December. Call 47.' },
  { from: 85.0, to: 91.4, text: '"I\'ll call her back tomorrow."', tone: 'voice' },

  { from: 92.6, to: 96.4, text: 'Then the calls stopped.' },
  { from: 97.0, to: 100.6, text: 'At first, it felt like peace.' },
  { from: 101.2, to: 105.6, text: 'Then it felt like something was wrong.' },

  { from: 107.0, to: 110.0, text: '"Hi sweetheart. Nothing\'s wrong."', tone: 'quote' },
  { from: 110.4, to: 113.6, text: '"I just wanted to hear your voice."', tone: 'quote' },
  { from: 114.0, to: 117.2, text: '"Don\'t work too hard, okay?"', tone: 'quote' },
  { from: 117.6, to: 120.6, text: '"I love you. Bye."', tone: 'quote' },

  { from: 121.6, to: 125.0, text: 'Now he was the one calling.' },
  { from: 125.4, to: 129.0, text: 'One ring. Three. Seven.' },
  { from: 129.6, to: 132.6, text: 'No answer.' },

  { from: 133.6, to: 137.6, text: 'He drove through the night.' },
  { from: 138.2, to: 143.4, text: 'He never had three minutes. Now he had five hours.' },

  { from: 148.0, to: 151.6, text: 'She had fallen. Two weeks in hospital.' },
  { from: 152.0, to: 155.6, text: '"I didn\'t want to bother you."', tone: 'quote' },
  { from: 156.0, to: 159.6, text: '"You could never bother me, Mom."', tone: 'quote' },

  { from: 160.6, to: 164.4, text: 'He stayed two weeks.' },
  { from: 165.0, to: 168.8, text: 'He finally learned her recipe.' },
  { from: 169.4, to: 173.4, text: 'She laughed at how bad he was at it.' },

  { from: 174.3, to: 177.0, text: 'His mom called.', pos: 'top' },
  { from: 177.4, to: 180.6, text: 'He picked up on the first ring.', pos: 'top' },
  { from: 181.0, to: 186.4, text: 'Now he calls first. Every Sunday.' },

  { from: 187.4, to: 190.4, text: 'She never needed a reason to call.' },
  { from: 190.8, to: 193.8, text: 'Call her back tonight.' },
];

// Top-left: the decline count. The hook shows the final 47; the flashback climbs back toward it,
// month by month. Then the silence is counted in days, and the ending counts calls answered.
const dec = (at: number, month: string | null, n: number, tone?: CounterKey['tone']): CounterKey => ({
  at,
  tone,
  text: month ? `${month} · DECLINED: ${n}` : `DECLINED: ${n}`,
});

export const COUNTER: CounterKey[] = [
  dec(0, null, 46),
  dec(BEATS.hookTap, null, 47, 'red'),
  dec(11, 'MARCH', 3),
  dec(11 + BEATS.busyFlip, 'MARCH', 4),
  dec(22, 'APRIL', 9),
  dec(33, 'JUNE', 18),
  dec(33 + BEATS.cafeFlip, 'JUNE', 19),
  dec(44, 'AUGUST', 26, 'red'),
  dec(56, 'OCTOBER', 32, 'red'),
  dec(56 + BEATS.bdayLower, 'OCTOBER', 33, 'red'),
  dec(68, 'NOVEMBER', 40, 'red'),
  dec(80, 'DECEMBER', 46, 'red'),
  dec(80 + BEATS.lastTap, 'DECEMBER', 47, 'red'),
  ...[1, 3, 6, 9, 12].map((d, i) => ({ at: 92 + BEATS.silenceDays[i], text: `DAYS WITHOUT HER CALL: ${d}`, tone: (d >= 9 ? 'red' : undefined) as CounterKey['tone'] })),
  { at: 106, text: null },
  { at: 174 + BEATS.pickTap, text: 'ANSWERED: 1', tone: 'amber' },
  { at: 181, text: 'ANSWERED: 12', tone: 'amber' },
  { at: 184, text: 'ANSWERED: 52', tone: 'amber' },
  { at: 187, text: null },
];

const ring = (at: number, until: number, volume: number): Sfx => ({ src: 'audio/sfx/ringing.mp3', at, volume, dur: until - at });

export const SFX: Sfx[] = [
  // The hook: a ring on frame 0, cut dead by the tap.
  ring(0, BEATS.hookTap, 0.75),
  { src: 'audio/sfx/mouse-click.mp3', at: BEATS.hookTap - 0.05, volume: 0.7 },
  { src: 'audio/sfx/whoosh.mp3', at: 4.4, volume: 0.3 },
  ring(11.3, 11 + BEATS.busyFlip, 0.3),
  { src: 'audio/sfx/keyboard.mp3', at: 11, volume: 0.15, dur: 11 },
  ...BEATS.chatMsgs.map((t) => ({ src: 'audio/sfx/message-pop.mp3', at: 22 + t, volume: 0.4 })),
  { src: 'audio/sfx/cafe-ambience.mp3', at: 33, volume: 0.18, dur: 11 },
  ring(33 + BEATS.cafeRing, 33 + BEATS.cafeFlip, 0.25),
  { src: 'audio/sfx/teens-laugh.mp3', at: 33.4, volume: 0.12, dur: 4 },
  ring(44 + BEATS.sundayDial + 0.4, 44 + BEATS.sundayLower, 0.18),
  { src: 'audio/sfx/message-pop.mp3', at: 56 + BEATS.bdayText, volume: 0.5 },
  ring(56 + BEATS.bdayDial + 0.4, 56 + BEATS.bdayLower, 0.18),
  { src: 'audio/sfx/message-pop.mp3', at: 68 + BEATS.vmNotice, volume: 0.45 },
  { src: 'audio/sfx/whoosh.mp3', at: 68 + BEATS.vmSwipe - 0.1, volume: 0.3 },
  ring(80 + BEATS.lastRing, 80 + BEATS.lastTap, 0.55),
  { src: 'audio/sfx/mouse-click.mp3', at: 80 + BEATS.lastTap - 0.05, volume: 0.6 },
  { src: 'audio/sfx/crickets.mp3', at: 92, volume: 0.12, dur: 14 },
  { src: 'audio/sfx/tape.mp3', at: 106 + BEATS.playTap - 0.1, volume: 0.35 },
  ring(121 + BEATS.dial + 0.3, 121 + BEATS.noAnswer, 0.4),
  ...[0, 0.9, 1.7, 2.4, 3.0, 3.5].map((d) => ({ src: 'audio/sfx/heartbeat.mp3', at: 121 + BEATS.dial + 3 + d, volume: 0.45 })),
  { src: 'audio/sfx/car-ambience.mp3', at: 133, volume: 0.35, dur: 11 },
  { src: 'audio/sfx/rain.mp3', at: 133, volume: 0.2, dur: 11 },
  ...BEATS.knock.map((t) => ({ src: 'audio/sfx/knock.mp3', at: 144 + t - 0.05, volume: 0.7, dur: 0.6 })),
  { src: 'audio/sfx/frying.mp3', at: 160.3, volume: 0.22, dur: 13.4 },
  ring(174 + BEATS.pickRing, 174 + BEATS.pickTap, 0.6),
  { src: 'audio/sfx/mouse-click.mp3', at: 174 + BEATS.pickTap - 0.05, volume: 0.6 },
];

// Sparse piano enters the second he declines and carries the year → it drops out for the silence
// → her voicemail plays over near-nothing → tension for the call and the drive → warm strings home.
export const MUSIC: Music[] = [
  { src: 'audio/music/piano-reflections.mp3', from: 1.8, to: 96, fadeIn: 1.5, fadeOutFrom: 92, volume: 0.55 },
  { src: 'audio/music/silent-descent.mp3', from: 120.6, to: 146, fadeIn: 3, fadeOutFrom: 142, volume: 0.5 },
  { src: 'audio/music/tears-of-joy.mp3', from: 147, to: DURATION_SEC, fadeIn: 3, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.55 },
];
