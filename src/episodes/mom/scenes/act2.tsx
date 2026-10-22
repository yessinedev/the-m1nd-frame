import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, Head, Pose, SIT, STAND, handPos, idle, mixLimb, reachArm, talkMouth, walk } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Door, Glow, Phone, Room } from '../../../kit/props';
import { Chair, CHAIR, Kitchen, KITCHEN, PhoneHands, Pendant, Sofa, SOFA, WindowCity } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { CAR, CarInterior } from '../../../kit/props4';
import { Cane, Porch, Split, Voicemail } from '../../../kit/props8';
import { HAND } from '../../../fonts';
import { FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';
import { BTN, CallCloseUp, DINING, EarPhone, MOM_SIT, MomDining, TablePlates, ear, momSeat, thumbOn } from './shared';

const GREEN = '#4FBF73';

// 92–106 s. The silence. Five days, five cuts: same bed, same dark phone on the nightstand.
// Each day he checks it a little sooner.
const DAYS = [
  { sky: 'day', clock: '08:10' },
  { sky: 'night', clock: '23:40' },
  { sky: 'day', clock: '07:55' },
  { sky: 'night', clock: '02:13' },
  { sky: 'dawn', clock: '05:30' },
] as const;

export const Silence: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = BEATS.silenceDays.filter((d) => t >= d).length - 1;
  const day = DAYS[Math.max(0, idx)];
  const s = 1.08;
  const x = 760;
  const y = sitY(BR.mattress, s);
  const phone = { x: BR.phoneX, y: BR.phoneY };
  const d0 = BEATS.silenceDays[Math.max(0, idx)];
  const lift = idx >= 3 ? keys(frame, [d0 + 0.6, d0 + 1.2, d0 + 2.4, d0 + 2.9], [0, 1, 1, 0]) : 0;
  const toPhone = reachArm(phone.x + 20, phone.y - 10, { x, y, scale: s, facing: -1, lean: 16 });
  const look = reachArm(x - 150, y - 190 * s, { x, y, scale: s, facing: -1 });
  const arm = lift > 0 ? mixLimb(toPhone, look, Math.min(1, lift * 1.4)) : ([30, 40] as Pose['armNear']);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={1.12 + (t - d0) * 0.012} focus={[700, 560]}>
      <Bedroom frame={frame} sky={day.sky} clock={day.clock} clockColor={day.sky === 'night' ? C.red : C.textDim} phoneOnStand={lift < 0.3}>
        <Character
          x={x}
          y={y}
          scale={s}
          facing={-1}
          pose={idle(frame, { ...SIT, armNear: arm, armFar: [34, 50], lean: idx >= 2 ? 16 : 8, headY: idx >= 3 ? 8 : 0 }, 0)}
          nearItem={lift >= 0.3 ? <Phone x={4} y={-22} on={0.5} rotate={-12} scale={0.95} /> : undefined}
          breathe={frame}
          eyes={idx >= 3 ? 'down' : 'open'}
          brow={idx >= 2 ? 'worried' : 'none'}
          mouth={idx >= 3 ? 'frown' : 'flat'}
          turn={0.2}
          look={[10, 6]}
          blinkAmt={blink(frame, 14)}
        />
      </Bedroom>
    </Stage>
  );
};

