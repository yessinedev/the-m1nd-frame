// "Nobody Remembered His Birthday." — The M1nd Frame, episode 10. Showing up for people.
// Hook-first: frame 0 is his lock screen at 23:59 with MESSAGES: 0 already on screen; at 0.6 s it
// flips to 00:00 and "Your birthday" — and nothing comes. The open question ("when did they all
// forget me?") is answered by his own chats at 0:36: he stopped showing up first.
// The ending mirrors the hook: the same lock screen a year later, and this time it doesn't stop.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';

export type SceneId =
  | 'hook'
  | 'day'
  | 'alone'
  | 'feed'
  | 'thread'
  | 'chats'
  | 'realize'
  | 'list'
  | 'sam'
  | 'showUp'
  | 'nana'
  | 'year'
  | 'midnight'
  | 'party'
  | 'final'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['hook', 0, 5],
  ['day', 5, 12],
  ['alone', 12, 24],
  ['feed', 24, 36],
  ['thread', 36, 48],
  ['chats', 48, 60],
  ['realize', 60, 72],
  ['list', 72, 84],
  ['sam', 84, 100],
  ['showUp', 100, 114],
  ['nana', 114, 126],
  ['year', 126, 140],
  ['midnight', 140, 160],
  ['party', 160, 176],
  ['final', 176, 194],
  ['endCard', 194, 200],
];

export const DURATION_SEC = 200;

// The day he turns 25, and the people he let slip.
export const HIS_DATE = 'Thursday, June 12';
export const PEOPLE = [
  { name: 'Sam', variant: 'sam' as const, date: 'Mar 14' },
  { name: 'Jay', variant: 'jay' as const, date: 'May 2' },
  { name: 'Leo', variant: 'leo' as const, date: 'Aug 20' },
  { name: 'Nana', variant: 'nana' as const, date: 'Sep 9' },
  { name: 'Mom', variant: 'mom' as const, date: 'Nov 3' },
];

// Moments inside scenes, in seconds from the scene start. Shared by animation and sound.
export const BEATS = {
  hookFlip: 0.6, // 23:59 → 00:00
  dayClocks: [0, 0.8, 1.6, 2.4, 3.2, 4.0, 4.8, 5.6, 6.4],
  appPing: 2.6, // the only notification: an app
  blowOut: 8.2,
  feedScroll: [0.4, 10.6] as [number, number],
  threadMsgs: [0.4, 1.2, 4.6, 8.0],
  seen: [1.2, 3.6, 6.0, 8.4], // a red "Seen" lands on each unanswered birthday
  notes: [1.6, 3.4, 5.2, 7.0, 8.8],
  samFlip: 1.2,
  samSend: 3.0,
  samReply: 8.6,
  knock: [1.4, 1.8],
  doorOpen: 3.0,
  hug: 7.6,
  ticks: [1.2, 3.0, 4.8, 6.6, 8.4],
  midFlip: 4.0,
  midPings: [4.4, 4.9, 5.3, 5.7, 6.0, 6.3, 6.6, 6.9, 7.2, 7.5, 7.8, 8.2, 8.6, 9.0],
  partyKnock: [0.6, 1.0, 1.4],
  partyOpen: 2.4,
  blowOut2: 10.6,
};

export const CAPTIONS: Caption[] = [
  { from: 0.2, to: 1.8, text: '00:00. His birthday.', pos: 'top' },
  { from: 2.0, to: 4.8, text: 'He waited for the first message.', pos: 'top' },

  { from: 5.4, to: 8.2, text: 'It never came.', pos: 'top' },
  { from: 8.6, to: 11.8, text: 'Only an app remembered.', pos: 'top' },

  { from: 12.6, to: 16.4, text: 'He bought his own cake.' },
  { from: 17.0, to: 23.4, text: "He told himself he didn't care." },

  { from: 24.6, to: 28.4, text: 'Everyone else was busy living.' },
  { from: 29.0, to: 35.4, text: '"When did they all forget me?"', tone: 'voice' },

  { from: 36.6, to: 40.0, text: 'Then he scrolled back.' },
  { from: 40.6, to: 44.0, text: 'Last year, Sam wished him first.' },
  { from: 44.4, to: 47.6, text: "Sam's birthday was in March." },

  { from: 48.4, to: 51.4, text: 'He left him on seen.' },
  { from: 52.0, to: 55.6, text: 'Jay in May. Leo in August.' },
  { from: 56.0, to: 59.6, text: 'Nana in September.' },

  { from: 60.6, to: 64.4, text: 'Nobody forgot him first.' },
  { from: 65.0, to: 71.4, text: "He'd stopped showing up. One birthday at a time." },

  { from: 72.6, to: 76.4, text: 'So he started a list.' },
  { from: 77.0, to: 83.4, text: 'Every name. Every date.' },

  { from: 84.6, to: 88.0, text: 'March 14. 11:59 PM.', pos: 'top' },
  { from: 88.6, to: 92.4, text: 'This time, he was first.', pos: 'top' },
  { from: 93.0, to: 99.4, text: '"BRO. you remembered??"', tone: 'quote', pos: 'top' },

  { from: 100.6, to: 104.4, text: "For Jay, he didn't just text." },
  { from: 105.0, to: 113.4, text: 'He showed up.' },

  { from: 114.6, to: 118.4, text: 'He called Nana on her birthday.' },
  { from: 119.0, to: 125.4, text: 'She talked for an hour. He listened to all of it.' },

  { from: 126.6, to: 130.4, text: 'Thirty seconds a birthday.' },
  { from: 131.0, to: 139.4, text: 'A whole year of showing up.' },

  { from: 140.6, to: 143.6, text: 'A year later. 11:59 PM.', pos: 'top' },
  { from: 148.6, to: 152.4, text: "His phone didn't stop.", pos: 'top' },
  { from: 153.0, to: 159.4, text: 'Sam was first. Of course he was.', pos: 'top' },

  { from: 160.6, to: 164.0, text: 'Then someone knocked.' },
  { from: 165.0, to: 170.4, text: "They didn't just text either." },

  { from: 176.6, to: 181.0, text: 'Nobody forgets the friend who shows up.' },
  { from: 181.6, to: 186.4, text: 'Whose birthday did you miss?' },
  { from: 187.0, to: 193.4, text: 'Be the first message.' },
];

