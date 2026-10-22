import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { Character, Pose, SIT, STAND, idle, mixLimb, reachArm, run, talkMouth, walk } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Door, Glow, Room, Stool, Street, WallClock } from '../../../kit/props';
import { Chair, CHAIR, DiningTable, Kitchen, Pendant, Suitcase, TABLE } from '../../../kit/props2';
import { Van } from '../../../kit/props3';
import { Porch, Split } from '../../../kit/props8';
import { Flat, Rain, ShoeBox, ShoeRack, Sneaker, Wallet, RackShoe } from '../../../kit/props12';
import { HAND } from '../../../fonts';
import { FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';

export const TEEN = 0.96; // him at 15–18: a touch smaller than at 21
export const KNEEL: Pose = { ...SIT, legFar: [92, 150], legNear: [88, 146], lean: 18, armFar: [30, 50] };
export const kneelY = (s: number) => FLOOR - 4 - 16 * s - 60;

// His side of the split: warm, a new box, the sneaker rising out of it, gleaming.
export const HisNew: React.FC<{ frame: number; lift: number }> = ({ frame, lift }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A221A" />
    <Glow x={960} y={520} r={700} color={C.amber} opacity={0.3} />
    <rect y={760} width={1920} height={320} fill="#1E1913" />
    <ShoeBox x={960} y={800} scale={1.2} open={0.7} />
    <Sneaker x={960} y={720 - lift * 200} scale={1.05} shine={0.6 + Math.sin(frame * 0.2) * 0.4} rotate={-6 + lift * 4} />
  </g>
);

// Her side: cold light, a doormat, the same flats she's had for six years.
export const HersOld: React.FC<{ frame: number; worn?: number }> = ({ frame, worn = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#14161B" />
    <Glow x={960} y={300} r={700} color="#BFC6D6" opacity={0.12} />
    <rect y={760} width={1920} height={320} fill="#101216" />
    <rect x={520} y={700} width={880} height={110} rx={10} fill="#3A2F26" />
    {Array.from({ length: 14 }).map((_, i) => (
      <line key={i} x1={540 + i * 62} x2={540 + i * 62} y1={706} y2={804} stroke="#2E251E" strokeWidth={6} />
    ))}
    <Flat x={740} y={670} scale={0.8} worn={worn} flap={6 + Math.sin(frame * 0.1) * 2} />
    <Flat x={1210} y={700} scale={0.8} worn={worn * 0.85} rotate={4} />
  </g>
);

// 0–5 s. THE HOOK. No fade-in. Frame 0 is already the split: his new sneaker rising out of the box,
// her taped, split flats on the doormat.
export const Hook: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 0, 8)} zoom={tween(frame, 0, 5, 1.0, 1.04)}>
      <Split left={<HisNew frame={frame} lift={tween(frame, 0, BEATS.lift + 1, 0.4, 1)} />} right={<HersOld frame={frame} />} labels={['HIS · BRAND NEW', 'HERS · 6 YEARS OLD']} focus={[[960, 660], [975, 680]]} zoom={[0.96, 0.96]} />
    </Stage>
  );
};

// 5–13 s. 15 years old, out the door in new sneakers, past her bent over her shoe on the stool.
export const DoorScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [r0, r1] = BEATS.runPast;
  const x = t < r0 ? 260 : t < r1 ? 260 + ((t - r0) / (r1 - r0)) * 1500 : 1900;
  const open = keys(frame, [r1 - 0.8, r1 - 0.4, r1 + 0.4, r1 + 1.0], [0, 1, 1, 0]);
  const ms = 1.0;
  const mx = 1150;
  const top = FLOOR - 120;
  const passed = t > r0 + ((mx - 260) / 1500) * (r1 - r0);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 8, 1.1, 1.2)} focus={[1100, 560]}>
      <Room wall="#1A1916" />
      <Door x={1560} open={open} spill={C.amber} />
      <Stool x={mx} top={top} />
      <Character
        x={mx}
        y={sitY(top, ms)}
        scale={ms}
        variant="mom"
        pose={idle(frame, { ...SIT, lean: passed ? 10 : 34, headY: passed ? 0 : 10, armNear: passed ? [20, 40] : [70, 30], armFar: passed ? [20, 40] : [60, 30] }, 2)}
        breathe={frame}
        eyes={passed ? 'happy' : 'down'}
        mouth={passed ? 'smile' : 'flat'}
        turn={0.25}
        look={passed ? [12, -2] : [6, 10]}
        blinkAmt={blink(frame, 40)}
      />
      {t < r1 + 0.2 ? <Character x={x} y={standY(TEEN)} scale={TEEN} pose={t > r0 ? run(frame, 0.9) : idle(frame, STAND, 0)} eyes="happy" mouth="grin" turn={0.4} handNear="fist" handFar="fist" /> : null}
    </Stage>
  );
};

