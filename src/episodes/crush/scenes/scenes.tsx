import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, Head, Pose, SIT, STAND, idle, mixLimb, reachArm, talkMouth, walk } from '../../../kit/Character';
import { SceneProps, sitY, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Calendar, Desk, DESK, Glow, Laptop, Papers, Phone, Room, Starfield, Stool } from '../../../kit/props';
import { Bird, Chair, CHAIR, Park, PhoneHands } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { CafeTable } from '../../../kit/props4';
import { Suburb } from '../../../kit/bike';
import { AnalyseChat, BookStack, Cafe, CAFE, GymBag, Library, StatusScreen, StickyNote, ThoughtCloud } from '../../../kit/props7';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS, HER } from '../script';
import { C, FLOOR } from '../../../theme';

const wave = (frame: number): Pose['armFar'] => [206 + Math.sin(frame * 0.5) * 12, 18];

// 0–7 s.
export const ColdOpen: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 20, 14)} zoom={tween(frame, 0, 7, 1.04, 1)}>
      <Starfield frame={frame} opacity={0.7} />
    </Stage>
  );
};

const studyDesk = (frame: number, eyes: 'open' | 'wide' | 'down' | 'happy', mouth: 'flat' | 'o' | 'smile' | 'grin', look: [number, number], upsideDown = false, armNear?: Pose['armNear']) => {
  const s = 1.1;
  const stoolTop = FLOOR - 165;
  return (
    <>
      <Desk x={840} />
      <BookStack x={1000} y={DESK.top - 2} upsideDown={upsideDown} />
      <Stool x={720} top={stoolTop} />
      <Character
        x={720}
        y={sitY(stoolTop, s)}
        scale={s}
        pose={idle(frame, { ...SIT, legFar: [52, 48], legNear: [46, 44], armNear: armNear ?? [40, 80], armFar: [44, 76], lean: 8 }, 0)}
        breathe={frame}
        eyes={eyes}
        mouth={mouth}
        look={look}
        turn={0.3}
        blinkAmt={blink(frame, 25)}
      />
    </>
  );
};

// 7–19 s. Library. She walks past and says hi. He freezes; waves back after she's gone.
export const LibraryScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const herX = 1700 - t * 150;
  const saying = t > BEATS.hi - 0.2 && t < BEATS.hi + 1.2;
  const late = t > 4.6 && t < 6.4;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.12, 1.2)} focus={[960, 540]}>
      <Library />
      <Character
        x={herX}
        y={standY(s) - 20}
        scale={s * 0.95}
        facing={-1}
        variant={HER.variant}
        pose={{ ...walk(frame, 0.8), ...(saying ? { armFar: wave(frame) } : {}) }}
        handFar={saying ? 'open' : 'relaxed'}
        eyes="happy"
        mouth={saying ? 'open' : 'smile'}
        turn={saying ? -0.5 : 0.1}
        hairSwing={Math.sin(frame * 0.32) * 3}
      />
      {studyDesk(frame, t > BEATS.hi && t < 4.6 ? 'wide' : 'open', t > BEATS.hi && t < 4.6 ? 'o' : t > 7 ? 'smile' : 'flat', t > BEATS.hi ? [-10, -2] : [8, 6], false, late ? [150, 30] : undefined)}
    </Stage>
  );
};

// 19–31 s. Daydream: in the thought cloud he's smooth. Pop. Book upside down.
export const Daydream: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const open = t < BEATS.pop ? tween(frame, 0.6, 1.4, 0, 1) : tween(frame, BEATS.pop, BEATS.pop + 0.15, 1, 0);
  const after = t > BEATS.pop;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.06)} focus={[960, 500]}>
      <Library />
      {studyDesk(frame, after ? 'open' : 'happy', after ? 'flat' : 'smile', after ? [6, 0] : [4, -10], after)}
      <ThoughtCloud x={820} y={420} w={760} h={280} open={open}>
        <g transform="scale(0.4) translate(-150 -200)">
          <Park offset={frame * 3} sunY={560} />
          <Character x={850} y={standY(1)} pose={walk(frame, 0.8)} eyes="happy" mouth="grin" turn={0.3} blush={0.4} />
          <Character x={1060} y={standY(0.95)} scale={0.95} facing={-1} variant={HER.variant} pose={walk(frame + 6, 0.8)} eyes="happy" mouth="grin" blush={0.6} hairSwing={Math.sin(frame * 0.3) * 3} />
        </g>
      </ThoughtCloud>
    </Stage>
  );
};

const STATUSES = ['last seen 2 min ago', 'online', 'last seen just now', 'online', 'last seen 1 min ago', 'online', 'last seen just now', 'online'];

