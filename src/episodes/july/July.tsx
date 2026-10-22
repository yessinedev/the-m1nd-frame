import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { ColdOpen, FittingRoomScene, Hallway, HeatStreet, MirrorScene, PhotoTag, PoolInvite, Voices } from './scenes/act1';
import { EndCard, Feed, HoodieOff, Jump, MirrorAgain, PoolEdge, StairsScene, Sunset, Walks } from './scenes/act2';

// Episode 6 — "He Wore a Hoodie in July."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  coldOpen: ColdOpen,
  heatStreet: HeatStreet,
  hallway: Hallway,
  mirror: MirrorScene,
  photoTag: PhotoTag,
  poolInvite: PoolInvite,
  fittingRoom: FittingRoomScene,
  voices: Voices,
  stairs: StairsScene,
  feed: Feed,
  mirrorAgain: MirrorAgain,
  walks: Walks,
  hoodieOff: HoodieOff,
  poolEdge: PoolEdge,
  jump: Jump,
  sunset: Sunset,
  endCard: EndCard,
};

export const July: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
