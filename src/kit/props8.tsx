import React, { useId } from 'react';
import { HAND } from '../fonts';
import { C, FLOOR } from '../theme';
import { Head } from './Character';
import { ChatMsg } from './props3';

// Mom set pieces (episode 8+): a two-panel split screen, call screens (incoming, declined,
// connected, outgoing), the call log, her chat, a voicemail player, a cane and a birthday cake.

const useSvgId = (p: string) => `${p}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

const GREEN = '#4FBF73';

// Two panels side by side; each child is a full 1920×1080 scene, cropped around its focus at `zoom`
// (one zoom for both, or one per panel).
export const Split: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  labels?: [string, string];
  focus?: [[number, number], [number, number]];
  zoom?: number | [number, number];
}> = ({ left, right, labels, focus = [[960, 560], [960, 560]], zoom = 0.62 }) => {
  const id = useSvgId('split');
  return (
    <g>
      <rect width={1920} height={1080} fill="#050506" />
      {[left, right].map((p, i) => {
        const px = i * 960;
        const [fx, fy] = focus[i];
        const z = typeof zoom === 'number' ? zoom : zoom[i];
        return (
          <g key={i}>
            <defs>
              <clipPath id={`${id}${i}`}>
                <rect x={px + 6} y={6} width={948} height={1068} rx={12} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${id}${i})`}>
              <g transform={`translate(${px + 480} 540) scale(${z}) translate(${-fx} ${-fy})`}>{p}</g>
            </g>
            {labels ? (
              <g transform={`translate(${px + 40} 980)`}>
                <rect x={0} y={0} width={labels[i].length * 17 + 40} height={48} rx={10} fill="#000000" opacity={0.55} />
                <text x={20} y={34} fontFamily={HAND} fontSize={30} letterSpacing="0.06em" fill={C.text}>
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

export const Heart: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.red }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 6 c -12 -16 -38 -2 -18 18 l 18 18 l 18 -18 c 20 -20 -6 -34 -18 -18 z" fill={color} />
);

export const MomAvatar: React.FC<{ x: number; y: number; r?: number; happy?: boolean }> = ({ x, y, r = 30, happy = true }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#3A332D" />
    <Head x={0} y={r * 0.12} scale={r / 100} variant="mom" eyes={happy ? 'happy' : 'open'} mouth="smile" blush={0.4} />
  </g>
);

// Phone handset glyph, centred; `down` rotates it into the hang-up position.
const Handset: React.FC<{ down?: boolean }> = ({ down = false }) => (
  <path
    transform={`rotate(${down ? 135 : 0}) translate(-2 2)`}
    d="M -24 -22 q 4 -10 12 -6 l 8 10 q 4 6 -2 10 l -6 4 q 6 14 20 20 l 4 -6 q 4 -6 10 -2 l 10 8 q 4 8 -6 12 q -40 6 -50 -50 z"
    fill="#FFFFFF"
  />
);

export type CallPhase = 'incoming' | 'declined' | 'connected' | 'calling' | 'noAnswer';

// Call with Mom. incoming: pulsing avatar + decline/accept; `press` 0..1 squeezes the button on `pressSide`.
export const MomCall: React.FC<{ sw: number; sh: number; frame: number; phase: CallPhase; press?: number; pressSide?: 'decline' | 'accept'; seconds?: number; label?: string }> = ({
  sw,
  sh,
  frame,
  phase,
  press = 0,
  pressSide = 'decline',
  seconds = 0,
  label,
}) => {
  const live = phase === 'incoming' || phase === 'calling';
  const pulse = live ? 1 + Math.sin(frame * 0.5) * 0.05 : 1;
  const status =
    label ??
    {
      incoming: 'mobile',
      declined: 'Call declined',
      connected: `00:${String(Math.floor(seconds)).padStart(2, '0')}`,
      calling: 'calling...',
      noAnswer: 'No answer',
    }[phase];
  const dim = phase === 'declined' || phase === 'noAnswer';
  const ring = (frame % 30) / 30;
  return (
    <g opacity={dim ? 0.75 : 1}>
      <g transform={`translate(${sw / 2} ${sh * 0.3}) scale(${pulse})`}>
        {live ? <circle r={130 + ring * 70} fill="none" stroke={phase === 'incoming' ? GREEN : C.amber} strokeOpacity={0.35 * (1 - ring)} strokeWidth={5} /> : null}
        <MomAvatar x={0} y={0} r={120} happy={!dim} />
      </g>
      <text x={sw / 2 - 26} y={sh * 0.3 + 205} textAnchor="middle" fontFamily={HAND} fontSize={76} fill={C.text}>
        Mom
      </text>
      <Heart x={sw / 2 + 74} y={sh * 0.3 + 160} s={1.1} />
      <text x={sw / 2} y={sh * 0.3 + 262} textAnchor="middle" fontFamily={HAND} fontSize={36} fill={dim ? C.red : C.textDim}>
        {status}
      </text>
      {phase === 'incoming' ? (
        <>
          <g transform={`translate(${sw * 0.27} ${sh * 0.8}) scale(${pressSide === 'decline' ? 1 - press * 0.15 : 1})`}>
            <circle r={66} fill={C.red} />
            <Handset down />
          </g>
          <g transform={`translate(${sw * 0.73} ${sh * 0.8}) scale(${pressSide === 'accept' ? 1 - press * 0.15 : 1})`}>
            <circle r={66} fill={GREEN} />
            <Handset />
          </g>
          <text x={sw * 0.27} y={sh * 0.8 + 110} textAnchor="middle" fontFamily={HAND} fontSize={28} fill={C.textDim}>
            Decline
          </text>
          <text x={sw * 0.73} y={sh * 0.8 + 110} textAnchor="middle" fontFamily={HAND} fontSize={28} fill={C.textDim}>
            Accept
          </text>
        </>
      ) : phase === 'connected' || phase === 'calling' ? (
        <g transform={`translate(${sw / 2} ${sh * 0.8})`}>
          <circle r={66} fill={C.red} />
          <Handset down />
        </g>
      ) : null}
    </g>
  );
};

