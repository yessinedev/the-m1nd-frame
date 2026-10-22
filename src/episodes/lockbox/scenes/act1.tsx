import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, SIT, STAND, idle, mixLimb, reachArm, talkMouth } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Bench, BENCH_SEAT, Glow, Phone, Room, Street, StreetLamp, WallClock } from '../../../kit/props';
import { Chair, CHAIR, CloseHand, Mug, Park, PhoneHands, Sofa, SOFA, WindowCity } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { CafeTable } from '../../../kit/props4';
import { DrawerCloseUp, OpenBook, ScreenTimeScreen } from '../../../kit/props11';
import { HAND } from '../../../fonts';
import { FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';

// The phone from above: a dark slab, its screen lit red with two notifications.
export const TopPhone: React.FC<{ x: number; y: number; on: number; rotate?: number; scale?: number }> = ({ x, y, on, rotate = 0, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <Glow x={0} y={0} r={260} color={C.red} opacity={on * 0.5} />
    <rect x={-74} y={-150} width={148} height={300} rx={26} fill="#0A0B0D" stroke={C.line} strokeWidth={4} />
    <rect x={-64} y={-140} width={128} height={280} rx={18} fill="#3A1418" opacity={on} />
    {[0, 1].map((k) => (
      <rect key={k} x={-56} y={-110 + k * 52} width={112} height={40} rx={10} fill="#E9E6DF" opacity={on * 0.9} />
    ))}
    <rect x={-56} y={-2} width={112} height={120} rx={12} fill="#A3323F" opacity={on * 0.8} />
  </g>
);

// 0–5 s. THE HOOK. No fade-in. Frame 0: his hand over the open drawer, the phone still lit, a ping.
// He lets go. The drawer slides shut. The key turns: click.
export const Hook: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { drop, shut, key } = BEATS;
  const open = keys(frame, [0, drop + 0.25, shut], [1, 1, 0]);
  const fall = tween(frame, drop, drop + 0.25, 0, 1);
  const landed = t > drop + 0.25;
  const turn = tween(frame, key - 0.3, key, 0, 1);
  const handAway = tween(frame, drop + 0.1, drop + 0.6, 0, 1);
  const handKey = keys(frame, [shut, shut + 0.3, key + 0.3, key + 0.7], [0, 1, 1, 0]);
  const kick = keys(frame, [key, key + 0.05, key + 0.25], [0, 1, 0]);
  return (
    <Stage fade={sceneFade(frame, dur, 0, 8)} zoom={tween(frame, 0, 5, 1.0, 1.1)} focus={[960, 600]} shake={[0, kick * 6]}>
      <DrawerCloseUp open={open} keyTurn={turn}>
        {landed ? <TopPhone x={960} y={520 + 300 * open * 0.55} on={0.9} rotate={-6} scale={0.85} /> : null}
      </DrawerCloseUp>
      {!landed ? <TopPhone x={960 + fall * 10} y={380 + fall * 280} on={0.95} rotate={-10 + fall * 4} scale={1 - fall * 0.15} /> : null}
      {handAway < 1 ? <CloseHand x={1080 + handAway * 200} y={(t < drop ? 380 : 380 - handAway * 500) + Math.sin(frame * 0.3) * 3} scale={1.3} sleeve={C.hoodie} sleeveShade={C.hoodieShade} /> : null}
      {handKey > 0 ? (
        <g transform={`translate(${960 + (1 - handKey) * 300} ${650 + (1 - handKey) * 200}) rotate(${turn * 30})`}>
          <CloseHand x={60} y={90} scale={0.9} sleeve={C.hoodie} sleeveShade={C.hoodieShade} />
        </g>
      ) : null}
    </Stage>
  );
};

// 5–13 s. The night before: his weekly screen-time report. 11h 4m.
export const Why: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 6, 10)} zoom={tween(frame, 0, 8, 1.2, 1.32)} focus={[960, 420]}>
      <rect width={1920} height={1080} fill="#07080B" />
      <PhoneShell x={960} y={545} h={980} glow={C.red}>
        {(sw, sh) => <ScreenTimeScreen sw={sw} sh={sh} p={tween(frame, 0.4, 3.4, 0, 1)} />}
      </PhoneShell>
      <PhoneHands x={960} y={545} h={980} thumbY={470} thumbX={-40} />
    </Stage>
  );
};

