import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween, wobble } from '../../../kit/anim';
import { BR } from '../../../kit/bedroom';
import { Character, Head, Pose, SIT, STAND, idle, mixLimb, reachArm, talkMouth, walk } from '../../../kit/Character';
import { SceneProps, sitY, standY } from '../../../kit/common';
import { Stage } from '../../../kit/fx';
import { Bed, Blanket, DigitalClock, Glow, Nightstand, Phone, Room, Starfield, Window } from '../../../kit/props';
import { BackOfHead, BigPhone, Kitchen, KITCHEN, Park, Pendant, PhoneHands, SOFA, Spoon } from '../../../kit/props2';
import { FPS } from '../../../kit/time';
import { BEATS, HER_NAME } from '../script';
import { C } from '../../../theme';
import { LivingRoom } from '../sets';

// 0–7 s. Black, faint stars.
export const ColdOpen: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 20, 14)} zoom={tween(frame, 0, 7, 1.04, 1)}>
      <Starfield frame={frame} opacity={0.7} />
    </Stage>
  );
};

// 7–19 s. Movie night. Her head on his shoulder; he laughs, then just looks at her.
export const CouchLove: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.12;
  const laugh = t > BEATS.couchLaugh && t < BEATS.couchLaugh + 1.6;
  const shake = laugh ? -Math.abs(Math.sin((t - BEATS.couchLaugh) * 10)) * 5 : 0;
  const looks = t > 6;
  const her: Pose = idle(frame, { ...SIT, lean: 16, tilt: 16, armNear: [40, 70], bob: shake * 0.5 }, 2);
  const him: Pose = idle(frame, { ...SIT, armNear: [30, 70], armFar: [-20, 30], bob: shake, tilt: looks ? -6 : 0 }, 0);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.22, 1.32)} focus={[930, 560]}>
      <LivingRoom frame={frame} lamp={1} tv={0.7}>
        <Character
          x={830}
          y={sitY(SOFA.seat, s * 0.95)}
          scale={s * 0.95}
          variant="her"
          pose={her}
          breathe={frame + 30}
          eyes={laugh ? 'happy' : 'open'}
          mouth={laugh ? 'grin' : 'smile'}
          blush={0.7}
          turn={0.25}
          blinkAmt={blink(frame, 60)}
        />
        <Character
          x={1040}
          y={sitY(SOFA.seat, s)}
          scale={s}
          pose={him}
          breathe={frame}
          eyes={laugh ? 'happy' : 'open'}
          mouth={laugh ? 'grin' : 'smile'}
          turn={looks ? -0.45 : 0.25}
          look={looks ? [-6, -2] : [4, 0]}
          blush={looks ? 0.5 : 0}
          blinkAmt={blink(frame, 12)}
        />
      </LivingRoom>
    </Stage>
  );
};

// 19–30 s. Cooking together. She offers him a taste.
export const KitchenScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.1;
  const sh = s * 0.95;
  const { kitchenOffer: offer, kitchenTaste: taste } = BEATS;
  const hisLean = keys(frame, [taste - 0.6, taste, taste + 0.7, taste + 1.3], [0, 14, 14, 0]);
  const himX = 840;
  const herX = 1040;
  const himY = standY(s);
  const herY = standY(sh);
  const mouth = { x: himX + Math.sin((hisLean * Math.PI) / 180) * 232 * s + 30, y: himY - 202 * s };
  const herLean = keys(frame, [offer, offer + 0.5, taste + 0.8, taste + 1.4], [0, 10, 10, 0]);
  const offerArm = reachArm(mouth.x + 18, mouth.y + 40, { x: herX, y: herY, scale: sh, facing: -1, lean: herLean });
  const extend = keys(frame, [offer, offer + 0.6, taste + 0.8, taste + 1.4], [0, 1, 1, 0]);
  const stir: Pose['armNear'] = [70 + Math.sin(frame * 0.3) * 6, 70];
  const happy = t > taste + 0.8;
  const laugh = t > taste + 1.2 && t < taste + 3.6;
  const bob = laugh ? -Math.abs(Math.sin((t - taste) * 9)) * 5 : 0;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 11, 1.12, 1.2)} focus={[940, 520]}>
      <Room wall="#16171C" />
      <Pendant x={940} y={170} on={1} />
      <Kitchen x={-20} w={1960} frame={frame} />
      <Character
        x={himX}
        y={himY}
        scale={s}
        pose={idle(frame, { ...STAND, lean: hisLean, armNear: happy ? [100, 30] : [-4, 10], bob }, 1)}
        handNear={happy ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={happy ? 'happy' : t > taste - 0.6 ? 'closed' : 'open'}
        mouth={t > taste - 0.4 && t < taste + 0.8 ? 'o' : happy ? 'grin' : 'smile'}
        turn={0.25}
        blinkAmt={blink(frame, 8)}
      />
      <Character
        x={herX}
        y={herY}
        scale={sh}
        facing={-1}
        variant="her"
        pose={idle(frame, { ...STAND, armNear: mixLimb(stir, offerArm, extend), lean: herLean, bob }, 3)}
        breathe={frame + 20}
        nearItem={<g transform="translate(6 0) rotate(-35) scale(1.5)"><Spoon /></g>}
        eyes={laugh ? 'happy' : 'open'}
        mouth={t < offer ? talkMouth(frame, 2) : laugh ? 'grin' : 'smile'}
        blush={happy ? 0.7 : 0.3}
        turn={0.2}
        blinkAmt={blink(frame, 44)}
        hairSwing={Math.sin(frame * 0.2) * 1.5}
      />
      <Glow x={1300} y={KITCHEN.top - 60} r={200} color={C.amber} opacity={0.15} />
    </Stage>
  );
};

