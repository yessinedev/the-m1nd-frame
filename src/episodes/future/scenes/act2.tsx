import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, Head, SIT, STAND, idle, mixLimb, reachArm, run, talkMouth, walk } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Desk, DESK, Glow, Lamp, NIGHTSTAND, Phone, Room, Stool, Window } from '../../../kit/props';
import { Park, PhoneHands } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { GroupChatScreen } from '../../../kit/props5';
import { Split } from '../../../kit/props8';
import { Easel, FramedArt, LapBlanket, Sketchbook, SketchPage } from '../../../kit/props9';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS, FUTURE_TINT, PROUD_TEE } from '../script';
import { C, FLOOR } from '../../../theme';
import { FeedPhone, InBed, OLD_AT, Older, SitPose, SLUMP_STAND, YOUNG, oldY, youngY } from './shared';

const youngHead: [number, number] = [YOUNG.x + 30, youngY - 240 * YOUNG.s];
const oldHead: [number, number] = [OLD_AT.foot, oldY - 250 * OLD_AT.s];

// 78–92 s. Back in the room. "Why are you telling me this?" / "Because I can't change it. You still can."
// The camera cuts between their faces.
export const Back: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const youngTalks = t > 0.6 && t < 4.0;
  const oldTalks = (t > 4.6 && t < 8.2) || (t > 8.8 && t < 11.0);
  const onOld = t > 4.3 && t < 13.4;
  const focus = onOld ? oldHead : youngHead;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={onOld ? tween(frame, 4.3, 13.4, 1.7, 1.85) : 1.75} focus={[focus[0] + (onOld ? -60 : 80), focus[1] + 60]}>
      <Bedroom frame={frame} sky="night" clock="03:16" door={1} phoneOnStand={false} beam={0.4}>
        <Older x={OLD_AT.foot} y={oldY} scale={OLD_AT.s} facing={-1} pose={idle(frame, SLUMP_STAND, 4)} breathe={frame} mouth={oldTalks ? talkMouth(frame, 2) : 'flat'} eyes={t > 8.8 ? 'open' : 'tired'} turn={0.25} look={[8, 4]} blinkAmt={blink(frame, 50)} />
        <InBed breathe={frame} pose={SitPose(frame, { armNear: [30, 60] })} nearItem={<FeedPhone on={0.5} />} eyes="open" brow="worried" mouth={youngTalks ? talkMouth(frame, 1) : 'flat'} look={[14, -4]} turn={0.3} blinkAmt={blink(frame, 7)} />
      </Bedroom>
    </Stage>
  );
};

// 92–106 s. The phone buzzes: the feed, still glowing. Heartbeat. He looks at the man at the foot
// of his bed. Then he turns, opens the drawer, puts the phone in, and shuts it.
export const Choice: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [reach, open, putIn, shut] = BEATS.drawer;
  const buzz = keys(frame, [BEATS.buzz, BEATS.buzz + 0.1, BEATS.buzz + 0.8], [0, 1, 0]);
  const turned = t > reach - 0.4;
  const drawer = keys(frame, [open, open + 0.4, putIn + 0.2, shut], [0, 1, 1, 0]);
  const slot = { x: BR.nsX + 100 + drawer * 26, y: FLOOR - NIGHTSTAND.h + 28 };
  const lean = keys(frame, [reach - 0.4, reach, shut, shut + 0.6], [0, 50, 50, 6]);
  const body = { x: YOUNG.x, y: youngY, scale: YOUNG.s, facing: -1 as const, lean };
  const toDrawer = reachArm(slot.x, slot.y - 8, body);
  const held = t < putIn;
  const looksAtOld = t > 5.4 && t < reach - 0.4;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, 2, 5.4, reach, shut + 1, 14], [1.6, 1.75, 1.5, 1.3, 1.3, 1.2])} focus={turned ? [600, 600] : [youngHead[0] + 120, youngHead[1] + 80]}>
      <Bedroom frame={frame} sky="night" clock="03:19" door={1} phoneOnStand={false} beam={0.4} drawer={drawer}>
        <Older x={OLD_AT.foot} y={oldY} scale={OLD_AT.s} facing={-1} pose={idle(frame, { ...SLUMP_STAND, tilt: t > 6.2 && t < 7.2 ? 8 : 0 }, 4)} breathe={frame} eyes="open" turn={0.25} look={[8, 4]} blinkAmt={blink(frame, 50)} />
        {turned ? (
          <>
            <LapBlanket x0={YOUNG.x} x1={BR.bedX + BR.bedW - 4} breathe={frame} />
            <Character
              x={YOUNG.x}
              y={youngY}
              scale={YOUNG.s}
              facing={-1}
              pose={idle(frame, { ...SIT, lean, armNear: mixLimb([30, 60], toDrawer, keys(frame, [reach - 0.4, reach + 0.2, shut, shut + 0.5], [0, 1, 1, 0])) }, 0)}
              nearItem={held ? <FeedPhone /> : undefined}
              breathe={frame}
              eyes="down"
              brow="worried"
              mouth={t > shut + 0.8 ? 'smile' : 'flat'}
              turn={0.3}
              look={[8, 10]}
              blinkAmt={blink(frame, 13)}
            />
          </>
        ) : (
          <InBed
            breathe={frame}
            pose={SitPose(frame)}
            nearItem={<FeedPhone on={0.95 + buzz * 0.05} />}
            eyes={looksAtOld ? 'open' : 'tired'}
            brow={t > 3 ? 'worried' : 'none'}
            mouth="flat"
            eyeGlow={looksAtOld ? undefined : C.red}
            look={looksAtOld ? [16, -6] : [10, 8]}
            turn={0.3}
            blinkAmt={blink(frame, 13)}
          />
        )}
      </Bedroom>
      {buzz > 0 ? <Glow x={youngHead[0] + 140} y={youngHead[1] + 60} r={260} color={C.red} opacity={buzz * 0.5} /> : null}
    </Stage>
  );
};

