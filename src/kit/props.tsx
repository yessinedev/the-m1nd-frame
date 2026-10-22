import React, { useId } from 'react';
import { random } from 'remotion';
import { C, FLOOR } from '../theme';

// Set pieces. All are SVG groups in the 1920×1080 stage. Thin grey line art on near-black,
// so the scene's single accent (red habit / amber growth) carries the eye.

const useSvgId = (p: string) => `${p}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

export const Glow: React.FC<{ x: number; y: number; r: number; color: string; opacity?: number; sy?: number }> = ({
  x,
  y,
  r,
  color,
  opacity = 1,
  sy = 1,
}) => {
  const id = useSvgId('glow');
  if (opacity <= 0.001) return null;
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={color} stopOpacity={0.55} />
          <stop offset="35%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={r} ry={r * sy} fill={`url(#${id})`} />
    </g>
  );
};

export const Room: React.FC<{ day?: boolean; wall?: string }> = ({ day = false, wall }) => (
  <g>
    <rect width={1920} height={1080} fill={wall ?? (day ? C.wallDay : C.wall)} />
    <rect y={FLOOR} width={1920} height={1080 - FLOOR} fill={C.floor} />
    <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    <line x1={0} x2={1920} y1={FLOOR - 22} y2={FLOOR - 22} stroke={C.lineSoft} strokeWidth={2} />
  </g>
);

export type Sky = 'night' | 'dawn' | 'day';

export const Window: React.FC<{ x: number; y: number; w?: number; h?: number; sky?: Sky; sunY?: number }> = ({
  x,
  y,
  w = 220,
  h = 230,
  sky = 'night',
  sunY = 0.75,
}) => {
  const id = useSvgId('win');
  const fill = sky === 'night' ? C.skyNight : sky === 'dawn' ? C.skyDawn : '#2B3240';
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={id}>
          <rect width={w} height={h} rx={10} />
        </clipPath>
      </defs>
      <rect width={w} height={h} rx={10} fill={fill} />
      <g clipPath={`url(#${id})`}>
        {sky === 'night' ? <circle cx={w * 0.68} cy={h * 0.3} r={26} fill={C.moon} /> : null}
        {sky === 'dawn' ? (
          <>
            <circle cx={w * 0.55} cy={h * sunY} r={48} fill={C.amber} />
            <rect y={h * 0.82} width={w} height={h} fill="#1A1714" />
          </>
        ) : null}
      </g>
      <rect width={w} height={h} rx={10} fill="none" stroke={C.line} strokeWidth={5} />
      <line x1={w / 2} x2={w / 2} y1={0} y2={h} stroke={C.line} strokeWidth={5} />
      <line x1={0} x2={w} y1={h / 2} y2={h / 2} stroke={C.line} strokeWidth={5} />
    </g>
  );
};

// Soft shaft of light from a window down to the floor.
export const LightBeam: React.FC<{ x: number; y: number; w: number; toX: number; color?: string; opacity?: number }> = ({
  x,
  y,
  w,
  toX,
  color = '#FFFFFF',
  opacity = 0.06,
}) => {
  const id = useSvgId('beam');
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.2} />
        </linearGradient>
      </defs>
      <polygon points={`${x},${y} ${x + w},${y} ${toX + w * 1.6},${FLOOR + 60} ${toX},${FLOOR + 60}`} fill={`url(#${id})`} />
    </g>
  );
};

export const BED = { height: 150, headboard: 290 };

// Bed with headboard on the left. `x` = left edge. Mattress top sits at FLOOR - 150.
export const Bed: React.FC<{ x: number; w?: number; pillow?: boolean }> = ({ x, w = 760, pillow = true }) => {
  const top = FLOOR - BED.height;
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={FLOOR - BED.headboard} width={28} height={BED.headboard} rx={12} fill={C.furniture} stroke={C.line} strokeWidth={3} />
      <rect x={w - 20} y={FLOOR - 190} width={20} height={190} rx={8} fill={C.furniture} stroke={C.line} strokeWidth={3} />
      <rect x={20} y={top + 50} width={w - 34} height={46} rx={8} fill={C.furniture} stroke={C.line} strokeWidth={3} />
      <rect x={26} y={FLOOR - 56} width={18} height={56} fill={C.furniture} stroke={C.line} strokeWidth={3} />
      <rect x={w - 46} y={FLOOR - 56} width={18} height={56} fill={C.furniture} stroke={C.line} strokeWidth={3} />
      <rect x={28} y={top} width={w - 50} height={54} rx={16} fill={C.furnitureLight} stroke={C.line} strokeWidth={3} />
      {pillow ? <rect x={44} y={top - 42} width={150} height={52} rx={24} fill={C.pillow} /> : null}
    </g>
  );
};

