import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { Character, KID, Pose, STAND, idle, walk } from '../../../kit/Character';
import { SceneProps, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Mirror, Room, Sink, Starfield } from '../../../kit/props';
import { PhoneHands } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { Suburb } from '../../../kit/bike';
import { GroupChatScreen, GroupMsg } from '../../../kit/props5';
import { Bubble, FittingRoom, Lockers, TagScreen, Towel } from '../../../kit/props6';
import { f, FPS } from '../../../kit/time';
import { BEATS, BUILD, TEE } from '../script';

const B = BUILD;

// 0–7 s.
export const ColdOpen: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 20, 14)} zoom={tween(frame, 0, 7, 1.04, 1)}>
      <Starfield frame={frame} opacity={0.7} />
    </Stage>
  );
};

// 7–19 s. Blazing street. T-shirts everywhere. Him in the hoodie, sweating.
export const HeatStreet: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.1;
  const passX = 1900 - frame * 7;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.08, 1.14)} focus={[900, 560]}>
      <Suburb offset={frame * 3} sunY={200} />
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M ${200 + i * 300} 760 q 20 ${-10 + Math.sin(frame * 0.2 + i) * 6} 40 0 t 40 0`} stroke="#FFD9A0" strokeWidth={3} fill="none" opacity={0.25} />
      ))}
      <Character x={passX} y={standY(s * 0.9) - 26} scale={s * 0.9} facing={-1} variant="sam" tee="#5E7FA0" pose={walk(frame + 5, 1)} eyes="happy" mouth="grin" turn={0.2} />
      <Character x={passX + 170} y={standY(s * 0.86) - 26} scale={s * 0.86} facing={-1} variant="her" tee="#C97A6A" pose={walk(frame + 11, 1)} eyes="open" mouth="smile" turn={0.2} hairSwing={Math.sin(frame * 0.4) * 3} />
      <Character
        x={860}
        y={standY(s)}
        scale={s}
        build={B}
        pose={walk(frame, 0.75)}
        breathe={frame}
        eyes="down"
        brow="sad"
        mouth="flat"
        sweat
        look={[6, 6]}
        blinkAmt={blink(frame, 20)}
      />
    </Stage>
  );
};

// 19–32 s. Age 12. The hallway joke. Everyone laughs; so does he.
export const Hallway: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const k = KID;
  const y = standY(k * 1.1);
  const pointing = t > BEATS.joke && t < BEATS.laugh + 1.5;
  const laughing = t > BEATS.laugh;
  const shake = laughing ? -Math.abs(Math.sin(t * 9)) * 4 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.1, 1.2)} focus={[960, 560]}>
      <Lockers />
      <rect width={1920} height={1080} fill="#2A1A0A" opacity={0.18} style={{ mixBlendMode: 'multiply' }} />
      <Character
        x={720}
        y={y + shake}
        scale={1.1}
        bodyScale={k}
        variant="kid"
        pose={idle(frame, { ...STAND, armNear: pointing ? [92, 4] : [-4, 10] }, 1)}
        handNear={pointing ? 'point' : 'relaxed'}
        eyes={laughing ? 'happy' : 'open'}
        mouth={laughing ? 'grin' : pointing ? 'open' : 'smile'}
        turn={0.3}
        blinkAmt={blink(frame, 30)}
      />
      <Character x={560} y={y + shake} scale={1.05} bodyScale={k} variant="her" pose={idle(frame, STAND, 2)} eyes={laughing ? 'happy' : 'open'} mouth={laughing ? 'grin' : 'smile'} turn={0.3} />
      <Character
        x={1140}
        y={y}
        scale={1.1}
        bodyScale={k}
        build={B}
        facing={-1}
        pose={idle(frame, { ...STAND, armNear: [56, 92], armFar: [50, 96] }, 0)}
        nearItem={<rect x={-30} y={-40} width={60} height={80} rx={4} fill="#5E7FA0" />}
        eyes={laughing ? 'happy' : 'open'}
        brow="sad"
        mouth={laughing ? 'grin' : t > BEATS.joke + 0.4 ? 'flat' : 'smile'}
        turn={0.25}
        blinkAmt={blink(frame, 11)}
      />
    </Stage>
  );
};

const bathroom = (frame: number, lift: number, x: number, s: number, face: Partial<React.ComponentProps<typeof Character>>, reflect: boolean, pose: Pose) => (
  <>
    <Room wall="#12151A" />
    <Mirror x={1010} y={160}>
      <rect width={1920} height={1080} fill="#151820" />
      {reflect ? <Character x={2 * 1030 - x} y={standY(s)} scale={s} build={B} facing={-1} pose={pose} {...face} opacity={0.6} /> : null}
    </Mirror>
    <Towel x={1010} y={160} lift={lift} />
    <Sink x={1200} y={700} />
    <Character x={x} y={standY(s)} scale={s} build={B} pose={pose} breathe={frame} {...face} />
  </>
);

// 32–44 s. A towel hangs over the mirror.
export const MirrorScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.1;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.08, 1.16)} focus={[1000, 520]}>
      {bathroom(frame, 0, 760, s, { eyes: 'down', brow: 'sad', mouth: 'flat', look: [-4, 6], blinkAmt: blink(frame, 15) }, false, idle(frame, STAND, 0))}
    </Stage>
  );
};

// 44–56 s. Close-up: "Sam tagged you in a photo." Remove tag.
export const PhotoTag: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const press = keys(frame, [BEATS.tagPress - 0.6, BEATS.tagPress, BEATS.tagPress + 0.3], [0, 1, 0]);
  const removed = tween(frame, BEATS.tagPress, BEATS.tagPress + 0.3, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.06)}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000}>
        {(sw, sh) => <TagScreen sw={sw} sh={sh} removed={removed} press={press} members={['him', 'sam', 'her', 'jay']} />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={360 - press * 30} thumbX={-press * 120} />
    </Stage>
  );
};

// 56–69 s. Group chat: pool party Saturday. He types "can't. busy."
export const PoolInvite: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [r0, r1] = BEATS.reply;
  const reply = "can't. busy.";
  const typed = t > r0 && t < r1 ? reply.slice(0, Math.ceil(((t - r0) / (r1 - 0.4 - r0)) * reply.length)) : '';
  const msgs: GroupMsg[] = [
    { who: 'sam', name: 'Sam', text: 'pool party saturday!!', at: f(BEATS.invite) },
    { who: 'jay', name: 'Jay', text: 'bringing the speaker', at: f(BEATS.invite + 0.9) },
    { who: 'her', name: 'Maya', text: 'finally!!', at: f(BEATS.invite + 1.7) },
    { who: 'him', name: 'me', text: reply, at: f(r1), mine: true },
  ];
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.0, 1.06)}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000}>
        {(sw, sh) => <GroupChatScreen sw={sw} sh={sh} frame={frame} title="SUMMER CREW" msgs={msgs} typed={typed} members={['sam', 'jay', 'her', 'him']} />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={t > r0 && t < r1 ? 380 - Math.abs(Math.sin(frame * 1.4)) * 20 : 330} thumbX={-60} />
    </Stage>
  );
};

// 69–83 s. Fitting room. A t-shirt; arms crossed over himself; back into the hoodie.
export const FittingRoomScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const inTee = t > BEATS.teeOn && t < BEATS.hoodieBack;
  const flash = Math.max(keys(frame, [BEATS.teeOn - 0.15, BEATS.teeOn, BEATS.teeOn + 0.2], [0, 1, 0]), keys(frame, [BEATS.hoodieBack - 0.15, BEATS.hoodieBack, BEATS.hoodieBack + 0.2], [0, 1, 0]));
  const x = 860;
  const pose: Pose = idle(frame, inTee ? { ...STAND, armNear: [44, 118], armFar: [40, 122] } : STAND, 0);
  const face = { eyes: (inTee && t > 3 ? 'down' : 'open') as 'down' | 'open', brow: 'sad' as const, mouth: 'flat' as const, blinkAmt: blink(frame, 17) };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.1, 1.2)} focus={[1000, 520]}>
      <FittingRoom frame={frame} />
      <Mirror x={1080} y={150} w={360} h={540}>
        <rect width={1920} height={1080} fill="#26242A" />
        <Character x={2 * 1100 - x} y={standY(s)} scale={s} build={B} facing={-1} tee={inTee ? TEE : undefined} pose={pose} {...face} opacity={0.7} />
      </Mirror>
      <Character x={x} y={standY(s)} scale={s} build={B} tee={inTee ? TEE : undefined} pose={pose} breathe={frame} {...face} />
      <rect width={1920} height={1080} fill="#000" opacity={flash * 0.8} />
    </Stage>
  );
};

const COMMENTS = ['big guy', "don't take your shirt off", "you'd be cute if…", 'hide it', "everyone's staring", 'just stay home'];

// 83–97 s. The inner voice: old comments crowding in around him.
export const Voices: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 0.95;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.0, 1.15)}>
      <rect width={1920} height={1080} fill="#0B0A0D" />
      {COMMENTS.map((text, i) => {
        const a = (i / COMMENTS.length) * Math.PI * 2 + frame * 0.004;
        const appear = tween(frame, 0.4 + i * 1.1, 1.0 + i * 1.1, 0, 1);
        const r = 520 - tween(frame, 0, 14, 0, 160);
        return <Bubble key={i} x={960 + Math.cos(a) * r * 1.3} y={470 + Math.sin(a) * r * 0.62} text={text} scale={0.9 + appear * 0.2} opacity={appear} />;
      })}
      <Character
        x={960}
        y={standY(s) - 40}
        scale={s}
        build={B}
        pose={idle(frame, { ...STAND, armNear: [40, 124], armFar: [36, 126], headY: 10 }, 0)}
        breathe={frame}
        eyes="closed"
        brow="sad"
        mouth="frown"
        blinkAmt={1}
      />
    </Stage>
  );
};