// Recents: a long column of "Mom · Declined" rows. `scroll` px moves the list up.
export const CallLog: React.FC<{ sw: number; sh: number; scroll: number; dates: string[] }> = ({ sw, sh, scroll, dates }) => {
  const rowH = 118;
  return (
    <g>
      <g transform={`translate(0 ${-scroll})`}>
        {dates.map((d, i) => {
          const y = 180 + i * rowH;
          return (
            <g key={i}>
              <MomAvatar x={70} y={y + 56} r={38} happy={false} />
              <text x={130} y={y + 54} fontFamily={HAND} fontSize={38} fill={C.red}>
                Mom
              </text>
              <path d={`M 134 ${y + 74} l 16 16 m 0 -12 l 0 12 l -12 0`} stroke={C.textDim} strokeWidth={3} fill="none" strokeLinecap="round" />
              <text x={160} y={y + 92} fontFamily={HAND} fontSize={28} fill={C.textDim}>
                Declined
              </text>
              <text x={sw - 30} y={y + 70} textAnchor="end" fontFamily={HAND} fontSize={30} fill={C.textDim}>
                {d}
              </text>
              <line x1={130} x2={sw} y1={y + rowH - 2} y2={y + rowH - 2} stroke={C.lineSoft} strokeWidth={2} />
            </g>
          );
        })}
      </g>
      <rect width={sw} height={150} fill="#141922" />
      <text x={30} y={110} fontFamily={HAND} fontSize={58} fill={C.text}>
        Recents
      </text>
      <line x1={0} x2={sw} y1={150} y2={150} stroke={C.lineSoft} strokeWidth={2} />
      <rect y={sh - 40} width={sw} height={40} fill="#141922" opacity={0.8} />
    </g>
  );
};

