import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { Alone, Chats, Day, Feed, Hook, List, Realize, ThreadScene } from './scenes/act1';
import { EndCard, Final, Midnight, Nana, Party, Sam, ShowUp, Year } from './scenes/act2';

// Episode 10 — "Nobody Remembered His Birthday."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  hook: Hook,
  day: Day,
  alone: Alone,
  feed: Feed,
  thread: ThreadScene,
  chats: Chats,
  realize: Realize,
  list: List,
  sam: Sam,
  showUp: ShowUp,
  nana: Nana,
  year: Year,
  midnight: Midnight,
  party: Party,
  final: Final,
  endCard: EndCard,
};

export const Birthday: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
