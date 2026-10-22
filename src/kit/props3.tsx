import React, { useId } from 'react';
import { random } from 'remotion';
import { HAND } from '../fonts';
import { C, FLOOR } from '../theme';
import { Head } from './Character';
import { Glow } from './props';

// Friendship set pieces (episode 3+): street sign, moving van, boxes, Polaroid, controller,
// and phone screens for a chat thread, a social post and a call.

const useSvgId = (p: string) => `${p}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

export const StreetSign: React.FC<{ x: number; text: string }> = ({ x, text }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-6} y={FLOOR - 420} width={12} height={420} fill="#2A2E36" />
    <rect x={-110} y={FLOOR - 440} width={220} height={54} rx={8} fill="#2E4A3B" stroke="#D9D4C9" strokeWidth={4} />
    <text x={0} y={FLOOR - 402} textAnchor="middle" fontFamily={HAND} fontSize={34} letterSpacing="0.08em" fill="#E9E4D8">
      {text}
    </text>
  </g>
);

export const Box: React.FC<{ x: number; y?: number; w?: number; h?: number; label?: string }> = ({ x, y = FLOOR, w = 120, h = 96, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={4} fill="#8C6E4C" stroke="#6E553A" strokeWidth={3} />
    <rect x={-8} y={-h} width={16} height={h * 0.45} fill="#A88A63" />
    {label ? (
      <text x={0} y={-h * 0.3} textAnchor="middle" fontFamily={HAND} fontSize={24} fill="#3A2C1E">
        {label}
      </text>
    ) : null}
  </g>
);

export const Van: React.FC<{ x: number; wheel: number }> = ({ x, wheel }) => (
  <g transform={`translate(${x} 0)`}>
    <path d={`M -360 ${FLOOR - 50} L -360 ${FLOOR - 330} Q -360 ${FLOOR - 350} -340 ${FLOOR - 350} L 160 ${FLOOR - 350} L 260 ${FLOOR - 220} L 300 ${FLOOR - 200} L 300 ${FLOOR - 50} Z`} fill="#C9C3B6" stroke={C.line} strokeWidth={4} />
    <path d={`M 170 ${FLOOR - 330} L 245 ${FLOOR - 225} L 170 ${FLOOR - 225} Z`} fill="#2B3240" />
    <rect x={-340} y={FLOOR - 190} width={640} height={16} fill="#A9A397" />
    {[-230, 190].map((wx) => (
      <g key={wx} transform={`translate(${wx} ${FLOOR - 50})`}>
        <circle r={50} fill="#14161A" />
        <circle r={22} fill="#5A606C" />
        <line x1={-18} y1={0} x2={18} y2={0} stroke="#14161A" strokeWidth={4} transform={`rotate(${wheel})`} />
      </g>
    ))}
  </g>
);

export const Controller: React.FC<{ color?: string }> = ({ color = '#22252C' }) => (
  <g>
    <path d="M -30 -10 Q -34 -22 -18 -22 L 18 -22 Q 34 -22 30 -10 L 26 10 Q 22 18 14 10 L -14 10 Q -22 18 -26 10 Z" fill={color} />
    <circle cx={14} cy={-12} r={3} fill={C.amber} />
    <rect x={-20} y={-14} width={10} height={3} rx={1} fill="#5A606C" />
  </g>
);

export const SodaCan: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = '#B5524A' }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-12} y={-40} width={24} height={40} rx={4} fill={color} />
    <rect x={-12} y={-40} width={24} height={6} rx={3} fill="#BFC3CC" />
  </g>
);

export const NightSky: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C1220" />
    {Array.from({ length: 140 }).map((_, i) => {
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.04 + i * 1.3));
      return <circle key={i} cx={random(`ns${i}`) * 1920} cy={random(`nsy${i}`) * 700} r={1 + random(`nsr${i}`) * 2} fill="#E3E6EE" opacity={tw * 0.8} />;
    })}
    <circle cx={1500} cy={200} r={46} fill={C.moon} />
  </g>
);

// Hilltop silhouette with a soft crest at y ≈ FLOOR - 40.
export const Hill: React.FC = () => (
  <path d={`M -20 ${FLOOR - 10} Q 500 ${FLOOR - 120} 960 ${FLOOR - 70} T 1940 ${FLOOR - 30} L 1940 1100 L -20 1100 Z`} fill="#0F1411" stroke="#1E2620" strokeWidth={3} />
);

// Polaroid of the two kids on their bikes at sunset.
export const Polaroid: React.FC<{ x: number; y: number; scale?: number; rotate?: number; caption?: string }> = ({ x, y, scale = 1, rotate = 0, caption = "us. summer '07" }) => {
  const id = useSvgId('pol');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <defs>
        <clipPath id={id}>
          <rect x={-150} y={-170} width={300} height={260} />
        </clipPath>
      </defs>
      <rect x={-175} y={-195} width={350} height={400} rx={6} fill="#EDE8DD" />
      <g clipPath={`url(#${id})`}>
        <rect x={-150} y={-170} width={300} height={260} fill="#3A2A1F" />
        <circle cx={60} cy={10} r={70} fill={C.amber} opacity={0.9} />
        <rect x={-150} y={40} width={300} height={60} fill="#1E1712" />
        <Head x={-55} y={-20} scale={0.55} eyes="happy" mouth="grin" />
        <Head x={45} y={-24} scale={0.55} variant="sam" eyes="happy" mouth="grin" />
      </g>
      <rect x={-150} y={-170} width={300} height={260} fill="#FFD9A0" opacity={0.08} />
      <text x={0} y={160} textAnchor="middle" fontFamily={HAND} fontSize={34} fill="#3A3D45">
        {caption}
      </text>
    </g>
  );
};

