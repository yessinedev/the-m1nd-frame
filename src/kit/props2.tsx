import React, { useId } from 'react';
import { random } from 'remotion';
import { HAND } from '../fonts';
import { C, FLOOR } from '../theme';
import { Glow } from './props';

// Home & relationship set pieces (episode 2+): living room, kitchen, dining, park, and the phone UI.

const useSvgId = (p: string) => `${p}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
const S = { stroke: C.line, strokeWidth: 3 };

// Sofa in profile, back rest on the left. `x` = left edge. Seat top at SOFA.seat.
export const SOFA = { seat: FLOOR - 150, w: 620 };

export const Sofa: React.FC<{ x: number; w?: number; color?: string }> = ({ x, w = SOFA.w, color = '#2B3140' }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={0} y={FLOOR - 330} width={70} height={300} rx={30} fill={color} {...S} />
    <rect x={30} y={SOFA.seat} width={w - 30} height={110} rx={24} fill={color} {...S} />
    <rect x={40} y={SOFA.seat - 6} width={w - 70} height={34} rx={16} fill="#323A4B" {...S} />
    <rect x={w - 50} y={FLOOR - 220} width={56} height={190} rx={24} fill={color} {...S} />
    <rect x={50} y={FLOOR - 40} width={18} height={40} fill={C.furniture} {...S} />
    <rect x={w - 40} y={FLOOR - 40} width={18} height={40} fill={C.furniture} {...S} />
  </g>
);

// TV on a low stand in profile; the screen faces left. `light` 0..1 flickers a cool glow.
export const TV: React.FC<{ x: number; light?: number; color?: string }> = ({ x, light = 0.6, color = '#9FB6D9' }) => (
  <g transform={`translate(${x} 0)`}>
    <Glow x={-120} y={FLOOR - 330} r={520} color={color} opacity={light * 0.5} />
    <rect x={-60} y={FLOOR - 140} width={170} height={140} rx={8} fill={C.furniture} {...S} />
    <rect x={10} y={FLOOR - 420} width={26} height={260} rx={6} fill="#0B0C0F" {...S} />
    <rect x={8} y={FLOOR - 412} width={6} height={244} rx={3} fill={color} opacity={0.3 + light * 0.5} />
    <rect x={20} y={FLOOR - 160} width={8} height={22} fill={C.line} />
  </g>
);

export const FloorLamp: React.FC<{ x: number; on?: number }> = ({ x, on = 1 }) => (
  <g transform={`translate(${x} 0)`}>
    <Glow x={0} y={FLOOR - 470} r={520} color={C.amber} opacity={on * 0.6} />
    <ellipse cx={0} cy={FLOOR - 4} rx={46} ry={8} fill={C.furnitureLight} {...S} />
    <rect x={-4} y={FLOOR - 450} width={8} height={446} fill={C.line} />
    <path d={`M -56 ${FLOOR - 430} L 56 ${FLOOR - 430} L 36 ${FLOOR - 520} L -36 ${FLOOR - 520} Z`} fill={on > 0.5 ? '#3A3226' : C.furnitureLight} {...S} />
    <ellipse cx={0} cy={FLOOR - 430} rx={50} ry={7} fill={C.amber} opacity={on} />
  </g>
);

export const SideTable: React.FC<{ x: number; children?: React.ReactNode }> = ({ x, children }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-60} y={FLOOR - 170} width={120} height={16} rx={6} fill={C.furnitureLight} {...S} />
    <rect x={-8} y={FLOOR - 154} width={16} height={154} fill={C.furniture} {...S} />
    <ellipse cx={0} cy={FLOOR - 2} rx={44} ry={6} fill={C.furniture} {...S} />
    {children}
  </g>
);

// Mug resting on a surface at y. Optional steam.
export const Mug: React.FC<{ x: number; y: number; color?: string; steam?: number; frame?: number }> = ({ x, y, color = '#D9D4C9', steam = 0, frame = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    {steam > 0
      ? [0, 1].map((i) => (
          <path
            key={i}
            d={`M ${-8 + i * 14} -46 q ${6 + Math.sin(frame * 0.1 + i) * 4} -14 0 -28 q ${-6} -14 0 -28`}
            stroke="#FFFFFF"
            strokeOpacity={0.25 * steam}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        ))
      : null}
    <rect x={-20} y={-44} width={40} height={44} rx={8} fill={color} />
    <path d="M 20 -34 q 16 0 16 12 q 0 12 -16 12" stroke={color} strokeWidth={6} fill="none" />
  </g>
);

// Framed photo of the two of them.
export const CouplePhoto: React.FC<{ x: number; y: number; dim?: number }> = ({ x, y, dim = 0 }) => (
  <g transform={`translate(${x} ${y})`} opacity={1 - dim * 0.5}>
    <rect x={-80} y={-60} width={160} height={120} rx={6} fill="#D9D4C9" />
    <rect x={-68} y={-48} width={136} height={96} rx={3} fill="#2B3140" />
    <rect x={-60} y={-22} width={44} height={42} rx={16} fill={C.skin} />
    <rect x={-6} y={-24} width={48} height={48} rx={22} fill={C.hair} />
    <rect x={0} y={-20} width={40} height={40} rx={18} fill={C.skin} />
    <path d="M -46 4 q 8 6 16 0 M 12 4 q 8 6 16 0" stroke={C.ink} strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </g>
);

export const WindowCity: React.FC<{ x: number; y: number; w?: number; h?: number; night?: boolean }> = ({ x, y, w = 260, h = 300, night = true }) => {
  const id = useSvgId('wc');
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={id}>
          <rect width={w} height={h} rx={8} />
        </clipPath>
      </defs>
      <rect width={w} height={h} rx={8} fill={night ? C.skyNight : '#2A3240'} />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: 6 }).map((_, i) => {
          const bw = 40 + random(`cw${i}`) * 30;
          const bh = 80 + random(`ch${i}`) * 140;
          const bx = i * 46 - 10;
          return (
            <g key={i}>
              <rect x={bx} y={h - bh} width={bw} height={bh} fill="#0B0D12" />
              {random(`cl${i}`) > 0.4 ? <rect x={bx + 10} y={h - bh + 20} width={8} height={10} fill="#C9B47A" opacity={0.6} /> : null}
            </g>
          );
        })}
      </g>
      <rect width={w} height={h} rx={8} fill="none" stroke={C.line} strokeWidth={6} />
      <line x1={w / 2} x2={w / 2} y1={0} y2={h} stroke={C.line} strokeWidth={6} />
    </g>
  );
};

// Kitchen: base cabinets + counter top at KITCHEN.top, upper cabinets, stove with a pan.
export const KITCHEN = { top: FLOOR - 250 };

export const Kitchen: React.FC<{ x: number; w: number; frame: number; steam?: number }> = ({ x, w, frame, steam = 1 }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={0} y={180} width={w} height={170} rx={8} fill={C.furniture} {...S} />
    {Array.from({ length: Math.floor(w / 180) }).map((_, i) => (
      <line key={i} x1={(i + 1) * 180} x2={(i + 1) * 180} y1={190} y2={340} stroke={C.lineSoft} strokeWidth={3} />
    ))}
    <rect x={0} y={KITCHEN.top + 24} width={w} height={FLOOR - KITCHEN.top - 24} fill={C.furniture} {...S} />
    {Array.from({ length: Math.floor(w / 180) }).map((_, i) => (
      <line key={`d${i}`} x1={(i + 1) * 180} x2={(i + 1) * 180} y1={KITCHEN.top + 40} y2={FLOOR - 10} stroke={C.lineSoft} strokeWidth={3} />
    ))}
    {Array.from({ length: Math.floor(w / 180) }).map((_, i) => (
      <rect key={i} x={i * 180 + 150} y={KITCHEN.top + 60} width={7} height={46} rx={3.5} fill={C.line} />
    ))}
    <rect x={-10} y={KITCHEN.top} width={w + 20} height={26} rx={6} fill={C.furnitureLight} {...S} />
    {/* pan on the stove at the right third */}
    <g transform={`translate(${w * 0.68} ${KITCHEN.top})`}>
      <rect x={-70} y={-24} width={140} height={24} rx={10} fill="#16181D" {...S} />
      <rect x={70} y={-18} width={90} height={10} rx={5} fill="#16181D" {...S} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${-30 + i * 30} -34 q ${8 + Math.sin(frame * 0.12 + i * 2) * 6} -20 0 -40 q -8 -20 0 -40`}
          stroke="#FFFFFF"
          strokeOpacity={0.18 * steam}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          transform={`translate(0 ${-((frame * 1.2 + i * 20) % 30)})`}
        />
      ))}
    </g>
  </g>
);

