import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { Character, Head, SIT, STAND, idle, mixLimb, reachArm, talkMouth, walk } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Door, Glow, Phone, Room, WallClock } from '../../../kit/props';
import { Chair, CHAIR, Sofa, SOFA, TABLE } from '../../../kit/props2';
import { StickyNote } from '../../../kit/props7';
import { Cake, Porch, Split } from '../../../kit/props8';
import { LockScreen, Thread } from '../../../kit/props10';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';
import { Apartment, CloseUp, TABLE_AT } from './act1';

const ear = (x: number, y: number, s: number, facing: 1 | -1 = 1) => reachArm(x + facing * 62 * s, y - 238 * s, { x, y, scale: s, facing });
const EarPhone = <Phone x={0} y={-20} on={0.4} rotate={-60} scale={0.9} />;

// A wrapped gift in hand space.
const Gift = (
  <g transform="translate(14 -10)">
    <rect x={-34} y={-30} width={68} height={60} rx={6} fill="#3D5A80" />
    <rect x={-6} y={-30} width={12} height={60} fill={C.amber} />
    <rect x={-34} y={-6} width={68} height={12} fill={C.amber} />
    <path d="M 0 -30 q -20 -24 -24 -6 q 10 6 24 6 q 14 0 24 -6 q -4 -18 -24 6" fill={C.amber} />
  </g>
);

// 84–100 s. March 13, 23:59. He's awake for it. 00:00: he sends it first. Sam: "BRO. you remembered??"
export const Sam: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { samFlip, samSend, samReply } = BEATS;
  const typing = t > samFlip + 0.2 && t < samSend;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 16, 1.0, 1.06)} focus={[960, 300]}>
      <rect width={1920} height={1080} fill="#07080B" />
      <CloseUp low tap={typing ? Math.abs(Math.sin(frame * 0.7)) * 0.5 : 0} glow={C.amber}>
        {(sw, sh) =>
          t < samFlip ? (
            <LockScreen sw={sw} sh={sh} frame={frame} clock="23:59" date="Monday, March 13" notices={[{ title: 'Calendar', text: "Tomorrow: Sam's birthday", icon: 'cake', appear: 0 }]} />
          ) : (
            <Thread
              sw={sw}
              sh={sh}
              frame={frame}
              name="Sam"
              variant="sam"
              msgs={[
                { from: 'them', text: 'bro?', date: 'March 9', at: 0, seen: true },
                { from: 'me', text: 'HAPPY BIRTHDAY BRO!!', date: 'March 14 · 00:00', at: f(samSend) },
                { from: 'me', text: "sorry I missed your party", at: f(samSend + 1.2) },
                { from: 'them', text: 'BRO. you remembered??', at: f(samReply) },
                { from: 'them', text: 'come thru saturday', at: f(samReply + 1.8) },
              ]}
            />
          )
        }
      </CloseUp>
    </Stage>
  );
};

