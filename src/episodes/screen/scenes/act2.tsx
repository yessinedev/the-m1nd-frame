import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { Character, Pose, SIT, STAND, idle, mixLimb, nearHand, reachArm, talkMouth, walk } from '../../../kit/Character';
import { SceneProps, sitY, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Door, Glow, Phone, Room } from '../../../kit/props';
import { BigPhone, Chair, CHAIR, DiningTable, Glass, Notice, Pendant, PhoneHands, Plate, SOFA, Suitcase, TABLE } from '../../../kit/props2';
import { FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';
import { LivingRoom } from '../sets';

const redPhone = (on = 1) => <Phone x={4} y={-22} on={on} color={C.red} rotate={-12} scale={0.95} />;

// 64–76 s. Dinner. She talks about her day; he nods at the phone in his lap.
export const Dinner: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const sh = s * 0.95;
  const talking = t < 6.2;
  const gesture: Pose['armNear'] = [58 + Math.sin(frame * 0.18) * 16, 70 + Math.sin(frame * 0.27) * 20];
  const herPose = idle(frame, { ...SIT, armNear: talking ? gesture : [30, 70], armFar: [26, 64], lean: 6 }, 1);
  const nod = Math.max(0, Math.sin(frame * 0.12)) ** 6 * 6;
  const himPose = idle(frame, { ...SIT, armNear: [26, 62], armFar: [20, 60], lean: 16, headY: 6, tilt: -nod }, 0);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.14, 1.22)} focus={[960, 560]}>
      <Room wall="#15161B" />
      <Pendant x={970} y={190} on={0.2} />
      <Chair x={690} facing={1} />
      <Chair x={1250} facing={-1} />
      <Character
        x={700}
        y={sitY(CHAIR.seat, sh)}
        scale={sh}
        variant="her"
        pose={herPose}
        handNear={talking ? 'open' : 'relaxed'}
        breathe={frame + 9}
        eyes={talking ? 'open' : 'down'}
        brow={talking ? 'raised' : 'sad'}
        mouth={talking ? talkMouth(frame, 1) : 'flat'}
        turn={0.3}
        look={[6, 0]}
        blinkAmt={blink(frame, 33)}
      />
      <Character
        x={1240}
        y={sitY(CHAIR.seat, s)}
        scale={s}
        facing={-1}
        pose={himPose}
        breathe={frame}
        eyes="down"
        mouth="flat"
        look={[4, 10]}
        eyeGlow={C.red}
        nearItem={redPhone()}
        blinkAmt={blink(frame, 70)}
      />
      <DiningTable x={760} />
      <Plate x={860} y={TABLE.top} />
      <Plate x={1080} y={TABLE.top} />
      <Glass x={940} y={TABLE.top} />
      <Glass x={1000} y={TABLE.top} />
      <Glow x={1150} y={TABLE.top + 90} r={260} color={C.red} opacity={0.4} />
    </Stage>
  );
};

const MSGS = ['made your favorite tonight', 'are you coming home?', 'can we talk tonight?', 'i miss us', 'hello?'];

// 76–88 s. Close-up: her texts stack up unread. He clears them all and opens the feed.
export const Unread: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const clear = BEATS.unreadClear;
  const notices: Notice[] = MSGS.map((text, i) => ({ text, appear: BEATS.unreadMsgs[i] * FPS, gone: clear * FPS + i * 2 }));
  const feed = t > clear + 0.4;
  const swipe = keys(frame, [clear - 0.4, clear, clear + 0.4], [0, 1, 0]);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.06)}>
      <rect width={1920} height={1080} fill="#0A0B0E" />
      <BigPhone x={960} y={560} h={1000} mode={feed ? 'feed' : 'lock'} scroll={feed ? tween(frame, clear + 0.4, 12, 0, 1400) : 0} frame={frame} notices={notices} clock="10:48" />
      <PhoneHands x={960} y={560} h={1000} thumbY={330 - swipe * 180} thumbX={-swipe * 120} />
    </Stage>
  );
};