// 30–41 s. Sunset walk, holding hands.
export const ParkWalk: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.05;
  const sh = s * 0.95;
  const himX = 1000;
  const herX = 850;
  const himPose = walk(frame, 0.85);
  const herPose = walk(frame + 4, 0.85);
  const himY = standY(s);
  const herY = standY(sh);
  const grip = { x: 916 + Math.sin(frame * 0.17) * 4, y: himY - 4 + Math.sin(frame * 0.34) * 3 };
  const hisFar = reachArm(grip.x, grip.y, { x: himX, y: himY, scale: s, lean: himPose.lean, bob: himPose.bob, side: 'far' });
  const herNear = reachArm(grip.x, grip.y, { x: herX, y: herY, scale: sh, lean: herPose.lean, bob: herPose.bob });
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 11, 1.08, 1.0)} focus={[960, 560]}>
      <Park offset={frame * 3.2} sunY={tween(frame, 0, 11, 560, 610)} />
      <Character
        x={herX}
        y={herY}
        scale={sh}
        variant="her"
        pose={{ ...herPose, armNear: herNear }}
        handNear="grip"
        eyes="happy"
        mouth="smile"
        blush={0.6}
        turn={0.3}
        hairSwing={Math.sin(frame * 0.34) * 3}
      />
      <Character x={himX} y={himY} scale={s} pose={{ ...himPose, armFar: hisFar }} handFar="grip" eyes="open" mouth="smile" turn={-0.2} look={[-4, 0]} blinkAmt={blink(frame, 18)} />
    </Stage>
  );
};

// 41–54 s. In bed. She sleeps turned away; his face lit by the phone.
export const BedScroll: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const hx = BR.headX + 40;
  const hy = BR.headY;
  const px = hx + 40;
  const py = hy - 150;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 13, 1.3, 1.55)} focus={[BR.headX + 120, BR.headY - 40]}>
      <Room />
      <Window x={BR.winX} y={BR.winY} sky="night" />
      <Nightstand x={BR.nsX} />
      <DigitalClock x={BR.clockX} y={BR.clockY} text={t < 7 ? '00:47' : '01:52'} scale={0.5} frame={frame} />
      <Bed x={BR.bedX} w={BR.bedW} />
      <rect x={BR.bedX + 150} y={BR.mattress - 50} width={140} height={50} rx={24} fill={C.pillow} />
      <BackOfHead x={BR.headX + 168} y={hy - 34} scale={0.68} rotate={14} />
      <Head x={hx} y={hy} scale={0.72} rotate={-8} eyes="tired" mouth="flat" look={[6, -10]} eyeGlow={C.red} blinkAmt={blink(frame, 20)} />
      <Blanket x={BR.bedX} w={BR.bedW} breathe={frame} />
      <Glow x={px} y={py} r={520} color={C.red} opacity={0.35 + 0.05 * Math.sin(frame * 0.2)} />
      <Phone x={px} y={py} on={0.95} color={C.red} rotate={-8} scale={1.3} />
      <circle cx={px - 30} cy={py + 34} r={20} fill={C.skin} />
      <circle cx={px + 34} cy={py + 30} r={20} fill={C.skin} />
    </Stage>
  );
};

// 54–64 s. Close-up: thumb scrolling the endless feed. Her message drops in; he swipes it away.
export const Feed: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { feedBanner: bannerAt, feedSwipe: swipeAt } = BEATS;
  // A flick every 0.9 s, except while the banner sits there.
  const flicks = [0.4, 1.3, 2.2, 3.0, swipeAt + 0.6, swipeAt + 1.4, swipeAt + 2.1, swipeAt + 2.8, swipeAt + 3.4];
  const cardH = 1000 * 0.49 * 1.05;
  const scroll = flicks.reduce((acc, f0) => acc + tween(frame, f0, f0 + 0.35, 0, cardH * 0.9), 0);
  const flickPhase = flicks.reduce((m, f0) => Math.max(m, keys(frame, [f0 - 0.2, f0, f0 + 0.3, f0 + 0.5], [0, 0, 1, 0])), 0);
  const swipe = keys(frame, [swipeAt - 0.3, swipeAt, swipeAt + 0.25], [0, 0.4, 1]);
  const thumbY = 330 - flickPhase * 220 - (t > swipeAt - 0.3 && t < swipeAt + 0.4 ? swipe * 120 : 0);
  const bannerY = keys(frame, [bannerAt, bannerAt + 0.25, swipeAt, swipeAt + 0.25], [-160, 0, 0, -220]);
  const bannerO = keys(frame, [bannerAt, bannerAt + 0.15, swipeAt + 0.1, swipeAt + 0.3], [0, 1, 1, 0]);
  return (
    <Stage fade={sceneFade(frame, dur, 8, 10)} zoom={tween(frame, 0, 10, 1.0, 1.08)} shake={[wobble(frame, 1, 0.5) * 2, 0]}>
      <rect width={1920} height={1080} fill="#0A0809" />
      <BigPhone
        x={960}
        y={560}
        h={1000}
        rotate={-4}
        mode="feed"
        scroll={scroll}
        frame={frame}
        banner={{ text: 'you coming to bed?', name: HER_NAME, y: bannerY, opacity: bannerO }}
      />
      <PhoneHands x={960} y={560} h={1000} rotate={-4} thumbY={thumbY} />
    </Stage>
  );
};
