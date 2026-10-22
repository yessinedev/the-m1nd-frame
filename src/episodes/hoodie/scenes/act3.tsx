import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { Character, Head, Pose, SIT, STAND, idle, mixLimb, reachArm, talkMouth, walk } from '../../../kit/Character';
import { SceneProps, sitY, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Glow, LightBeam, Room } from '../../../kit/props';
import { Chair, CHAIR, Kitchen, KITCHEN, Mug, Park, Pendant, Spoon, Bird } from '../../../kit/props2';
import { CAR, CafeTable, CarInterior, FoldingHoodie, Plant, RainWindow } from '../../../kit/props4';
import { HAND } from '../../../fonts';
import { FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';

// 118–130 s. Rain on the window. It stops; sun comes through; he lifts his head.
export const RainWindowScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [r0, r1] = BEATS.rainStops;
  const rain = tween(frame, r0, r1, 1, 0);
  const sun = tween(frame, r0 + 1, r1 + 1.5, 0, 1);
  const s = 1.1;
  const up = t > r1;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.12, 1.2)} focus={[960, 520]}>
      <Room wall="#15171C" />
      <RainWindow x={1000} y={170} rain={rain} sun={sun} frame={frame} />
      <LightBeam x={1000} y={170} w={420} toX={420} color={C.amber} opacity={0.14 * sun} />
      <Chair x={760} facing={1} />
      <Character
        x={770}
        y={sitY(CHAIR.seat, s)}
        scale={s}
        pose={idle(frame, { ...SIT, armNear: [30, 70], armFar: [26, 64], lean: up ? 4 : 14, headY: up ? 0 : 10 }, 0)}
        breathe={frame}
        eyes={up ? 'open' : 'down'}
        brow={up ? 'none' : 'sad'}
        mouth={t > r1 + 1.5 ? 'smile' : 'flat'}
        turn={0.3}
        look={up ? [10, -8] : [6, 8]}
        stubble={t < r1}
        blinkAmt={blink(frame, 28)}
      />
    </Stage>
  );
};

// 130–139 s. Cooking for one. He tastes it and nods.
export const CookSelf: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const x = 1150;
  const y = standY(s);
  const pan = { x: 1300 + Math.sin(frame * 0.3) * 18, y: KITCHEN.top - 40 };
  const stir = reachArm(pan.x, pan.y, { x, y, scale: s, lean: 8 });
  const mouth = reachArm(x + 64 * s, y - 206 * s, { x, y, scale: s });
  const taste = keys(frame, [5.0, 5.6, 6.6, 7.2], [0, 1, 1, 0]);
  const happy = t > 6.2;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 9, 1.18, 1.26)} focus={[1120, 520]}>
      <Room wall="#16171C" />
      <Pendant x={1200} y={170} on={0.9} />
      <Kitchen x={-20} w={1960} frame={frame} />
      <Character
        x={x}
        y={y}
        scale={s}
        pose={idle(frame, { ...STAND, armNear: mixLimb(stir, mouth, taste), lean: 8 - taste * 6 }, 0)}
        nearItem={<g transform="translate(6 0) rotate(-35) scale(1.4)"><Spoon /></g>}
        breathe={frame}
        eyes={happy ? 'happy' : taste > 0.5 ? 'closed' : 'down'}
        mouth={taste > 0.6 && !happy ? 'o' : happy ? 'smile' : 'flat'}
        turn={0.3}
        look={[10, 8]}
        blinkAmt={blink(frame, 7)}
      />
    </Stage>
  );
};

