import React, { useId } from 'react';
import { random } from 'remotion';
import { HAND } from '../fonts';
import { C, FLOOR } from '../theme';
import { Head } from './Character';
import { Glow } from './props';

// Breakup set pieces (episode 4+): her hoodie in three states, phone typing/profile screens,
// car interior with radio, rainy window, a plant that grows back, a café table.

const useSvgId = (p: string) => `${p}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

// Her hoodie hanging over a chair back. `x` = chair back x, `y` = top of the chair back.
export const DrapedHoodie: React.FC<{ x: number; y: number; color?: string; shade?: string }> = ({ x, y, color = C.lilac, shade = C.lilacShade }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -34 -6 Q 0 -30 40 -6 L 52 120 Q 8 132 -40 120 Z" fill={color} />
    <path d="M -30 -2 Q 0 -22 36 -2 Q 0 18 -30 -2 Z" fill={shade} />
    <path d="M 40 0 Q 70 40 62 150 L 44 150 Q 46 60 34 20 Z" fill={shade} />
    <path d="M -34 0 Q -64 50 -54 160 L -38 160 Q -40 70 -26 24 Z" fill={shade} />
    <line x1={-6} y1={8} x2={-8} y2={48} stroke="#E9E4D8" strokeWidth={3} strokeLinecap="round" />
    <line x1={8} y1={8} x2={10} y2={44} stroke="#E9E4D8" strokeWidth={3} strokeLinecap="round" />
  </g>
);

// Balled-up hoodie, for holding against his chest or face (item space).
export const HoodieBundle: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <g transform={`scale(${scale})`}>
    <ellipse cx={0} cy={-6} rx={58} ry={44} fill={C.lilac} />
    <path d="M -50 -20 Q -10 -50 40 -30 Q 10 -10 -50 -20 Z" fill={C.lilacShade} />
    <path d="M 20 20 Q 60 30 70 60 L 54 66 Q 46 44 14 34 Z" fill={C.lilacShade} />
    <line x1={-12} y1={-8} x2={-16} y2={24} stroke="#E9E4D8" strokeWidth={3} strokeLinecap="round" />
  </g>
);

// Hoodie laid flat on a surface, folding: fold 0 = spread out, 1 = neat square.
export const FoldingHoodie: React.FC<{ x: number; y: number; fold: number; scale?: number }> = ({ x, y, fold, scale = 1 }) => {
  const sleeve = 1 - Math.min(1, fold * 2);
  const half = Math.max(0, fold * 2 - 1);
  const w = 150;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g transform={`scale(1 ${1 - half * 0.45})`}>
        <rect x={-w / 2} y={-180} width={w} height={180} rx={18} fill={C.lilac} />
        <path d={`M ${-w / 2} -170 L ${-w / 2 - 150 * sleeve} ${-150 + 60 * (1 - sleeve)} L ${-w / 2 - 150 * sleeve} ${-110 + 30 * (1 - sleeve)} L ${-w / 2} -120 Z`} fill={C.lilacShade} />
        <path d={`M ${w / 2} -170 L ${w / 2 + 150 * sleeve} ${-150 + 60 * (1 - sleeve)} L ${w / 2 + 150 * sleeve} ${-110 + 30 * (1 - sleeve)} L ${w / 2} -120 Z`} fill={C.lilacShade} />
        <path d="M -40 -180 Q 0 -150 40 -180" stroke={C.lilacShade} strokeWidth={10} fill="none" />
        <rect x={-46} y={-80} width={92} height={42} rx={10} fill={C.lilacShade} opacity={0.8} />
      </g>
    </g>
  );
};

export const MusicNotes: React.FC<{ x: number; y: number; frame: number; opacity?: number; color?: string }> = ({ x, y, frame, opacity = 1, color = C.text }) => (
  <g opacity={opacity}>
    {[0, 1, 2].map((i) => {
      const p = ((frame * 0.8 + i * 40) % 120) / 120;
      return (
        <g key={i} transform={`translate(${x + i * 26 + Math.sin(p * 6 + i) * 12} ${y - p * 120}) scale(${0.8 + i * 0.1})`} opacity={Math.sin(p * Math.PI)}>
          <ellipse cx={0} cy={0} rx={9} ry={7} fill={color} transform="rotate(-20)" />
          <line x1={8} y1={-2} x2={8} y2={-34} stroke={color} strokeWidth={3} />
          <path d="M 8 -34 Q 20 -28 18 -16" stroke={color} strokeWidth={3} fill="none" />
        </g>
      );
    })}
  </g>
);

// Car interior in profile, facing right. Seat at CAR.seat; wheel grip near CAR.grip.
export const CAR = { seat: FLOOR - 170, x: 960, grip: [1090, FLOOR - 372] as [number, number], radio: [1150, FLOOR - 240] as [number, number] };

export const CarInterior: React.FC<{ frame: number; day?: boolean; speed?: number; radio?: number; children?: React.ReactNode }> = ({
  frame,
  day = false,
  speed = 8,
  radio = 0,
  children,
}) => {
  const id = useSvgId('car');
  const off = frame * speed;
  return (
    <g>
      <rect width={1920} height={1080} fill={day ? '#1E2128' : '#0B0D12'} />
      <defs>
        <clipPath id={id}>
          <path d="M 330 230 L 1250 230 Q 1350 240 1420 420 L 330 420 Z" />
        </clipPath>
      </defs>
      {/* side window with the world sliding past */}
      <g clipPath={`url(#${id})`}>
        <rect x={300} y={220} width={1200} height={220} fill={day ? '#5B6B7D' : '#121826'} />
        {day ? <circle cx={1100} cy={280} r={50} fill={C.amber} opacity={0.8} /> : null}
        {Array.from({ length: 10 }).map((_, i) => {
          const px = ((i * 260 - off) % 2600 + 2600) % 2600 - 200;
          return day ? (
            <g key={i}>
              <rect x={px} y={330} width={14} height={120} fill="#2A3328" />
              <circle cx={px + 7} cy={320} r={50} fill="#34412F" />
            </g>
          ) : (
            <g key={i}>
              <Glow x={px} y={300} r={70} color="#E8C27A" opacity={0.6} />
              <circle cx={px} cy={300} r={6} fill="#F3D9A8" />
            </g>
          );
        })}
      </g>
      <path d="M 330 230 L 1250 230 Q 1350 240 1420 420 L 330 420 Z" fill="none" stroke={C.line} strokeWidth={10} />
      <line x1={800} x2={800} y1={230} y2={420} stroke={C.line} strokeWidth={14} />
      {/* door + body */}
      <rect x={0} y={420} width={1920} height={660} fill={day ? '#2A2E36' : '#15171C'} />
      <path d="M 0 420 L 1920 420" stroke={C.line} strokeWidth={4} />
      {/* seat */}
      <path transform="translate(290 0)" d={`M 560 ${CAR.seat - 290} Q 520 ${CAR.seat - 300} 520 ${CAR.seat - 250} L 560 ${CAR.seat + 10} L 840 ${CAR.seat + 10} Q 860 ${CAR.seat - 30} 820 ${CAR.seat - 30} L 640 ${CAR.seat - 30} L 620 ${CAR.seat - 290} Z`} fill="#22262E" stroke={C.line} strokeWidth={3} />
      {children}
      {/* dashboard + wheel in front of him */}
      <path d={`M 1190 ${FLOOR - 330} L 1920 ${FLOOR - 380} L 1920 ${FLOOR - 160} L 1170 ${FLOOR - 180} Z`} fill="#1B1E25" stroke={C.line} strokeWidth={3} />
      <g transform={`translate(${CAR.radio[0]} ${CAR.radio[1]})`}>
        <rect x={-60} y={-24} width={120} height={44} rx={8} fill="#0D0F12" stroke={C.line} strokeWidth={2} />
        <rect x={-46} y={-12} width={92} height={20} rx={4} fill={radio > 0 ? C.amber : '#1E2128'} opacity={0.3 + radio * 0.6} />
      </g>
      {radio > 0 ? <MusicNotes x={CAR.radio[0] + 40} y={CAR.radio[1] - 40} frame={frame} opacity={radio} color={C.amber} /> : null}
      <g transform={`translate(1118 ${FLOOR - 318}) rotate(-18)`}>
        <ellipse cx={0} cy={0} rx={22} ry={96} fill="none" stroke="#2E333D" strokeWidth={18} />
        <line x1={0} y1={0} x2={60} y2={20} stroke="#2E333D" strokeWidth={14} />
      </g>
    </g>
  );
};

