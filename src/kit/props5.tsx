import React, { useId } from 'react';
import { random } from 'remotion';
import { HAND } from '../fonts';
import { C, FLOOR } from '../theme';
import { Head, Variant } from './Character';
import { Glow } from './props';
import { DESK, Desk } from './props';

// Gaming set pieces (episode 5+): bedroom gaming desk, 4-way split screen, game lobby UI,
// friends list, victory screen, group chat, a dusty headset on a hook.

const useSvgId = (p: string) => `${p}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
const S = { stroke: C.line, strokeWidth: 3 };

export const GAMER = { x: 840, deskX: 980, keys: [1110, DESK.top - 8] as [number, number], chairX: 760, monitorX: 1290 };

// A teenager's (or adult's) desk: chair, desk, keyboard, monitor facing him with coloured glow, LED strip.
export const GamerDesk: React.FC<{ wall?: string; glow: string; screen?: number; poster?: string; children?: React.ReactNode; dusty?: boolean }> = ({
  wall = '#14161C',
  glow,
  screen = 1,
  poster = '#3A4A5C',
  children,
  dusty = false,
}) => (
  <g>
    <rect width={1920} height={1080} fill={wall} />
    <rect y={FLOOR} width={1920} height={240} fill={C.floor} />
    <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    <rect x={500} y={220} width={150} height={210} rx={6} fill={poster} opacity={dusty ? 0.5 : 1} />
    <path d="M 540 400 L 575 270 L 610 400 Z" fill="#000000" opacity={0.2} />
    <Glow x={1180} y={460} r={520} color={glow} opacity={0.55 * screen} />
    {/* gaming chair */}
    <rect x={GAMER.chairX - 70} y={FLOOR - 470} width={70} height={300} rx={26} fill="#22252C" {...S} />
    <rect x={GAMER.chairX - 70} y={FLOOR - 186} width={190} height={30} rx={10} fill="#22252C" {...S} />
    <rect x={GAMER.chairX + 18} y={FLOOR - 156} width={14} height={120} fill={C.line} />
    <path d={`M ${GAMER.chairX - 40} ${FLOOR - 20} L ${GAMER.chairX + 90} ${FLOOR - 20}`} stroke={C.line} strokeWidth={8} strokeLinecap="round" />
    <Desk x={GAMER.deskX} />
    <rect x={GAMER.deskX} y={DESK.top + 26} width={DESK.w} height={6} fill={glow} opacity={0.6 * screen} />
    {/* monitor, screen facing left toward him */}
    <rect x={GAMER.monitorX + 10} y={DESK.top - 70} width={14} height={70} fill={C.line} />
    <rect x={GAMER.monitorX - 30} y={DESK.top - 6} width={94} height={8} rx={4} fill={C.line} />
    <rect x={GAMER.monitorX} y={DESK.top - 300} width={34} height={240} rx={6} fill="#0B0C0F" {...S} />
    <rect x={GAMER.monitorX - 2} y={DESK.top - 292} width={6} height={224} rx={3} fill={glow} opacity={screen} />
    <rect x={GAMER.keys[0] - 70} y={DESK.top - 10} width={140} height={10} rx={4} fill="#1B1D22" stroke={C.line} strokeWidth={2} />
    <ellipse cx={GAMER.keys[0] + 110} cy={DESK.top - 6} rx={16} ry={6} fill="#1B1D22" stroke={C.line} strokeWidth={2} />
    {children}
  </g>
);

// Four panels in a 2×2 grid; each child is a full 1920×1080 scene, cropped around `focus` at `zoom`.
export const Quad: React.FC<{
  panels: (React.ReactNode | null)[];
  labels?: string[];
  talking?: boolean[];
  focus?: [number, number];
  zoom?: number;
  dark?: number[]; // 0..1 per panel: logged off
}> = ({ panels, labels = [], talking = [], focus = [1000, 430], zoom = 0.78, dark = [] }) => {
  const id = useSvgId('quad');
  return (
    <g>
      <rect width={1920} height={1080} fill="#050506" />
      {panels.map((p, i) => {
        const px = (i % 2) * 960;
        const py = Math.floor(i / 2) * 540;
        const d = dark[i] ?? 0;
        return (
          <g key={i}>
            <defs>
              <clipPath id={`${id}${i}`}>
                <rect x={px + 6} y={py + 6} width={948} height={528} rx={10} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${id}${i})`}>
              {p ? <g transform={`translate(${px + 480} ${py + 270}) scale(${zoom}) translate(${-focus[0]} ${-focus[1]})`}>{p}</g> : null}
              <rect x={px} y={py} width={960} height={540} fill="#050506" opacity={p ? d * 0.92 : 1} />
              {p && d > 0.5 ? (
                <text x={px + 480} y={py + 286} textAnchor="middle" fontFamily={HAND} fontSize={40} letterSpacing="0.1em" fill={C.textDim} opacity={d}>
                  OFFLINE
                </text>
              ) : null}
            </g>
            {labels[i] ? (
              <g transform={`translate(${px + 30} ${py + 470})`} opacity={1 - d * 0.6}>
                <rect x={0} y={0} width={labels[i].length * 17 + 56} height={44} rx={10} fill="#000000" opacity={0.55} />
                <circle cx={22} cy={22} r={8} fill={talking[i] && d < 0.5 ? C.amber : '#4A4F5A'} />
                <text x={40} y={31} fontFamily={HAND} fontSize={28} fill={C.text}>
                  {labels[i]}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

// Monitor bezel for full-screen UI close-ups. Children draw inside a 1600×860 screen.
export const MonitorFrame: React.FC<{ children: React.ReactNode; glow?: string }> = ({ children, glow = '#6C8CC4' }) => {
  const id = useSvgId('mon');
  return (
    <g>
      <rect width={1920} height={1080} fill="#08090B" />
      <Glow x={960} y={560} r={1100} color={glow} opacity={0.25} />
      <g transform="translate(125 150) scale(0.87)">
      <rect x={140} y={70} width={1640} height={900} rx={24} fill="#0B0C0F" stroke={C.line} strokeWidth={6} />
      <defs>
        <clipPath id={id}>
          <rect x={160} y={90} width={1600} height={860} rx={10} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g transform="translate(160 90)">{children}</g>
      </g>
      <rect x={880} y={970} width={160} height={60} fill="#14161A" />
      <rect x={760} y={1030} width={400} height={20} rx={8} fill="#14161A" />
      </g>
    </g>
  );
};

export type Slot = { variant: Variant; tag: string; joinAt?: number; readyAt?: number; offline?: boolean };

// The squad lobby: four slots. A slot shows empty until `joinAt`, then READY after `readyAt` (frames).
export const LobbyScreen: React.FC<{ frame: number; slots: Slot[]; status?: string; adult?: boolean }> = ({ frame, slots, status }) => {
  const joined = slots.filter((s) => !s.offline && (s.joinAt === undefined || frame >= s.joinAt)).length;
  const ready = slots.filter((s) => !s.offline && (s.joinAt === undefined || frame >= s.joinAt) && (s.readyAt === undefined || frame >= s.readyAt)).length;
  return (
    <g>
      <rect width={1600} height={860} fill="#101624" />
      <rect width={1600} height={110} fill="#0B0F19" />
      <text x={60} y={72} fontFamily={HAND} fontSize={52} letterSpacing="0.12em" fill={C.text}>
        SQUAD LOBBY
      </text>
      <text x={1540} y={72} textAnchor="end" fontFamily={HAND} fontSize={52} fill={joined === 4 ? C.amber : C.textDim}>
        {joined}/4
      </text>
      {slots.map((s, i) => {
        const x = 70 + i * 375;
        const isIn = !s.offline && (s.joinAt === undefined || frame >= s.joinAt);
        const pop = s.joinAt !== undefined ? Math.min(1, Math.max(0, (frame - s.joinAt) / 8)) : 1;
        const ready = isIn && (s.readyAt === undefined || frame >= s.readyAt);
        return (
          <g key={i} transform={`translate(${x} 170)`}>
            <rect width={335} height={500} rx={22} fill={isIn ? '#1A2335' : '#121826'} stroke={isIn ? '#2E3B55' : '#1E2638'} strokeWidth={4} strokeDasharray={isIn ? undefined : '14 10'} />
            {isIn ? (
              <g opacity={pop} transform={`translate(167 ${200 + (1 - pop) * 30})`}>
                <Head x={0} y={0} scale={0.95} variant={s.variant} eyes="happy" mouth="grin" headset />
              </g>
            ) : (
              <text x={167} y={240} textAnchor="middle" fontFamily={HAND} fontSize={90} fill="#2A3346">
                +
              </text>
            )}
            <text x={167} y={380} textAnchor="middle" fontFamily={HAND} fontSize={42} fill={isIn ? C.text : '#3A4358'}>
              {isIn ? s.tag : s.offline ? 'OFFLINE' : 'EMPTY'}
            </text>
            <rect x={60} y={420} width={215} height={52} rx={26} fill={ready ? C.amber : '#232B3D'} />
            <text x={167} y={457} textAnchor="middle" fontFamily={HAND} fontSize={30} letterSpacing="0.1em" fill={ready ? '#1A1408' : '#4A5368'}>
              {ready ? 'READY' : isIn ? '...' : '—'}
            </text>
          </g>
        );
      })}
      <text x={800} y={790} textAnchor="middle" fontFamily={HAND} fontSize={40} letterSpacing="0.08em" fill={C.textDim}>
        {status ?? (ready === 4 ? 'ALL PLAYERS READY' : 'WAITING FOR PLAYERS' + '.'.repeat(1 + (Math.floor(frame / 12) % 3)))}
      </text>
    </g>
  );
};

export const VictoryScreen: React.FC<{ frame: number; t: number }> = ({ frame, t }) => {
  const pop = Math.min(1, t * 3);
  return (
    <g>
      <rect width={1600} height={860} fill="#141A28" />
      {Array.from({ length: 60 }).map((_, i) => {
        const x = random(`cx${i}`) * 1600;
        const y = ((random(`cy${i}`) * 860 + frame * (6 + random(`cs${i}`) * 6)) % 900) - 40;
        return <rect key={i} x={x} y={y} width={12} height={12} fill={[C.amber, '#6C8CC4', '#8A5A44', '#5F6B4F'][i % 4]} transform={`rotate(${frame * 4 + i * 20} ${x + 6} ${y + 6})`} />;
      })}
      <g transform={`translate(800 380) scale(${0.6 + pop * 0.4})`} opacity={pop}>
        <text x={0} y={0} textAnchor="middle" fontFamily={HAND} fontSize={220} letterSpacing="0.12em" fill={C.amber}>
          VICTORY
        </text>
      </g>
      <text x={800} y={560} textAnchor="middle" fontFamily={HAND} fontSize={44} letterSpacing="0.1em" fill={C.text} opacity={pop}>
        SQUAD WINS · 1 HP LEFT
      </text>
    </g>
  );
};

export type Friend = { variant: Variant; tag: string; status: string; online?: boolean };

export const FriendsListScreen: React.FC<{ friends: Friend[]; title?: string }> = ({ friends, title = 'FRIENDS' }) => (
  <g>
    <rect width={1600} height={860} fill="#101624" />
    <text x={60} y={90} fontFamily={HAND} fontSize={56} letterSpacing="0.12em" fill={C.text}>
      {title}
    </text>
    {friends.map((f, i) => (
      <g key={i} transform={`translate(60 ${150 + i * 170})`}>
        <rect width={1480} height={140} rx={20} fill="#161E2E" />
        <circle cx={80} cy={70} r={50} fill="#222B3E" />
        <Head x={80} y={74} scale={0.5} variant={f.variant} eyes={f.online ? 'open' : 'closed'} mouth={f.online ? 'smile' : 'flat'} />
        <text x={170} y={66} fontFamily={HAND} fontSize={44} fill={f.online ? C.text : C.textDim}>
          {f.tag}
        </text>
        <circle cx={182} cy={104} r={8} fill={f.online ? C.amber : '#4A4F5A'} />
        <text x={200} y={114} fontFamily={HAND} fontSize={30} fill={f.online ? C.amber : C.textDim}>
          {f.status}
        </text>
      </g>
    ))}
  </g>
);

export type GroupMsg = { who: Variant; name: string; text: string; at: number; mine?: boolean };

// Group chat on the phone: header with four avatars, sender names over bubbles, an input bar.
export const GroupChatScreen: React.FC<{ sw: number; sh: number; frame: number; title: string; msgs: GroupMsg[]; typed?: string; members: Variant[] }> = ({
  sw,
  sh,
  frame,
  title,
  msgs,
  typed = '',
  members,
}) => {
  const shown = msgs.filter((m) => frame >= m.at);
  const rowH = 112;
  const bottom = 170 + shown.length * rowH;
  const scroll = Math.max(0, bottom - (sh - 150));
  return (
    <g>
      <g transform={`translate(0 ${-scroll})`}>
        {shown.map((m, i) => {
          const a = Math.min(1, (frame - m.at) / 8);
          const tw = Math.min(sw * 0.72, 30 + m.text.length * 15);
          const top = 170 + i * rowH;
          const bx = m.mine ? sw - 24 - tw : 70;
          return (
            <g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 14})`}>
              {!m.mine ? (
                <>
                  <circle cx={38} cy={top + 62} r={22} fill="#2A3140" />
                  <Head x={38} y={top + 64} scale={0.22} variant={m.who} eyes="open" mouth="smile" />
                  <text x={bx + 6} y={top + 20} fontFamily={HAND} fontSize={22} fill={C.textDim}>
                    {m.name}
                  </text>
                </>
              ) : null}
              <rect x={bx} y={top + 30} width={tw} height={62} rx={26} fill={m.mine ? '#3D5A80' : '#2C3038'} />
              <text x={bx + 20} y={top + 71} fontFamily={HAND} fontSize={30} fill={C.text}>
                {m.text}
              </text>
            </g>
          );
        })}
      </g>
      <rect width={sw} height={140} fill="#141922" />
      {members.map((v, i) => (
        <g key={i}>
          <circle cx={sw / 2 - 66 + i * 44} cy={56} r={24} fill="#2A3140" stroke="#141922" strokeWidth={4} />
          <Head x={sw / 2 - 66 + i * 44} y={58} scale={0.24} variant={v} eyes="happy" mouth="smile" />
        </g>
      ))}
      <text x={sw / 2} y={118} textAnchor="middle" fontFamily={HAND} fontSize={28} fill={C.text}>
        {title}
      </text>
      <line x1={0} x2={sw} y1={140} y2={140} stroke={C.lineSoft} strokeWidth={2} />
      <rect x={0} y={sh - 110} width={sw} height={110} fill="#1A1E26" />
      <rect x={20} y={sh - 90} width={sw - 40} height={64} rx={32} fill="#2A2F39" />
      <text x={46} y={sh - 47} fontFamily={HAND} fontSize={30} fill={typed ? C.text : C.textDim}>
        {typed || 'Message'}
      </text>
    </g>
  );
};

// A headset hanging on a wall hook. `dust` 0..1 greys it out and adds cobweb.
export const HangingHeadset: React.FC<{ x: number; y: number; dust: number }> = ({ x, y, dust }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-6} y={-10} width={12} height={34} rx={4} fill={C.line} />
    <g transform="translate(0 30)">
      <path d="M -70 90 Q -74 0 0 0 Q 74 0 70 90" stroke="#1B1D22" strokeWidth={14} fill="none" strokeLinecap="round" />
      <rect x={-92} y={70} width={40} height={80} rx={16} fill="#1B1D22" />
      <rect x={52} y={70} width={40} height={80} rx={16} fill="#1B1D22" />
      <rect x={-92} y={70} width={40} height={80} rx={16} fill="#9AA0AA" opacity={dust * 0.3} />
      <rect x={52} y={70} width={40} height={80} rx={16} fill="#9AA0AA" opacity={dust * 0.3} />
      <path d="M -70 90 Q -74 0 0 0 Q 74 0 70 90" stroke="#9AA0AA" strokeOpacity={dust * 0.25} strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>
    {dust > 0.3 ? (
      <path d="M -120 -40 L -40 20 M -120 -40 L -60 -60 M -120 -40 L -100 20 M -60 -60 Q -70 0 -100 20 M -80 -48 Q -84 -6 -108 6" stroke="#C9CDD4" strokeWidth={1.4} fill="none" opacity={(dust - 0.3) * 0.6} />
    ) : null}
  </g>
);
