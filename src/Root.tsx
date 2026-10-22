import React from 'react';
import { Composition, Still } from 'remotion';
import { RigTest } from './dev/RigTest';
import { Crush } from './episodes/crush/Crush';
import { Thumbnail as CrushThumbnail } from './episodes/crush/Thumbnail';
import { DURATION_SEC as CRUSH_SEC } from './episodes/crush/script';
import { July } from './episodes/july/July';
import { Thumbnail as JulyThumbnail } from './episodes/july/Thumbnail';
import { DURATION_SEC as JULY_SEC } from './episodes/july/script';
import { Lobby } from './episodes/lobby/Lobby';
import { Thumbnail as LobbyThumbnail } from './episodes/lobby/Thumbnail';
import { DURATION_SEC as LOBBY_SEC } from './episodes/lobby/script';
import { Hoodie } from './episodes/hoodie/Hoodie';
import { Thumbnail as HoodieThumbnail } from './episodes/hoodie/Thumbnail';
import { DURATION_SEC as HOODIE_SEC } from './episodes/hoodie/script';
import { LastTime } from './episodes/lasttime/LastTime';
import { Thumbnail as LastTimeThumbnail } from './episodes/lasttime/Thumbnail';
import { DURATION_SEC as LASTTIME_SEC } from './episodes/lasttime/script';
import { Day0 } from './episodes/day0/Day0';
import { Thumbnail as Day0Thumbnail } from './episodes/day0/Thumbnail';
import { DURATION_SEC as DAY0_SEC } from './episodes/day0/script';
import { Screen } from './episodes/screen/Screen';
import { Thumbnail as ScreenThumbnail } from './episodes/screen/Thumbnail';
import { DURATION_SEC as SCREEN_SEC } from './episodes/screen/script';
import { f, FPS, HEIGHT, WIDTH } from './kit/time';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Day0" component={Day0} durationInFrames={f(DAY0_SEC)} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="Thumbnail" component={Day0Thumbnail} width={1280} height={720} />
    <Composition id="Screen" component={Screen} durationInFrames={f(SCREEN_SEC)} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="ScreenThumbnail" component={ScreenThumbnail} width={1280} height={720} />
    <Composition id="LastTime" component={LastTime} durationInFrames={f(LASTTIME_SEC)} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="LastTimeThumbnail" component={LastTimeThumbnail} width={1280} height={720} />
    <Composition id="Hoodie" component={Hoodie} durationInFrames={f(HOODIE_SEC)} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="HoodieThumbnail" component={HoodieThumbnail} width={1280} height={720} />
    <Composition id="Lobby" component={Lobby} durationInFrames={f(LOBBY_SEC)} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="LobbyThumbnail" component={LobbyThumbnail} width={1280} height={720} />
    <Composition id="July" component={July} durationInFrames={f(JULY_SEC)} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="JulyThumbnail" component={JulyThumbnail} width={1280} height={720} />
    <Composition id="Crush" component={Crush} durationInFrames={f(CRUSH_SEC)} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="CrushThumbnail" component={CrushThumbnail} width={1280} height={720} />
    <Composition id="RigTest" component={RigTest} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
