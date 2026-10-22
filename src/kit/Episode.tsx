import React from 'react';
import { AbsoluteFill, interpolate, Sequence, staticFile } from 'remotion';
import { Audio } from '@remotion/media';
import { Grain, Vignette } from './fx';
import { Captions, Counter } from './text';
import { f, FPS } from './time';
import { C } from '../theme';

// Everything an episode is made of. Each episode's script.ts exports these; Episode renders them.
export type CaptionTone = 'normal' | 'voice' | 'quote';
export type CaptionPos = 'bottom' | 'top' | 'center';
export type Caption = { from: number; to: number; text: string; tone?: CaptionTone; pos?: CaptionPos };
export type CounterTone = 'normal' | 'red' | 'amber';
export type CounterKey = { at: number; text: string | null; tone?: CounterTone };
export type Sfx = { src: string; at: number; volume?: number; dur?: number };
export type Music = { src: string; from: number; to: number; fadeIn: number; fadeOutFrom: number; volume: number; trimBefore?: number };
export type SceneProps = { dur: number };

export type EpisodeProps<Id extends string> = {
  scenes: [Id, number, number][];
  components: Record<Id, React.FC<SceneProps>>;
  captions: Caption[];
  counter: CounterKey[];
  music: Music[];
  sfx: Sfx[];
};

export function Episode<Id extends string>({ scenes, components, captions, counter, music, sfx }: EpisodeProps<Id>) {
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      {scenes.map(([id, start, end]) => {
        const Scene: React.FC<SceneProps> = components[id];
        const dur = f(end) - f(start);
        return (
          <Sequence key={id} name={id} from={f(start)} durationInFrames={dur}>
            <Scene dur={dur} />
          </Sequence>
        );
      })}
      <Counter keys={counter} />
      <Captions items={captions} />
      <Grain />
      <Vignette />

      <Soundtrack music={music} sfx={sfx} />
    </AbsoluteFill>
  );
}

// Score + sound effects on the composition timeline. Shared by episodes and Shorts.
export const Soundtrack: React.FC<{ music: Music[]; sfx: Sfx[] }> = ({ music, sfx }) => (
  <>
    {music.map((m, i) => {
      const dur = f(m.to) - f(m.from);
      return (
        <Sequence key={`music${i}`} name={`music ${m.src.split('/').pop()}`} from={f(m.from)} durationInFrames={dur}>
          <Audio
            src={staticFile(m.src)}
            trimBefore={m.trimBefore ? f(m.trimBefore) : undefined}
            volume={(fr) =>
              m.volume *
              Math.min(
                interpolate(fr, [0, m.fadeIn * FPS], [0, 1], { extrapolateRight: 'clamp' }),
                interpolate(fr, [(m.fadeOutFrom - m.from) * FPS, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              )
            }
          />
        </Sequence>
      );
    })}
    {sfx.map((s, i) => (
      <Sequence key={`sfx${i}`} name={`sfx ${s.src.split('/').pop()}`} from={f(s.at)} durationInFrames={s.dur ? f(s.dur) : f(3)}>
        <Audio src={staticFile(s.src)} volume={s.volume ?? 1} />
      </Sequence>
    ))}
  </>
);