// 106–118 s. The man in the doorway smiles for the first time, and fades out. The door light goes.
export const Fade: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [v0, v1] = BEATS.vanish;
  const gone = tween(frame, v0, v1, 0, 1);
  const smiling = t > BEATS.smile;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.15, 1.05)} focus={[1000, 520]}>
      <Bedroom frame={frame} sky="night" clock="03:21" door={1 - tween(frame, v1, v1 + 1.2, 0, 1)} phoneOnStand={false} beam={0.4}>
        <Glow x={OLD_AT.foot} y={oldY - 120} r={300} color={C.amber} opacity={Math.sin(gone * Math.PI) * 0.35} />
        <Older
          x={OLD_AT.foot}
          y={oldY}
          scale={OLD_AT.s}
          facing={-1}
          pose={idle(frame, { ...SLUMP_STAND, headY: 8 - gone * 8, lean: 5 - gone * 5 }, 4)}
          breathe={frame}
          eyes={smiling ? 'happy' : 'open'}
          brow="none"
          mouth={smiling ? 'smile' : 'flat'}
          opacity={1 - gone}
          turn={0.25}
        />
        <InBed breathe={frame} pose={SitPose(frame, { armNear: [30, 60] })} eyes={t > v1 ? 'open' : 'wide'} brow={t > v1 ? 'none' : 'raised'} mouth={t > v1 + 1 ? 'smile' : 'o'} look={[14, -4]} turn={0.3} blinkAmt={blink(frame, 7)} />
      </Bedroom>
    </Stage>
  );
};

// 118–130 s. Dawn. Asleep, phone nowhere. He wakes, then he's at the window in the sun.
export const Dawn: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cut = 5.5;
  const dip = keys(frame, [cut - 0.4, cut, cut + 0.4], [1, 0, 1]);
  const s = 1.08;
  const [w0, w1] = BEATS.window;
  const x = t < w0 ? 1000 : t < w1 ? 1000 + ((t - w0) / (w1 - w0)) * 260 : 1260;
  const stretch = tween(frame, w1 + 0.2, w1 + 1.0, 0, 1);
  return (
    <Stage fade={Math.min(sceneFade(frame, dur), dip)} zoom={t < cut ? tween(frame, 0, cut, 1.5, 1.6) : tween(frame, cut, 12, 1.05, 1.12)} focus={t < cut ? [BR.headX + 100, BR.headY - 20] : [1200, 520]}>
      <Bedroom
        frame={frame}
        sky="dawn"
        sunY={tween(frame, 0, 12, 520, 360)}
        clock={t < cut ? '06:12' : '06:20'}
        clockColor={C.textDim}
        phoneOnStand={false}
        beam={1.4}
        lying={t < cut ? { eyes: t > BEATS.rise ? 'open' : 'closed', mouth: t > BEATS.rise ? 'smile' : 'flat', blinkAmt: blink(frame, 9) } : null}
      >
        {t >= cut ? (
          <Character
            x={x}
            y={standY(s)}
            scale={s}
            pose={t > w0 && t < w1 ? walk(frame, 0.7) : idle(frame, { ...STAND, armNear: mixLimb([-4, 10], [170, 20], stretch), armFar: mixLimb([6, 8], [160, 24], stretch) }, 0)}
            handNear={stretch > 0.5 ? 'open' : 'relaxed'}
            handFar={stretch > 0.5 ? 'open' : 'relaxed'}
            breathe={frame}
            eyes={stretch > 0.5 ? 'closed' : 'open'}
            mouth="smile"
            turn={0.3}
            look={[8, -6]}
            blinkAmt={blink(frame, 9)}
          />
        ) : null}
      </Bedroom>
      {t >= cut ? <Glow x={BR.winX + 110} y={BR.winY + 150} r={500} color={C.amber} opacity={0.25} /> : null}
    </Stage>
  );
};