// 88–101 s. Same sofa, far apart. She reaches for him; he never notices.
export const CouchApart: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const sh = s * 0.95;
  const himX = 1150;
  const herX = 760;
  const herY = sitY(SOFA.seat, sh);
  const reach = BEATS.apartReach;
  const lean = keys(frame, [reach - 0.3, reach + 0.6, reach + 2.4, reach + 3.2], [4, 18, 18, 4]);
  const toward = reachArm(himX - 150, herY - 120, { x: herX, y: herY, scale: sh, lean });
  const extend = keys(frame, [reach, reach + 1.0, reach + 2.2, reach + 3.2], [0, 0.82, 0.82, 0]);
  const herPose: Pose = idle(frame, { ...SIT, lean, armNear: mixLimb([40, 110], toward, extend), armFar: [44, 110] }, 2);
  const looks = t > 4;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.12, 1.2)} focus={[950, 560]}>
      <LivingRoom frame={frame} lamp={0} tv={0.75}>
        <Character
          x={herX}
          y={herY}
          scale={sh}
          variant="her"
          pose={herPose}
          handNear={extend > 0.2 ? 'open' : 'relaxed'}
          breathe={frame + 4}
          eyes={looks ? 'open' : 'open'}
          brow="sad"
          mouth="flat"
          turn={looks ? 0.45 : 0.1}
          look={looks ? [10, 2] : [2, 0]}
          blinkAmt={blink(frame, 41)}
        />
        <Character
          x={himX}
          y={sitY(SOFA.seat, s)}
          scale={s}
          pose={idle(frame, { ...SIT, armNear: [58, 82], armFar: [44, 80], lean: 12, headY: 4 }, 0)}
          breathe={frame}
          eyes="tired"
          mouth="flat"
          look={[8, 8]}
          eyeGlow={C.red}
          nearItem={redPhone()}
          blinkAmt={blink(frame, 15)}
        />
        <Glow x={himX + 90} y={SOFA.seat - 170} r={300} color={C.red} opacity={0.35} />
      </LivingRoom>
    </Stage>
  );
};

// 101–112 s. Him lit by a giant feed; her small in a fading pool of warm light behind him.
export const Compare: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const warm = tween(frame, 2, 10, 1, 0.25);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 11, 1.0, 1.08)} focus={[1100, 560]}>
      <rect width={1920} height={1080} fill="#09090C" />
      <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.lineSoft} strokeWidth={3} />
      <Glow x={380} y={FLOOR - 120} r={420} color={C.amber} opacity={0.55 * warm} sy={0.6} />
      <Character
        x={380}
        y={standY(0.9)}
        scale={0.9}
        variant="her"
        pose={idle(frame, { ...STAND, armNear: [10, 30], armFar: [8, 30] }, 1)}
        breathe={frame}
        eyes={t > 6 ? 'down' : 'open'}
        brow="sad"
        mouth="flat"
        turn={0.4}
        opacity={0.55 + warm * 0.45}
        blinkAmt={blink(frame, 9)}
      />
      <BigPhone x={1520} y={500} h={940} mode="feed" scroll={frame * 9} frame={frame} />
      <Character
        x={1080}
        y={standY(1.05)}
        scale={1.05}
        pose={idle(frame, STAND, 0)}
        breathe={frame}
        eyes="open"
        mouth="flat"
        look={[10, -4]}
        eyeGlow={C.red}
        blinkAmt={blink(frame, 50)}
      />
    </Stage>
  );
};

