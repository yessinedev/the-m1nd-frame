import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, SIT, STAND, idle, mixLimb, reachArm, talkMouth } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Desk, DESK, Glow, Laptop, Phone, Room, Stool, WallClock } from '../../../kit/props';
import { BigPhone, Chair, CHAIR, Kitchen, KITCHEN, Pendant, PhoneHands, TABLE } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { CafeTable } from '../../../kit/props4';
import { CallLog, Cake, MomChat, Split } from '../../../kit/props8';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';
import { CallCloseUp, DINING, EarPhone, MOM_SIT, MomDining, TablePlates, ear, momSeat } from './shared';

const GREEN = '#4FBF73';

// 0–4.5 s. THE HOOK. No fade-in: frame 0 is already the ringing phone, "Mom", buzzing.
// His thumb lands on Decline at 1.7 s; the ring cuts dead and the screen goes dark.
export const Hook: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const tap = BEATS.hookTap;
  const ringing = t < tap;
  return (
    <Stage fade={sceneFade(frame, dur, 0, 8)} zoom={keys(frame, [0, tap, dur / FPS], [1.0, 1.08, 1.16])} focus={[960, 470]}>
      <rect width={1920} height={1080} fill="#08090C" />
      <Glow x={960} y={540} r={900} color={ringing ? GREEN : C.red} opacity={ringing ? 0.12 + Math.sin(frame * 0.5) * 0.04 : tween(frame, tap, tap + 1.2, 0.18, 0.04)} />
      <CallCloseUp
        frame={frame}
        phase={ringing ? 'incoming' : 'declined'}
        side="decline"
        press={keys(frame, [tap - 0.15, tap, tap + 0.2], [0, 1, 0])}
        thumb={keys(frame, [0.7, tap - 0.1, tap + 0.5, tap + 1.2], [0, 1, 1, 0])}
        buzz={ringing ? 1 : 0}
        off={tween(frame, tap + 1.4, tap + 2.2, 0, 1)}
      />
    </Stage>
  );
};

const LOG_DATES = (() => {
  const months = ['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan'];
  return Array.from({ length: 47 }).map((_, i) => `${months[Math.floor(i / 4)]} ${28 - ((i * 7) % 27)}`);
})();

// 4.5–11 s. Recents: 47 rows of "Mom · Declined", flicking past, then a slow stop.
export const Log: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const end = 47 * 118 + 180 - 900;
  return (
    <Stage fade={sceneFade(frame, dur, 6, 14)} zoom={tween(frame, 0, 6.5, 1.0, 1.06)} focus={[960, 400]}>
      <rect width={1920} height={1080} fill="#08090C" />
      <PhoneShell x={960} y={545} h={980} glow={C.red}>
        {(sw, sh) => <CallLog sw={sw} sh={sh} scroll={keys(frame, [0.2, 3.0, 4.2], [0, end * 0.85, end])} dates={LOG_DATES} />}
      </PhoneShell>
      <PhoneHands x={960} y={545} h={980} thumbY={keys(frame, [0, 0.4, 0.8, 1.2, 1.6, 2.4], [80, -160, 80, -160, 80, 200])} thumbX={-40} />
    </Stage>
  );
};

// A ringing phone lying flat: pulsing glow.
const flatRing = (frame: number, ringing: boolean) => (ringing ? 0.6 + Math.sin(frame * 0.6) * 0.35 : 0);

