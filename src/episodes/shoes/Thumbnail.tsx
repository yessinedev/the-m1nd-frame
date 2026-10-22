import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Split } from '../../kit/props8';
import { C } from '../../theme';
import { HersOld, HisNew } from './scenes/act1';

// Episode 12 thumbnail, 1280×720: the hook frame. His new sneaker gleaming, her taped flats.
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0B0B0E' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <g transform="scale(0.6667)">
        <Split left={<HisNew frame={10} lift={1} />} right={<HersOld frame={10} />} focus={[[960, 640], [975, 660]]} zoom={[0.85, 0.85]} />
      </g>
      <defs>
        <linearGradient id="topFade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0B0B0E" stopOpacity={0.92} />
          <stop offset="1" stopColor="#0B0B0E" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={1280} height={260} fill="url(#topFade)" />
      <g fontFamily={HAND} textAnchor="middle">
        <text x={640} y={92} fontSize={70} letterSpacing="0.03em" fill={C.text}>
          SHE WORE THE SAME SHOES
        </text>
        <text x={640} y={176} fontSize={78} letterSpacing="0.03em" fill={C.red} style={{ filter: 'drop-shadow(0 0 14px rgba(255,75,62,0.5))' }}>
          FOR 6 YEARS.
        </text>
      </g>
      <g fontFamily={HAND} fontSize={34} letterSpacing="0.08em">
        <text x={320} y={690} textAnchor="middle" fill={C.amber}>
          HIS
        </text>
        <text x={960} y={690} textAnchor="middle" fill={C.textDim}>
          HERS
        </text>
      </g>
    </svg>
  </AbsoluteFill>
);
