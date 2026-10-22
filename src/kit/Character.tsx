import React from 'react';
import { C } from '../theme';

// The M1nd Frame cast. Origin = pelvis. Faces right by default; `facing={-1}` mirrors.
// Limb angles in degrees: [base, bend]. Base 0 = hanging straight down, positive = swings forward.
// Arms bend forward at the elbow; legs bend backward at the knee.
// v2: tapered limbs, real hands (relaxed / fist / open / point / grip), sneakers with foot roll,
// hoodie or sweater torso, eye highlights, blush, head tilt and 3/4 turn, and "her" with a bob haircut.

export type Limb = [number, number];
export type Eyes = 'open' | 'tired' | 'closed' | 'wide' | 'down' | 'happy';
export type Mouth = 'none' | 'flat' | 'frown' | 'smile' | 'open' | 'grin' | 'o' | 'talk';
export type Brow = 'none' | 'sad' | 'focused' | 'worried' | 'raised';
export type HandShape = 'relaxed' | 'fist' | 'open' | 'point' | 'grip';
export type Variant = 'him' | 'her' | 'sam' | 'lena' | 'jay' | 'leo' | 'kid' | 'nora' | 'mom' | 'nana';

export type Pose = {
  armFar: Limb;
  armNear: Limb;
  legFar: Limb;
  legNear: Limb;
  lean: number; // degrees, forward
  headY: number; // head drop (slump), px
  bob: number; // whole body vertical offset, px
  footFar?: number; // shoe pitch, degrees (+ = heel up)
  footNear?: number;
  tilt?: number; // head tilt, degrees (+ = toward facing direction)
};

export const STAND: Pose = { armFar: [6, 8], armNear: [-4, 8], legFar: [3, 0], legNear: [-3, 0], lean: 0, headY: 0, bob: 0 };
export const SIT: Pose = { armFar: [20, 50], armNear: [14, 55], legFar: [68, 62], legNear: [62, 58], lean: 4, headY: 0, bob: 0 };
export const SLUMP: Pose = { armFar: [30, 42], armNear: [26, 50], legFar: [66, 64], legNear: [60, 60], lean: 24, headY: 16, bob: 0 };

export const LEG_LEN = 82 + 80 + 22; // thigh + shin + shoe: pelvis height when standing
const UPPER = 72;
const FORE = 66;
const THIGH = 82;
const SHIN = 80;
const SHOULDER_Y = -140;
const HEAD_Y = -232;

const lerp = (x: number, y: number, t: number) => x + (y - x) * t;

export const mix = (a: Pose, b: Pose, t: number): Pose => {
  const ll = (x: Limb, y: Limb): Limb => [lerp(x[0], y[0], t), lerp(x[1], y[1], t)];
  return {
    armFar: ll(a.armFar, b.armFar),
    armNear: ll(a.armNear, b.armNear),
    legFar: ll(a.legFar, b.legFar),
    legNear: ll(a.legNear, b.legNear),
    lean: lerp(a.lean, b.lean, t),
    headY: lerp(a.headY, b.headY, t),
    bob: lerp(a.bob, b.bob, t),
    footFar: lerp(a.footFar ?? 0, b.footFar ?? 0, t),
    footNear: lerp(a.footNear ?? 0, b.footNear ?? 0, t),
    tilt: lerp(a.tilt ?? 0, b.tilt ?? 0, t),
  };
};

export const mixLimb = (a: Limb, b: Limb, t: number): Limb => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

// Heel-strike / toe-off: a forward leg lifts its toe, a trailing leg lifts its heel.
const footRoll = (legAngle: number, knee: number) => (legAngle >= 0 ? -legAngle * 0.5 : -legAngle * 0.9) + knee * 0.15;

// Walk cycle with arm lag, elbow follow-through, foot roll and a little head bob.
export const walk = (frame: number, pace = 1): Pose => {
  const p = frame * 0.2 * pace;
  const s = Math.sin(p);
  const c = Math.cos(p);
  const sa = Math.sin(p - 0.35); // arms trail the legs slightly
  const legFar: Limb = [s * 26, Math.max(0, c) * 34 + 4];
  const legNear: Limb = [-s * 26, Math.max(0, -c) * 34 + 4];
  return {
    legFar,
    legNear,
    footFar: footRoll(legFar[0], legFar[1]),
    footNear: footRoll(legNear[0], legNear[1]),
    armFar: [-sa * 22, 14 + Math.max(0, -sa) * 16],
    armNear: [sa * 22, 14 + Math.max(0, sa) * 16],
    lean: 3,
    headY: 0,
    bob: -Math.abs(c) * 5,
    tilt: Math.sin(p * 2 - 0.6) * 1.2,
  };
};