// Pendant light hanging from the ceiling.
export const Pendant: React.FC<{ x: number; y: number; on?: number }> = ({ x, y, on = 1 }) => (
  <g transform={`translate(${x} 0)`}>
    <Glow x={0} y={y + 60} r={460} color={C.amber} opacity={on * 0.5} />
    <line x1={0} x2={0} y1={0} y2={y} stroke={C.line} strokeWidth={3} />
    <path d={`M -50 ${y + 50} Q 0 ${y - 20} 50 ${y + 50} Z`} fill={on > 0.5 ? '#3A3226' : C.furnitureLight} {...S} />
    <ellipse cx={0} cy={y + 50} rx={22} ry={6} fill={C.amber} opacity={on} />
  </g>
);

export const TABLE = { top: FLOOR - 240 };

export const DiningTable: React.FC<{ x: number; w?: number }> = ({ x, w = 420 }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={0} y={TABLE.top} width={w} height={20} rx={6} fill={C.wood} {...S} />
    <rect x={30} y={TABLE.top + 20} width={18} height={220} fill={C.furniture} {...S} />
    <rect x={w - 48} y={TABLE.top + 20} width={18} height={220} fill={C.furniture} {...S} />
  </g>
);

// Chair in profile. Back rest on the side away from `facing`.
export const CHAIR = { seat: FLOOR - 150 };