// Window with rain that can clear to sun. rain/sun 0..1.
export const RainWindow: React.FC<{ x: number; y: number; w?: number; h?: number; rain: number; sun: number; frame: number }> = ({ x, y, w = 420, h = 440, rain, sun, frame }) => {
  const id = useSvgId('rw');
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={id}>
          <rect width={w} height={h} rx={10} />
        </clipPath>
      </defs>
      <rect width={w} height={h} rx={10} fill="#232A36" />
      <g clipPath={`url(#${id})`}>
        <rect width={w} height={h} fill="#6C7F95" opacity={sun * 0.6} />
        <circle cx={w * 0.7} cy={h * 0.3} r={60} fill={C.amber} opacity={sun} />
        <Glow x={w * 0.7} y={h * 0.3} r={300} color={C.amber} opacity={sun * 0.6} />
        {Array.from({ length: 50 }).map((_, i) => {
          const rx = random(`r${i}`) * w;
          const ry = ((random(`ry${i}`) * h + frame * (14 + random(`rs${i}`) * 8)) % (h + 60)) - 40;
          return <line key={i} x1={rx} y1={ry} x2={rx - 4} y2={ry + 30} stroke="#AFC3DA" strokeWidth={2} opacity={rain * 0.55} />;
        })}
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={`d${i}`} cx={random(`dx${i}`) * w} cy={random(`dy${i}`) * h} r={3 + random(`dr${i}`) * 4} fill="#AFC3DA" opacity={rain * 0.35} />
        ))}
      </g>
      <rect width={w} height={h} rx={10} fill="none" stroke={C.line} strokeWidth={8} />
      <line x1={w / 2} x2={w / 2} y1={0} y2={h} stroke={C.line} strokeWidth={8} />
      <rect x={-20} y={h} width={w + 40} height={18} rx={6} fill={C.furnitureLight} stroke={C.line} strokeWidth={3} />
    </g>
  );
};