// 13–25 s. Day 1, on the couch. His hand keeps going to the empty pocket. Bzz? Nothing.
export const Reach: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const x = 980;
  const y = sitY(SOFA.seat, s);
  const reach = BEATS.reaches.reduce((m, r) => Math.max(m, keys(frame, [r - 0.3, r, r + 0.4, r + 0.7], [0, 1, 1, 0])), 0);
  const pocket = reachArm(x + 50, y - 6, { x, y, scale: s, lean: 6 });
  const phantom = [BEATS.reaches[3], BEATS.reaches[7]].reduce((m, r) => Math.max(m, keys(frame, [r - 0.6, r - 0.4, r, r + 0.2], [0, 1, 1, 0])), 0);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.2, 1.32)} focus={[1000, 560]}>
      <Room wall="#16181D" />
      <WindowCity x={1350} y={230} night={false} />
      <Sofa x={700} />
      <Character
        x={x}
        y={y}
        scale={s}
        pose={idle(frame, { ...SIT, armNear: mixLimb([30, 50], pocket, reach), armFar: [34, 50], lean: 6 + reach * 6 }, 0)}
        handNear={reach > 0.5 ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={reach > 0.5 ? 'down' : 'open'}
        brow={t > 6 ? 'worried' : 'none'}
        mouth="flat"
        look={reach > 0.5 ? [8, 12] : [10, 0]}
        turn={0.3}
        blinkAmt={blink(frame, 14)}
      />
      {phantom > 0 ? (
        <text x={x + 110} y={y - 30} fontFamily={HAND} fontSize={44} fill={C.red} opacity={phantom} transform={`rotate(${wobble(frame, 1, 2) * 4} ${x + 110} ${y - 30})`}>
          bzz?
        </text>
      ) : null}
    </Stage>
  );
};

// 25–37 s. Day 3, the bus stop. Everyone on the bench is lit red, heads down. He has nothing.
// He looks around. Foot tapping.
export const Bored: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.04;
  const y = sitY(BENCH_SEAT, s);
  const lookAround = Math.sin(t * 0.9);
  const scroller = (x: number, v: 'sam' | 'nora' | 'leo', seed: number, standing = false) => (
    <Character
      x={x}
      y={standing ? standY(s) : y}
      scale={s}
      variant={v}
      facing={standing ? -1 : 1}
      pose={idle(frame, standing ? { ...STAND, armNear: [64, 96], armFar: [50, 90], headY: 10, lean: 6 } : { ...SIT, armNear: [64, 96], armFar: [50, 90], headY: 10, lean: 12 }, seed)}
      nearItem={<Phone x={4} y={-22} on={0.9} color={C.red} rotate={-12} scale={0.9} />}
      eyes="down"
      mouth="flat"
      eyeGlow={C.red}
      look={[8, 10]}
      turn={0.3}
      hairSwing={0}
    />
  );
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.1, 1.2)} focus={[1000, 560]}>
      <Street offset={0} mode="day" />
      <StreetLamp x={1500} />
      <Bench x={640} w={700} />
      {scroller(740, 'sam', 2)}
      {scroller(1220, 'leo', 5)}
      {scroller(1480, 'nora', 3, true)}
      <Character
        x={980}
        y={y}
        scale={s}
        pose={idle(frame, { ...SIT, armNear: [20, 40], armFar: [20, 40], legNear: [62 + Math.max(0, Math.sin(frame * 0.5)) * 8, 58] }, 0)}
        breathe={frame}
        eyes="open"
        brow={t < 6 ? 'worried' : 'none'}
        mouth="flat"
        look={[lookAround * 14, -4]}
        turn={lookAround * 0.4}
        blinkAmt={blink(frame, 10)}
      />
    </Stage>
  );
};

