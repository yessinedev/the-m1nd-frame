import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, sceneFade, tween, wobble } from '../../../kit/anim';
import { Character, Head, walk } from '../../../kit/Character';
import { SceneProps, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Room, Starfield, WallClock } from '../../../kit/props';
import { PhoneHands } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { FriendsListScreen, GroupChatScreen, GroupMsg, HangingHeadset, LobbyScreen, MonitorFrame, Quad, Slot, VictoryScreen } from '../../../kit/props5';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS, SQUAD } from '../script';
import { C } from '../../../theme';
import { Gamer, Mood } from './gamer';

const tags = SQUAD.map((m) => m.tag);
const talker = (frame: number, period = 50) => Math.floor(frame / period) % 4;

// 0–7 s.
export const ColdOpen: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 20, 14)} zoom={tween(frame, 0, 7, 1.04, 1)}>
      <Starfield frame={frame} opacity={0.7} />
    </Stage>
  );
};

// 7–21 s. 2012. Four bedrooms, four headsets, one conversation.
export const QuadNight: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const who = talker(frame);
  const laugh = t > 5.6 && t < 7.6;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.0, 1.04)}>
      <Quad
        panels={SQUAD.map((m, i) => <Gamer key={i} m={m} frame={frame} seed={i} mood={laugh ? 'laugh' : 'chill'} talking={!laugh && who === i} />)}
        labels={tags}
        talking={SQUAD.map((_, i) => laugh || who === i)}
      />
    </Stage>
  );
};

const lobbySlots = (readyAt: number[] = []): Slot[] => SQUAD.map((m, i) => ({ variant: m.variant, tag: m.tag, readyAt: readyAt[i] }));

// 21–33 s. The lobby: four names, READY lights up one by one.
export const Lobby: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.06)}>
      <MonitorFrame>
        <LobbyScreen frame={frame} slots={lobbySlots(BEATS.lobbyReady.map((s) => f(s)))} status={frame > f(5) ? 'MATCH STARTING' : undefined} />
      </MonitorFrame>
    </Stage>
  );
};

// 33–41 s. The clutch: everyone leaning in, then the room explodes.
export const Clutch: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const won = t > BEATS.clutchWin;
  return (
    <Stage fade={sceneFade(frame, dur, 10, 4)} zoom={tween(frame, 0, BEATS.clutchWin, 1.0, 1.08)} shake={won ? [wobble(frame, 3, 2.4) * 6, wobble(frame, 7, 2.1) * 4] : [0, 0]}>
      <Quad
        panels={SQUAD.map((m, i) => <Gamer key={i} m={m} frame={frame} seed={i} mood={won ? 'hype' : 'focus'} />)}
        labels={tags}
        talking={SQUAD.map(() => won)}
      />
    </Stage>
  );
};

// 41–46 s.
export const Victory: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 2, 12)} zoom={tween(frame, 0, 5, 1.04, 1.0)}>
      <MonitorFrame glow={C.amber}>
        <VictoryScreen frame={frame} t={frame / FPS} />
      </MonitorFrame>
    </Stage>
  );
};

// 46–58 s. 3 AM. Tired, still laughing. "One more game."
export const OneMore: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const who = talker(frame, 40);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.04)}>
      <Quad
        panels={SQUAD.map((m, i) => (
          <Gamer key={i} m={m} frame={frame} seed={i} mood={t > 6 && t < 8 ? 'laugh' : 'tired'} talking={who === i} />
        ))}
        labels={tags}
        talking={SQUAD.map((_, i) => who === i)}
      />
    </Stage>
  );
};

// 58–70 s. The lobby again. Leo goes offline. 3/4.
export const LeoLeaves: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const slots = lobbySlots().map((s, i) => (i === 3 && frame >= f(BEATS.leoOff) ? { ...s, offline: true } : s));
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.06)}>
      <MonitorFrame>
        <LobbyScreen frame={frame} slots={slots} />
      </MonitorFrame>
    </Stage>
  );
};

// 70–82 s. Three panels; then Jay's goes dark too.
export const QuadThree: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const jay = tween(frame, BEATS.jayOff, BEATS.jayOff + 0.6, 0, 1);
  const who = talker(frame, 70) % 3;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.04)}>
      <Quad
        panels={SQUAD.map((m, i) => (i === 3 ? <Gamer key={i} m={m} frame={0} seed={i} mood="chill" screen={0} /> : <Gamer key={i} m={m} frame={frame} seed={i} mood={frame / FPS > 7 ? 'tired' : 'chill'} talking={who === i && !(i === 2 && jay > 0.5)} />))}
        labels={tags}
        talking={SQUAD.map((_, i) => who === i)}
        dark={[0, 0, jay, 1]}
      />
    </Stage>
  );
};

