import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Character, Pose, STAND } from '../../kit/Character';
import { Glow, Phone } from '../../kit/props';
import { C } from '../../theme';

// YouTube thumbnail, 1280×720. Three elements only, so it reads at phone size:
// the struck-out streak, a huge red DAY 0, and his face lit by the phone.
const pose: Pose = { ...STAND, armNear: [38, 100], armFar: [16, 30], lean: -4 };

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0C0D11' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#0C0D11" />
      <Glow x={900} y={520} r={760} color={C.red} opacity={0.55} />
      <Character
        x={950}
        y={880}
        scale={2.25}
        facing={-1}
        pose={pose}
        eyes="wide"
        brow="worried"
        mouth="flat"
        look={[10, 8]}
        eyeGlow={C.red}
        nearItem={<Phone x={6} y={-30} on={1} color={C.red} scale={1.05} rotate={-12} />}
      />

      <g fontFamily={HAND} textAnchor="start">
        <text x={70} y={250} fontSize={118} letterSpacing="0.04em" fill={C.text}>
          DAY 6
        </text>
        <line x1={58} y1={214} x2={372} y2={198} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
        <text x={58} y={500} fontSize={270} letterSpacing="0.02em" fill={C.red} style={{ filter: 'drop-shadow(0 0 22px rgba(255,75,62,0.55))' }}>
          DAY 0
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)' }} />
  </AbsoluteFill>
);