// Blanket mound over a lying body (head on the pillow at the left end of the bed).
export const Blanket: React.FC<{ x: number; w?: number; breathe?: number; rise?: number }> = ({ x, w = 760, breathe = 0, rise = 0 }) => {
  const top = FLOOR - BED.height;
  const b = Math.sin(breathe * 0.07) * 3;
  const r = rise;
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d={`M 150 ${top + 40}
            C 150 ${top - 70 - b - r}, 330 ${top - 92 - b - r}, 430 ${top - 72 - b - r * 0.5}
            C 520 ${top - 56}, 600 ${top - 64}, ${w - 70} ${top - 40}
            Q ${w - 20} ${top - 30} ${w - 26} ${top + 60}
            L 150 ${top + 60} Z`}
        fill={C.blanket}
        stroke={C.line}
        strokeWidth={3}
      />
      <path d={`M 170 ${top + 20} C 260 ${top - 10}, 380 ${top - 10}, 470 ${top + 6}`} stroke={C.blanketShade} strokeWidth={10} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const NIGHTSTAND = { w: 200, h: 150 };

export const Nightstand: React.FC<{ x: number; drawer?: number; children?: React.ReactNode }> = ({ x, drawer = 0, children }) => {
  const top = FLOOR - NIGHTSTAND.h;
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={top} width={NIGHTSTAND.w} height={NIGHTSTAND.h} rx={10} fill={C.furniture} stroke={C.line} strokeWidth={3} />
      {/* drawer: interior shows as it slides out toward the viewer (down/right) */}
      <rect x={14} y={top + 26} width={NIGHTSTAND.w - 28} height={46} rx={6} fill="#060708" />
      <g transform={`translate(${drawer * 26} ${drawer * 40})`}>
        <rect x={14} y={top + 26} width={NIGHTSTAND.w - 28} height={46} rx={6} fill={C.furnitureLight} stroke={C.line} strokeWidth={3} />
        <rect x={NIGHTSTAND.w / 2 - 16} y={top + 46} width={32} height={6} rx={3} fill={C.line} />
      </g>
      <line x1={14} x2={NIGHTSTAND.w - 14} y1={top + 98} y2={top + 98} stroke={C.lineSoft} strokeWidth={3} />
      {children}
    </g>
  );
};

// Seven-segment display.
const SEG: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abged',
  '3': 'abgcd',
  '4': 'fgbc',
  '5': 'afgcd',
  '6': 'afgedc',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
};

const Digit: React.FC<{ d: string; color: string; dim: string }> = ({ d, color, dim }) => {
  const W = 30;
  const H = 54;
  const T = 7;
  const segs: Record<string, [number, number, number, number]> = {
    a: [T, 0, W - 2 * T, T],
    g: [T, H / 2 - T / 2, W - 2 * T, T],
    d: [T, H - T, W - 2 * T, T],
    f: [0, T, T, H / 2 - T * 1.5],
    b: [W - T, T, T, H / 2 - T * 1.5],
    e: [0, H / 2 + T / 2, T, H / 2 - T * 1.5],
    c: [W - T, H / 2 + T / 2, T, H / 2 - T * 1.5],
  };
  const on = SEG[d] ?? '';
  return (
    <g>
      {Object.entries(segs).map(([k, [x, y, w, h]]) => (
        <rect key={k} x={x} y={y} width={w} height={h} rx={3} fill={on.includes(k) ? color : dim} />
      ))}
    </g>
  );
};

