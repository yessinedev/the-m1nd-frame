import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { Ask, DoorScene, Glue, Hook, Leave, Rack, RainScene } from './scenes/act1';
import { EndCard, Final, Give, LedgerScene, Memory, Notice, Paycheck, Shelf, Walk } from './scenes/act2';

// Episode 12 — "She Wore the Same Shoes for 6 Years."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  hook: Hook,
  door: DoorScene,
  ask: Ask,
  rain: RainScene,
  glue: Glue,
  rack: Rack,
  leave: Leave,
  notice: Notice,
  memory: Memory,
  ledger: LedgerScene,
  paycheck: Paycheck,
  give: Give,
  walk: Walk,
  shelf: Shelf,
  final: Final,
  endCard: EndCard,
};

export const Shoes: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
