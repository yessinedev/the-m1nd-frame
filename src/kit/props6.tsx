import React from 'react';
import { random } from 'remotion';
import { HAND } from '../fonts';
import { C, FLOOR } from '../theme';
import { Head, Variant } from './Character';
import { Glow } from './props';

// Body-image set pieces (episode 6+): school lockers, towel-covered mirror, fitting room,
// inner-voice comment bubbles, stairs, backyard pool, photo-tag and feed screens.

export const Lockers: React.FC<{ offset?: number }> = ({ offset = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A1C22" />
    <g transform={`translate(${-offset} 0)`}>
      {Array.from({ length: 22 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 110 - 60} ${FLOOR - 520})`}>
          <rect width={104} height={500} rx={4} fill={['#3B4A5E', '#34455A', '#5A4A3B'][i % 7 === 3 ? 2 : i % 2]} stroke="#232A35" strokeWidth={3} />
          {[0, 1, 2].map((r) => (
            <rect key={r} x={22} y={40 + r * 10} width={60} height={4} rx={2} fill="#232A35" />
          ))}
          <rect x={82} y={230} width={8} height={40} rx={3} fill="#232A35" />
        </g>
      ))}
    </g>
    <rect y={FLOOR - 20} width={1920} height={20} fill="#151820" />
    <rect y={FLOOR} width={1920} height={240} fill="#121419" />
    <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

// A towel hung over the mirror. `lift` 0..1 pulls it off.
export const Towel: React.FC<{ x: number; y: number; w?: number; h?: number; lift: number }> = ({ x, y, w = 380, h = 470, lift }) => (
  <g transform={`translate(${x + lift * 260} ${y - lift * 80}) rotate(${lift * 24})`} opacity={Math.max(0, 1 - Math.max(0, lift - 0.6) * 2.5)}>
    <rect x={-10} y={-20} width={w + 20} height={h * 0.92} rx={14} fill="#B9A58A" />
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={i} x1={20 + i * (w / 6)} y1={-10} x2={30 + i * (w / 6)} y2={h * 0.88} stroke="#A38F74" strokeWidth={6} />
    ))}
    <rect x={-10} y={h * 0.78} width={w + 20} height={18} fill="#A38F74" />
  </g>
);

// Fitting room: curtain left, mirror right, a hook.
export const FittingRoom: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect width={1920} height={1080} fill="#1B1A1E" />
    <rect y={FLOOR} width={1920} height={240} fill="#141317" />
    <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
    <rect x={0} y={60} width={1920} height={14} fill={C.line} />
    {Array.from({ length: 8 }).map((_, i) => (
      <path key={i} d={`M ${120 + i * 56} 74 Q ${140 + i * 56 + Math.sin(frame * 0.03 + i) * 4} ${FLOOR / 2} ${120 + i * 56} ${FLOOR - 10}`} stroke="#6E5A6E" strokeWidth={60} fill="none" opacity={0.9} />
    ))}
    <Glow x={1200} y={200} r={500} color="#FFFFFF" opacity={0.08} />
  </g>
);

// Floating comment from the past, for the inner-voice void.
export const Bubble: React.FC<{ x: number; y: number; text: string; scale?: number; opacity?: number }> = ({ x, y, text, scale = 1, opacity = 1 }) => {
  const w = 40 + text.length * 22;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x={-w / 2} y={-44} width={w} height={88} rx={44} fill="#2A1E22" stroke="#5A3A40" strokeWidth={3} />
      <path d="M -20 40 L -34 70 L 0 42 Z" fill="#2A1E22" />
      <text x={0} y={14} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={C.voice}>
        {text}
      </text>
    </g>
  );
};

// A short flight of stairs (apartment stairwell). Step tops: STAIRS.step(i).
export const STAIRS = { x: 520, rise: 70, run: 150, steps: 6, step: (i: number) => ({ x: 520 + i * 150, y: FLOOR - (i + 1) * 70 }) };

export const Stairs: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#16181D" />
    <rect y={FLOOR} width={1920} height={240} fill={C.floor} />
    {Array.from({ length: STAIRS.steps }).map((_, i) => {
      const s = STAIRS.step(i);
      return <rect key={i} x={s.x} y={s.y} width={1920} height={FLOOR - s.y} fill={i % 2 ? '#23262E' : '#262A33'} stroke={C.line} strokeWidth={3} />;
    })}
    <line x1={STAIRS.x - 40} y1={FLOOR - 300} x2={STAIRS.x + STAIRS.steps * STAIRS.run} y2={FLOOR - 300 - STAIRS.steps * STAIRS.rise} stroke={C.line} strokeWidth={8} />
    <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
  </g>
);

// Backyard pool at midday. Water surface at POOL.water; `front` renders only the water face that
// covers swimmers' bodies (draw swimmers between <Pool/> and <Pool front/>).
export const POOL = { x: 760, w: 1300, water: FLOOR - 40 };

export const Pool: React.FC<{ frame: number; front?: boolean; splash?: number; splashX?: number }> = ({ frame, front = false, splash = 0, splashX = 1100 }) => {
  if (front) {
    return (
      <g>
        <rect x={POOL.x} y={POOL.water} width={POOL.w} height={1080 - POOL.water} fill="#3E8C9A" opacity={0.88} />
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M ${POOL.x + 40 + i * 140} ${POOL.water + 26 + (i % 3) * 30} q 30 ${-8 + Math.sin(frame * 0.1 + i) * 4} 60 0`}
            stroke="#8FD0D8"
            strokeWidth={4}
            fill="none"
            opacity={0.6}
          />
        ))}
        <rect x={POOL.x} y={POOL.water - 4} width={POOL.w} height={8} fill="#8FD0D8" opacity={0.7} />
        {splash > 0
          ? Array.from({ length: 22 }).map((_, i) => {
              const a = (random(`sp${i}`) - 0.5) * Math.PI * 0.9 - Math.PI / 2;
              const v = 220 + random(`sv${i}`) * 260;
              const tt = splash;
              const px = splashX + Math.cos(a) * v * tt;
              const py = POOL.water + Math.sin(a) * v * tt + 400 * tt * tt;
              return <circle key={i} cx={px} cy={py} r={8 + random(`sr${i}`) * 10} fill="#BDE6EA" opacity={Math.max(0, 1 - tt)} />;
            })
          : null}
      </g>
    );
  }
  return (
    <g>
      <rect width={1920} height={1080} fill="#2E4A5E" />
      <Glow x={1600} y={140} r={600} color={C.amber} opacity={0.5} />
      <circle cx={1600} cy={140} r={80} fill={C.amber} />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={i * 130} y={FLOOR - 330} width={120} height={290} fill="#5A4636" stroke="#47382B" strokeWidth={3} />
      ))}
      <rect y={FLOOR - 40} width={1920} height={1080} fill="#C9BFAE" />
      <rect x={POOL.x - 20} y={POOL.water - 6} width={POOL.w + 40} height={20} fill="#E6DED0" />
      <rect x={POOL.x} y={POOL.water + 14} width={POOL.w} height={1080} fill="#4FA3AF" />
      <g stroke="#BFC3CC" strokeWidth={8} fill="none">
        <path d={`M ${POOL.x + 70} ${POOL.water - 120} L ${POOL.x + 70} ${POOL.water + 90}`} />
        <path d={`M ${POOL.x + 120} ${POOL.water - 120} L ${POOL.x + 120} ${POOL.water + 90}`} />
        <path d={`M ${POOL.x + 70} ${POOL.water - 120} Q ${POOL.x + 70} ${POOL.water - 160} ${POOL.x + 40} ${POOL.water - 140}`} />
      </g>
    </g>
  );
};