// 11–22 s. Same minute, two places. He's typing; his phone lights up; he turns it face down
// without looking. Across town, she lowers her phone and smiles anyway.
export const Busy: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const flip = BEATS.busyFlip;
  const ringing = t > 0.3 && t < flip;
  const s = 1.1;
  const stoolTop = FLOOR - 165;
  const himY = sitY(stoolTop, s);
  const body = { x: 720, y: himY, scale: s, lean: 10 };
  const typing = reachArm(980 + Math.sin(frame * 1.2) * 8, DESK.top - 10, body);
  const toPhone = reachArm(1210, DESK.top - 12, body);
  const reach = keys(frame, [flip - 0.5, flip, flip + 0.5], [0, 1, 0]);

  const ms = 1.05;
  const momX = 900;
  const momY = standY(ms);
  const lower = tween(frame, flip + 0.3, flip + 1.1, 1, 0);
  const momArm = mixLimb([-4, 10], ear(momX, momY, ms), lower);

  const his = (
    <g>
      <Room wall="#12151B" />
      <WallClock x={1180} y={300} minutes={134} />
      <Desk x={840} />
      <Laptop x={1020} y={DESK.top - 2} on={0.8} />
      <Phone x={1210} y={DESK.top - 2} on={flatRing(frame, ringing)} color={GREEN} flat />
      <Stool x={720} top={stoolTop} />
      <Character
        x={720}
        y={himY}
        scale={s}
        pose={{ ...SIT, legFar: [52, 48], legNear: [46, 44], armNear: mixLimb(typing, toPhone, reach), armFar: [50, 70], lean: 10 }}
        breathe={frame}
        eyes="open"
        brow="focused"
        mouth="flat"
        look={[10, 2]}
        eyeGlow={C.screen}
        blinkAmt={blink(frame, 9)}
      />
    </g>
  );
  const hers = (
    <g>
      <Room wall="#1A1714" />
      <Kitchen x={-20} w={1960} frame={frame} steam={0.6} />
      <Pendant x={900} y={170} on={1} />
      <Character
        x={momX}
        y={momY}
        scale={ms}
        variant="mom"
        pose={idle(frame, { ...STAND, armNear: momArm }, 2)}
        nearItem={lower > 0.3 ? EarPhone : undefined}
        breathe={frame}
        eyes={t > flip + 0.4 ? 'down' : 'open'}
        brow={t > flip + 0.4 ? 'sad' : 'raised'}
        mouth={t > flip + 1.4 ? 'smile' : t > flip ? 'flat' : 'smile'}
        turn={0.25}
        blinkAmt={blink(frame, 40)}
      />
      {lower < 0.3 ? <Phone x={1060} y={KITCHEN.top} flat on={0} /> : null}
    </g>
  );
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 11, 1.0, 1.04)}>
      <Split left={his} right={hers} labels={['HIM · 2:14 PM', 'MOM · 2:14 PM']} focus={[[930, 620], [930, 600]]} zoom={[1.12, 1.12]} />
    </Stage>
  );
};

// 22–33 s. The thread. Her long messages; his "busy. later".
export const Texts: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const m = BEATS.chatMsgs;
  const typing = keys(frame, [m[4] - 1.2, m[4] - 1.0, m[4] - 0.2, m[4]], [0, 1, 1, 0]);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 11, 1.0, 1.08)} focus={[960, 600]}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={545} h={980}>
        {(sw, sh) => (
          <MomChat
            sw={sw}
            sh={sh}
            frame={frame}
            msgs={[
              { from: 'them', text: 'did you eat today?', at: f(m[0]) },
              { from: 'them', text: 'I made your favorite on Sunday. I saved you a plate', at: f(m[1]) },
              { from: 'them', text: 'your aunt asked about you. I told her you are doing so well. I am proud of you', at: f(m[2]) },
              { from: 'them', text: 'call me when you can. no rush', at: f(m[3]) },
              { from: 'me', text: 'busy. later', at: f(m[4]), seen: true },
              { from: 'them', text: 'ok. love you', at: f(m[5]) },
            ]}
          />
        )}
      </PhoneShell>
      <PhoneHands x={960} y={545} h={980} thumbY={470 - typing * 90 + Math.sin(frame * 1.4) * 10 * typing} thumbX={-60} />
    </Stage>
  );
};