// 31–44 s. Close-up: her profile. Refresh. Refresh. Refresh.
export const Status: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = BEATS.refresh.filter((r) => t >= r).length;
  const refresh = BEATS.refresh.reduce((m, r) => Math.max(m, keys(frame, [r - 0.3, r, r + 0.4], [0, 1, 0])), 0);
  const status = idx === 0 ? 'last seen 5 min ago' : STATUSES[(idx - 1) % STATUSES.length];
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.0, 1.08)}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000}>
        {(sw, sh) => <StatusScreen sw={sw} sh={sh} frame={frame} status={status} online={status === 'online'} refresh={refresh} variant={HER.variant} name={HER.name} />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={120 + refresh * 160} thumbX={-60} />
    </Stage>
  );
};

// 44–56 s. Close-up: "haha yeah see u tmrw". What did she MEAN by haha?
export const Analyse: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const highlight = tween(frame, BEATS.highlight, BEATS.highlight + 0.4, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, BEATS.highlight, 12], [1.0, 1.0, 1.3])} focus={[960, 360]}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000}>
        {(sw, sh) => (
          <AnalyseChat
            sw={sw}
            sh={sh}
            frame={frame}
            name={HER.name}
            variant={HER.variant}
            status="online"
            msgs={[
              { from: 'me', text: 'good luck on the test tmrw!' },
              { from: 'them', text: 'haha yeah see u tmrw' },
            ]}
            highlight={highlight}
          />
        )}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={330} thumbX={-40} />
    </Stage>
  );
};

const Storefront: React.FC<{ x: number; empty?: boolean }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={0} y={FLOOR - 420} width={520} height={380} fill="#2A221C" stroke={C.line} strokeWidth={4} />
    <rect x={30} y={FLOOR - 340} width={300} height={220} fill="#5A4630" />
    <Glow x={180} y={FLOOR - 230} r={220} color={C.amber} opacity={0.35} />
    <rect x={360} y={FLOOR - 340} width={130} height={300} fill="#3A2F26" stroke={C.line} strokeWidth={3} />
    <rect x={60} y={FLOOR - 400} width={240} height={46} rx={8} fill="#1A1512" />
    <text x={180} y={FLOOR - 366} textAnchor="middle" fontFamily={HAND} fontSize={34} letterSpacing="0.1em" fill="#E9D7B0">
      CAFÉ
    </text>
  </g>
);

// 56–68 s. The long way round, past her café. She isn't there. He lingers anyway.
export const Route: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const stop = 5.6;
  const off = Math.min(t, stop) * 150;
  const moving = t < stop;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.06, 1.16)} focus={[900, 560]}>
      <Suburb offset={off} sunY={260} />
      <Storefront x={1500 - off} />
      <Character
        x={900}
        y={standY(s)}
        scale={s}
        pose={moving ? walk(frame, 0.8) : idle(frame, STAND, 0)}
        breathe={frame}
        eyes={moving ? 'open' : 'down'}
        brow={t > stop + 1 ? 'sad' : 'none'}
        mouth="flat"
        turn={0.4}
        look={[10, 0]}
        blinkAmt={blink(frame, 13)}
      />
    </Stage>
  );
};

// 68–82 s. On the bed, phone over his face. Gym bag gathering dust. Papers piling up.
export const Slipping: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const px = BR.headX + 40;
  const py = BR.headY - 150;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.0, 1.1)} focus={[900, 600]}>
      <Bedroom frame={frame} sky="day" clock="4:20" clockColor={C.textDim} phoneOnStand={false} lying={{ eyes: 'tired', mouth: 'flat', look: [8, -10], eyeGlow: C.screen, blinkAmt: blink(frame, 20) }}>
        <Papers x={BR.nsX + 100} y={FLOOR - 152} count={tween(frame, 0, 14, 6, 20)} />
        <Phone x={px} y={py} on={0.95} rotate={-8} scale={1.3} />
        <circle cx={px - 30} cy={py + 34} r={20} fill={C.skin} />
        <circle cx={px + 34} cy={py + 30} r={20} fill={C.skin} />
        <GymBag x={1480} dust={tween(frame, 0, 14, 0.4, 1)} />
      </Bedroom>
    </Stage>
  );
};

