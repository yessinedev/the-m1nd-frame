import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Character, Pose, STAND } from '../../kit/Character';
import { Glow } from '../../kit/props';
import { HoodieBundle } from '../../kit/props4';
import { C } from '../../theme';

// Episode 4 thumbnail, 1280×720: him holding her lilac hoodie to his face, a tear, one line of text.
const him: Pose = { ...STAND, armNear: [72, 112], armFar: [40, 90], headY: 6, tilt: 6 };

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0E0D12' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#0E0D12" />
      <Glow x={930} y={460} r={520} color={C.lilac} opacity={0.45} />
      <Character
        x={900}
        y={940}
        scale={2.15}
        pose={him}
        eyes="closed"
        brow="sad"
        mouth="frown"
        tear={0.55}
        nearItem={
          <g transform="translate(20 -10)">
            <HoodieBundle scale={0.9} />
          </g>
        }
      />
      <g fontFamily={HAND}>
        <text x={56} y={130} fontSize={92} letterSpacing="0.03em" fill={C.text}>
          SHE TOOK
        </text>
        <text x={56} y={230} fontSize={92} letterSpacing="0.03em" fill={C.text}>
          EVERYTHING.
        </text>
        <text x={56} y={350} fontSize={92} letterSpacing="0.03em" fill="#C9BBE6" style={{ filter: 'drop-shadow(0 0 14px rgba(160,140,210,0.5))' }}>
          EXCEPT THIS.
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)' }} />
  </AbsoluteFill>
);