// 100–114 s. Jay's porch, a gift in hand. Knock. Jay opens the door, stunned, then pulls him in.
export const ShowUp: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { knock, doorOpen, hug } = BEATS;
  const s = 1.08;
  const doorX = 1180;
  const open = tween(frame, doorOpen, doorOpen + 0.8, 0, 1);
  const step = tween(frame, hug - 0.6, hug, 0, 1);
  const himX = 860 + step * 230;
  const himY = standY(s);
  const jayX = 1300 - step * 30;
  const jayY = standY(s);
  const knockT = knock.reduce((m, k) => Math.max(m, keys(frame, [k - 0.15, k, k + 0.12], [0, 1, 0])), 0);
  const raise = keys(frame, [0.8, 1.2, 2.2, 2.6], [0, 1, 1, 0]);
  const knockArm = reachArm(doorX - 6 + knockT * 8, FLOOR - 300, { x: himX, y: himY, scale: s });
  const hugT = tween(frame, hug, hug + 0.5, 0, 1);
  const hisHug = reachArm(jayX - 10, jayY - 170 * s, { x: himX, y: himY, scale: s, lean: 8 });
  const jayHug = reachArm(himX + 30, himY - 170 * s, { x: jayX, y: jayY, scale: s, facing: -1 });
  const holdGift = reachArm(himX + 120, himY - 120 * s, { x: himX, y: himY, scale: s, side: 'far' });
  const surprised = t > doorOpen && t < doorOpen + 2.2;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, doorOpen, hug, 14], [1.1, 1.18, 1.3, 1.36])} focus={[1080, 540]}>
      <Porch dawn={0.8} />
      <Glow x={doorX + 95} y={FLOOR - 470} r={160} color={C.amber} opacity={0.5} />
      <circle cx={doorX + 95} cy={FLOOR - 470} r={14} fill="#FFD27A" />
      <Door x={doorX} open={open} spill={C.amber} />
      <Character
        x={jayX}
        y={jayY}
        scale={s}
        facing={-1}
        variant="jay"
        pose={idle(frame, { ...STAND, lean: hugT * 8, armNear: mixLimb([-4, 10], jayHug, hugT) }, 3)}
        handNear={hugT > 0.5 ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={hugT > 0.5 ? 'happy' : surprised ? 'wide' : 'happy'}
        brow={surprised ? 'raised' : 'none'}
        mouth={surprised ? 'o' : 'grin'}
        turn={0.15}
        opacity={open}
        blinkAmt={blink(frame, 38)}
      />
      <Character
        x={himX}
        y={himY}
        scale={s}
        pose={idle(frame, { ...STAND, lean: hugT * 8, armFar: hugT > 0 ? [10, 20] : holdGift, armNear: hugT > 0 ? mixLimb([-4, 10], hisHug, hugT) : mixLimb([-4, 10], knockArm, raise) }, 0)}
        handNear={raise > 0.3 && hugT === 0 ? 'fist' : hugT > 0.5 ? 'open' : 'relaxed'}
        farItem={hugT > 0 ? undefined : Gift}
        breathe={frame}
        eyes={hugT > 0.5 ? 'happy' : 'open'}
        mouth={t > doorOpen + 1 ? 'grin' : 'smile'}
        turn={0.3}
        look={[8, -2]}
        blinkAmt={blink(frame, 3)}
      />
    </Stage>
  );
};

// 114–126 s. Split: him on his couch, Nana in her armchair. She talks; he listens. His clock moves an hour.
export const Nana: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const hx = 980;
  const hy = sitY(SOFA.seat, s);
  const nx = 900;
  const ny = sitY(CHAIR.seat, s);
  const laugh = (t > 3.2 && t < 4.6) || (t > 8 && t < 9.6);
  const his = (
    <g>
      <Room wall="#15171C" />
      <WallClock x={1180} y={300} minutes={tween(frame, 0.4, 11, 0, 60, (v) => v)} />
      <Sofa x={700} />
      <Character x={hx} y={hy} scale={s} pose={idle(frame, { ...SIT, armNear: ear(hx, hy, s) }, 0)} nearItem={EarPhone} breathe={frame} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : 'smile'} turn={0.3} blinkAmt={blink(frame, 5)} />
    </g>
  );
  const hers = (
    <g>
      <Room wall="#1F1A1D" />
      <Glow x={900} y={300} r={600} color={C.amber} opacity={0.2} />
      <StickyNote x={1180} y={300} text={['81!']} scale={0.5} rotate={6} />
      <Chair x={nx - 10} facing={1} />
      <Character
        x={nx}
        y={ny}
        scale={s}
        variant="nana"
        pose={idle(frame, { ...SIT, armNear: ear(nx, ny, s), lean: 6 }, 2)}
        nearItem={EarPhone}
        breathe={frame}
        eyes={laugh ? 'happy' : 'open'}
        mouth={laugh ? 'grin' : talkMouth(frame, 2)}
        blush={0.5}
        turn={0.3}
        blinkAmt={blink(frame, 40)}
      />
    </g>
  );
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.04)}>
      <Split left={his} right={hers} labels={['HIM', 'NANA · 81 TODAY']} focus={[[980, 600], [920, 600]]} zoom={[1.15, 1.15]} />
    </Stage>
  );
};