// 82–96 s. Café with Sam and Jay. He's on his phone. Sam waves a hand in front of his face.
export const Friends: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const y = sitY(CHAIR.seat, s);
  const himX = 760;
  const samX = 1160;
  const waveT = keys(frame, [6.0, 6.5, 8.2, 8.7], [0, 1, 1, 0]);
  const faceTarget = reachArm(himX + 120 + Math.sin(frame * 0.6) * 20, y - 220 * s, { x: samX, y, scale: s, facing: -1, lean: 18 * waveT });
  const laugh = t > 2 && t < 4;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.12, 1.2)} focus={[960, 540]}>
      <Room wall="#1C1915" />
      <Glow x={960} y={300} r={600} color={C.amber} opacity={0.15} />
      <Chair x={750} facing={1} />
      <Chair x={1170} facing={-1} />
      <Character x={960} y={standY(s) - 30} scale={s * 0.92} variant="jay" facing={-1} pose={idle(frame, STAND, 3)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 5)} turn={0.2} />
      <Character
        x={himX}
        y={y}
        scale={s}
        pose={idle(frame, { ...SIT, armNear: [62, 84], armFar: [50, 84], lean: 14, headY: 6 }, 0)}
        nearItem={<Phone x={4} y={-22} on={0.9} rotate={-12} scale={0.95} />}
        breathe={frame}
        eyes="down"
        mouth="flat"
        look={[8, 8]}
        eyeGlow={C.screen}
        turn={waveT > 0.5 ? 0.3 : 0.1}
        blinkAmt={blink(frame, 16)}
      />
      <Character
        x={samX}
        y={y}
        scale={s}
        facing={-1}
        variant="sam"
        pose={idle(frame, { ...SIT, armNear: mixLimb([40, 70], faceTarget, waveT), lean: 18 * waveT }, 2)}
        handNear={waveT > 0.5 ? 'open' : 'relaxed'}
        breathe={frame + 6}
        eyes={laugh ? 'happy' : 'open'}
        brow={waveT > 0.5 ? 'raised' : 'none'}
        mouth={waveT > 0.5 ? 'open' : laugh ? 'grin' : talkMouth(frame, 1)}
        turn={0.3}
      />
      <CafeTable x={960} />
    </Stage>
  );
};

// 96–110 s. 2 AM. "typing…" — then nothing.
export const Typing: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [on, off] = BEATS.typingOn;
  const typing = t > on && t < off;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.0, 1.08)}>
      <rect width={1920} height={1080} fill="#08090C" />
      <PhoneShell x={960} y={560} h={1000}>
        {(sw, sh) => (
          <AnalyseChat
            sw={sw}
            sh={sh}
            frame={frame}
            name={HER.name}
            variant={HER.variant}
            status={t > off ? 'last seen 1:58 AM' : 'online'}
            typing={typing}
            msgs={[
              { from: 'them', text: 'haha yeah see u tmrw' },
              { from: 'me', text: 'how did the test go?' },
            ]}
          />
        )}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={330} thumbX={-40} />
      <text x={1540} y={160} textAnchor="middle" fontFamily={HAND} fontSize={70} fill={C.textDim}>
        2:14
      </text>
    </Stage>
  );
};

// 110–124 s. The calendar: 94 days of a maybe.
export const Realize: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const marks = Array.from({ length: 35 }).map((_, i) => f(BEATS.calendar + i * 0.08));
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.06, 1.16)} focus={[900, 520]}>
      <Room />
      <Calendar x={560} y={260} marks={marks} frame={frame} />
      <text x={750} y={240} textAnchor="middle" fontFamily={HAND} fontSize={40} fill={C.textDim} opacity={tween(frame, 3.6, 4.4, 0, 1)}>
        + 2 more months
      </text>
      <Character
        x={1160}
        y={standY(s)}
        scale={s}
        facing={-1}
        pose={idle(frame, { ...STAND, armNear: t > 6 ? [-4, 10] : [62, 84] }, 0)}
        nearItem={t > 6 ? undefined : <Phone x={4} y={-22} on={0.6} rotate={-12} scale={0.95} />}
        breathe={frame}
        eyes={t > 6 ? 'open' : 'tired'}
        brow={t > 6 ? 'sad' : 'none'}
        mouth="flat"
        turn={0.2}
        look={[6, -4]}
        blinkAmt={blink(frame, 19)}
      />
    </Stage>
  );
};

// 124–134 s. Phone face down. A sticky note: "ask her. then let it go."
export const Decide: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const [n0, n1] = BEATS.note;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 10, 1.0, 1.08)} focus={[960, 520]}>
      <rect width={1920} height={1080} fill="#16151A" />
      <rect y={640} width={1920} height={440} fill={C.wood} />
      <line x1={0} x2={1920} y1={640} y2={640} stroke={C.line} strokeWidth={4} />
      <g transform="translate(560 760)">
        <rect x={-150} y={-90} width={300} height={180} rx={34} fill="#1A1B20" stroke={C.line} strokeWidth={4} />
        <circle cx={-96} cy={-40} r={16} fill="#0E0F12" stroke={C.line} strokeWidth={3} />
      </g>
      <StickyNote x={1180} y={460} text={['ask her.', 'then let it go.']} scale={1.5} reveal={tween(frame, n0, n1, 0, 1)} />
    </Stage>
  );
};

