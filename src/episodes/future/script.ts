// "He Met the Man He'd Become." — The M1nd Frame, episode 9. Wasted years, one scroll at a time.
// Hook-first: frame 0 is 3 AM, his face lit red by the feed, and a knock. By 1.6 s the door is open
// and a tired, older him says "I'm you. Ten years from now." The open question ("let me show you how
// it goes") pays off over the next minute; the second one (can he change it?) pays off at the drawer.
// Every timing in the film lives here, in seconds. Components never hardcode copy or timings.
import type { Caption, CounterKey, Music, Sfx } from '../../kit/Episode';

export type SceneId =
  | 'hook'
  | 'stranger'
  | 'tomorrow'
  | 'invites'
  | 'sketch'
  | 'job'
  | 'mirror'
  | 'back'
  | 'choice'
  | 'fade'
  | 'dawn'
  | 'rebuild'
  | 'later'
  | 'final'
  | 'endCard';

export const SCENES: [SceneId, number, number][] = [
  ['hook', 0, 5],
  ['stranger', 5, 15],
  ['tomorrow', 15, 28],
  ['invites', 28, 40],
  ['sketch', 40, 52],
  ['job', 52, 64],
  ['mirror', 64, 78],
  ['back', 78, 92],
  ['choice', 92, 106],
  ['fade', 106, 118],
  ['dawn', 118, 130],
  ['rebuild', 130, 150],
  ['later', 150, 172],
  ['final', 172, 194],
  ['endCard', 194, 200],
];

export const DURATION_SEC = 200;

// The two men he could be at 29. Same face; the tired one wears the same hoodie, faded.
export const OLD = { hoodie: '#4E5664', hoodieShade: '#3F4652' };
export const PROUD_TEE = '#6E7E5E';

// Moments inside scenes, in seconds from the scene start. Shared by animation and sound.
export const BEATS = {
  knock: [0.0, 0.32],
  turn: 0.35, // he looks at the door
  doorOpen: 0.8,
  walkIn: [0.6, 3.2] as [number, number],
  invites: [0.4, 1.6, 2.8, 4.8, 6.2, 7.6],
  lastSeen: 9.0,
  lookUp: 4.0,
  buzz: 1.0,
  drawer: [7.4, 8.0, 9.2, 9.8] as [number, number, number, number], // reach, open, phone in, closed
  smile: 0.8,
  vanish: [4.0, 8.0] as [number, number],
  rise: 4.0,
  window: [6.6, 9.4] as [number, number],
  rebuildParts: [0, 5, 10, 15],
  chatIn: [0.6, 1.8, 3.0],
  scrollsOff: 15.6, // final: the tired future goes dark
};

export const CAPTIONS: Caption[] = [
  { from: 0.15, to: 1.4, text: '3:07 AM.', pos: 'top' },
  { from: 1.6, to: 3.4, text: '"I\'m you. Ten years from now."', tone: 'quote' },
  { from: 3.6, to: 4.9, text: '"Put the phone down."', tone: 'quote' },

  { from: 5.6, to: 8.8, text: 'Same face. Ten years older.' },
  { from: 9.2, to: 11.8, text: 'Same hoodie. Faded.' },
  { from: 12.2, to: 14.8, text: '"Let me show you how it goes."', tone: 'quote' },

  { from: 15.6, to: 19.6, text: '"You\'ll say \'tomorrow.\' Every day."', tone: 'quote' },
  { from: 20.2, to: 23.8, text: '"Tomorrow turns into a month."', tone: 'quote' },
  { from: 24.2, to: 27.6, text: '"Then a year."', tone: 'quote' },

  { from: 28.6, to: 32.6, text: '"Your friends will keep inviting you."', tone: 'quote' },
  { from: 33.2, to: 36.6, text: '"Then they\'ll stop."', tone: 'quote' },

  { from: 40.6, to: 44.6, text: '"Remember how much you loved to draw?"', tone: 'quote' },
  { from: 45.2, to: 51.4, text: '"You\'ll say it like that. \'I used to draw.\'"', tone: 'quote' },

  { from: 52.6, to: 56.6, text: '"You\'ll work a job you hate,"', tone: 'quote' },
  { from: 57.2, to: 63.4, text: '"to pay for a room you never leave."', tone: 'quote' },

  { from: 64.6, to: 68.4, text: '"And one night, you\'ll look up..."', tone: 'quote' },
  { from: 69.0, to: 72.6, text: '"...and see me."', tone: 'quote' },
  { from: 73.2, to: 77.6, text: '"Ten years. Gone one scroll at a time."', tone: 'quote' },

  { from: 78.6, to: 82.0, text: '"Why are you telling me this?"', tone: 'quote' },
  { from: 82.6, to: 86.2, text: '"Because I can\'t change it."', tone: 'quote' },
  { from: 86.8, to: 91.4, text: '"You still can."', tone: 'quote' },

  { from: 92.6, to: 95.8, text: 'The feed was still glowing.' },
  { from: 96.2, to: 99.2, text: 'Just one more.', tone: 'voice' },
  { from: 99.8, to: 105.4, text: 'He put it in the drawer.' },

  { from: 106.6, to: 110.4, text: 'The man in the doorway smiled.' },
  { from: 111.0, to: 117.4, text: 'Then he was gone. That future never came.' },

  { from: 118.6, to: 122.4, text: 'He slept. Really slept.' },
  { from: 123.0, to: 129.4, text: 'And woke up with the sun.' },

  { from: 130.4, to: 132.6, text: 'Small things.' },
  { from: 132.8, to: 134.8, text: 'A walk. Then a run.' },
  { from: 135.6, to: 139.4, text: 'One page a night.' },
  { from: 140.4, to: 144.4, text: 'Then a whole sketchbook.' },
  { from: 145.0, to: 149.4, text: 'And when the squad texted, he said yes.' },

  { from: 150.6, to: 154.4, text: 'Ten years later.' },
  { from: 155.0, to: 159.4, text: 'Same face. Different man.' },
  { from: 160.0, to: 165.4, text: 'His drawings hung on real walls.' },
  { from: 166.0, to: 171.4, text: 'Nobody ever knocked on his door at 3 AM.' },

  { from: 172.6, to: 176.8, text: 'Ten years from now, one of them is you.' },
  { from: 177.4, to: 181.6, text: 'Tired, or proud.' },
  { from: 182.2, to: 187.4, text: 'Tonight decides which one.' },
  { from: 188.0, to: 193.4, text: 'Put the phone down.' },
];