// 106–121 s. He finally plays it. Her voice (captions) over the waveform; then his face.
export const Play: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { playTap: tap, playFace: face } = BEATS;
  const playing = t > tap;
  const btn = thumbOn(BTN.play);
  const press = keys(frame, [tap - 0.2, tap, tap + 0.2], [0, 1, 0]);
  const hand = keys(frame, [0, tap - 0.3, tap + 0.6, tap + 1.2], [0, 1, 1, 0]);
  if (t < face) {
    return (
      <Stage fade={sceneFade(frame, dur, 10, 0)} zoom={tween(frame, 0, face, 1.0, 1.12)} focus={[960, 560]}>
        <rect width={1920} height={1080} fill="#07080B" />
        <PhoneShell x={960} y={545} h={980} glow={C.amber}>
          {(sw, sh) => <Voicemail sw={sw} sh={sh} frame={frame} progress={tween(frame, tap, 14.4, 0, 1, (v) => v)} playing={playing} />}
        </PhoneShell>
        <PhoneHands x={960} y={545} h={980} thumbX={btn.thumbX + (1 - hand) * 80} thumbY={btn.thumbY + (1 - hand) * 260 + press * 8} />
      </Stage>
    );
  }
  // Close on his face, lit by the phone. The tear comes on "I love you".
  return (
    <Stage fade={sceneFade(frame, dur, 0, 14)} zoom={tween(frame, face, 15, 1.0, 1.1)} focus={[960, 500]}>
      <rect width={1920} height={1080} fill="#07080B" />
      <Glow x={1250} y={760} r={700} color={C.amber} opacity={0.22} />
      <Head x={960} y={520} scale={2.6} hood eyes="open" brow="sad" mouth="flat" look={[16, 10]} eyeGlow={C.amber} turn={0.25} tear={tween(frame, 11.0, 14.6, 0, 0.95)} blinkAmt={blink(frame, 30)} />
    </Stage>
  );
};

// 121–133 s. Now he's the one calling. Left: him, pacing, phone to his ear.
// Right: her phone ringing on the counter of a dark, empty kitchen.
export const Calling: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { dial, noAnswer } = BEATS;
  const ringing = t > dial + 0.4 && t < noAnswer;
  const s = 1.1;
  const pace = t > dial && t < noAnswer;
  const x = 900 + (pace ? Math.sin((t - dial) * 0.8) * 120 : 0);
  const y = standY(s);
  const lowered = tween(frame, noAnswer + 0.2, noAnswer + 1.0, 0, 1);
  const raise = tween(frame, dial - 0.6, dial, 0, 1);
  const arm = mixLimb([-4, 10], ear(x, y, s), raise * (1 - lowered));
  const facing: 1 | -1 = pace && Math.cos((t - dial) * 0.8) < 0 ? -1 : 1;
  const his = (
    <g>
      <Room wall="#12151B" />
      <WindowCity x={1240} y={240} night />
      <Character
        x={x}
        y={y}
        scale={s}
        facing={facing}
        pose={pace ? { ...walk(frame, 0.5), armNear: ear(x, y, s, facing) } : idle(frame, { ...STAND, armNear: arm }, 0)}
        nearItem={raise * (1 - lowered) > 0.3 ? EarPhone : undefined}
        breathe={frame}
        eyes={t > noAnswer ? 'wide' : 'open'}
        brow="worried"
        mouth={t > noAnswer ? 'o' : 'flat'}
        sweat={t > dial + 4}
        turn={0.2}
        blinkAmt={blink(frame, 7)}
      />
    </g>
  );
  const hers = (
    <g>
      <Room wall="#100F0E" />
      <Kitchen x={-20} w={1960} frame={frame} steam={0} />
      <Pendant x={900} y={170} on={0} />
      <Phone x={960} y={KITCHEN.top} flat on={ringing ? 0.7 + Math.sin(frame * 0.6) * 0.3 : 0} color={GREEN} />
      {ringing ? (
        <text x={960} y={KITCHEN.top - 60} textAnchor="middle" fontFamily={HAND} fontSize={34} fill={GREEN} opacity={0.6 + Math.sin(frame * 0.6) * 0.4}>
          calling...
        </text>
      ) : null}
    </g>
  );
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.05)}>
      <Split left={his} right={hers} labels={['HIM · 11:40 PM', "MOM'S KITCHEN"]} focus={[[900, 600], [960, 620]]} zoom={[1.05, 1.7]} />
    </Stage>
  );
};