// 37–49 s. Day 7. Asleep at 23:12, no glow on his face. Cut: 06:28, sunrise, awake before the alarm.
export const Sleep: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cut = 5.6;
  const dip = keys(frame, [cut - 0.5, cut, cut + 0.5], [1, 0, 1]);
  const morning = t >= cut;
  return (
    <Stage fade={Math.min(sceneFade(frame, dur), dip)} zoom={tween(frame, 0, 12, 1.3, 1.42)} focus={[BR.headX + 200, BR.headY - 40]}>
      <Bedroom
        frame={frame}
        sky={morning ? 'dawn' : 'night'}
        sunY={morning ? tween(frame, cut, 12, 520, 420) : undefined}
        clock={morning ? '06:28' : '23:12'}
        clockColor={C.textDim}
        phoneOnStand={false}
        beam={morning ? 1.4 : 0.4}
        lying={{ eyes: morning && t > cut + 2 ? 'open' : 'closed', mouth: morning && t > cut + 3 ? 'smile' : 'flat', breathe: frame, blinkAmt: blink(frame, 9) }}
      >
        <g transform={`translate(${BR.nsX + 104} ${FLOOR - 150})`}>
          <rect x={0} y={-22} width={90} height={22} rx={3} fill="#3D5A80" />
          <rect x={4} y={-36} width={84} height={14} rx={3} fill="#8E2B37" />
        </g>
      </Bedroom>
    </Stage>
  );
};

// 49–61 s. Day 14. A park bench, a book, pages turning. He closes it, finished, and smiles.
export const Book: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const x = 940;
  const y = sitY(BENCH_SEAT, s);
  const turn = BEATS.pageTurns.reduce((m, p) => (t > p && t < p + 0.5 ? (t - p) / 0.5 : m), 0);
  const done = t > 10;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.3, 1.4)} focus={[960, 560]}>
      <Park offset={0} sunY={tween(frame, 0, 12, 480, 520)} light="sunset" />
      <Bench x={700} w={520} />
      <Character
        x={x}
        y={y}
        scale={s}
        pose={idle(frame, { ...SIT, armNear: done ? [30, 50] : [56, 96], armFar: done ? [24, 40] : [50, 90], headY: done ? 0 : 8, lean: done ? 2 : 10 }, 0)}
        nearItem={done ? <rect x={-10} y={-30} width={70} height={18} rx={3} fill="#3D5A80" /> : <OpenBook turn={turn} />}
        breathe={frame}
        eyes={done ? 'happy' : 'down'}
        brow={done ? 'none' : 'focused'}
        mouth={done ? 'smile' : 'flat'}
        look={[8, 10]}
        turn={0.3}
        blinkAmt={blink(frame, 8)}
      />
    </Stage>
  );
};

// 61–75 s. Day 30. 10:00 on the café clock. Sam and Jay already there. Nobody looks down.
export const Plans: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const y = sitY(CHAIR.seat, s);
  const laugh = (t > 1.2 && t < 3.6) || t > 9;
  const bob = laugh ? -Math.abs(Math.sin(t * 9)) * 4 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.12, 1.22)} focus={[960, 540]}>
      <Room wall="#1C1915" />
      <Glow x={960} y={300} r={600} color={C.amber} opacity={0.18} />
      <WallClock x={1380} y={280} minutes={600 + t * 2} />
      <Chair x={690} facing={1} />
      <Chair x={1230} facing={-1} />
      <Character x={1000} y={standY(s) - 30} scale={s * 0.92} variant="jay" facing={-1} pose={idle(frame, { ...STAND, bob }, 3)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 5)} turn={0.2} />
      <Character x={700} y={y} scale={s} pose={idle(frame, { ...SIT, armNear: [40, 70], bob }, 0)} breathe={frame} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 1)} turn={0.35} blinkAmt={blink(frame, 16)} />
      <Character x={1220} y={y} scale={s} facing={-1} variant="sam" pose={idle(frame, { ...SIT, armNear: [40, 70], bob }, 2)} breathe={frame + 6} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 3)} turn={0.3} />
      <CafeTable x={960} />
      <Mug x={880} y={FLOOR - 250} steam={1} frame={frame} />
      <Mug x={1040} y={FLOOR - 250} steam={1} frame={frame + 9} />
    </Stage>
  );
};
