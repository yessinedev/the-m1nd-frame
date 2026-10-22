import React from 'react';
import { useCurrentFrame } from 'remotion';
import { blink, keys, sceneFade, tween } from '../../../kit/anim';
import { Character, Head, SIT, STAND, idle, mixLimb, reachArm, talkMouth, walk } from '../../../kit/Character';
import { sitY, standY } from '../../../kit/common';
import { SceneProps } from '../../../kit/Episode';
import { Stage } from '../../../kit/fx';
import { Door, Glow, Room } from '../../../kit/props';
import { PhoneHands, Sofa, SOFA, WindowCity } from '../../../kit/props2';
import { PhoneShell } from '../../../kit/props3';
import { Split } from '../../../kit/props8';
import { LockScreen } from '../../../kit/props10';
import { Flat, Ledger, ShoeBox, ShoeRack, ShopWall, Wallet } from '../../../kit/props12';
import { Suburb } from '../../../kit/bike';
import { HAND } from '../../../fonts';
import { f, FPS } from '../../../kit/time';
import { BEATS } from '../script';
import { C, FLOOR } from '../../../theme';
import { HisNew, KNEEL, kneelY } from './act1';

const NEW_COLOR = '#8E3A44';

// Her new pair on the doormat, gleaming: the mirror of the hook's right panel.
const HersNew: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect width={1920} height={1080} fill="#221A18" />
    <Glow x={960} y={520} r={700} color={C.amber} opacity={0.28} />
    <rect y={760} width={1920} height={320} fill="#1A1412" />
    <rect x={520} y={700} width={880} height={110} rx={10} fill="#3A2F26" />
    <Flat x={740} y={670} scale={0.8} color={NEW_COLOR} />
    <Flat x={1210} y={700} scale={0.8} color={NEW_COLOR} rotate={4} />
    {[[700, 520], [1240, 560], [980, 470]].map(([sx, sy], i) => (
      <path key={i} d={`M ${sx} ${sy - 22} L ${sx + 6} ${sy - 6} L ${sx + 22} ${sy} L ${sx + 6} ${sy + 6} L ${sx} ${sy + 22} L ${sx - 6} ${sy + 6} L ${sx - 22} ${sy} L ${sx - 6} ${sy - 6} Z`} fill={C.amber} opacity={0.5 + Math.sin(frame * 0.2 + i) * 0.5} />
    ))}
  </g>
);

// 73–85 s. 21, home for a weekend. Bag down. The rack: only her flats now. He kneels and picks one up.
// Then close: the tape, the split, the hole, in his hands.
export const Notice: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = 1.06;
  const cut = 6.2;
  if (t >= cut) {
    return (
      <Stage fade={sceneFade(frame, dur, 0, 12)} zoom={tween(frame, cut, 12, 1.0, 1.18)} focus={[1000, 560]}>
        <rect width={1920} height={1080} fill="#121316" />
        <Glow x={960} y={400} r={700} color="#BFC6D6" opacity={0.12} />
        {/* his open palms under it */}
        <ellipse cx={720} cy={730} rx={190} ry={70} fill={C.skin} />
        <ellipse cx={1240} cy={730} rx={190} ry={70} fill={C.skinShade} />
        <Flat x={980} y={660} scale={1.5} worn={1} flap={8} />
      </Stage>
    );
  }
  const x = t < 2 ? 420 + t * 200 : 820;
  const kneeling = t > BEATS.pickUp - 0.4;
  const toShoe = reachArm(990, FLOOR - 104, { x, y: kneelY(s), scale: s, lean: 18 });
  const lift = keys(frame, [BEATS.pickUp, BEATS.pickUp + 0.6, cut], [0, 1, 1]);
  return (
    <Stage fade={sceneFade(frame, dur, 12, 0)} zoom={tween(frame, 0, cut, 1.12, 1.3)} focus={[920, 600]}>
      <Room wall="#1A1916" />
      <Door x={260} open={tween(frame, 0, 0.4, 1, 0)} spill={C.amber} />
      <ShoeRack x={900} top={[]} bottom={lift > 0.3 ? [] : [{ kind: 'flat', color: '#6A4A34', worn: 1 }]} />
      <Character
        x={x}
        y={kneeling ? kneelY(s) : standY(s)}
        scale={s}
        pose={kneeling ? idle(frame, { ...KNEEL, armNear: mixLimb(toShoe, [70, 90], lift) }, 0) : t < 2 ? walk(frame, 0.7) : idle(frame, { ...STAND, headY: 8 }, 0)}
        handNear={kneeling ? 'grip' : 'relaxed'}
        nearItem={lift > 0.3 ? <g transform="translate(20 0)"><Flat x={0} y={0} scale={0.24} worn={1} /></g> : undefined}
        breathe={frame}
        eyes={t > 1.8 ? 'down' : 'open'}
        brow={t > 2.4 ? 'sad' : 'none'}
        mouth="flat"
        look={[10, 12]}
        turn={0.3}
        blinkAmt={blink(frame, 14)}
      />
    </Stage>
  );
};

