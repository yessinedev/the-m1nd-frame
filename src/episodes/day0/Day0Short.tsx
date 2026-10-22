import React from 'react';
import { Short } from '../../kit/Short';
import { C } from '../../theme';
import { COMPONENTS } from './Day0';
import { CAPTIONS, COUNTER, SCENES, SFX } from './script';
import { CLIPS, HOOK, SHORT_MUSIC } from './short';

export const Day0Short: React.FC = () => (
  <Short
    scenes={SCENES}
    components={COMPONENTS}
    clips={CLIPS}
    hook={HOOK}
    accent={C.red}
    captions={CAPTIONS}
    counter={COUNTER}
    sfx={SFX}
    music={SHORT_MUSIC}
  />
);