// Bedside clock. `text` like "01:12". `ring` 0..1 shakes it and draws alarm marks.
export const DigitalClock: React.FC<{ x: number; y: number; text: string; color?: string; ring?: number; frame?: number; scale?: number; colon?: boolean }> = ({
  x,
  y,
  text,
  color = C.red,
  ring = 0,
  frame = 0,
  scale = 1,
  colon = true,
}) => {
  const id = useSvgId('clk');
  const shake = ring > 0 ? Math.sin(frame * 2.1) * 4 * ring : 0;
  const digits = text.replace(':', '').padStart(4, ' ').split('');
  return (
    <g transform={`translate(${x + shake} ${y}) scale(${scale})`}>
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
      </defs>
      <rect x={-12} y={-14} width={190} height={84} rx={14} fill="#121317" stroke={C.line} strokeWidth={3} />
      <g filter={`url(#${id})`} opacity={0.55}>
        <ClockDigits digits={digits} color={color} dim="transparent" colon={colon} />
      </g>
      <ClockDigits digits={digits} color={color} dim="#1E1F24" colon={colon} />
      {ring > 0 ? (
        <g stroke={color} strokeWidth={5} strokeLinecap="round" opacity={ring}>
          <line x1={-36} y1={-10} x2={-52} y2={-28} />
          <line x1={-40} y1={18} x2={-62} y2={14} />
          <line x1={200} y1={-10} x2={216} y2={-28} />
          <line x1={204} y1={18} x2={226} y2={14} />
        </g>
      ) : null}
    </g>
  );
};

const ClockDigits: React.FC<{ digits: string[]; color: string; dim: string; colon: boolean }> = ({ digits, color, dim, colon }) => (
  <g>
    {digits.map((d, i) => (
      <g key={i} transform={`translate(${i * 38 + (i >= 2 ? 16 : 0)} 0)`}>
        <Digit d={d} color={color} dim={dim} />
      </g>
    ))}
    {colon ? (
      <g fill={color}>
        <rect x={75} y={13} width={7} height={7} rx={2} />
        <rect x={75} y={34} width={7} height={7} rx={2} />
      </g>
    ) : null}
  </g>
);