// 85–99 s. What he understood, in warm, faded replays: the wallet, the puddle, the rack.
export const Memory: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const [, m1, m2] = BEATS.memories;
  const part = t < m1 ? 0 : t < m2 ? 1 : 2;
  const local = t - BEATS.memories[part];
  const dip = Math.min(keys(frame, [m1 - 0.3, m1, m1 + 0.3], [1, 0.1, 1]), keys(frame, [m2 - 0.3, m2, m2 + 0.3], [1, 0.1, 1]));
  return (
    <Stage fade={Math.min(sceneFade(frame, dur), dip)} zoom={1.04 + local * 0.02} focus={[960, 600]} tint={{ color: '#C89B6A', opacity: 0.45 }}>
      {part === 0 ? (
        <>
          <rect width={1920} height={1080} fill="#1A1714" />
          <Wallet x={960} y={620} bills={3} out={tween(frame, 0.6, 2.4, 0, 1)} />
        </>
      ) : part === 1 ? (
        <>
          <rect width={1920} height={1080} fill="#1A1C22" />
          <rect y={700} width={1920} height={380} fill="#24262C" />
          <ellipse cx={980} cy={780} rx={420} ry={50} fill="#3A4A5C" opacity={0.6} />
          <Flat x={900} y={720} scale={1.2} worn={0.75} flap={10} />
        </>
      ) : (
        <>
          <rect width={1920} height={1080} fill="#1A1916" />
          <g transform="translate(-1110 -700) scale(1.9)">
            <ShoeRack x={700} top={[{ kind: 'sneaker', color: '#C8434F' }, { kind: 'cleat', color: '#3A3F4A' }, { kind: 'boot', color: '#5A4630' }]} bottom={[{ kind: 'flat', color: '#6A4A34', worn: 0.9 }]} />
          </g>
        </>
      )}
    </Stage>
  );
};

// 99–111 s. Her notebook, close up. Rent, his trips, his boots, his phone, and between them
// "New shoes", each one crossed out.
export const LedgerScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const L = BEATS.ledgerLines;
  const cross = (k: number) => tween(frame, L[k] + 0.7, L[k] + 1.2, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 12, 1.0, 1.12)} focus={[960, 560]}>
      <rect width={1920} height={1080} fill="#1A1714" />
      <Glow x={960} y={400} r={800} color={C.amber} opacity={0.15} />
      <Ledger
        x={960}
        y={500}
        frame={frame}
        title="Budget"
        lines={[
          { text: 'Mar: his football boots', amount: '$60', at: f(L[0]) },
          { text: 'Mar: new shoes (me)', amount: '$45', at: f(L[1]), cross: cross(1), strong: true },
          { text: 'Sep: his school trip', amount: '$120', at: f(L[2]) },
          { text: 'Sep: new shoes (me)', amount: '$45', at: f(L[3]), cross: cross(3), strong: true },
          { text: 'Jan: his phone', amount: '$180', at: f(L[4]) },
          { text: 'Jan: new shoes, next month', amount: '$45', at: f(L[5]), cross: cross(5), strong: true },
        ]}
      />
    </Stage>
  );
};

