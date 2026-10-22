import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { Bikes, ColdOpen, Games, HillScene, LastRide } from './scenes/act1';
import { Alone, Chat, Moving, Office, Post } from './scenes/act2';
import { Answer, Corner, Dial, EndCard, Photo, RideAgain } from './scenes/act3';

// Episode 3 — "Nobody Tells You It's the Last Time."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  coldOpen: ColdOpen,
  bikes: Bikes,
  hill: HillScene,
  games: Games,
  lastRide: LastRide,
  moving: Moving,
  chat: Chat,
  office: Office,
  post: Post,
  alone: Alone,
  photo: Photo,
  dial: Dial,
  answer: Answer,
  rideAgain: RideAgain,
  corner: Corner,
  endCard: EndCard,
};

export const LastTime: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