// 13–25 s. The kitchen. "Mom, everyone has them." Her wallet: three notes. She hands him all of it.
export const Ask: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const c0 = 5.4;
  const c1 = 9.4;
  if (t >= c0 && t < c1) {
    return (
      <Stage fade={1} zoom={tween(frame, c0, c1, 1.0, 1.08)} focus={[960, 500]}>
        <rect width={1920} height={1080} fill="#1A1714" />
        <Glow x={960} y={500} r={700} color={C.amber} opacity={0.15} />
        <Wallet x={960} y={620} bills={3} out={tween(frame, BEATS.give - 0.6, BEATS.give + 0.4, 0, 1)} />
      </Stage>
    );
  }
  const after = t >= c1;
  const s = TEEN;
  const ms = 1.0;
  const hx = 820;
  const mx = 1120;
  const give = reachArm(hx + 120, standY(s) - 120, { x: mx, y: standY(ms), scale: ms, facing: -1 });
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={after ? tween(frame, c1, 12, 1.2, 1.26) : tween(frame, 0, c0, 1.14, 1.2)} focus={[970, 520]}>
      <Room wall="#1A1714" />
      <Kitchen x={-20} w={1960} frame={frame} steam={0.5} />
      <Pendant x={980} y={170} on={1} />
      <Character
        x={hx}
        y={standY(s)}
        scale={s}
        pose={idle(frame, { ...STAND, armNear: after ? [120, 60] : t < 4.6 ? [30 + Math.sin(frame * 0.2) * 10, 40] : [-4, 10] }, 0)}
        handNear={after ? 'grip' : 'open'}
        nearItem={after ? <rect x={-30} y={-12} width={60} height={26} rx={3} fill="#8FB08A" /> : undefined}
        breathe={frame}
        eyes={after ? 'happy' : 'open'}
        brow={!after && t < 4.6 ? 'worried' : 'none'}
        mouth={!after && t > 0.6 && t < 4.6 ? talkMouth(frame, 1) : after ? 'grin' : 'flat'}
        turn={0.3}
        blinkAmt={blink(frame, 8)}
      />
      <Character
        x={mx}
        y={standY(ms)}
        scale={ms}
        facing={-1}
        variant="mom"
        pose={idle(frame, { ...STAND, armNear: after ? mixLimb(give, [-4, 10], tween(frame, c1 + 0.6, c1 + 1.2, 0, 1)) : [-4, 10] }, 2)}
        breathe={frame}
        eyes={after && t > c1 + 1.4 ? 'down' : 'open'}
        mouth="smile"
        turn={0.2}
        blinkAmt={blink(frame, 40)}
      />
    </Stage>
  );
};