// Potted plant on a sill/table at (x, y). growth 0..1 adds leaves; wilt 0..1 droops them.
export const Plant: React.FC<{ x: number; y: number; growth: number; wilt?: number; scale?: number }> = ({ x, y, growth, wilt = 0, scale = 1 }) => {
  const leaves = [
    [-1, 30],
    [1, 50],
    [-1, 72],
    [1, 92],
    [-1, 110],
  ];
  const n = 2 + growth * 3;
  const stem = 60 + growth * 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={`M 0 0 Q ${wilt * 30} ${-stem * 0.6} ${wilt * 50} ${-stem + wilt * 30}`} stroke="#4D6B47" strokeWidth={6} fill="none" strokeLinecap="round" />
      {leaves.map(([side, at], i) => {
        const a = Math.max(0, Math.min(1, n - i));
        if (a <= 0) return null;
        const ly = -Math.min(at, stem - 10);
        return (
          <ellipse
            key={i}
            cx={side * 20 * a + wilt * (at / 3)}
            cy={ly + wilt * at * 0.3}
            rx={22 * a}
            ry={10 * a}
            fill={wilt > 0.5 ? '#6B6A44' : '#5E8A55'}
            transform={`rotate(${side * (-30 + wilt * 60)} ${side * 20 * a + wilt * (at / 3)} ${ly + wilt * at * 0.3})`}
          />
        );
      })}
      <path d="M -40 0 L 40 0 L 30 60 L -30 60 Z" fill="#9C5E44" />
      <rect x={-46} y={-8} width={92} height={14} rx={4} fill="#B06C4F" />
    </g>
  );
};

export const CafeTable: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <ellipse cx={0} cy={FLOOR - 250} rx={170} ry={16} fill={C.wood} stroke={C.line} strokeWidth={3} />
    <rect x={-8} y={FLOOR - 250} width={16} height={250} fill={C.furniture} />
    <ellipse cx={0} cy={FLOOR - 2} rx={70} ry={8} fill={C.furniture} />
  </g>
);

// ---------- phone screens ----------

const LenaAvatar: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 30 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#3A3445" />
    <Head x={0} y={r * 0.1} scale={r / 100} variant="lena" eyes="happy" mouth="smile" />
  </g>
);

