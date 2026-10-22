import React from 'react';
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { Character, Head, Pose, SIT, STAND, idle, mixLimb, reachArm, talkMouth } from '../../../kit/Character';
import { SceneProps, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Glow, Phone, Room, Window } from '../../../kit/props';
import { Kitchen, Pendant, PhoneHands } from '../../../kit/props2';
import { Box, CallScreen, PhoneShell, Polaroid, StreetSign } from '../../../kit/props3';
import { Suburb } from '../../../kit/bike';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS, STREET } from '../script';
import { C, FLOOR } from '../../../theme';
import { LastRide, Rider } from './act1';

// 122–136 s. Packing his apartment, he finds the Polaroid. Flash: the last day.
export const Photo: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const flash = BEATS.photoFlash;
  const s = 1.1;
  const seat = FLOOR - 4;
  const lift = tween(frame, 1.6, 3.0, 0, 1);
  const kneel: Pose = { ...SIT, legFar: [92, 150], legNear: [88, 146], lean: 18, armFar: [30, 50] };
  const arm = mixLimb([40, 60], [72, 82], lift);
  const closeUp = t > flash;
  const memory = keys(frame, [9.4, 9.8, 11.6, 12.4], [0, 1, 1, 0]);
  return (
    <AbsoluteFill>
      {!closeUp ? (
        <Stage fade={sceneFade(frame, dur, 12, 0)} zoom={tween(frame, 0, flash, 1.14, 1.3)} focus={[860, 640]}>
          <Room wall="#15171C" />
          <Window x={1350} y={190} sky="day" />
          <Box x={600} label="OLD STUFF" w={170} h={130} />
          <Box x={1180} w={150} h={110} />
          <Box x={1300} w={110} h={80} />
          <Character
            x={760}
            y={seat - 16 * s - 60}
            scale={s}
            pose={idle(frame, { ...kneel, armNear: arm }, 0)}
            breathe={frame}
            eyes={lift > 0.8 ? 'wide' : 'down'}
            brow={lift > 0.8 ? 'raised' : 'none'}
            mouth={lift > 0.8 ? 'o' : 'flat'}
            look={lift > 0.8 ? [10, 2] : [4, 10]}
            nearItem={lift > 0.1 ? <Polaroid x={8} y={-30} scale={0.16} rotate={-8} /> : undefined}
            blinkAmt={blink(frame, 25)}
          />
        </Stage>
      ) : (
        <Stage fade={Math.min(sceneFade(frame - f(flash), dur - f(flash), 6, 14), 1 - memory * 0.85)} zoom={tween(frame, flash, 14, 1.0, 1.1)}>
          <rect width={1920} height={1080} fill="#0E0F13" />
          <Glow x={960} y={540} r={700} color={C.amber} opacity={0.35} />
          <Polaroid x={960} y={520} scale={1.7} rotate={-4} />
        </Stage>
      )}
      {memory > 0 ? (
        <AbsoluteFill style={{ opacity: memory }}>
          <Freeze frame={f(BEATS.lastFreeze + 1)}>
            <LastRide dur={f(15)} />
          </Freeze>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// 136–150 s. His thumb over "call". Twice he backs off. Then he presses it.
export const Dial: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const press = BEATS.dialPress;
  const approach = keys(frame, [1.2, 2.2, 3.2, 4.0, 5.2, 6.2, 7.4, 8.2, press - 0.4, press], [0, 0.75, 0.75, 0.1, 0.1, 0.85, 0.85, 0.2, 0.2, 1]);
  const pressed = t >= press;
  const push = keys(frame, [press - 0.1, press, press + 0.2], [0, 1, 0]);
  return (
    <Stage fade={sceneFade(frame, dur, 10, 6)} zoom={tween(frame, 0, 14, 1.0, 1.1)} focus={[960, 640]}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000} glow={pressed ? C.amber : C.screen}>
        {(sw, sh) => <CallScreen sw={sw} sh={sh} frame={frame} phase={pressed ? 'calling' : 'contact'} press={push} />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={330 - approach * 40 + Math.sin(frame * 0.6) * (approach > 0.5 && !pressed ? 2 : 0)} thumbX={-approach * 150} />
    </Stage>
  );
};

// 150–162 s. Split screen. Sam's phone rings in his kitchen; he answers. "...Hello?" "Hey. It's me." "DUDE."
export const Answer: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const pick = BEATS.answerPick;
  const s = 1.15;
  const himX = 520;
  const samX = 1420;
  const y = standY(s);
  const ear = (x: number, facing: 1 | -1) => reachArm(x + facing * 62 * s, y - 238 * s, { x, y, scale: s, facing });
  const samArm = t < pick ? ([-4, 10] as Pose['armNear']) : mixLimb([-4, 10], ear(samX, -1), tween(frame, pick, pick + 0.5, 0, 1));
  const dude = t > 9.0;
  const samJump = dude ? -Math.abs(Math.sin((t - 9) * 8)) * 10 * Math.max(0, 1 - (t - 9) / 2) : 0;
  const ringing = t < pick;
  return (
    <Stage fade={sceneFade(frame, dur)}>
      <defs>
        <clipPath id="answerL">
          <rect x={0} y={0} width={954} height={1080} />
        </clipPath>
        <clipPath id="answerR">
          <rect x={966} y={0} width={954} height={1080} />
        </clipPath>
      </defs>
      <g clipPath="url(#answerL)">
        <g transform="translate(-260 0)">
          <Room wall="#15171C" />
          <Window x={1000} y={200} sky="dawn" sunY={0.7} />
          <Character
            x={himX + 260}
            y={y}
            scale={s}
            pose={idle(frame, { ...STAND, armNear: ear(himX + 260, 1) }, 0)}
            nearItem={<Phone x={0} y={-20} on={0.4} rotate={-60} scale={0.9} />}
            breathe={frame}
            eyes={dude ? 'happy' : 'open'}
            brow={t < 5.4 ? 'worried' : 'none'}
            mouth={t > 5.4 && t < 8.6 ? talkMouth(frame, 1) : dude ? 'grin' : 'flat'}
            turn={0.3}
            blush={dude ? 0.4 : 0}
            blinkAmt={blink(frame, 18)}
          />
        </g>
      </g>
      <g clipPath="url(#answerR)">
        <Room wall="#1A1712" />
        <Pendant x={1450} y={160} on={1} />
        <Kitchen x={966} w={960} frame={frame} steam={0} />
        <Character
          x={samX}
          y={y + samJump}
          scale={s}
          variant="sam"
          facing={-1}
          pose={idle(frame, { ...STAND, armNear: samArm }, 2)}
          nearItem={t > pick ? <Phone x={0} y={-20} on={0.4} rotate={-60} scale={0.9} /> : undefined}
          breathe={frame + 7}
          eyes={dude ? 'happy' : t > pick + 4.4 ? 'wide' : 'open'}
          brow={t > pick && t < 9 ? 'raised' : 'none'}
          mouth={t > 1.8 && t < 4.8 ? talkMouth(frame, 4) : dude ? 'grin' : t > pick + 4.4 ? 'o' : 'flat'}
          turn={0.2}
          blinkAmt={blink(frame, 61)}
        />
        {ringing ? (
          <g transform={`translate(${1660 + Math.sin(frame * 2.2) * 3} ${FLOOR - 252})`}>
            <Phone x={0} y={0} on={1} color={C.amber} flat scale={0.9} />
          </g>
        ) : null}
      </g>
      <rect x={954} y={0} width={12} height={1080} fill="#0A0A0C" />
    </Stage>
  );
};

// 162–184 s. Two grown men on bikes, racing down the same kind of street.
export const RideAgain: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const himX = 1110 - Math.sin(t * 0.5) * 70;
  const samX = 720 + Math.sin(t * 0.5) * 170;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, 10, 12, 22], [1.0, 1.0, 1.22, 1.28])} focus={[920, 620]}>
      <Suburb offset={frame * 16} sunY={tween(frame, 0, 22, 480, 560)} />
      <Rider x={samX} spin={frame * 0.32 + 1} back variant="sam" bob={Math.sin(frame * 0.6) * 1.5} face={{ eyes: t > 4 && t < 9 ? 'happy' : 'open', mouth: 'grin', turn: 0.35, blinkAmt: blink(frame, 33) }} />
      <Rider x={himX} spin={frame * 0.32} bob={Math.sin(frame * 0.6 + 1) * 1.5} face={{ eyes: t > 13 && t < 18 ? 'happy' : 'open', mouth: 'grin', turn: -0.2, look: [-6, 0], blinkAmt: blink(frame, 7) }} />
    </Stage>
  );
};

