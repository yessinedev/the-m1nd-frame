import React from 'react';
import { C, FLOOR } from '../theme';
import { BED } from './props';

// Future-self set pieces (episode 9+): a blanket over legs for sitting up in bed, a sketchbook on a
// desk, a close-up sketch page that draws itself, an easel and framed drawings.

// Blanket over the legs of someone sitting up in bed, from `x0` (hips) to the foot of the bed at `x1`.
export const LapBlanket: React.FC<{ x0: number; x1: number; breathe?: number }> = ({ x0, x1, breathe = 0 }) => {
  const top = FLOOR - BED.height;
  const b = Math.sin(breathe * 0.07) * 2;
  return (
    <g>
      <path
        d={`M ${x0 - 40} ${top + 50} C ${x0 - 30} ${top - 70 - b}, ${x0 + 120} ${top - 74 - b}, ${x0 + 220} ${top - 56}
            C ${x0 + 320} ${top - 44}, ${x1 - 120} ${top - 54}, ${x1 - 40} ${top - 30}
            Q ${x1} ${top - 20} ${x1 - 6} ${top + 60} L ${x0 - 40} ${top + 60} Z`}
        fill={C.blanket}
        stroke={C.line}
        strokeWidth={3}
      />
      <path d={`M ${x0 + 40} ${top - 30} C ${x0 + 160} ${top - 50}, ${x0 + 300} ${top - 40}, ${x0 + 380} ${top - 22}`} stroke={C.blanketShade} strokeWidth={10} fill="none" strokeLinecap="round" />
    </g>
  );
};

// The drawing in the sketchbook: a mountain range, a sun and a path. `p` 0..1 draws it stroke by stroke.
const STROKES = [
  'M 20 220 L 110 90 L 170 170 L 250 60 L 340 200 L 380 220',
  'M 300 70 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0',
  'M 190 300 Q 220 260 200 230 Q 180 200 230 180',
  'M 40 260 L 360 260',
  'M 120 130 L 140 150 L 160 140',
  'M 230 110 L 250 130 L 270 110',
];

const Drawing: React.FC<{ p: number; color?: string }> = ({ p, color = '#3A3530' }) => (
  <g fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    {STROKES.map((d, i) => {
      const k = Math.max(0, Math.min(1, p * STROKES.length - i));
      return k > 0 ? <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} /> : null;
    })}
  </g>
);

// Close-up sketch page (400×320 drawing area), centred at (x, y). `dust` greys it over.
export const SketchPage: React.FC<{ x: number; y: number; p: number; scale?: number; dust?: number; rotate?: number }> = ({ x, y, p, scale = 1, dust = 0, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-250} y={-200} width={500} height={400} rx={8} fill="#E9E3D6" />
    <rect x={-250} y={-200} width={500} height={400} rx={8} fill="none" stroke="#BDB5A7" strokeWidth={4} />
    {Array.from({ length: 9 }).map((_, i) => (
      <circle key={i} cx={-250} cy={-170 + i * 42} r={9} fill="#16181D" />
    ))}
    <g transform="translate(-200 -160)">
      <Drawing p={p} />
    </g>
    <rect x={-250} y={-200} width={500} height={400} rx={8} fill="#8A8F98" opacity={dust * 0.45} />
  </g>
);

// Open sketchbook lying on a surface at y (side-on, slightly tilted toward camera).
export const Sketchbook: React.FC<{ x: number; y: number; p: number; dust?: number }> = ({ x, y, p, dust = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -120 0 L 0 -6 L 120 0 L 112 -40 L 0 -46 L -112 -40 Z" fill="#E9E3D6" stroke="#BDB5A7" strokeWidth={3} />
    <line x1={0} y1={-46} x2={0} y2={-6} stroke="#BDB5A7" strokeWidth={3} />
    <g transform="translate(8 -42) scale(0.26 0.09)">
      <Drawing p={p} color="#2A2622" />
    </g>
    <path d="M -120 0 L 0 -6 L 120 0 L 112 -40 L 0 -46 L -112 -40 Z" fill="#8A8F98" opacity={dust * 0.5} />
  </g>
);

// Easel with a canvas facing the camera. `p` paints the picture in.
export const Easel: React.FC<{ x: number; p: number }> = ({ x, p }) => (
  <g transform={`translate(${x} 0)`}>
    <line x1={-110} y1={FLOOR} x2={-20} y2={FLOOR - 560} stroke="#5A4630" strokeWidth={14} strokeLinecap="round" />
    <line x1={110} y1={FLOOR} x2={20} y2={FLOOR - 560} stroke="#5A4630" strokeWidth={14} strokeLinecap="round" />
    <line x1={0} y1={FLOOR - 560} x2={60} y2={FLOOR} stroke="#4A3A28" strokeWidth={10} strokeLinecap="round" />
    <rect x={-120} y={FLOOR - 260} width={240} height={14} rx={4} fill="#5A4630" />
    <g transform={`translate(0 ${FLOOR - 420})`}>
      <rect x={-150} y={-140} width={300} height={290} fill="#F1ECE2" stroke={C.line} strokeWidth={4} />
      <rect x={-150} y={-140} width={300} height={290 * Math.min(1, p * 1.5)} fill="#E9C98A" opacity={0.5} />
      <g transform="translate(-130 -110) scale(0.65)">
        <Drawing p={p} color="#3A3530" />
      </g>
    </g>
  </g>
);

// A framed drawing on the wall.
export const FramedArt: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number }> = ({ x, y, w = 200, h = 160, seed = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#2A2420" stroke={C.line} strokeWidth={4} />
    <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} fill="#E9E3D6" />
    <g transform={`translate(${-w / 2 + 24} ${-h / 2 + 22}) scale(${(w - 48) / 400} ${(h - 44) / 280})`}>
      <Drawing p={1} color={['#3A3530', '#5A4630', '#3D5A80'][seed % 3]} />
    </g>
  </g>
);
