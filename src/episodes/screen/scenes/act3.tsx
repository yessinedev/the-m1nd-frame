import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { Character, Head, Pose, SIT, STAND, idle, mixLimb, reachArm, walk } from '../../../kit/Character';
import { SceneProps, sitY, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Bench, BENCH_SEAT, Desk, DESK, Door, Glow, Lamp, Room, Stool, WallClock } from '../../../kit/props';
import { Bird, CloseHand, Envelope, Park } from '../../../kit/props2';
import { FPS } from '../../../kit/time';
import { HAND } from '../../../fonts';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';

// 140–152 s. Close-up on the table: he turns the phone face-down. It buzzes. He lets it.
export const PhoneDown: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const flip = tween(frame, BEATS.phoneFlip, BEATS.phoneFlip + 0.5, 1, -1);
  const handX = keys(frame, [0, BEATS.phoneFlip + 0.6, BEATS.phoneFlip + 1.6], [1010, 1010, 1700]);
  const buzz = BEATS.phoneBuzz;
  const buzzing = t > buzz && t < buzz + 1.2;
  const glow = buzzing ? 0.6 + 0.4 * Math.sin(frame * 1.4) : 0;
  const sx = buzzing ? wobble(frame, 3, 3.2) * 4 : 0;
  return (
    <Stage fade={sceneFade(frame, dur, 10, 14)} zoom={tween(frame, 0, 12, 1.05, 1.12)} focus={[900, 620]}>
      <rect width={1920} height={1080} fill="#0E0F13" />
      <rect y={520} width={1920} height={560} fill={C.wood} />
      <line x1={0} x2={1920} y1={520} y2={520} stroke={C.line} strokeWidth={4} />
      {[640, 780, 940].map((y) => (
        <line key={y} x1={0} x2={1920} y1={y} y2={y} stroke="#23201D" strokeWidth={3} />
      ))}
      <Glow x={880} y={700} r={420} color={C.red} opacity={flip > 0 ? 0.5 : glow * 0.45} sy={0.5} />
      <g transform={`translate(${880 + sx} 720) scale(${Math.abs(flip) * 1} 1)`}>
        <rect x={-150} y={-90} width={300} height={180} rx={34} fill={flip > 0 ? '#120C0E' : '#1A1B20'} stroke={C.line} strokeWidth={4} />
        {flip > 0 ? <rect x={-136} y={-76} width={272} height={152} rx={24} fill={C.red} opacity={0.85} /> : <circle cx={-96} cy={-40} r={16} fill="#0E0F12" stroke={C.line} strokeWidth={3} />}
      </g>
      <CloseHand x={handX} y={700} scale={0.95} sleeve={C.hoodie} sleeveShade={C.hoodieShade} />
    </Stage>
  );
};

// 152–160 s. Lamp on. He writes her a letter.
export const Letter: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const stoolTop = FLOOR - 165;
  const px = 720;
  const py = sitY(stoolTop, s);
  const lean = 14;
  const pen = { x: 985 + Math.sin(frame * 0.5) * 10 + (t % 2) * 18, y: DESK.top - 10 - Math.abs(Math.sin(frame * 0.9)) * 4 };
  const arm = reachArm(pen.x, pen.y, { x: px, y: py, scale: s, lean });
  const lines = Math.floor(tween(frame, 0, 7, 1, 9));
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 8, 1.1, 1.16)} focus={[960, 560]}>
      <Room wall="#0F1115" />
      <WallClock x={1180} y={300} minutes={1380 + frame * 0.3} />
      <Desk x={840} />
      <Lamp x={1260} y={DESK.top - 2} />
      <g transform={`translate(930 ${DESK.top - 2})`}>
        <path d="M 0 0 L 170 0 L 182 -12 L 12 -12 Z" fill="#E9E4D8" />
        {Array.from({ length: lines }).map((_, i) => (
          <line key={i} x1={24 + (i % 3) * 3} y1={-8 + (i % 2) * 2} x2={70 + i * 11} y2={-8 + (i % 2) * 2} stroke={C.line} strokeWidth={1.6} />
        ))}
      </g>
      <Envelope x={1150} y={DESK.top - 8} scale={0.9} rotate={-4} />
      <Stool x={px} top={stoolTop} />
      <Character
        x={px}
        y={py}
        scale={s}
        pose={{ ...SIT, legFar: [52, 48], legNear: [46, 44], armFar: [46, 60], armNear: arm, lean }}
        handNear="point"
        breathe={frame}
        eyes="down"
        brow="focused"
        mouth="flat"
        look={[10, 4]}
        blinkAmt={blink(frame, 22)}
      />
    </Stage>
  );
};