const msgs = (at: number, n: number, tone?: CounterKey['tone']): CounterKey => ({ at, tone, text: `MESSAGES: ${n}` });
const missed = (at: number, n: number): CounterKey => ({ at, tone: 'red', text: `BIRTHDAYS HE MISSED: ${n}` });
const kept = (at: number, n: number): CounterKey => ({ at, tone: 'amber', text: `BIRTHDAYS REMEMBERED: ${n}` });

export const COUNTER: CounterKey[] = [
  msgs(0, 0),
  msgs(5 + BEATS.dayClocks[3], 0, 'red'),
  missed(48 + BEATS.seen[0], 1),
  ...BEATS.seen.slice(1).map((t, i) => missed(48 + t, i + 2)),
  { at: 72, text: null },
  kept(84 + BEATS.samSend, 1),
  kept(100 + BEATS.doorOpen, 2),
  kept(114, 3),
  ...BEATS.ticks.map((t, i) => kept(126 + t, [5, 7, 9, 11, 12][i])),
  msgs(140, 0),
  ...[1, 3, 6, 9, 14, 19, 23, 27, 31, 34, 38, 41].map((n, i) => msgs(140 + BEATS.midPings[i], n, 'amber')),
  { at: 160, text: null },
];

export const SFX: Sfx[] = [
  { src: 'audio/sfx/mouse-click.mp3', at: 0, volume: 1 },
  { src: 'audio/sfx/bubble-pop.mp3', at: BEATS.hookFlip, volume: 0.6 },
  ...BEATS.dayClocks.slice(1).map((t) => ({ src: 'audio/sfx/mouse-click.mp3', at: 5 + t, volume: 0.25 })),
  { src: 'audio/sfx/message-pop.mp3', at: 5 + BEATS.appPing, volume: 0.45 },
  { src: 'audio/sfx/whoosh.mp3', at: 12 + BEATS.blowOut - 0.1, volume: 0.25 },
  ...BEATS.threadMsgs.map((t) => ({ src: 'audio/sfx/message-pop.mp3', at: 36 + t, volume: 0.3 })),
  ...BEATS.seen.map((t) => ({ src: 'audio/sfx/mouse-click.mp3', at: 48 + t, volume: 0.4 })),
  ...BEATS.notes.map((t) => ({ src: 'audio/sfx/shutter.mp3', at: 72 + t, volume: 0.35 })),
  { src: 'audio/sfx/phone-typing.mp3', at: 84 + BEATS.samFlip + 0.2, volume: 0.35, dur: 1.6 },
  { src: 'audio/sfx/message-pop.mp3', at: 84 + BEATS.samSend, volume: 0.5 },
  { src: 'audio/sfx/message-pop.mp3', at: 84 + BEATS.samReply, volume: 0.55 },
  ...BEATS.knock.map((t) => ({ src: 'audio/sfx/knock.mp3', at: 100 + t - 0.05, volume: 0.7, dur: 0.6 })),
  { src: 'audio/sfx/teens-laugh.mp3', at: 100 + BEATS.hug, volume: 0.12, dur: 4 },
  ...BEATS.ticks.map((t) => ({ src: 'audio/sfx/game-coin.mp3', at: 126 + t, volume: 0.25 })),
  { src: 'audio/sfx/mouse-click.mp3', at: 140 + BEATS.midFlip - 0.4, volume: 0.4 },
  ...BEATS.midPings.map((t, i) => ({ src: 'audio/sfx/message-pop.mp3', at: 140 + t, volume: 0.3 + (i % 3) * 0.08 })),
  ...BEATS.partyKnock.map((t) => ({ src: 'audio/sfx/knock.mp3', at: 160 + t - 0.05, volume: 0.7, dur: 0.6 })),
  { src: 'audio/sfx/teens-laugh.mp3', at: 160 + BEATS.partyOpen + 0.4, volume: 0.2, dur: 6 },
  { src: 'audio/sfx/whoosh.mp3', at: 176 + BEATS.blowOut2 - 0.1, volume: 0.3 },
  { src: 'audio/sfx/game-win.mp3', at: 176 + BEATS.blowOut2 + 0.3, volume: 0.25 },
];

// Lonely piano for the empty day and the realisation → near-silence for the list → warm build as
// he starts showing up → full lift for the midnight that doesn't stop.
export const MUSIC: Music[] = [
  { src: 'audio/music/piano-reflections.mp3', from: 0, to: 74, fadeIn: 0.2, fadeOutFrom: 70, volume: 0.5 },
  { src: 'audio/music/love-in-the-air.mp3', from: 72.5, to: 140, fadeIn: 3, fadeOutFrom: 136, volume: 0.45 },
  { src: 'audio/music/happy-home.mp3', from: 143.8, to: DURATION_SEC, fadeIn: 0.8, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.55 },
];