// 130–150 s. Small things, four beats: a run at sunrise, drawing at night, a page filling up,
// and "I'm in."
export const Rebuild: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const parts = BEATS.rebuildParts;
  const part = parts.filter((p) => t >= p).length - 1;
  const local = t - parts[part];
  const dip = Math.min(...parts.slice(1).map((p) => keys(frame, [p - 0.25, p, p + 0.25], [1, 0.2, 1])));
  const s = 1.08;
  let body: React.ReactNode = null;
  if (part === 0) {
    body = (
      <>
        <Park offset={frame * 9} sunY={tween(frame, 0, 5, 600, 520)} light="dawn" />
        <Character x={900} y={standY(s)} scale={s} pose={run(frame, 0.9)} eyes="open" brow="focused" mouth="o" sweat={local > 3} turn={0.3} handNear="fist" handFar="fist" />
      </>
    );
  } else if (part === 1) {
    const stoolTop = FLOOR - 165;
    const y = sitY(stoolTop, s);
    const bodyAt = { x: 720, y, scale: s, lean: 18 };
    body = (
      <>
        <Room wall="#141619" />
        <Desk x={840} />
        <Lamp x={1300} y={DESK.top} on={1} />
        <Sketchbook x={1020} y={DESK.top} p={tween(frame, parts[1], parts[2], 0.05, 0.6)} />
        <Stool x={720} top={stoolTop} />
        <Character
          x={720}
          y={y}
          scale={s}
          pose={{ ...SIT, legFar: [52, 48], legNear: [46, 44], armNear: reachArm(1000 + Math.sin(frame * 0.5) * 30, DESK.top - 30 + Math.cos(frame * 0.7) * 6, bodyAt), armFar: [50, 70], lean: 18, headY: 4 }}
          nearItem={<rect x={-3} y={-30} width={6} height={44} rx={3} fill={C.amber} />}
          breathe={frame}
          eyes="open"
          brow="focused"
          mouth="flat"
          look={[10, 10]}
        />
      </>
    );
  } else if (part === 2) {
    body = (
      <>
        <rect width={1920} height={1080} fill={C.furnitureLight} />
        <Glow x={1300} y={300} r={700} color={C.amber} opacity={0.25} />
        <SketchPage x={1080} y={520} p={tween(frame, parts[2], parts[3] - 0.3, 0, 1)} scale={1.9} rotate={2} />
        {[0, 1, 2].map((k) => (
          <rect key={k} x={180 + k * 10} y={360 - k * 12} width={360} height={290} rx={6} fill="#E9E3D6" stroke="#BDB5A7" strokeWidth={3} transform={`rotate(${-8 + k * 3} 360 500)`} />
        ))}
      </>
    );
  } else {
    const [c0, c1, c2] = BEATS.chatIn;
    const at = (k: number) => f(parts[3] + k);
    body = (
      <>
        <rect width={1920} height={1080} fill="#0B0C10" />
        <PhoneShell x={960} y={545} h={980}>
          {(sw, sh) => (
            <GroupChatScreen
              sw={sw}
              sh={sh}
              frame={frame}
              title="the squad"
              members={['sam', 'jay', 'leo', 'him']}
              msgs={[
                { who: 'sam', name: 'Sam', text: 'beach saturday?', at: at(c0) },
                { who: 'jay', name: 'Jay', text: "he won't come lol", at: at(c1) },
                { who: 'him', name: '', text: "I'm in.", at: at(c2), mine: true },
              ]}
            />
          )}
        </PhoneShell>
        <PhoneHands x={960} y={545} h={980} thumbY={460 - keys(frame, [parts[3] + c2 - 1, parts[3] + c2 - 0.8, parts[3] + c2], [0, 1, 0]) * 120} thumbX={-40} />
      </>
    );
  }
  return (
    <Stage fade={Math.min(sceneFade(frame, dur), dip)} zoom={(part === 3 ? 1.3 : 1.06) + local * 0.012} focus={part === 3 ? [960, 420] : [960, 540]}>
      {body}
    </Stage>
  );
};