// 139–148 s. Coffee with Sam. Laughing again.
export const Cafe: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const samTalks = t < 3.6;
  const laugh = t > 3.8 && t < 6.4;
  const bob = laugh ? -Math.abs(Math.sin(t * 9)) * 5 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 9, 1.12, 1.2)} focus={[960, 540]}>
      <Room wall="#1C1915" />
      <Glow x={960} y={300} r={600} color={C.amber} opacity={0.18} />
      <Chair x={760} facing={1} />
      <Chair x={1160} facing={-1} />
      <Character
        x={770}
        y={sitY(CHAIR.seat, s)}
        scale={s}
        pose={idle(frame, { ...SIT, armNear: [56, 80], armFar: [30, 60], lean: 6, bob }, 0)}
        nearItem={<g transform="translate(4 18)"><Mug x={0} y={0} /></g>}
        breathe={frame}
        eyes={laugh ? 'happy' : 'open'}
        mouth={laugh ? 'grin' : t > 6.6 ? talkMouth(frame, 3) : 'smile'}
        turn={0.35}
        blinkAmt={blink(frame, 19)}
      />
      <Character
        x={1150}
        y={sitY(CHAIR.seat, s)}
        scale={s}
        facing={-1}
        variant="sam"
        pose={idle(frame, { ...SIT, armNear: samTalks ? [60 + Math.sin(frame * 0.22) * 16, 70] : [40, 70], armFar: [30, 60], lean: 6, bob: bob * 0.7 }, 2)}
        handNear={samTalks ? 'open' : 'relaxed'}
        breathe={frame + 5}
        eyes={laugh ? 'happy' : 'open'}
        mouth={samTalks ? talkMouth(frame, 1) : laugh ? 'grin' : 'smile'}
        turn={0.35}
        blinkAmt={blink(frame, 61)}
      />
      <CafeTable x={960} />
      <Mug x={1030} y={FLOOR - 252} color="#C9B49A" steam={1} frame={frame} />
    </Stage>
  );
};

// 148–157 s. A wilted plant on the sill comes back to life.
export const PlantScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const growth = tween(frame, 1.2, 8, 0.15, 1);
  const wilt = tween(frame, 0.6, 5, 1, 0);
  const pour = keys(frame, [0.4, 0.8, 2.6, 3.0], [0, 1, 1, 0]);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 9, 1.0, 1.06)} focus={[960, 600]}>
      <Room wall="#17181D" />
      <RainWindow x={640} y={120} w={640} h={560} rain={0} sun={1} frame={frame} />
      <rect x={600} y={698} width={720} height={30} rx={8} fill={C.furnitureLight} stroke={C.line} strokeWidth={3} />
      <Plant x={960} y={700 - 120} growth={growth} wilt={wilt} scale={2} />
      <g transform={`translate(1240 ${300}) rotate(${-pour * 32})`} opacity={pour > 0.05 ? 1 : 0}>
        <rect x={-60} y={-40} width={120} height={90} rx={20} fill="#7D8FA6" />
        <path d="M -60 -20 L -150 -60" stroke="#7D8FA6" strokeWidth={14} strokeLinecap="round" />
      </g>
      {pour > 0.6
        ? Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={1090 - (i % 3) * 8} cy={280 + ((frame * 9 + i * 30) % 260)} r={4} fill="#AFC3DA" opacity={0.7} />
          ))
        : null}
    </Stage>
  );
};