export const PoolChair: React.FC<{ x: number; hoodie?: string }> = ({ x, hoodie }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-80} y={FLOOR - 130} width={160} height={16} rx={6} fill="#E6DED0" stroke={C.line} strokeWidth={2} />
    <path d={`M -80 ${FLOOR - 130} L -120 ${FLOOR - 260}`} stroke="#E6DED0" strokeWidth={16} strokeLinecap="round" />
    <path d={`M -70 ${FLOOR - 114} L -70 ${FLOOR - 40} M 70 ${FLOOR - 114} L 70 ${FLOOR - 40}`} stroke="#BFC3CC" strokeWidth={6} />
    {hoodie ? <path d={`M -116 ${FLOOR - 250} Q -60 ${FLOOR - 170} -20 ${FLOOR - 140} L 60 ${FLOOR - 140} Q 40 ${FLOOR - 100} -40 ${FLOOR - 110} Z`} fill={hoodie} /> : null}
  </g>
);

// Phone: a group photo with a tag notification and a "Remove tag" button.
export const TagScreen: React.FC<{ sw: number; sh: number; removed: number; press: number; members: Variant[] }> = ({ sw, removed, press, members }) => (
  <g>
    <rect width={sw} height={130} fill="#141922" />
    <text x={sw / 2} y={82} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={C.text}>
      Photo
    </text>
    <rect x={0} y={150} width={sw} height={sw} fill="#3B4B5E" />
    <circle cx={sw * 0.8} cy={220} r={50} fill={C.amber} opacity={0.8} />
    <rect x={0} y={150 + sw * 0.7} width={sw} height={sw * 0.3} fill="#2E6A75" />
    {members.map((v, i) => (
      <Head key={i} x={sw * (0.18 + i * 0.22)} y={150 + sw * 0.55} scale={0.5} variant={v} eyes="happy" mouth="grin" />
    ))}
    <g opacity={1 - removed}>
      <rect x={sw * 0.18 - 44} y={150 + sw * 0.55 + 52} width={88} height={34} rx={8} fill="#000" opacity={0.6} />
      <text x={sw * 0.18} y={150 + sw * 0.55 + 76} textAnchor="middle" fontFamily={HAND} fontSize={22} fill={C.text}>
        you
      </text>
    </g>
    <rect x={24} y={190 + sw} width={sw - 48} height={100} rx={22} fill="#1E2430" />
    <text x={48} y={232 + sw} fontFamily={HAND} fontSize={28} fill={C.text}>
      {removed > 0.5 ? 'Tag removed' : 'Sam tagged you in a photo'}
    </text>
    <g transform={`translate(${sw / 2} ${380 + sw}) scale(${1 - press * 0.08})`}>
      <rect x={-150} y={-38} width={300} height={76} rx={38} fill={removed > 0.5 ? '#2A2F39' : '#7A2E2A'} />
      <text x={0} y={12} textAnchor="middle" fontFamily={HAND} fontSize={32} fill={C.text}>
        {removed > 0.5 ? 'Removed' : 'Remove tag'}
      </text>
    </g>
  </g>
);

