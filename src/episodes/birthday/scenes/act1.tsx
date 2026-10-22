import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, SIT, STAND, idle, mixLimb, reachArm, walk } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Glow, Phone, Room } from '../../../kit/props';
import { Chair, CHAIR, DiningTable, Pendant, PhoneHands, TABLE, WindowCity } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { StickyNote } from '../../../kit/props7';
import { Cake } from '../../../kit/props8';
import { ChatList, FeedScreen, LockScreen, Thread } from '../../../kit/props10';
import { f, FPS } from '../../../kit/time';
import { BEATS, HIS_DATE, PEOPLE } from '../script';
import { C } from '../../../theme';

// The phone close-up every screen scene shares: same size, same spot, so the hook and its mirror rhyme.
// `low` drops the phone so the top captions sit above the clock instead of on it.
export const CloseUp: React.FC<{ children: (sw: number, sh: number) => React.ReactNode; tap?: number; glow?: string; thumbY?: number; low?: boolean }> = ({
  children,
  tap = 0,
  glow = C.screen,
  thumbY = 470,
  low = false,
}) => (
  <>
    <PhoneShell x={960} y={low ? 660 : 545} h={980} glow={glow}>
      {children}
    </PhoneShell>
    <PhoneHands x={960} y={low ? 660 : 545} h={980} thumbY={thumbY - tap * 140} thumbX={-40} />
  </>
);

export const dayTap = (frame: number, at: number[]) => at.reduce((m, k) => Math.max(m, keys(frame, [k - 0.2, k, k + 0.2], [0, 1, 0])), 0);

// 0–5 s. THE HOOK. No fade-in: frame 0 is his lock screen at 23:59, MESSAGES: 0 already up.
// At 0.6 s it flips to 00:00 and the calendar says it: your birthday. Then nothing.
export const Hook: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const flipped = t >= BEATS.hookFlip;
  return (
    <Stage fade={sceneFade(frame, dur, 0, 8)} zoom={tween(frame, 0, 5, 1.0, 1.05)} focus={[960, 300]}>
      <rect width={1920} height={1080} fill="#07080B" />
      <CloseUp low tap={keys(frame, [0, 0.2, 0.4], [0, 1, 0])}>
        {(sw, sh) => (
          <LockScreen
            sw={sw}
            sh={sh}
            frame={frame}
            clock={flipped ? '00:00' : '23:59'}
            date={flipped ? HIS_DATE : 'Wednesday, June 11'}
            notices={[{ title: 'Calendar', text: 'Today: your birthday', icon: 'cake', appear: f(BEATS.hookFlip + 0.15) }]}
          />
        )}
      </CloseUp>
    </Stage>
  );
};

const DAY_CLOCKS = ['00:14', '01:30', '03:02', '07:45', '10:20', '12:00', '15:35', '19:50', '23:41'];
const DAY_SKY = ['#141A26', '#141A26', '#141A26', '#2A3445', '#34465C', '#3A5068', '#34465C', '#241F2A', '#141A26'];

// 5–12 s. The whole day on the same lock screen. He keeps waking it. The only ping is an app.
export const Day: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const i = BEATS.dayClocks.filter((c) => t >= c).length - 1;
  return (
    <Stage fade={sceneFade(frame, dur, 0, 10)} zoom={1.05} focus={[960, 300]}>
      <rect width={1920} height={1080} fill="#07080B" />
      <CloseUp low tap={dayTap(frame, BEATS.dayClocks.slice(1))}>
        {(sw, sh) => (
          <LockScreen
            sw={sw}
            sh={sh}
            frame={frame}
            clock={DAY_CLOCKS[i]}
            date={HIS_DATE}
            sky={DAY_SKY[i]}
            notices={[
              { title: 'Calendar', text: 'Today: your birthday', icon: 'cake', appear: 0 },
              { title: 'FoodDash', text: 'Happy birthday! 20% off', icon: 'app', appear: f(BEATS.appPing) },
            ]}
          />
        )}
      </CloseUp>
    </Stage>
  );
};

// His table: a chair each side. `children` (people) draw between chairs and table.
export const TABLE_AT = { x: 760, w: 420, him: 712, right: 1228, cake: 975 };