// 133–144 s. Night road, rain, both hands on the wheel.
export const Drive: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.1;
  const x = CAR.x;
  const y = sitY(CAR.seat, s);
  const body = { x, y, scale: s, lean: 4 };
  const pose: Pose = {
    ...SIT,
    legNear: [80, 40],
    legFar: [76, 44],
    armNear: reachArm(CAR.grip[0], CAR.grip[1], body),
    armFar: reachArm(CAR.grip[0] + 10, CAR.grip[1] - 30, { ...body, side: 'far' }),
    lean: 4,
  };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 11, 1.12, 1.24)} focus={[1000, 520]} shake={[0, wobble(frame, 2, 0.9) * 1.5]}>
      <CarInterior frame={frame} speed={16}>
        <Character x={x} y={y} scale={s} pose={pose} handNear="grip" handFar="grip" breathe={frame} eyes="open" brow="worried" mouth="flat" look={[12, 0]} turn={0.2} blinkAmt={blink(frame, 23)} />
      </CarInterior>
      {Array.from({ length: 40 }).map((_, i) => {
        const rx = 340 + ((i * 97) % 1060);
        const ry = 230 + ((i * 53 + frame * 14) % 190);
        return <line key={i} x1={rx} y1={ry} x2={rx - 6} y2={ry + 18} stroke="#9FB6D9" strokeOpacity={0.35} strokeWidth={2} />;
      })}
    </Stage>
  );
};

// 144–160 s. Dawn, her porch. He knocks. The door opens: Mom, leaning on a cane.
// "I didn't want to bother you." He holds her.
export const PorchScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { knock, doorOpen, hug } = BEATS;
  const s = 1.1;
  const ms = 1.02;
  const doorX = 1180;
  const open = tween(frame, doorOpen, doorOpen + 0.8, 0, 1);
  const step = tween(frame, hug - 0.8, hug, 0, 1);
  const himX = 860 + step * 230;
  const himY = standY(s);
  const momX = 1300 - step * 30;
  const momY = standY(ms);
  const knockT = knock.reduce((m, k) => Math.max(m, keys(frame, [k - 0.15, k, k + 0.12], [0, 1, 0])), 0);
  const raise = keys(frame, [0.6, 1.0, 2.0, 2.4], [0, 1, 1, 0]);
  const knockArm = reachArm(doorX - 6 + knockT * 8, FLOOR - 300, { x: himX, y: himY, scale: s });
  const hugT = tween(frame, hug, hug + 0.6, 0, 1);
  const hisHug = reachArm(momX - 10, momY - 160 * ms, { x: himX, y: himY, scale: s, lean: 8 });
  const herHug = reachArm(himX + 30, himY - 170 * s, { x: momX, y: momY, scale: ms, facing: -1, side: 'far' });
  const momPose = idle(frame, { ...STAND, lean: 4 + hugT * 4, armNear: [12, 14], armFar: mixLimb([6, 8], herHug, hugT) }, 2);
  const grip = handPos(momPose, momX, momY, ms, -1, 'near');
  const caneLen = (FLOOR - grip.y) / ms - 10;
  const talking = t > 7.8 && t < 11.4;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, doorOpen, hug, 16], [1.1, 1.18, 1.32, 1.4])} focus={[1080, 540]}>
      <Porch dawn={tween(frame, 0, 16, 0.3, 1)} />
      <Glow x={doorX + 95} y={FLOOR - 470} r={160} color={C.amber} opacity={0.5} />
      <circle cx={doorX + 95} cy={FLOOR - 470} r={14} fill="#FFD27A" />
      <text x={doorX - 70} y={FLOOR - 430} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={C.textDim}>
        14
      </text>
      <Door x={doorX} open={open} spill={C.amber} />
      <Character
        x={momX}
        y={momY}
        scale={ms}
        facing={-1}
        variant="mom"
        pose={momPose}
        nearItem={<Cane len={caneLen} />}
        handNear="grip"
        handFar={hugT > 0.5 ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={hugT > 0.5 ? 'closed' : t > 7.8 ? 'down' : 'wide'}
        brow={t > 6 ? 'sad' : 'raised'}
        mouth={talking ? talkMouth(frame, 3) : hugT > 0.5 ? 'smile' : 'o'}
        tear={hugT > 0 ? tween(frame, hug + 0.5, hug + 3.5, 0, 0.95) : 0}
        turn={0.15}
        opacity={open}
        blinkAmt={blink(frame, 38)}
      />
      <Character
        x={himX}
        y={himY}
        scale={s}
        pose={idle(frame, { ...STAND, lean: hugT * 8, armNear: hugT > 0 ? mixLimb([-4, 10], hisHug, hugT) : mixLimb([-4, 10], knockArm, raise) }, 0)}
        handNear={raise > 0.3 && hugT === 0 ? 'fist' : hugT > 0.5 ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={hugT > 0.5 ? 'closed' : 'open'}
        brow="sad"
        mouth={t > 11.9 && hugT < 0.5 ? talkMouth(frame, 1) : 'flat'}
        tear={tween(frame, 6, 10, 0, 0.95)}
        turn={0.3}
        look={[8, -2]}
        blinkAmt={blink(frame, 3)}
      />
    </Stage>
  );
};

