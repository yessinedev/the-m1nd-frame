import React from 'react';
import { Episode, SceneProps } from '../../kit/Episode';
import { CAPTIONS, COUNTER, MUSIC, SCENES, SceneId, SFX } from './script';
import { Aftermath, BedDay1, CalendarScene, ColdOpen, Reach, Reset, Temptation } from './scenes/act1';
import { DeskStuck, LoopNights, MirrorDim, Snooze, TurningPoint } from './scenes/act2';
import { Bag, BenchScene, DeskFocus, EndCard, MirrorClear, Morning, Payoff, Run, Urge } from './scenes/act3';

// Episode 1 — "Day 0."
const COMPONENTS: Record<SceneId, React.FC<SceneProps>> = {
  coldOpen: ColdOpen,
  bedDay1: BedDay1,
  calendar: CalendarScene,
  temptation: Temptation,
  reach: Reach,
  reset: Reset,
  aftermath: Aftermath,
  snooze: Snooze,
  loopNights: LoopNights,
  deskStuck: DeskStuck,
  mirrorDim: MirrorDim,
  turningPoint: TurningPoint,
  morning: Morning,
  run: Run,
  bag: Bag,
  deskFocus: DeskFocus,
  urge: Urge,
  bench: BenchScene,
  mirrorClear: MirrorClear,
  payoff: Payoff,
  endCard: EndCard,
};

export const Day0: React.FC = () => (
  <Episode scenes={SCENES} components={COMPONENTS} captions={CAPTIONS} counter={COUNTER} music={MUSIC} sfx={SFX} />
);
