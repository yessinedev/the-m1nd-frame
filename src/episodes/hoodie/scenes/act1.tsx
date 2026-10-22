import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { BR, Bedroom } from '../../../kit/bedroom';
import { Character, Pose, SIT, STAND, idle, mixLimb, reachArm, walk } from '../../../kit/Character';
import { SceneProps, sitY, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Room, Starfield, Window } from '../../../kit/props';
import { Chair, CHAIR, PhoneHands } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { CAR, CarInterior, DrapedHoodie, HoodieBundle, ProfileScreen, TypingScreen } from '../../../kit/props4';
import { FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C } from '../../../theme';

// 0–7 s.
export const ColdOpen: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 20, 14)} zoom={tween(frame, 0, 7, 1.04, 1)}>
      <Starfield frame={frame} opacity={0.7} />
    </Stage>
  );
};

// 7–19 s. Morning. His hand slides across to her empty pillow.
export const BedEmpty: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [r0, r1] = BEATS.reach;
  const reach = tween(frame, r0, r1, 0, 1);
  const pat = t > r1 && t < r1 + 1.6 ? Math.abs(Math.sin((t - r1) * 7)) * 6 : 0;
  const shoulder = { x: BR.headX + 30, y: BR.mattress - 22 };
  const hand = { x: shoulder.x + 40 + reach * 170, y: BR.mattress - 40 - reach * 10 - pat };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.4, 1.55)} focus={[BR.headX + 110, BR.headY]}>
      <Bedroom
        frame={frame}
        sky="day"
        clock="7:12"
        clockColor={C.textDim}
        lying={{ eyes: t > r1 + 0.4 ? 'open' : t > 0.8 ? 'tired' : 'closed', brow: t > r1 + 0.4 ? 'sad' : 'none', mouth: 'flat', look: [10, -2], blinkAmt: blink(frame, 30) }}
      >
        <rect x={BR.bedX + 200} y={BR.mattress - 50} width={150} height={52} rx={24} fill={C.pillow} />
        <line x1={shoulder.x} y1={shoulder.y} x2={hand.x - 10} y2={hand.y + 6} stroke={C.hoodie} strokeWidth={28} strokeLinecap="round" />
        <ellipse cx={hand.x} cy={hand.y} rx={20} ry={14} fill={C.skin} />
      </Bedroom>
    </Stage>
  );
};

// 19–31 s. Her hoodie on the chair. He picks it up and breathes it in.
export const HoodieChair: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const walking = t < 1.6;
  const x = walking ? 560 + t * 200 : 880;
  const y = standY(s);
  const chairX = 1130;
  const drape = { x: chairX - 52, y: CHAIR.seat - 200 };
  const { pick, smell } = BEATS;
  const held = t > pick + 0.3;
  const toChair = reachArm(drape.x - 20, drape.y + 40, { x, y, scale: s });
  const toFace = reachArm(x + 66 * s, y - 214 * s, { x, y, scale: s });
  const armNear = t < pick - 0.5 ? STAND.armNear : t < pick + 0.3 ? mixLimb(STAND.armNear, toChair, tween(frame, pick - 0.5, pick, 0, 1)) : mixLimb(toChair, toFace, tween(frame, pick + 0.3, smell, 0, 1));
  const base: Pose = walking ? walk(frame, 0.9) : idle(frame, STAND, 0);
  const closed = t > smell;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.15, 1.32)} focus={[960, 520]}>
      <Room wall="#14161B" />
      <Window x={1420} y={200} sky="day" />
      <Chair x={chairX} facing={1} />
      {!held ? <DrapedHoodie x={drape.x} y={drape.y} /> : null}
      <Character
        x={x}
        y={y}
        scale={s}
        pose={{ ...base, armNear, headY: closed ? 6 : 0, tilt: closed ? 4 : 0 }}
        nearItem={held ? <g transform="translate(16 6)"><HoodieBundle scale={0.75} /></g> : undefined}
        breathe={frame}
        eyes={closed ? 'closed' : 'down'}
        brow="sad"
        mouth="flat"
        look={[10, 4]}
        tear={closed ? tween(frame, smell + 2.5, smell + 6.5, 0, 0.95) : 0}
        blinkAmt={blink(frame, 40)}
      />
    </Stage>
  );
};