// 160–174 s. Her kitchen. He's at the stove, badly; she's on a chair, cane against it, laughing.
export const Together: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const ms = 1.02;
  const himX = 1150;
  const himY = standY(s);
  const pan = { x: -20 + 1960 * 0.68, y: KITCHEN.top - 30 };
  const stir = reachArm(pan.x - 40 + Math.sin(frame * 0.3) * 18, pan.y - 10, { x: himX, y: himY, scale: s, lean: 6 });
  const momX = 640;
  const momY = sitY(CHAIR.seat, ms);
  const smoke = keys(frame, [7.8, 8.6, 11.5, 13], [0, 1, 1, 0.3]);
  const laugh = t > 9.2;
  const bob = laugh ? -Math.abs(Math.sin(t * 8)) * 5 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.08, 1.16)} focus={[960, 540]}>
      <Room wall="#1A1714" />
      <Kitchen x={-20} w={1960} frame={frame} steam={1 + smoke * 2} />
      <Pendant x={980} y={170} on={1} />
      <Glow x={pan.x} y={pan.y - 100} r={260} color="#BFC6D6" opacity={smoke * 0.25} />
      <Chair x={momX - 10} facing={1} />
      <line x1={momX - 90} y1={FLOOR} x2={momX - 60} y2={CHAIR.seat - 120} stroke="#5A4630" strokeWidth={9} strokeLinecap="round" />
      <Character
        x={momX}
        y={momY}
        scale={ms}
        variant="mom"
        pose={idle(frame, { ...MOM_SIT, armNear: laugh ? [60, 100] : [40, 60], bob }, 2)}
        breathe={frame}
        eyes={laugh || t < 4 ? 'happy' : 'open'}
        mouth={laugh ? 'grin' : t < 7 ? talkMouth(frame, 2) : 'smile'}
        blush={0.5}
        turn={0.35}
        blinkAmt={blink(frame, 40)}
      />
      <Character
        x={himX}
        y={himY}
        scale={s}
        pose={idle(frame, { ...STAND, lean: 6, armNear: stir, armFar: smoke > 0.5 ? [120, 40] : [10, 20] }, 0)}
        handNear="grip"
        handFar={smoke > 0.5 ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={smoke > 0.5 ? 'wide' : t > 12 ? 'happy' : 'open'}
        brow={smoke > 0.5 && t < 11 ? 'raised' : 'none'}
        mouth={smoke > 0.5 && t < 11 ? 'o' : laugh ? 'grin' : 'smile'}
        turn={t > 10 ? -0.4 : 0.3}
        look={t > 10 ? [-12, 0] : [6, 6]}
        blinkAmt={blink(frame, 8)}
      />
    </Stage>
  );
};