export const Apartment: React.FC<{ frame: number; lamp?: number; children?: React.ReactNode; onTable?: React.ReactNode; chairs?: boolean }> = ({ lamp = 0.6, children, onTable, chairs = true }) => (
  <g>
    <Room wall="#15171C" />
    <WindowCity x={1380} y={220} night />
    <Pendant x={970} y={150} on={lamp} />
    <Glow x={970} y={TABLE.top - 120} r={460} color={C.amber} opacity={0.16 * lamp} />
    {chairs ? (
      <>
        <Chair x={TABLE_AT.him - 10} facing={1} />
        <Chair x={TABLE_AT.right + 20} facing={-1} />
      </>
    ) : null}
    {children}
    <DiningTable x={TABLE_AT.x} w={TABLE_AT.w} />
    {onTable}
  </g>
);

// 12–24 s. Night. His own cake, one candle, an empty chair. The phone lies dark. He blows it out alone.
export const Alone: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const y = sitY(CHAIR.seat, s);
  const b = BEATS.blowOut;
  const lean = keys(frame, [b - 0.8, b - 0.3, b + 0.6, b + 1.2], [6, 20, 20, 6]);
  const lit = t < b ? 1 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.16, 1.3)} focus={[900, 540]}>
      <Apartment
        frame={frame}
        lamp={0.35}
        onTable={
          <>
            <Cake x={TABLE_AT.cake} y={TABLE.top} lit={lit} frame={frame} />
            {t > b && t < b + 3 ? (
              <path d={`M ${TABLE_AT.cake} ${TABLE.top - 120} q 10 -30 -4 -60 q -14 -30 4 -60`} stroke="#BFC6D6" strokeOpacity={0.4 * (1 - (t - b) / 3)} strokeWidth={4} fill="none" transform={`translate(0 ${-(t - b) * 20})`} />
            ) : null}
            <Phone x={TABLE_AT.x + 90} y={TABLE.top} flat on={0} />
          </>
        }
      >
        {lit ? <Glow x={TABLE_AT.cake} y={TABLE.top - 130} r={260} color={C.amber} opacity={0.35} /> : null}
        <Character
          x={TABLE_AT.him}
          y={y}
          scale={s}
          pose={idle(frame, { ...SIT, armNear: [40, 60], armFar: [34, 64], lean }, 0)}
          breathe={frame}
          eyes={t > b + 1.2 ? 'down' : 'open'}
          brow="sad"
          mouth={t > b - 0.4 && t < b + 0.6 ? 'o' : 'flat'}
          turn={0.3}
          look={[10, 6]}
          blinkAmt={blink(frame, 12)}
        />
      </Apartment>
    </Stage>
  );
};

// 24–36 s. The feed: Jay's 25th, Leo's new city, the road trip. Everyone busy living.
export const Feed: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const [s0, s1] = BEATS.feedScroll;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.08, 1.14)} focus={[960, 460]}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <CloseUp tap={Math.abs(Math.sin(frame * 0.08)) * 0.6}>
        {(sw, sh) => (
          <FeedScreen
            sw={sw}
            sh={sh}
            scroll={keys(frame, [s0, s0 + 2.5, s0 + 4.5, s0 + 7, s1], [0, 0, 640, 640, 1280])}
            posts={[
              { name: 'Sam', variant: 'sam', caption: "Jay's 25th. best night", people: ['sam', 'jay', 'leo'], tint: '#3A2E26' },
              { name: 'Leo', variant: 'leo', caption: 'new job, new city', people: ['leo'], tint: '#26323A' },
              { name: 'Jay', variant: 'jay', caption: 'road trip w the boys', people: ['jay', 'sam', 'leo'], tint: '#2E3A26' },
            ]}
          />
        )}
      </CloseUp>
    </Stage>
  );
};

// 36–48 s. He scrolls back through Sam's chat. Last June: "HAPPY BIRTHDAY BRO!!" at midnight.
// March: Sam's party invite. "bro?" Seen. No reply.
export const ThreadScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const m = BEATS.threadMsgs;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.2, 1.3)} focus={[960, 470]}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <CloseUp>
        {(sw, sh) => (
          <Thread
            sw={sw}
            sh={sh}
            frame={frame}
            name="Sam"
            variant="sam"
            msgs={[
              { from: 'them', text: 'HAPPY BIRTHDAY BRO!!', date: 'June 12 · 00:00', at: f(m[0]) },
              { from: 'me', text: 'thanks man', at: f(m[1]) },
              { from: 'them', text: 'my bday party sat, u coming?', date: 'March 9', at: f(m[2]) },
              { from: 'them', text: 'bro?', at: f(m[3]), seen: true },
            ]}
          />
        )}
      </CloseUp>
    </Stage>
  );
};