// 33–44 s. Café with Sam and Jay, mid-laugh. "Mom" lights up on the table; he flips it face down
// without even looking, and keeps laughing.
export const Friends: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const y = sitY(CHAIR.seat, s);
  const himX = 700;
  const samX = 1220;
  const { cafeRing: r, cafeFlip: fl } = BEATS;
  const ringing = t > r && t < fl;
  const phone = { x: 840, y: FLOOR - 252 };
  const toPhone = reachArm(phone.x, phone.y - 6, { x: himX, y, scale: s, lean: 10 });
  const reach = keys(frame, [fl - 0.4, fl, fl + 0.5], [0, 1, 0]);
  const laugh = (t > 0.4 && t < 3.6) || (t > fl + 0.6 && t < fl + 3.4);
  const bob = laugh ? -Math.abs(Math.sin(t * 9)) * 4 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, r, r + 0.6, fl + 0.8, fl + 1.8, 11], [1.1, 1.12, 1.6, 1.6, 1.16, 1.2])} focus={[keys(frame, [r, r + 0.6, fl + 0.8, fl + 1.8], [960, 840, 840, 960]), keys(frame, [r, r + 0.6, fl + 0.8, fl + 1.8], [540, 520, 520, 540])]}>
      <Room wall="#1C1915" />
      <Glow x={960} y={300} r={600} color={C.amber} opacity={0.15} />
      <Chair x={690} facing={1} />
      <Chair x={1230} facing={-1} />
      <Character x={1000} y={standY(s) - 30} scale={s * 0.92} variant="jay" facing={-1} pose={idle(frame, { ...STAND, bob }, 3)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 5)} turn={0.2} />
      <Character
        x={himX}
        y={y}
        scale={s}
        pose={idle(frame, { ...SIT, armNear: mixLimb([40, 70], toPhone, reach), armFar: [34, 64], lean: 8 + reach * 6, bob }, 0)}
        handNear={reach > 0.5 ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={laugh ? 'happy' : 'open'}
        mouth={laugh ? 'grin' : 'smile'}
        turn={0.35}
        blinkAmt={blink(frame, 16)}
      />
      <Character x={samX} y={y} scale={s} facing={-1} variant="sam" pose={idle(frame, { ...SIT, armNear: [40, 70], bob }, 2)} breathe={frame + 6} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 1)} turn={0.3} />
      <CafeTable x={960} />
      <Phone x={phone.x} y={phone.y} flat on={flatRing(frame, ringing)} color={GREEN} />
      {ringing ? (
        <text x={phone.x} y={phone.y - 46} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={GREEN} opacity={0.6 + Math.sin(frame * 0.6) * 0.4}>
          Mom
        </text>
      ) : null}
    </Stage>
  );
};

// 44–56 s. Sunday at her table. Two plates. She calls; it rings out. She looks at his empty chair
// while the steam over his plate thins out to nothing.
export const Sunday: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ms = 1.06;
  const { x, y } = momSeat(ms);
  const { sundayDial: d, sundayLower: lo, sundayCover: cv } = BEATS;
  const up = keys(frame, [d, d + 0.5, lo, lo + 0.6], [0, 1, 1, 0]);
  const looks = t > cv - 1;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.08, 1.2)} focus={[960, 560]}>
      <MomDining frame={frame} night onTable={<TablePlates frame={frame} steam={tween(frame, 2, 11, 1, 0)} />}>
        <Character
          x={x}
          y={y}
          scale={ms}
          variant="mom"
          pose={idle(frame, { ...MOM_SIT, armNear: mixLimb(MOM_SIT.armNear, ear(x, y, ms), up), tilt: looks ? 6 : 0 }, 2)}
          nearItem={up > 0.3 ? EarPhone : undefined}
          breathe={frame}
          eyes={looks ? 'down' : 'open'}
          brow={t > lo ? 'sad' : 'raised'}
          mouth={t > cv + 1 ? 'smile' : 'flat'}
          turn={0.3}
          look={looks ? [10, 4] : [6, 0]}
          blinkAmt={blink(frame, 40)}
        />
      </MomDining>
      <Phone x={DINING.momPlate - 90} y={TABLE.top} flat on={0} />
    </Stage>
  );
};

