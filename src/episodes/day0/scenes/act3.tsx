import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { Character, Head, Limb, Pose, SIT, STAND, mix, mixLimb, nearHand, reachArm, run, walk } from '../../../kit/Character';
import { SpeedLines, Stage } from '../../../kit/fx';
import { Bench, BENCH_SEAT, Desk, DESK, Glow, Lamp, Mirror, Notebook, Phone, PunchingBag, Room, Sink, Stool, Street, StreetLamp, Tree, WallClock } from '../../../kit/props';
import { HAND } from '../../../fonts';
import { BEATS, FPS } from '../script';
import { C, FLOOR } from '../../../theme';
import { BR, Bedroom } from '../../../kit/bedroom';
import { SceneProps, sitY, standY } from '../../../kit/common';

// 132–142 s. Dawn. He stands up and walks out the door into the light.
export const Morning: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const up = tween(frame, 1.0, 2.2, 0, 1);
  const walking = t > 2.6;
  const x = walking ? 760 + (t - 2.6) * 175 : 760;
  const y = sitY(BR.mattress, s) + (standY(s) - sitY(BR.mattress, s)) * up;
  const pose = walking ? walk(frame, 1) : mix(SIT, STAND, up);
  return (
    <Stage fade={sceneFade(frame, dur, 16, 14)} zoom={tween(frame, 0, 10, 1.1, 1.02)} focus={[1100, 560]}>
      <Bedroom frame={frame} sky="dawn" sunY={tween(frame, 0, 10, 0.95, 0.6)} clock="6:02" clockColor={C.textDim} door={tween(frame, 5.2, 6.4, 0, 1)}>
        <Character
          x={x}
          y={y}
          scale={s}
          pose={pose}
          breathe={frame}
          eyes="open"
          mouth={t > 2 ? 'smile' : 'flat'}
          blinkAmt={blink(frame, 5)}
          opacity={tween(frame, 8.3, 9.2, 1, 0)}
        />
      </Bedroom>
    </Stage>
  );
};

// 142–148 s. Morning run at sunrise.
export const Run: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.0;
  return (
    <Stage fade={sceneFade(frame, dur, 10, 10)} shake={[0, Math.sin(frame * 0.64) * 2]}>
      <Street offset={frame * 24} mode="dawn" sunY={tween(frame, 0, 6, 470, 420)} />
      <SpeedLines x={740} y={standY(s) - 120} frame={frame} color={C.line} opacity={0.8} />
      <Character x={860} y={standY(s) + 8} scale={s} pose={run(frame, 1)} eyes="open" brow="focused" mouth="flat" blinkAmt={blink(frame, 12)} />
    </Stage>
  );
};

// 148–154 s. Heavy bag. The restlessness goes somewhere.
export const Bag: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const hits = BEATS.bagHits;
  const strike = hits.reduce((m, h) => Math.max(m, keys(frame, [h - 0.18, h, h + 0.08, h + 0.32], [0, 1, 1, 0])), 0);
  const swing = hits.reduce((a, h) => (t > h ? a + 9 * Math.exp(-(t - h) * 2.2) * Math.sin((t - h) * 7) : a), 0);
  const hitShake = hits.reduce((m, h) => Math.max(m, t > h && t < h + 0.12 ? 1 : 0), 0);
  const guard: Limb = [40, 118];
  const jab: Limb = [92, 2];
  const pose: Pose = {
    ...STAND,
    legFar: [-14, 8],
    legNear: [16, 10],
    armFar: [50, 115],
    armNear: mixLimb(guard, jab, strike),
    lean: 6 + strike * 6,
    bob: Math.sin(frame * 0.25) * 3,
  };
  return (
    <Stage fade={sceneFade(frame, dur, 10, 10)} zoom={1.05} focus={[1000, 560]} shake={[hitShake * wobble(frame, 4, 3) * 5, 0]}>
      <Room wall="#101216" />
      <Glow x={1130} y={260} r={520} color={C.amber} opacity={0.12} />
      <PunchingBag x={1150} y={110} angle={-swing} />
      <SpeedLines x={1000} y={standY(s) - 110} dir={-1} frame={frame} color={C.textDim} opacity={strike} />
      <Character x={880} y={standY(s)} scale={s} pose={pose} breathe={frame} eyes="open" brow="focused" mouth="flat" blinkAmt={blink(frame, 33)} />
    </Stage>
  );
};

