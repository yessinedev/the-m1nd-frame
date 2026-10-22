import React from 'react';
import { HAND } from '../fonts';
import { C, FLOOR } from '../theme';
import { Glow } from './props';

// Shoe set pieces (episode 12+): a big sneaker, her flat (new → taped and split), a shoe box,
// the hallway shoe rack, a wallet, her budget notebook, rain, and a shoe-shop wall.

// His sneaker in profile, toe to the right. ~560 px long at scale 1. `shine` adds a gleam.
export const Sneaker: React.FC<{ x: number; y: number; scale?: number; shine?: number; color?: string; rotate?: number }> = ({ x, y, scale = 1, shine = 0, color = '#F2EEE6', rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <path d="M -280 40 L -280 -40 Q -280 -110 -200 -120 L -60 -150 Q 20 -150 60 -100 L 120 -60 Q 260 -40 280 10 L 280 40 Z" fill={color} />
    <rect x={-290} y={30} width={580} height={44} rx={20} fill="#D8D2C6" />
    <rect x={-290} y={60} width={580} height={14} rx={7} fill="#BDB5A7" />
    <path d="M -180 -10 Q -40 -90 140 -40" stroke={C.amber} strokeWidth={22} fill="none" strokeLinecap="round" />
    {[0, 1, 2, 3].map((k) => (
      <line key={k} x1={-60 + k * 34} y1={-140 + k * 10} x2={-30 + k * 34} y2={-110 + k * 12} stroke="#BDB5A7" strokeWidth={8} strokeLinecap="round" />
    ))}
    <path d="M -200 -120 Q -230 -170 -150 -168 L -90 -150" fill={color} stroke="#D8D2C6" strokeWidth={4} />
    {shine > 0 ? (
      <g opacity={shine}>
        <path d="M -220 -60 L -120 -110" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.8} />
        {[[-160, -190], [200, -110], [40, -200]].map(([sx, sy], i) => (
          <path key={i} d={`M ${sx} ${sy - 22} L ${sx + 6} ${sy - 6} L ${sx + 22} ${sy} L ${sx + 6} ${sy + 6} L ${sx} ${sy + 22} L ${sx - 6} ${sy + 6} L ${sx - 22} ${sy} L ${sx - 6} ${sy - 6} Z`} fill={C.amber} />
        ))}
      </g>
    ) : null}
  </g>
);