// Phone. `flat` = lying screen-up on a surface (seen edge-on). Otherwise held upright, screen toward him.
export const Phone: React.FC<{ x: number; y: number; on?: number; color?: string; flat?: boolean; scale?: number; rotate?: number }> = ({
  x,
  y,
  on = 0,
  color = C.screen,
  flat = false,
  scale = 1,
  rotate = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    {flat ? (
      <>
        <Glow x={0} y={-30} r={120} color={color} opacity={on} sy={0.7} />
        <rect x={-34} y={-8} width={68} height={10} rx={4} fill="#0A0B0D" stroke={C.line} strokeWidth={2.5} />
        <rect x={-30} y={-8} width={60} height={3} rx={1.5} fill={color} opacity={on} />
      </>
    ) : (
      <>
        <Glow x={0} y={0} r={170} color={color} opacity={on * 0.9} />
        <rect x={-19} y={-34} width={38} height={68} rx={7} fill="#0A0B0D" stroke={C.line} strokeWidth={2.5} />
        <rect x={-15} y={-29} width={30} height={58} rx={4} fill={color} opacity={on} />
      </>
    )}
  </g>
);

export const Calendar: React.FC<{ x: number; y: number; marks: number[]; frame: number; color?: string }> = ({ x, y, marks, frame, color = C.red }) => {
  const W = 380;
  const H = 320;
  const cw = W / 7;
  const ch = (H - 70) / 5;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={W} height={H} rx={10} fill="#D9D4C9" />
      <rect width={W} height={56} rx={10} fill="#BEB7AA" />
      <circle cx={70} cy={0} r={8} fill={C.line} />
      <circle cx={W - 70} cy={0} r={8} fill={C.line} />
      {Array.from({ length: 35 }).map((_, i) => {
        const cx = (i % 7) * cw;
        const cy = 66 + Math.floor(i / 7) * ch;
        const mark = marks[i];
        const p = mark === undefined ? 0 : Math.max(0, Math.min(1, (frame - mark) / 6));
        return (
          <g key={i} transform={`translate(${cx + 6} ${cy})`}>
            <rect width={cw - 12} height={ch - 8} rx={4} fill="#CBC5B8" />
            {p > 0 ? (
              <g stroke={color} strokeWidth={6} strokeLinecap="round">
                <line x1={8} y1={6} x2={8 + (cw - 28) * Math.min(1, p * 2)} y2={6 + (ch - 20) * Math.min(1, p * 2)} />
                {p > 0.5 ? <line x1={cw - 20} y1={6} x2={cw - 20 - (cw - 28) * (p - 0.5) * 2} y2={6 + (ch - 20) * (p - 0.5) * 2} /> : null}
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

// Desk, `x` = left edge. Top surface at FLOOR - 230.
export const DESK = { top: FLOOR - 230, w: 520 };

export const Desk: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={0} y={DESK.top} width={DESK.w} height={26} rx={6} fill={C.furnitureLight} stroke={C.line} strokeWidth={3} />
    <rect x={24} y={DESK.top + 26} width={18} height={204} fill={C.furniture} stroke={C.line} strokeWidth={3} />
    <rect x={DESK.w - 42} y={DESK.top + 26} width={18} height={204} fill={C.furniture} stroke={C.line} strokeWidth={3} />
  </g>
);

export const Stool: React.FC<{ x: number; top: number }> = ({ x, top }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-70} y={top} width={140} height={22} rx={8} fill={C.furnitureLight} stroke={C.line} strokeWidth={3} />
    <rect x={-54} y={top + 22} width={14} height={FLOOR - top - 22} fill={C.furniture} stroke={C.line} strokeWidth={3} />
    <rect x={40} y={top + 22} width={14} height={FLOOR - top - 22} fill={C.furniture} stroke={C.line} strokeWidth={3} />
  </g>
);

// Laptop seen from the side: base on the desk, screen tilted toward him (we see its back).
export const Laptop: React.FC<{ x: number; y: number; on?: number; facing?: 1 | -1 }> = ({ x, y, on = 0.6, facing = -1 }) => (
  <g transform={`translate(${x} ${y}) scale(${facing} 1)`}>
    <Glow x={-60} y={-80} r={180} color={C.screen} opacity={on * 0.5} />
    <rect x={-90} y={-8} width={150} height={10} rx={4} fill={C.furnitureLight} stroke={C.line} strokeWidth={2.5} />
    <g transform="translate(58 -2) rotate(-102)">
      <rect x={0} y={-6} width={130} height={12} rx={4} fill={C.furnitureLight} stroke={C.line} strokeWidth={2.5} />
    </g>
  </g>
);

// Pile of loose sheets; `count` grows as work piles up.
export const Papers: React.FC<{ x: number; y: number; count: number }> = ({ x, y, count }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: Math.floor(count) }).map((_, i) => (
      <rect key={i} x={-60 + random(`px${i}`) * 14} y={-6 - i * 6} width={120} height={5} rx={2} fill={i % 2 ? '#CFC9BD' : '#BDB6A9'} transform={`rotate(${(random(`pr${i}`) - 0.5) * 8})`} />
    ))}
  </g>
);

export const Lamp: React.FC<{ x: number; y: number; on?: number; color?: string }> = ({ x, y, on = 1, color = C.amber }) => (
  <g transform={`translate(${x} ${y})`}>
    <Glow x={40} y={-90} r={340} color={color} opacity={on * 0.75} sy={0.8} />
    <ellipse cx={0} cy={0} rx={40} ry={8} fill={C.furnitureLight} stroke={C.line} strokeWidth={2.5} />
    <line x1={0} y1={0} x2={-10} y2={-120} stroke={C.line} strokeWidth={7} strokeLinecap="round" />
    <line x1={-10} y1={-120} x2={50} y2={-170} stroke={C.line} strokeWidth={7} strokeLinecap="round" />
    <g transform="translate(50 -170) rotate(35)">
      <path d="M -36 0 L 36 0 L 22 -40 L -22 -40 Z" fill={C.furnitureLight} stroke={C.line} strokeWidth={3} />
      <ellipse cx={0} cy={2} rx={30} ry={6} fill={color} opacity={on} />
    </g>
  </g>
);

export const Notebook: React.FC<{ x: number; y: number; lines: number }> = ({ x, y, lines }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M 0 0 L 170 0 L 182 -12 L 12 -12 Z" fill="#D9D4C9" />
    {Array.from({ length: Math.floor(lines) }).map((_, i) => (
      <line key={i} x1={24 + i * 2} y1={-9 + (i % 2)} x2={60 + i * 14} y2={-9 + (i % 2)} stroke={C.line} strokeWidth={1.5} />
    ))}
  </g>
);

export const WallClock: React.FC<{ x: number; y: number; minutes: number }> = ({ x, y, minutes }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={56} fill="#15171C" stroke={C.line} strokeWidth={5} />
    {Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1={0} y1={-44} x2={0} y2={-38} stroke={C.line} strokeWidth={3} transform={`rotate(${i * 30})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-26} stroke={C.textDim} strokeWidth={5} strokeLinecap="round" transform={`rotate(${(minutes / 60) * 30})`} />
    <line x1={0} y1={0} x2={0} y2={-40} stroke={C.text} strokeWidth={3} strokeLinecap="round" transform={`rotate(${minutes * 6})`} />
    <circle r={4} fill={C.text} />
  </g>
);

// Mirror with a clipped reflection layer. Children are drawn inside the glass.
export const Mirror: React.FC<{ x: number; y: number; w?: number; h?: number; children?: React.ReactNode; glass?: string }> = ({
  x,
  y,
  w = 380,
  h = 470,
  children,
  glass = '#171A21',
}) => {
  const id = useSvgId('mir');
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={id}>
          <rect width={w} height={h} rx={w / 2.6} />
        </clipPath>
      </defs>
      <rect width={w} height={h} rx={w / 2.6} fill={glass} />
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${-x} ${-y})`}>{children}</g>
        <path d={`M ${w * 0.15} ${h * 0.35} L ${w * 0.35} ${h * 0.12}`} stroke="#FFFFFF" strokeOpacity={0.06} strokeWidth={18} strokeLinecap="round" />
      </g>
      <rect width={w} height={h} rx={w / 2.6} fill="none" stroke={C.line} strokeWidth={8} />
    </g>
  );
};

export const Sink: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -170 0 L 170 0 L 140 70 L -140 70 Z" fill={C.furnitureLight} stroke={C.line} strokeWidth={3} />
    <rect x={-28} y={70} width={56} height={FLOOR - y - 70} fill={C.furniture} stroke={C.line} strokeWidth={3} />
    <path d="M -10 0 L -10 -40 Q -10 -56 10 -56 L 40 -56" stroke={C.line} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

export const Door: React.FC<{ x: number; open?: number; spill?: string }> = ({ x, open = 0, spill = C.amber }) => {
  const W = 190;
  const H = 400;
  const top = FLOOR - H;
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={top} width={W} height={H} fill={spill} opacity={open * 0.85} />
      <Glow x={W / 2} y={FLOOR - 60} r={420} color={spill} opacity={open * 0.7} sy={0.5} />
      <rect x={0} y={top} width={W} height={H} fill="none" stroke={C.line} strokeWidth={5} />
      <g transform={`translate(0 0) scale(${1 - open * 0.82} 1)`}>
        <rect x={0} y={top} width={W} height={H} fill={C.furnitureLight} stroke={C.line} strokeWidth={4} />
        <circle cx={W - 30} cy={top + H * 0.55} r={9} fill={C.line} />
      </g>
    </g>
  );
};

// Scrolling street. `offset` px scrolls the world left. `mode` sets sky and light.
export const Street: React.FC<{ offset: number; mode: 'dawn' | 'night' | 'day'; sunY?: number }> = ({ offset, mode, sunY = 640 }) => {
  const sky = mode === 'night' ? C.skyNight : mode === 'dawn' ? '#1C1916' : '#1E2430';
  const buildings = Array.from({ length: 14 }).map((_, i) => ({
    w: 160 + random(`bw${i}`) * 140,
    h: 220 + random(`bh${i}`) * 300,
    gap: 20 + random(`bg${i}`) * 40,
  }));
  const span = buildings.reduce((s, b) => s + b.w + b.gap, 0);
  const far = ((offset * 0.35) % span + span) % span;
  let bx = 0;
  return (
    <g>
      <rect width={1920} height={1080} fill={sky} />
      {mode === 'dawn' ? (
        <>
          <Glow x={1420} y={sunY} r={620} color={C.amber} opacity={0.55} />
          <circle cx={1420} cy={sunY} r={110} fill={C.amber} />
        </>
      ) : null}
      {mode === 'night' ? <circle cx={1500} cy={210} r={34} fill={C.moon} /> : null}
      <g transform={`translate(${-far} 0)`}>
        {[0, 1].map((rep) => {
          bx = rep * span;
          return buildings.map((b, i) => {
            const x0 = bx;
            bx += b.w + b.gap;
            return (
              <g key={`${rep}-${i}`}>
                <rect x={x0} y={FLOOR - b.h} width={b.w} height={b.h} fill="#0D0F13" stroke={C.lineSoft} strokeWidth={3} />
                {Array.from({ length: Math.floor(b.h / 70) }).map((__, r) =>
                  [0, 1].map((cIdx) =>
                    random(`win${i}${r}${cIdx}`) > (mode === 'night' ? 0.72 : 0.9) ? (
                      <rect key={`${r}${cIdx}`} x={x0 + 26 + cIdx * (b.w / 2)} y={FLOOR - b.h + 30 + r * 70} width={26} height={30} fill="#2A2F3A" />
                    ) : null,
                  ),
                )}
              </g>
            );
          });
        })}
      </g>
      <rect y={FLOOR} width={1920} height={240} fill={C.floor} />
      <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
      <g transform={`translate(${-(((offset % 240) + 240) % 240)} 0)`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1={i * 240} x2={i * 240 + 120} y1={FLOOR + 70} y2={FLOOR + 70} stroke={C.lineSoft} strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
};

export const StreetLamp: React.FC<{ x: number; on?: boolean }> = ({ x, on = true }) => (
  <g transform={`translate(${x} 0)`}>
    {on ? <Glow x={0} y={FLOOR - 470} r={300} color="#BFC6D6" opacity={0.35} /> : null}
    <rect x={-6} y={FLOOR - 480} width={12} height={480} fill={C.furniture} stroke={C.line} strokeWidth={2} />
    <path d="M -40 -480 L 40 -480 L 24 -500 L -24 -500 Z" transform={`translate(0 ${FLOOR})`} fill={C.furnitureLight} stroke={C.line} strokeWidth={2} />
  </g>
);

export const PunchingBag: React.FC<{ x: number; y: number; angle: number; color?: string }> = ({ x, y, angle, color = C.amber }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <line x1={0} y1={0} x2={0} y2={120} stroke={C.line} strokeWidth={5} />
    <rect x={-70} y={120} width={140} height={340} rx={40} fill={color} />
    <rect x={-70} y={170} width={140} height={14} fill="#00000022" />
    <rect x={-70} y={400} width={140} height={14} fill="#00000022" />
  </g>
);

export const Bench: React.FC<{ x: number; w?: number }> = ({ x, w = 520 }) => {
  const seat = FLOOR - 120;
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={seat - 160} width={w} height={22} rx={8} fill={C.wood} stroke={C.line} strokeWidth={3} />
      <rect x={0} y={seat - 110} width={w} height={22} rx={8} fill={C.wood} stroke={C.line} strokeWidth={3} />
      <rect x={-10} y={seat} width={w + 20} height={24} rx={8} fill={C.wood} stroke={C.line} strokeWidth={3} />
      <rect x={30} y={seat + 24} width={16} height={96} fill={C.furniture} stroke={C.line} strokeWidth={3} />
      <rect x={w - 46} y={seat + 24} width={16} height={96} fill={C.furniture} stroke={C.line} strokeWidth={3} />
    </g>
  );
};

export const BENCH_SEAT = FLOOR - 120;

export const Tree: React.FC<{ x: number; s?: number }> = ({ x, s = 1 }) => (
  <g transform={`translate(${x} ${FLOOR}) scale(${s})`}>
    <rect x={-16} y={-360} width={32} height={360} fill={C.furniture} stroke={C.line} strokeWidth={3} />
    <circle cx={0} cy={-420} r={150} fill="#1C2420" stroke={C.line} strokeWidth={3} />
    <circle cx={-110} cy={-350} r={100} fill="#1C2420" stroke={C.line} strokeWidth={3} />
    <circle cx={110} cy={-360} r={110} fill="#1C2420" stroke={C.line} strokeWidth={3} />
  </g>
);

export const Starfield: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 1 }) => (
  <g opacity={opacity}>
    {Array.from({ length: 90 }).map((_, i) => {
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.03 + i * 1.7));
      return <circle key={i} cx={random(`sx${i}`) * 1920} cy={random(`sy${i}`) * 1080} r={1 + random(`sr${i}`) * 1.8} fill="#BFC3CC" opacity={tw * 0.6} />;
    })}
  </g>
);
