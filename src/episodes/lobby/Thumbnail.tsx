import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HAND } from '../../fonts';
import { Head } from '../../kit/Character';
import { Glow } from '../../kit/props';
import { LobbyScreen } from '../../kit/props5';
import { C } from '../../theme';
import { SQUAD } from './script';

// Episode 5 thumbnail, 1280×720: the lobby with three empty slots, him in his headset, one line of text.
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0A0C12' }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <rect width={1280} height={720} fill="#0A0C12" />
      <Glow x={1020} y={360} r={520} color="#6C8CC4" opacity={0.45} />
      <g transform="translate(40 330) scale(0.43)">
        <rect x={-20} y={-20} width={1640} height={900} rx={24} fill="#0B0C0F" stroke={C.line} strokeWidth={8} />
        <LobbyScreen
          frame={0}
          slots={SQUAD.map((m, i) => (i === 0 ? { variant: m.variant, tag: m.tag } : { variant: m.variant, tag: m.tag, offline: true }))}
          status="WAITING FOR PLAYERS..."
        />
      </g>
      <Head x={1030} y={420} scale={2.3} eyes="down" brow="sad" mouth="flat" headset eyeGlow="#6C8CC4" />
      <g fontFamily={HAND}>
        <text x={50} y={110} fontSize={88} letterSpacing="0.03em" fill={C.text}>
          THE LOBBY
        </text>
        <text x={50} y={210} fontSize={88} letterSpacing="0.03em" fill={C.amber} style={{ filter: 'drop-shadow(0 0 14px rgba(255,181,71,0.45))' }}>
          IS EMPTY NOW.
        </text>
      </g>
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)' }} />
  </AbsoluteFill>
);
