import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { Character, Head, SIT, STAND, idle, mixLimb, reachArm, run, talkMouth, walk } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Calendar, Desk, DESK, Glow, Lamp, Phone, Room, Stool, Window } from '../../../kit/props';
import { Chair, CHAIR, Envelope, Mug, Park, PhoneHands, Sofa, SOFA, WindowCity } from '../../../kit/props2';
import { PhoneShell, Polaroid } from '../../../kit/props3';
import { CafeTable, MusicNotes } from '../../../kit/props4';
import { StickyNote } from '../../../kit/props7';
import { LockScreen, LockNotice } from '../../../kit/props10';
import { DrawerCloseUp, Guitar, HomeScreen } from '../../../kit/props11';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';
import { TopPhone } from './act1';

// His desk in profile, with the locked drawer under the top. `glow` pulses red from the seam.
const DRAWER = { x: 1140, w: 190, y: DESK.top + 30, h: 70 };
const LockedDesk: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <g>
    <Desk x={900} />
    {glow > 0 ? <Glow x={DRAWER.x + DRAWER.w / 2} y={DRAWER.y + DRAWER.h} r={220} color={C.red} opacity={glow * 0.45} sy={0.5} /> : null}
    <rect x={DRAWER.x} y={DRAWER.y} width={DRAWER.w} height={DRAWER.h} rx={6} fill={C.furnitureLight} stroke={C.line} strokeWidth={3} />
    <circle cx={DRAWER.x + DRAWER.w / 2} cy={DRAWER.y + DRAWER.h / 2} r={8} fill="#B9A27A" />
    {glow > 0 ? <line x1={DRAWER.x + 6} x2={DRAWER.x + DRAWER.w - 6} y1={DRAWER.y + 2} y2={DRAWER.y + 2} stroke={C.red} strokeWidth={3} opacity={glow} /> : null}
  </g>
);
const KeyItem = (
  <g transform="translate(8 -6) rotate(-30)">
    <rect x={-4} y={-30} width={8} height={30} rx={3} fill="#D8C08A" />
    <circle cx={0} cy={-40} r={14} fill="#D8C08A" />
    <circle cx={0} cy={-40} r={5} fill="#4A3F33" />
  </g>
);

// 75–89 s. Day 45, 2 AM. He stands at the desk with the key. The drawer seems to glow.
// His hand shakes. Then he drops the key in the mug and walks away.
export const Hard: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const [s0, s1] = BEATS.shake;
  const back = BEATS.keyBack;
  const x = t < back + 0.8 ? 920 : 920 - (t - back - 0.8) * 160;
  const shake = t > s0 && t < s1 ? wobble(frame, 3, 1.6) * 4 * tween(frame, s0, s1 - 1, 0.4, 1) : 0;
  const toLock = reachArm(DRAWER.x - 20, DRAWER.y + DRAWER.h / 2 + shake, { x, y: standY(s), scale: s, lean: 8 });
  const toMug = reachArm(1000, DESK.top - 50, { x, y: standY(s), scale: s, lean: 4 });
  const near = keys(frame, [s0 - 1, s0, s1 - 0.6, s1], [0, 1, 1, 0]);
  const drop = keys(frame, [s1 - 0.2, back - 0.2, back + 0.3, back + 0.8], [0, 1, 1, 0]);
  const arm = drop > 0 ? mixLimb([-4, 10], toMug, drop) : mixLimb([40, 60], toLock, near);
  const leaving = t > back + 0.8;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, s0, s1, 14], [1.1, 1.3, 1.45, 1.2])} focus={[1040, 560]}>
      <Room wall="#101216" />
      <Window x={400} y={200} sky="night" />
      <LockedDesk glow={t < back ? 0.5 + Math.sin(frame * 0.25) * 0.4 : tween(frame, back, back + 1.5, 0.5, 0)} />
      <Mug x={1000} y={DESK.top} />
      <Character
        x={x}
        y={standY(s)}
        scale={s}
        facing={leaving ? -1 : 1}
        pose={leaving ? walk(frame, 0.6) : idle(frame, { ...STAND, armNear: arm, lean: near * 8 }, 0)}
        handNear="grip"
        nearItem={t < back ? KeyItem : undefined}
        breathe={frame}
        eyes={t < back ? 'wide' : 'closed'}
        brow={t < back ? 'worried' : 'none'}
        mouth={t < back ? 'flat' : 'smile'}
        sweat={t > s0 + 2 && t < back}
        look={[12, 8]}
        turn={0.3}
        blinkAmt={blink(frame, 7)}
      />
    </Stage>
  );
};