// 82–94 s. Two left. Sam yawns, "gn man", logs off.
export const Duo: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const samOff = tween(frame, BEATS.samOff, BEATS.samOff + 0.6, 0, 1);
  const panel = (i: number, mood: Mood, talking: boolean, x: number) => (
    <g>
      <defs>
        <clipPath id={`duo${i}`}>
          <rect x={x + 6} y={6} width={948} height={1068} rx={10} />
        </clipPath>
      </defs>
      <g clipPath={`url(#duo${i})`}>
        <g transform={`translate(${x + 480} 540) scale(0.95) translate(-1000 -480)`}>
          <Gamer m={SQUAD[i]} frame={frame} seed={i} mood={mood} talking={talking} />
        </g>
        {i === 1 ? <rect x={x} y={0} width={960} height={1080} fill="#050506" opacity={samOff * 0.92} /> : null}
      </g>
      <g transform={`translate(${x + 30} 1010)`} opacity={i === 1 ? 1 - samOff * 0.6 : 1}>
        <rect width={SQUAD[i].tag.length * 17 + 56} height={44} rx={10} fill="#000" opacity={0.55} />
        <circle cx={22} cy={22} r={8} fill={talking ? C.amber : '#4A4F5A'} />
        <text x={40} y={31} fontFamily={HAND} fontSize={28} fill={C.text}>
          {SQUAD[i].tag}
        </text>
      </g>
    </g>
  );
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.04)}>
      <rect width={1920} height={1080} fill="#050506" />
      {panel(0, t > BEATS.samOff + 1 ? 'sad' : 'tired', false, 0)}
      {panel(1, t > 1.8 && t < 3.2 ? 'tired' : 'tired', t > 1.0 && t < 4.4, 960)}
    </Stage>
  );
};

// 94–106 s. Alone, in a lobby nobody joins.
export const Solo: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 0.9, 1.05)} focus={[1000, 480]}>
      <Gamer m={SQUAD[0]} frame={frame} seed={0} mood="sad" />
    </Stage>
  );
};

// 106–120 s. Years. Adult him walks past the headset on its hook; dust gathers.
export const Dust: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const dust = tween(frame, 0, 12, 0.1, 1);
  const close = t > 7;
  const x = 300 + t * 190;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={close ? tween(frame, 7, 14, 1.6, 1.8) : 1.05} focus={close ? [1100, 420] : [960, 540]}>
      <Room wall="#15171C" />
      <HangingHeadset x={1100} y={260} dust={dust} />
      {!close ? (
        <Character x={x} y={standY(1.1)} scale={1.1} pose={walk(frame, 1)} eyes="tired" mouth="flat" look={[6, 2]} blinkAmt={blink(frame, 9)} nearItem={<rect x={-10} y={-10} width={70} height={46} rx={6} fill="#2A2F39" />} />
      ) : null}
    </Stage>
  );
};

// 120–134 s. He logs back in. Friends list: last online 6 years ago.
export const LoginAgain: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const screen = tween(frame, BEATS.login, BEATS.login + 0.6, 0, 1);
  const list = t > 4.4;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={list ? tween(frame, 4.4, 14, 1.0, 1.06) : 1.0} focus={[1000, 480]}>
      {list ? (
        <MonitorFrame>
          <FriendsListScreen
            friends={[
              { variant: 'him', tag: 'FRAME', status: 'Online', online: true },
              { variant: 'sam', tag: 'SAM_', status: 'Last online 6 years ago' },
              { variant: 'jay', tag: 'JAYYY', status: 'Last online 7 years ago' },
              { variant: 'leo', tag: 'LEO.exe', status: 'Last online 9 years ago' },
            ]}
          />
        </MonitorFrame>
      ) : (
        <Gamer m={SQUAD[0]} frame={frame} seed={0} mood="sad" adult screen={screen} />
      )}
    </Stage>
  );
};

const OLD: GroupMsg[] = [
  { who: 'leo', name: 'LEO.exe', text: 'same time tmrw?', at: -10 },
  { who: 'jay', name: 'JAYYY', text: 'gg', at: -10 },
  { who: 'sam', name: 'SAM_', text: 'gn', at: -10 },
];

