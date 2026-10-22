import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Character, Pose, SIT, STAND } from '../../kit/Character';
import { Glow, Phone } from '../../kit/props';
import { C } from '../../theme';

// Episode 2 thumbnail, 1280×720: him lit red by the phone, her small in warm light behind him, one line of text.
const him: Pose = { ...SIT, armNear: [62, 92], armFar: [50, 90], lean: 14, headY: 6 };
const her: Pose = { ...STAND, armNear: [8, 20], armFar: [6, 20] };

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0C0D11' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#0C0D11" />
      <Glow x={240} y={600} r={340} color={C.amber} opacity={0.5} />
      <Character x={240} y={730} scale={1.12} variant="her" pose={her} eyes="open" brow="sad" mouth="frown" turn={0.45} look={[10, 0]} />
      <Glow x={920} y={440} r={560} color={C.red} opacity={0.6} />
      <Character
        x={850}
        y={900}
        scale={2.2}
        pose={him}
        eyes="tired"
        mouth="flat"
        look={[10, 10]}
        eyeGlow={C.red}
        nearItem={<Phone x={4} y={-24} on={1} color={C.red} rotate={-12} scale={1.05} />}
      />
      <g fontFamily={HAND}>
        <text x={56} y={130} fontSize={104} letterSpacing="0.03em" fill={C.text}>
          SHE WAS
        </text>
        <text x={56} y={240} fontSize={104} letterSpacing="0.03em" fill={C.amber} style={{ filter: 'drop-shadow(0 0 16px rgba(255,181,71,0.45))' }}>
          RIGHT THERE.
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)' }} />
  </AbsoluteFill>
);