// 154–161 s. Night desk, lamp on. He finishes what he started.
export const DeskFocus: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const stoolTop = FLOOR - 165;
  const px = 720;
  const py = sitY(stoolTop, s);
  const lean = 14;
  const write: [number, number] = [985 + Math.sin(frame * 0.5) * 10 + (t % 2) * 18, DESK.top - 10 + Math.abs(Math.sin(frame * 0.9)) * -4];
  const arm = reachArm(write[0], write[1], { x: px, y: py, scale: s, lean });
  const pose: Pose = { ...SIT, legFar: [52, 48], legNear: [46, 44], armFar: [46, 60], armNear: arm, lean };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 7, 1.08, 1.14)} focus={[960, 560]}>
      <Room wall="#0F1115" />
      <WallClock x={1180} y={300} minutes={600 + frame * 0.4} />
      <Desk x={840} />
      <Lamp x={1260} y={DESK.top - 2} />
      <Notebook x={930} y={DESK.top - 2} lines={tween(frame, 0, 6.5, 2, 14)} />
      <Stool x={px} top={stoolTop} />
      <Character x={px} y={py} scale={s} pose={pose} breathe={frame} eyes="down" brow="focused" mouth="flat" look={[10, 4]} blinkAmt={blink(frame, 22)} />
    </Stage>
  );
};

// 161–170 s. Walking home at night. The phone buzzes; he looks, then pockets it and keeps walking.
export const Urge: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.05;
  const buzz = BEATS.urgeBuzz;
  const pocket = BEATS.urgePocket;
  const stopAt = 1.6;
  const resume = pocket + 0.5;
  // distance walked: freeze while he stops
  const walked = Math.min(t, stopAt) + Math.max(0, t - resume);
  const offset = walked * 150;
  const moving = t < stopAt || t > resume;
  const lift = keys(frame, [buzz + 0.2, buzz + 0.8, pocket - 0.3, pocket + 0.2], [0, 1, 1, 0]);
  const base: Pose = moving ? walk(frame, 1) : STAND;
  const look: Limb = [62, 78];
  const pose: Pose = { ...base, armNear: mixLimb(base.armNear, look, lift) };
  const x = 900;
  const y = standY(s);
  const hand = nearHand(pose, x, y, s);
  const screen = t < buzz ? 0 : tween(frame, buzz, buzz + 0.15, 0, 1) * tween(frame, pocket - 0.4, pocket - 0.1, 1, 0);
  const showPhone = t < pocket + 0.1;
  const lamps = [0, 1, 2].map((i) => ((((i * 760 - offset) % 2280) + 2280) % 2280) - 180);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, stopAt, resume, 9], [1.04, 1.16, 1.16, 1.06])} focus={[920, 520]}>
      <Street offset={offset} mode="night" />
      {lamps.map((lx, i) => (
        <StreetLamp key={i} x={lx} />
      ))}
      <Character
        x={x}
        y={y}
        scale={s}
        pose={pose}
        breathe={frame}
        eyes={lift > 0.5 && t < pocket ? 'down' : 'open'}
        brow={t > buzz + 1.2 && t < pocket + 1 ? 'focused' : 'none'}
        mouth="flat"
        look={lift > 0.5 ? [10, 6] : [4, 0]}
        blinkAmt={blink(frame, 8)}
        eyeGlow={screen > 0.3 ? C.red : undefined}
      />
      {showPhone ? <Phone x={hand.x + 4} y={hand.y - 8} on={screen} color={C.red} scale={0.75 + lift * 0.1} /> : null}
    </Stage>
  );
};

// 170–176 s. On a bench with a friend. Eye contact. A laugh.
export const BenchScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const seat: Pose = { ...SIT, legFar: [82, 80], legNear: [78, 76], armFar: [-8, 40], armNear: [6, 38], lean: 2 };
  const talking = t > 0.4 && t < 2.6;
  const laugh = t > 2.8 && t < 4.3;
  const laughBob = laugh ? -Math.abs(Math.sin((t - 2.8) * 9)) * 6 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 6, 1.1, 1.15)} focus={[960, 560]}>
      <rect width={1920} height={1080} fill="#1A1F29" />
      <Tree x={290} s={1.05} />
      <Tree x={1680} s={0.9} />
      <rect y={FLOOR} width={1920} height={240} fill={C.floor} />
      <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
      <Bench x={700} />
      <Character
        x={1100}
        y={sitY(BENCH_SEAT, s)}
        scale={s}
        facing={-1}
        pose={{ ...seat, bob: laugh ? laughBob * 0.6 : 0 }}
        breathe={frame + 40}
        hoodie={C.friendHoodie}
        hoodieShade={C.friendHoodieShade}
        eyes={laugh ? 'happy' : 'open'}
        mouth={talking ? (Math.floor(frame / 5) % 2 ? 'open' : 'flat') : laugh ? 'grin' : 'smile'}
        look={[8, 0]}
        blinkAmt={blink(frame, 77)}
      />
      <Character
        x={830}
        y={sitY(BENCH_SEAT, s)}
        scale={s}
        pose={{ ...seat, bob: laughBob }}
        breathe={frame}
        eyes={laugh ? 'happy' : 'open'}
        mouth={laugh ? 'grin' : 'smile'}
        look={[8, 0]}
        blinkAmt={blink(frame, 3)}
      />
    </Stage>
  );
};

