import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { Birthday, Busy, Friends, Hook, Last, Log, Sunday, Texts, VoicemailNotice } from './scenes/act1';
import { Calling, Drive, EndCard, Final, PickUp, Play, PorchScene, Silence, Together } from './scenes/act2';

// Episode 8 — "His Mom Called. He Pressed Decline."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  hook: Hook,
  log: Log,
  busy: Busy,
  texts: Texts,
  friends: Friends,
  sunday: Sunday,
  birthday: Birthday,
  voicemail: VoicemailNotice,
  last: Last,
  silence: Silence,
  play: Play,
  calling: Calling,
  drive: Drive,
  porch: PorchScene,
  together: Together,
  pickUp: PickUp,
  final: Final,
  endCard: EndCard,
};

export const Mom: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
