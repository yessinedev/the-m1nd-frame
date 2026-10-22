import React from 'react';
import { HAND } from '../fonts';
import { C } from '../theme';
import { Glow } from './props';

// Phone-detox set pieces (episode 11+): the desk drawer seen from above with its key, a screen-time
// report, a home screen whose apps get deleted, a book to hold, a guitar.

const WOOD = '#3A3128';
const WOOD_DARK = '#2A231C';

// Desk drawer, close up, from above and in front. `open` 0..1 slides it out (the interior shows);
// `key` 0..1 turns the key in the lock. `children` draw inside the drawer (clipped), in its space.
export const DrawerCloseUp: React.FC<{ open: number; keyTurn: number; children?: React.ReactNode }> = ({ open, keyTurn, children }) => {
  const depth = 300 * open;
  return (
    <g>
      <rect width={1920} height={1080} fill="#100E0C" />
      {/* desk top */}
      <path d="M 0 120 L 1920 120 L 1920 520 L 0 520 Z" fill={WOOD} />
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M 0 ${170 + i * 60} q 960 ${(i % 2 ? 1 : -1) * 14} 1920 0`} stroke={WOOD_DARK} strokeWidth={3} fill="none" opacity={0.5} />
      ))}
      <rect x={0} y={520} width={1920} height={560} fill={WOOD_DARK} />
      {/* interior, pulled out toward the viewer */}
      {open > 0 ? (
        <g>
          <path d={`M 520 520 L 1400 520 L 1440 ${520 + depth} L 480 ${520 + depth} Z`} fill="#0C0A09" />
          <path d={`M 540 530 L 1380 530 L 1416 ${520 + depth - 10} L 504 ${520 + depth - 10} Z`} fill="#17130F" />
          <g>
            <defs>
              <clipPath id="drawerInside">
                <path d={`M 540 530 L 1380 530 L 1416 ${520 + depth - 10} L 504 ${520 + depth - 10} Z`} />
              </clipPath>
            </defs>
            <g clipPath="url(#drawerInside)">{children}</g>
          </g>
        </g>
      ) : null}
      {/* drawer front */}
      <g transform={`translate(0 ${depth})`}>
        <rect x={470} y={520} width={980} height={260} rx={10} fill="#4A3F33" stroke={C.line} strokeWidth={5} />
        <rect x={500} y={548} width={920} height={204} rx={8} fill="none" stroke="#5A4E40" strokeWidth={4} />
        <circle cx={960} cy={650} r={30} fill="#B9A27A" />
        <rect x={954} y={636} width={12} height={30} rx={4} fill="#1A1612" />
        {/* the key */}
        <g transform={`translate(960 650) rotate(${keyTurn * 90})`}>
          <rect x={-8} y={-8} width={16} height={60} rx={4} fill="#D8C08A" />
          <circle cx={0} cy={86} r={34} fill="#D8C08A" />
          <circle cx={0} cy={86} r={12} fill="#4A3F33" />
        </g>
      </g>
    </g>
  );
};

// Weekly screen-time report: the big daily average and seven red bars. `p` 0..1 grows the bars.
export const ScreenTimeScreen: React.FC<{ sw: number; sh: number; p: number }> = ({ sw, sh, p }) => {
  const bars = [9.5, 11, 10.2, 12.4, 11.8, 13.1, 9.8];
  const base = sh * 0.72;
  return (
    <g>
      <rect width={sw} height={sh} fill="#12151C" />
      <text x={30} y={110} fontFamily={HAND} fontSize={52} fill={C.text}>
        Screen Time
      </text>
      <text x={30} y={190} fontFamily={HAND} fontSize={30} fill={C.textDim}>
        Daily average
      </text>
      <text x={30} y={290} fontFamily={HAND} fontSize={110} fill={C.red}>
        11h 4m
      </text>
      <text x={30} y={350} fontFamily={HAND} fontSize={28} fill={C.textDim}>
        up 38% from last week
      </text>
      {bars.map((b, i) => {
        const h = (b / 14) * sh * 0.3 * Math.max(0, Math.min(1, p * 1.6 - i * 0.08));
        const x = 40 + i * ((sw - 80) / 7);
        return (
          <g key={i}>
            <rect x={x} y={base - h} width={(sw - 80) / 7 - 14} height={h} rx={8} fill={C.red} opacity={0.85} />
            <text x={x + ((sw - 80) / 7 - 14) / 2} y={base + 40} textAnchor="middle" fontFamily={HAND} fontSize={26} fill={C.textDim}>
              {'MTWTFSS'[i]}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const APPS = [
  { name: 'Phone', color: '#4FBF73', keep: true },
  { name: 'Messages', color: '#4FBF73', keep: true },
  { name: 'Feed', color: '#C8434F', keep: false },
  { name: 'Clips', color: '#A3323F', keep: false },
  { name: 'Maps', color: '#3D7A9E', keep: true },
  { name: 'Shop', color: '#D4824A', keep: false },
  { name: 'Snaps', color: '#C9A93A', keep: false },
  { name: 'Camera', color: '#6A6F7A', keep: true },
  { name: 'News', color: '#8E2B37', keep: false },
  { name: 'Games', color: '#7A4E9E', keep: false },
  { name: 'Music', color: '#C8434F', keep: true },
  { name: 'Bets', color: '#5E1F2A', keep: false },
  { name: 'Mail', color: '#3D5A80', keep: true },
  { name: 'Live', color: '#B23A47', keep: false },
  { name: 'Dating', color: '#D9776F', keep: false },
  { name: 'Shorts', color: '#A3323F', keep: false },
];

// Home screen grid. Apps that aren't kept wiggle, then pop out one by one at `removeAt` (frames, in
// order of the removable apps; the last time is shared by any left over).
export const HomeScreen: React.FC<{ sw: number; sh: number; frame: number; removeAt: number[]; wiggle: boolean }> = ({ sw, frame, removeAt, wiggle }) => {
  const cols = 4;
  const cell = sw / cols;
  let k = -1;
  const removed = APPS.map((a) => {
    if (a.keep) return 1;
    k += 1;
    const at = removeAt[Math.min(k, removeAt.length - 1)] ?? 1e9;
    return Math.max(0, Math.min(1, 1 - (frame - at) / 6));
  });
  return (
    <g>
      <rect width={sw} height={1200} fill="#16202E" />
      <Glow x={sw * 0.7} y={200} r={500} color="#3D5A80" opacity={0.4} />
      {APPS.map((a, i) => {
        const x = (i % cols) * cell + cell / 2;
        const y = 150 + Math.floor(i / cols) * 190;
        const s = removed[i];
        if (s <= 0) return null;
        const rot = wiggle && !a.keep ? Math.sin(frame * 0.9 + i) * 4 : 0;
        return (
          <g key={a.name} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
            <rect x={-46} y={-46} width={92} height={92} rx={24} fill={a.color} />
            <text x={0} y={84} textAnchor="middle" fontFamily={HAND} fontSize={24} fill={C.text}>
              {a.name}
            </text>
            {wiggle && !a.keep ? <circle cx={-42} cy={-42} r={14} fill="#9A9DA5" /> : null}
          </g>
        );
      })}
    </g>
  );
};

// An open book in hand space (for nearItem): two pages, the right one turning with `turn` 0..1.
export const OpenBook: React.FC<{ turn?: number }> = ({ turn = 0 }) => (
  <g transform="translate(20 -30) rotate(-8)">
    <path d="M -60 0 L 0 8 L 60 0 L 60 -60 L 0 -52 L -60 -60 Z" fill="#E9E3D6" stroke="#BDB5A7" strokeWidth={3} />
    <line x1={0} y1={8} x2={0} y2={-52} stroke="#BDB5A7" strokeWidth={3} />
    {[0, 1, 2, 3].map((k) => (
      <line key={k} x1={-50} x2={-10} y1={-44 + k * 12} y2={-42 + k * 12} stroke="#8A8F98" strokeWidth={2} />
    ))}
    {turn > 0 && turn < 1 ? <path d={`M 0 8 L ${60 - turn * 120} ${2 - Math.sin(turn * Math.PI) * 14} L ${60 - turn * 120} ${-58 - Math.sin(turn * Math.PI) * 14} L 0 -52 Z`} fill="#F4EFE4" stroke="#BDB5A7" strokeWidth={2} /> : null}
  </g>
);

// Acoustic guitar lying across a seated lap, in scene space. (x, y) = the body's centre.
export const Guitar: React.FC<{ x: number; y: number; scale?: number; strum?: number }> = ({ x, y, scale = 1, strum = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(-18) scale(${scale})`}>
    <rect x={40} y={-14} width={300} height={28} rx={6} fill="#3A2E24" />
    <rect x={330} y={-20} width={60} height={40} rx={8} fill="#2A2018" />
    <ellipse cx={-30} cy={0} rx={110} ry={90} fill="#B5824A" />
    <ellipse cx={60} cy={0} rx={80} ry={70} fill="#B5824A" />
    <circle cx={30} cy={0} r={30} fill="#2A2018" />
    {[-8, -3, 2, 7].map((o) => (
      <line key={o} x1={-80} y1={o} x2={380} y2={o * 0.7} stroke="#E9E3D6" strokeWidth={1.5} opacity={0.7} transform={`translate(0 ${strum > 0 ? Math.sin(o + strum * 40) * strum * 2 : 0})`} />
    ))}
  </g>
);