// Phone: an endless feed of "perfect" bodies; each card's Unfollow flips when tapped (frames in `unfollowAt`).
export const BodyFeedScreen: React.FC<{ sw: number; sh: number; frame: number; scroll: number; unfollowAt: number[] }> = ({ sw, frame, scroll, unfollowAt }) => {
  const cardH = sw * 1.02;
  return (
    <g transform={`translate(0 ${-scroll})`}>
      {Array.from({ length: 6 }).map((_, i) => {
        const top = 140 + i * cardH;
        const off = unfollowAt[i] !== undefined && frame >= unfollowAt[i];
        return (
          <g key={i} transform={`translate(0 ${top})`} opacity={off ? 0.35 : 1}>
            <circle cx={44} cy={36} r={20} fill="#3A3F4A" />
            <rect x={76} y={26} width={sw * 0.34} height={12} rx={6} fill="#3A3F4A" />
            <g transform={`translate(${sw - 160} 14)`}>
              <rect width={140} height={44} rx={22} fill={off ? '#2A2F39' : '#3D5A80'} />
              <text x={70} y={30} textAnchor="middle" fontFamily={HAND} fontSize={24} fill={C.text}>
                {off ? 'Follow' : 'Unfollow'}
              </text>
            </g>
            <rect x={0} y={72} width={sw} height={sw * 0.78} fill={['#3E3046', '#30404A', '#46392E'][i % 3]} />
            {/* idealised silhouette: a V-shaped torso, no face */}
            <path d={`M ${sw / 2 - 90} ${150} L ${sw / 2 + 90} ${150} L ${sw / 2 + 40} ${72 + sw * 0.78} L ${sw / 2 - 40} ${72 + sw * 0.78} Z`} fill="#8A7B8E" opacity={0.7} />
            <circle cx={sw / 2} cy={118} r={34} fill="#8A7B8E" opacity={0.7} />
            <text x={24} y={72 + sw * 0.78 + 46} fontFamily={HAND} fontSize={26} fill={C.textDim}>
              {['#summerbody', '#noexcuses', '#goals'][i % 3]}
            </text>
          </g>
        );
      })}
    </g>
  );
};
