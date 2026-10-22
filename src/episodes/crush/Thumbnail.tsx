import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Character, Head, STAND } from '../../kit/Character';
import { Glow, Phone } from '../../kit/props';
import { C } from '../../theme';
import { HER } from './script';

// Episode 7 thumbnail, 1280×720: him staring at his phone, her face in the thought cloud over his head.
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0D0E13' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#0D0E13" />
      <Glow x={960} y={520} r={420} color={C.screen} opacity={0.35} />
      <Character
        x={960}
        y={1000}
        scale={1.9}
        pose={{ ...STAND, armNear: [64, 96], armFar: [50, 90], headY: 6 }}
        eyes="open"
        brow="worried"
        mouth="flat"
        look={[8, 10]}
        eyeGlow={C.screen}
        nearItem={<Phone x={4} y={-24} on={1} rotate={-12} scale={1.05} />}
      />
      <g>
        <circle cx={930} cy={400} r={16} fill="#E9E4D8" />
        <circle cx={900} cy={340} r={24} fill="#E9E4D8" />
        <ellipse cx={820} cy={180} rx={160} ry={120} fill="#E9E4D8" />
        <Head x={820} y={186} scale={0.9} variant={HER.variant} eyes="happy" mouth="smile" blush={0.5} />
      </g>
      <g fontFamily={HAND}>
        <text x={40} y={480} fontSize={74} letterSpacing="0.03em" fill={C.text}>
          SHE LIVED IN HIS
        </text>
        <text x={40} y={570} fontSize={74} letterSpacing="0.03em" fill={C.amber} style={{ filter: 'drop-shadow(0 0 14px rgba(255,181,71,0.45))' }}>
          HEAD RENT-FREE.
        </text>
        <text x={44} y={650} fontSize={44} letterSpacing="0.06em" fill={C.voice}>
          STATUS CHECKS: 212
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>
);