// 25–37 s. Dawn, rain, the walk to work. Then close: her left shoe into a puddle.
export const RainScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cut = BEATS.splash - 0.4;
  if (t < cut) {
    return (
      <Stage fade={sceneFade(frame, dur, 12, 0)} zoom={tween(frame, 0, cut, 1.1, 1.16)} focus={[900, 560]}>
        <Street offset={frame * 2.4} mode="dawn" sunY={760} />
        <Character x={900} y={standY(1.0)} scale={1.0} variant="mom" pose={walk(frame, 0.6)} eyes="down" brow="sad" mouth="flat" turn={0.3} look={[6, 8]} />
        <Rain frame={frame} />
      </Stage>
    );
  }
  const step = tween(frame, cut, cut + 0.8, -120, 0);
  const splash = keys(frame, [BEATS.splash, BEATS.splash + 0.3, BEATS.splash + 1.2], [0, 1, 0]);
  return (
    <Stage fade={sceneFade(frame, dur, 0, 12)} zoom={tween(frame, cut, 12, 1.0, 1.1)} focus={[960, 620]}>
      <rect width={1920} height={1080} fill="#1A1C22" />
      <rect y={700} width={1920} height={380} fill="#24262C" />
      <ellipse cx={980} cy={780} rx={420} ry={50} fill="#3A4A5C" opacity={0.6} />
      <Flat x={900} y={720 + step} scale={1.2} worn={0.75} flap={10} />
      {splash > 0
        ? Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={980 + Math.cos(i) * 300 * splash} cy={760 - Math.abs(Math.sin(i * 1.7)) * 160 * splash} r={10} fill="#9FB6D9" opacity={1 - splash * 0.6} />
          ))
        : null}
      {t > BEATS.splash + 0.6 ? <ellipse cx={1090} cy={700} rx={30} ry={18} fill="#9FB6D9" opacity={0.7} /> : null}
      <Rain frame={frame} />
    </Stage>
  );
};

// 37–49 s. 1 AM, the kitchen table. She glues her shoe under the lamp. Then she wraps his present.
export const Glue: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ms = 1.04;
  const x = 760;
  const y = sitY(CHAIR.seat, ms);
  const gift = tween(frame, BEATS.wrap - 0.4, BEATS.wrap + 0.6, 0, 1);
  const press = t < BEATS.glueDone ? reachArm(960, TABLE.top - 30 + Math.sin(frame * 0.3) * 4, { x, y, scale: ms, lean: 14 }) : reachArm(1060, TABLE.top - 40, { x, y, scale: ms, lean: 14 });
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.3, 1.42)} focus={[940, 520]}>
      <Room wall="#141310" />
      <WallClock x={1260} y={260} minutes={80 + t * 2} />
      <Pendant x={960} y={150} on={0.8} />
      <Glow x={960} y={TABLE.top - 100} r={360} color={C.amber} opacity={0.25} />
      <Chair x={x - 10} facing={1} />
      <Character
        x={x}
        y={y}
        scale={ms}
        variant="mom"
        pose={idle(frame, { ...SIT, armNear: press, armFar: [50, 80], lean: 14, headY: 6 }, 2)}
        breathe={frame}
        eyes="down"
        brow={t < BEATS.glueDone ? 'focused' : 'none'}
        mouth={t > BEATS.wrap ? 'smile' : 'flat'}
        look={[10, 10]}
        turn={0.3}
        blinkAmt={blink(frame, 40)}
      />
      <DiningTable x={760} w={420} />
      <Flat x={950} y={TABLE.top - 12} scale={0.32} worn={0.7} />
      <rect x={870} y={TABLE.top - 40} width={22} height={40} rx={4} fill="#D8D2C6" />
      {gift > 0 ? (
        <g transform={`translate(1080 ${TABLE.top}) scale(${gift})`}>
          <rect x={-60} y={-80} width={120} height={80} rx={6} fill="#3D5A80" />
          <rect x={-8} y={-80} width={16} height={80} fill={C.amber} />
          <path d="M 0 -80 q -26 -30 -32 -6 q 14 6 32 6 q 18 0 32 -6 q -6 -24 -32 6" fill={C.amber} />
        </g>
      ) : null}
    </Stage>
  );
};

