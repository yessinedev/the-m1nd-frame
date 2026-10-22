import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Character, STAND } from '../../kit/Character';
import { Glow } from '../../kit/props';
import { C } from '../../theme';
import { BUILD } from './script';

// Episode 6 thumbnail, 1280×720: a blazing sun, him in the hoodie sweating, the title and the temperature.
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#1E1712' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#1E1712" />
      <Glow x={1020} y={170} r={600} color={C.amber} opacity={0.6} />
      <circle cx={1020} cy={170} r={120} fill={C.amber} />
      <Character
        x={940}
        y={790}
        scale={1.6}
        build={BUILD}
        pose={{ ...STAND, armNear: [36, 120], armFar: [34, 122], headY: 6 }}
        eyes="down"
        brow="sad"
        mouth="flat"
        sweat
        look={[-4, 6]}
      />
      <g fontFamily={HAND}>
        <text x={50} y={120} fontSize={88} letterSpacing="0.03em" fill={C.text}>
          HE WORE A HOODIE
        </text>
        <text x={50} y={220} fontSize={88} letterSpacing="0.03em" fill={C.amber} style={{ filter: 'drop-shadow(0 0 14px rgba(255,181,71,0.45))' }}>
          IN JULY.
        </text>
        <text x={56} y={330} fontSize={60} letterSpacing="0.06em" fill="#E9B18A">
          34°C
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>
);
