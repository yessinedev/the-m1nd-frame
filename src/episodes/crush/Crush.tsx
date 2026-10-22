import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import {
  Analyse,
  Answer,
  Approach,
  ColdOpen,
  Daydream,
  Decide,
  EndCard,
  Final,
  Friends,
  LibraryScene,
  LifeBack,
  Realize,
  Route,
  Slipping,
  Status,
  Typing,
  WalkOut,
} from './scenes/scenes';

// Episode 7 — "She Lived in His Head Rent-Free."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  coldOpen: ColdOpen,
  library: LibraryScene,
  daydream: Daydream,
  status: Status,
  analyse: Analyse,
  route: Route,
  slipping: Slipping,
  friends: Friends,
  typing: Typing,
  realize: Realize,
  decide: Decide,
  approach: Approach,
  answer: Answer,
  walkOut: WalkOut,
  lifeBack: LifeBack,
  final: Final,
  endCard: EndCard,
};

export const Crush: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