export const Chair: React.FC<{ x: number; facing: 1 | -1 }> = ({ x, facing }) => (
  <g transform={`translate(${x} 0) scale(${facing} 1)`}>
    <rect x={-60} y={CHAIR.seat} width={120} height={18} rx={6} fill={C.wood} {...S} />
    <rect x={-60} y={CHAIR.seat - 200} width={16} height={218} rx={6} fill={C.wood} {...S} />
    <rect x={-56} y={CHAIR.seat + 18} width={12} height={132} fill={C.furniture} {...S} />
    <rect x={44} y={CHAIR.seat + 18} width={12} height={132} fill={C.furniture} {...S} />
  </g>
);

export const Plate: React.FC<{ x: number; y: number; food?: boolean }> = ({ x, y, food = true }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={-4} rx={58} ry={8} fill="#D9D4C9" />
    {food ? <ellipse cx={0} cy={-12} rx={30} ry={10} fill="#9C6B4A" /> : null}
  </g>
);

export const Glass: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -14 -60 L 14 -60 L 10 0 L -10 0 Z" fill="#9FB6D9" opacity={0.25} stroke={C.line} strokeWidth={2} />
  </g>
);

export const Suitcase: React.FC<{ x: number; y?: number; handle?: number }> = ({ x, y = FLOOR, handle = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-6} y={-260 - handle * 80} width={8} height={80 + handle * 80} fill={C.line} />
    <rect x={-20} y={-270 - handle * 80} width={36} height={12} rx={6} fill={C.line} />
    <rect x={-70} y={-250} width={130} height={232} rx={20} fill="#6B5446" {...S} />
    <line x1={-36} x2={-36} y1={-240} y2={-30} stroke="#5A463A" strokeWidth={5} />
    <line x1={26} x2={26} y1={-240} y2={-30} stroke="#5A463A" strokeWidth={5} />
    <circle cx={-50} cy={-8} r={9} fill={C.ink} />
    <circle cx={40} cy={-8} r={9} fill={C.ink} />
  </g>
);

export const Envelope: React.FC<{ x?: number; y?: number; scale?: number; rotate?: number }> = ({ x = 0, y = 0, scale = 1, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-34} y={-22} width={68} height={44} rx={4} fill="#E9E4D8" />
    <path d="M -34 -22 L 0 4 L 34 -22" stroke="#BDB6A9" strokeWidth={3} fill="none" />
  </g>
);