// 89–103 s. Day 60. A guitar on his lap. Clumsy chords, a wince, then it starts to sound like music.
export const GuitarScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const x = 860;
  const top = FLOOR - 165;
  const y = sitY(top, s);
  const good = t > 6;
  const strum = Math.abs(Math.sin(frame * (good ? 0.45 : 0.25)));
  const strumArm = reachArm(x + 70, y - 70 - strum * 30, { x, y, scale: s, lean: 8 });
  const fret = reachArm(x + 280, y - 170, { x, y, scale: s, lean: 8, side: 'far' });
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.24, 1.36)} focus={[980, 560]}>
      <Room wall="#1A1714" />
      <Lamp x={1400} y={FLOOR - 200} on={1} />
      <Glow x={1300} y={500} r={600} color={C.amber} opacity={0.12} />
      <Stool x={x} top={top} />
      <Character
        x={x}
        y={y}
        scale={s}
        pose={idle(frame, { ...SIT, armNear: strumArm, armFar: fret, lean: 8, headY: 4 }, 0)}
        handNear="relaxed"
        handFar="grip"
        breathe={frame}
        eyes={good ? 'closed' : 'down'}
        brow={good ? 'none' : t > 2.6 && t < 4 ? 'worried' : 'focused'}
        mouth={good ? 'smile' : t > 2.6 && t < 4 ? 'frown' : 'flat'}
        look={[10, 8]}
        turn={0.3}
        blinkAmt={blink(frame, 8)}
      />
      <Guitar x={x + 70} y={y - 40} scale={0.9} strum={strum} />
      {good ? <MusicNotes x={x + 120} y={y - 260} frame={frame} opacity={tween(frame, 6, 7, 0, 1)} color={C.amber} /> : null}
    </Stage>
  );
};

// 103–115 s. Day 89, night. The calendar nearly full. He sits by the desk, turning the key over.
export const Eve: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.08;
  const x = 820;
  const top = FLOOR - 165;
  const y = sitY(top, s);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.12, 1.24)} focus={[980, 520]}>
      <Room wall="#14161A" />
      <Calendar x={560} y={160} marks={Array.from({ length: 35 }).map((_, i) => -i - 1)} frame={frame} />
      <Lamp x={1380} y={DESK.top} on={0.8} />
      <LockedDesk />
      <Stool x={x} top={top} />
      <Character
        x={x}
        y={y}
        scale={s}
        pose={idle(frame, { ...SIT, armNear: [70 + Math.sin(frame * 0.08) * 8, 100], armFar: [40, 70], lean: 10 }, 0)}
        handNear="grip"
        nearItem={KeyItem}
        breathe={frame}
        eyes="down"
        brow="worried"
        mouth="flat"
        look={[10, 6]}
        turn={0.3}
        blinkAmt={blink(frame, 20)}
      />
    </Stage>
  );
};

const JUNK: { title: string; text: string; icon?: 'app' }[] = [
  { title: 'Shop', text: 'FLASH SALE ends tonight!!', icon: 'app' },
  { title: 'Feed', text: '214 people liked your post', icon: 'app' },
  { title: 'Clips', text: 'You might like this', icon: 'app' },
  { title: 'News', text: 'You won\'t believe what...', icon: 'app' },
  { title: 'Games', text: 'Your energy is full!', icon: 'app' },
  { title: 'Feed', text: '@kev replied: ratio', icon: 'app' },
  { title: 'Bets', text: 'Free bet waiting for you', icon: 'app' },
  { title: 'Shorts', text: 'Trending now', icon: 'app' },
  { title: 'Snaps', text: 'You have 38 new snaps', icon: 'app' },
  { title: 'Dating', text: 'Someone viewed you', icon: 'app' },
  { title: 'Shop', text: 'Items in your cart miss you', icon: 'app' },
  { title: 'Live', text: 'Your favourite is live', icon: 'app' },
  { title: 'Feed', text: 'Memories from 3 years ago', icon: 'app' },
  { title: 'News', text: 'Everyone is talking about', icon: 'app' },
];

// The close-up phone, dropped low so top captions sit above it.
const Close: React.FC<{ children: (sw: number, sh: number) => React.ReactNode; glow?: string; tap?: number }> = ({ children, glow = C.screen, tap = 0 }) => (
  <>
    <PhoneShell x={960} y={660} h={980} glow={glow}>
      {children}
    </PhoneShell>
    <PhoneHands x={960} y={660} h={980} thumbY={470 - tap * 160} thumbX={-40} />
  </>
);

