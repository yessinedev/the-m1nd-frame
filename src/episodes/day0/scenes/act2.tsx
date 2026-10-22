import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { Character, Limb, Pose, SIT, STAND, mixLimb, nearHand, reachArm, walk } from '../../../kit/Character';
import { Stage } from '../../../kit/fx';
import { Desk, DESK, DigitalClock, Glow, Laptop, Mirror, Papers, Phone, Room, Sink, Stool, WallClock } from '../../../kit/props';
import { BEATS, FPS } from '../script';
import { C, FLOOR } from '../../../theme';
import { BR, Bedroom } from '../../../kit/bedroom';
import { SceneProps, sitY, standY } from '../../../kit/common';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// 74–79 s. 5:00 alarm. A hand slaps snooze.
export const Snooze: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const slap = BEATS.snoozeSlap;
  const ringing = t < slap ? 1 : 0;
  const handY = keys(frame, [0, slap - 0.35, slap, slap + 0.5, slap + 1.1], [-420, -380, 300, 300, -420]);
  const squash = t > slap && t < slap + 0.12 ? 0.85 : 1;
  return (
    <Stage fade={sceneFade(frame, dur, 6, 12)} zoom={1.0} shake={ringing ? [wobble(frame, 3, 2.2) * 3, 0] : [0, 0]}>
      <rect width={1920} height={1080} fill={C.wall} />
      <rect y={720} width={1920} height={360} fill={C.furniture} />
      <line x1={0} x2={1920} y1={720} y2={720} stroke={C.line} strokeWidth={5} />
      <g transform={`translate(0 ${t > slap ? 6 : 0})`}>
        <DigitalClock x={700} y={480} text="5:00" ring={ringing} frame={frame} scale={2.6} />
      </g>
      <g transform={`translate(960 ${handY}) scale(1 ${squash})`}>
        <rect x={-60} y={-900} width={120} height={900} rx={60} fill={C.hoodie} />
        <ellipse cx={0} cy={0} rx={92} ry={56} fill={C.skin} />
      </g>
    </Stage>
  );
};

const LOOP_CLOCKS = ['23:51', '00:34', '01:47', '02:13', '03:05', '00:58', '02:41'];

// 79–92 s. Night after night, phone over his face. The counter keeps snapping back to 0.
export const LoopNights: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const flips = BEATS.loopFlips;
  const passed = flips.filter((x) => t >= x).length;
  const flash = flips.reduce((m, x) => Math.max(m, interpolate(t - x, [-0.05, 0, 0.25], [0, 0.55, 0], clamp)), 0);
  const px = BR.headX + 40;
  const py = BR.headY - 150;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.25, 1.45)} focus={[BR.headX + 120, BR.headY - 40]}>
      <Bedroom
        frame={frame}
        clock={LOOP_CLOCKS[passed % LOOP_CLOCKS.length]}
        phoneOnStand={false}
        lying={{ eyes: 'tired', mouth: 'flat', look: [8, -10], blinkAmt: blink(frame, 20), eyeGlow: C.screen }}
      >
        <Phone x={px} y={py} on={0.95} rotate={-8} scale={1.3} />
        <circle cx={px - 30} cy={py + 34} r={20} fill={C.skin} />
        <circle cx={px + 34} cy={py + 30} r={20} fill={C.skin} />
      </Bedroom>
      <rect width={1920} height={1080} fill="#C9D3E6" opacity={flash} />
    </Stage>
  );
};

// 92–100 s. Daytime at the desk. Clock spins, papers pile up, nothing gets done.
export const DeskStuck: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.12;
  const stoolTop = FLOOR - 165;
  const pose: Pose = { ...SIT, legFar: [52, 48], legNear: [46, 44], armNear: [32, 152], armFar: [40, 70], lean: 8, headY: 4 };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 8, 1.06, 1.12)} focus={[960, 560]}>
      <Room day />
      <WallClock x={1180} y={300} minutes={frame * 9} />
      <Desk x={840} />
      <Laptop x={1020} y={DESK.top - 2} on={0.5} />
      <Papers x={1250} y={DESK.top - 2} count={tween(frame, 0.3, 7.5, 3, 16)} />
      <Stool x={720} top={stoolTop} />
      <Character
        x={720}
        y={sitY(stoolTop, s)}
        scale={s}
        pose={pose}
        breathe={frame}
        eyes="tired"
        mouth="flat"
        look={[10, 4]}
        blinkAmt={blink(frame, 40)}
      />
    </Stage>
  );
};

const MIRROR = { x: 1010, y: 160, plane: 1030 };

// 100–112 s. He can't hold his own gaze. Turns away.
export const MirrorDim: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const turned = t > 6.6;
  const walking = t > 7.6;
  const x = walking ? 760 - (t - 7.6) * 210 : 760;
  const pose = walking ? walk(frame, 1) : STAND;
  const glance = t > 3.0 && t < 4.3;
  const face = {
    eyes: (glance ? 'open' : 'down') as 'open' | 'down',
    brow: 'sad' as const,
    mouth: 'flat' as const,
    blinkAmt: blink(frame, 15),
  };
  const facing: 1 | -1 = turned ? -1 : 1;
  const rx = 2 * MIRROR.plane - x;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.08, 1.14)} focus={[1000, 520]}>
      <Room wall="#12151A" />
      <Mirror x={MIRROR.x} y={MIRROR.y}>
        <rect width={1920} height={1080} fill="#151820" />
        <Character x={rx} y={standY(s)} scale={s} facing={(-facing) as 1 | -1} pose={pose} {...face} opacity={0.42} hoodie={C.hoodieShade} />
      </Mirror>
      <Sink x={MIRROR.x + 190} y={700} />
      <Character x={x} y={standY(s)} scale={s} facing={facing} pose={pose} breathe={frame} {...face} />
    </Stage>
  );
};