const YEAR_NAMES = [
  ['Sam', 'Mar 14'],
  ['Jay', 'May 2'],
  ['Leo', 'Aug 20'],
  ['Nana', 'Sep 9'],
  ['Mom', 'Nov 3'],
  ['Dad', 'Jan 22'],
  ['Tia', 'Feb 8'],
  ['Noah', 'Apr 30'],
  ['Ben', 'Jul 4'],
  ['Aunt Rose', 'Oct 1'],
  ['Coach', 'Dec 5'],
  ['Maya', 'Jun 28'],
];

// 126–140 s. The wall, full: twelve notes. One amber check after another.
export const Year: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const done = [0, 5, 7, 9, 11, 12][BEATS.ticks.filter((k) => t >= k).length];
  const s = 1.08;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.04, 1.12)} focus={[1060, 460]}>
      <Room wall="#1A1C21" />
      <Glow x={1100} y={360} r={800} color={C.amber} opacity={0.14} />
      {YEAR_NAMES.map(([name, date], i) => {
        const x = 700 + (i % 6) * 190;
        const y = 270 + Math.floor(i / 6) * 230;
        const checked = i < done;
        return (
          <g key={name}>
            <StickyNote x={x} y={y} text={[name, date]} scale={0.55} rotate={((i * 7) % 5) - 2} />
            {checked ? <path d={`M ${x + 20} ${y + 40} l 18 20 l 38 -50`} stroke={C.amber} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          </g>
        );
      })}
      <Character x={420} y={standY(s)} scale={s} pose={idle(frame, STAND, 0)} breathe={frame} eyes={t > 9 ? 'happy' : 'open'} mouth="smile" turn={0.3} look={[12, -10]} blinkAmt={blink(frame, 10)} />
    </Stage>
  );
};

const PINGS: { title: string; text: string; variant: 'sam' | 'jay' | 'leo' | 'nana' | 'mom' | 'nora' | 'lena' | 'kid' }[] = [
  { title: 'Sam', text: 'HAPPY BIRTHDAY BRO!!', variant: 'sam' },
  { title: 'Jay', text: 'happy bday man', variant: 'jay' },
  { title: 'Nana', text: 'Happy birthday sweetheart', variant: 'nana' },
  { title: 'Leo', text: '26 looks good on u', variant: 'leo' },
  { title: 'Mom', text: 'my baby is 26!!', variant: 'mom' },
  { title: 'Tia', text: 'hbd!!', variant: 'lena' },
  { title: 'Maya', text: 'happy birthday :)', variant: 'nora' },
  { title: 'Noah', text: 'birthday boy!', variant: 'kid' },
  { title: 'the squad', text: 'Sam: dinner sat, on us', variant: 'sam' },
  { title: 'Aunt Rose', text: 'Happy birthday dear', variant: 'nana' },
  { title: 'Ben', text: 'hbd bro', variant: 'jay' },
  { title: 'Coach', text: 'Happy birthday, champ', variant: 'leo' },
  { title: 'Dad', text: 'Proud of you son', variant: 'sam' },
  { title: 'the squad', text: 'Jay: BIRTHDAY BOYYY', variant: 'jay' },
];

