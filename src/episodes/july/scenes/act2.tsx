import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, Head, Pose, SIT, STAND, idle, mix, reachArm, run, talkMouth, walk } from '../../../kit/Character';
import { SceneProps, sitY, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Glow, Mirror, Room, Sink } from '../../../kit/props';
import { Park, PhoneHands } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { DrapedHoodie } from '../../../kit/props4';
import { BodyFeedScreen, Pool, POOL, PoolChair, Stairs, STAIRS, Towel } from '../../../kit/props6';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS, BUILD, TEE } from '../script';
import { C } from '../../../theme';

const B = BUILD;

// 97–111 s. The stairwell. Sam sits down next to him.
export const StairsScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const step = STAIRS.step(0);
  const samTalks = (t > 1.2 && t < 5.4) || (t > 5.8 && t < 9.4);
  const looks = t > 9.6;
  const seat: Pose = { ...SIT, legNear: [52, 70], legFar: [48, 66] };
  const himX = 820;
  const samX = 700;
  const shoulder = { x: himX - 30, y: sitY(step.y, s) - 140 * s };
  const hand = keys(frame, [6.0, 6.8], [0, 1]);
  const samArm = hand > 0 ? reachArm(shoulder.x, shoulder.y, { x: samX, y: sitY(step.y, s), scale: s }) : ([20, 60] as Pose['armNear']);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.2, 1.3)} focus={[780, 520]}>
      <Stairs />
      <Character
        x={samX}
        y={sitY(step.y, s)}
        scale={s}
        variant="sam"
        tee="#5E7FA0"
        pose={idle(frame, { ...seat, armNear: hand > 0 ? [20 + (samArm[0] - 20) * hand, 60 + (samArm[1] - 60) * hand] : samArm }, 2)}
        breathe={frame + 4}
        eyes="open"
        brow={samTalks ? 'raised' : 'none'}
        mouth={samTalks ? talkMouth(frame, 3) : 'smile'}
        turn={0.4}
        look={[8, 0]}
        blinkAmt={blink(frame, 40)}
      />
      <Character
        x={himX}
        y={sitY(step.y, s)}
        scale={s}
        build={B}
        pose={idle(frame, { ...seat, armNear: [36, 96], armFar: [30, 100], lean: looks ? 4 : 14, headY: looks ? 0 : 8 }, 0)}
        breathe={frame}
        eyes={looks ? 'open' : 'down'}
        brow="sad"
        mouth="flat"
        turn={looks ? -0.45 : 0.2}
        look={looks ? [-10, 0] : [4, 8]}
        tear={looks ? tween(frame, 10, 13.6, 0, 0.9) : 0}
        blinkAmt={blink(frame, 12)}
      />
    </Stage>
  );
};

// 111–124 s. Close-up: the "perfect body" feed. Unfollow. Unfollow. Unfollow.
export const Feed: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const taps = BEATS.unfollow.map((s) => f(s));
  const tap = BEATS.unfollow.reduce((m, s) => Math.max(m, keys(frame, [s - 0.25, s, s + 0.2], [0, 1, 0])), 0);
  const scroll = BEATS.unfollow.reduce((acc, s) => acc + tween(frame, s + 0.3, s + 0.8, 0, 470), 0);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.0, 1.06)}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000}>
        {(sw, sh) => <BodyFeedScreen sw={sw} sh={sh} frame={frame} scroll={scroll} unfollowAt={taps} />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={200 - tap * 90} thumbX={-10 + tap * 20} />
    </Stage>
  );
};

// 124–136 s. He lifts the towel off the mirror. And just looks.
export const MirrorAgain: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const x = 760;
  const [l0, l1] = BEATS.towelLift;
  const lift = tween(frame, l0, l1, 0, 1);
  const towelArm = reachArm(1060, 220, { x, y: standY(s), scale: s });
  const armT = keys(frame, [l0 - 0.6, l0, l1, l1 + 0.5], [0, 1, 1, 0]);
  const pose: Pose = idle(frame, { ...STAND, armNear: [STAND.armNear[0] + (towelArm[0] - STAND.armNear[0]) * armT, STAND.armNear[1] + (towelArm[1] - STAND.armNear[1]) * armT] }, 0);
  const face = { eyes: (t > l1 ? 'open' : 'down') as 'open' | 'down', brow: (t > l1 + 3 ? 'none' : 'sad') as 'none' | 'sad', mouth: (t > 8 ? 'smile' : 'flat') as 'smile' | 'flat', blinkAmt: blink(frame, 15) };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.08, 1.2)} focus={[1000, 520]}>
      <Room wall="#14161B" />
      <Mirror x={1010} y={160}>
        <rect width={1920} height={1080} fill="#181B22" />
        <Character x={2 * 1030 - x} y={standY(s)} scale={s} build={B} facing={-1} pose={{ ...STAND }} {...face} opacity={0.75} />
      </Mirror>
      <Towel x={1010} y={160} lift={lift} />
      <Sink x={1200} y={700} />
      <Character x={x} y={standY(s)} scale={s} build={B} pose={pose} breathe={frame} {...face} />
    </Stage>
  );
};

