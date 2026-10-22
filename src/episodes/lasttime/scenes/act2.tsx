import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { Character, KID, Pose, SIT, STAND, idle, mixLimb, reachArm, walk } from '../../../kit/Character';
import { SceneProps, sitY, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Desk, DESK, Glow, Laptop, Lamp, Papers, Phone, Room, Stool, WallClock } from '../../../kit/props';
import { Chair, CHAIR, DiningTable, PhoneHands, Plate, TABLE, TV } from '../../../kit/props2';
import { Box, ChatScreen, PhoneShell, PostScreen, Van } from '../../../kit/props3';
import { Suburb } from '../../../kit/bike';
import { FPS } from '../../../kit/time';
import { THREAD } from '../script';
import { C, FLOOR } from '../../../theme';

// 56–66 s. Moving day. Sam carries the last box to the van, waves, and is gone.
export const Moving: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const carrying = t < 3.2;
  const samX = carrying ? 760 + t * 150 : 1240;
  const samIn = tween(frame, 5.4, 6.0, 1, 0);
  const vanX = 1380 + Math.max(0, t - 6.4) ** 2 * 120;
  const carryArm: Pose['armNear'] = [78, 58];
  const samPose: Pose = carrying ? { ...walk(frame, 0.9), armNear: carryArm, armFar: carryArm } : idle(frame, { ...STAND, armNear: t > 3.6 ? [100 + Math.sin(frame * 0.5) * 8, 88] : [-4, 10] }, 1);
  const himWaves = t > 3.8 && t < 8.5;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 10, 1.06, 1.12)} focus={[1000, 560]}>
      <Suburb offset={300} sunY={300} />
      <Van x={vanX} wheel={Math.max(0, t - 6.4) ** 2 * 300} />
      <Box x={1640} label="SAM'S" />
      <Character
        x={560}
        y={standY(KID)}
        bodyScale={KID}
        pose={idle(frame, { ...STAND, armNear: himWaves ? [100 + Math.sin(frame * 0.45) * 8, 88] : [-4, 10] }, 0)}
        handNear={himWaves ? 'open' : 'relaxed'}
        breathe={frame}
        eyes="open"
        brow="sad"
        mouth={himWaves ? 'smile' : 'flat'}
        turn={0.3}
        look={[8, 0]}
        blinkAmt={blink(frame, 40)}
      />
      <g opacity={samIn}>
        <Character
          x={samX}
          y={standY(KID)}
          bodyScale={KID}
          variant="sam"
          facing={carrying ? 1 : -1}
          pose={samPose}
          handNear={carrying ? 'relaxed' : 'open'}
          breathe={frame}
          eyes="open"
          brow={carrying ? 'none' : 'sad'}
          mouth="smile"
          turn={0.2}
          blinkAmt={blink(frame, 15)}
        />
        {carrying ? <Box x={samX + 70} y={standY(KID) - 40} w={110} h={90} /> : null}
      </g>
    </Stage>
  );
};

// 66–84 s. The thread, over the years. Plans → "soon" → "someday" → seen.
export const Chat: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 18, 1.0, 1.06)}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000}>
        {(sw, sh) => <ChatScreen sw={sw} sh={sh} frame={frame} msgs={THREAD} />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={330 + Math.sin(frame * 0.05) * 6} />
    </Stage>
  );
};

// 84–96 s. Adult. Late night at work; the clock spins.
export const Office: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.12;
  const stoolTop = FLOOR - 165;
  const px = 720;
  const py = sitY(stoolTop, s);
  const lean = 10;
  const keysAt = { x: 960 + Math.sin(frame * 0.9) * 8, y: DESK.top - 10 - Math.abs(Math.sin(frame * 1.3)) * 6 };
  const arm = reachArm(keysAt.x, keysAt.y, { x: px, y: py, scale: s, lean });
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.1, 1.16)} focus={[960, 560]}>
      <Room wall="#111318" />
      <WallClock x={1180} y={300} minutes={frame * 12} />
      <Desk x={840} />
      <Laptop x={1010} y={DESK.top - 2} on={0.8} />
      <Papers x={1250} y={DESK.top - 2} count={tween(frame, 0, 11, 6, 18)} />
      <Lamp x={1330} y={DESK.top - 2} on={0.25} />
      <Stool x={px} top={stoolTop} />
      <Character
        x={px}
        y={py}
        scale={s}
        pose={{ ...SIT, legFar: [52, 48], legNear: [46, 44], armFar: [50, 70], armNear: arm, lean }}
        breathe={frame}
        eyes="tired"
        mouth="flat"
        look={[10, 2]}
        eyeGlow={C.screen}
        blinkAmt={blink(frame, 22)}
      />
    </Stage>
  );
};

// 96–108 s. Close-up: Sam's post. His baby's first birthday. A like. Keep scrolling.
export const Post: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tap = keys(frame, [2.6, 3.3, 3.5, 3.9], [0, 1, 1, 0]);
  const liked = tween(frame, 3.35, 3.6, 0, 1);
  const flick = keys(frame, [6.0, 6.3, 6.6], [0, 1, 0]);
  const scroll = tween(frame, 6.0, 6.5, 0, 420);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.06)}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000} screen="#1A1F29">
        {(sw, sh) => <PostScreen sw={sw} sh={sh} liked={liked} scroll={scroll} />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={330 - tap * 160 - flick * 200} thumbX={-tap * 300} />
    </Stage>
  );
};

// 108–122 s. Dinner alone. TV on. Nobody to call.
export const Alone: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.1;
  const t = frame / FPS;
  const fork = keys(frame, [1.0, 1.5, 2.0, 5.0, 5.5, 6.0], [0, 1, 0, 0, 1, 0]);
  const himPose: Pose = idle(frame, { ...SIT, armNear: mixLimb([40, 70], [60, 110], fork), armFar: [30, 60], lean: 8, headY: 4 }, 0);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.12, 1.24)} focus={[860, 560]}>
      <Room wall="#13151A" />
      <TV x={1620} light={0.7} />
      <Chair x={640} facing={1} />
      <Character
        x={650}
        y={sitY(CHAIR.seat, s)}
        scale={s}
        pose={himPose}
        breathe={frame}
        eyes={t > 9 ? 'down' : 'tired'}
        mouth="flat"
        brow={t > 9 ? 'sad' : 'none'}
        look={t > 9 ? [6, 8] : [12, -2]}
        eyeGlow={t > 9 ? undefined : '#9FC1E8'}
        blinkAmt={blink(frame, 35)}
      />
      <DiningTable x={720} />
      <Plate x={830} y={TABLE.top} />
      <Phone x={1010} y={TABLE.top - 2} on={t > 9 ? 0.6 : 0} flat scale={0.85} />
      <Chair x={1220} facing={-1} />
      <Glow x={1300} y={500} r={520} color="#9FC1E8" opacity={0.12} />
    </Stage>
  );
};