// 56–68 s. Her birthday. One candle. A text: "happy bday mom". Her whole face lights up.
// She calls to say thank you. It rings out.
export const Birthday: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ms = 1.06;
  const { x, y } = momSeat(ms);
  const { bdayText: tx, bdayDial: d, bdayLower: lo } = BEATS;
  const read = keys(frame, [tx + 0.4, tx + 1.0, d - 0.6, d], [0, 1, 1, 0]);
  const call = keys(frame, [d, d + 0.5, lo, lo + 0.6], [0, 1, 1, 0]);
  const readArm = reachArm(x + 120, y - 200 * ms, { x, y, scale: ms });
  const arm = call > 0 ? mixLimb(MOM_SIT.armNear, ear(x, y, ms), call) : mixLimb(MOM_SIT.armNear, readArm, read);
  const holding = read > 0.3 || call > 0.3;
  const glad = t > tx + 0.8 && t < d + 0.6;
  const bubble = keys(frame, [tx, tx + 0.4, d - 0.8, d - 0.4], [0, 1, 1, 0]);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.2, 1.34)} focus={[860, 520]}>
      <MomDining frame={frame} night lamp={0.6} onTable={<Cake x={DINING.momPlate + 30} y={TABLE.top} lit={1} frame={frame} />}>
        <Character
          x={x}
          y={y}
          scale={ms}
          variant="mom"
          pose={idle(frame, { ...MOM_SIT, armNear: arm }, 2)}
          nearItem={holding ? <Phone x={4} y={-22} on={call > 0.3 ? 0.4 : 0.9} rotate={call > 0.3 ? -60 : -12} scale={0.9} /> : undefined}
          breathe={frame}
          eyes={glad ? 'happy' : t > lo ? 'down' : 'open'}
          brow={t > lo ? 'sad' : 'none'}
          mouth={glad ? 'grin' : t > lo + 1 ? 'smile' : 'flat'}
          blush={glad ? 0.8 : 0.2}
          tear={glad ? tween(frame, tx + 2, tx + 5.5, 0, 0.95) : 0}
          turn={0.3}
          look={read > 0.5 ? [10, 6] : [6, 0]}
          blinkAmt={blink(frame, 40)}
        />
      </MomDining>
      <g opacity={bubble} transform={`translate(${x + 300} ${y - 430}) scale(${0.9 + bubble * 0.1})`}>
        <rect x={-170} y={-50} width={340} height={84} rx={30} fill="#3D5A80" />
        <path d="M -110 30 L -140 64 L -70 34 Z" fill="#3D5A80" />
        <text x={0} y={6} textAnchor="middle" fontFamily={HAND} fontSize={40} fill={C.text}>
          happy bday mom
        </text>
      </g>
    </Stage>
  );
};

// 68–80 s. 1:12 AM, his lock screen. "New voicemail · 0:41". He swipes it away, unheard.
export const VoicemailNotice: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { vmNotice: n, vmSwipe: sw } = BEATS;
  const swipe = keys(frame, [sw - 0.6, sw - 0.3, sw + 0.2], [0, 0, 1]);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.45, 1.6)} focus={[960, 300]}>
      <rect width={1920} height={1080} fill="#07080B" />
      <BigPhone
        x={960}
        y={560}
        h={900}
        mode="lock"
        frame={frame}
        clock="1:12"
        notices={[
          { name: 'Mom', text: 'Missed call', appear: f(0.2) },
          { name: 'Mom', text: 'New voicemail · 0:41', appear: f(n), gone: f(sw) },
        ]}
      />
      <PhoneHands x={960} y={560} h={900} thumbY={keys(frame, [0, sw - 0.6], [360, -61])} thumbX={60 - swipe * 300} />
    </Stage>
  );
};

// 80–92 s. December, near midnight, in bed. Call 47 lights up his face. Decline.
// He puts the phone face down on his chest and closes his eyes.
export const Last: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { lastRing: r, lastTap: tp } = BEATS;
  const ringing = t > r && t < tp;
  const down = tween(frame, tp + 1.4, tp + 2.2, 0, 1);
  const px = BR.headX + 40;
  const py = BR.headY - 150 + down * 110;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, r, tp, 12], [1.3, 1.5, 1.8, 1.85])} focus={[BR.headX + 50, BR.headY - 80]}>
      <Bedroom
        frame={frame}
        sky="night"
        clock="23:52"
        phoneOnStand={false}
        lying={{
          eyes: t > tp + 3 ? 'closed' : ringing ? 'open' : 'tired',
          brow: ringing ? 'raised' : t > tp ? 'sad' : 'none',
          mouth: 'flat',
          look: [8, -10],
          eyeGlow: ringing ? GREEN : C.screen,
          blinkAmt: blink(frame, 20),
        }}
      >
        <Phone x={px} y={py} on={down > 0.6 ? 0 : ringing ? 0.7 + Math.sin(frame * 0.6) * 0.3 : 0.9} color={ringing ? GREEN : C.screen} rotate={-8 + (ringing ? Math.sin(frame * 2.1) * 3 : 0)} scale={1.3} />
        <circle cx={px - 30} cy={py + 34} r={20} fill={C.skin} />
        <circle cx={px + 34} cy={py + 30} r={20} fill={C.skin} />
        {ringing ? (
          <text x={px} y={py - 86} textAnchor="middle" fontFamily={HAND} fontSize={42} fill={GREEN} opacity={0.6 + Math.sin(frame * 0.6) * 0.4}>
            Mom
          </text>
        ) : null}
      </Bedroom>
    </Stage>
  );
};
