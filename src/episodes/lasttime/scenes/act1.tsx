import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { blink, sceneFade, tween } from '../../../kit/anim';
import { Bicycle, ride, Suburb } from '../../../kit/bike';
import { Character, KID, Pose, SIT, STAND, idle, mix, talkMouth } from '../../../kit/Character';
import { SceneProps, sitY, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Room, Starfield } from '../../../kit/props';
import { Sofa, SOFA, TV } from '../../../kit/props2';
import { Controller, Hill, NightSky, SodaCan, StreetSign } from '../../../kit/props3';
import { FPS } from '../../../kit/time';
import { BEATS, STREET } from '../script';
import { C, FLOOR } from '../../../theme';

export const HIS_BIKE = '#7D8FA6';
export const SAMS_BIKE = '#8A7F5A';

// A kid (or adult) riding. Draws bike-back, rider, bike-front. `facing` -1 mirrors around the bike.
export const Rider: React.FC<{
  x: number;
  spin: number;
  kid?: boolean;
  variant?: 'him' | 'sam';
  facing?: 1 | -1;
  bob?: number;
  face?: Partial<React.ComponentProps<typeof Character>>;
  armNear?: Pose['armNear'];
  handNear?: 'open' | 'relaxed';
  wave?: number; // frame counter: waves with the far arm (behind the head)
  back?: boolean; // the rider on the far lane: a touch smaller and higher
}> = ({ x, spin, kid = false, variant = 'him', facing = 1, bob = 0, face = {}, armNear, handNear, wave, back = false }) => {
  const d = back ? 0.92 : 1;
  const ground = back ? FLOOR - 30 : FLOOR;
  const g = (kid ? 0.78 : 1) * d;
  const k = (kid ? KID : 1) * d;
  const r = ride(x, ground, g, spin, k, 28, bob);
  const color = variant === 'sam' ? SAMS_BIKE : HIS_BIKE;
  return (
    <g transform={facing === -1 ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
      <Bicycle x={x} y={ground} g={g} spin={spin} color={color} layer="back" />
      <Character
        x={r.x}
        y={r.y}
        scale={d}
        bodyScale={kid ? KID : 1}
        variant={variant}
        pose={{
          ...r.pose,
          ...(armNear ? { armNear } : {}),
          // kids' arms can't clear their heads, so they wave beside the face; adults wave behind it
          ...(wave !== undefined && kid ? { armNear: [100 + Math.sin(wave * 0.5) * 8, 88] as Pose['armNear'] } : {}),
          ...(wave !== undefined && !kid ? { armFar: [206 + Math.sin(wave * 0.5) * 12, 18] as Pose['armFar'] } : {}),
        }}
        handNear={wave !== undefined && kid ? 'open' : handNear}
        handFar={wave !== undefined && !kid ? 'open' : undefined}
        {...face}
      />
      <Bicycle x={x} y={ground} g={g} spin={spin} color={color} layer="front" />
    </g>
  );
};

// 0–7 s.
export const ColdOpen: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 20, 14)} zoom={tween(frame, 0, 7, 1.04, 1)}>
      <Starfield frame={frame} opacity={0.7} />
    </Stage>
  );
};

// 7–19 s. Racing bikes down the street at golden hour.
export const Bikes: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const himX = 1100 - Math.sin(t * 0.55) * 60;
  const samX = 720 + Math.sin(t * 0.55) * 150;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={1.06} focus={[930, 640]}>
      <Suburb offset={frame * 15} sunY={tween(frame, 0, 12, 470, 520)} />
      <Rider x={samX} spin={frame * 0.36 + 1} kid back variant="sam" bob={Math.sin(frame * 0.7) * 1.5} face={{ eyes: 'happy', mouth: 'grin', turn: 0.35 }} />
      <Rider x={himX} spin={frame * 0.36} kid bob={Math.sin(frame * 0.7 + 1) * 1.5} face={{ eyes: t > 3 && t < 6 ? 'happy' : 'open', mouth: 'grin', turn: -0.2, look: [-6, 0], blinkAmt: blink(frame, 9) }} />
    </Stage>
  );
};

// 19–31 s. Hilltop at night. Stars, sodas, big plans.
export const HillScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ground: Pose = { ...SIT, legFar: [84, 18], legNear: [80, 14], armFar: [-30, 20], lean: -4 };
  const pointing = t < 4.2;
  const samTalks = t > 4.4 && t < 8.6;
  const laugh = t > 8.8 && t < 10.4;
  const bob = laugh ? -Math.abs(Math.sin(t * 9)) * 4 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.12, 1.22)} focus={[900, 560]}>
      <NightSky frame={frame} />
      <Hill />
      <SodaCan x={1060} y={FLOOR - 66} />
      <SodaCan x={740} y={FLOOR - 82} color="#4A6A8A" />
      <Character
        x={960}
        y={FLOOR - 72 - 14 * KID}
        bodyScale={KID}
        variant="sam"
        pose={idle(frame, { ...ground, armNear: samTalks ? [40 + Math.sin(frame * 0.2) * 12, 60] : [20, 30], bob }, 1)}
        handNear={samTalks ? 'open' : 'relaxed'}
        breathe={frame + 5}
        eyes={laugh ? 'happy' : 'open'}
        mouth={samTalks ? talkMouth(frame, 3) : laugh ? 'grin' : 'smile'}
        turn={samTalks ? -0.4 : 0.2}
        look={samTalks ? [-8, -4] : [4, -8]}
        blinkAmt={blink(frame, 70)}
      />
      <Character
        x={810}
        y={FLOOR - 80 - 14 * KID}
        bodyScale={KID}
        pose={idle(frame, { ...ground, armNear: pointing ? [158, 6] : [20, 30], bob }, 0)}
        handNear={pointing ? 'point' : 'relaxed'}
        breathe={frame}
        eyes={laugh ? 'happy' : 'open'}
        mouth={laugh ? 'grin' : pointing ? 'o' : 'smile'}
        turn={samTalks ? 0.4 : 0.15}
        look={pointing ? [6, -12] : samTalks ? [8, 0] : [4, -6]}
        blinkAmt={blink(frame, 12)}
      />
    </Stage>
  );
};