const MIRROR = { x: 1010, y: 160, plane: 1030 };

// 176–182 s. The mirror again. This time he holds his own gaze.
export const MirrorClear: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const x = 760;
  const nod = keys(frame, [2.4, 2.6, 2.9], [0, 8, 0]);
  const face = {
    eyes: 'open' as const,
    mouth: (t > 1.4 ? 'smile' : 'flat') as 'smile' | 'flat',
    blinkAmt: blink(frame, 45),
  };
  const pose = { ...STAND, headY: nod };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 6, 1.1, 1.18)} focus={[1000, 500]}>
      <Room wall="#14161B" />
      <Glow x={300} y={300} r={900} color={C.amber} opacity={0.18} />
      <Mirror x={MIRROR.x} y={MIRROR.y}>
        <rect width={1920} height={1080} fill="#1A1D24" />
        <Character x={2 * MIRROR.plane - x} y={standY(s)} scale={s} facing={-1} pose={pose} {...face} opacity={0.78} />
      </Mirror>
      <Sink x={MIRROR.x + 190} y={700} />
      <Character x={x} y={standY(s)} scale={s} pose={pose} breathe={frame} {...face} />
    </Stage>
  );
};

// 182–191 s. Back to the bedroom, same clock, new light. Awake before the alarm.
export const Payoff: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.15;
  const five = BEATS.payoffFive;
  const px = 600;
  const py = sitY(BR.mattress, s);
  const lean = keys(frame, [five - 0.1, five + 0.3, five + 0.9, five + 1.5], [4, 26, 26, 4]);
  const body = { x: px, y: py, scale: s, facing: -1 as const, lean };
  const tap = reachArm(BR.clockX + 52, BR.clockY - 10, body);
  const reach = keys(frame, [five - 0.1, five + 0.3, five + 0.9, five + 1.5], [0, 1, 1, 0]);
  const pose: Pose = { ...SIT, armNear: mixLimb(SIT.armNear, tap, reach), lean };
  const ringing = t > five && t < five + 0.35 ? 1 : 0;
  return (
    <Stage fade={sceneFade(frame, dur, 14, 16)} zoom={tween(frame, 0, 9, 1.18, 1.3)} focus={[640, 600]}>
      <Bedroom
        frame={frame}
        sky="dawn"
        sunY={tween(frame, 0, 9, 0.72, 0.5)}
        clock={t < five ? '4:59' : '5:00'}
        clockColor={C.amber}
        clockRing={ringing}
        beam={1.3}
      >
        <Character
          x={px}
          y={py}
          scale={s}
          facing={-1}
          pose={pose}
          breathe={frame}
          eyes={t > five + 2.5 && t < five + 3.4 ? 'happy' : 'open'}
          mouth="smile"
          look={reach > 0.3 ? [10, 2] : [0, 0]}
          blinkAmt={blink(frame, 25)}
        />
      </Bedroom>
    </Stage>
  );
};

// 191–196 s. Channel end card.
export const EndCard: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = tween(frame, 0.2, 1.0, 0, 1);
  const b = tween(frame, 0.9, 1.6, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur, 1, 24)}>
      <rect width={1920} height={1080} fill={C.black} />
      <g opacity={a} transform={`translate(0 ${(1 - a) * 12})`}>
        <Head x={960} y={380} scale={1.05} eyes="happy" mouth="smile" />
        <text x={960} y={640} textAnchor="middle" fontFamily={HAND} fontSize={104} letterSpacing="0.12em" fill={C.text}>
          THE M1ND FRAME
        </text>
      </g>
      <text x={960} y={730} textAnchor="middle" fontFamily={HAND} fontSize={50} letterSpacing="0.04em" fill={C.amber} opacity={b}>
        Your Day 1 starts tonight.
      </text>
    </Stage>
  );
};