// 115–131 s. Day 90. The key turns back, the drawer opens, the phone is dark. Power on.
// Then the flood.
export const Unlock: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { unlockKey, powerOn, flood } = BEATS;
  const cut = 3.0;
  if (t < cut) {
    const turn = tween(frame, unlockKey - 0.4, unlockKey, 1, 0);
    const open = tween(frame, unlockKey + 0.3, unlockKey + 1.1, 0, 1);
    return (
      <Stage fade={sceneFade(frame, dur, 12, 0)} zoom={tween(frame, 0, cut, 1.04, 1.12)} focus={[960, 640]}>
        <DrawerCloseUp open={open} keyTurn={turn}>
          <TopPhone x={960} y={520 + 300 * open * 0.55} on={0} rotate={-6} scale={0.85} />
        </DrawerCloseUp>
      </Stage>
    );
  }
  const on = t > powerOn;
  const logo = keys(frame, [powerOn, powerOn + 0.2, flood[0] - 0.2, flood[0]], [0, 1, 1, 0]);
  const n = (frame - f(flood[0])) / FPS;
  const notices: LockNotice[] = Array.from({ length: 40 }).map((_, i) => ({ ...JUNK[i % JUNK.length], appear: f(flood[0] + i * 0.26) }));
  return (
    <Stage fade={sceneFade(frame, dur, 0, 10)} zoom={tween(frame, cut, 16, 1.0, 1.06)} focus={[960, 300]} shake={[n > 0 && n < 5 ? Math.sin(frame * 2.3) * 2 : 0, 0]}>
      <rect width={1920} height={1080} fill="#07080B" />
      {on && t > flood[0] ? <Glow x={960} y={600} r={900} color={C.red} opacity={0.18} /> : null}
      <Close glow={on ? C.red : '#000000'}>
        {(sw, sh) =>
          !on ? (
            <rect width={sw} height={sh} fill="#030304" />
          ) : t < flood[0] ? (
            <g>
              <rect width={sw} height={sh} fill="#030304" />
              <circle cx={sw / 2} cy={sh * 0.42} r={56} fill="none" stroke="#E9E6DF" strokeWidth={10} opacity={logo} />
            </g>
          ) : (
            <LockScreen sw={sw} sh={sh} frame={frame} clock="09:00" date="Day 90" notices={notices} />
          )
        }
      </Close>
    </Stage>
  );
};

// 131–145 s. He reads them all: junk. Then the fridge: Mom's letter, the café Polaroid,
// "Sat 10 · café". The ones that mattered had already found him.
export const Mattered: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cut = 9.4;
  if (t < cut) {
    const notices: LockNotice[] = Array.from({ length: 30 }).map((_, i) => ({ ...JUNK[(i + 5) % JUNK.length], appear: f(-1 + i * 0.32) }));
    return (
      <Stage fade={sceneFade(frame, dur, 8, 0)} zoom={1.06} focus={[960, 300]}>
        <rect width={1920} height={1080} fill="#07080B" />
        <Close glow={C.red} tap={Math.abs(Math.sin(frame * 0.2)) * 0.8}>
          {(sw, sh) => <LockScreen sw={sw} sh={sh} frame={frame} clock="09:14" date="Day 90" notices={notices} />}
        </Close>
      </Stage>
    );
  }
  return (
    <Stage fade={sceneFade(frame, dur, 0, 12)} zoom={tween(frame, cut, 14, 1.0, 1.1)} focus={[960, 520]}>
      <rect width={1920} height={1080} fill="#15130F" />
      <rect x={300} y={0} width={1320} height={1080} fill="#3A3630" stroke={C.line} strokeWidth={6} />
      <rect x={1520} y={420} width={30} height={260} rx={14} fill="#5A554C" />
      <Glow x={960} y={300} r={900} color={C.amber} opacity={0.15} />
      <Envelope x={640} y={430} scale={2.6} rotate={-6} />
      <text x={640} y={620} textAnchor="middle" fontFamily={HAND} fontSize={44} fill="#E9E3D6" transform="rotate(-6 640 620)">
        love, Mom
      </text>
      <Polaroid x={1000} y={400} scale={1.5} rotate={4} caption="sat 10am" />
      <StickyNote x={1320} y={560} text={['Sat 10', 'same café']} scale={0.9} rotate={5} />
      <circle cx={640} cy={330} r={14} fill={C.red} />
      <circle cx={1000} cy={250} r={14} fill="#3D5A80" />
    </Stage>
  );
};