// The chat with Lena: old messages, then whatever he's typing (and deleting) in the input bar.
export const TypingScreen: React.FC<{ sw: number; sh: number; typed: string; caret: boolean; lastSeen: string }> = ({ sw, sh, typed, caret, lastSeen }) => (
  <g>
    <rect width={sw} height={130} fill="#141922" />
    <LenaAvatar x={70} y={70} r={34} />
    <text x={120} y={66} fontFamily={HAND} fontSize={32} fill={C.text}>
      Lena
    </text>
    <text x={120} y={98} fontFamily={HAND} fontSize={22} fill={C.textDim}>
      {lastSeen}
    </text>
    <line x1={0} x2={sw} y1={130} y2={130} stroke={C.lineSoft} strokeWidth={2} />
    <text x={sw / 2} y={200} textAnchor="middle" fontFamily={HAND} fontSize={24} fill={C.textDim}>
      3 weeks ago
    </text>
    <rect x={24} y={226} width={330} height={62} rx={26} fill="#2C3038" />
    <text x={44} y={267} fontFamily={HAND} fontSize={30} fill={C.text}>
      i think we need space.
    </text>
    <rect x={sw - 24 - 90} y={306} width={90} height={62} rx={26} fill="#3D5A80" />
    <text x={sw - 24 - 70} y={347} fontFamily={HAND} fontSize={30} fill={C.text}>
      ok.
    </text>
    {/* input + keyboard */}
    <rect x={0} y={sh - 420} width={sw} height={420} fill="#1A1E26" />
    <rect x={20} y={sh - 400} width={sw - 40} height={64} rx={32} fill="#2A2F39" />
    <text x={46} y={sh - 357} fontFamily={HAND} fontSize={30} fill={typed ? C.text : C.textDim}>
      {typed || 'Message'}
      {caret ? '|' : ''}
    </text>
    {Array.from({ length: 30 }).map((_, i) => (
      <rect key={i} x={20 + (i % 10) * ((sw - 40) / 10) + 3} y={sh - 310 + Math.floor(i / 10) * 74} width={(sw - 40) / 10 - 6} height={62} rx={8} fill="#2E333D" />
    ))}
  </g>
);

// Her profile: header and a grid of photos where she's happy without him. `zoom` 0..1 enlarges the first photo.
export const ProfileScreen: React.FC<{ sw: number; sh: number; zoom: number }> = ({ sw, zoom }) => {
  const cell = (sw - 12) / 3;
  const photo = (i: number) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return { x: 4 + col * (cell + 2), y: 300 + row * (cell + 2) };
  };
  const big = photo(0);
  const bx = big.x * (1 - zoom);
  const by = big.y * (1 - zoom) + 140 * zoom;
  const bs = cell + (sw - cell) * zoom;
  return (
    <g>
      <LenaAvatar x={80} y={110} r={56} />
      <text x={160} y={104} fontFamily={HAND} fontSize={38} fill={C.text}>
        lena
      </text>
      <text x={160} y={142} fontFamily={HAND} fontSize={24} fill={C.textDim}>
        new chapter
      </text>
      {Array.from({ length: 9 }).map((_, i) => {
        if (i === 0) return null;
        const p = photo(i);
        return <rect key={i} x={p.x} y={p.y} width={cell} height={cell} fill={['#4A3E52', '#3E4A52', '#52463E', '#3E5246', '#4A4A3E'][i % 5]} />;
      })}
      <g transform={`translate(${bx} ${by})`}>
        <rect width={bs} height={bs} fill="#5B4A3E" />
        <circle cx={bs * 0.75} cy={bs * 0.25} r={bs * 0.14} fill={C.amber} opacity={0.8} />
        <Head x={bs * 0.3} y={bs * 0.58} scale={bs / 520} variant="her" eyes="happy" mouth="grin" />
        <Head x={bs * 0.55} y={bs * 0.55} scale={bs / 500} variant="lena" eyes="happy" mouth="grin" blush={0.6} />
        <Head x={bs * 0.8} y={bs * 0.6} scale={bs / 540} variant="her" eyes="open" mouth="smile" />
      </g>
    </g>
  );
};
