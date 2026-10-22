import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../theme';

// One scene = one Stage: a 1920×1080 SVG with a camera (zoom toward a focus point + shake)
// and a fade-to-black veil.
export const Stage: React.FC<{
  children: React.ReactNode;
  zoom?: number;
  focus?: [number, number];
  shake?: [number, number];
  fade?: number;
  bg?: string;
  tint?: { color: string; opacity: number };
}> = ({ children, zoom = 1, focus = [960, 540], shake = [0, 0], fade = 1, bg = C.black, tint }) => (
  <AbsoluteFill style={{ backgroundColor: bg }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
      <g transform={`translate(${shake[0]} ${shake[1]}) translate(${focus[0]} ${focus[1]}) scale(${zoom}) translate(${-focus[0]} ${-focus[1]})`}>
        {children}
      </g>
      {tint && tint.opacity > 0 ? <rect width={1920} height={1080} fill={tint.color} opacity={tint.opacity} style={{ mixBlendMode: 'overlay' }} /> : null}
      <rect width={1920} height={1080} fill={C.black} opacity={1 - fade} />
    </svg>
  </AbsoluteFill>
);

// Film grain: animated turbulence, re-seeded every 2 frames.
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 97;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, mixBlendMode: 'screen' }}>
      <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="none">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={960} height={540} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.62) 100%)',
    }}
  />
);

// Speed lines trailing behind a moving/striking body.
export const SpeedLines: React.FC<{ x: number; y: number; dir?: 1 | -1; opacity?: number; frame: number; color?: string }> = ({
  x,
  y,
  dir = -1,
  opacity = 1,
  frame,
  color = C.amber,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    {Array.from({ length: 7 }).map((_, i) => {
      const len = 90 + ((i * 37 + frame * 9) % 80);
      const yy = -120 + i * 38;
      return <line key={i} x1={0} y1={yy} x2={dir * len} y2={yy - dir * 6} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.55} />;
    })}
  </g>
);