// 184–193 s. Back at the corner. "Same time next week?" This time they mean it.
export const Corner: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { cornerStop: stop, cornerSplit: split } = BEATS;
  const offset = interpolate(frame, [0, stop * FPS], [0, stop * FPS * 8], { extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) * (1 - x) });
  const spin = offset / 30;
  const away = Math.max(0, t - split);
  const samX = 780 - away * away * 140;
  const samTalks = t > stop && t < 4.2;
  const himTalks = t > 4.6 && t < 7.4;
  return (
    <Stage fade={sceneFade(frame, dur, 12, 20)} zoom={tween(frame, 0, 9, 1.1, 1.2)} focus={[920, 600]}>
      <Suburb offset={offset} sunY={600} dusk={0.2} />
      <StreetSign x={920} text={STREET} />
      <Rider
        x={samX}
        spin={t > split ? spin + away * away * 4 : spin + 0.6}
        back
        variant="sam"
        facing={t > split ? -1 : 1}
        face={{ eyes: 'open', mouth: samTalks ? talkMouth(frame, 2) : 'smile', turn: t > stop ? 0.5 : 0.3, blinkAmt: blink(frame, 50) }}
      />
      <Rider
        x={1080}
        spin={spin}
        wave={t > split + 0.3 ? frame : undefined}
        face={{ eyes: t > split ? 'happy' : 'open', mouth: himTalks ? talkMouth(frame, 5) : 'smile', turn: t > stop ? -0.5 : 0.2, look: t > stop ? [-8, 0] : [4, 0], blinkAmt: blink(frame, 11) }}
      />
    </Stage>
  );
};

// 193–200 s. End card.
export const EndCard: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = tween(frame, 0.2, 1.0, 0, 1);
  const b = tween(frame, 0.9, 1.6, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur, 1, 24)}>
      <rect width={1920} height={1080} fill={C.black} />
      <g opacity={a} transform={`translate(0 ${(1 - a) * 12})`}>
        <Head x={880} y={380} scale={0.95} eyes="happy" mouth="smile" />
        <Head x={1045} y={380} scale={0.95} variant="sam" eyes="happy" mouth="grin" />
        <text x={960} y={640} textAnchor="middle" fontFamily={HAND} fontSize={104} letterSpacing="0.12em" fill={C.text}>
          THE M1ND FRAME
        </text>
      </g>
      <text x={960} y={730} textAnchor="middle" fontFamily={HAND} fontSize={50} letterSpacing="0.04em" fill={C.amber} opacity={b}>
        Call them before it's the last time.
      </text>
    </Stage>
  );
};
