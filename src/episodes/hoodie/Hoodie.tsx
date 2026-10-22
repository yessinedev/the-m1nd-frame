import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { BedEmpty, CarNight, ColdOpen, HoodieChair, Profile, Typing } from './scenes/act1';
import { FriendsDoor, HoodieSleep, Memory, MirrorScene } from './scenes/act2';
import { Cafe, CarDay, CookSelf, EndCard, Fold, PlantScene, RainWindowScene, Walk } from './scenes/act3';

// Episode 4 — "The Hoodie She Left Behind."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  coldOpen: ColdOpen,
  bedEmpty: BedEmpty,
  hoodieChair: HoodieChair,
  typing: Typing,
  profile: Profile,
  carNight: CarNight,
  memory: Memory,
  friendsDoor: FriendsDoor,
  hoodieSleep: HoodieSleep,
  mirror: MirrorScene,
  rainWindow: RainWindowScene,
  cookSelf: CookSelf,
  cafe: Cafe,
  plant: PlantScene,
  fold: Fold,
  carDay: CarDay,
  walk: Walk,
  endCard: EndCard,
};

export const Hoodie: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