export const Spoon: React.FC = () => (
  <g>
    <rect x={-3} y={-50} width={6} height={60} rx={3} fill="#BFC3CC" />
    <ellipse cx={0} cy={-54} rx={10} ry={13} fill="#BFC3CC" />
  </g>
);

// Back of her head on a pillow (she's turned away).
export const BackOfHead: React.FC<{ x: number; y: number; scale?: number; rotate?: number }> = ({ x, y, scale = 1, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-80} y={-80} width={160} height={150} rx={70} fill={C.hair} stroke="#3E302A" strokeWidth={4} />
    <path d="M -30 -60 Q 0 -74 30 -60" stroke="#3A2C26" strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);

export const Bird: React.FC<{ x: number; y: number; flap: number; s?: number }> = ({ x, y, flap, s = 1 }) => (
  <path
    d={`M ${x - 18 * s} ${y + flap * 8 * s} Q ${x - 8 * s} ${y - 6 * s} ${x} ${y} Q ${x + 8 * s} ${y - 6 * s} ${x + 18 * s} ${y + flap * 8 * s}`}
    stroke={C.ink}
    strokeWidth={3.5}
    fill="none"
    strokeLinecap="round"
  />
);

// Park at sunset/sunrise with scrolling trees. `offset` px scrolls the world left.
export const Park: React.FC<{ offset: number; sunY?: number; light?: 'sunset' | 'dusk' | 'dawn' }> = ({ offset, sunY = 560, light = 'sunset' }) => {
  const sky = light === 'dusk' ? '#171A22' : light === 'dawn' ? '#1E1C1F' : '#221B19';
  const trees = [0, 1, 2, 3, 4].map((i) => ({ x: i * 520 + random(`tx${i}`) * 120, s: 0.75 + random(`ts${i}`) * 0.35 }));
  const span = 2600;
  return (
    <g>
      <rect width={1920} height={1080} fill={sky} />
      {light !== 'dusk' ? (
        <>
          <Glow x={1300} y={sunY} r={760} color={C.amber} opacity={0.5} />
          <circle cx={1300} cy={sunY} r={120} fill={C.amber} />
        </>
      ) : null}
      <path d={`M 0 ${FLOOR - 120} Q 480 ${FLOOR - 200} 960 ${FLOOR - 130} T 1920 ${FLOOR - 140} L 1920 ${FLOOR} L 0 ${FLOOR} Z`} fill="#121512" />
      <g transform={`translate(${-((offset % span) + span) % span} 0)`}>
        {[0, 1].map((rep) =>
          trees.map((t, i) => (
            <g key={`${rep}${i}`} transform={`translate(${rep * span + t.x} ${FLOOR}) scale(${t.s})`}>
              <rect x={-16} y={-360} width={32} height={360} fill="#0E100E" />
              <circle cx={0} cy={-420} r={150} fill="#141A15" />
              <circle cx={-110} cy={-350} r={100} fill="#141A15" />
              <circle cx={110} cy={-360} r={110} fill="#141A15" />
            </g>
          )),
        )}
      </g>
      <rect y={FLOOR} width={1920} height={240} fill={C.floor} />
      <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    </g>
  );
};

// ---------- the phone, close up ----------

export type Notice = { text: string; name?: string; appear: number; gone?: number };

const FEED_TINTS = ['#7A2430', '#A3323F', '#5E1F2A', '#8E2B37', '#B23A47'];