// 174–187 s. The mirror of the hook: same phone, same spot, "Mom" calling. This time: Accept.
// Then split: him on his couch, her at her table, both talking, both smiling.
export const PickUp: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { pickRing: r, pickTap: tap, pickSplit: sp } = BEATS;
  const ringing = t < tap;
  if (t < sp) {
    return (
      <Stage fade={sceneFade(frame, dur, 8, 0)} zoom={keys(frame, [0, tap, sp], [1.0, 1.06, 1.12])} focus={[960, 470]}>
        <rect width={1920} height={1080} fill="#0C0B09" />
        <Glow x={960} y={540} r={900} color={ringing ? GREEN : C.amber} opacity={ringing ? 0.12 : 0.16} />
        <CallCloseUp
          frame={frame}
          phase={ringing ? 'incoming' : 'connected'}
          side="accept"
          press={keys(frame, [tap - 0.15, tap, tap + 0.2], [0, 1, 0])}
          thumb={keys(frame, [r, tap - 0.1, tap + 0.5, tap + 1.2], [0, 1, 1, 0])}
          buzz={ringing ? 1 : 0}
          glow={C.amber}
          seconds={(t - tap) * 1}
        />
      </Stage>
    );
  }
  const s = 1.06;
  const hy = sitY(SOFA.seat, s);
  const hx = 980;
  const ms = 1.06;
  const { x: mx, y: my } = momSeat(ms);
  const laugh = (t > 6.4 && t < 8.4) || t > 10.6;
  const his = (
    <g>
      <Room wall="#14161B" />
      <WindowCity x={1300} y={240} night={false} />
      <Sofa x={700} />
      <Character x={hx} y={hy} scale={s} pose={idle(frame, { ...SIT, armNear: ear(hx, hy, s) }, 0)} nearItem={EarPhone} breathe={frame} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 1)} turn={0.3} blinkAmt={blink(frame, 5)} />
    </g>
  );
  const hers = (
    <MomDining frame={frame} onTable={<TablePlates frame={frame} his={false} />}>
      <Character
        x={mx}
        y={my}
        scale={ms}
        variant="mom"
        pose={idle(frame, { ...MOM_SIT, armNear: ear(mx, my, ms) }, 2)}
        nearItem={EarPhone}
        breathe={frame}
        eyes={laugh ? 'happy' : 'open'}
        mouth={laugh ? 'grin' : talkMouth(frame + 40, 3)}
        blush={0.5}
        turn={0.3}
        blinkAmt={blink(frame, 40)}
      />
    </MomDining>
  );
  return (
    <Stage fade={sceneFade(frame, dur, 0, 12)} zoom={tween(frame, sp, 13, 1.0, 1.04)}>
      <Split left={his} right={hers} labels={['HIM · SUNDAY', 'MOM · SUNDAY']} focus={[[980, 620], [880, 620]]} zoom={[1.2, 1.2]} />
    </Stage>
  );
};

// 187–194 s. Sunday at her table again. This time, his chair isn't empty.
export const Final: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ms = 1.06;
  const s = 1.08;
  const { x: mx, y: my } = momSeat(ms);
  const hx = DINING.himX;
  const hy = sitY(CHAIR.seat, s);
  const laugh = t > 1.6 && t < 4.4;
  const bob = laugh ? -Math.abs(Math.sin(t * 8)) * 4 : 0;
  return (
    <Stage fade={sceneFade(frame, dur, 12, 18)} zoom={tween(frame, 0, 7, 1.1, 1.02)} focus={[960, 540]}>
      <MomDining frame={frame} onTable={<TablePlates frame={frame} steam={1} />}>
        <Character x={mx} y={my} scale={ms} variant="mom" pose={idle(frame, { ...MOM_SIT, bob }, 2)} breathe={frame} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : 'smile'} blush={0.5} turn={0.3} blinkAmt={blink(frame, 40)} />
        <Character x={hx} y={hy} scale={s} facing={-1} pose={idle(frame, { ...SIT, armNear: [40, 70], bob }, 0)} breathe={frame} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 1)} turn={0.3} blinkAmt={blink(frame, 5)} />
      </MomDining>
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
        <Head x={880} y={380} scale={1.0} eyes="happy" mouth="smile" />
        <Head x={1040} y={390} scale={0.92} variant="mom" eyes="happy" mouth="smile" blush={0.5} />
        <text x={960} y={640} textAnchor="middle" fontFamily={HAND} fontSize={104} letterSpacing="0.12em" fill={C.text}>
          THE M1ND FRAME
        </text>
      </g>
      <text x={960} y={730} textAnchor="middle" fontFamily={HAND} fontSize={50} letterSpacing="0.04em" fill={C.amber} opacity={b}>
        Call her back.
      </text>
    </Stage>
  );
};