// The studio at 29, the way it goes if he stops: sun, drawings on the walls, an easel.
const Studio: React.FC<{ frame: number; paint: number; turnAt?: number }> = ({ frame, paint, turnAt = 99 }) => {
  const t = frame / FPS;
  const s = 1.08;
  const turned = t > turnAt;
  const brush = reachArm(1130 + Math.sin(frame * 0.4) * 30, FLOOR - 430 + Math.cos(frame * 0.3) * 40, { x: 980, y: standY(s), scale: s, lean: 4 });
  return (
    <g>
      <Room wall="#24201B" />
      <Window x={240} y={170} w={300} h={360} sky="day" sunY={300} />
      <Glow x={390} y={350} r={700} color={C.amber} opacity={0.22} />
      <FramedArt x={720} y={300} seed={0} />
      <FramedArt x={1500} y={260} w={240} h={180} seed={1} />
      <FramedArt x={1700} y={460} w={160} h={130} seed={2} />
      <Easel x={1250} p={paint} />
      <Character
        x={980}
        y={standY(s)}
        scale={s}
        facing={1}
        tee={PROUD_TEE}
        pose={idle(frame, { ...STAND, armNear: turned ? [-4, 10] : brush, lean: 4 }, 0)}
        nearItem={turned ? undefined : <rect x={-3} y={-34} width={6} height={50} rx={3} fill="#5A4630" />}
        breathe={frame}
        stubble
        eyes={turned ? 'happy' : 'open'}
        brow={turned ? 'none' : 'focused'}
        mouth={turned ? 'grin' : 'flat'}
        turn={turned ? -0.3 : 0.3}
        look={turned ? [-10, 0] : [12, -4]}
        blinkAmt={blink(frame, 11)}
      />
    </g>
  );
};

// 150–172 s. Ten years later. Same face, different man: painting in a sunlit studio.
// Sam comes in; they laugh.
export const Later: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const samIn = 14;
  const samX = t < samIn ? -200 : Math.min(700, -200 + (t - samIn) * 450);
  const laugh = t > 17;
  return (
    <Stage fade={sceneFade(frame, dur, 14, 12)} zoom={keys(frame, [0, 10, 14, 22], [1.4, 1.25, 1.12, 1.08])} focus={[1080, 520]}>
      <Studio frame={frame} paint={tween(frame, 0, 12, 0.5, 1)} turnAt={samIn + 1.2} />
      <Character
        x={samX}
        y={standY(s)}
        scale={s}
        variant="sam"
        pose={samX < 700 ? walk(frame, 0.8) : idle(frame, { ...STAND, armNear: laugh ? [150, 30] : [-4, 10] }, 2)}
        handNear={laugh ? 'open' : 'relaxed'}
        eyes={laugh ? 'happy' : 'open'}
        mouth={laugh ? 'grin' : talkMouth(frame, 3)}
        turn={0.3}
      />
    </Stage>
  );
};

// 172–194 s. Both men he could be at 29, side by side. The tired one goes dark.
export const Final: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const off = tween(frame, BEATS.scrollsOff, BEATS.scrollsOff + 1.4, 0, 1);
  const px = BR.headX + 40;
  const py = BR.headY - 150;
  const tired = (
    <g>
      <Bedroom frame={frame} sky="night" clock="03:07" phoneOnStand={false} lying={{ eyes: 'tired', mouth: 'flat', look: [8, -10], eyeGlow: C.red, stubble: true, blinkAmt: blink(frame, 20) }}>
        <Phone x={px} y={py} on={0.95} color={C.red} rotate={-8} scale={1.3} />
        <circle cx={px - 30} cy={py + 34} r={20} fill={C.skin} />
        <circle cx={px + 34} cy={py + 30} r={20} fill={C.skin} />
      </Bedroom>
      <rect width={1920} height={1080} fill={FUTURE_TINT.color} opacity={0.25} />
      <rect width={1920} height={1080} fill="#030304" opacity={off * 0.94} />
    </g>
  );
  return (
    <Stage fade={sceneFade(frame, dur, 12, 18)} zoom={tween(frame, 0, 22, 1.0, 1.04)}>
      <Split left={tired} right={<Studio frame={frame} paint={1} turnAt={6} />} labels={['IF HE KEPT SCROLLING', 'IF HE PUT IT DOWN']} focus={[[BR.headX + 120, BR.headY - 40], [1060, 560]]} zoom={[1.45, 1.0]} />
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
        <Head x={880} y={380} scale={0.92} eyes="open" mouth="smile" />
        <Head x={1040} y={380} scale={0.92} stubble eyes="happy" mouth="smile" />
        <text x={960} y={640} textAnchor="middle" fontFamily={HAND} fontSize={104} letterSpacing="0.12em" fill={C.text}>
          THE M1ND FRAME
        </text>
      </g>
      <text x={960} y={730} textAnchor="middle" fontFamily={HAND} fontSize={50} letterSpacing="0.04em" fill={C.amber} opacity={b}>
        Put it down tonight.
      </text>
    </Stage>
  );
};