export const run = (frame: number, pace = 1): Pose => {
  const p = frame * 0.32 * pace;
  const s = Math.sin(p);
  const c = Math.cos(p);
  const sa = Math.sin(p - 0.3);
  const legFar: Limb = [s * 44 + 8, Math.max(0, c) * 70 + 18];
  const legNear: Limb = [-s * 44 + 8, Math.max(0, -c) * 70 + 18];
  return {
    legFar,
    legNear,
    footFar: footRoll(legFar[0], legFar[1]),
    footNear: footRoll(legNear[0], legNear[1]),
    armFar: [-sa * 40 + 10, 85],
    armNear: [sa * 40 + 10, 85],
    lean: 12,
    headY: 0,
    bob: -Math.abs(c) * 12,
    tilt: Math.sin(p * 2) * 1.5,
  };
};

// Idle life for a standing or sitting body: breath-driven sway and a slow weight shift.
export const idle = (frame: number, base: Pose, seed = 0): Pose => ({
  ...base,
  armFar: [base.armFar[0] + Math.sin(frame * 0.045 + seed) * 2, base.armFar[1] + Math.sin(frame * 0.05 + seed) * 2],
  armNear: [base.armNear[0] + Math.sin(frame * 0.04 + seed + 1) * 2, base.armNear[1] + Math.sin(frame * 0.055 + seed) * 2],
  tilt: (base.tilt ?? 0) + Math.sin(frame * 0.025 + seed) * 1.5,
});

// Talking: cycles mouth shapes at speech-like rhythm.
export const talkMouth = (frame: number, seed = 0): Mouth => {
  const v = Math.sin(frame * 0.9 + seed) + Math.sin(frame * 0.37 + seed * 2);
  return v > 0.8 ? 'open' : v > -0.2 ? 'talk' : v > -1 ? 'o' : 'flat';
};

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

// World position of a hand — so props can sit exactly in his grip.
export const handPos = (pose: Pose, x: number, y: number, scale = 1, facing: 1 | -1 = 1, side: 'near' | 'far' = 'near') => {
  const [a, e] = side === 'near' ? pose.armNear : pose.armFar;
  let hx = (side === 'near' ? 8 : -8) + Math.sin(rad(a)) * UPPER + Math.sin(rad(a + e)) * FORE;
  let hy = SHOULDER_Y + Math.cos(rad(a)) * UPPER + Math.cos(rad(a + e)) * FORE;
  const L = rad(pose.lean);
  [hx, hy] = [hx * Math.cos(L) - hy * Math.sin(L), hx * Math.sin(L) + hy * Math.cos(L)];
  return { x: x + hx * scale * facing, y: y + (hy + pose.bob) * scale };
};

export const nearHand = (pose: Pose, x: number, y: number, scale = 1, facing: 1 | -1 = 1) => handPos(pose, x, y, scale, facing, 'near');

// Two-link IK: the arm angles that put a hand on a world-space target.
// Pass the same x/y/scale/facing/lean/bob you render with. Out-of-reach targets get a straight arm.
export const reachArm = (
  tx: number,
  ty: number,
  body: { x: number; y: number; scale?: number; facing?: 1 | -1; lean?: number; bob?: number; side?: 'near' | 'far' },
): Limb => {
  const { x, y, scale = 1, facing = 1, lean = 0, bob = 0, side = 'near' } = body;
  let lx = (tx - x) / (scale * facing);
  let ly = (ty - y) / scale - bob;
  const L = rad(lean);
  [lx, ly] = [lx * Math.cos(L) + ly * Math.sin(L), -lx * Math.sin(L) + ly * Math.cos(L)];
  const dx = lx - (side === 'near' ? 8 : -8);
  const dy = ly - SHOULDER_Y;
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(UPPER - FORE) + 1), UPPER + FORE - 0.1);
  const phi = Math.atan2(dx, dy);
  const alpha = Math.acos((UPPER * UPPER + d * d - FORE * FORE) / (2 * UPPER * d));
  const beta = Math.acos((UPPER * UPPER + FORE * FORE - d * d) / (2 * UPPER * FORE));
  return [deg(phi - alpha), deg(Math.PI - beta)];
};