// 31–44 s. Close-up: he types, deletes, types, deletes.
export const Typing: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let typed = '';
  let typing = false;
  for (const [text, a, b, c] of BEATS.drafts) {
    if (t >= a && t < b) {
      typed = text.slice(0, Math.ceil(((t - a) / (b - a)) * text.length));
      typing = true;
    } else if (t >= b && t < c) typed = text;
    else if (t >= c && t < c + 0.6) {
      typed = text.slice(0, Math.floor((1 - (t - c) / 0.6) * text.length));
      typing = true;
    }
  }
  const tap = typing ? Math.abs(Math.sin(frame * 1.4)) : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.0, 1.08)} focus={[960, 640]}>
      <rect width={1920} height={1080} fill="#0B0C10" />
      <PhoneShell x={960} y={560} h={1000}>
        {(sw, sh) => <TypingScreen sw={sw} sh={sh} typed={typed} caret={Math.floor(frame / 15) % 2 === 0} lastSeen="last seen today at 2:14 AM" />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={270 - tap * 30} thumbX={-80 - Math.sin(frame * 0.9) * 60 * (typing ? 1 : 0)} />
    </Stage>
  );
};

// 44–55 s. 2 AM, her profile. He zooms into a photo where she's laughing without him.
export const Profile: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const [z0, z1] = BEATS.zoom;
  const zoom = tween(frame, z0, z1, 0, 1);
  const flick = keys(frame, [0.6, 1.0, 1.4, 2.2, 2.6, 3.0], [0, 1, 0, 0, 1, 0]);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 11, 1.0, 1.1)}>
      <rect width={1920} height={1080} fill="#08090C" />
      <PhoneShell x={960} y={560} h={1000} screen="#141922">
        {(sw, sh) => <ProfileScreen sw={sw} sh={sh} zoom={zoom} />}
      </PhoneShell>
      <PhoneHands x={960} y={560} h={1000} thumbY={330 - flick * 160 - zoom * 40} thumbX={-zoom * 40} />
    </Stage>
  );
};

// 55–68 s. Driving at night. Their song comes on. He switches it off before the chorus.
export const CarNight: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const { radioOn, radioOff } = BEATS;
  const radio = t < radioOn ? 0 : t < radioOff ? 1 : tween(frame, radioOff, radioOff + 0.2, 1, 0);
  const x = CAR.x;
  const y = sitY(CAR.seat, s);
  const reachT = keys(frame, [radioOff - 0.5, radioOff, radioOff + 0.5], [0, 1, 0]);
  const lean = 10 + reachT * 18;
  const body = { x, y, scale: s, lean };
  const wheel = reachArm(CAR.grip[0], CAR.grip[1], body);
  const wheelFar = reachArm(CAR.grip[0] + 10, CAR.grip[1] - 30, { ...body, side: 'far' });
  const toRadio = reachArm(CAR.radio[0], CAR.radio[1], body);
  const pose: Pose = { ...SIT, legNear: [80, 40], legFar: [76, 44], armNear: mixLimb(wheel, toRadio, reachT), armFar: wheelFar, lean, headY: t > radioOff + 0.6 ? 8 : 0 };
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.12, 1.22)} focus={[1000, 520]} shake={[0, wobble(frame, 2, 0.9) * 1.5]}>
      <CarInterior frame={frame} speed={9} radio={radio}>
        <Character
          x={x}
          y={y}
          scale={s}
          pose={pose}
          handNear={reachT > 0.5 ? 'point' : 'grip'}
          handFar="grip"
          breathe={frame}
          eyes={t > radioOn + 1 ? 'tired' : 'open'}
          brow={t > radioOn + 0.6 ? 'sad' : 'none'}
          mouth="flat"
          look={[10, 0]}
          tear={tween(frame, radioOn + 3.5, radioOn + 8.5, 0, 0.95)}
          blinkAmt={blink(frame, 23)}
        />
      </CarInterior>
    </Stage>
  );
};
