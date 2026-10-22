import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, SIT, idle, mixLimb, reachArm, talkMouth, walk } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Calendar, Desk, DESK, Glow, Laptop, Mirror, Papers, Phone, Room, Sink, Stool, WallClock } from '../../../kit/props';
import { Mug, PhoneHands } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { GroupChatScreen } from '../../../kit/props5';
import { GymBag, StickyNote } from '../../../kit/props7';
import { Sketchbook, SketchPage } from '../../../kit/props9';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS, FUTURE_TINT } from '../script';
import { C, FLOOR } from '../../../theme';
import { FeedPhone, InBed, OLD_AT, Older, SitPose, SLUMP_STAND, YOUNG, oldY, youngY } from './shared';

// 0–5 s. THE HOOK. No fade-in. Frame 0: 3:07 AM, his face lit red by the feed, a knock.
// The camera pulls back as the door swings open on a tired man with his face.
export const Hook: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { turn, doorOpen } = BEATS;
  const open = keys(frame, [0, doorOpen, doorOpen + 0.5], [0.06, 0.06, 1]);
  const seen = t > doorOpen + 0.2;
  const pull = tween(frame, doorOpen - 0.1, doorOpen + 0.9, 0, 1);
  const headX = YOUNG.x + 30;
  const headY = youngY - 240 * YOUNG.s;
  return (
    <Stage
      fade={sceneFade(frame, dur, 0, 8)}
      zoom={1.85 - pull * 0.8 + t * 0.01}
      focus={[headX + (1250 - headX) * pull, headY + (540 - headY) * pull]}
    >
      <Bedroom frame={frame} sky="night" clock="03:07" door={open} phoneOnStand={false} beam={0.4}>
        <Older x={OLD_AT.door} y={oldY} scale={OLD_AT.s} facing={-1} pose={idle(frame, SLUMP_STAND, 4)} opacity={open} breathe={frame} turn={0.2} look={[6, 0]} blinkAmt={blink(frame, 50)} />
        <InBed
          breathe={frame}
          pose={SitPose(frame, { armNear: seen ? mixLimb(SitPose(frame).armNear, [30, 60], tween(frame, doorOpen + 0.3, doorOpen + 0.8, 0, 1)) : SitPose(frame).armNear })}
          nearItem={<FeedPhone on={seen ? 0.6 : 0.95} />}
          eyes={seen ? 'wide' : 'tired'}
          brow={seen ? 'raised' : 'none'}
          mouth={seen ? 'o' : 'flat'}
          eyeGlow={C.red}
          look={t > turn ? [14, -2] : [10, 8]}
          turn={0.3}
          blinkAmt={seen ? 1 : blink(frame, 20)}
        />
      </Bedroom>
    </Stage>
  );
};

// 5–15 s. He walks in out of the light and stops at the foot of the bed. Ten years older.
export const Stranger: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [w0, w1] = BEATS.walkIn;
  const walking = t > w0 && t < w1;
  const x = t < w0 ? OLD_AT.door : t < w1 ? OLD_AT.door + ((t - w0) / (w1 - w0)) * (OLD_AT.foot - OLD_AT.door) : OLD_AT.foot;
  const talking = t > 7.2 && t < 9.8;
  return (
    <Stage fade={sceneFade(frame, dur, 0, 10)} zoom={keys(frame, [0, 4, 10], [1.05, 1.22, 1.32])} focus={[1080, 470]} tint={{ ...FUTURE_TINT, opacity: tween(frame, 9.4, 10, 0, FUTURE_TINT.opacity) }}>
      <Bedroom frame={frame} sky="night" clock="03:07" door={1} phoneOnStand={false} beam={0.4}>
        <Older
          x={x}
          y={oldY}
          scale={OLD_AT.s}
          facing={-1}
          pose={walking ? walk(frame, 0.6) : idle(frame, SLUMP_STAND, 4)}
          breathe={frame}
          mouth={talking ? talkMouth(frame, 2) : 'flat'}
          turn={0.25}
          look={[8, 2]}
          blinkAmt={blink(frame, 50)}
        />
        <InBed breathe={frame} pose={SitPose(frame, { armNear: [30, 60], lean: -10 })} nearItem={<FeedPhone on={0.5} />} eyes="wide" brow="raised" mouth="o" look={[14, -4]} turn={0.3} />
      </Bedroom>
    </Stage>
  );
};

const DAY_CYCLE = ['day', 'night', 'day', 'night', 'dawn', 'night', 'day', 'night'] as const;
const CLOCKS = ['14:20', '03:40', '13:05', '04:12', '06:30', '02:55', '15:40', '03:07'];

