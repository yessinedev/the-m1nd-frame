import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { Character, SLUMP, STAND, mix, walk } from '../../../kit/Character';
import { Stage } from '../../../kit/fx';
import { Calendar, DigitalClock, Glow, Phone, Room, Starfield, Window } from '../../../kit/props';
import { HAND } from '../../../fonts';
import { BEATS, FPS } from '../script';
import { C } from '../../../theme';
import { BR, Bedroom } from '../../../kit/bedroom';
import { SceneProps, sitY, standY } from '../../../kit/common';

// 0–7 s. Black, faint stars. "He made the same promise again."
export const ColdOpen: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 20, 14)} zoom={tween(frame, 0, 7, 1.04, 1)}>
      <Starfield frame={frame} opacity={0.7} />
    </Stage>
  );
};

// 7–19 s. Day 1 in bed, calm. Camera drifts to the phone on the nightstand.
export const BedDay1: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const asleep = t > 4.6;
  return (
    <Stage
      fade={sceneFade(frame, dur)}
      zoom={keys(frame, [0, 5.2, 7.6, 12], [1, 1.04, 1.32, 1.36])}
      focus={[keys(frame, [0, 5.2, 7.6], [800, 800, 470]), keys(frame, [0, 5.2, 7.6], [600, 600, 650])]}
    >
      <Bedroom
        frame={frame}
        clock="23:47"
        lying={{
          eyes: asleep ? 'closed' : 'open',
          mouth: asleep ? 'smile' : 'flat',
          look: [3, -7],
          blinkAmt: blink(frame, 30),
        }}
      />
    </Stage>
  );
};

// 19–31 s. Marking the calendar, day after day. He feels lighter.
export const CalendarScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const marks = [-100, ...BEATS.calendarMarks.map((m) => m * FPS)];
  // Raise the marker for each X.
  let raise = 0;
  for (const m of BEATS.calendarMarks) {
    raise = Math.max(raise, keys(frame, [m - 0.45, m - 0.1, m + 0.25, m + 0.7], [0, 1, 1, 0]));
  }
  const turned = t > 7.4;
  const walking = t > 8.6;
  const s = 1.1;
  const x = walking ? 1120 + (t - 8.6) * 190 : 1120;
  const base = turned ? STAND : { ...STAND, armNear: [30 + raise * 92, 12 + raise * 10] as [number, number] };
  const pose = walking ? walk(frame, 1.1) : { ...base, bob: turned ? -Math.max(0, Math.sin((t - 7.4) * 9)) * 10 * (t < 8.4 ? 1 : 0) : 0 };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.05, 1.0)}>
      <Room day />
      <Window x={1420} y={200} sky="day" />
      <Calendar x={600} y={300} marks={marks} frame={frame} />
      <Character
        x={x}
        y={standY(s)}
        scale={s}
        facing={turned ? 1 : -1}
        pose={pose}
        breathe={frame}
        eyes={turned ? 'happy' : 'open'}
        mouth={turned ? 'smile' : 'flat'}
        look={turned ? [0, 0] : [6, -6]}
        blinkAmt={blink(frame, 50)}
        nearItem={turned ? null : <rect x={-5} y={4} width={10} height={36} rx={4} fill={C.red} />}
      />
    </Stage>
  );
};

// 31–45 s. A quiet night; the phone lights up. "Just once. Nobody would know."
export const Temptation: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const buzz = BEATS.temptationBuzz;
  const on = tween(frame, buzz, buzz + 0.2, 0, 1) * (0.85 + 0.15 * Math.sin(frame * 0.12));
  const awake = t > buzz + 0.4;
  return (
    <Stage
      fade={sceneFade(frame, dur, 12, 4)}
      zoom={keys(frame, [0, buzz, 13.5], [1, 1.02, 1.42])}
      focus={[keys(frame, [0, buzz, 13.5], [800, 760, 500]), keys(frame, [0, 13.5], [600, 660])]}
      shake={t > buzz && t < buzz + 0.35 ? [wobble(frame, 1, 2.6) * 3, 0] : [0, 0]}
    >
      <Bedroom
        frame={frame}
        clock="01:12"
        phoneOn={on}
        lying={{
          eyes: awake ? 'open' : 'closed',
          mouth: 'flat',
          brow: t > 6 ? 'worried' : 'none',
          look: awake ? [-14, 3] : [0, 0],
          blinkAmt: blink(frame, 70),
          eyeGlow: awake ? C.screen : undefined,
        }}
      />
      <Glow x={BR.phoneX} y={BR.phoneY - 40} r={380} color={C.screen} opacity={on * 0.35} />
    </Stage>
  );
};