// Her flat shoe in profile, toe to the right. `worn` 0..1: scuffs, tape, a split sole, a hole.
export const Flat: React.FC<{ x: number; y: number; scale?: number; worn?: number; color?: string; rotate?: number; flap?: number }> = ({ x, y, scale = 1, worn = 0, color = '#6A4A34', rotate = 0, flap = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    {/* sole, the toe end peeling away by `flap` degrees */}
    <rect x={-270} y={30} width={300} height={22} rx={10} fill="#2A231C" />
    <g transform={`translate(30 41) rotate(${flap})`}>
      <rect x={0} y={-11} width={240} height={22} rx={10} fill="#2A231C" />
    </g>
    <path d="M -270 40 L -260 -40 Q -250 -90 -170 -90 L -40 -70 Q 120 -70 220 -20 Q 270 10 270 40 Z" fill={color} />
    <path d="M -150 -76 Q -40 -30 80 -62" stroke="#00000033" strokeWidth={6} fill="none" />
    {worn > 0 ? (
      <g>
        {/* scuffs */}
        {[[-120, 0], [40, -10], [160, 10], [-200, 10]].map(([sx, sy], i) => (
          <ellipse key={i} cx={sx} cy={sy} rx={30} ry={8} fill="#B9A890" opacity={worn * 0.35} transform={`rotate(-8 ${sx} ${sy})`} />
        ))}
        {/* hole over the little toe */}
        <ellipse cx={170} cy={-14} rx={26 * worn} ry={16 * worn} fill="#120E0B" />
        {/* tape wrapped round the middle */}
        {worn > 0.4 ? (
          <g opacity={Math.min(1, (worn - 0.4) * 3)}>
            <rect x={-60} y={-80} width={46} height={130} fill="#B8B4AA" transform="rotate(8 -37 -15)" />
            <rect x={-10} y={-76} width={40} height={126} fill="#A8A49A" transform="rotate(-6 10 -13)" />
          </g>
        ) : null}
        {/* split at the toe */}
        {worn > 0.6 ? <path d="M 200 40 L 270 40 L 262 22 Z" fill="#120E0B" opacity={Math.min(1, (worn - 0.6) * 3)} /> : null}
        {/* stitches where she sewed it */}
        {worn > 0.7 ? [0, 1, 2, 3, 4].map((k) => <line key={k} x1={-230 + k * 22} y1={-30} x2={-222 + k * 22} y2={-10} stroke="#D8D2C6" strokeWidth={4} opacity={(worn - 0.7) * 3} />) : null}
      </g>
    ) : null}
  </g>
);

// Shoe box seen from the front, lid lifting off up and to the left by `open` 0..1.
export const ShoeBox: React.FC<{ x: number; y: number; scale?: number; open?: number; color?: string }> = ({ x, y, scale = 1, open = 0, color = '#C8434F' }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-300} y={-160} width={600} height={160} rx={6} fill={color} />
    <rect x={-300} y={-160} width={600} height={160} rx={6} fill="#000000" opacity={0.15} />
    <path d="M -280 -160 Q -150 -230 0 -170 Q 150 -230 280 -160" fill="#F4EEE6" opacity={open} />
    <g transform={`translate(${-open * 200} ${-open * 260}) rotate(${-open * 18})`}>
      <rect x={-316} y={-196} width={632} height={50} rx={6} fill={color} />
      <text x={0} y={-162} textAnchor="middle" fontFamily={HAND} fontSize={30} letterSpacing="0.2em" fill="#F4EEE6">
        RUN
      </text>
    </g>
  </g>
);

export type RackShoe = { kind: 'sneaker' | 'boot' | 'cleat' | 'flat'; color: string; worn?: number };

const SmallShoe: React.FC<{ s: RackShoe }> = ({ s }) => {
  if (s.kind === 'flat') return <Flat x={0} y={-10} scale={0.22} worn={s.worn} color={s.color} />;
  if (s.kind === 'boot')
    return (
      <g>
        <path d="M -50 0 L -50 -70 L -10 -70 L -6 -24 Q 50 -24 56 0 Z" fill={s.color} />
        <rect x={-54} y={-6} width={114} height={10} rx={4} fill="#2A231C" />
      </g>
    );
  if (s.kind === 'cleat')
    return (
      <g>
        <Sneaker x={0} y={-14} scale={0.2} color={s.color} />
        {[-40, -10, 20, 46].map((cx) => <rect key={cx} x={cx} y={2} width={8} height={8} fill="#1A1B20" />)}
      </g>
    );
  return <Sneaker x={0} y={-14} scale={0.2} color={s.color} />;
};

// Hallway shoe rack: two shelves, shoes left to right. `x` = left edge, bottom shelf on the floor.
export const ShoeRack: React.FC<{ x: number; top: RackShoe[]; bottom: RackShoe[] }> = ({ x, top, bottom }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={0} y={FLOOR - 220} width={520} height={14} rx={4} fill={C.wood} stroke={C.line} strokeWidth={2} />
    <rect x={0} y={FLOOR - 90} width={520} height={14} rx={4} fill={C.wood} stroke={C.line} strokeWidth={2} />
    <rect x={0} y={FLOOR - 220} width={14} height={220} fill={C.furniture} />
    <rect x={506} y={FLOOR - 220} width={14} height={220} fill={C.furniture} />
    {top.map((s, i) => (
      <g key={`t${i}`} transform={`translate(${80 + i * 130} ${FLOOR - 222})`}>
        <SmallShoe s={s} />
      </g>
    ))}
    {bottom.map((s, i) => (
      <g key={`b${i}`} transform={`translate(${80 + i * 130} ${FLOOR - 92})`}>
        <SmallShoe s={s} />
      </g>
    ))}
  </g>
);

