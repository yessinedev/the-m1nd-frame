import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Character, Pose, STAND } from '../../kit/Character';
import { Glow, Phone } from '../../kit/props';
import { Polaroid } from '../../kit/props3';
import { C } from '../../theme';

// Episode 3 thumbnail, 1280×720: the old Polaroid, him now, one line of text.
const him: Pose = { ...STAND, armNear: [64, 96], armFar: [10, 20], tilt: -4 };

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#100E0C' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#100E0C" />
      <Glow x={330} y={470} r={420} color={C.amber} opacity={0.45} />
      <Polaroid x={330} y={470} scale={1.05} rotate={-7} />
      <Character
        x={980}
        y={980}
        scale={2.1}
        pose={him}
        eyes="open"
        brow="sad"
        mouth="flat"
        turn={-0.35}
        look={[-10, 4]}
        blinkAmt={1}
        nearItem={<Phone x={4} y={-24} on={1} color={C.amber} rotate={-12} scale={1.05} />}
      />
      <g fontFamily={HAND}>
        <text x={56} y={110} fontSize={84} letterSpacing="0.03em" fill={C.text}>
          NOBODY TOLD US
        </text>
        <text x={56} y={200} fontSize={84} letterSpacing="0.03em" fill={C.amber} style={{ filter: 'drop-shadow(0 0 14px rgba(255,181,71,0.45))' }}>
          IT WAS THE LAST TIME.
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)' }} />
  </AbsoluteFill>
);
