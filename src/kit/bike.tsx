import React from 'react';
import { random } from 'remotion';
import { C, FLOOR } from '../theme';
import { Pose, reachArm, reachLeg } from './Character';
import { Glow } from './props';

// Bicycle in profile, facing right, plus the rider rig that pedals it.
// Bike units: origin = ground point under the frame centre; `g` scales everything.
const BIKE = {
  rear: [-108, -70] as [number, number],
  front: [112, -70] as [number, number],
  crank: [-8, -60] as [number, number],
  seat: [-42, -168] as [number, number],
  head: [78, -158] as [number, number],
  grip: [92, -184] as [number, number],
  wheel: 70,
  crankLen: 28,
};

const at = (bx: number, by: number, g: number, p: [number, number]): [number, number] => [bx + p[0] * g, by + p[1] * g];

export const Bicycle: React.FC<{ x: number; y?: number; g?: number; spin: number; color: string; layer: 'back' | 'front' }> = ({
  x,
  y = FLOOR,
  g = 1,
  spin,
  color,
  layer,
}) => {
  const B = BIKE;
  const wheel = (c: [number, number]) => (
    <g transform={`translate(${c[0]} ${c[1]})`}>
      <circle r={B.wheel} fill="none" stroke="#14161A" strokeWidth={11} />
      <circle r={B.wheel - 6} fill="none" stroke={C.line} strokeWidth={2} />
      <g transform={`rotate(${(spin * 180) / Math.PI})`}>
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <line key={a} x1={0} y1={-B.wheel + 8} x2={0} y2={B.wheel - 8} stroke={C.line} strokeWidth={1.6} transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r={7} fill={C.line} />
    </g>
  );
  const crankEnd = (a: number): [number, number] => [B.crank[0] + Math.cos(a) * B.crankLen, B.crank[1] + Math.sin(a) * B.crankLen];
  const far = crankEnd(spin + Math.PI);
  const near = crankEnd(spin);
  const tube = { stroke: color, strokeWidth: 9, strokeLinecap: 'round' as const, fill: 'none' };
  return (
    <g transform={`translate(${x} ${y}) scale(${g})`}>
      {layer === 'back' ? (
        <>
          <line x1={B.crank[0]} y1={B.crank[1]} x2={far[0]} y2={far[1]} stroke="#3A3F4A" strokeWidth={6} strokeLinecap="round" />
          <rect x={far[0] - 12} y={far[1] - 4} width={24} height={8} rx={3} fill="#3A3F4A" />
          {wheel(B.rear)}
          {wheel(B.front)}
          <path d={`M ${B.rear[0]} ${B.rear[1]} L ${B.crank[0]} ${B.crank[1]} L ${B.seat[0] + 4} ${B.seat[1] + 16} Z`} {...tube} />
          <path d={`M ${B.crank[0]} ${B.crank[1]} L ${B.head[0]} ${B.head[1] + 22} M ${B.seat[0] + 4} ${B.seat[1] + 18} L ${B.head[0]} ${B.head[1] + 8}`} {...tube} />
          <path d={`M ${B.head[0]} ${B.head[1]} L ${B.front[0]} ${B.front[1]} M ${B.head[0]} ${B.head[1]} L ${B.grip[0] - 6} ${B.grip[1] + 6} L ${B.grip[0] + 12} ${B.grip[1]}`} {...tube} />
          <ellipse cx={B.seat[0]} cy={B.seat[1]} rx={22} ry={7} fill="#14161A" />
          <circle cx={B.crank[0]} cy={B.crank[1]} r={12} fill="#2A2E36" stroke={C.line} strokeWidth={2} />
        </>
      ) : (
        <>
          <line x1={B.crank[0]} y1={B.crank[1]} x2={near[0]} y2={near[1]} stroke="#5A606C" strokeWidth={7} strokeLinecap="round" />
          <rect x={near[0] - 13} y={near[1] - 4} width={26} height={8} rx={3} fill="#5A606C" />
        </>
      )}
    </g>
  );
};

