import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { BedScroll, ColdOpen, CouchLove, Feed, KitchenScene, ParkWalk } from './scenes/act1';
import { CouchApart, Compare, Dinner, Empty, Leaving, Unread } from './scenes/act2';
import { AloneWalk, BenchScene, Doorstep, EndCard, Hands, Letter, PhoneDown } from './scenes/act3';

// Episode 2 — "He Chose the Screen Over Her."
export const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  coldOpen: ColdOpen,
  couchLove: CouchLove,
  kitchen: KitchenScene,
  parkWalk: ParkWalk,
  bedScroll: BedScroll,
  feed: Feed,
  dinner: Dinner,
  unread: Unread,
  couchApart: CouchApart,
  compare: Compare,
  leaving: Leaving,
  empty: Empty,
  phoneDown: PhoneDown,
  letter: Letter,
  aloneWalk: AloneWalk,
  doorstep: Doorstep,
  bench: BenchScene,
  hands: Hands,
  endCard: EndCard,
};

export const Screen: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