// 134–148 s. The café. She's at the counter. He walks up. "Want to get coffee sometime?"
export const Approach: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const [w0, w1] = BEATS.walkIn;
  const walking = t > w0 && t < w1;
  const x = t < w0 ? 300 : t < w1 ? 300 + ((t - w0) / (w1 - w0)) * 720 : 1020;
  const herTurn = t > w1 + 0.6;
  const asking = t > BEATS.ask && t < BEATS.ask + 5.4;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.06, 1.24)} focus={[1100, 540]}>
      <Cafe frame={frame} />
      <Character
        x={1250}
        y={standY(s * 0.95)}
        scale={s * 0.95}
        facing={herTurn ? -1 : 1}
        variant={HER.variant}
        pose={idle(frame, STAND, 2)}
        eyes="open"
        brow={herTurn ? 'raised' : 'none'}
        mouth="smile"
        turn={0.25}
        blinkAmt={blink(frame, 33)}
      />
      <Character
        x={x}
        y={standY(s)}
        scale={s}
        pose={walking ? walk(frame, 0.8) : idle(frame, { ...STAND, armNear: t > BEATS.ask - 1 && t < BEATS.ask + 1.4 ? [160, 120] : [-4, 10] }, 0)}
        breathe={frame}
        eyes="open"
        brow={asking ? 'worried' : 'none'}
        mouth={asking ? talkMouth(frame, 2) : 'flat'}
        sweat={t > w1}
        turn={0.3}
        blinkAmt={blink(frame, 11)}
      />
      <rect x={CAFE.counterX + 360} y={CAFE.counterTop - 60} width={40} height={44} rx={6} fill="#D9D4C9" />
    </Stage>
  );
};

// 148–160 s. Her answer. Kind. His answer. Graceful. Both smile.
export const Answer: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.15;
  const [h0, h1] = BEATS.herTalk;
  const [m0, m1] = BEATS.himTalk;
  const herTalks = t > h0 && t < h1;
  const himTalks = t > m0 && t < m1;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.3, 1.4)} focus={[1130, 480]}>
      <Cafe frame={frame} />
      <Character
        x={1250}
        y={standY(s * 0.95)}
        scale={s * 0.95}
        facing={-1}
        variant={HER.variant}
        pose={idle(frame, { ...STAND, tilt: herTalks ? 4 : 0 }, 2)}
        eyes={t > m1 ? 'happy' : 'open'}
        brow={herTalks ? 'sad' : 'none'}
        mouth={herTalks ? talkMouth(frame, 4) : 'smile'}
        turn={0.25}
        blinkAmt={blink(frame, 33)}
      />
      <Character
        x={1020}
        y={standY(s)}
        scale={s}
        pose={idle(frame, { ...STAND, tilt: himTalks ? -3 : 0 }, 0)}
        breathe={frame}
        eyes={t > h1 && t < m0 ? 'down' : t > m1 ? 'happy' : 'open'}
        brow={t > h1 - 1 && t < m0 + 0.6 ? 'sad' : 'none'}
        mouth={himTalks ? talkMouth(frame, 1) : t > m1 ? 'smile' : t > h1 ? 'flat' : 'o'}
        turn={0.3}
        blinkAmt={blink(frame, 11)}
      />
    </Stage>
  );
};

// 160–172 s. Out into the sun. A deep breath. Lighter.
export const WalkOut: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const breath = t > 1.0 && t < 3.0 ? Math.sin(((t - 1.0) * Math.PI) / 2) * -8 : 0;
  const walking = t > 3.2;
  const pose = walking ? walk(frame, 0.85) : idle(frame, STAND, 0);
  const birds = [0, 1, 2].map((i) => ({ x: 360 + frame * (3 + i * 0.6) + i * 140, y: 250 + i * 40 + Math.sin(frame * 0.05 + i) * 10, flap: Math.sin(frame * 0.5 + i * 2) }));
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.08, 1.0)}>
      <Park offset={walking ? (t - 3.2) * 100 : 0} sunY={440} />
      {birds.map((b, i) => (
        <Bird key={i} x={b.x} y={b.y} flap={b.flap} s={1.2} />
      ))}
      <Character
        x={900}
        y={standY(s) + breath}
        scale={s}
        pose={{ ...pose, armNear: [pose.armNear[0] * 0.4 - 6, 24], armFar: [pose.armFar[0] * 0.4 - 6, 24] }}
        handNear="fist"
        handFar="fist"
        eyes={t > 1 && t < 3 ? 'closed' : 'open'}
        mouth={t > 3 ? 'smile' : 'flat'}
        look={[4, -10]}
        turn={0.2}
        blinkAmt={blink(frame, 6)}
      />
    </Stage>
  );
};