// ---------- phone screens ----------

// Phone body with a clipped screen; children draw in screen space (0,0 = top-left, size sw × sh).
export const PhoneShell: React.FC<{ x: number; y: number; h?: number; rotate?: number; screen?: string; glow?: string; children: (sw: number, sh: number) => React.ReactNode }> = ({
  x,
  y,
  h = 1000,
  rotate = 0,
  screen = '#141922',
  glow = C.screen,
  children,
}) => {
  const id = useSvgId('ps');
  const w = h * 0.49;
  const inset = 16;
  const sw = w - inset * 2;
  const sh = h - inset * 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <Glow x={0} y={0} r={h * 0.8} color={glow} opacity={0.22} />
      <defs>
        <clipPath id={id}>
          <rect x={-w / 2 + inset} y={-h / 2 + inset} width={sw} height={sh} rx={38} />
        </clipPath>
      </defs>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={54} fill="#0A0B0D" stroke={C.line} strokeWidth={4} />
      <g clipPath={`url(#${id})`}>
        <rect x={-w / 2 + inset} y={-h / 2 + inset} width={sw} height={sh} fill={screen} />
        <g transform={`translate(${-w / 2 + inset} ${-h / 2 + inset})`}>{children(sw, sh)}</g>
      </g>
      <rect x={-50} y={-h / 2 + 28} width={100} height={22} rx={11} fill="#0A0B0D" />
    </g>
  );
};

const SamAvatar: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 30 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#2F3A45" />
    <Head x={0} y={r * 0.1} scale={r / 95} variant="sam" eyes="open" mouth="smile" />
  </g>
);

export type ChatMsg = { from: 'me' | 'them'; text: string; at: number; year?: string; seen?: boolean };