// Everything a rider needs: pelvis position, a pose with feet on the pedals and hands on the grips.
// `k` = rider scale × bodyScale (limb scale); `spin` = crank angle in radians.
export const ride = (bx: number, by: number, g: number, spin: number, k: number, lean = 28, bob = 0) => {
  const B = BIKE;
  const [px, py] = at(bx, by, g, [B.seat[0], B.seat[1] - 14]);
  const pedal = (a: number) => at(bx, by, g, [B.crank[0] + Math.cos(a) * B.crankLen, B.crank[1] + Math.sin(a) * B.crankLen - 12]);
  const nearP = pedal(spin);
  const farP = pedal(spin + Math.PI);
  const grip = at(bx, by, g, B.grip);
  const body = { x: px, y: py + bob, scale: k, lean };
  const legNear = reachLeg(nearP[0], nearP[1], { ...body, side: 'near' });
  const legFar = reachLeg(farP[0], farP[1], { ...body, side: 'far' });
  const pose: Pose = {
    legNear,
    legFar,
    footNear: Math.sin(spin) * 8,
    footFar: Math.sin(spin + Math.PI) * 8,
    armNear: reachArm(grip[0] + 6, grip[1] + 4, { ...body }),
    armFar: reachArm(grip[0] - 4, grip[1] + 2, { ...body, side: 'far' }),
    lean,
    headY: 0,
    bob: 0,
    tilt: -lean * 0.65,
  };
  return { x: px, y: py + bob, pose };
};

// Suburban street at golden hour: houses, fences, trees scrolling past. `offset` scrolls left.
export const Suburb: React.FC<{ offset: number; sunY?: number; dusk?: number }> = ({ offset, sunY = 520, dusk = 0 }) => {
  const span = 2800;
  const houses = Array.from({ length: 6 }).map((_, i) => ({
    x: i * 470 + random(`hx${i}`) * 60,
    w: 300 + random(`hw${i}`) * 80,
    h: 220 + random(`hh${i}`) * 60,
    tree: random(`ht${i}`) > 0.4,
  }));
  const far = ((offset * 0.5) % span + span) % span;
  const sky = dusk > 0.5 ? '#171A22' : '#241C18';
  return (
    <g>
      <rect width={1920} height={1080} fill={sky} />
      {dusk < 1 ? (
        <g opacity={1 - dusk}>
          <Glow x={1350} y={sunY} r={800} color={C.amber} opacity={0.55} />
          <circle cx={1350} cy={sunY} r={120} fill={C.amber} />
        </g>
      ) : null}
      <g transform={`translate(${-far} 0)`}>
        {[0, 1].map((rep) =>
          houses.map((h, i) => {
            const x0 = rep * span + h.x;
            const base = FLOOR - 40;
            return (
              <g key={`${rep}${i}`}>
                <rect x={x0} y={base - h.h} width={h.w} height={h.h} fill="#15130F" stroke="#2A2620" strokeWidth={3} />
                <path d={`M ${x0 - 20} ${base - h.h} L ${x0 + h.w / 2} ${base - h.h - 110} L ${x0 + h.w + 20} ${base - h.h} Z`} fill="#1B1814" stroke="#2A2620" strokeWidth={3} />
                <rect x={x0 + 40} y={base - h.h + 50} width={56} height={60} fill={dusk > 0.5 ? '#6E5A33' : '#2A2620'} />
                <rect x={x0 + h.w - 100} y={base - h.h + 50} width={56} height={60} fill="#2A2620" />
                <rect x={x0 + h.w / 2 - 30} y={base - 110} width={60} height={110} fill="#221F1A" />
                {h.tree ? (
                  <g transform={`translate(${x0 + h.w + 70} ${base})`}>
                    <rect x={-10} y={-200} width={20} height={200} fill="#0F0E0C" />
                    <circle cx={0} cy={-250} r={90} fill="#14130F" />
                  </g>
                ) : null}
              </g>
            );
          }),
        )}
      </g>
      {/* fence + sidewalk scroll at full speed */}
      <g transform={`translate(${-(((offset % 120) + 120) % 120)} 0)`}>
        {Array.from({ length: 18 }).map((_, i) => (
          <rect key={i} x={i * 120} y={FLOOR - 110} width={12} height={70} fill="#1F1C17" />
        ))}
        <rect x={0} y={FLOOR - 92} width={2200} height={8} fill="#1F1C17" />
      </g>
      <rect y={FLOOR - 40} width={1920} height={40} fill="#161512" />
      <rect y={FLOOR} width={1920} height={240} fill={C.floor} />
      <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
      <g transform={`translate(${-(((offset % 240) + 240) % 240)} 0)`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1={i * 240} x2={i * 240 + 120} y1={FLOOR + 90} y2={FLOOR + 90} stroke={C.lineSoft} strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
};
