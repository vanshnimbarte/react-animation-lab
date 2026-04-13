import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ImageSourcePropType,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const IMAGES: Record<string, ImageSourcePropType> = {
  ironman:        require('../assets/ironman.png'),
  thor:           require('../assets/thor.png'),
  hulk:           require('../assets/hulk.png'),
  blackwidow:     require('../assets/blackwidow.png'),
  captainamerica: require('../assets/Captain America  -  MARVEL_inspyrenet.png'),
  blackpanther:   require('../assets/Black Panther.png'),
};
const AVENGERS = [
  {
    id: 'ironman',
    name: 'IRON MAN',
    alias: 'Tony Stark',
    power: 'Genius · Billionaire · Playboy · Philanthropist',
    ability: 'Arc Reactor · Repulsor Beams · Jarvis AI',
    quote: '"I am Iron Man."',
    image: IMAGES.ironman,
    symbol: '⬡',
    bg1: '#1a0000',
    bg2: '#3d0000',
    bg3: '#8b1a1a',
    accent: '#ff4500',
    accent2: '#ffd700',
    glow: '#ff6b35',
    particles: ['⚡', '🔥', '💥', '⚙️', '🔆'],
    strength: 94,
    speed: 88,
    intel: 99,
  },
  {
    id: 'thor',
    name: 'THOR',
    alias: 'God of Thunder',
    power: 'Asgardian · God · Immortal',
    ability: 'Mjolnir · Lightning · Stormbreaker',
    quote: '"I am the strongest Avenger."',
    image: IMAGES.thor,
    symbol: '⚡',
    bg1: '#000d1a',
    bg2: '#001a3d',
    bg3: '#1a3a6b',
    accent: '#00bfff',
    accent2: '#c0c0c0',
    glow: '#4fc3f7',
    particles: ['⚡', '🌩️', '❄️', '✨', '💫'],
    strength: 99,
    speed: 85,
    intel: 72,
  },
  {
    id: 'hulk',
    name: 'HULK',
    alias: 'Bruce Banner',
    power: 'Gamma Radiation · Unlimited Strength',
    ability: 'Superhuman Strength · Regeneration · Rage',
    quote: '"Hulk... SMASH!"',
    image: IMAGES.hulk,
    symbol: '☢️',
    bg1: '#001a00',
    bg2: '#003300',
    bg3: '#1a4d1a',
    accent: '#00ff41',
    accent2: '#7fff00',
    glow: '#39ff14',
    particles: ['💥', '☢️', '🌿', '👊', '🔥'],
    strength: 100,
    speed: 65,
    intel: 95,
  },
  {
    id: 'blackwidow',
    name: 'BLACK WIDOW',
    alias: 'Natasha Romanoff',
    power: 'Elite Spy · Master Assassin',
    ability: 'Widow Bites · Martial Arts · Infiltration',
    quote: '"Whatever it takes."',
    image: IMAGES.blackwidow,
    symbol: '✦',
    bg1: '#0d0d0d',
    bg2: '#1a0033',
    bg3: '#2d0066',
    accent: '#cc0000',
    accent2: '#ff69b4',
    glow: '#ff1744',
    particles: ['🕷️', '✦', '💋', '🔫', '⚫'],
    strength: 72,
    speed: 92,
    intel: 97,
  },
  {
    id: 'captainamerica',
    name: 'CAPTAIN AMERICA',
    alias: 'Steve Rogers',
    power: 'Super Soldier Serum · Living Legend',
    ability: 'Vibranium Shield · Leadership · Endurance',
    quote: '"I can do this all day."',
    image: IMAGES.captainamerica,
    symbol: '★',
    bg1: '#000d1a',
    bg2: '#001433',
    bg3: '#0a2a5e',
    accent: '#1e90ff',
    accent2: '#ff0000',
    glow: '#4169e1',
    particles: ['🛡️', '★', '🦅', '💫', '🗽'],
    strength: 88,
    speed: 80,
    intel: 85,
  },
  {
    id: 'blackpanther',
    name: 'BLACK PANTHER',
    alias: "T'Challa",
    power: 'King of Wakanda · Vibranium',
    ability: 'Panther Habit · Heart-Shaped Herb · Vibranium Suit',
    quote: '"Wakanda Forever."',
    image: IMAGES.blackpanther,
    symbol: '◈',
    bg1: '#0a0010',
    bg2: '#150025',
    bg3: '#200040',
    accent: '#9b59b6',
    accent2: '#c0c0c0',
    glow: '#8e44ad',
    particles: ['🐾', '◈', '💜', '⚡', '🌙'],
    strength: 90,
    speed: 95,
    intel: 92,
  },
];

