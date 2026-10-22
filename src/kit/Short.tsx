import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { HAND } from '../fonts';
import { C } from '../theme';
import { EASE_IN_OUT } from './anim';
import { Caption, CounterKey, Music, SceneProps, Sfx, Soundtrack } from './Episode';
import { Grain, Vignette } from './fx';
import { Captions, Counter } from './text';
import { f, SHORT_WIDTH } from './time';

// A 9:16 Short cut from a finished 16:9 episode. The episode's scenes play through a vertical
// window; each clip frames them with its own camera. Captions, counter and SFX are carried over
// from the episode's script and retimed to the cut; the score is written per Short.

// Camera over the 1920×1080 stage: focus point (stage px), scale, and a slow push-in across the clip.
// `to` pans/zooms toward another framing over the clip.
export type Cam = { x: number; y?: number; s?: number; push?: number; to?: { x?: number; y?: number; s?: number } };
// [from, to] in episode seconds.
export type Clip = { from: number; to: number; cam: Cam };

const WIN_TOP = 300; // hook title above, Shorts UI below
const WIN_H = 1200;
const CAP_BOTTOM = 1570; // caption box; Captions pads 120 px, so text sits at ~1450
const FADE_PX = 90;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const shortDuration = (clips: Clip[]) => clips.reduce((t, c) => t + (c.to - c.from), 0);

// Start of each clip on the Short's timeline, in seconds.
const clipStarts = (clips: Clip[]) => {
  let t = 0;
  return clips.map((c) => {
    const s = t;
    t += c.to - c.from;
    return s;
  });
};

const retimeCaptions = (clips: Clip[], items: Caption[]): Caption[] => {
  const starts = clipStarts(clips);
  return clips.flatMap((c, i) =>
    items
      .map((cap) => ({ ...cap, from: Math.max(cap.from, c.from), to: Math.min(cap.to, c.to) }))
      .filter((cap) => cap.to - cap.from >= 0.8)
      .map((cap) => ({ ...cap, from: starts[i] + cap.from - c.from, to: starts[i] + cap.to - c.from })),
  );
};

// The value showing at each cut is carried in; it only re-rolls when it actually changes.
const retimeCounter = (clips: Clip[], keys: CounterKey[]): CounterKey[] => {
  const starts = clipStarts(clips);
  const out: CounterKey[] = [];
  const push = (k: CounterKey) => {
    const last = out[out.length - 1];
    if (last && last.text === k.text && last.tone === k.tone) return;
    out.push(k);
  };
  clips.forEach((c, i) => {
    const carried = keys.filter((k) => k.at <= c.from).pop();
    if (carried) push({ ...carried, at: starts[i] });
    keys.filter((k) => k.at > c.from && k.at < c.to).forEach((k) => push({ ...k, at: starts[i] + k.at - c.from }));
  });
  return out;
};

const retimeSfx = (clips: Clip[], sfx: Sfx[]): Sfx[] => {
  const starts = clipStarts(clips);
  return clips.flatMap((c, i) =>
    sfx
      .filter((s) => s.at >= c.from && s.at < c.to - 0.1)
      .map((s) => ({ ...s, at: starts[i] + s.at - c.from, dur: Math.min(s.dur ?? 3, c.to - s.at) })),
  );
};

// "Why you always relapse on *Day 6*." — starred words take the accent colour.
const Hook: React.FC<{ text: string; accent: string }> = ({ text, accent }) => (
  <div
    style={{
      position: 'absolute',
      left: 60,
      right: 60,
      top: 90,
      height: 210,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontFamily: HAND,
      fontSize: 76,
      lineHeight: 1.1,
      letterSpacing: '0.01em',
      color: C.text,
      textShadow: '0 3px 18px rgba(0,0,0,0.85)',
    }}
  >
    <div>
      {text.split('*').map((part, i) => (
        <span key={i} style={i % 2 ? { color: accent } : undefined}>
          {part}
        </span>
      ))}
    </div>
  </div>
);

function Shot<Id extends string>({ clip, scenes, components }: { clip: Clip; scenes: [Id, number, number][]; components: Record<Id, React.FC<SceneProps>> }) {
  const frame = useCurrentFrame();
  const len = f(clip.to) - f(clip.from);
  const p = interpolate(frame, [0, len], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const { x, y = 560, s = 1.3, push = 0.04, to = {} } = clip.cam;
  const scale = interpolate(p, [0, 1], [s, to.s ?? s]) * (1 + push * p);
  const fx = interpolate(p, [0, 1], [x, to.x ?? x]);
  const fy = interpolate(p, [0, 1], [y, to.y ?? y]);
  // Keep the window inside the stage.
  const halfW = SHORT_WIDTH / 2 / scale;
  const halfH = WIN_H / 2 / scale;
  const cx = Math.min(Math.max(fx, halfW), 1920 - halfW);
  const cy = Math.min(Math.max(fy, halfH), 1080 - halfH);
  const mask = `linear-gradient(to bottom, transparent 0, black ${FADE_PX}px, black ${WIN_H - FADE_PX}px, transparent ${WIN_H}px)`;
  return (
    <div style={{ position: 'absolute', left: 0, top: WIN_TOP, width: SHORT_WIDTH, height: WIN_H, overflow: 'hidden', maskImage: mask, WebkitMaskImage: mask }}>
      <div
        style={{
          position: 'absolute',
          width: 1920,
          height: 1080,
          transformOrigin: '0 0',
          transform: `translate(${SHORT_WIDTH / 2 - cx * scale}px, ${WIN_H / 2 - cy * scale}px) scale(${scale})`,
        }}
      >
        <Sequence from={-f(clip.from)}>
          {scenes.map(([id, start, end]) => {
            const Scene: React.FC<SceneProps> = components[id];
            const dur = f(end) - f(start);
            return (
              <Sequence key={id} name={id} from={f(start)} durationInFrames={dur}>
                <Scene dur={dur} />
              </Sequence>
            );
          })}
        </Sequence>
      </div>
      <Vignette />
    </div>
  );
}

export type ShortProps<Id extends string> = {
  scenes: [Id, number, number][];
  components: Record<Id, React.FC<SceneProps>>;
  clips: Clip[];
  hook: string;
  accent: string;
  // From the episode's script, in episode seconds.
  captions: Caption[];
  counter: CounterKey[];
  sfx: Sfx[];
  // Short seconds.
  music: Music[];
};

export function Short<Id extends string>({ scenes, components, clips, hook, accent, captions, counter, sfx, music }: ShortProps<Id>) {
  const starts = clipStarts(clips);
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      {clips.map((clip, i) => (
        <Sequence key={i} name={`clip ${clip.from}–${clip.to}`} from={f(starts[i])} durationInFrames={f(starts[i] + clip.to - clip.from) - f(starts[i])}>
          <Shot clip={clip} scenes={scenes} components={components} />
        </Sequence>
      ))}
      <Hook text={hook} accent={accent} />
      {/* Counter draws at (96, 72); shift it to the window's top-left corner. */}
      <div style={{ position: 'absolute', left: -40, top: WIN_TOP - 30, width: SHORT_WIDTH, height: 200 }}>
        <Counter keys={retimeCounter(clips, counter)} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: WIN_TOP, width: SHORT_WIDTH, height: CAP_BOTTOM - WIN_TOP }}>
        <Captions items={retimeCaptions(clips, captions)} />
      </div>
      <Grain />
      <Soundtrack music={music} sfx={retimeSfx(clips, sfx)} />
    </AbsoluteFill>
  );
}