// 140–160 s. A year later. The same lock screen, 23:59. 00:00: and it doesn't stop.
export const Midnight: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const flipped = t >= BEATS.midFlip;
  const buzz = flipped && t < BEATS.midPings[BEATS.midPings.length - 1] + 0.4 ? Math.sin(frame * 2.3) * 1.2 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, BEATS.midFlip, 20], [1.0, 1.02, 1.06])} focus={[960, 300]} shake={[buzz * 3, 0]}>
      <rect width={1920} height={1080} fill="#07080B" />
      {flipped ? <Glow x={960} y={540} r={900} color={C.amber} opacity={tween(frame, BEATS.midFlip, BEATS.midFlip + 2, 0, 0.22)} /> : null}
      <CloseUp low glow={flipped ? C.amber : C.screen}>
        {(sw, sh) => (
          <LockScreen
            sw={sw}
            sh={sh}
            frame={frame}
            clock={flipped ? '00:00' : '23:59'}
            date={flipped ? 'Friday, June 12' : 'Thursday, June 11'}
            notices={[
              { title: 'Calendar', text: 'Today: your birthday', icon: 'cake', appear: f(BEATS.midFlip) },
              ...BEATS.midPings.map((p, i) => ({ ...PINGS[i], appear: f(p) })),
            ]}
          />
        )}
      </CloseUp>
    </Stage>
  );
};

// 160–176 s. His apartment. Knock knock knock. Sam, Jay and Leo pile in with a cake.
export const Party: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { partyKnock, partyOpen } = BEATS;
  const s = 1.06;
  const open = tween(frame, partyOpen, partyOpen + 0.6, 0, 1);
  const enter = (delay: number, to: number) => {
    const t0 = partyOpen + 0.6 + delay;
    const x = t < t0 ? 1690 : Math.max(to, 1690 - (t - t0) * 360);
    return { x, walking: t > t0 && x > to };
  };
  const jay = enter(0, 1180);
  const sam = enter(0.5, 1360);
  const leo = enter(1.0, 1540);
  const stands = t > partyOpen + 0.4;
  const hy = sitY(CHAIR.seat, s);
  const laugh = t > partyOpen + 1.6;
  const cakeItem = (
    <g transform="translate(30 6) scale(0.6)">
      <Cake x={0} y={20} lit={1} frame={frame} />
    </g>
  );
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 16, 1.06, 1.12)} focus={[1100, 540]}>
      <Room wall="#15171C" />
      <Door x={1600} open={open} spill={C.amber} />
      <Chair x={TABLE_AT.him - 10} facing={1} />
      <Character
        x={TABLE_AT.him + (stands ? 140 : 0)}
        y={stands ? standY(s) : hy}
        scale={s}
        pose={stands ? idle(frame, { ...STAND, armNear: laugh ? [150, 40] : [-4, 10], armFar: laugh ? [140, 40] : [6, 8] }, 0) : idle(frame, { ...SIT, armNear: [40, 60] }, 0)}
        handNear={laugh ? 'open' : 'relaxed'}
        handFar={laugh ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={laugh ? 'happy' : stands ? 'wide' : 'open'}
        brow={stands && !laugh ? 'raised' : 'none'}
        mouth={laugh ? 'grin' : stands ? 'o' : 'flat'}
        turn={0.3}
        look={[12, 0]}
        blinkAmt={blink(frame, 12)}
      />
      {[
        { who: leo, v: 'leo' as const, seed: 5 },
        { who: sam, v: 'sam' as const, seed: 2 },
        { who: jay, v: 'jay' as const, seed: 3 },
      ].map(({ who, v, seed }) => (
        <Character
          key={v}
          x={who.x}
          y={standY(s)}
          scale={s}
          facing={-1}
          variant={v}
          opacity={open}
          pose={who.walking ? walk(frame + seed, 0.9) : idle(frame, { ...STAND, armNear: v === 'jay' ? [70, 80] : laugh ? [150, 30] : [-4, 10] }, seed)}
          nearItem={v === 'jay' ? cakeItem : undefined}
          handNear={v !== 'jay' && laugh ? 'open' : 'relaxed'}
          breathe={frame + seed}
          eyes="happy"
          mouth={laugh ? 'grin' : talkMouth(frame, seed)}
          turn={0.2}
        />
      ))}
      {partyKnock.some((k) => t > k - 0.1 && t < k + 0.15) ? (
        <text x={1640} y={FLOOR - 420} fontFamily={HAND} fontSize={48} fill={C.textDim}>
          knock
        </text>
      ) : null}
    </Stage>
  );
};