const FloatingParticle = ({
  emoji,
  index,
  trigger,
}: {
  emoji: string;
  index: number;
  trigger: number;
}) => {
  const x       = useRef(new Animated.Value(0)).current;
  const y       = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0)).current;
  const rotate  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startX = Math.random() * width;
    const endX   = startX + (Math.random() - 0.5) * 200;
    x.setValue(startX);
    y.setValue(height * 0.85);
    opacity.setValue(0);
    scale.setValue(0);
    rotate.setValue(0);

    const delay = index * 180 + Math.random() * 300;
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(y, {
          toValue: height * 0.1 + Math.random() * height * 0.3,
          duration: 2200 + Math.random() * 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(x, {
          toValue: endX,
          duration: 2200 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.9, duration: 400,  useNativeDriver: true }),
          Animated.delay(1200),
          Animated.timing(opacity, { toValue: 0,   duration: 600,  useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.spring(scale,   { toValue: 1,   friction: 4,    useNativeDriver: true }),
          Animated.delay(1200),
          Animated.timing(scale,   { toValue: 0,   duration: 400,  useNativeDriver: true }),
        ]),
        Animated.timing(rotate, {
          toValue: 1, duration: 2200,
          easing: Easing.linear, useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [trigger]);

  const rotateDeg = rotate.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', `${(Math.random() > 0.5 ? 1 : -1) * 360}deg`],
  });

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        fontSize: 22 + Math.random() * 16,
        opacity,
        transform: [
          { translateX: x },
          { translateY: y },
          { scale },
          { rotate: rotateDeg },
        ],
      }}
    >
      {emoji}
    </Animated.Text>
  );
};
const BgRings = ({ glow, trigger }: { glow: string; trigger: number }) => {
  const rings         = [0, 1, 2, 3].map(() => useRef(new Animated.Value(0)).current);
  const ringOpacities = [0, 1, 2, 3].map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    rings.forEach((r, i) => {
      r.setValue(0);
      ringOpacities[i].setValue(0);
      setTimeout(() => {
        Animated.loop(
          Animated.parallel([
            Animated.timing(r, {
              toValue: 1, duration: 2500 + i * 600,
              easing: Easing.out(Easing.quad), useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(ringOpacities[i], { toValue: 0.25, duration: 400, useNativeDriver: true }),
              Animated.timing(ringOpacities[i], { toValue: 0, duration: 2100 + i * 600, useNativeDriver: true }),
            ]),
          ])
        ).start();
      }, i * 500);
    });
  }, [trigger]);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {rings.map((r, i) => {
        const sz        = 120 + i * 80;
        const ringScale = r.interpolate({ inputRange: [0, 1], outputRange: [0.3, 3.5] });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: sz, height: sz, borderRadius: sz / 2,
              borderWidth: 2, borderColor: glow,
              left: width / 2 - sz / 2,
              top:  height * 0.32 - sz / 2,
              opacity:       ringOpacities[i],
              transform:     [{ scale: ringScale }],
              shadowColor:   glow,
              shadowOpacity: 0.8,
              shadowRadius:  12,
            }}
          />
        );
      })}
    </View>
  );
};