// A tall phone filling the frame. `mode` feed = endless red cards scrolling; lock = time + notifications.
export const BigPhone: React.FC<{
  x: number;
  y: number;
  h?: number;
  rotate?: number;
  mode: 'feed' | 'lock' | 'off';
  scroll?: number;
  frame: number;
  notices?: Notice[];
  banner?: { text: string; name: string; y: number; opacity: number } | null;
  clock?: string;
}> = ({ x, y, h = 900, rotate = 0, mode, scroll = 0, frame, notices = [], banner = null, clock = '11:48' }) => {
  const id = useSvgId('bp');
  const blur = useSvgId('bb');
  const w = h * 0.49;
  const inset = 16;
  const sw = w - inset * 2;
  const sh = h - inset * 2;
  const cardH = sw * 1.05;
  const first = Math.floor(scroll / cardH);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <defs>
        <clipPath id={id}>
          <rect x={-w / 2 + inset} y={-h / 2 + inset} width={sw} height={sh} rx={38} />
        </clipPath>
        <filter id={blur} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
      </defs>
      {mode === 'feed' ? <Glow x={0} y={0} r={h * 0.9} color={C.red} opacity={0.5} /> : null}
      {mode === 'lock' ? <Glow x={0} y={0} r={h * 0.8} color={C.screen} opacity={0.3} /> : null}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={54} fill="#0A0B0D" stroke={C.line} strokeWidth={4} />
      <g clipPath={`url(#${id})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={mode === 'off' ? '#060708' : mode === 'feed' ? '#120C0E' : '#1A2130'} />
        {mode === 'feed'
          ? Array.from({ length: 4 }).map((_, k) => {
              const i = first + k;
              const top = -h / 2 + inset + i * cardH - scroll;
              const tint = FEED_TINTS[((i % 5) + 5) % 5];
              return (
                <g key={i} transform={`translate(${-sw / 2} ${top})`}>
                  <rect x={18} y={20} width={sw - 36} height={cardH * 0.7} rx={18} fill={tint} />
                  <g filter={`url(#${blur})`}>
                    <circle cx={sw * (0.3 + random(`fx${i}`) * 0.4)} cy={20 + cardH * 0.35} r={sw * 0.18} fill="#FF8C8C" opacity={0.6} />
                  </g>
                  <circle cx={44} cy={cardH * 0.7 + 52} r={16} fill="#3A3D45" />
                  <rect x={70} y={cardH * 0.7 + 42} width={sw * 0.45} height={10} rx={5} fill="#3A3D45" />
                  <rect x={70} y={cardH * 0.7 + 60} width={sw * 0.3} height={8} rx={4} fill="#2A2C33" />
                  <path d={`M ${sw - 60} ${cardH * 0.7 + 46} c -8 -10 -24 0 -12 12 l 12 12 l 12 -12 c 12 -12 -4 -22 -12 -12 z`} fill={C.red} />
                </g>
              );
            })
          : null}
        {mode === 'lock' ? (
          <g>
            <text x={0} y={-h / 2 + 170} textAnchor="middle" fontFamily={HAND} fontSize={118} fill={C.text}>
              {clock}
            </text>
            {notices.map((n, i) => {
              const a = Math.max(0, Math.min(1, (frame - n.appear) / 8));
              const g = n.gone === undefined ? 1 : Math.max(0, Math.min(1, 1 - (frame - n.gone) / 8));
              if (a <= 0 || g <= 0) return null;
              const ny = -h / 2 + 240 + i * 104 + (1 - a) * -20;
              return (
                <g key={i} opacity={a * g} transform={`translate(${(1 - g) * -sw} 0)`}>
                  <rect x={-sw / 2 + 14} y={ny} width={sw - 28} height={90} rx={22} fill="#E9E6DF" opacity={0.94} />
                  <rect x={-sw / 2 + 30} y={ny + 18} width={54} height={54} rx={22} fill={C.hair} />
                  <rect x={-sw / 2 + 36} y={ny + 26} width={42} height={42} rx={18} fill={C.skin} />
                  <circle cx={-sw / 2 + 50} cy={ny + 46} r={2.6} fill={C.ink} />
                  <circle cx={-sw / 2 + 64} cy={ny + 46} r={2.6} fill={C.ink} />
                  <text x={-sw / 2 + 100} y={ny + 40} fontFamily={HAND} fontSize={28} fill={C.ink}>
                    {n.name ?? 'Maya'}
                  </text>
                  <text x={-sw / 2 + 100} y={ny + 72} fontFamily={HAND} fontSize={28} fill="#4A4D55">
                    {n.text}
                  </text>
                </g>
              );
            })}
          </g>
        ) : null}
        {banner && banner.opacity > 0 ? (
          <g opacity={banner.opacity} transform={`translate(0 ${banner.y})`}>
            <rect x={-sw / 2 + 14} y={-h / 2 + 40} width={sw - 28} height={96} rx={24} fill="#E9E6DF" />
            <rect x={-sw / 2 + 30} y={-h / 2 + 60} width={56} height={56} rx={22} fill={C.hair} />
            <rect x={-sw / 2 + 36} y={-h / 2 + 68} width={44} height={44} rx={18} fill={C.skin} />
            <circle cx={-sw / 2 + 51} cy={-h / 2 + 88} r={2.8} fill={C.ink} />
            <circle cx={-sw / 2 + 65} cy={-h / 2 + 88} r={2.8} fill={C.ink} />
            <text x={-sw / 2 + 102} y={-h / 2 + 82} fontFamily={HAND} fontSize={29} fill={C.ink}>
              {banner.name}
            </text>
            <text x={-sw / 2 + 102} y={-h / 2 + 116} fontFamily={HAND} fontSize={29} fill="#4A4D55">
              {banner.text}
            </text>
          </g>
        ) : null}
      </g>
      <rect x={-50} y={-h / 2 + 28} width={100} height={22} rx={11} fill="#0A0B0D" />
    </g>
  );
};

