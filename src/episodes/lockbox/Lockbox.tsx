import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { Book, Bored, Hook, Plans, Reach, Sleep, Why } from './scenes/act1';
import { After, Delete, EndCard, Eve, Final, GuitarScene, Hard, Mattered, Unlock } from './scenes/act2';

// Episode 11 — "He Locked His Phone Away for 90 Days."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  hook: Hook,
  why: Why,
  reach: Reach,
  bored: Bored,
  sleep: Sleep,
  book: Book,
  plans: Plans,
  hard: Hard,
  guitar: GuitarScene,
  eve: Eve,
  unlock: Unlock,
  mattered: Mattered,
  delete: Delete,
  after: After,
  final: Final,
  endCard: EndCard,
};

export const Lockbox: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
