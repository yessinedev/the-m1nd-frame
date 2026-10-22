import React from 'react';
import { Room } from '../../kit/props';
import { CouplePhoto, FloorLamp, Mug, SideTable, Sofa, TV, WindowCity } from '../../kit/props2';
import { FLOOR } from '../../theme';

// Their apartment. Sofa in profile (back rest left), TV on the right, so on the sofa they face right.
export const LR = {
  sofaX: 640,
  lampX: 520,
  tableX: 1360,
  tvX: 1700,
  photo: [990, 300] as [number, number],
  mug: [1340, FLOOR - 170] as [number, number],
};

export const LivingRoom: React.FC<{
  frame: number;
  lamp?: number;
  tv?: number;
  photoDim?: number;
  mug?: boolean;
  sofaX?: number;
  showTv?: boolean;
  children?: React.ReactNode;
}> = ({ frame, lamp = 1, tv = 0.6, photoDim = 0, mug = false, sofaX = LR.sofaX, showTv = true, children }) => {
  const flicker = tv * (0.8 + 0.2 * Math.sin(frame * 0.31) * Math.sin(frame * 0.07));
  return (
    <g>
      <Room wall="#15161B" />
      <WindowCity x={130} y={190} />
      <CouplePhoto x={LR.photo[0]} y={LR.photo[1]} dim={photoDim} />
      <FloorLamp x={LR.lampX} on={lamp} />
      <Sofa x={sofaX} />
      <SideTable x={LR.tableX}>{mug ? <Mug x={-20} y={FLOOR - 170} /> : null}</SideTable>
      {showTv ? <TV x={LR.tvX} light={flicker} /> : null}
      {children}
    </g>
  );
};