const age = (at: number, a: number, lost: number): CounterKey => ({ at, tone: 'red', text: `AGE ${a} · YEARS LOST: ${lost}` });
const day = (at: number, text: string): CounterKey => ({ at, tone: 'amber', text });

export const COUNTER: CounterKey[] = [
  { at: 0, tone: 'red', text: 'SCREEN TIME: 9h 41m' },
  age(15, 20, 1),
  age(28, 22, 3),
  age(40, 24, 5),
  age(52, 26, 7),
  age(64, 29, 10),
  { at: 78, tone: 'red', text: 'SCREEN TIME: 9h 41m' },
  { at: 92 + BEATS.drawer[3], text: null },
  day(118, 'DAY 1'),
  ...BEATS.rebuildParts.map((t, i) => day(130 + t, ['DAY 7', 'DAY 30', 'DAY 120', 'YEAR 1'][i])),
  day(150, 'AGE 29'),
  { at: 172, text: null },
];

export const SFX: Sfx[] = [
  ...BEATS.knock.map((t) => ({ src: 'audio/sfx/knock.mp3', at: t, volume: 0.85, dur: 0.6 })),
  { src: 'audio/sfx/whoosh.mp3', at: BEATS.doorOpen - 0.2, volume: 0.35 },
  { src: 'audio/sfx/whoosh.mp3', at: 14.8, volume: 0.4 },
  ...BEATS.invites.map((t, i) => ({ src: i === 2 || i === 4 ? 'audio/sfx/phone-typing.mp3' : 'audio/sfx/message-pop.mp3', at: 28 + t - (i === 2 || i === 4 ? 0.9 : 0), volume: 0.4, dur: 1 })),
  { src: 'audio/sfx/keyboard.mp3', at: 52, volume: 0.15, dur: 12 },
  { src: 'audio/sfx/whoosh.mp3', at: 77.8, volume: 0.4 },
  { src: 'audio/sfx/message-pop.mp3', at: 92 + BEATS.buzz, volume: 0.5 },
  ...[3.0, 3.8, 4.5, 5.1, 5.6, 6.1, 6.6, 7.1].map((t) => ({ src: 'audio/sfx/heartbeat.mp3', at: 92 + t, volume: 0.5 })),
  { src: 'audio/sfx/door-close.mp3', at: 92 + BEATS.drawer[3] - 0.3, volume: 0.35 },
  { src: 'audio/sfx/crickets.mp3', at: 106, volume: 0.1, dur: 12 },
  { src: 'audio/sfx/message-pop.mp3', at: 130 + BEATS.rebuildParts[3] + BEATS.chatIn[0], volume: 0.4 },
  { src: 'audio/sfx/message-pop.mp3', at: 130 + BEATS.rebuildParts[3] + BEATS.chatIn[1], volume: 0.4 },
  { src: 'audio/sfx/message-pop.mp3', at: 130 + BEATS.rebuildParts[3] + BEATS.chatIn[2], volume: 0.5 },
];

// Low ambient for the visit → loneliness for the future he's shown → near-silence for the choice
// → lift-off from the morning on → warm close.
export const MUSIC: Music[] = [
  { src: 'audio/music/vastness.mp3', from: 0.6, to: 16, fadeIn: 1.2, fadeOutFrom: 14, volume: 0.5 },
  { src: 'audio/music/ode-to-loneliness.mp3', from: 14.6, to: 80, fadeIn: 1.5, fadeOutFrom: 76, volume: 0.65 },
  { src: 'audio/music/night-sky.mp3', from: 78.4, to: 104, fadeIn: 2, fadeOutFrom: 98, volume: 0.35 },
  { src: 'audio/music/raising-me-higher.mp3', from: 108, to: 172, fadeIn: 3, fadeOutFrom: 168, volume: 0.5 },
  { src: 'audio/music/skyline.mp3', from: 169, to: DURATION_SEC, fadeIn: 3, fadeOutFrom: DURATION_SEC - 3.5, volume: 0.6 },
];

// Tint over the future he's shown: cold, washed out.
export const FUTURE_TINT = { color: '#3A4A6A', opacity: 0.35 };
