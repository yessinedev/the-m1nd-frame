import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import {
  Clutch,
  ColdOpen,
  Duo,
  Dust,
  EndCard,
  GroupChat,
  Join,
  LeoLeaves,
  Lobby as LobbyScene,
  LoginAgain,
  OneMore,
  PlayAgain,
  QuadAdult,
  QuadNight,
  QuadThree,
  Saturday,
  Solo,
  Victory,
} from './scenes/scenes';

// Episode 5 — "The Lobby Is Empty Now."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  coldOpen: ColdOpen,
  quadNight: QuadNight,
  lobby: LobbyScene,
  clutch: Clutch,
  victory: Victory,
  oneMore: OneMore,
  leoLeaves: LeoLeaves,
  quadThree: QuadThree,
  duo: Duo,
  solo: Solo,
  dust: Dust,
  loginAgain: LoginAgain,
  groupChat: GroupChat,
  saturday: Saturday,
  join: Join,
  quadAdult: QuadAdult,
  playAgain: PlayAgain,
  endCard: EndCard,
};

export const Lobby: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
