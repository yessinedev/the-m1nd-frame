import React from 'react';
import { Blanket, Bed, BED, DigitalClock, Door, LightBeam, Nightstand, NIGHTSTAND, Phone, Room, Sky, Window } from './props';
import { FaceProps, Head } from './Character';
import { C, FLOOR } from '../theme';

// The bedroom is the film's home base: nightstand (clock + phone) | bed | window | door.
export const BR = {
  nsX: 270,
  bedX: 480,
  bedW: 760,
  winX: 1350,
  winY: 190,
  doorX: 1650,
  mattress: FLOOR - BED.height,
  phoneX: 270 + 150,
  phoneY: FLOOR - NIGHTSTAND.h - 2,
  clockX: 270 + 16,
  clockY: FLOOR - NIGHTSTAND.h - 40,
  headX: 480 + 112,
  headY: FLOOR - BED.height - 46,
};

export type BedroomProps = {
  sky?: Sky;
  sunY?: number;
  clock: string;
  clockColor?: string;
  clockRing?: number;
  frame: number;
  phoneOn?: number;
  phoneColor?: string;
  phoneOnStand?: boolean;
  drawer?: number;
  door?: number;
  beam?: number;
  children?: React.ReactNode; // characters, drawn over the furniture
  lying?: (FaceProps & { breathe?: number; rise?: number }) | null;
};

export const Bedroom: React.FC<BedroomProps> = ({
  sky = 'night',
  sunY,
  clock,
  clockColor = C.red,
  clockRing = 0,
  frame,
  phoneOn = 0,
  phoneColor = C.screen,
  phoneOnStand = true,
  drawer = 0,
  door = 0,
  beam = 1,
  children,
  lying = null,
}) => (
  <g>
    <Room />
    <Window x={BR.winX} y={BR.winY} sky={sky} sunY={sunY} />
    <LightBeam
      x={BR.winX}
      y={BR.winY}
      w={220}
      toX={BR.winX - 520}
      color={sky === 'dawn' ? C.amber : '#FFFFFF'}
      opacity={(sky === 'dawn' ? 0.12 : 0.05) * beam}
    />
    <Door x={BR.doorX} open={door} />
    <Nightstand x={BR.nsX} drawer={drawer} />
    <DigitalClock x={BR.clockX} y={BR.clockY} text={clock} color={clockColor} ring={clockRing} frame={frame} scale={0.5} />
    {phoneOnStand ? <Phone x={BR.phoneX} y={BR.phoneY} on={phoneOn} color={phoneColor} flat scale={0.85} /> : null}
    <Bed x={BR.bedX} w={BR.bedW} />
    {lying ? (
      <>
        <Head x={BR.headX} y={BR.headY} scale={0.72} rotate={-8} {...lying} />
        <Blanket x={BR.bedX} w={BR.bedW} breathe={lying.breathe ?? frame} rise={lying.rise} />
      </>
    ) : null}
    {children}
  </g>
);