// 134–150 s. The old group chat. He types, hesitates, sends. Then it explodes.
export const GroupChat: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const msg = 'one more game? sat 9pm';
  const typed = t < BEATS.typeStart ? '' : t < BEATS.send ? msg.slice(0, Math.ceil(Math.min(1, (t - BEATS.typeStart) / (BEATS.typeEnd - BEATS.typeStart)) * msg.length)) : '';
  const [r0, r1, r2, r3] = BEATS.replies.map((s) => f(s));
  const msgs: GroupMsg[] = [
    ...OLD,
    { who: 'him', name: 'FRAME', text: msg, at: f(BEATS.send), mine: true },
    { who: 'sam', name: 'SAM_', text: 'WAIT WHAT', at: r0 },
    { who: 'jay', name: 'JAYYY', text: "IM IN", at: r1 },
    { who: 'leo', name: 'LEO.exe', text: 'bro i still have my headset', at: r2 },
    { who: 'sam', name: 'SAM_', text: "9pm. don't be late", at: r3 },
  ];
  const hover = t > BEATS.typeEnd && t < BEATS.send ? Math.sin(frame * 0.4) * 6 : 0;
  const tap = t > BEATS.typeStart && t < BEATS.typeEnd ? Math.abs(Math.sin(frame * 1.4)) * 20 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 16, 1.0, 1.08)}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000}>
        {(sw, sh) => <GroupChatScreen sw={sw} sh={sh} frame={frame} title="THE SQUAD" msgs={msgs} typed={typed} members={SQUAD.map((m) => m.variant)} />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={(t > BEATS.typeEnd && t < BEATS.send + 0.2 ? 400 : 330) - tap + hover} thumbX={t > BEATS.typeEnd && t < BEATS.send + 0.2 ? 30 : -60} />
    </Stage>
  );
};

// 150–160 s. Saturday, 9 PM. Headset on. 1/4.
export const Saturday: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 10, 0.95, 1.08)} focus={[1000, 480]}>
      <Gamer m={SQUAD[0]} frame={frame} seed={0} mood="focus" adult />
      <WallClock x={1180} y={240} minutes={21 * 60 + Math.min(2, frame / FPS / 5)} />
    </Stage>
  );
};

// 160–172 s. They join. 2/4. 3/4. 4/4. READY.
export const Join: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const slots: Slot[] = SQUAD.map((m, i) =>
    i === 0 ? { variant: m.variant, tag: m.tag } : { variant: m.variant, tag: m.tag, joinAt: f(BEATS.joins[i - 1]), readyAt: f(BEATS.joins[i - 1] + 0.6) },
  );
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.06)}>
      <MonitorFrame glow={frame > f(BEATS.joins[2]) ? C.amber : '#6C8CC4'}>
        <LobbyScreen frame={frame} slots={slots} />
      </MonitorFrame>
    </Stage>
  );
};

// 172–188 s. Four adults, four headsets, laughing like it's 2012.
export const QuadAdult: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const who = talker(frame, 45);
  const laugh = (t > 3 && t < 5) || (t > 10 && t < 12.4);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 16, 1.0, 1.05)}>
      <Quad
        panels={SQUAD.map((m, i) => <Gamer key={i} m={m} frame={frame} seed={i} adult mood={laugh ? 'laugh' : t > 13 ? 'hype' : 'chill'} talking={!laugh && who === i} />)}
        labels={tags}
        talking={SQUAD.map((_, i) => laugh || who === i)}
      />
    </Stage>
  );
};

// 188–194 s. 4/4 ready. Match starting.
export const PlayAgain: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 8, 18)} zoom={tween(frame, 0, 6, 1.0, 1.12)}>
      <MonitorFrame glow={C.amber}>
        <LobbyScreen frame={frame} slots={lobbySlots()} status={`MATCH STARTS IN ${Math.max(1, 3 - Math.floor(frame / FPS / 2))}`} />
      </MonitorFrame>
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
        {SQUAD.map((m, i) => (
          <Head key={i} x={720 + i * 160} y={380} scale={0.8} variant={m.variant} eyes="happy" mouth="grin" headset />
        ))}
        <text x={960} y={640} textAnchor="middle" fontFamily={HAND} fontSize={104} letterSpacing="0.12em" fill={C.text}>
          THE M1ND FRAME
        </text>
      </g>
      <text x={960} y={730} textAnchor="middle" fontFamily={HAND} fontSize={50} letterSpacing="0.04em" fill={C.amber} opacity={b}>
        Send the invite tonight.
      </text>
    </Stage>
  );
};
