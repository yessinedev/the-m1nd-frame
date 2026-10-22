import React from 'react';
import { BR } from '../../../kit/bedroom';
import { Character, CharacterProps, Limb, Pose, SIT, STAND, idle, reachArm } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { Phone } from '../../../kit/props';
import { LapBlanket } from '../../../kit/props9';
import { C } from '../../../theme';
import { OLD } from '../script';

// Him at 19, sitting up in bed against the headboard, facing the door on the right.
export const YOUNG = { x: 560, s: 1.08 };
export const youngY = sitY(BR.mattress, YOUNG.s);
export const OLD_AT = { door: BR.doorX + 95, foot: 1380, s: 1.08 };

// Arm angles that hold the phone up in front of his face.
export const phoneUp = (lean = -6): Limb => reachArm(YOUNG.x + 130, youngY - 190 * YOUNG.s, { x: YOUNG.x, y: youngY, scale: YOUNG.s, lean });
export const FeedPhone: React.FC<{ on?: number; color?: string }> = ({ on = 0.95, color = C.red }) => <Phone x={4} y={-22} on={on} color={color} rotate={-12} scale={0.95} />;

export const SitPose = (frame: number, over: Partial<Pose> = {}): Pose => idle(frame, { ...SIT, legFar: [86, 2], legNear: [84, 2], lean: -6, armFar: [40, 70], armNear: phoneUp(), ...over }, 0);

// Young him in bed; the blanket covers his legs. Pass face, pose and item overrides.
export const InBed: React.FC<Omit<CharacterProps, 'x' | 'y'> & { breathe: number }> = ({ breathe, ...p }) => (
  <>
    <Character x={YOUNG.x} y={youngY} scale={YOUNG.s} breathe={breathe} {...p} />
    <LapBlanket x0={YOUNG.x} x1={BR.bedX + BR.bedW - 4} breathe={breathe} />
  </>
);

// Him at 29, the way it goes if nothing changes: faded hoodie, stubble, a slump.
export const Older: React.FC<Omit<CharacterProps, 'variant'>> = (p) => (
  <Character hoodie={OLD.hoodie} hoodieShade={OLD.hoodieShade} stubble eyes="tired" brow="sad" mouth="flat" {...p} />
);

export const SLUMP_STAND: Pose = { ...STAND, headY: 8, lean: 5 };
export const oldY = standY(OLD_AT.s);