const HIS_YEARS: RackShoe[][] = [
  [{ kind: 'sneaker', color: '#F2EEE6' }],
  [{ kind: 'sneaker', color: '#F2EEE6' }, { kind: 'cleat', color: '#3A3F4A' }],
  [{ kind: 'sneaker', color: '#C8434F' }, { kind: 'cleat', color: '#3A3F4A' }, { kind: 'boot', color: '#5A4630' }],
  [{ kind: 'sneaker', color: '#3D5A80' }, { kind: 'cleat', color: '#F2EEE6' }, { kind: 'boot', color: '#5A4630' }],
  [{ kind: 'sneaker', color: '#5F6B4F' }, { kind: 'sneaker', color: '#F2EEE6' }, { kind: 'boot', color: '#2A2420' }],
  [{ kind: 'sneaker', color: '#C8434F' }, { kind: 'sneaker', color: '#3A3F4A' }, { kind: 'cleat', color: '#F2EEE6' }],
];

// 49–61 s. The hallway rack, a year every two seconds. His shelf keeps changing. Hers doesn't.
export const Rack: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const i = Math.min(HIS_YEARS.length - 1, BEATS.rackYears.filter((y) => t >= y).length - 1);
  const pop = keys(frame, [BEATS.rackYears[i], BEATS.rackYears[i] + 0.25], [0.6, 1]);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={2.2} focus={[960, 700]}>
      <Room wall="#1A1916" />
      <g transform={`translate(0 ${(1 - pop) * 6})`}>
        <ShoeRack x={700} top={HIS_YEARS[i]} bottom={[{ kind: 'flat', color: '#6A4A34', worn: 0.15 + i * 0.17 }]} />
      </g>
      <text x={1180} y={540} textAnchor="middle" fontFamily={HAND} fontSize={36} fill={C.textDim}>
        {`HIM: ${15 + i}`}
      </text>
    </Stage>
  );
};

// 61–73 s. 18. Her porch. A quick hug, a suitcase, the van. She waves until it's gone.
export const Leave: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = TEEN;
  const ms = 1.0;
  const mx = 900;
  const { hugAt, carOff } = BEATS;
  const hug = keys(frame, [hugAt - 0.4, hugAt, hugAt + 0.8, hugAt + 1.2], [0, 1, 1, 0]);
  const hx = t < hugAt + 1.2 ? 1060 : Math.min(1600, 1060 + (t - hugAt - 1.2) * 300);
  const vanX = t < carOff ? 1820 : 1820 + (t - carOff) * (t - carOff) * 220;
  const wave = t > hugAt + 1.4 ? [206 + Math.sin(frame * 0.5) * 14, 18] as [number, number] : mixLimb([-4, 10], reachArm(hx - 20, standY(s) - 170 * s, { x: mx, y: standY(ms), scale: ms }), hug);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.08)} focus={[1100, 560]}>
      <Porch dawn={0.6} />
      <Door x={620} open={1} spill={C.amber} />
      <Van x={vanX} wheel={t > carOff ? frame * 12 : 0} />
      <Character
        x={mx}
        y={standY(ms)}
        scale={ms}
        variant="mom"
        pose={idle(frame, { ...STAND, armFar: wave, lean: hug * 6 }, 2)}
        handFar={t > hugAt + 1.4 ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={hug > 0.5 ? 'closed' : 'open'}
        brow="sad"
        mouth="smile"
        tear={tween(frame, carOff, carOff + 3.5, 0, 0.95)}
        turn={0.3}
        blinkAmt={blink(frame, 40)}
      />
      {t < carOff - 0.4 ? (
        <>
          <Character x={hx} y={standY(s)} scale={s} facing={hug > 0.2 ? -1 : 1} pose={t > hugAt + 1.2 ? walk(frame, 0.8) : idle(frame, { ...STAND, armNear: mixLimb([-4, 10], reachArm(mx + 20, standY(ms) - 170 * ms, { x: hx, y: standY(s), scale: s, facing: -1 }), hug) }, 0)} eyes="happy" mouth="grin" turn={0.3} />
          {t < hugAt + 1.2 ? <Suitcase x={1180} /> : <Suitcase x={hx + 70} />}
        </>
      ) : null}
    </Stage>
  );
};
