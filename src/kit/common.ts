import { LEG_LEN } from './Character';
import { FLOOR } from '../theme';

export type { SceneProps } from './Episode';

// Pelvis height for a standing character of a given scale.
export const standY = (scale: number) => FLOOR - LEG_LEN * scale;

// Pelvis height for a character sitting on a surface whose top is at `seat`.
export const sitY = (seat: number, scale: number) => seat - 16 * scale;
