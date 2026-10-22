import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Character, SIT, STAND } from '../../kit/Character';
import { Glow, Phone } from '../../kit/props';
import { C } from '../../theme';
import { OLD } from './script';

// Episode 9 thumbnail, 1280×720: the hook frame. Him at 19 lit red by the feed; in the open doorway,
// him at 29, tired. It promises exactly what the first two seconds deliver.
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0B0B0E' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#0B0B0E" />
      <rect x={930} y={150} width={250} height={570} fill={C.amber} opacity={0.85} />
      <Glow x={1055} y={600} r={460} color={C.amber} opacity={0.5} sy={0.6} />
      <rect x={930} y={150} width={250} height={570} fill="none" stroke={C.line} strokeWidth={6} />
      <Character
        x={1055}
        y={720 + 40}
        scale={1.95}
        facing={-1}
        hoodie={OLD.hoodie}
        hoodieShade={OLD.hoodieShade}
        pose={{ ...STAND, headY: 8, lean: 5 }}
        stubble
        eyes="tired"
        brow="sad"
        mouth="flat"
        turn={0.25}
        look={[8, 2]}
      />
      <Glow x={640} y={490} r={360} color={C.red} opacity={0.45} />
      <Character
        x={560}
        y={880}
        scale={1.9}
        pose={{ ...SIT, lean: -4, armNear: [72, 96], armFar: [40, 70] }}
        nearItem={<Phone x={4} y={-22} on={1} color={C.red} rotate={-12} scale={1.05} />}
        eyes="wide"
        brow="raised"
        mouth="o"
        look={[14, -2]}
        eyeGlow={C.red}
        turn={0.3}
      />
      <g fontFamily={HAND}>
        <text x={44} y={110} fontSize={70} letterSpacing="0.03em" fill={C.text}>
          HE MET THE MAN
        </text>
        <text x={44} y={192} fontSize={70} letterSpacing="0.03em" fill={C.red} style={{ filter: 'drop-shadow(0 0 14px rgba(255,75,62,0.5))' }}>
          HE'D BECOME.
        </text>
        <text x={48} y={256} fontSize={40} letterSpacing="0.06em" fill={C.textDim}>
          3:07 AM · AGE 29 · YEARS LOST: 10
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>
);