// Two-link IK for a leg: hip/knee angles that put the ankle on a world-space target (knee points forward).
// `scale` must include bodyScale for kids.
export const reachLeg = (
  tx: number,
  ty: number,
  body: { x: number; y: number; scale?: number; facing?: 1 | -1; bob?: number; side?: 'near' | 'far' },
): Limb => {
  const { x, y, scale = 1, facing = 1, bob = 0, side = 'near' } = body;
  const lx = (tx - x) / (scale * facing) - (side === 'near' ? 12 : -14);
  const ly = (ty - y) / scale - bob - (side === 'near' ? 0 : -2);
  const d = Math.min(Math.max(Math.hypot(lx, ly), Math.abs(THIGH - SHIN) + 1), THIGH + SHIN - 0.1);
  const phi = Math.atan2(lx, ly);
  const alpha = Math.acos((THIGH * THIGH + d * d - SHIN * SHIN) / (2 * THIGH * d));
  const beta = Math.acos((THIGH * THIGH + SHIN * SHIN - d * d) / (2 * THIGH * SHIN));
  return [deg(phi + alpha), deg(Math.PI - beta)];
};

// ---------- drawing ----------

// Tapered capsule along +y: radius r0 at the joint, r1 at the far end.
const Capsule: React.FC<{ len: number; r0: number; r1: number; fill: string }> = ({ len, r0, r1, fill }) => (
  <path d={`M ${-r0} 0 L ${-r1} ${len} A ${r1} ${r1} 0 0 0 ${r1} ${len} L ${r0} 0 A ${r0} ${r0} 0 0 0 ${-r0} 0 Z`} fill={fill} />
);

// Hand in wrist space: +y runs out along the forearm, +x is the thumb (forward) side.
const Hand: React.FC<{ shape: HandShape; skin: string; shade: string; item?: React.ReactNode; itemRot: number }> = ({
  shape,
  skin,
  shade,
  item,
  itemRot,
}) => {
  const placed = item ? <g transform={`rotate(${itemRot})`}>{item}</g> : null;
  const line = { stroke: shade, strokeWidth: 2.5, strokeLinecap: 'round' as const, fill: 'none' };
  if (shape === 'grip') {
    return (
      <g>
        <ellipse cx={-3} cy={13} rx={14} ry={15} fill={skin} />
        {placed}
        <g transform="translate(10 4) rotate(-14)">
          <Capsule len={17} r0={6} r1={5.2} fill={skin} />
        </g>
        {[8, 16, 24].map((y) => (
          <circle key={y} cx={-15} cy={y} r={5} fill={skin} />
        ))}
      </g>
    );
  }
  let hand: React.ReactNode;
  if (shape === 'fist' || shape === 'point') {
    hand = (
      <g>
        <circle cx={0} cy={13} r={15.5} fill={skin} />
        <path d="M 9 4 Q 15 13 9 23" {...line} />
        <rect x={0} y={4} width={15} height={9} rx={4.5} fill={skin} stroke={shade} strokeWidth={2} />
        {shape === 'point' ? (
          <g transform="translate(6 22)">
            <Capsule len={20} r0={5.5} r1={5} fill={skin} />
          </g>
        ) : null}
      </g>
    );
  } else if (shape === 'open') {
    hand = (
      <g>
        {[-9, -3, 3, 9].map((x, i) => (
          <g key={x} transform={`translate(${x} 18) rotate(${(i - 1.5) * -6})`}>
            <Capsule len={14 + (i === 1 || i === 2 ? 4 : 0)} r0={4.6} r1={4.2} fill={skin} />
          </g>
        ))}
        <ellipse cx={0} cy={12} rx={14} ry={13} fill={skin} />
        <g transform="translate(11 8) rotate(-62)">
          <Capsule len={15} r0={5.6} r1={5} fill={skin} />
        </g>
      </g>
    );
  } else {
    hand = (
      <g>
        <ellipse cx={1} cy={14} rx={14} ry={16.5} fill={skin} />
        <g transform="translate(9 6) rotate(-38)">
          <Capsule len={13} r0={5.6} r1={5} fill={skin} />
        </g>
        <path d="M -7 24 Q 0 29 8 23" {...line} />
      </g>
    );
  }
  return (
    <g>
      {hand}
      {placed}
    </g>
  );
};

type Look = { sleeve: string; sleeveShade: string; cuff: string; skin: string; skinShade: string };