// 111–125 s. "Payroll deposit +$1,240". Then the shoe shop: he knows exactly which box.
export const Paycheck: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cut = 5;
  if (t < cut) {
    return (
      <Stage fade={sceneFade(frame, dur, 10, 0)} zoom={tween(frame, 0, cut, 1.0, 1.06)} focus={[960, 300]}>
        <rect width={1920} height={1080} fill="#07080B" />
        <PhoneShell x={960} y={660} h={980}>
          {(sw, sh) => <LockScreen sw={sw} sh={sh} frame={frame} clock="09:02" date="Friday, the 28th" notices={[{ title: 'Bank', text: 'Payroll deposit +$1,240', icon: 'app', appear: f(BEATS.pay) }]} />}
        </PhoneShell>
        <PhoneHands x={960} y={660} h={980} thumbY={470} thumbX={-40} />
      </Stage>
    );
  }
  const s = 1.06;
  const x = 820;
  const pick = BEATS.pickBox;
  const reach = keys(frame, [pick - 0.6, pick, pick + 0.6], [0, 1, 0]);
  const holding = t > pick;
  const toShelf = reachArm(1000, 410, { x, y: standY(s), scale: s, lean: 4 });
  return (
    <Stage fade={sceneFade(frame, dur, 0, 12)} zoom={tween(frame, cut, 14, 1.1, 1.2)} focus={[960, 520]}>
      <ShopWall />
      <Character
        x={x}
        y={standY(s)}
        scale={s}
        pose={idle(frame, { ...STAND, armNear: holding ? mixLimb([60, 80], toShelf, reach) : mixLimb([-4, 10], toShelf, reach) }, 0)}
        handNear={holding ? 'grip' : 'open'}
        nearItem={holding ? <g transform="translate(30 40)"><ShoeBox x={0} y={0} scale={0.22} /></g> : undefined}
        breathe={frame}
        eyes={holding ? 'happy' : 'open'}
        mouth={holding ? 'grin' : 'smile'}
        turn={0.3}
        look={[10, -8]}
        blinkAmt={blink(frame, 9)}
      />
    </Stage>
  );
};

// 125–143 s. Her couch. A box on her lap. The lid comes off: new shoes, hers. "Too expensive!"
// "Not for you, Mom." He kneels and puts them on her.
export const Give: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { boxOpen, protest, kneel } = BEATS;
  const insert = t > boxOpen && t < boxOpen + 2.2;
  if (insert) {
    const lift = tween(frame, boxOpen, boxOpen + 1.6, 0, 1);
    return (
      <Stage fade={1} zoom={tween(frame, boxOpen, boxOpen + 2.2, 1.0, 1.05)} focus={[960, 600]}>
        <rect width={1920} height={1080} fill="#2A221A" />
        <Glow x={960} y={520} r={700} color={C.amber} opacity={0.35} />
        <rect y={760} width={1920} height={320} fill="#1E1913" />
        <ShoeBox x={960} y={800} scale={1.2} open={1} color="#3D5A80" />
        <Flat x={960} y={700 - lift * 180} scale={1.15} color={NEW_COLOR} rotate={-6 + lift * 4} />
      </Stage>
    );
  }
  const ms = 1.04;
  const mx = 1000;
  const my = sitY(SOFA.seat, ms);
  const s = 1.06;
  const kneeling = t > kneel - 0.4;
  const hx = kneeling ? 1330 : 1380;
  const toFoot = reachArm(mx + 170, FLOOR - 40, { x: hx, y: kneelY(s), scale: s, facing: -1, lean: 12 });
  const protesting = t > protest && t < protest + 3;
  const after = t > kneel + 0.8;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={keys(frame, [0, protest, kneel, 18], [1.2, 1.24, 1.36, 1.4])} focus={[1100, 600]}>
      <Room wall="#1A1714" />
      <WindowCity x={420} y={230} night />
      <Glow x={1100} y={500} r={700} color={C.amber} opacity={0.14} />
      <Sofa x={720} />
      <Character
        x={mx}
        y={my}
        scale={ms}
        variant="mom"
        pose={idle(frame, { ...SIT, armNear: protesting ? [70 + Math.sin(frame * 0.5) * 20, 40] : [40, 70], armFar: protesting ? [60, 40] : [34, 64] }, 2)}
        handNear={protesting ? 'open' : 'relaxed'}
        breathe={frame}
        eyes={after ? 'happy' : t < boxOpen ? 'open' : 'wide'}
        brow={protesting ? 'worried' : 'none'}
        mouth={protesting ? talkMouth(frame, 2) : after ? 'grin' : t < boxOpen ? 'smile' : 'o'}
        tear={t > boxOpen ? tween(frame, boxOpen + 2.4, boxOpen + 6, 0, 0.95) : 0}
        blush={0.5}
        turn={0.3}
        look={kneeling ? [10, 12] : [12, 0]}
        blinkAmt={blink(frame, 40)}
      />
      {t < boxOpen ? <g transform={`translate(${mx + 70} ${my - 30})`}><ShoeBox x={0} y={0} scale={0.3} color="#3D5A80" open={tween(frame, boxOpen - 0.8, boxOpen, 0, 0.6)} /></g> : null}
      {kneeling ? <Glow x={mx + 150} y={FLOOR - 30} r={160} color={C.amber} opacity={0.4} /> : null}
      <Character
        x={hx}
        y={kneeling ? kneelY(s) : standY(s)}
        scale={s}
        facing={-1}
        pose={kneeling ? idle(frame, { ...KNEEL, armNear: toFoot, lean: 12 }, 0) : idle(frame, STAND, 0)}
        handNear={kneeling ? 'grip' : 'relaxed'}
        breathe={frame}
        eyes={after ? 'happy' : 'open'}
        mouth={t > protest + 3.2 && t < protest + 5 ? talkMouth(frame, 1) : 'smile'}
        turn={0.3}
        look={kneeling ? [10, 10] : [10, 4]}
        blinkAmt={blink(frame, 9)}
      />
    </Stage>
  );
};