// 160–168 s. Walking alone at sunset, no phone. Birds overhead.
export const AloneWalk: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.05;
  const pose = walk(frame, 0.8);
  const birds = [0, 1, 2].map((i) => ({ x: 300 + frame * (3 + i * 0.6) + i * 140, y: 260 + i * 40 + Math.sin(frame * 0.05 + i) * 10, flap: Math.sin(frame * 0.5 + i * 2) }));
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 8, 1.06, 1.0)}>
      <Park offset={frame * 3} sunY={tween(frame, 0, 8, 520, 560)} />
      {birds.map((b, i) => (
        <Bird key={i} x={b.x} y={b.y} flap={b.flap} s={1.2} />
      ))}
      <Character
        x={900}
        y={standY(s)}
        scale={s}
        pose={{ ...pose, armNear: [pose.armNear[0] * 0.4 - 6, 24], armFar: [pose.armFar[0] * 0.4 - 6, 24] }}
        handNear="fist"
        handFar="fist"
        eyes="open"
        mouth="smile"
        look={[4, -10]}
        turn={0.2}
        blinkAmt={blink(frame, 6)}
      />
    </Stage>
  );
};

// 168–177 s. Her door. He knocks. She opens. He hands her the letter and looks at her.
export const Doorstep: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const sh = s * 0.95;
  const himX = 900;
  const himY = standY(s);
  const herX = 1290;
  const herY = standY(sh);
  const doorX = 1190;
  const open = tween(frame, BEATS.doorOpen, BEATS.doorOpen + 0.8, 0, 1);
  const knockT = BEATS.knock.reduce((m, k) => Math.max(m, keys(frame, [k - 0.15, k, k + 0.12], [0, 1, 0])), 0);
  const knockArm = reachArm(doorX - 6 + knockT * 8, FLOOR - 300, { x: himX, y: himY, scale: s });
  const raise = keys(frame, [1.4, 1.9, 3.0, 3.4], [0, 1, 1, 0]);
  const give = { x: 1100, y: FLOOR - 250 };
  const offer = keys(frame, [5.6, 6.4], [0, 1]);
  const giveArm = reachArm(give.x, give.y, { x: himX, y: himY, scale: s });
  const takes = keys(frame, [6.8, 7.5], [0, 1]);
  const herArm = reachArm(give.x + 10, give.y, { x: herX, y: herY, scale: sh, facing: -1 });
  const holdingLetter = t < 7.4;
  const letterItem = <Envelope x={10} y={10} scale={0.8} rotate={-10} />;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 9, 1.12, 1.24)} focus={[1060, 560]}>
      <Room wall="#16171C" />
      <Glow x={700} y={330} r={260} color="#BFC6D6" opacity={0.2} />
      <rect x={680} y={300} width={40} height={30} rx={8} fill={C.furnitureLight} stroke={C.line} strokeWidth={2} />
      <Door x={doorX} open={open} spill={C.amber} />
      <Character
        x={herX}
        y={herY}
        scale={sh}
        facing={-1}
        variant="her"
        pose={idle(frame, { ...STAND, armNear: mixLimb([-4, 10], herArm, takes) }, 2)}
        handNear={takes > 0.5 ? 'grip' : 'relaxed'}
        nearItem={holdingLetter ? undefined : letterItem}
        breathe={frame}
        eyes="open"
        brow={t < 6 ? 'raised' : 'sad'}
        mouth={t < 5 ? 'o' : 'flat'}
        turn={0.15}
        opacity={open}
        blinkAmt={blink(frame, 38)}
      />
      <Character
        x={himX}
        y={himY}
        scale={s}
        pose={idle(frame, { ...STAND, armNear: offer > 0 ? mixLimb([-4, 10], giveArm, offer) : mixLimb([-4, 10], knockArm, raise) }, 0)}
        handNear={raise > 0.3 && offer === 0 ? 'fist' : holdingLetter ? 'grip' : 'relaxed'}
        farItem={offer === 0 && t < 5 ? letterItem : undefined}
        nearItem={offer > 0 && holdingLetter ? letterItem : undefined}
        breathe={frame}
        eyes="open"
        brow={t > 4.4 ? 'sad' : 'none'}
        mouth="flat"
        turn={0.3}
        look={[8, -2]}
        blinkAmt={blink(frame, 3)}
      />
    </Stage>
  );
};