// 31–41 s. Video games on the sofa. Sam wins and jumps up.
export const Games: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const win = BEATS.gameWin;
  const up = tween(frame, win, win + 0.35, 0, 1);
  const jump = t > win ? -Math.abs(Math.sin((t - win) * 7)) * 18 * Math.max(0, 1 - (t - win) / 2.5) : 0;
  const mash = (seed: number): Pose['armNear'] => [58 + Math.sin(frame * 1.7 + seed) * 3, 76 + Math.sin(frame * 2.3 + seed) * 4];
  const playing: Pose = { ...SIT, armNear: mash(0), armFar: mash(2), lean: 10 };
  const samSitY = sitY(SOFA.seat, KID);
  const samStandY = standY(KID);
  const samPose = mix(playing, { ...STAND, armNear: [168, 10], armFar: [160, 14] }, up);
  const laughs = t > win + 1.0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 10, 1.16, 1.24)} focus={[900, 560]}>
      <Room wall="#171A21" />
      <rect x={260} y={250} width={150} height={200} rx={6} fill="#3A4A5C" />
      <path d="M 300 420 L 335 300 L 370 420 Z" fill={C.amber} opacity={0.5} />
      <Sofa x={500} />
      <TV x={1560} light={0.9} color="#9FC1E8" />
      <Character
        x={840}
        y={sitY(SOFA.seat, KID)}
        bodyScale={KID}
        pose={idle(frame, playing, 0)}
        nearItem={<Controller />}
        breathe={frame}
        eyes={laughs ? 'happy' : 'open'}
        brow={t > win && !laughs ? 'worried' : t < win ? 'focused' : 'none'}
        mouth={laughs ? 'grin' : t > win ? 'o' : 'flat'}
        turn={t > win ? 0.4 : 0}
        look={t > win ? [8, -6] : [8, 0]}
        blinkAmt={blink(frame, 30)}
      />
      <Character
        x={1000}
        y={samSitY + (samStandY - samSitY) * up + jump}
        bodyScale={KID}
        variant="sam"
        pose={samPose}
        handNear={up > 0.5 ? 'open' : undefined}
        nearItem={up > 0.5 ? undefined : <Controller />}
        breathe={frame + 9}
        eyes={up > 0.5 ? 'happy' : 'open'}
        brow={t < win ? 'focused' : 'none'}
        mouth={up > 0.5 ? 'grin' : 'flat'}
        turn={up > 0.5 ? -0.3 : 0}
        look={[8, 0]}
        blinkAmt={blink(frame, 55)}
      />
    </Stage>
  );
};

// 41–56 s. The corner of Maple St. "See you tomorrow!" They ride apart. Freeze: the last time.
export const LastRide: React.FC<SceneProps> = ({ dur }) => {
  const live = useCurrentFrame();
  const { lastStop: stop, lastWave: wave, lastSplit: split, lastFreeze: freeze } = BEATS;
  const frame = Math.min(live, freeze * FPS);
  const t = frame / FPS;
  const frozen = live >= freeze * FPS;
  // scrolling world decelerates to a stop
  const offset = interpolate(frame, [0, stop * FPS], [0, stop * FPS * 7], { extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) * (1 - x) });
  const spinIn = offset / 30;
  const away = Math.max(0, t - split);
  const himX = 1040 + away * away * 140;
  const samX = 800 - away * away * 140;
  const spinOut = spinIn + away * away * 4;
  const waving = t > wave && t < split + 0.6;
  const memory = tween(live, freeze, freeze + 0.6, 0, 1);
  return (
    <AbsoluteFill>
    <Stage fade={sceneFade(live, dur)} zoom={frozen ? tween(live, freeze, dur / FPS, 1.1, 1.18) : 1.1} focus={[920, 600]}>
      <Suburb offset={offset} sunY={560} dusk={0.35} />
      <StreetSign x={920} text={STREET} />
      <Rider
        x={samX}
        spin={t > split ? spinOut : spinIn + 0.6}
        kid
        back
        variant="sam"
        facing={t > split ? -1 : 1}
        wave={waving ? live : undefined}
        face={{ eyes: 'happy', mouth: waving ? 'open' : 'grin', turn: t > stop ? 0.5 : 0.3 }}
      />
      <Rider
        x={himX}
        spin={t > split ? spinOut + 1 : spinIn}
        kid
        wave={waving ? live + 3 : undefined}
        face={{ eyes: 'open', mouth: 'grin', turn: t > stop && t < split ? -0.5 : 0.2, look: t > stop && t < split ? [-8, 0] : [4, 0], blinkAmt: blink(live, 4) }}
      />
      {/* the moment becomes a memory: warm wash */}
      <rect x={-200} y={-200} width={2320} height={1480} fill="#2A1A0A" opacity={memory * 0.35} style={{ mixBlendMode: 'multiply' }} />
    </Stage>
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <rect x={14} y={14} width={1892} height={1052} fill="none" stroke="#EDE8DD" strokeWidth={28} opacity={memory * 0.9 * sceneFade(live, dur)} />
      </svg>
    </AbsoluteFill>
    </AbsoluteFill>
  );
};