// 143–158 s. A walk down her street at sunset. She does a little turn, showing them off.
export const Walk: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const spinning = t > BEATS.spin && t < BEATS.spin + 0.9;
  const facing: 1 | -1 = spinning && Math.floor((t - BEATS.spin) / 0.3) % 2 === 0 ? -1 : 1;
  const laugh = t > BEATS.spin - 0.4;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 15, 1.1, 1.2)} focus={[960, 560]}>
      <Suburb offset={frame * 2.6} sunY={tween(frame, 0, 15, 480, 560)} />
      <Character x={1060} y={standY(1.0)} scale={1.0} variant="mom" facing={facing} pose={spinning ? idle(frame, { ...STAND, armNear: [100, 20], armFar: [90, 20] }, 2) : walk(frame + 4, 0.7)} handNear={spinning ? 'open' : 'relaxed'} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : 'smile'} blush={0.5} turn={0.3} />
      <Character x={860} y={standY(1.06)} scale={1.06} pose={walk(frame, 0.7)} eyes={laugh ? 'happy' : 'open'} mouth={laugh ? 'grin' : 'smile'} turn={0.3} />
    </Stage>
  );
};

// 158–172 s. His apartment. A shelf: a photo of the two of them, and the old pair, taped and split.
export const Shelf: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const s = 1.06;
  return (
    <Stage fade={sceneFade(frame, dur)} zoom={tween(frame, 0, 14, 1.1, 1.7)} focus={[1180, 420]}>
      <Room wall="#16181D" />
      <rect x={900} y={470} width={620} height={18} rx={4} fill={C.wood} stroke={C.line} strokeWidth={2} />
      <g transform="translate(1000 400)">
        <rect x={-70} y={-70} width={140} height={140} fill="#2A2420" stroke={C.line} strokeWidth={4} />
        <rect x={-56} y={-56} width={112} height={112} fill="#3A3026" />
        <Head x={-22} y={4} scale={0.3} eyes="happy" mouth="grin" />
        <Head x={24} y={6} scale={0.28} variant="mom" eyes="happy" mouth="smile" blush={0.5} />
      </g>
      <Flat x={1210} y={448} scale={0.32} worn={1} />
      <Flat x={1350} y={452} scale={0.32} worn={0.9} rotate={3} />
      <Glow x={1280} y={420} r={240} color={C.amber} opacity={0.18} />
      <Character x={700} y={standY(s)} scale={s} pose={idle(frame, STAND, 0)} breathe={frame} eyes="open" mouth="smile" turn={0.3} look={[14, -10]} blinkAmt={blink(frame, 12)} />
    </Stage>
  );
};

// 172–194 s. The split again, the mirror of the hook: his sneakers, and her brand-new pair.
export const Final: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <Stage fade={sceneFade(frame, dur, 12, 18)} zoom={tween(frame, 0, 22, 1.0, 1.05)}>
      <Split left={<HisNew frame={frame} lift={1} />} right={<HersNew frame={frame} />} labels={['HIS', 'HERS · BRAND NEW']} focus={[[960, 660], [975, 680]]} zoom={[0.96, 0.96]} />
    </Stage>
  );
};

// 194–200 s. End card.
export const EndCard: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = tween(frame, 0.2, 1.0, 0, 1);
  const b = tween(frame, 0.9, 1.6, 0, 1);
  return (
    <Stage fade={sceneFade(frame, dur, 1, 24)}>
      <rect width={1920} height={1080} fill={C.black} />
      <g opacity={a} transform={`translate(0 ${(1 - a) * 12})`}>
        <Head x={880} y={380} scale={0.92} eyes="happy" mouth="smile" />
        <Head x={1040} y={390} scale={0.9} variant="mom" eyes="happy" mouth="smile" blush={0.5} />
        <text x={960} y={640} textAnchor="middle" fontFamily={HAND} fontSize={104} letterSpacing="0.12em" fill={C.text}>
          THE M1ND FRAME
        </text>
      </g>
      <text x={960} y={730} textAnchor="middle" fontFamily={HAND} fontSize={50} letterSpacing="0.04em" fill={C.amber} opacity={b}>
        Look at her shoes.
      </text>
    </Stage>
  );
};