// 136–146 s. Walking with Sam at sunset. Laughing.
export const Walks: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const laugh = (t > 3 && t < 4.6) || (t > 7 && t < 8.6);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 10, 1.06, 1.0)}>
      <Park offset={frame * 3.2} sunY={tween(frame, 0, 10, 540, 580)} />
      <Character x={780} y={standY(s * 0.98)} scale={s * 0.98} variant="sam" tee="#5E7FA0" pose={walk(frame + 6, 0.85)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 2)} turn={0.4} />
      <Character x={990} y={standY(s)} scale={s} build={B} pose={walk(frame, 0.85)} breathe={frame} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : 'smile'} turn={-0.2} look={[-6, 0]} blinkAmt={blink(frame, 9)} />
    </Stage>
  );
};

// 146–158 s. Morning. The hoodie stays on the bed. Deep breath. Out the door in a t-shirt.
export const HoodieOff: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const off = t > BEATS.hoodieOff;
  const walking = t > 6.2;
  const x = walking ? 1100 + (t - 6.2) * 160 : 1100;
  const breath = t > 3.4 && t < 5.4 ? Math.sin((t - 3.4) * Math.PI / 2) * -8 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.1, 1.04)} focus={[1100, 560]}>
      <Bedroom frame={frame} sky="dawn" sunY={0.7} clock="9:12" clockColor={C.textDim} door={tween(frame, 6.6, 7.6, 0, 1)}>
        {off ? <DrapedHoodie x={BR.bedX + 420} y={BR.mattress - 30} color={C.hoodie} shade={C.hoodieShade} /> : null}
        <Character
          x={x}
          y={standY(s) + breath}
          scale={s}
          build={B}
          tee={off ? TEE : undefined}
          pose={walking ? walk(frame, 0.9) : idle(frame, { ...STAND, armNear: off ? [-4, 10] : [40, 60] }, 0)}
          breathe={frame}
          eyes={t > 3.4 && t < 5.4 ? 'closed' : 'open'}
          brow={t < 5.6 ? 'worried' : 'none'}
          mouth={t > 5.6 ? 'smile' : 'flat'}
          turn={0.2}
          opacity={tween(frame, 10.4, 11.4, 1, 0)}
          blinkAmt={blink(frame, 21)}
        />
      </Bedroom>
    </Stage>
  );
};

type Swimmer = { variant: 'sam' | 'jay' | 'her'; x: number; tee: string; seed: number };
const SWIMMERS: Swimmer[] = [
  { variant: 'sam', x: 1180, tee: '#5E7FA0', seed: 0 },
  { variant: 'her', x: 1430, tee: '#C97A6A', seed: 2 },
  { variant: 'jay', x: 1680, tee: '#4F7A64', seed: 4 },
];

const swimmerPose = (frame: number, seed: number, wave = false, cheer = false): Pose => ({
  ...STAND,
  armNear: cheer ? [170 + Math.sin(frame * 0.5 + seed) * 8, 18] : wave ? [172 + Math.sin(frame * 0.5) * 12, 14] : [60 + Math.sin(frame * 0.08 + seed) * 10, 40],
  armFar: cheer ? [165, 22] : [56 + Math.sin(frame * 0.07 + seed) * 10, 40],
  bob: Math.sin(frame * 0.08 + seed) * 6,
});

const Swimmers: React.FC<{ frame: number; wave?: boolean; cheer?: boolean; t: number }> = ({ frame, wave = false, cheer = false }) => (
  <>
    {SWIMMERS.map((w) => (
      <Character
        key={w.variant}
        x={w.x}
        y={POOL.water + 120}
        scale={1.0}
        facing={-1}
        variant={w.variant}
        tee={w.tee}
        pose={swimmerPose(frame, w.seed, wave && w.variant === 'sam', cheer)}
        eyes={cheer ? 'happy' : 'open'}
        mouth={cheer ? 'grin' : wave && w.variant === 'sam' ? 'open' : 'smile'}
        turn={0.2}
        hairSwing={w.variant === 'her' ? Math.sin(frame * 0.1) * 2 : 0}
      />
    ))}
  </>
);

// 158–170 s. At the pool's edge in a t-shirt. Sam waves him in.
export const PoolEdge: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.08, 1.16)} focus={[900, 560]}>
      <Pool frame={frame} />
      <PoolChair x={300} hoodie={C.hoodie} />
      <Swimmers frame={frame} wave={t > 5.6} t={t} />
      <Pool frame={frame} front />
      <Character
        x={620}
        y={standY(s) - 40}
        scale={s}
        build={B}
        tee={TEE}
        pose={idle(frame, { ...STAND, armNear: [20, 60], armFar: [24, 60] }, 0)}
        breathe={frame}
        eyes="open"
        brow="worried"
        mouth="flat"
        sweat
        look={[10, 4]}
        blinkAmt={blink(frame, 14)}
      />
    </Stage>
  );
};