// 112–127 s. She waits by the door with her suitcase. He doesn't look up. She leaves.
export const Leaving: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const sh = s * 0.95;
  const { leavingTurn: turnAt, leavingDoor: doorAt, leavingShut: shut } = BEATS;
  const walking = t > doorAt + 0.6;
  const herX = walking ? 1300 + (t - doorAt - 0.6) * 150 : 1300;
  const herY = standY(sh);
  const turned = t > turnAt;
  const herBase: Pose = walking ? walk(frame, 0.8) : idle(frame, STAND, 2);
  const handle = { x: herX + 70 * sh, y: FLOOR - 340 };
  const hold = reachArm(handle.x, handle.y, { x: herX, y: herY, scale: sh, lean: herBase.lean, bob: herBase.bob });
  const herPose: Pose = turned ? { ...herBase, armNear: hold } : herBase;
  const hand = nearHand(herPose, herX, herY, sh);
  const caseX = turned ? hand.x : 1390;
  const door = keys(frame, [doorAt, doorAt + 0.7, shut - 0.6, shut], [0, 1, 1, 0]);
  const gone = tween(frame, shut - 1.4, shut - 0.7, 1, 0);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 15, 1.04, 1.1)} focus={[960, 560]} shake={t > shut && t < shut + 0.12 ? [3, 0] : [0, 0]}>
      <LivingRoom frame={frame} lamp={0} tv={0} sofaX={180} showTv={false}>
        <Door x={1560} open={door} spill="#9FB6D9" />
        <Character
          x={690}
          y={sitY(SOFA.seat, s)}
          scale={s}
          pose={idle(frame, { ...SIT, armNear: [58, 82], armFar: [44, 80], lean: 12, headY: 4 }, 0)}
          breathe={frame}
          eyes="tired"
          mouth="flat"
          look={[8, 8]}
          eyeGlow={C.red}
          nearItem={redPhone()}
          blinkAmt={blink(frame, 15)}
        />
        <Glow x={780} y={SOFA.seat - 170} r={300} color={C.red} opacity={0.35} />
        <g opacity={gone}>
          {turned ? null : <Suitcase x={caseX} handle={1} />}
          <Character
            x={herX}
            y={herY}
            scale={sh}
            facing={turned ? 1 : -1}
            variant="her"
            pose={herPose}
            breathe={frame}
            eyes={turned ? 'down' : 'open'}
            brow="sad"
            mouth="frown"
            turn={turned ? 0 : 0.2}
            look={turned ? [0, 0] : [4, 4]}
            blinkAmt={blink(frame, 25)}
            hairSwing={walking ? Math.sin(frame * 0.32) * 3 : 0}
          />
          {turned ? <Suitcase x={caseX + 10} handle={1} /> : null}
        </g>
      </LivingRoom>
    </Stage>
  );
};

// 127–140 s. Alone on the sofa. He lowers the phone and finally sees the empty seat.
export const Empty: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const lower = BEATS.emptyLower;
  const down = tween(frame, lower, lower + 0.8, 0, 1);
  const screen = tween(frame, lower + 0.2, lower + 0.7, 1, 0);
  const looks = t > lower + 0.8;
  const pose = idle(
    frame,
    { ...SIT, armNear: mixLimb([58, 82], [14, 40], down), armFar: mixLimb([44, 80], [18, 40], down), lean: 12 - down * 8, headY: 4 - down * 4, tilt: looks ? -4 : 0 },
    0,
  );
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.12, 1.3)} focus={[1060, 560]}>
      <LivingRoom frame={frame} lamp={0} tv={0} mug photoDim={0.4}>
        <Character
          x={1150}
          y={sitY(SOFA.seat, s)}
          scale={s}
          pose={pose}
          breathe={frame}
          eyes={looks ? 'open' : 'tired'}
          brow={looks ? 'sad' : 'none'}
          mouth="flat"
          turn={looks ? -0.5 : 0.1}
          look={looks ? [-10, -2] : [8, 8]}
          eyeGlow={screen > 0.3 ? C.red : undefined}
          nearItem={redPhone(screen)}
          blinkAmt={blink(frame, 15)}
        />
        <Glow x={1240} y={SOFA.seat - 170} r={300} color={C.red} opacity={0.35 * screen} />
      </LivingRoom>
    </Stage>
  );
};
