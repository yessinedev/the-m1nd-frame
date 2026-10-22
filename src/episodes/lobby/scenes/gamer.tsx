import React from 'react';
import { blink } from '../../../kit/anim';
import { Character, Mouth, Pose, SIT, idle, reachArm, talkMouth } from '../../../kit/Character';
import { sitY } from '../../../kit/common';
import { FLOOR } from '../../../theme';
import { GAMER, GamerDesk } from '../../../kit/props5';
import { Member } from '../script';

export type Mood = 'chill' | 'focus' | 'hype' | 'tired' | 'sad' | 'happy' | 'laugh';

// One squad member at their desk, headset on. Teen unless `adult`.
export const Gamer: React.FC<{ m: Member; frame: number; mood: Mood; talking?: boolean; adult?: boolean; seed?: number; screen?: number; dusty?: boolean }> = ({
  m,
  frame,
  mood,
  talking = false,
  adult = false,
  seed = 0,
  screen = 1,
  dusty = false,
}) => {
  const s = 1.15;
  const bs = adult ? 1 : 0.86;
  const k = s * bs;
  const y = sitY(FLOOR - 186, k);
  const x = GAMER.x;
  const hype = mood === 'hype';
  const laugh = mood === 'laugh';
  const lean = mood === 'focus' ? 16 : mood === 'tired' || mood === 'sad' ? 2 : 8;
  const jump = hype ? -Math.abs(Math.sin(frame * 0.5 + seed)) * 16 : laugh ? -Math.abs(Math.sin(frame * 0.6 + seed)) * 5 : 0;
  const body = { x, y: y + jump, scale: k, lean };
  const typeJit = mood === 'focus' ? 8 : 3;
  const keys = reachArm(GAMER.keys[0] + Math.sin(frame * 1.3 + seed) * typeJit, GAMER.keys[1] - 4, body);
  const mouse = reachArm(GAMER.keys[0] + 110 + Math.sin(frame * 0.7 + seed) * 6, GAMER.keys[1] - 2, { ...body, side: 'far' });
  const pose: Pose = idle(
    frame,
    {
      ...SIT,
      legNear: [70, 64],
      legFar: [66, 60],
      lean,
      armNear: hype ? [165 + Math.sin(frame * 0.6 + seed) * 8, 20] : keys,
      armFar: hype ? [160 + Math.sin(frame * 0.6 + seed + 1) * 8, 24] : mouse,
      headY: mood === 'sad' ? 8 : 0,
    },
    seed,
  );
  const mouth: Mouth = hype || laugh ? 'grin' : talking ? talkMouth(frame, seed) : mood === 'focus' ? 'flat' : mood === 'sad' || mood === 'tired' ? 'flat' : 'smile';
  return (
    <GamerDesk wall={m.wall} glow={m.glow} poster={m.poster} screen={screen} dusty={dusty}>
      <Character
        x={x}
        y={y + jump}
        scale={s}
        bodyScale={bs}
        variant={m.variant}
        pose={pose}
        handNear={hype ? 'fist' : 'relaxed'}
        handFar={hype ? 'fist' : 'relaxed'}
        headset
        breathe={frame + seed * 7}
        eyes={hype || laugh ? 'happy' : mood === 'tired' ? 'tired' : mood === 'sad' ? 'down' : 'open'}
        brow={mood === 'focus' ? 'focused' : mood === 'sad' ? 'sad' : 'none'}
        mouth={mouth}
        look={[10, mood === 'sad' ? 8 : 0]}
        eyeGlow={mood === 'focus' || mood === 'tired' ? m.glow : undefined}
        stubble={adult && m.variant === 'jay'}
        turn={0.3}
        blinkAmt={blink(frame, 13 + seed * 17)}
      />
    </GamerDesk>
  );
};