// 170–182 s. He runs, leaps, and the splash goes everywhere. Everyone cheers.
export const Jump: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const { run: r0, leap, splash } = BEATS;
  const groundY = standY(s) - 40;
  let x = 420;
  let y = groundY;
  let pose: Pose = idle(frame, STAND, 0);
  if (t > r0 && t < leap) {
    x = 420 + (t - r0) * 300;
    pose = run(frame, 1.1);
  } else if (t >= leap && t < splash) {
    const p = (t - leap) / (splash - leap);
    x = 720 + p * 300;
    y = groundY - Math.sin(p * Math.PI) * 140 + p * 160;
    pose = mix(run(frame, 1.1), { ...STAND, armNear: [170, 10], armFar: [165, 14], legNear: [40, 70], legFar: [30, 60] }, 0.8);
  }
  const under = t >= splash && t < splash + 0.9;
  const up = t >= splash + 0.9;
  const splashT = Math.max(0, (t - splash) / 1.2);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, splash, splash + 1, 12], [1.06, 1.16, 1.06, 1.12])} focus={[960, 560]} shake={t > splash && t < splash + 0.2 ? [6, 4] : [0, 0]}>
      <Pool frame={frame} />
      <PoolChair x={300} hoodie={C.hoodie} />
      <Swimmers frame={frame} cheer={t > splash + 1.2} t={t} />
      {up ? (
        <Character
          x={1030}
          y={POOL.water + 120}
          scale={1.0}
          build={B}
          tee={TEE}
          pose={swimmerPose(frame, 1, false, t > splash + 1.6)}
          eyes="happy"
          mouth="grin"
          turn={0.2}
        />
      ) : null}
      <Pool frame={frame} front splash={splashT < 1 ? splashT : 0} splashX={1030} />
      {!under && !up ? (
        <Character x={x} y={y} scale={s} build={B} tee={TEE} pose={pose} breathe={frame} eyes={t > r0 ? 'closed' : 'open'} brow={t > r0 ? 'focused' : 'worried'} mouth={t > leap ? 'open' : 'flat'} />
      ) : null}
    </Stage>
  );
};

// 182–194 s. Sunset, feet in the water, laughing with friends. The hoodie still on the chair.
export const Sunset: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const edge: Pose = { ...SIT, legNear: [84, 70], legFar: [80, 74], armNear: [-30, 20], armFar: [-34, 20] };
  const laugh = (t > 2 && t < 3.8) || (t > 7 && t < 8.6);
  const seatY = POOL.water - 6;
  return (
    <Stage fade={sceneFade(frame, dur, 12, 18)} zoom={tween(frame, 0, 12, 1.12, 1.2)} focus={[1040, 600]}>
      <Pool frame={frame} />
      <rect width={1920} height={1080} fill="#FF8A3C" opacity={0.14} style={{ mixBlendMode: 'overlay' }} />
      <Glow x={1600} y={300} r={900} color={C.amber} opacity={0.3} />
      <PoolChair x={300} hoodie={C.hoodie} />
      {[
        { variant: 'sam' as const, x: 880, tee: '#5E7FA0', build: 1 },
        { variant: 'him' as const, x: 1060, tee: TEE, build: B },
        { variant: 'her' as const, x: 1240, tee: '#C97A6A', build: 1 },
        { variant: 'jay' as const, x: 1400, tee: '#4F7A64', build: 1 },
      ].map((p, i) => (
        <Character
          key={p.variant}
          x={p.x}
          y={sitY(seatY, s)}
          scale={s}
          variant={p.variant}
          tee={p.tee}
          build={p.build}
          pose={idle(frame, { ...edge, bob: laugh ? -Math.abs(Math.sin(t * 9 + i)) * 4 : 0 }, i)}
          breathe={frame + i * 9}
          eyes={laugh ? 'happy' : 'open'}
          mouth={laugh ? 'grin' : p.variant === 'him' ? 'smile' : talkMouth(frame, i)}
          turn={0.3}
          hairSwing={p.variant === 'her' ? Math.sin(frame * 0.05) * 2 : 0}
          blinkAmt={blink(frame, 13 + i * 19)}
        />
      ))}
      <Pool frame={frame} front />
    </Stage>
  );
};

// 194–200 s. End card.
export const EndCard: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = tween(frame, 0.2, 1.0, 0, 1);
  const b = tween(frame, 0.9, 1.6, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur, 1, 24)}>
      <rect width={1920} height={1080} fill={C.black} />
      <g opacity={a} transform={`translate(0 ${(1 - a) * 12})`}>
        <Head x={960} y={380} scale={1.0} eyes="happy" mouth="smile" />
        <text x={960} y={640} textAnchor="middle" fontFamily={HAND} fontSize={104} letterSpacing="0.12em" fill={C.text}>
          THE M1ND FRAME
        </text>
      </g>
      <text x={960} y={730} textAnchor="middle" fontFamily={HAND} fontSize={50} letterSpacing="0.04em" fill={C.amber} opacity={b}>
        You were never the joke.
      </text>
    </Stage>
  );
};
