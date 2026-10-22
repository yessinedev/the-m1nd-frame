import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { HAND } from '../fonts';
import { Caption, CounterKey, CounterTone } from './Episode';
import { FPS } from './time';
import { C } from '../theme';
import { EASE_OUT } from './anim';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const TONE: Record<CounterTone, string> = { normal: C.text, red: C.red, amber: C.amber };

// Story captions, one at a time, fading in like a quiet thought.
export const Captions: React.FC<{ items: Caption[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cap = items.find((c) => t >= c.from && t < c.to);
  if (!cap) return null;
  const a = cap.from * FPS;
  const b = cap.to * FPS;
  const opacity = Math.min(
    interpolate(frame, [a, a + 10], [0, 1], { ...clamp, easing: EASE_OUT }),
    interpolate(frame, [b - 8, b], [1, 0], clamp),
  );
  const rise = interpolate(frame, [a, a + 12], [14, 0], { ...clamp, easing: EASE_OUT });
  const pos = cap.pos ?? 'bottom';
  const voice = cap.tone === 'voice';
  const quote = cap.tone === 'quote';
  return (
    <AbsoluteFill
      style={{
        justifyContent: pos === 'center' ? 'center' : pos === 'top' ? 'flex-start' : 'flex-end',
        alignItems: 'center',
        padding: pos === 'center' ? 0 : '120px 120px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: HAND,
          fontSize: voice ? 60 : 64,
          lineHeight: 1.15,
          letterSpacing: voice ? '0.04em' : '0.01em',
          color: voice ? C.voice : quote ? C.quote : C.text,
          textAlign: 'center',
          opacity,
          transform: `translateY(${rise}px)`,
          textShadow: '0 3px 18px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)',
          maxWidth: 1500,
        }}
      >
        {cap.text}
      </div>
    </AbsoluteFill>
  );
};

// "DAY 14" / "SCREEN TIME 6h 31m" in the top-left corner. Rolls to each new value; hides on null.
export const Counter: React.FC<{ keys: CounterKey[] }> = ({ keys: COUNTER }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let idx = -1;
  for (let i = 0; i < COUNTER.length; i++) if (COUNTER[i].at <= t) idx = i;
  if (idx < 0) return null;
  const cur = COUNTER[idx];
  const prev = idx > 0 ? COUNTER[idx - 1] : null;
  const since = frame - cur.at * FPS;
  const p = interpolate(since, [0, 9], [0, 1], { ...clamp, easing: EASE_OUT });

  const show = (text: string | null, tone: CounterTone | undefined, o: number, dy: number) =>
    text === null ? null : (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity: o,
          transform: `translateY(${dy}px)`,
          color: TONE[tone ?? 'normal'],
          textShadow: tone === 'red' ? '0 0 18px rgba(255,75,62,0.55)' : tone === 'amber' ? '0 0 18px rgba(255,181,71,0.45)' : '0 2px 10px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    );

  const shake = cur.tone === 'red' && since < 10 ? Math.sin(since * 2.4) * (10 - since) * 0.8 : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 96 + shake, top: 72, fontFamily: HAND, fontSize: 56, letterSpacing: '0.08em' }}>
        {prev && p < 1 ? show(prev.text, prev.tone, 1 - p, p * 18) : null}
        {show(cur.text, cur.tone, p, (1 - p) * -18)}
      </div>
    </AbsoluteFill>
  );
};