// 45–53 s. Close-up: the hand crawls toward the glowing phone. Heartbeat. Cut to black on the grab.
export const Reach: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const grab = BEATS.reachGrab;
  const beats = [1.4, 2.5, 3.5, 4.4, 5.2, 5.9, 6.5];
  const pulse = beats.reduce((m, b) => Math.max(m, interpolate(t - b, [0, 0.06, 0.35], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })), 0);
  const red = tween(frame, 1, grab, 0, 1);
  const glowColor = red > 0.5 ? C.red : C.screen;
  const reach = tween(frame, 0.4, grab, 0, 1);
  const handX = 2200 - reach * 1020 + wobble(frame, 2, 1.7) * 4 * red;
  const handY = 520 + reach * 110 + wobble(frame, 5, 1.3) * 3 * red;
  const cut = t > grab + 0.25;
  return (
    <Stage fade={cut ? 0 : sceneFade(frame, dur, 8, 0)} zoom={1 + pulse * 0.025 + reach * 0.06} focus={[1100, 640]}>
      <rect width={1920} height={1080} fill={C.wall} />
      <rect y={760} width={1920} height={320} fill={C.furniture} />
      <line x1={0} x2={1920} y1={760} y2={760} stroke={C.line} strokeWidth={5} />
      <DigitalClock x={220} y={580} text="01:12" scale={1.5} />
      <Glow x={1100} y={690} r={700} color={glowColor} opacity={0.35 + red * 0.25} sy={0.7} />
      <Phone x={1100} y={758} on={1} color={glowColor} flat scale={3.4} />
      {/* forearm in sleeve + hand, from the right edge */}
      <g transform={`translate(${handX} ${handY}) rotate(${-12 + reach * 6})`}>
        <rect x={40} y={-46} width={1100} height={92} rx={46} fill={C.hoodie} />
        <rect x={40} y={-46} width={60} height={92} rx={20} fill={C.hoodieShade} />
        <ellipse cx={10} cy={0} rx={62} ry={50} fill={C.skin} />
        <ellipse cx={-38} cy={20} rx={26} ry={16} fill={C.skin} />
      </g>
    </Stage>
  );
};

// 53–62 s. The counter rolls back: DAY 6 → DAY 0.
export const Reset: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const roll = BEATS.resetRoll;
  const land = BEATS.resetLand;
  const steps = 6;
  const value = t < roll ? 6 : Math.max(0, 6 - Math.floor(((t - roll) / (land - roll)) * steps));
  const landed = t >= land;
  const since = (t - land) * FPS;
  const shake = landed && since < 14 ? Math.sin(since * 2.2) * (14 - since) * 1.4 : 0;
  const appear = tween(frame, 0.2, 0.7, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur, 1, 16)} zoom={landed ? tween(frame, land, 9, 1.08, 1) : 1} shake={[shake, 0]}>
      <Starfield frame={frame} opacity={0.25} />
      {landed ? <Glow x={960} y={500} r={520} color={C.red} opacity={tween(frame, land, land + 0.3, 0.8, 0.35)} /> : null}
      <text
        x={960}
        y={560}
        textAnchor="middle"
        fontFamily={HAND}
        fontSize={230}
        letterSpacing="0.06em"
        fill={landed ? C.red : C.text}
        opacity={appear}
      >
        DAY {value}
      </text>
    </Stage>
  );
};

// 62–74 s. Sitting on the edge of the bed, phone dark in hand.
export const Aftermath: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.18;
  const pose = mix(SLUMP, { ...SLUMP, lean: 28, headY: 20 }, (Math.sin(frame * 0.05) + 1) / 2 * 0.3);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.12, 1.2)} focus={[820, 600]}>
      <Bedroom frame={frame} clock="01:58" phoneOnStand={false}>
        <Character
          x={760}
          y={sitY(BR.mattress, s)}
          scale={s}
          pose={pose}
          breathe={frame}
          eyes="down"
          brow="sad"
          mouth="flat"
          blinkAmt={blink(frame, 10)}
          nearItem={<Phone x={0} y={-6} on={0.08} rotate={-60} scale={1} />}
        />
      </Bedroom>
    </Stage>
  );
};