// 112–132 s. The turning point. The phone lights up; he reaches, freezes, then puts it away.
export const TurningPoint: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.15;
  const facing = -1 as const;
  const px = 580;
  const py = sitY(BR.mattress, s);
  const phoneHome: [number, number] = [BR.phoneX + 20, BR.phoneY - 4];
  const drawerSpot: [number, number] = [BR.nsX + 120, FLOOR - 98];

  const { turnBuzz: buzz, turnReachStop: stop, turnGrab: grab, turnDrawerOpen: dOpen, turnDrawerShut: dShut } = BEATS;
  const lean = keys(frame, [0, 1.6, stop, grab - 0.4, grab, dOpen + 0.3, dOpen + 1.2, dShut, dShut + 1.0], [4, 4, 22, 22, 30, 30, 52, 52, 4]);
  const body = { x: px, y: py, scale: s, facing, lean };

  const rest: Limb = SIT.armNear;
  const hover = reachArm(phoneHome[0] + 60, phoneHome[1] - 70, body);
  const onPhone = reachArm(phoneHome[0], phoneHome[1] - 8, body);
  const inDrawer = reachArm(drawerSpot[0], drawerSpot[1], body);
  const tremble = t > stop && t < grab ? wobble(frame, 7, 1.9) * 2.4 : 0;
  let arm: Limb;
  if (t < 1.6) arm = rest;
  else if (t < stop) arm = mixLimb(rest, hover, tween(frame, 1.6, stop, 0, 1));
  else if (t < grab - 0.4) arm = [hover[0] + tremble, hover[1] - tremble];
  else if (t < grab) arm = mixLimb(hover, onPhone, tween(frame, grab - 0.4, grab, 0, 1));
  else if (t < dOpen + 0.3) arm = onPhone;
  else if (t < dOpen + 1.2) arm = mixLimb(onPhone, inDrawer, tween(frame, dOpen + 0.3, dOpen + 1.2, 0, 1));
  else if (t < dShut) arm = inDrawer;
  else arm = mixLimb(inDrawer, rest, tween(frame, dShut, dShut + 1.0, 0, 1));

  const pose: Pose = { ...SIT, armNear: arm, lean, bob: t > dShut + 1.5 ? Math.sin((t - dShut) * 1.3) * 2 : 0 };
  const hand = nearHand(pose, px, py, s, facing);
  const held = t >= grab && t < dOpen + 1.2;
  const inside = t >= dOpen + 1.2;
  const phonePos: [number, number] = held ? [hand.x, hand.y + 6] : phoneHome;
  const screen = t < buzz ? 0 : held ? tween(frame, grab, grab + 0.4, 1, 0) : tween(frame, buzz, buzz + 0.2, 0, 1);
  const red = tween(frame, stop, grab - 1, 0, 1);
  const glowColor = red > 0.5 ? C.red : C.screen;
  const drawer = keys(frame, [dOpen, dOpen + 0.5, dShut - 0.6, dShut], [0, 1, 1, 0]);
  const calm = tween(frame, dShut, dShut + 2, 0, 1);

  const eyes = t < buzz ? 'down' : t > dShut + 1.2 ? 'closed' : 'open';
  return (
    <Stage
      fade={sceneFade(frame, dur, 12, 24)}
      zoom={keys(frame, [0, stop, grab, 20], [1.25, 1.42, 1.42, 1.28])}
      focus={[keys(frame, [0, stop, 20], [600, 520, 560]), 620]}
      shake={t > buzz && t < buzz + 0.3 ? [wobble(frame, 9, 2.6) * 3, 0] : [0, 0]}
    >
      <Bedroom frame={frame} clock="02:14" drawer={drawer} phoneOnStand={false}>
        {!inside ? (
          <>
            <Glow x={phonePos[0]} y={phonePos[1] - 30} r={420} color={glowColor} opacity={screen * (0.45 + red * 0.25)} />
            <Phone x={phonePos[0]} y={phonePos[1]} on={screen} color={glowColor} flat scale={0.85} />
          </>
        ) : null}
        <Character
          x={px}
          y={py}
          scale={s}
          facing={facing}
          pose={pose}
          breathe={frame}
          eyes={eyes}
          brow={t > buzz && t < dShut ? 'worried' : 'none'}
          mouth={calm > 0.8 ? 'none' : 'flat'}
          look={t > buzz && t < dShut ? [12, 10] : [0, 0]}
          blinkAmt={blink(frame, 60)}
          eyeGlow={t > buzz && t < grab ? glowColor : undefined}
        />
      </Bedroom>
      <rect width={1920} height={1080} fill="#0A1426" opacity={calm * 0.18} />
    </Stage>
  );
};