// 172–186 s. His life, back: gym, assignments, friends (phone face down).
export const LifeBack: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const part = t < 4.7 ? 0 : t < 9.4 ? 1 : 2;
  const curl = Math.max(0, Math.sin(frame * 0.2));
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={1.08} focus={[960, 540]}>
      {part === 0 ? (
        <>
          <Room wall="#141619" />
          <GymBag x={500} />
          <Character
            x={960}
            y={standY(s)}
            scale={s}
            pose={idle(frame, { ...STAND, armNear: [30 + curl * 40, 30 + curl * 110] }, 0)}
            handNear="fist"
            nearItem={
              <g transform="translate(0 6)">
                <rect x={-50} y={-6} width={100} height={12} rx={4} fill="#5A606C" />
                <rect x={-62} y={-20} width={20} height={40} rx={4} fill="#2A2E36" />
                <rect x={42} y={-20} width={20} height={40} rx={4} fill="#2A2E36" />
              </g>
            }
            breathe={frame}
            eyes="open"
            brow="focused"
            mouth="flat"
            turn={0.3}
          />
        </>
      ) : null}
      {part === 1 ? (
        <>
          <Room wall="#0F1115" />
          <Desk x={840} />
          <Laptop x={1020} y={DESK.top - 2} on={0.8} />
          <Stool x={720} top={FLOOR - 165} />
          <Character
            x={720}
            y={sitY(FLOOR - 165, s)}
            scale={s}
            pose={{ ...SIT, legFar: [52, 48], legNear: [46, 44], armNear: reachArm(980 + Math.sin(frame * 1.2) * 8, DESK.top - 10, { x: 720, y: sitY(FLOOR - 165, s), scale: s, lean: 10 }), armFar: [50, 70], lean: 10 }}
            breathe={frame}
            eyes="open"
            brow="focused"
            mouth="flat"
            look={[10, 2]}
            eyeGlow={C.screen}
          />
          <text x={1230} y={DESK.top - 60} fontFamily={HAND} fontSize={40} fill={C.amber} opacity={tween(frame, 7.6, 8.2, 0, 1)}>
            SUBMITTED
          </text>
        </>
      ) : null}
      {part === 2 ? (
        <>
          <Room wall="#1C1915" />
          <Glow x={960} y={300} r={600} color={C.amber} opacity={0.18} />
          <Chair x={750} facing={1} />
          <Chair x={1170} facing={-1} />
          <Character x={760} y={sitY(CHAIR.seat, s)} scale={s} pose={idle(frame, { ...SIT, armNear: [40, 70] }, 0)} eyes="happy" mouth="grin" turn={0.35} />
          <Character x={1160} y={sitY(CHAIR.seat, s)} scale={s} facing={-1} variant="sam" pose={idle(frame, { ...SIT, armNear: [60 + Math.sin(frame * 0.2) * 14, 70] }, 2)} handNear="open" eyes="happy" mouth="grin" turn={0.35} />
          <CafeTable x={960} />
          <g transform={`translate(900 ${FLOOR - 254})`}>
            <rect x={-30} y={-6} width={60} height={10} rx={4} fill="#1A1B20" stroke={C.line} strokeWidth={2} />
          </g>
        </>
      ) : null}
    </Stage>
  );
};

// 186–194 s. Sunset walk with the guys. Phone in his pocket.
export const Final: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.04;
  const laugh = t > 2 && t < 4;
  return (
    <Stage fade={sceneFade(frame, dur, 12, 18)} zoom={tween(frame, 0, 8, 1.06, 1.0)}>
      <Park offset={frame * 3.2} sunY={tween(frame, 0, 8, 560, 600)} />
      <Character x={700} y={standY(s * 0.97)} scale={s * 0.97} variant="jay" pose={walk(frame + 9, 0.85)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 3)} turn={0.4} />
      <Character x={880} y={standY(s * 0.98)} scale={s * 0.98} variant="sam" pose={walk(frame + 4, 0.85)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : 'smile'} turn={0.4} />
      <Character x={1070} y={standY(s)} scale={s} pose={walk(frame, 0.85)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : 'smile'} turn={-0.2} look={[-6, 0]} />
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
        Ask. Then live.
      </text>
    </Stage>
  );
};