// 48–60 s. The chats list. One by one, the birthdays he saw and never answered.
export const Chats: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sn = BEATS.seen;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, sn[0], sn[3] + 1, 12], [1.14, 1.18, 1.26, 1.3])} focus={[960, 470]}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <CloseUp glow={C.red}>
        {(sw, sh) => (
          <ChatList
            sw={sw}
            sh={sh}
            frame={frame}
            rows={[
              { name: 'Sam', variant: 'sam', text: 'bro?', when: 'Mar 9', seenAt: f(sn[0]) },
              { name: 'Jay', variant: 'jay', text: "it's my birthday!!", when: 'May 2', seenAt: f(sn[1]) },
              { name: 'Leo', variant: 'leo', text: 'turning 25 lol', when: 'Aug 20', seenAt: f(sn[2]) },
              { name: 'Nana', variant: 'nana', text: 'Missed call (2)', when: 'Sep 9', seenAt: f(sn[3]) },
            ]}
          />
        )}
      </CloseUp>
    </Stage>
  );
};

// 60–72 s. 23:58, the last minutes of his birthday. On the edge of the bed, he lowers the phone.
export const Realize: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const x = 860;
  const y = sitY(BR.mattress, s);
  const lower = tween(frame, 5.4, 6.4, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.25, 1.5)} focus={[860, 470]}>
      <Bedroom frame={frame} sky="night" clock="23:58" phoneOnStand={false} beam={0.5}>
        <Character
          x={x}
          y={y}
          scale={s}
          pose={idle(frame, { ...SIT, armNear: mixLimb([64, 96], [30, 40], lower), armFar: [34, 50], lean: 10 + lower * 8, headY: lower * 10 }, 0)}
          nearItem={<Phone x={4} y={-22} on={0.8 - lower * 0.4} rotate={-12} scale={0.95} />}
          breathe={frame}
          eyes={t > 6.4 ? 'down' : 'open'}
          brow="sad"
          mouth="flat"
          look={[8, 8]}
          eyeGlow={lower < 0.5 ? C.screen : undefined}
          tear={tween(frame, 8, 11.6, 0, 0.95)}
          turn={0.3}
          blinkAmt={blink(frame, 18)}
        />
      </Bedroom>
    </Stage>
  );
};

export const NOTE = (i: number) => ({ x: 820 + i * 220, y: 210 + (i % 2) * 40 });

// 72–84 s. A wall, a pad of sticky notes. One name and date at a time.
export const List: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.08;
  const y = standY(s);
  const n = BEATS.notes;
  const k = Math.max(0, n.filter((b) => t >= b - 0.6).length - 1);
  const target = NOTE(k);
  // He steps along the wall: walk in the 0.6 s before each note, stand while he writes it.
  const times = n.flatMap((b) => [b - 1.3, b - 0.7]);
  const x = keys(frame, times, n.flatMap((_, i) => [NOTE(Math.max(0, i - 1)).x - 200, NOTE(i).x - 200]));
  const walking = n.some((b) => t > b - 1.3 && t < b - 0.7);
  const press = n.reduce((m, b) => Math.max(m, keys(frame, [b - 0.6, b - 0.2, b + 0.4, b + 0.8], [0, 1, 1, 0])), 0);
  const arm = reachArm(target.x - 60, target.y + 40, { x, y, scale: s, lean: 6 });
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.08)} focus={[1060, 480]}>
      <Room wall="#1A1C21" />
      <Glow x={1100} y={300} r={700} color={C.amber} opacity={0.12} />
      {PEOPLE.map((p, i) =>
        t < n[i] - 0.4 ? null : (
          <StickyNote key={p.name} x={NOTE(i).x} y={NOTE(i).y} text={[p.name, p.date]} scale={0.62 * tween(frame, n[i] - 0.4, n[i] - 0.1, 0.6, 1)} rotate={i % 2 ? 3 : -3} reveal={tween(frame, n[i], n[i] + 0.6, 0, 1)} />
        ),
      )}
      <Character
        x={x}
        y={y}
        scale={s}
        pose={walking ? walk(frame, 0.8) : idle(frame, { ...STAND, armNear: mixLimb([-4, 10], arm, press), lean: 6 * press }, 0)}
        handNear={press > 0.5 ? 'point' : 'relaxed'}
        breathe={frame}
        eyes="open"
        brow="focused"
        mouth="flat"
        turn={0.3}
        look={[12, -8]}
        blinkAmt={blink(frame, 10)}
      />
    </Stage>
  );
};

