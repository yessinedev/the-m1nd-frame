import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Character, SIT, STAND, walk } from '../kit/Character';
import { C, FLOOR } from '../theme';

// Dev sheet for the character rig: render a still of any frame to eyeball poses, hands and faces.
export const RigTest: React.FC = () => {
  const frame = useCurrentFrame();
  const y = FLOOR - 184 * 1.0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.wall }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <line x1={0} x2={1920} y1={FLOOR} y2={FLOOR} stroke={C.line} strokeWidth={3} />
        <Character x={200} y={y} pose={STAND} eyes="open" mouth="smile" />
        <Character x={480} y={y} pose={STAND} build={1.35} eyes="down" brow="sad" mouth="flat" sweat />
        <Character x={780} y={y} pose={walk(frame)} build={1.35} eyes="open" mouth="smile" turn={0.3} />
        <Character x={1080} y={y} pose={{ ...STAND, armNear: [150, 20] }} handNear="open" build={1.35} tee="#C9A15A" eyes="happy" mouth="grin" />
        <Character x={1380} y={y} variant="sam" pose={STAND} tee="#5E7FA0" eyes="open" mouth="smile" />
        <Character x={1680} y={FLOOR - 150 - 16} pose={SIT} build={1.35} tee="#C9A15A" eyes="open" mouth="smile" />
      </svg>
    </AbsoluteFill>
  );
};
