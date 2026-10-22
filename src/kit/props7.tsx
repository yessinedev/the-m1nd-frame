import React, { useId } from 'react';
import { random } from 'remotion';
import { HAND } from '../fonts';
import { C, FLOOR } from '../theme';
import { Head, Variant } from './Character';
import { Glow } from './props';

// Crush set pieces (episode 7+): library, café, a daydream thought-cloud, gym bag, sticky note,
// and phone screens for "online" status and an over-analysed chat.

const useSvgId = (p: string) => `${p}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
const S = { stroke: C.line, strokeWidth: 3 };

export const Library: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#18171C" />
    {Array.from({ length: 4 }).map((_, k) => (
      <g key={k} transform={`translate(${80 + k * 470} 140)`}>
        <rect width={420} height={FLOOR - 140} fill="#241F1C" stroke="#2F2925" strokeWidth={4} />
        {Array.from({ length: 5 }).map((__, r) => (
          <g key={r} transform={`translate(10 ${20 + r * 130})`}>
            <rect y={110} width={400} height={10} fill="#2F2925" />
            {Array.from({ length: 14 }).map((___, b) => (
              <rect
                key={b}
                x={b * 28}
                y={110 - (70 + random(`bk${k}${r}${b}`) * 30)}
                width={24}
                height={70 + random(`bk${k}${r}${b}`) * 30}
                fill={['#4A3A30', '#3A4A44', '#4A3A44', '#5A4A30', '#344052'][(b + r + k) % 5]}
              />
            ))}
          </g>
        ))}
      </g>
    ))}
    <rect y={FLOOR} width={1920} height={240} fill="#121115" />
    <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

export const BookStack: React.FC<{ x: number; y: number; upsideDown?: boolean }> = ({ x, y, upsideDown = false }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-70} y={-16} width={140} height={16} rx={3} fill="#5A4A30" />
    <rect x={-60} y={-30} width={124} height={14} rx={3} fill="#344052" />
    <g transform={`translate(0 -34) ${upsideDown ? 'rotate(180)' : ''}`}>
      <path d="M -80 0 L 0 -6 L 80 0 L 80 -4 L 0 -10 L -80 -4 Z" fill="#E9E4D8" />
    </g>
  </g>
);

export const CAFE = { counterTop: FLOOR - 260, counterX: 1100 };

// Café: counter with espresso machine on the right, menu board, warm pendant lights.
export const Cafe: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect width={1920} height={1080} fill="#1E1916" />
    <rect y={FLOOR} width={1920} height={240} fill="#15110F" />
    <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    {[560, 1000, 1440].map((x) => (
      <g key={x}>
        <line x1={x} x2={x} y1={0} y2={150} stroke={C.line} strokeWidth={3} />
        <path d={`M ${x - 40} 190 Q ${x} 120 ${x + 40} 190 Z`} fill="#3A3226" stroke={C.line} strokeWidth={3} />
        <Glow x={x} y={230} r={260} color={C.amber} opacity={0.35} />
      </g>
    ))}
    <rect x={1240} y={230} width={520} height={260} rx={10} fill="#141210" stroke="#3A322A" strokeWidth={6} />
    {['latte', 'flat white', 'cold brew', 'chai'].map((t, i) => (
      <text key={t} x={1280} y={290 + i * 50} fontFamily={HAND} fontSize={34} fill="#D9D4C9" opacity={0.8}>
        {t} . . . . . {['4', '4', '5', '4'][i]}
      </text>
    ))}
    <rect x={CAFE.counterX} y={CAFE.counterTop} width={820} height={FLOOR - CAFE.counterTop} fill="#2A221C" {...S} />
    <rect x={CAFE.counterX - 10} y={CAFE.counterTop - 16} width={840} height={20} rx={6} fill="#3A2F26" {...S} />
    <g transform={`translate(${CAFE.counterX + 560} ${CAFE.counterTop - 16})`}>
      <rect x={-80} y={-150} width={160} height={150} rx={12} fill="#6B6E75" stroke={C.line} strokeWidth={3} />
      <rect x={-50} y={-60} width={100} height={20} fill="#2A2C31" />
      {[0, 1].map((i) => (
        <path key={i} d={`M ${-20 + i * 40} -160 q 8 -16 0 -32`} stroke="#FFFFFF" strokeOpacity={0.2} strokeWidth={4} fill="none" transform={`translate(0 ${-((frame + i * 15) % 30)})`} />
      ))}
    </g>
  </g>
);

// Thought cloud anchored at (x, y) bottom-left; children render inside a w×h clip.
export const ThoughtCloud: React.FC<{ x: number; y: number; w: number; h: number; open: number; children: React.ReactNode }> = ({ x, y, w, h, open, children }) => {
  const id = useSvgId('tc');
  if (open <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${open})`} opacity={Math.min(1, open * 1.5)}>
      <circle cx={-30} cy={40} r={14} fill="#E9E4D8" />
      <circle cx={-10} cy={0} r={22} fill="#E9E4D8" />
      <defs>
        <clipPath id={id}>
          <rect x={20} y={-h - 30} width={w} height={h} rx={h / 2.4} />
        </clipPath>
      </defs>
      <rect x={10} y={-h - 40} width={w + 20} height={h + 20} rx={h / 2.2} fill="#E9E4D8" />
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${20} ${-h - 30})`}>{children}</g>
      </g>
    </g>
  );
};

export const GymBag: React.FC<{ x: number; dust?: number }> = ({ x, dust = 0 }) => (
  <g transform={`translate(${x} ${FLOOR})`}>
    <rect x={-110} y={-90} width={220} height={90} rx={40} fill="#3A4A5C" />
    <path d="M -60 -88 Q 0 -150 60 -88" stroke="#2A3542" strokeWidth={10} fill="none" />
    <rect x={-110} y={-90} width={220} height={90} rx={40} fill="#9AA0AA" opacity={dust * 0.25} />
  </g>
);

export const StickyNote: React.FC<{ x: number; y: number; text: string[]; scale?: number; rotate?: number; reveal?: number }> = ({ x, y, text, scale = 1, rotate = -3, reveal = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-130} y={-130} width={260} height={260} fill="#E8D47A" />
    <rect x={-130} y={-130} width={260} height={30} fill="#D9C46A" />
    {text.map((line, i) => (
      <text key={i} x={-104} y={-50 + i * 58} fontFamily={HAND} fontSize={44} fill="#2A2418" opacity={Math.max(0, Math.min(1, reveal * text.length - i))}>
        {line}
      </text>
    ))}
  </g>
);

// Her profile: big avatar, name, and the status line he keeps refreshing.
export const StatusScreen: React.FC<{ sw: number; sh: number; frame: number; status: string; online: boolean; refresh: number; variant: Variant; name: string }> = ({
  sw,
  frame,
  status,
  online,
  refresh,
  variant,
  name,
}) => (
  <g>
    {refresh > 0 ? (
      <g transform={`translate(${sw / 2} ${110 + refresh * 40}) rotate(${frame * 18})`} opacity={refresh}>
        <path d="M 0 -18 A 18 18 0 1 1 -16 8" stroke={C.textDim} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    ) : null}
    <g transform={`translate(0 ${refresh * 60})`}>
      <circle cx={sw / 2} cy={330} r={130} fill="#2A3140" />
      <Head x={sw / 2} y={344} scale={1.25} variant={variant} eyes="happy" mouth="smile" />
      <text x={sw / 2} y={540} textAnchor="middle" fontFamily={HAND} fontSize={60} fill={C.text}>
        {name}
      </text>
      <circle cx={sw / 2 - 120} cy={590} r={10} fill={online ? '#6BC48A' : '#4A4F5A'} />
      <text x={sw / 2 - 100} y={600} fontFamily={HAND} fontSize={34} fill={online ? '#6BC48A' : C.textDim}>
        {status}
      </text>
      <rect x={60} y={660} width={sw - 120} height={80} rx={40} fill="#3D5A80" />
      <text x={sw / 2} y={712} textAnchor="middle" fontFamily={HAND} fontSize={32} fill={C.text}>
        Message
      </text>
    </g>
  </g>
);

export type Msg = { from: 'me' | 'them'; text: string };

// Chat with her: a few messages, an optional highlighted word with "?" marks, and a "typing…" bubble.
export const AnalyseChat: React.FC<{ sw: number; sh: number; frame: number; name: string; variant: Variant; msgs: Msg[]; highlight?: number; typing?: boolean; status: string }> = ({
  sw,
  sh,
  frame,
  name,
  variant,
  msgs,
  highlight = 0,
  typing = false,
  status,
}) => (
  <g>
    <rect width={sw} height={130} fill="#141922" />
    <circle cx={70} cy={70} r={36} fill="#2A3140" />
    <Head x={70} y={74} scale={0.36} variant={variant} eyes="happy" mouth="smile" />
    <text x={124} y={66} fontFamily={HAND} fontSize={32} fill={C.text}>
      {name}
    </text>
    <text x={124} y={98} fontFamily={HAND} fontSize={22} fill={typing ? '#6BC48A' : C.textDim}>
      {typing ? 'typing…' : status}
    </text>
    <line x1={0} x2={sw} y1={130} y2={130} stroke={C.lineSoft} strokeWidth={2} />
    {msgs.map((m, i) => {
      const tw = Math.min(sw * 0.74, 30 + m.text.length * 15);
      const top = 180 + i * 90;
      const mine = m.from === 'me';
      const bx = mine ? sw - 24 - tw : 24;
      const last = i === msgs.length - 1 && !mine;
      return (
        <g key={i}>
          <rect x={bx} y={top} width={tw} height={62} rx={26} fill={mine ? '#3D5A80' : '#2C3038'} />
          {last && highlight > 0 ? <rect x={bx + 16} y={top + 12} width={62} height={38} rx={8} fill={C.amber} opacity={highlight * 0.45} /> : null}
          <text x={bx + 20} y={top + 41} fontFamily={HAND} fontSize={30} fill={C.text}>
            {m.text}
          </text>
          {last && highlight > 0
            ? [0, 1, 2].map((q) => (
                <text key={q} x={bx + tw + 18 + q * 34} y={top + 50 - q * 26 + Math.sin(frame * 0.2 + q) * 5} fontFamily={HAND} fontSize={44 + q * 8} fill={C.voice} opacity={highlight}>
                  ?
                </text>
              ))
            : null}
        </g>
      );
    })}
    {typing ? (
      <g transform={`translate(24 ${180 + msgs.length * 90})`}>
        <rect width={110} height={62} rx={26} fill="#2C3038" />
        {[0, 1, 2].map((d) => (
          <circle key={d} cx={30 + d * 25} cy={31} r={7} fill={C.textDim} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame * 0.2 + d))} />
        ))}
      </g>
    ) : null}
    <rect x={0} y={sh - 110} width={sw} height={110} fill="#1A1E26" />
    <rect x={20} y={sh - 90} width={sw - 40} height={64} rx={32} fill="#2A2F39" />
    <text x={46} y={sh - 47} fontFamily={HAND} fontSize={30} fill={C.textDim}>
      Message
    </text>
  </g>
);