// Message thread with Sam. Messages appear at `at` (frame) and the thread scrolls to keep the newest in view.
export const ChatScreen: React.FC<{ sw: number; sh: number; frame: number; msgs: ChatMsg[] }> = ({ sw, sh, frame, msgs }) => {
  const rowH = 86;
  const yearH = 64;
  let y = 160;
  const rows = msgs.map((m) => {
    const top = y + (m.year ? yearH : 0);
    y = top + rowH;
    return { ...m, top };
  });
  const shown = rows.filter((r) => frame >= r.at);
  const bottom = shown.length ? shown[shown.length - 1].top + rowH : 0;
  const scroll = Math.max(0, bottom - (sh - 60));
  return (
    <g>
      <g transform={`translate(0 ${-scroll})`}>
        {shown.map((r, i) => {
          const a = Math.min(1, (frame - r.at) / 8);
          const tw = Math.min(sw * 0.7, 20 + r.text.length * 15);
          const mine = r.from === 'me';
          const bx = mine ? sw - 24 - tw : 24;
          return (
            <g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 14})`}>
              {r.year ? (
                <text x={sw / 2} y={r.top - 22} textAnchor="middle" fontFamily={HAND} fontSize={26} fill={C.textDim}>
                  {r.year}
                </text>
              ) : null}
              <rect x={bx} y={r.top} width={tw} height={62} rx={26} fill={mine ? '#3D5A80' : '#2C3038'} />
              <text x={bx + 20} y={r.top + 41} fontFamily={HAND} fontSize={30} fill={C.text}>
                {r.text}
              </text>
              {r.seen ? (
                <text x={sw - 30} y={r.top + 92} textAnchor="end" fontFamily={HAND} fontSize={22} fill={C.textDim}>
                  Seen
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
      <rect width={sw} height={130} fill="#141922" />
      <SamAvatar x={sw / 2} y={62} r={34} />
      <text x={sw / 2} y={120} textAnchor="middle" fontFamily={HAND} fontSize={28} fill={C.text}>
        Sam
      </text>
      <line x1={0} x2={sw} y1={130} y2={130} stroke={C.lineSoft} strokeWidth={2} />
    </g>
  );
};

// A social post from Sam: his little family. `liked` 0..1 fills the heart.
export const PostScreen: React.FC<{ sw: number; sh: number; liked: number; scroll?: number }> = ({ sw, sh, liked, scroll = 0 }) => (
  <g transform={`translate(0 ${-scroll})`}>
    <SamAvatar x={60} y={110} r={32} />
    <text x={110} y={104} fontFamily={HAND} fontSize={30} fill={C.text}>
      Sam
    </text>
    <text x={110} y={134} fontFamily={HAND} fontSize={22} fill={C.textDim}>
      2h
    </text>
    <rect x={0} y={160} width={sw} height={sw} fill="#3A2E26" />
    <circle cx={sw * 0.7} cy={260} r={70} fill={C.amber} opacity={0.6} />
    <rect x={0} y={160 + sw * 0.72} width={sw} height={sw * 0.28} fill="#241C17" />
    <Head x={sw * 0.3} y={160 + sw * 0.5} scale={0.62} variant="sam" eyes="happy" mouth="grin" />
    <Head x={sw * 0.62} y={160 + sw * 0.53} scale={0.58} variant="her" eyes="happy" mouth="smile" blush={0.6} />
    <Head x={sw * 0.46} y={160 + sw * 0.68} scale={0.34} eyes="happy" mouth="o" blush={0.8} />
    <g transform={`translate(44 ${190 + sw})`}>
      <path d="M 0 0 c -12 -16 -38 -2 -18 18 l 18 18 l 18 -18 c 20 -20 -6 -34 -18 -18 z" fill={liked > 0.5 ? C.amber : 'none'} stroke={liked > 0.5 ? C.amber : C.text} strokeWidth={4} transform={`scale(${1 + Math.sin(liked * Math.PI) * 0.4})`} />
    </g>
    <text x={24} y={270 + sw} fontFamily={HAND} fontSize={30} fill={C.text}>
      little one turned 1 today
    </text>
    <rect x={0} y={330 + sw} width={sw} height={sh} fill="#1A1F29" />
    <rect x={24} y={360 + sw} width={sw - 48} height={sw * 0.8} rx={12} fill="#232833" />
  </g>
);

// Contact / call screen. phase: 'contact' (call button), 'calling', 'connected' (timer).
export const CallScreen: React.FC<{ sw: number; sh: number; phase: 'contact' | 'calling' | 'connected'; frame: number; press?: number; seconds?: number }> = ({
  sw,
  sh,
  phase,
  frame,
  press = 0,
  seconds = 0,
}) => {
  const pulse = phase === 'calling' ? 1 + Math.sin(frame * 0.2) * 0.06 : 1;
  const status = phase === 'contact' ? 'mobile' : phase === 'calling' ? 'calling...' : `00:${String(Math.floor(seconds)).padStart(2, '0')}`;
  return (
    <g>
      <g transform={`translate(${sw / 2} ${sh * 0.3}) scale(${pulse})`}>
        {phase === 'calling' ? <circle r={140} fill="none" stroke={C.amber} strokeOpacity={0.25} strokeWidth={4} /> : null}
        <SamAvatar x={0} y={0} r={110} />
      </g>
      <text x={sw / 2} y={sh * 0.3 + 180} textAnchor="middle" fontFamily={HAND} fontSize={64} fill={C.text}>
        Sam
      </text>
      <text x={sw / 2} y={sh * 0.3 + 230} textAnchor="middle" fontFamily={HAND} fontSize={32} fill={C.textDim}>
        {status}
      </text>
      {phase === 'contact' ? (
        <g transform={`translate(${sw / 2} ${sh * 0.78}) scale(${1 - press * 0.12})`}>
          <circle r={64} fill={C.amber} />
          <path d="M -24 -22 q 4 -10 12 -6 l 8 10 q 4 6 -2 10 l -6 4 q 6 14 20 20 l 4 -6 q 4 -6 10 -2 l 10 8 q 4 8 -6 12 q -40 6 -50 -50 z" fill="#1A1A1A" />
        </g>
      ) : (
        <g transform={`translate(${sw / 2} ${sh * 0.82})`}>
          <circle r={56} fill="#4A4F5A" />
          <rect x={-26} y={-6} width={52} height={12} rx={6} fill="#F2EEE6" />
        </g>
      )}
    </g>
  );
};