// Her wallet, open, close up: `bills` notes and a few coins. The notes slide out by `out` 0..1.
export const Wallet: React.FC<{ x: number; y: number; bills: number; out?: number }> = ({ x, y, bills, out = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-260} y={-150} width={520} height={300} rx={30} fill="#5A3A2C" />
    <rect x={-240} y={-130} width={480} height={120} rx={16} fill="#4A2E22" />
    {Array.from({ length: bills }).map((_, i) => (
      <g key={i} transform={`translate(${i * 14 + out * 120} ${-150 - i * 6 - out * 120})`}>
        <rect x={-180} y={0} width={340} height={150} rx={8} fill="#8FB08A" stroke="#6F8F6A" strokeWidth={3} />
        <circle cx={0} cy={75} r={34} fill="#6F8F6A" />
      </g>
    ))}
    <rect x={-260} y={-20} width={520} height={170} rx={30} fill="#6A4434" />
    {[[-150, 70], [-100, 90], [-60, 64]].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r={22} fill="#C9A93A" stroke="#9A7E2A" strokeWidth={3} />
    ))}
  </g>
);

export type LedgerLine = { text: string; amount: string; cross?: number; at: number; strong?: boolean };

// Her budget notebook, close up: lined page, handwriting appears at `at` (frames), a red strike
// draws through lines by `cross` 0..1.
export const Ledger: React.FC<{ x: number; y: number; frame: number; title: string; lines: LedgerLine[] }> = ({ x, y, frame, title, lines }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-520} y={-380} width={1040} height={760} rx={10} fill="#ECE6D6" />
    {Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1={-500} x2={500} y1={-250 + i * 56} y2={-250 + i * 56} stroke="#B7C4D6" strokeWidth={2} />
    ))}
    <line x1={-420} x2={-420} y1={-380} y2={380} stroke="#D9776F" strokeWidth={3} />
    <text x={-390} y={-280} fontFamily={HAND} fontSize={52} fill="#2A2622">
      {title}
    </text>
    {lines.map((l, i) => {
      const a = Math.max(0, Math.min(1, (frame - l.at) / 8));
      const ly = -205 + i * 96;
      return (
        <g key={i} opacity={a}>
          <text x={-390} y={ly} fontFamily={HAND} fontSize={48} fill={l.strong ? '#8E2B37' : '#2A2622'}>
            {l.text}
          </text>
          <text x={470} y={ly} textAnchor="end" fontFamily={HAND} fontSize={48} fill="#2A2622">
            {l.amount}
          </text>
          {l.cross ? <line x1={-400} x2={-400 + 600 * l.cross} y1={ly - 16} y2={ly - 12} stroke={C.red} strokeWidth={7} strokeLinecap="round" /> : null}
        </g>
      );
    })}
  </g>
);

// Diagonal rain across the frame.
export const Rain: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 1 }) => (
  <g opacity={opacity}>
    {Array.from({ length: 90 }).map((_, i) => {
      const x = ((i * 137) % 2100) - 100 - ((frame * 6) % 60);
      const y = ((i * 89 + frame * 38) % 1180) - 100;
      return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 34} stroke="#9FB6D9" strokeOpacity={0.35} strokeWidth={2.5} />;
    })}
  </g>
);

// Shoe shop wall: three shelves of shoes under a warm light.
export const ShopWall: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#221D18" />
    <Glow x={960} y={200} r={900} color={C.amber} opacity={0.18} />
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <rect x={180} y={240 + r * 170} width={1560} height={14} rx={4} fill={C.wood} />
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} transform={`translate(${280 + i * 170} ${236 + r * 170})`}>
            {(i + r) % 3 === 0 ? (
              <Flat x={0} y={-10} scale={0.22} color={['#8E5A3C', '#3D5A80', '#6A4A70'][(i + r) % 3]} />
            ) : (
              <Sneaker x={0} y={-14} scale={0.2} color={['#F2EEE6', '#3A3F4A', '#C8434F', '#5F6B4F'][(i * 3 + r) % 4]} />
            )}
          </g>
        ))}
      </g>
    ))}
    <rect y={FLOOR} width={1920} height={1080 - FLOOR} fill="#16130F" />
  </g>
);