// 177–185 s. A bench at sunrise. A little apart. Glances.
export const BenchScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const sh = s * 0.95;
  const seat: Pose = { ...SIT, legFar: [82, 80], legNear: [78, 76], armFar: [-8, 40], armNear: [6, 38], lean: 2 };
  const herLooks = t > 3 && t < 6.5;
  const himLooks = t > 4.4;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 8, 1.1, 1.16)} focus={[960, 560]}>
      <Park offset={0} light="dawn" sunY={tween(frame, 0, 8, 640, 580)} />
      <Bench x={700} />
      <Character
        x={820}
        y={sitY(BENCH_SEAT, sh)}
        scale={sh}
        variant="her"
        pose={idle(frame, seat, 1)}
        breathe={frame + 12}
        eyes="open"
        mouth={herLooks ? 'smile' : 'flat'}
        blush={herLooks ? 0.6 : 0.2}
        turn={herLooks ? 0.5 : 0.1}
        look={herLooks ? [10, 0] : [4, -2]}
        blinkAmt={blink(frame, 50)}
      />
      <Character
        x={1080}
        y={sitY(BENCH_SEAT, s)}
        scale={s}
        pose={idle(frame, seat, 0)}
        breathe={frame}
        eyes="open"
        mouth={himLooks ? 'smile' : 'flat'}
        turn={himLooks ? -0.5 : 0.1}
        look={himLooks ? [-10, 0] : [4, -2]}
        blinkAmt={blink(frame, 14)}
      />
    </Stage>
  );
};

// 185–191 s. Close-up: two hands on the bench slide closer until they touch.
export const Hands: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const touch = BEATS.handsTouch;
  const herX = keys(frame, [0.6, touch], [300, 720]);
  const himX = keys(frame, [0.2, touch], [1640, 1180]);
  const warm = tween(frame, touch - 0.6, touch + 1, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur, 12, 18)} zoom={tween(frame, 0, 6, 1.0, 1.08)} focus={[950, 640]}>
      <rect width={1920} height={1080} fill="#1C1917" />
      {[460, 600, 740, 880].map((y) => (
        <rect key={y} x={-20} y={y} width={1960} height={120} rx={14} fill={C.wood} stroke={C.line} strokeWidth={3} />
      ))}
      <Glow x={950} y={660} r={600} color={C.amber} opacity={warm * 0.45} sy={0.6} />
      <CloseHand x={herX} y={650} scale={0.82} flip sleeve={C.herTop} sleeveShade={C.herTopShade} />
      <CloseHand x={himX} y={690} scale={0.92} sleeve={C.hoodie} sleeveShade={C.hoodieShade} />
    </Stage>
  );
};

// 191–196 s. End card.
export const EndCard: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = tween(frame, 0.2, 1.0, 0, 1);
  const b = tween(frame, 0.9, 1.6, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur, 1, 24)}>
      <rect width={1920} height={1080} fill={C.black} />
      <g opacity={a} transform={`translate(0 ${(1 - a) * 12})`}>
        <Head x={880} y={380} scale={0.95} eyes="happy" mouth="smile" />
        <Head x={1040} y={392} scale={0.88} variant="her" eyes="happy" mouth="smile" blush={0.7} />
        <text x={960} y={640} textAnchor="middle" fontFamily={HAND} fontSize={104} letterSpacing="0.12em" fill={C.text}>
          THE M1ND FRAME
        </text>
      </g>
      <text x={960} y={730} textAnchor="middle" fontFamily={HAND} fontSize={50} letterSpacing="0.04em" fill={C.amber} opacity={b}>
        Put the phone down tonight.
      </text>
    </Stage>
  );
};