// 157–172 s. He folds her hoodie, lays it in a box, tapes it shut.
export const Fold: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [f0, f1] = BEATS.fold;
  const fold = tween(frame, f0, f1, 0, 1);
  const sink = tween(frame, BEATS.intoBox, BEATS.intoBox + 0.8, 0, 0.55);
  const flaps = tween(frame, BEATS.intoBox + 1.0, BEATS.intoBox + 2.0, 0, 1);
  const tape = tween(frame, BEATS.tape - 0.2, BEATS.tape + 0.5, 0, 1);
  const label = tween(frame, BEATS.tape + 1.0, BEATS.tape + 1.8, 0, 1);
  const boxIn = tween(frame, BEATS.intoBox - 1.2, BEATS.intoBox - 0.3, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 15, 1.0, 1.06)} focus={[960, 600]}>
      <rect width={1920} height={1080} fill={C.blanket} />
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M 0 ${200 + i * 160} Q 960 ${170 + i * 160} 1920 ${210 + i * 160}`} stroke={C.blanketShade} strokeWidth={10} fill="none" />
      ))}
      {/* box (back panel), hoodie, box front + flaps + tape */}
      <g opacity={boxIn} transform={`translate(0 ${(1 - boxIn) * 60})`}>
        <rect x={720} y={480} width={480} height={360} rx={8} fill="#6E553A" />
      </g>
      <g transform={`translate(0 ${sink * 260})`}>
        <FoldingHoodie x={960} y={700} fold={fold} scale={1.2} />
      </g>
      <g opacity={boxIn} transform={`translate(0 ${(1 - boxIn) * 60})`}>
        <rect x={720} y={620} width={480} height={300} rx={8} fill="#8C6E4C" stroke="#6E553A" strokeWidth={4} />
        <g transform={`translate(720 620) scale(1 ${1 - flaps * 2 > 0 ? 1 - flaps * 2 : -(1 - flaps * 2)})`}>
          <rect x={0} y={-150} width={240} height={150} fill="#9C7C57" stroke="#6E553A" strokeWidth={3} opacity={flaps > 0.5 ? 0 : 1} />
        </g>
        {flaps > 0.5 ? (
          <>
            <rect x={720} y={590} width={480} height={34} fill="#9C7C57" stroke="#6E553A" strokeWidth={3} />
            <rect x={960 - 30} y={586} width={60 * tape} height={42} fill="#D8CDB8" opacity={0.9} transform={`scale(${1} 1)`} />
            <rect x={720} y={596} width={480 * tape} height={22} fill="#D8CDB8" opacity={0.8} />
          </>
        ) : null}
        <text x={960} y={800} textAnchor="middle" fontFamily={HAND} fontSize={64} letterSpacing="0.1em" fill="#3A2C1E" opacity={label}>
          LENA
        </text>
      </g>
      {t > 12.6 ? <Glow x={960} y={700} r={500} color={C.amber} opacity={tween(frame, 12.6, 14, 0, 0.2)} /> : null}
    </Stage>
  );
};

// 172–186 s. Driving by day. Their song again. He reaches to switch it off… and lets it play.
export const CarDay: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const x = CAR.x;
  const y = sitY(CAR.seat, s);
  const { radioOn, reachRadio, letPlay } = BEATS;
  const reachT = keys(frame, [reachRadio, reachRadio + 0.5, letPlay - 0.3, letPlay + 0.4], [0, 0.8, 0.8, 0]);
  const lean = 10 + reachT * 18;
  const body = { x, y, scale: s, lean };
  const wheel = reachArm(CAR.grip[0], CAR.grip[1], body);
  const wheelFar = reachArm(CAR.grip[0] + 10, CAR.grip[1] - 30, { ...body, side: 'far' });
  const toRadio = reachArm(CAR.radio[0], CAR.radio[1], body);
  const pose: Pose = { ...SIT, legNear: [80, 40], legFar: [76, 44], armNear: mixLimb(wheel, toRadio, reachT), armFar: wheelFar, lean };
  const smile = t > letPlay + 0.6;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.12, 1.2)} focus={[1000, 520]} shake={[0, wobble(frame, 4, 0.9) * 1.5]}>
      <CarInterior frame={frame} day speed={10} radio={t > radioOn ? 1 : 0}>
        <Character
          x={x}
          y={y}
          scale={s}
          pose={pose}
          handNear={reachT > 0.4 ? 'point' : 'grip'}
          handFar="grip"
          breathe={frame}
          eyes={t > letPlay + 2.4 ? 'happy' : 'open'}
          brow={t > reachRadio && t < letPlay ? 'sad' : 'none'}
          mouth={smile ? 'smile' : 'flat'}
          look={[10, -2]}
          blinkAmt={blink(frame, 9)}
        />
      </CarInterior>
    </Stage>
  );
};

// 186–194 s. Walking at sunset, lighter.
export const Walk: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.05;
  const pose = walk(frame, 0.8);
  const birds = [0, 1, 2].map((i) => ({ x: 360 + frame * (3 + i * 0.6) + i * 140, y: 250 + i * 40 + Math.sin(frame * 0.05 + i) * 10, flap: Math.sin(frame * 0.5 + i * 2) }));
  return (
    <Stage fade={sceneFade(frame, dur, 12, 18)} zoom={tween(frame, 0, 8, 1.06, 1.0)}>
      <Park offset={frame * 3} sunY={tween(frame, 0, 8, 540, 580)} />
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
        It gets lighter. Give it time.
      </text>
    </Stage>
  );
};