// 15–28 s. Age 20. Days and nights blur past the window; he never leaves the bed.
// "start monday" on the wall, the gym bag going grey.
export const Tomorrow: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const i = Math.min(DAY_CYCLE.length - 1, Math.floor(t / 1.6));
  const px = BR.headX + 40;
  const py = BR.headY - 150;
  const marks = Array.from({ length: 30 }).map((_, k) => f(1 + k * 0.38));
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.0, 1.1)} focus={[960, 520]} tint={FUTURE_TINT}>
      <Bedroom frame={frame} sky={DAY_CYCLE[i]} clock={CLOCKS[i]} clockColor={DAY_CYCLE[i] === 'night' ? C.red : C.textDim} phoneOnStand={false} lying={{ eyes: 'tired', mouth: 'flat', look: [8, -10], eyeGlow: C.red, blinkAmt: blink(frame, 20) }}>
        <Calendar x={720} y={150} marks={marks} frame={frame} />
        <StickyNote x={1200} y={300} text={['start', 'monday']} scale={0.5} rotate={4} />
        <Phone x={px} y={py} on={0.95} color={C.red} rotate={-8} scale={1.3} />
        <circle cx={px - 30} cy={py + 34} r={20} fill={C.skin} />
        <circle cx={px + 34} cy={py + 30} r={20} fill={C.skin} />
        <GymBag x={1480} dust={tween(frame, 0, 12, 0.2, 1)} />
      </Bedroom>
    </Stage>
  );
};

// 28–40 s. Age 22. The squad keeps asking. "can't, busy". "next time". Then the chat goes quiet.
export const Invites: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const m = BEATS.invites;
  const typing = (k: number) => keys(frame, [m[k] - 1.0, m[k] - 0.9, m[k] - 0.1, m[k]], [0, 1, 1, 0]);
  const typed = typing(2) > 0.5 ? "can't, busy".slice(0, Math.floor((t - (m[2] - 0.9)) * 14)) : typing(4) > 0.5 ? 'next time'.slice(0, Math.floor((t - (m[4] - 0.9)) * 12)) : '';
  const quiet = tween(frame, BEATS.lastSeen, BEATS.lastSeen + 0.6, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.3, 1.36)} focus={[960, 420]} tint={FUTURE_TINT}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={545} h={980}>
        {(sw, sh) => (
          <>
            <GroupChatScreen
              sw={sw}
              sh={sh}
              frame={frame}
              title="the squad"
              members={['sam', 'jay', 'leo', 'him']}
              typed={typed}
              msgs={[
                { who: 'sam', name: 'Sam', text: 'beach saturday?', at: f(m[0]) },
                { who: 'jay', name: 'Jay', text: 'you in??', at: f(m[1]) },
                { who: 'him', name: '', text: "can't, busy", at: f(m[2]), mine: true },
                { who: 'leo', name: 'Leo', text: 'bday drinks friday', at: f(m[3]) },
                { who: 'him', name: '', text: 'next time', at: f(m[4]), mine: true },
                { who: 'sam', name: 'Sam', text: 'ok man', at: f(m[5]) },
              ]}
            />
            <g opacity={quiet}>
              <rect width={sw} height={sh} fill="#07080B" opacity={0.82} />
              <text x={sw / 2} y={sh * 0.36} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={C.text}>
                no new messages
              </text>
              <text x={sw / 2} y={sh * 0.36 + 56} textAnchor="middle" fontFamily={HAND} fontSize={36} fill={C.textDim}>
                in 8 months
              </text>
            </g>
          </>
        )}
      </PhoneShell>
      <PhoneHands x={960} y={545} h={980} thumbY={460 - Math.max(typing(2), typing(4)) * 120 + Math.sin(frame * 1.4) * 10 * Math.max(typing(2), typing(4))} thumbX={-40} />
    </Stage>
  );
};