// A limb drawn as a round-capped bar between two points.
const Bar: React.FC<{ a: [number, number]; b: [number, number]; w: number; fill: string }> = ({ a, b, w, fill }) => (
  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={fill} strokeWidth={w} strokeLinecap="round" />
);

// Big hands holding the close-up phone: left fingers wrap the left edge, right thumb works the screen.
// thumbY/thumbX place the thumb tip relative to the phone centre.
export const PhoneHands: React.FC<{ x: number; y: number; h?: number; thumbY: number; thumbX?: number; rotate?: number }> = ({ x, y, h = 900, thumbY, thumbX = 0, rotate = 0 }) => {
  const w = h * 0.49;
  const base: [number, number] = [w / 2 + 30, h / 2 - 150];
  const tip: [number, number] = [w / 2 - 110 + thumbX, thumbY];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <Bar a={[-w / 2 - 420, h / 2 + 420]} b={[-w / 2 - 70, h / 2 - 40]} w={190} fill={C.hoodieShade} />
      <ellipse cx={-w / 2 - 46} cy={150} rx={78} ry={118} fill={C.skinShade} />
      {[20, 92, 164].map((fy) => (
        <ellipse key={fy} cx={-w / 2 + 10} cy={fy} rx={24} ry={30} fill={C.skin} />
      ))}
      <Bar a={[w / 2 + 460, h / 2 + 420]} b={[w / 2 + 90, h / 2 - 10]} w={190} fill={C.hoodie} />
      <ellipse cx={w / 2 + 56} cy={h / 2 - 120} rx={88} ry={120} fill={C.skin} />
      <Bar a={base} b={tip} w={62} fill={C.skin} />
      <ellipse cx={tip[0]} cy={tip[1] + 6} rx={20} ry={24} fill="#F5F1E8" opacity={0.6} />
    </g>
  );
};

// Close-up hand seen from above, fingers pointing left (flip for the other way). Sleeve trails right.
export const CloseHand: React.FC<{ x: number; y: number; scale?: number; flip?: boolean; sleeve: string; sleeveShade: string }> = ({
  x,
  y,
  scale = 1,
  flip = false,
  sleeve,
  sleeveShade,
}) => (
  <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * scale} ${scale})`}>
    <rect x={96} y={-64} width={1500} height={128} rx={64} fill={sleeve} />
    <rect x={84} y={-68} width={58} height={136} rx={26} fill={sleeveShade} />
    <g transform="translate(40 58) rotate(28)">
      <rect x={-96} y={-18} width={100} height={36} rx={18} fill={C.skin} stroke={C.skinShade} strokeWidth={2} />
    </g>
    {[
      [-40, -126],
      [-12, -144],
      [16, -138],
      [42, -112],
    ].map(([fy, fx]) => (
      <rect key={fy} x={fx} y={fy - 14} width={-fx + 10} height={28} rx={14} fill={C.skin} stroke={C.skinShade} strokeWidth={2} />
    ))}
    <rect x={-40} y={-58} width={150} height={116} rx={48} fill={C.skin} />
    <path d="M -30 -30 Q -36 0 -30 30" stroke={C.skinShade} strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);
