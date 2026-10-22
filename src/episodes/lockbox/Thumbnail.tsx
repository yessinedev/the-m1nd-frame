import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { CloseHand } from '../../kit/props2';
import { DrawerCloseUp } from '../../kit/props11';
import { C } from '../../theme';
import { TopPhone } from './scenes/act1';

// Episode 11 thumbnail, 1280×720: the hook frame. The phone, still lit, dropping into the drawer;
// the key waiting in the lock.
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#100E0C' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      {/* the desk continues left of the scaled close-up, under the title */}
      <rect x={0} y={0} width={1280} height={122} fill="#100E0C" />
      <rect x={0} y={122} width={1280} height={272} fill="#3A3128" />
      <rect x={0} y={394} width={1280} height={326} fill="#2A231C" />
      <g transform="translate(330 40) scale(0.68)">
        <DrawerCloseUp open={1} keyTurn={0.4}>
          <TopPhone x={960} y={676} on={0.95} rotate={-8} scale={0.78} />
        </DrawerCloseUp>
        <CloseHand x={1150} y={330} scale={1.3} sleeve={C.hoodie} sleeveShade={C.hoodieShade} />
      </g>
      <defs>
        <linearGradient id="fadeLeft" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#100E0C" stopOpacity={0.95} />
          <stop offset="0.55" stopColor="#100E0C" stopOpacity={0.75} />
          <stop offset="1" stopColor="#100E0C" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={760} height={720} fill="url(#fadeLeft)" />
      <g fontFamily={HAND}>
        <text x={40} y={150} fontSize={64} letterSpacing="0.03em" fill={C.text}>
          HE LOCKED HIS
        </text>
        <text x={40} y={230} fontSize={64} letterSpacing="0.03em" fill={C.text}>
          PHONE AWAY.
        </text>
        <text x={40} y={340} fontSize={96} letterSpacing="0.03em" fill={C.amber} style={{ filter: 'drop-shadow(0 0 14px rgba(255,181,71,0.45))' }}>
          90 DAYS.
        </text>
        <text x={44} y={420} fontSize={42} letterSpacing="0.06em" fill={C.textDim}>
          DAY 1 / 90
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>
);
