import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Character, SIT } from '../../kit/Character';
import { Glow, Phone } from '../../kit/props';
import { PhoneShell } from '../../kit/props3';
import { LockScreen } from '../../kit/props10';
import { C } from '../../theme';
import { HIS_DATE } from './script';

// Episode 10 thumbnail, 1280×720: the hook. His lock screen at 00:00 on his birthday, and nothing else;
// him beside it, lit by the phone, waiting.
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0B0B0E' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#0B0B0E" />
      <Glow x={1010} y={380} r={460} color={C.screen} opacity={0.25} />
      {/* Drawn at the film's phone size, then scaled, so the lock screen text lays out exactly as on screen. */}
      <g transform="translate(1010 380) scale(0.68) translate(-1010 -380)">
        <PhoneShell x={1010} y={380} h={980} rotate={4}>
          {(sw, sh) => <LockScreen sw={sw} sh={sh} frame={30} clock="00:00" date={HIS_DATE} notices={[{ title: 'Calendar', text: 'Today: your birthday', icon: 'cake', appear: 0 }]} />}
        </PhoneShell>
      </g>
      <Glow x={620} y={470} r={320} color={C.screen} opacity={0.3} />
      <Character
        x={600}
        y={880}
        scale={1.75}
        pose={{ ...SIT, lean: 8, headY: 8, armNear: [70, 100], armFar: [40, 70] }}
        nearItem={<Phone x={4} y={-22} on={0.9} rotate={-12} scale={1.05} />}
        eyes="down"
        brow="sad"
        mouth="flat"
        look={[10, 8]}
        eyeGlow={C.screen}
        turn={0.3}
      />
      <g fontFamily={HAND}>
        <text x={44} y={110} fontSize={70} letterSpacing="0.03em" fill={C.text}>
          NOBODY REMEMBERED
        </text>
        <text x={44} y={192} fontSize={70} letterSpacing="0.03em" fill={C.text}>
          HIS BIRTHDAY.
        </text>
        <text x={48} y={262} fontSize={50} letterSpacing="0.06em" fill={C.red} style={{ filter: 'drop-shadow(0 0 14px rgba(255,75,62,0.5))' }}>
          MESSAGES: 0
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
  </AbsoluteFill>
);
