import React from 'react';
import { HAND } from '../fonts';
import { C } from '../theme';
import { Head, Variant } from './Character';

// Birthday set pieces (episode 10+), all phone screens drawn in screen space (sw × sh):
// a lock screen with a notification stack, a dated chat thread, the chats list, and a friends feed.

const Avatar: React.FC<{ x: number; y: number; r: number; variant: Variant; happy?: boolean }> = ({ x, y, r, variant, happy = true }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#2A3140" />
    <Head x={0} y={r * 0.12} scale={r / 100} variant={variant} eyes={happy ? 'happy' : 'open'} mouth="smile" />
  </g>
);

// Little cake glyph for the calendar reminder.
const CakeIcon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-26} y={-6} width={52} height={28} rx={6} fill="#F4EEE6" />
    <rect x={-26} y={-6} width={52} height={8} rx={4} fill="#E48C86" />
    <rect x={-3} y={-24} width={6} height={18} rx={2} fill={C.amber} />
    <ellipse cx={0} cy={-30} rx={4} ry={7} fill="#FFD27A" />
  </g>
);

export type LockNotice = { title: string; text: string; appear: number; variant?: Variant; icon?: 'cake' | 'app' };

// Lock screen: big clock, date, and notifications that stack newest-on-top (frames in `appear`).
export const LockScreen: React.FC<{ sw: number; sh: number; frame: number; clock: string; date: string; notices: LockNotice[]; sky?: string }> = ({
  sw,
  sh,
  frame,
  clock,
  date,
  notices,
  sky = '#141A26',
}) => {
  const shown = notices.filter((n) => frame >= n.appear).reverse();
  const rowH = 112;
  return (
    <g>
      <rect width={sw} height={sh} fill={sky} />
      <text x={sw / 2} y={110} textAnchor="middle" fontFamily={HAND} fontSize={34} fill={C.text} opacity={0.85}>
        {date}
      </text>
      <text x={sw / 2} y={250} textAnchor="middle" fontFamily={HAND} fontSize={150} fill={C.text}>
        {clock}
      </text>
      {shown.slice(0, 6).map((n, i) => {
        const a = Math.min(1, (frame - n.appear) / 6);
        const y = 310 + i * rowH - (1 - a) * 30;
        return (
          <g key={`${n.title}${n.appear}`} opacity={a}>
            <rect x={16} y={y} width={sw - 32} height={rowH - 12} rx={26} fill="#E9E6DF" opacity={0.95} />
            {n.icon === 'cake' ? (
              <g>
                <rect x={32} y={y + 18} width={64} height={64} rx={16} fill="#FFFFFF" />
                <rect x={32} y={y + 18} width={64} height={18} rx={8} fill={C.red} />
                <CakeIcon x={64} y={y + 58} s={0.8} />
              </g>
            ) : n.icon === 'app' ? (
              <g>
                <rect x={32} y={y + 18} width={64} height={64} rx={16} fill="#D4524A" />
                <text x={64} y={y + 64} textAnchor="middle" fontFamily={HAND} fontSize={36} fill="#FFFFFF">
                  %
                </text>
              </g>
            ) : (
              <Avatar x={64} y={y + 50} r={32} variant={n.variant ?? 'sam'} />
            )}
            <text x={114} y={y + 42} fontFamily={HAND} fontSize={30} fill={C.ink}>
              {n.title}
            </text>
            <text x={114} y={y + 78} fontFamily={HAND} fontSize={28} fill="#4A4D55">
              {n.text}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export type ThreadMsg = { from: 'me' | 'them'; text: string; at: number; date?: string; seen?: boolean };

// One-to-one chat with a dated history. `date` puts a separator above the bubble.
export const Thread: React.FC<{ sw: number; sh: number; frame: number; name: string; variant: Variant; msgs: ThreadMsg[]; scroll?: number }> = ({ sw, sh, frame, name, variant, msgs, scroll = 0 }) => {
  let y = 170;
  const rows = msgs.map((m) => {
    const top = y + (m.date ? 70 : 0);
    y = top + 92 + (m.seen ? 34 : 0);
    return { ...m, top };
  });
  return (
    <g>
      <g transform={`translate(0 ${-scroll})`}>
        {rows
          .filter((r) => frame >= r.at)
          .map((r, i) => {
            const a = Math.min(1, (frame - r.at) / 8);
            const tw = Math.min(sw * 0.78, 40 + r.text.length * 16);
            const mine = r.from === 'me';
            const bx = mine ? sw - 24 - tw : 24;
            return (
              <g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 14})`}>
                {r.date ? (
                  <text x={sw / 2} y={r.top - 26} textAnchor="middle" fontFamily={HAND} fontSize={26} fill={C.textDim}>
                    {r.date}
                  </text>
                ) : null}
                <rect x={bx} y={r.top} width={tw} height={70} rx={28} fill={mine ? '#3D5A80' : '#2C3038'} />
                <text x={bx + 22} y={r.top + 46} fontFamily={HAND} fontSize={33} fill={C.text}>
                  {r.text}
                </text>
                {r.seen ? (
                  <text x={mine ? sw - 30 : 30} y={r.top + 100} textAnchor={mine ? 'end' : 'start'} fontFamily={HAND} fontSize={26} fill={C.red}>
                    Seen · no reply
                  </text>
                ) : null}
              </g>
            );
          })}
      </g>
      <rect width={sw} height={140} fill="#141922" />
      <Avatar x={sw / 2} y={60} r={36} variant={variant} />
      <text x={sw / 2} y={126} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={C.text}>
        {name}
      </text>
      <line x1={0} x2={sw} y1={140} y2={140} stroke={C.lineSoft} strokeWidth={2} />
    </g>
  );
};

export type ChatRow = { name: string; variant: Variant; text: string; when: string; seenAt: number };

// Chats list. Each row's red "Seen" lands at `seenAt` (frame).
export const ChatList: React.FC<{ sw: number; sh: number; frame: number; rows: ChatRow[] }> = ({ sw, frame, rows }) => (
  <g>
    <rect width={sw} height={150} fill="#141922" />
    <text x={30} y={110} fontFamily={HAND} fontSize={58} fill={C.text}>
      Chats
    </text>
    {rows.map((r, i) => {
      const y = 170 + i * 150;
      const seen = Math.max(0, Math.min(1, (frame - r.seenAt) / 6));
      return (
        <g key={r.name}>
          <Avatar x={72} y={y + 66} r={46} variant={r.variant} />
          <text x={140} y={y + 52} fontFamily={HAND} fontSize={38} fill={C.text}>
            {r.name}
          </text>
          <text x={140} y={y + 96} fontFamily={HAND} fontSize={29} fill={C.textDim}>
            {r.text}
          </text>
          <text x={sw - 28} y={y + 52} textAnchor="end" fontFamily={HAND} fontSize={26} fill={C.textDim}>
            {r.when}
          </text>
          <g opacity={seen} transform={`translate(${sw - 28} ${y + 100}) scale(${1 + (1 - seen) * 0.6})`}>
            <text textAnchor="end" fontFamily={HAND} fontSize={30} fill={C.red}>
              Seen
            </text>
          </g>
          <line x1={140} x2={sw} y1={y + 140} y2={y + 140} stroke={C.lineSoft} strokeWidth={2} />
        </g>
      );
    })}
  </g>
);

export type Post = { name: string; variant: Variant; caption: string; people: Variant[]; tint: string };

// Feed of friends' posts: a party, a trip, a new job. `scroll` px moves it up.
export const FeedScreen: React.FC<{ sw: number; sh: number; scroll: number; posts: Post[] }> = ({ sw, scroll, posts }) => {
  const postH = sw + 190;
  return (
    <g>
      <g transform={`translate(0 ${150 - scroll})`}>
        {posts.map((p, i) => {
          const y = i * postH;
          return (
            <g key={i}>
              <Avatar x={56} y={y + 50} r={32} variant={p.variant} />
              <text x={104} y={y + 62} fontFamily={HAND} fontSize={32} fill={C.text}>
                {p.name}
              </text>
              <rect x={0} y={y + 100} width={sw} height={sw * 0.82} fill={p.tint} />
              <circle cx={sw * 0.78} cy={y + 180} r={60} fill={C.amber} opacity={0.5} />
              {p.people.map((v, k) => (
                <Head key={k} x={sw * (0.22 + (k * 0.56) / Math.max(1, p.people.length - 1))} y={y + 100 + sw * 0.5} scale={0.5} variant={v} eyes="happy" mouth="grin" blush={0.4} />
              ))}
              <text x={24} y={y + 100 + sw * 0.82 + 56} fontFamily={HAND} fontSize={30} fill={C.text}>
                {p.caption}
              </text>
            </g>
          );
        })}
      </g>
      <rect width={sw} height={150} fill="#141922" />
      <text x={30} y={110} fontFamily={HAND} fontSize={58} fill={C.text}>
        Feed
      </text>
    </g>
  );
};
