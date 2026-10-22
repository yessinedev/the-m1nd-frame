import React from 'react';
import { Head, Pose, reachArm, SIT } from '../../../kit/Character';
import { sitY } from '../../../kit/common';
import { Glow, Phone, Room, Window } from '../../../kit/props';
import { Chair, CHAIR, DiningTable, Pendant, PhoneHands, Plate, TABLE } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { CallPhase, MomCall } from '../../../kit/props8';
import { C } from '../../../theme';

// The close-up phone used by the hook and its mirror at 2:54. Same size, same spot, so the two
// moments rhyme: once he hits Decline, once he hits Accept.
export const PH = 980;
const PW = PH * 0.49;
const SW = PW - 32;
const SH = PH - 32;
const screen = (u: number, v: number) => ({ x: -PW / 2 + 16 + SW * u, y: -PH / 2 + 16 + SH * v });
export const BTN = { decline: screen(0.27, 0.8), accept: screen(0.73, 0.8), play: screen(0.5, 0.82) };

// PhoneHands thumb offsets that land the thumb tip on a point of the screen (phone-centre space).
export const thumbOn = (p: { x: number; y: number }) => ({ thumbX: p.x - (PW / 2 - 110), thumbY: p.y });

export const CallCloseUp: React.FC<{
  frame: number;
  phase: CallPhase;
  press: number;
  side: 'decline' | 'accept';
  thumb: number; // 0 = resting below the screen, 1 = on the button
  seconds?: number;
  buzz?: number; // 0..1 vibration
  glow?: string;
  off?: number; // 0..1 screen going dark
}> = ({ frame, phase, press, side, thumb, seconds = 0, buzz = 0, glow = C.screen, off = 0 }) => {
  const target = thumbOn(BTN[side]);
  const rest = { thumbX: target.thumbX + 60, thumbY: PH / 2 + 160 };
  const tx = rest.thumbX + (target.thumbX - rest.thumbX) * thumb;
  const ty = rest.thumbY + (target.thumbY - rest.thumbY) * thumb + press * 8;
  const rot = buzz * Math.sin(frame * 2.1) * 1.6;
  const dx = buzz * Math.sin(frame * 2.7) * 5;
  return (
    <g transform={`translate(${dx} 0)`}>
      <PhoneShell x={960} y={545} h={PH} rotate={rot} glow={glow}>
        {(sw, sh) => (
          <>
            <MomCall sw={sw} sh={sh} frame={frame} phase={phase} press={press} pressSide={side} seconds={seconds} />
            {off > 0 ? <rect width={sw} height={sh} fill="#030304" opacity={off} /> : null}
          </>
        )}
      </PhoneShell>
      <PhoneHands x={960} y={545} h={PH} thumbX={tx} thumbY={ty} rotate={rot} />
    </g>
  );
};

// Arm angles for holding a phone to the ear (same idiom as episode 3).
export const ear = (x: number, y: number, s: number, facing: 1 | -1 = 1) => reachArm(x + facing * 62 * s, y - 238 * s, { x, y, scale: s, facing });
export const EarPhone = <Phone x={0} y={-20} on={0.4} rotate={-60} scale={0.9} />;

// Her dining room: warm wall, his childhood photo, pendant over a table for two.
// `children` (the people) draw between the chairs and the table, so the table hides their legs.
export const DINING = { tableX: 760, tableW: 420, momX: 712, himX: 1208, momPlate: 870, hisPlate: 1070 };

export const MomDining: React.FC<{ frame: number; lamp?: number; night?: boolean; children?: React.ReactNode; onTable?: React.ReactNode }> = ({
  lamp = 1,
  night = false,
  children,
  onTable,
}) => (
  <g>
    <Room wall="#1A1714" />
    <Window x={1420} y={210} w={260} h={300} sky={night ? 'night' : 'day'} />
    <g transform="translate(470 300)">
      <rect x={-80} y={-96} width={160} height={192} rx={6} fill="#2A2420" stroke={C.line} strokeWidth={4} />
      <rect x={-64} y={-80} width={128} height={140} fill="#3A3026" />
      <Head x={0} y={-6} scale={0.42} variant="kid" eyes="happy" mouth="grin" blush={0.6} />
    </g>
    <Pendant x={970} y={150} on={lamp} />
    <Glow x={970} y={TABLE.top - 120} r={460} color={C.amber} opacity={0.18 * lamp} />
    <Chair x={DINING.momX - 10} facing={1} />
    <Chair x={DINING.himX + 20} facing={-1} />
    {children}
    <DiningTable x={DINING.tableX} w={DINING.tableW} />
    {onTable}
  </g>
);

// Mom seated at her end of the table. Pass arm/face overrides per scene.
export const momSeat = (s: number) => ({ x: DINING.momX, y: sitY(CHAIR.seat, s) });
export const MOM_SIT: Pose = { ...SIT, armNear: [40, 60], armFar: [34, 64], lean: 6 };

export const Steam: React.FC<{ x: number; y: number; frame: number; amount: number }> = ({ x, y, frame, amount }) =>
  amount <= 0 ? null : (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${-20 + i * 20} -20 q ${6 + Math.sin(frame * 0.12 + i * 2) * 5} -16 0 -32 q -6 -16 0 -32`}
          stroke="#FFFFFF"
          strokeOpacity={0.2 * amount}
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          transform={`translate(0 ${-((frame * 1.1 + i * 18) % 24)})`}
        />
      ))}
    </g>
  );

export const TablePlates: React.FC<{ frame: number; mine?: boolean; his?: boolean; steam?: number }> = ({ frame, mine = true, his = true, steam = 1 }) => (
  <g>
    {mine ? <Plate x={DINING.momPlate} y={TABLE.top} /> : null}
    {his ? <Plate x={DINING.hisPlate} y={TABLE.top} /> : null}
    {his ? <Steam x={DINING.hisPlate} y={TABLE.top - 14} frame={frame} amount={steam} /> : null}
  </g>
);

