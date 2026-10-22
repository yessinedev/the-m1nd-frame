import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Glow } from '../../kit/props';
import { PhoneHands } from '../../kit/props2';
import { PhoneShell } from '../../kit/props3';
import { MomCall } from '../../kit/props8';
import { C } from '../../theme';

// Episode 8 thumbnail, 1280×720: the hook frame itself. "Mom" calling, his thumb on Decline.
// It promises exactly what the first second of the video delivers.
const H = 640;
const W = H * 0.49;
const decline = { x: -W / 2 + 16 + (W - 32) * 0.27, y: -H / 2 + 16 + (H - 32) * 0.8 };

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0B0B0E' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#0B0B0E" />
      <Glow x={940} y={380} r={520} color={C.red} opacity={0.3} />
      <PhoneShell x={940} y={372} h={H} rotate={4} glow="#4FBF73">
        {(sw, sh) => <MomCall sw={sw} sh={sh} frame={8} phase="incoming" press={0.8} pressSide="decline" />}
      </PhoneShell>
      <PhoneHands x={940} y={372} h={H} rotate={4} thumbX={decline.x - (W / 2 - 110)} thumbY={decline.y + 6} />
      <g fontFamily={HAND}>
        <text x={50} y={300} fontSize={88} letterSpacing="0.03em" fill={C.text}>
          HIS MOM
        </text>
        <text x={50} y={395} fontSize={88} letterSpacing="0.03em" fill={C.text}>
          CALLED.
        </text>
        <text x={50} y={500} fontSize={64} letterSpacing="0.03em" fill={C.red} style={{ filter: 'drop-shadow(0 0 14px rgba(255,75,62,0.5))' }}>
          HE PRESSED
        </text>
        <text x={50} y={575} fontSize={64} letterSpacing="0.03em" fill={C.red} style={{ filter: 'drop-shadow(0 0 14px rgba(255,75,62,0.5))' }}>
          DECLINE.
        </text>
        <text x={54} y={660} fontSize={42} letterSpacing="0.06em" fill={C.textDim}>
          DECLINED: 47
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 60% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>
);