const StatBar = ({
  label, value, accent, delay, trigger,
}: {
  label: string; value: number; accent: string; delay: number; trigger: number;
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    const t = setTimeout(() => {
      Animated.timing(anim, {
        toValue: value, duration: 900,
        easing: Easing.out(Easing.cubic), useNativeDriver: false,
      }).start();
    }, delay);
    return () => clearTimeout(t);
  }, [trigger]);

  const barWidth = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={statStyles.row}>
      <Text style={statStyles.label}>{label}</Text>
      <View style={statStyles.track}>
        <Animated.View style={[statStyles.fill, { width: barWidth, backgroundColor: accent }]} />
      </View>
      <Text style={[statStyles.val, { color: accent }]}>{value}</Text>
    </View>
  );
};

const statStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  label: { color: '#666', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, width: 60 },
  track: { flex: 1, height: 6, backgroundColor: '#1a1a1a', borderRadius: 3, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 3 },
  val:   { fontSize: 11, fontWeight: '900', width: 28, textAlign: 'right' },
});

export default function AvengersSlider() {
  const [current, setCurrent] = useState(0);
  const [trigger, setTrigger] = useState(0);

  const slideIn     = useRef(new Animated.Value(0)).current;
  const slideDir    = useRef(1);
  const bgOpacity   = useRef(new Animated.Value(1)).current;
  const heroScale   = useRef(new Animated.Value(1)).current;
  const heroOpacity = useRef(new Animated.Value(1)).current;
  const infoY       = useRef(new Animated.Value(0)).current;
  const infoOpacity = useRef(new Animated.Value(1)).current;
  const pulse       = useRef(new Animated.Value(1)).current;

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => goTo((current + 1) % AVENGERS.length, 1), 4500);
    return () => clearInterval(id);
  }, [current]);

  // Subtle pulse on the image
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(pulse, { toValue: 1.04, friction: 5, useNativeDriver: true }),
        Animated.spring(pulse, { toValue: 1,    friction: 5, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const goTo = (nextIdx: number, dir: number) => {
    if (nextIdx === current) return;
    slideDir.current = dir;

    Animated.parallel([
      Animated.timing(bgOpacity,   { toValue: 0,        duration: 300, useNativeDriver: true }),
      Animated.timing(heroScale,   { toValue: 0.6,      duration: 300, easing: Easing.in(Easing.back(1.5)), useNativeDriver: true }),
      Animated.timing(heroOpacity, { toValue: 0,        duration: 250, useNativeDriver: true }),
      Animated.timing(infoY,       { toValue: dir * 60, duration: 250, useNativeDriver: true }),
      Animated.timing(infoOpacity, { toValue: 0,        duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setCurrent(nextIdx);
      setTrigger(t => t + 1);
      slideIn.setValue(dir * width * 0.3);
      infoY.setValue(-dir * 60);

      Animated.parallel([
        Animated.timing(bgOpacity,   { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(heroScale,   { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
        Animated.timing(heroOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideIn,     { toValue: 0, friction: 6, tension: 70, useNativeDriver: true }),
        Animated.timing(infoY,       { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(infoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderRelease: (_, g) => {
        if      (g.dx < -50) goTo((current + 1) % AVENGERS.length, 1);
        else if (g.dx >  50) goTo((current - 1 + AVENGERS.length) % AVENGERS.length, -1);
      },
    })
  ).current;

  const hero = AVENGERS[current];

  return (
    <View style={styles.root} {...panResponder.panHandlers}>

      {/* ── BACKGROUND ── */}
      <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: bgOpacity }]}>
        <View style={[styles.bgLayer1, { backgroundColor: hero.bg1 }]} />
        <View style={[styles.bgLayer2, { backgroundColor: hero.bg2 }]} />
        <View style={[styles.bgLayer3, { backgroundColor: hero.bg3 }]} />
        <View style={[styles.slash1,   { backgroundColor: hero.accent  + '18' }]} />
        <View style={[styles.slash2,   { backgroundColor: hero.accent2 + '10' }]} />
        <View style={[styles.spotlight, { backgroundColor: hero.glow + '15', shadowColor: hero.glow }]} />
        {[...Array(8)].map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLine,  { top:  i * (height / 8), backgroundColor: hero.accent + '08' }]} />
        ))}
        {[...Array(6)].map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: i * (width  / 6), backgroundColor: hero.accent + '06' }]} />
        ))}
      </Animated.View>

      {/* ── PARTICLES ── */}
      {hero.particles.map((emoji, i) => (
        <FloatingParticle
          key={`${hero.id}-p${i}-${trigger}`}
          emoji={emoji}
          index={i}
          trigger={trigger}
        />
      ))}

      {/* ── RINGS ── */}
      <BgRings glow={hero.glow} trigger={trigger} />

      {/* ── WATERMARK NUMBER ── */}
      <Animated.Text style={[styles.heroNumber, { color: hero.accent + '12', opacity: bgOpacity }]}>
        {String(current + 1).padStart(2, '0')}
      </Animated.Text>

      {/* ── HERO IMAGE ── */}
      <Animated.View
        style={[
          styles.heroImageWrap,
          {
            opacity:   heroOpacity,
            transform: [{ scale: heroScale }, { translateX: slideIn }],
          },
        ]}
      >
        <View style={[styles.glowOuter, { borderColor: hero.glow + '55', shadowColor: hero.glow }]} />
        <View style={[styles.glowInner, { backgroundColor: hero.accent + '15' }]} />
        <Text style={[styles.symbolText, { color: hero.accent + '25' }]}>{hero.symbol}</Text>

        <Animated.Image
          source={hero.image}
          style={[styles.heroImage, { transform: [{ scale: pulse }] }]}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ── INFO PANEL ── */}
      <Animated.View
        style={[styles.infoPanel, { opacity: infoOpacity, transform: [{ translateY: infoY }] }]}
      >
        <View style={[styles.powerTag, { backgroundColor: hero.accent + '22', borderColor: hero.accent + '55' }]}>
          <Text style={[styles.powerTagText, { color: hero.accent }]}>{hero.power}</Text>
        </View>

        <Text style={styles.heroName}>{hero.name}</Text>
        <Text style={[styles.heroAlias, { color: hero.accent }]}>{hero.alias}</Text>
        <Text style={[styles.quote, { color: hero.accent2 + 'bb' }]}>{hero.quote}</Text>

        <View style={styles.abilityRow}>
          {hero.ability.split(' · ').map((ab, i) => (
            <View key={i} style={[styles.abilityChip, { borderColor: hero.accent + '44' }]}>
              <Text style={[styles.abilityText, { color: hero.accent }]}>{ab}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsBox}>
          <StatBar label="STRENGTH" value={hero.strength} accent={hero.accent}               delay={100} trigger={trigger} />
          <StatBar label="SPEED"    value={hero.speed}    accent={hero.accent2 || hero.accent} delay={200} trigger={trigger} />
          <StatBar label="INTEL"    value={hero.intel}    accent={hero.glow}                 delay={300} trigger={trigger} />
        </View>
      </Animated.View>

      {/* ── DOTS ── */}
      <View style={styles.dotsRow}>
        {AVENGERS.map((av, i) => (
          <TouchableOpacity
            key={av.id}
            onPress={() => goTo(i, i > current ? 1 : -1)}
            style={[
              styles.dot,
              {
                width:           i === current ? 28 : 8,
                backgroundColor: i === current ? hero.accent : '#333',
              },
            ]}
          />
        ))}
      </View>

      {/* ── NAV BUTTONS ── */}
      <TouchableOpacity
        style={[styles.navBtn, styles.navLeft, { borderColor: hero.accent + '44' }]}
        onPress={() => goTo((current - 1 + AVENGERS.length) % AVENGERS.length, -1)}
      >
        <Text style={[styles.navArrow, { color: hero.accent }]}>‹</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navBtn, styles.navRight, { borderColor: hero.accent + '44' }]}
        onPress={() => goTo((current + 1) % AVENGERS.length, 1)}
      >
        <Text style={[styles.navArrow, { color: hero.accent }]}>›</Text>
      </TouchableOpacity>

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <Text style={styles.topLabel}>AVENGERS</Text>
        <View style={[styles.topDivider, { backgroundColor: hero.accent }]} />
        <Text style={[styles.topCount, { color: hero.accent }]}>
          {current + 1}/{AVENGERS.length}
        </Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },

  bgLayer1: { ...StyleSheet.absoluteFillObject },
  bgLayer2: { position: 'absolute', top: 0,    left: 0, right: 0, height: height * 0.6, opacity: 0.8 },
  bgLayer3: { position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.5, opacity: 0.6 },
  slash1: {
    position: 'absolute', top: -100, left: -width * 0.3,
    width: width * 1.8, height: height * 0.55,
    transform: [{ rotate: '-18deg' }],
  },
  slash2: {
    position: 'absolute', bottom: -80, right: -width * 0.2,
    width: width * 1.4, height: height * 0.4,
    transform: [{ rotate: '-18deg' }],
  },
  spotlight: {
    position: 'absolute',
    top: height * 0.1, left: width * 0.15,
    width: width * 0.7, height: width * 0.7,
    borderRadius: width * 0.35,
    shadowOpacity: 0.6, shadowRadius: 80,
  },
  gridLine:  { position: 'absolute', left: 0, right: 0, height: 1 },
  gridLineV: { position: 'absolute', top:  0, bottom: 0, width: 1 },

  heroNumber: {
    position: 'absolute', top: height * 0.12, right: -20,
    fontSize: 180, fontWeight: '900', letterSpacing: -10,
  },

  // Image wrap — sized for portrait LEGO figures
  heroImageWrap: {
    position: 'absolute',
    top: height * 0.09,
    left: 0, right: 0,
    height: height * 0.44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 250, height: 250, borderRadius: 125,
    borderWidth: 1.5,
    shadowOpacity: 0.5, shadowRadius: 30,
  },
  glowInner: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
  },
  symbolText: {
    position: 'absolute',
    fontSize: 130, fontWeight: '900',
  },
  heroImage: {
    width: 190,
    height: 290,  // tall to fit LEGO portrait shape
  },

  infoPanel: {
    position: 'absolute',
    bottom: 88, left: 0, right: 0,
    paddingHorizontal: 24,
  },
  powerTag: {
    alignSelf: 'flex-start', borderRadius: 6, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10,
  },
  powerTagText: { fontSize: 9,  fontWeight: '900', letterSpacing: 2 },
  heroName:     { fontSize: 40, fontWeight: '900', letterSpacing: 3, lineHeight: 42, color: '#fff' },
  heroAlias:    { fontSize: 13, fontWeight: '700', letterSpacing: 2, marginTop: 2, marginBottom: 10 },
  quote:        { fontSize: 12, fontStyle: 'italic', letterSpacing: 0.5, marginBottom: 14, lineHeight: 18 },
  abilityRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  abilityChip:  { borderWidth: 1, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 4 },
  abilityText:  { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  statsBox:     { backgroundColor: '#00000055', borderRadius: 14, padding: 14 },

  dotsRow: {
    position: 'absolute', bottom: 36,
    left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  dot: { height: 8, borderRadius: 4 },

  navBtn: {
    position: 'absolute', top: height * 0.29,
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1, backgroundColor: '#00000066',
    justifyContent: 'center', alignItems: 'center',
  },
  navLeft:  { left: 14 },
  navRight: { right: 14 },
  navArrow: { fontSize: 28, fontWeight: '300', lineHeight: 34 },

  topBar: {
    position: 'absolute', top: 52, left: 22, right: 22,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  topLabel:   { fontSize: 11, fontWeight: '900', color: '#fff', letterSpacing: 5 },
  topDivider: { flex: 1, height: 1, opacity: 0.5 },
  topCount:   { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
});