// Thread with Mom: her long, warm bubbles; his two-word replies. Bubbles wrap at `wrap` chars.
export const MomChat: React.FC<{ sw: number; sh: number; frame: number; msgs: ChatMsg[] }> = ({ sw, sh, frame, msgs }) => {
  const wrap = 22;
  const lineH = 40;
  const lines = (text: string) => {
    const out: string[] = [];
    let cur = '';
    for (const w of text.split(' ')) {
      if ((cur + ' ' + w).trim().length > wrap) {
        out.push(cur);
        cur = w;
      } else cur = (cur + ' ' + w).trim();
    }
    out.push(cur);
    return out;
  };
  let y = 170;
  const rows = msgs.map((m) => {
    const ls = lines(m.text);
    const h = 28 + ls.length * lineH;
    const top = y;
    y += h + (m.seen ? 52 : 22);
    return { ...m, ls, h, top };
  });
  const shown = rows.filter((r) => frame >= r.at);
  const last = shown[shown.length - 1];
  const scroll = last ? Math.max(0, last.top + last.h - sh * 0.62) : 0; // newest bubble sits above the captions
  return (
    <g>
      <g transform={`translate(0 ${-scroll})`}>
        {shown.map((r, i) => {
          const a = Math.min(1, (frame - r.at) / 8);
          const mine = r.from === 'me';
          const longest = Math.max(...r.ls.map((l) => l.length));
          const tw = Math.min(sw * 0.8, 44 + longest * 16);
          const bx = mine ? sw - 24 - tw : 24;
          return (
            <g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 14})`}>
              <rect x={bx} y={r.top} width={tw} height={r.h} rx={26} fill={mine ? '#3D5A80' : '#2C3038'} />
              {r.ls.map((l, k) => (
                <text key={k} x={bx + 22} y={r.top + 46 + k * lineH} fontFamily={HAND} fontSize={32} fill={C.text}>
                  {l}
                </text>
              ))}
              {r.seen ? (
                <text x={sw - 30} y={r.top + r.h + 34} textAnchor="end" fontFamily={HAND} fontSize={24} fill={C.textDim}>
                  Seen
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
      <rect width={sw} height={140} fill="#141922" />
      <MomAvatar x={sw / 2} y={62} r={36} />
      <text x={sw / 2} y={126} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={C.text}>
        Mom
      </text>
      <line x1={0} x2={sw} y1={140} y2={140} stroke={C.lineSoft} strokeWidth={2} />
    </g>
  );
};

// Voicemail from Mom. `progress` 0..1 fills the waveform; `playing` swaps play/pause.
export const Voicemail: React.FC<{ sw: number; sh: number; frame: number; progress: number; playing: boolean; length?: number }> = ({ sw, sh, frame, progress, playing, length = 41 }) => {
  const bars = 34;
  const at = Math.floor(progress * length);
  const wy = sh * 0.64;
  return (
    <g>
      <text x={sw / 2} y={120} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={C.text}>
        Voicemail
      </text>
      <MomAvatar x={sw / 2} y={sh * 0.3} r={110} />
      <text x={sw / 2} y={sh * 0.3 + 180} textAnchor="middle" fontFamily={HAND} fontSize={58} fill={C.text}>
        Mom
      </text>
      <text x={sw / 2} y={sh * 0.3 + 226} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={C.textDim}>
        Nov 3 · unplayed
      </text>
      {Array.from({ length: bars }).map((_, i) => {
        const x = 40 + (i * (sw - 80)) / (bars - 1);
        const past = i / bars < progress;
        const live = playing && past && i / bars > progress - 0.08;
        const base = 14 + Math.abs(Math.sin(i * 1.7) * 40 + Math.sin(i * 0.6) * 22);
        const h = base * (live ? 1 + Math.sin(frame * 0.8 + i) * 0.35 : 1);
        return <line key={i} x1={x} x2={x} y1={wy - h / 2} y2={wy + h / 2} stroke={past ? C.amber : '#3A3F4A'} strokeWidth={8} strokeLinecap="round" />;
      })}
      <text x={40} y={wy + 90} fontFamily={HAND} fontSize={30} fill={C.textDim}>
        {`0:${String(at).padStart(2, '0')}`}
      </text>
      <text x={sw - 40} y={wy + 90} textAnchor="end" fontFamily={HAND} fontSize={30} fill={C.textDim}>
        {`0:${length}`}
      </text>
      <g transform={`translate(${sw / 2} ${sh * 0.82})`}>
        <circle r={62} fill={C.amber} />
        {playing ? (
          <g fill="#1A1A1A">
            <rect x={-20} y={-24} width={14} height={48} rx={4} />
            <rect x={6} y={-24} width={14} height={48} rx={4} />
          </g>
        ) : (
          <path d="M -14 -26 L 26 0 L -14 26 Z" fill="#1A1A1A" />
        )}
      </g>
    </g>
  );
};

// Walking cane in hand space: drops `len` px straight down from the grip, crook over the hand.
export const Cane: React.FC<{ len: number }> = ({ len }) => (
  <g>
    <path d="M -16 4 Q -16 -18 4 -18 Q 22 -18 22 2" stroke="#5A4630" strokeWidth={9} fill="none" strokeLinecap="round" />
    <line x1={22} y1={2} x2={22} y2={len} stroke="#5A4630" strokeWidth={9} strokeLinecap="round" />
    <rect x={14} y={len - 6} width={16} height={10} rx={3} fill="#1A1B20" />
  </g>
);

// Small birthday cake on a surface at y, one candle. `lit` 0..1.
export const Cake: React.FC<{ x: number; y: number; lit: number; frame: number }> = ({ x, y, lit, frame }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={86} ry={10} fill="#D9D4C9" />
    <rect x={-62} y={-70} width={124} height={68} rx={10} fill="#E6D3C2" />
    <path d="M -62 -60 Q -46 -44 -30 -60 Q -14 -44 2 -60 Q 18 -44 34 -60 Q 50 -44 62 -60 L 62 -66 L -62 -66 Z" fill="#F4EEE6" />
    <rect x={-5} y={-112} width={10} height={44} rx={3} fill={C.amber} opacity={0.85} />
    {lit > 0 ? (
      <g opacity={lit}>
        <ellipse cx={Math.sin(frame * 0.4) * 1.5} cy={-126} rx={7} ry={14} fill="#FFD27A" />
        <circle cx={0} cy={-124} r={40} fill={C.amber} opacity={0.18} />
      </g>
    ) : null}
  </g>
);

// Porch at night/dawn: exterior wall, house number, a porch lamp; the Door is drawn by the scene.
export const Porch: React.FC<{ dawn?: number }> = ({ dawn = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#14161B" />
    <rect width={1920} height={FLOOR} fill="#1E1C1A" />
    {Array.from({ length: 16 }).map((_, i) => (
      <line key={i} x1={0} x2={1920} y1={60 + i * 50} y2={60 + i * 50} stroke="#26231F" strokeWidth={3} />
    ))}
    <rect y={FLOOR} width={1920} height={1080 - FLOOR} fill="#121315" />
    <rect x={0} y={FLOOR} width={1920} height={8} fill="#2A2724" />
    <rect width={1920} height={1080} fill={C.amber} opacity={dawn * 0.06} />
  </g>
);