// 40–52 s. Age 24. The sketchbook on his desk, half a mountain drawn, grey with dust.
// He's on the stool beside it, scrolling. Then close: the phone lying on the unfinished page.
export const Sketch: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const stoolTop = FLOOR - 165;
  const y = sitY(stoolTop, s);
  if (t < 6) {
    return (
      <Stage fade={sceneFade(frame, dur, 12, 0)} zoom={tween(frame, 0, 6, 1.1, 1.4)} focus={[1000, 560]} tint={FUTURE_TINT}>
        <Room wall="#12141A" />
        <Desk x={840} />
        <Sketchbook x={1080} y={DESK.top} p={0.35} dust={0.8} />
        <Stool x={720} top={stoolTop} />
        <Character
          x={720}
          y={y}
          scale={s}
          pose={idle(frame, { ...SIT, legFar: [52, 48], legNear: [46, 44], armNear: [62, 84], armFar: [50, 84], lean: 14, headY: 8 }, 0)}
          nearItem={<FeedPhone />}
          breathe={frame}
          stubble
          eyes="tired"
          mouth="flat"
          look={[8, 8]}
          eyeGlow={C.red}
          blinkAmt={blink(frame, 16)}
        />
      </Stage>
    );
  }
  return (
    <Stage fade={sceneFade(frame, dur, 0, 12)} zoom={tween(frame, 6, 12, 1.0, 1.08)} tint={FUTURE_TINT}>
      <rect width={1920} height={1080} fill={C.furnitureLight} />
      <SketchPage x={960} y={520} p={0.35} scale={2.1} dust={tween(frame, 6, 12, 0.4, 0.8)} rotate={-3} />
      <g transform="translate(1260 760) rotate(-18)">
        <Glow x={0} y={0} r={360} color={C.red} opacity={0.35} />
        <rect x={-110} y={-220} width={220} height={440} rx={34} fill="#0A0B0D" stroke={C.line} strokeWidth={5} />
        <rect x={-96} y={-204} width={192} height={408} rx={24} fill="#3A1418" />
        {[0, 1, 2].map((k) => (
          <rect key={k} x={-80} y={-190 + k * 136} width={160} height={120} rx={12} fill={['#7A2430', '#A3323F', '#5E1F2A'][k]} />
        ))}
      </g>
    </Stage>
  );
};

// 52–64 s. Age 26. An office under flat white light. The clock crawls; the pile grows.
export const Job: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.08;
  const stoolTop = FLOOR - 165;
  const y = sitY(stoolTop, s);
  const body = { x: 720, y, scale: s, lean: 16 };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.12, 1.22)} focus={[960, 520]} tint={FUTURE_TINT}>
      <Room wall="#181B20" />
      <rect x={560} y={110} width={800} height={18} rx={6} fill="#DDE6F0" opacity={0.8} />
      <Glow x={960} y={160} r={700} color="#DDE6F0" opacity={0.18} />
      <WallClock x={1240} y={300} minutes={tween(frame, 0, 12, 540, 1020, (v) => v)} />
      <Desk x={840} />
      <Laptop x={1020} y={DESK.top - 2} on={0.7} />
      <Papers x={1230} y={DESK.top - 2} count={tween(frame, 0, 12, 4, 24)} />
      <Mug x={900} y={DESK.top} />
      <Stool x={720} top={stoolTop} />
      <Character
        x={720}
        y={y}
        scale={s}
        pose={{ ...SIT, legFar: [52, 48], legNear: [46, 44], armNear: reachArm(980 + Math.sin(frame * 1.1) * 6, DESK.top - 10, body), armFar: [50, 70], lean: 16, headY: 10 }}
        breathe={frame}
        stubble
        eyes="tired"
        brow="sad"
        mouth="flat"
        look={[10, 4]}
        eyeGlow={C.screen}
        blinkAmt={blink(frame, 9)}
      />
    </Stage>
  );
};

// 64–78 s. Age 29. 3 AM, the bathroom sink, the feed in his hand. He looks up into the mirror:
// it's the man from the doorway.
export const MirrorScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const x = 760;
  const up = t > BEATS.lookUp;
  const lower = tween(frame, BEATS.lookUp - 0.4, BEATS.lookUp + 0.4, 0, 1);
  const pose = idle(frame, { ...SLUMP_STAND, armNear: mixLimb([64, 96], [10, 30], lower), headY: up ? 0 : 10 }, 0);
  const face = { eyes: (up ? 'open' : 'tired') as 'open' | 'tired', brow: 'sad' as const, mouth: 'flat' as const, look: (up ? [6, -6] : [8, 10]) as [number, number], blinkAmt: blink(frame, 15) };
  return (
    <Stage fade={sceneFade(frame, dur, 12, 10)} zoom={keys(frame, [0, BEATS.lookUp, 9, 14], [1.08, 1.12, 1.6, 1.68])} focus={[1180, 360]} tint={FUTURE_TINT}>
      <Room wall="#14171C" />
      <Mirror x={1010} y={160}>
        <rect width={1920} height={1080} fill="#151820" />
        <Older x={2 * 1030 - x} y={standY(s)} scale={s} facing={-1} pose={pose} {...face} opacity={0.7} />
      </Mirror>
      <Sink x={1200} y={700} />
      <Older x={x} y={standY(s)} scale={s} pose={pose} breathe={frame} nearItem={lower < 0.6 ? <FeedPhone /> : undefined} eyeGlow={up ? undefined : C.red} {...face} />
    </Stage>
  );
};