// 176–194 s. The same table as his lonely birthday. Every chair taken; he blows out the candle.
export const Final: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const y = sitY(CHAIR.seat, s);
  const b = BEATS.blowOut2;
  const lean = keys(frame, [b - 0.8, b - 0.3, b + 0.6, b + 1.2], [6, 20, 20, 6]);
  const cheer = t > b + 0.2;
  const sing = !cheer;
  const arms = (seed: number) => (cheer ? ([160 + Math.sin(frame * 0.3 + seed) * 10, 30] as [number, number]) : ([-4, 10] as [number, number]));
  return (
    <Stage fade={sceneFade(frame, dur, 12, 18)} zoom={keys(frame, [0, b, 18], [1.12, 1.2, 1.1])} focus={[980, 520]}>
      <Apartment
        frame={frame}
        lamp={1}
        onTable={
          <>
            <Cake x={TABLE_AT.cake} y={TABLE.top} lit={t < b ? 1 : 0} frame={frame} />
            <Phone x={TABLE_AT.x + 90} y={TABLE.top} flat on={0.4} color={C.amber} />
          </>
        }
      >
        {t < b ? <Glow x={TABLE_AT.cake} y={TABLE.top - 130} r={300} color={C.amber} opacity={0.4} /> : null}
        <Character x={900} y={standY(s) - 20} scale={s * 0.94} facing={-1} variant="jay" pose={idle(frame, { ...STAND, armNear: arms(1), armFar: arms(2) }, 3)} handNear={cheer ? 'open' : 'relaxed'} eyes="happy" mouth={sing ? talkMouth(frame, 3) : 'grin'} turn={0.2} />
        <Character x={1080} y={standY(s) - 20} scale={s * 0.94} variant="leo" pose={idle(frame, { ...STAND, armNear: arms(3), armFar: arms(4) }, 5)} handNear={cheer ? 'open' : 'relaxed'} eyes="happy" mouth={sing ? talkMouth(frame, 6) : 'grin'} turn={0.2} />
        <Character x={TABLE_AT.right} y={y} scale={s} facing={-1} variant="sam" pose={idle(frame, { ...SIT, armNear: cheer ? [150, 30] : [40, 60] }, 2)} handNear={cheer ? 'open' : 'relaxed'} eyes="happy" mouth={sing ? talkMouth(frame, 1) : 'grin'} turn={0.3} />
        <Character
          x={TABLE_AT.him}
          y={y}
          scale={s}
          pose={idle(frame, { ...SIT, armNear: [40, 60], armFar: [34, 64], lean }, 0)}
          breathe={frame}
          eyes={cheer ? 'happy' : 'open'}
          mouth={t > b - 0.4 && t < b + 0.6 ? 'o' : 'grin'}
          blush={0.4}
          turn={0.3}
          blinkAmt={blink(frame, 12)}
        />
      </Apartment>
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
        <Head x={810} y={390} scale={0.8} variant="sam" eyes="happy" mouth="grin" />
        <Head x={960} y={380} scale={0.92} eyes="happy" mouth="grin" blush={0.4} />
        <Head x={1110} y={390} scale={0.8} variant="jay" eyes="happy" mouth="grin" />
        <text x={960} y={640} textAnchor="middle" fontFamily={HAND} fontSize={104} letterSpacing="0.12em" fill={C.text}>
          THE M1ND FRAME
        </text>
      </g>
      <text x={960} y={730} textAnchor="middle" fontFamily={HAND} fontSize={50} letterSpacing="0.04em" fill={C.amber} opacity={b}>
        Be the first message.
      </text>
    </Stage>
  );
};