// 145–161 s. The home screen. The apps that were using him wiggle, and go one by one.
export const Delete: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tap = BEATS.removes.reduce((m, r) => Math.max(m, keys(frame, [r - 0.25, r, r + 0.2], [0, 1, 0])), 0);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 16, 1.02, 1.08)} focus={[960, 320]}>
      <rect width={1920} height={1080} fill="#07080B" />
      <Close glow="#3D5A80" tap={tap}>
        {(sw, sh) => <HomeScreen sw={sw} sh={sh} frame={frame} removeAt={BEATS.removes.map((r) => f(r))} wiggle={frame < f(BEATS.removes[BEATS.removes.length - 1] + 0.6)} />}
      </Close>
    </Stage>
  );
};

// 161–176 s. After: Saturday at the café, phone face down; a run at dawn; guitar for the squad.
export const After: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [, p1, p2] = BEATS.parts;
  const part = t < p1 ? 0 : t < p2 ? 1 : 2;
  const dip = Math.min(keys(frame, [p1 - 0.25, p1, p1 + 0.25], [1, 0.2, 1]), keys(frame, [p2 - 0.25, p2, p2 + 0.25], [1, 0.2, 1]));
  const s = 1.06;
  const laugh = Math.sin(t * 1.3) > 0;
  let body: React.ReactNode;
  if (part === 0) {
    const y = sitY(CHAIR.seat, s);
    body = (
      <>
        <Room wall="#1C1915" />
        <Glow x={960} y={300} r={600} color={C.amber} opacity={0.2} />
        <Chair x={690} facing={1} />
        <Chair x={1230} facing={-1} />
        <Character x={700} y={y} scale={s} pose={idle(frame, { ...SIT, armNear: [40, 70] }, 0)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 1)} turn={0.35} />
        <Character x={1220} y={y} scale={s} facing={-1} variant="jay" pose={idle(frame, { ...SIT, armNear: [40, 70] }, 2)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : talkMouth(frame, 3)} turn={0.3} />
        <CafeTable x={960} />
        <Phone x={860} y={FLOOR - 252} flat on={0} />
        <Mug x={1040} y={FLOOR - 250} steam={1} frame={frame} />
      </>
    );
  } else if (part === 1) {
    body = (
      <>
        <Park offset={frame * 9} sunY={460} light="dawn" />
        <Character x={900} y={standY(s)} scale={s} pose={run(frame, 0.9)} eyes="open" brow="focused" mouth="smile" turn={0.3} handNear="fist" handFar="fist" />
      </>
    );
  } else {
    const x = 760;
    const y = sitY(FLOOR - 165, s);
    const strum = Math.abs(Math.sin(frame * 0.45));
    body = (
      <>
        <Room wall="#15171C" />
        <WindowCity x={1440} y={220} night />
        <Glow x={900} y={400} r={700} color={C.amber} opacity={0.16} />
        <Sofa x={1000} />
        <Stool x={x} top={FLOOR - 165} />
        <Character x={x} y={y} scale={s} pose={idle(frame, { ...SIT, armNear: reachArm(x + 70, y - 70 - strum * 30, { x, y, scale: s, lean: 8 }), armFar: reachArm(x + 280, y - 170, { x, y, scale: s, lean: 8, side: 'far' }), lean: 8 }, 0)} handFar="grip" eyes="closed" mouth="smile" turn={0.3} />
        <Guitar x={x + 70} y={y - 40} scale={0.9} strum={strum} />
        <MusicNotes x={x + 120} y={y - 260} frame={frame} color={C.amber} />
        <Character x={1220} y={sitY(SOFA.seat, s)} scale={s} facing={-1} variant="sam" pose={idle(frame, SIT, 2)} eyes="happy" mouth="smile" turn={0.3} />
        <Character x={1420} y={sitY(SOFA.seat, s)} scale={s} facing={-1} variant="leo" pose={idle(frame, SIT, 5)} eyes="happy" mouth="smile" turn={0.3} />
      </>
    );
  }
  return (
    <Stage fade={Math.min(sceneFade(frame, dur), dip)} zoom={1.12} focus={[980, 540]}>
      {body}
    </Stage>
  );
};

// 176–194 s. Morning light on the drawer: open, empty, the key still in the lock. Waiting for yours.
export const Final: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 14, 18)} zoom={tween(frame, 0, 18, 1.0, 1.14)} focus={[960, 640]}>
      <DrawerCloseUp open={1} keyTurn={0} />
      <rect width={1920} height={1080} fill={C.amber} opacity={0.06} />
      <Glow x={1500} y={200} r={900} color={C.amber} opacity={0.22} />
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
        Day 1 starts tonight.
      </text>
    </Stage>
  );
};