const Arm: React.FC<{ limb: Limb; look: Look; shape: HandShape; item?: React.ReactNode; thick?: number; short?: boolean }> = ({ limb, look, shape, item, thick = 1, short = false }) => (
  <g transform={`rotate(${-limb[0]})`}>
    <Capsule len={UPPER} r0={16.5 * thick} r1={14.5 * thick} fill={short ? look.skin : look.sleeve} />
    {short ? <Capsule len={30} r0={18 * thick} r1={17 * thick} fill={look.sleeve} /> : null}
    <g transform={`translate(0 ${UPPER}) rotate(${-limb[1]})`}>
      <circle r={14.5 * thick} fill={short ? look.skin : look.sleeve} />
      <Capsule len={FORE - 4} r0={14.5 * thick} r1={13 * thick} fill={short ? look.skin : look.sleeve} />
      <g transform={`translate(0 ${FORE - 4})`}>
        {short ? null : <rect x={-15 * thick} y={-6} width={30 * thick} height={12} rx={6} fill={look.cuff} />}
        <g transform="translate(0 4)">
          <Hand shape={shape} skin={look.skin} shade={look.skinShade} item={item} itemRot={limb[0] + limb[1]} />
        </g>
      </g>
    </g>
  </g>
);

const Shoe: React.FC<{ fill: string; sole: string }> = ({ fill, sole }) => (
  <g transform="translate(0 8)">
    <path d="M -15 -4 Q -15 -15 -3 -15 L 12 -13 Q 33 -9 39 4 L 39 9 Q 39 14 33 14 L -12 14 Q -17 14 -17 8 Z" fill={fill} />
    <rect x={-17} y={9} width={56} height={5} rx={2.5} fill={sole} />
    <path d="M 4 -12 L 10 -3 M 12 -11 L 17 -3" stroke={sole} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

const Leg: React.FC<{ limb: Limb; pitch: number; fill: string; cuff: string; shoe: string; sole: string; thick?: number }> = ({ limb, pitch, fill, cuff, shoe, sole, thick = 1 }) => (
  <g transform={`rotate(${-limb[0]})`}>
    <Capsule len={THIGH} r0={18 * thick} r1={16 * thick} fill={fill} />
    <g transform={`translate(0 ${THIGH}) rotate(${limb[1]})`}>
      <circle r={16 * thick} fill={fill} />
      <Capsule len={SHIN} r0={16 * thick} r1={14 * thick} fill={fill} />
      <g transform={`translate(0 ${SHIN})`}>
        <rect x={-16 * thick} y={-10} width={32 * thick} height={10} rx={4} fill={cuff} />
        <g transform={`rotate(${limb[0] - limb[1] + pitch})`}>
          <Shoe fill={shoe} sole={sole} />
        </g>
      </g>
    </g>
  </g>
);

export type FaceProps = {
  eyes?: Eyes;
  mouth?: Mouth;
  brow?: Brow;
  look?: [number, number]; // eye offset, px
  blinkAmt?: number; // 1 = open, 0 = shut
  eyeGlow?: string; // tint reflected in the eyes (phone light)
  blush?: number; // 0..1
  turn?: number; // -1..1, slides features toward a 3/4 view
  tear?: number; // 0..1: a tear rolling down from the near eye (0 = none)
  stubble?: boolean;
  sweat?: boolean;
};

const EyeShape: React.FC<{ kind: Eyes; open: number; glow?: string }> = ({ kind, open, glow }) => {
  const lid = { stroke: C.ink, strokeWidth: 4.5, fill: 'none', strokeLinecap: 'round' as const };
  if (kind === 'closed' || open < 0.15) return <path d="M -11 0 Q 0 7 11 0" {...lid} />;
  if (kind === 'happy') return <path d="M -11 4 Q 0 -8 11 4" {...lid} />;
  if (kind === 'tired') {
    return (
      <g>
        <path d={`M -9 0 A 9 ${9 * open} 0 0 0 9 0 Z`} fill={C.ink} />
        <line x1={-12} y1={-1} x2={12} y2={-1} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
        <circle cx={-2} cy={4} r={2.4} fill={glow ?? '#FFFFFF'} opacity={glow ? 1 : 0.7} />
      </g>
    );
  }
  const rx = kind === 'wide' ? 11 : 9;
  const ry = (kind === 'wide' ? 17 : kind === 'down' ? 11 : 14) * open;
  return (
    <g>
      <ellipse rx={rx} ry={ry} fill={C.ink} />
      <ellipse cx={-3} cy={-ry * 0.38} rx={3.2} ry={3.6 * Math.min(1, open * 1.2)} fill={glow ?? '#FFFFFF'} opacity={glow ? 1 : 0.85} />
      {kind === 'wide' ? <circle cx={3.5} cy={5} r={1.6} fill="#FFFFFF" opacity={0.6} /> : null}
    </g>
  );
};

const STUBBLE = Array.from({ length: 34 }).map((_, i) => [Math.sin(i * 12.9898) * 43758.5453 % 1, Math.sin(i * 78.233) * 12543.21 % 1]);

export const Face: React.FC<FaceProps> = ({ eyes = 'open', mouth = 'none', brow = 'none', look = [0, 0], blinkAmt = 1, eyeGlow, blush = 0, turn = 0, tear = 0, stubble = false, sweat = false }) => {
  const dy = eyes === 'down' ? 8 : 0;
  const [lx, ly] = look;
  const shift = turn * 20;
  const spread = 26 * (1 - Math.abs(turn) * 0.22);
  return (
    <g>
      {blush > 0
        ? [-1, 1].map((side) => (
            <ellipse key={side} cx={side * (spread + 18) + shift * 0.8} cy={20} rx={14} ry={7.5} fill={C.blush} opacity={blush * 0.6} />
          ))
        : null}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * spread + shift + lx} ${-8 + ly + dy})`}>
          <EyeShape kind={eyes} open={blinkAmt} glow={eyeGlow} />
        </g>
      ))}
      {brow !== 'none'
        ? [-1, 1].map((side) => {
            // Inner end rises for sad/worried, drops for focused; raised lifts both ends.
            const inner = brow === 'focused' ? 6 : brow === 'raised' ? -12 : -7;
            const outer = brow === 'focused' ? -4 : brow === 'raised' ? -8 : 3;
            const y0 = -32 + ly + dy;
            const cx = shift + lx;
            return (
              <path
                key={side}
                d={`M ${cx + side * (spread + 14)} ${y0 + outer} Q ${cx + side * (spread + 1)} ${y0 + Math.min(inner, outer) - 3} ${cx + side * (spread - 12)} ${y0 + inner}`}
                stroke={C.ink}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
            );
          })
        : null}
      {sweat
        ? [
            [-58, -40, 1],
            [60, -30, 0.8],
            [52, 2, 0.7],
          ].map(([sx, sy, k], i) => (
            <path key={i} d="M 0 -7 Q 6 2 0 7 Q -6 2 0 -7 Z" fill="#BFD6F0" opacity={0.85} transform={`translate(${sx + shift * 0.5} ${sy}) scale(${1.3 * k})`} />
          ))
        : null}
      {stubble
        ? STUBBLE.map(([a, b], i) => <circle key={i} cx={shift * 0.7 + Math.abs(a) * 90 - 45} cy={22 + Math.abs(b) * 36} r={1.6} fill={C.ink} opacity={0.35} />)
        : null}
      {tear > 0 ? (
        <path
          d="M 0 -7 Q 6 2 0 7 Q -6 2 0 -7 Z"
          fill="#BFD6F0"
          opacity={Math.min(1, tear * 4) * (tear > 0.9 ? (1 - tear) * 10 : 1)}
          transform={`translate(${spread + shift + lx - 4} ${8 + ly + tear * 46}) scale(1.4)`}
        />
      ) : null}
      <g transform={`translate(${shift * 0.7 + lx * 0.6} ${30 + ly * 0.5})`}>
        {mouth === 'flat' ? <line x1={-11} x2={11} stroke={C.ink} strokeWidth={4} strokeLinecap="round" /> : null}
        {mouth === 'frown' ? <path d="M -12 5 Q 0 -5 12 5" stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" /> : null}
        {mouth === 'smile' ? <path d="M -13 -3 Q 0 9 13 -3" stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" /> : null}
        {mouth === 'grin' ? (
          <g>
            <path d="M -16 -4 Q 0 17 16 -4 Z" fill={C.ink} />
            <ellipse cx={0} cy={6} rx={6} ry={3} fill={C.tongue} />
          </g>
        ) : null}
        {mouth === 'open' ? <ellipse rx={8} ry={10} fill={C.ink} /> : null}
        {mouth === 'o' ? <ellipse rx={5.5} ry={6.5} fill={C.ink} /> : null}
        {mouth === 'talk' ? <ellipse rx={10} ry={5} fill={C.ink} /> : null}
      </g>
    </g>
  );
};

type Style = {
  top: string;
  topShade: string;
  pants: string;
  pantsShade: string;
  shoe: string;
  sole: string;
  hair?: string;
  cap?: string;
  pony?: boolean;
  long?: boolean; // long hair past the shoulders
  bun?: boolean; // hair pinned up in a bun at the back
  curly?: string; // curly hair colour
  short?: string; // short flat-top hair colour
  glasses?: boolean;
  round: boolean;
  hood: boolean;
};

const STYLES: Record<Variant, Style> = {
  him: { top: C.hoodie, topShade: C.hoodieShade, pants: C.pants, pantsShade: C.pantsShade, shoe: C.shoe, sole: C.sole, round: false, hood: true },
  her: { top: C.herTop, topShade: C.herTopShade, pants: C.herPants, pantsShade: C.herPantsShade, shoe: C.shoe, sole: C.sole, hair: C.hair, round: true, hood: false },
  sam: { top: C.samTop, topShade: C.samTopShade, pants: C.pants, pantsShade: C.pantsShade, shoe: C.shoe, sole: C.sole, cap: C.samCap, round: false, hood: true },
  nora: { top: '#5E8A7A', topShade: '#4C7264', pants: C.herPants, pantsShade: C.herPantsShade, shoe: C.shoe, sole: C.sole, hair: '#8A6A3A', long: true, round: true, hood: false },
  kid: { top: '#6E3B3B', topShade: '#5A3030', pants: C.pants, pantsShade: C.pantsShade, shoe: C.shoe, sole: C.sole, short: '#2A2420', round: false, hood: true },
  jay: { top: C.jayTop, topShade: C.jayTopShade, pants: C.pants, pantsShade: C.pantsShade, shoe: C.shoe, sole: C.sole, curly: '#2A1E19', round: false, hood: true },
  leo: { top: C.leoTop, topShade: C.leoTopShade, pants: C.herPants, pantsShade: C.herPantsShade, shoe: C.shoe, sole: C.sole, short: '#3B2E25', glasses: true, round: false, hood: true },
  mom: { top: '#7B6A5A', topShade: '#665747', pants: C.herPants, pantsShade: C.herPantsShade, shoe: C.shoe, sole: C.sole, hair: '#8A8178', bun: true, round: true, hood: false },
  nana: { top: '#6A5A70', topShade: '#574A5C', pants: C.herPants, pantsShade: C.herPantsShade, shoe: C.shoe, sole: C.sole, hair: '#D2CDC4', bun: true, glasses: true, round: true, hood: false },
  lena: { top: C.lilac, topShade: C.lilacShade, pants: C.herPants, pantsShade: C.herPantsShade, shoe: C.shoe, sole: C.sole, hair: C.auburn, pony: true, round: true, hood: true },
};

// Baseball cap with the brim pointing forward (+x).
const Cap: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <path d="M -80 -26 C -82 -96 82 -96 80 -26 Q 0 -44 -80 -26 Z" fill={color} />
    <path d="M 40 -40 Q 96 -46 122 -30 Q 100 -22 44 -26 Z" fill={color} />
    <path d="M 40 -40 Q 96 -46 122 -30" stroke="#00000033" strokeWidth={4} fill="none" />
    <circle cx={0} cy={-88} r={6} fill={color} />
    <path d="M -30 -84 Q -36 -56 -34 -34" stroke="#00000022" strokeWidth={3} fill="none" />
  </g>
);

// Head shape + hair, in head space (centre of the face at 0,0).
type HeadStyle = { round: boolean; hair?: string; cap?: string; pony?: boolean; long?: boolean; bun?: boolean; curly?: string; short?: string; glasses?: boolean };

// Gaming headset: band over the top, cups on both sides, mic boom on the near side.
const Headset: React.FC = () => (
  <g>
    <path d="M -84 -6 Q -86 -100 0 -100 Q 86 -100 84 -6" stroke="#1B1D22" strokeWidth={12} fill="none" strokeLinecap="round" />
    <rect x={-98} y={-28} width={28} height={64} rx={12} fill="#1B1D22" />
    <rect x={70} y={-28} width={28} height={64} rx={12} fill="#1B1D22" />
    <rect x={-94} y={-20} width={8} height={48} rx={4} fill="#3A3F4A" />
    <path d="M 86 26 Q 80 52 34 46" stroke="#1B1D22" strokeWidth={6} fill="none" strokeLinecap="round" />
    <circle cx={32} cy={46} r={7} fill="#1B1D22" />
  </g>
);

const Glasses: React.FC = () => (
  <g stroke={C.ink} strokeWidth={4} fill="none">
    <rect x={-46} y={-26} width={38} height={34} rx={12} />
    <rect x={8} y={-26} width={38} height={34} rx={12} />
    <line x1={-8} y1={-12} x2={8} y2={-12} />
  </g>
);

const HeadShape: React.FC<HeadStyle & { swing?: number; headset?: boolean; children?: React.ReactNode }> = ({ round, hair, cap, pony, long, bun, curly, short, glasses, headset, swing = 0, children }) => (
  <g>
    {hair && bun ? <circle cx={-52} cy={-84} r={40} fill={hair} /> : null}
    {hair && long ? <rect x={-92 + swing * 0.3} y={-86} width={184} height={250} rx={70} fill={hair} /> : null}
    {hair && pony ? (
      <g transform={`translate(-78 -46) rotate(${24 + swing * 3})`}>
        <ellipse cx={-8} cy={46} rx={30} ry={58} fill={hair} />
        <rect x={-20} y={-6} width={24} height={14} rx={6} fill={C.lilacShade} />
      </g>
    ) : null}
    {hair ? <rect x={-88} y={-88} width={176} height={154} rx={74} fill={hair} transform={`translate(${swing * 0.4} 0)`} /> : null}
    <rect x={round ? -73 : -75} y={-69} width={round ? 146 : 150} height={round ? 136 : 138} rx={round ? 64 : 54} fill={C.skin} />
    <path d="M 75 -10 L 75 15 Q 75 69 21 69 L 0 69 Q 55 60 62 10 Z" fill={C.skinShade} opacity={0.45} />
    {children}
    {hair ? (
      <g fill={hair}>
        <path d="M -78 -18 C -84 -72 -42 -92 0 -90 C 42 -92 84 -72 78 -18 C 62 -42 34 -54 10 -50 C -18 -48 -50 -40 -78 -18 Z" />
        <path d={`M -80 -30 Q ${-88 + swing} 20 ${-72 + swing} 62 L ${-58 + swing} 62 Q -68 12 -64 -30 Z`} />
        <path d={`M 80 -30 Q ${88 + swing} 20 ${72 + swing} 62 L ${58 + swing} 62 Q 68 12 64 -30 Z`} />
      </g>
    ) : null}
    {curly ? (
      <g fill={curly}>
        {[-60, -30, 0, 30, 60].map((cx, i) => (
          <circle key={cx} cx={cx} cy={-68 - (i % 2) * 8} r={26} />
        ))}
        {[-74, 74].map((cx) => (
          <circle key={cx} cx={cx} cy={-44} r={18} />
        ))}
      </g>
    ) : null}
    {short ? <path d="M -76 -34 Q -78 -82 0 -82 Q 78 -82 76 -34 Q 40 -50 0 -48 Q -40 -50 -76 -34 Z" fill={short} /> : null}
    {glasses ? (
      <g transform="translate(0 -6)">
        <Glasses />
      </g>
    ) : null}
    {cap ? <Cap color={cap} /> : null}
    {headset ? <Headset /> : null}
  </g>
);

// The head on its own — for lying in bed, close-ups and the end card.
export const Head: React.FC<
  FaceProps & { x?: number; y?: number; scale?: number; rotate?: number; hood?: boolean; hoodColor?: string; variant?: Variant; hairSwing?: number; headset?: boolean }
> = ({ x = 0, y = 0, scale = 1, rotate = 0, hood = false, hoodColor = C.hoodieShade, variant = 'him', hairSwing = 0, headset = false, ...face }) => {
  const st = STYLES[variant];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {hood ? <ellipse cx={0} cy={62} rx={66} ry={30} fill={hoodColor} /> : null}
      <HeadShape {...st} headset={headset} swing={hairSwing}>
        <Face {...face} />
      </HeadShape>
    </g>
  );
};

export type CharacterProps = FaceProps & {
  x: number;
  y: number; // pelvis
  scale?: number;
  facing?: 1 | -1;
  pose?: Pose;
  breathe?: number; // frame counter for idle breathing; omit to freeze
  variant?: Variant;
  hoodie?: string; // override top colours (e.g. the friend)
  hoodieShade?: string;
  handNear?: HandShape;
  handFar?: HandShape;
  nearItem?: React.ReactNode; // drawn in the near hand, kept upright in body space
  farItem?: React.ReactNode;
  hairSwing?: number;
  opacity?: number;
  bodyScale?: number; // < 1 shrinks body + limbs but not the head: kids (0.74)
  headset?: boolean;
  build?: number; // > 1 = broader, heavier body (1.35 = big guy)
  tee?: string; // t-shirt colour: short sleeves, no hood
};

// Darken a #rrggbb colour by `k` (0..1).
const darken = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(v * (1 - k)).toString(16).padStart(2, '0');
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
};

export const KID = 0.74;

export const Character: React.FC<CharacterProps> = ({
  x,
  y,
  scale = 1,
  facing = 1,
  pose = STAND,
  breathe,
  variant = 'him',
  hoodie,
  hoodieShade,
  handNear,
  handFar,
  nearItem,
  farItem,
  hairSwing = 0,
  opacity = 1,
  bodyScale: bs = 1,
  headset = false,
  build = 1,
  tee,
  ...face
}) => {
  const st = STYLES[variant];
  const top = tee ?? hoodie ?? st.top;
  const topShade = tee ? darken(tee, 0.18) : hoodieShade ?? st.topShade;
  const hood = st.hood && !tee;
  const thick = 1 + (build - 1) * 0.7;
  const br = breathe === undefined ? 0 : Math.sin(breathe * 0.07) * 1.6;
  const near: Look = { sleeve: top, sleeveShade: topShade, cuff: topShade, skin: C.skin, skinShade: C.skinShade };
  const far: Look = { sleeve: topShade, sleeveShade: topShade, cuff: C.ink, skin: C.skinShade, skinShade: '#B9B1A2' };
  return (
    <g transform={`translate(${x} ${y + pose.bob * scale}) scale(${scale * facing} ${scale})`} opacity={opacity}>
      <g transform={`scale(${bs})`}>
      <g transform={`translate(${-14 * build} -2)`}>
        <Leg limb={pose.legFar} pitch={pose.footFar ?? 0} fill={st.pantsShade} cuff={C.ink} shoe={C.skinShade} sole="#A9A193" thick={thick} />
      </g>
      <g transform={`translate(${12 * build} 0)`}>
        <Leg limb={pose.legNear} pitch={pose.footNear ?? 0} fill={st.pants} cuff={st.pantsShade} shoe={st.shoe} sole={st.sole} thick={thick} />
      </g>
      </g>
      <g transform={`rotate(${pose.lean})`}>
        <g transform={`scale(${bs})`}>
        <g transform={`translate(-8 ${SHOULDER_Y})`}>
          <Arm limb={pose.armFar} look={far} shape={handFar ?? (farItem ? 'grip' : 'relaxed')} item={farItem} thick={thick} short={!!tee} />
        </g>
        {/* torso */}
        <g transform={`translate(0 ${br * 0.5}) scale(${build} ${1 + br * 0.004})`}>
          {hood ? <ellipse cx={-6} cy={-166} rx={58} ry={26} fill={topShade} /> : null}
          <path
            d="M -44 -170 C -62 -170 -64 -150 -62 -128 L -56 -8 C -55 10 -44 16 -30 16 L 30 16 C 44 16 55 10 56 -8 L 62 -128 C 64 -150 62 -170 44 -170 Z"
            fill={top}
          />
          <path d="M -44 -170 C -62 -170 -64 -150 -62 -128 L -56 -8 C -55 6 -48 13 -40 15 L -40 -150 C -40 -160 -42 -168 -44 -170 Z" fill={topShade} opacity={0.45} />
          <path d="M -56 -10 L 56 -10 L 56 -2 C 55 10 44 16 30 16 L -30 16 C -44 16 -55 10 -56 -2 Z" fill={topShade} />
          {hood ? (
            <>
              <path d="M -38 -68 L 30 -68 Q 38 -68 38 -60 L 38 -34 Q 38 -28 32 -28 L -38 -28 Z" fill={topShade} opacity={0.85} />
              <path d="M -46 -170 Q 0 -144 46 -170" stroke={topShade} strokeWidth={9} fill="none" strokeLinecap="round" />
              <line x1={-12} y1={-152} x2={-14} y2={-112} stroke={C.skinShade} strokeWidth={3.5} strokeLinecap="round" />
              <line x1={12} y1={-152} x2={14} y2={-116} stroke={C.skinShade} strokeWidth={3.5} strokeLinecap="round" />
              <circle cx={-14} cy={-110} r={3} fill={C.skinShade} />
              <circle cx={14} cy={-114} r={3} fill={C.skinShade} />
            </>
          ) : (
            <>
              <path d="M -34 -170 Q 0 -146 34 -170" stroke={topShade} strokeWidth={7} fill="none" strokeLinecap="round" />
              <path d="M -48 -120 Q -40 -80 -46 -40" stroke={topShade} strokeWidth={2.5} fill="none" opacity={0.6} />
            </>
          )}
        </g>
        </g>
        <g transform={`translate(${pose.headY * 0.35} ${HEAD_Y + 170 * (1 - bs) + pose.headY + br}) rotate(${pose.tilt ?? 0} 0 60)`}>
          <HeadShape {...st} headset={headset} swing={hairSwing}>
            <Face {...face} />
          </HeadShape>
        </g>
        <g transform={`scale(${bs}) translate(8 ${SHOULDER_Y})`}>
          <Arm limb={pose.armNear} look={near} shape={handNear ?? (nearItem ? 'grip' : 'relaxed')} item={nearItem} thick={thick} short={!!tee} />
        </g>
      </g>
    </g>
  );
};
