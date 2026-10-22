import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, Pose, STAND, idle, mixLimb, reachArm, talkMouth } from '../../../kit/Character';
import { SceneProps, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Door, Mirror, Room, Sink } from '../../../kit/props';
import { Kitchen, Mug, Pendant } from '../../../kit/props2';
import { HoodieBundle } from '../../../kit/props4';
import { FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C } from '../../../theme';

// 68–82 s. Memory: dancing in the kitchen, she in the lilac hoodie. Then the colour drains and he's alone.
export const Memory: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const sl = s * 0.95;
  const himX = 820;
  const lenaX = 1030;
  const y = standY(s);
  const yl = standY(sl);
  const [d0, d1] = BEATS.drain;
  const drain = tween(frame, d0, d1, 0, 1);
  const gone = tween(frame, d0 + 0.6, d1, 1, 0);
  const spin = BEATS.spin;
  const spinning = t > spin && t < spin + 0.8;
  const sway = Math.sin(frame * 0.12) * 4;
  const hands = { x: 925 + sway, y: y - 120 * s };
  const himArm = gone > 0.05 ? reachArm(hands.x, hands.y, { x: himX, y, scale: s }) : ([-4, 10] as Pose['armNear']);
  const lenaArm = reachArm(hands.x, hands.y, { x: lenaX, y: yl, scale: sl, facing: -1 });
  const laugh = t > spin + 0.6 && t < d0;
  const lenaFacing: 1 | -1 = spinning ? (Math.floor((t - spin) * 10) % 2 ? 1 : -1) : -1;
  return (
    <AbsoluteFill style={{ filter: `saturate(${1 - drain}) sepia(${0.25 * (1 - drain)}) brightness(${1 - drain * 0.15})` }}>
      <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.16, 1.26)} focus={[930, 520]}>
        <Room wall="#1A1712" />
        <Pendant x={930} y={160} on={1 - drain * 0.8} />
        <Kitchen x={-20} w={1960} frame={frame} steam={0} />
        <Character
          x={himX}
          y={y + Math.sin(frame * 0.24) * 2}
          scale={s}
          pose={idle(frame, { ...STAND, armNear: mixLimb([-4, 10], himArm, gone), tilt: sway * 0.6 }, 0)}
          nearItem={drain > 0.8 ? <g transform="translate(0 -10)"><Mug x={0} y={0} /></g> : undefined}
          breathe={frame}
          eyes={laugh ? 'happy' : drain > 0.5 ? 'down' : 'open'}
          brow={drain > 0.5 ? 'sad' : 'none'}
          mouth={laugh ? 'grin' : drain > 0.5 ? 'flat' : 'smile'}
          turn={0.3}
          blush={laugh ? 0.4 : 0}
          blinkAmt={blink(frame, 14)}
        />
        <Character
          x={lenaX}
          y={yl + Math.sin(frame * 0.24 + 1) * 2}
          scale={sl}
          facing={lenaFacing}
          variant="lena"
          pose={idle(frame, { ...STAND, armNear: spinning ? [160, 10] : lenaArm, tilt: -sway * 0.6 }, 2)}
          handNear="grip"
          breathe={frame + 9}
          eyes={laugh || spinning ? 'happy' : 'open'}
          mouth={laugh || spinning ? 'grin' : 'smile'}
          blush={0.6}
          turn={0.25}
          hairSwing={spinning ? Math.sin(frame * 0.8) * 6 : Math.sin(frame * 0.12) * 2}
          opacity={gone}
          blinkAmt={blink(frame, 51)}
        />
      </Stage>
    </AbsoluteFill>
  );
};

// 82–96 s. Sam at the door: "come on, get out of the house." He shakes his head and closes it.
export const FriendsDoor: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const y = standY(s);
  const open = keys(frame, [BEATS.doorOpen, BEATS.doorOpen + 0.6, BEATS.doorShut - 0.6, BEATS.doorShut], [0, 1, 1, 0]);
  const shake = t > 6 && t < 7.6 ? Math.sin((t - 6) * 14) * 6 : 0;
  const samTalks = t > 2.8 && t < 6;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.14, 1.22)} focus={[1060, 520]}>
      <Room wall="#14161B" />
      <Door x={1160} open={open} spill="#BFC6D6" />
      <Character
        x={1260}
        y={y}
        scale={s}
        facing={-1}
        variant="sam"
        pose={idle(frame, { ...STAND, armNear: samTalks ? [70 + Math.sin(frame * 0.2) * 14, 40] : [-4, 10] }, 2)}
        handNear={samTalks ? 'open' : 'relaxed'}
        breathe={frame}
        eyes="open"
        brow={t > 7 ? 'sad' : 'raised'}
        mouth={samTalks ? talkMouth(frame, 2) : 'flat'}
        turn={0.2}
        opacity={open}
        blinkAmt={blink(frame, 33)}
      />
      <Character
        x={960}
        y={y}
        scale={s}
        pose={idle(frame, { ...STAND, armNear: [-4, 10], headY: 6, tilt: shake }, 0)}
        breathe={frame}
        eyes="down"
        brow="sad"
        mouth="flat"
        turn={0.2}
        stubble
        blinkAmt={blink(frame, 18)}
      />
    </Stage>
  );
};

// 96–108 s. Night. He sleeps curled around her hoodie. A tear.
export const HoodieSleep: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.45, 1.65)} focus={[BR.headX + 80, BR.headY]}>
      <Bedroom
        frame={frame}
        clock="03:20"
        clockColor={C.textDim}
        lying={{ eyes: 'closed', brow: 'sad', mouth: 'flat', tear: tween(frame, 3, 9, 0, 0.95), stubble: true }}
      >
        <g transform={`translate(${BR.headX + 92} ${BR.headY + 30}) rotate(-8)`}>
          <HoodieBundle scale={0.95} />
        </g>
      </Bedroom>
    </Stage>
  );
};

// 108–118 s. The mirror: stubble, tired eyes. He can't hold his own gaze.
export const MirrorScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const x = 760;
  const glance = t > 5.6 && t < 7.2;
  const face = { eyes: (glance ? 'open' : 'down') as 'open' | 'down', brow: 'sad' as const, mouth: 'frown' as const, stubble: true, blinkAmt: blink(frame, 15) };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 10, 1.1, 1.18)} focus={[1000, 520]}>
      <Room wall="#12151A" />
      <Mirror x={1010} y={160}>
        <rect width={1920} height={1080} fill="#151820" />
        <Character x={2 * 1030 - x} y={standY(s)} scale={s} facing={-1} pose={STAND} {...face} opacity={0.45} hoodie={C.hoodieShade} />
      </Mirror>
      <Sink x={1200} y={700} />
      <Character x={x} y={standY(s)} scale={s} pose={idle(frame, STAND, 0)} breathe={frame} {...face} />
    </Stage>
  );
};
