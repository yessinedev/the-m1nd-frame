import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { Hook, Invites, Job, MirrorScene, Sketch, Stranger, Tomorrow } from './scenes/act1';
import { Back, Choice, Dawn, EndCard, Fade, Final, Later, Rebuild } from './scenes/act2';

// Episode 9 — "He Met the Man He'd Become."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  hook: Hook,
  stranger: Stranger,
  tomorrow: Tomorrow,
  invites: Invites,
  sketch: Sketch,
  job: Job,
  mirror: MirrorScene,
  back: Back,
  choice: Choice,
  fade: Fade,
  dawn: Dawn,
  rebuild: Rebuild,
  later: Later,
  final: Final,
  endCard: EndCard,
};

export const Future: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
