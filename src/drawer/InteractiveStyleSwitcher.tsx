import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─────────────────────────────────────────────
//  THEME DEFINITIONS
// ─────────────────────────────────────────────
const themes = [
  {
    id: 'fire',
    label: '🔥 Fire',
    bg: ['#1a0500', '#3d0f00'],
    accent: '#ff4500',
    cardBg: '#2a0800',
    border: '#ff6b35',
    shape: 'circle',
    emoji: '🔥',
    desc: 'Blazing hot',
  },
  {
    id: 'ocean',
    label: '🌊 Ocean',
    bg: ['#000d1a', '#002244'],
    accent: '#00b4d8',
    cardBg: '#001a33',
    border: '#0077b6',
    shape: 'wave',
    emoji: '🌊',
    desc: 'Deep & calm',
  },
  {
    id: 'forest',
    label: '🌿 Forest',
    bg: ['#050f02', '#0d2406'],
    accent: '#4ade80',
    cardBg: '#0a1f08',
    border: '#22c55e',
    shape: 'triangle',
    emoji: '🌿',
    desc: 'Wild & fresh',
  },
  {
    id: 'galaxy',
    label: '🪐 Galaxy',
    bg: ['#05001a', '#110033'],
    accent: '#a855f7',
    cardBg: '#0d0022',
    border: '#7c3aed',
    shape: 'star',
    emoji: '🪐',
    desc: 'Cosmic vibes',
  },
  {
    id: 'neon',
    label: '⚡ Neon',
    bg: ['#000000', '#0a0a0a'],
    accent: '#f0ff00',
    cardBg: '#111111',
    border: '#ccff00',
    shape: 'diamond',
    emoji: '⚡',
    desc: 'Electric city',
  },
];

// ─────────────────────────────────────────────
//  ANIMATED SHAPE OBJECT
// ─────────────────────────────────────────────
const AnimatedShape = ({
  shape,
  accent,
  border,
  animValue,
}: {
  shape: string;
  accent: string;
  border: string;
  animValue: Animated.Value;
}) => {
  const rotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const scale = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1.15, 1],
  });

  const shapeStyle: any = {
    circle: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: accent + '33',
      borderWidth: 3,
      borderColor: border,
      shadowColor: accent,
      shadowOpacity: 0.8,
      shadowRadius: 20,
      elevation: 12,
    },
    wave: {
      width: 110,
      height: 110,
      borderRadius: 50,
      borderTopLeftRadius: 55,
      borderBottomRightRadius: 55,
      backgroundColor: accent + '33',
      borderWidth: 3,
      borderColor: border,
    },
    triangle: {
      width: 0,
      height: 0,
      borderLeftWidth: 55,
      borderRightWidth: 55,
      borderBottomWidth: 110,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: accent,
    },
    star: {
      width: 110,
      height: 110,
      borderRadius: 12,
      backgroundColor: accent + '33',
      borderWidth: 3,
      borderColor: border,
      transform: [{ rotate: '45deg' }],
    },
    diamond: {
      width: 90,
      height: 90,
      backgroundColor: accent + '44',
      borderWidth: 3,
      borderColor: border,
      transform: [{ rotate: '45deg' }],
    },
  };

  return (
    <Animated.View
      style={[
        shapeStyle[shape] || shapeStyle.circle,
        { transform: [{ rotate }, { scale }] },
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    />
  );
};

// ─────────────────────────────────────────────
//  ANIMATED BACKGROUND BARS
// ─────────────────────────────────────────────
const BgBars = ({ accent, animValue }: { accent: string; animValue: Animated.Value }) => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {[...Array(6)].map((_, i) => {
        const translateY = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [60 * (i + 1), 0],
        });
        const opacity = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.07 + i * 0.015],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              top: 60 + i * 80,
              left: -20,
              right: -20,
              height: 50,
              borderRadius: 30,
              backgroundColor: accent,
              opacity,
              transform: [{ translateY }],
            }}
          />
        );
      })}
    </View>
  );
};

// ─────────────────────────────────────────────
//  STAT CARD
// ─────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  accent,
  cardBg,
  border,
  delay,
  animValue,
}: any) => {
  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });
  const opacity = animValue.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          backgroundColor: cardBg,
          borderColor: border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function InteractiveStyleSwitcher() {
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const animValue = useRef(new Animated.Value(1)).current;
  const bgFade = useRef(new Animated.Value(1)).current;
  const shapeScale = useRef(new Animated.Value(1)).current;

  const switchTheme = (theme: typeof themes[0]) => {
    if (theme.id === activeTheme.id) return;

    // Sequence: fade out → swap → fade in
    Animated.sequence([
      // Fade out + shrink
      Animated.parallel([
        Animated.timing(bgFade, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(shapeScale, { toValue: 0, duration: 200, easing: Easing.in(Easing.back(2)), useNativeDriver: true }),
        Animated.timing(animValue, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setActiveTheme(theme);
      // Fade in + spring in
      Animated.parallel([
        Animated.timing(bgFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(shapeScale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
        Animated.timing(animValue, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    });
  };

  const stats = [
    { label: 'Energy', value: '94%' },
    { label: 'Vibe', value: '∞' },
    { label: 'Style', value: '#1' },
  ];

  return (
    <Animated.View style={[styles.root, { backgroundColor: activeTheme.bg[0], opacity: bgFade }]}>
      {/* Animated bg bars */}
      <BgBars accent={activeTheme.accent} animValue={animValue} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <Animated.View style={[styles.header, { opacity: animValue }]}>
          <Text style={[styles.tagline, { color: activeTheme.accent }]}>STYLE SWITCHER</Text>
          <Text style={styles.headline}>Tap a theme.{'\n'}Watch everything change.</Text>
        </Animated.View>

        {/* ── OBJECT DISPLAY CARD ── */}
        <Animated.View
          style={[
            styles.objectCard,
            {
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.border,
              transform: [{ scale: shapeScale }],
            },
          ]}
        >
          {/* Glow ring */}
          <Animated.View
            style={[
              styles.glowRing,
              {
                borderColor: activeTheme.accent,
                shadowColor: activeTheme.accent,
                opacity: animValue,
              },
            ]}
          />

          {/* Shape */}
          <AnimatedShape
            shape={activeTheme.shape}
            accent={activeTheme.accent}
            border={activeTheme.border}
            animValue={animValue}
          />

          {/* Emoji overlay */}
          <Animated.Text
            style={[styles.shapeEmoji, { opacity: animValue }]}
          >
            {activeTheme.emoji}
          </Animated.Text>

          {/* Theme info */}
          <Animated.View style={[styles.themeInfo, { opacity: animValue }]}>
            <Text style={[styles.themeName, { color: activeTheme.accent }]}>
              {activeTheme.label}
            </Text>
            <Text style={styles.themeDesc}>{activeTheme.desc}</Text>
          </Animated.View>
        </Animated.View>

        {/* ── STATS ROW ── */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <StatCard
              key={`${activeTheme.id}-${i}`}
              {...s}
              accent={activeTheme.accent}
              cardBg={activeTheme.cardBg}
              border={activeTheme.border}
              delay={i * 100}
              animValue={animValue}
            />
          ))}
        </View>

        {/* ── THEME BUTTONS ── */}
        <Text style={styles.sectionTitle}>Choose a Theme</Text>

        <View style={styles.btnGrid}>
          {themes.map((theme) => {
            const isActive = theme.id === activeTheme.id;
            return (
              <TouchableOpacity
                key={theme.id}
                onPress={() => switchTheme(theme)}
                activeOpacity={0.75}
                style={[
                  styles.themeBtn,
                  {
                    backgroundColor: isActive ? theme.accent + '22' : '#111',
                    borderColor: isActive ? theme.accent : '#2a2a2a',
                    borderWidth: isActive ? 2 : 1,
                  },
                ]}
              >
                <Text style={styles.themeBtnEmoji}>{theme.emoji}</Text>
                <Text style={[styles.themeBtnLabel, { color: isActive ? theme.accent : '#888' }]}>
                  {theme.label}
                </Text>
                {isActive && (
                  <View style={[styles.activeDot, { backgroundColor: theme.accent }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── STYLE PREVIEW STRIPS ── */}
        <Text style={styles.sectionTitle}>Live Style Preview</Text>

        <Animated.View style={[styles.previewBox, { opacity: animValue, borderColor: activeTheme.border, backgroundColor: activeTheme.cardBg }]}>
          {/* Color swatch row */}
          <View style={styles.swatchRow}>
            {[1, 0.7, 0.4, 0.2, 0.08].map((a, i) => (
              <View
                key={i}
                style={[styles.swatch, { backgroundColor: activeTheme.accent + Math.round(a * 255).toString(16).padStart(2, '0') }]}
              />
            ))}
          </View>

          {/* Fake text lines */}
          {[1, 0.7, 0.4].map((w, i) => (
            <View
              key={i}
              style={[
                styles.textLine,
                {
                  width: `${w * 100}%`,
                  backgroundColor: activeTheme.accent + '33',
                  marginTop: i === 0 ? 14 : 8,
                },
              ]}
            />
          ))}

          {/* Fake button */}
          <View style={[styles.fakeBtn, { backgroundColor: activeTheme.accent }]}>
            <Text style={styles.fakeBtnText}>Action Button</Text>
          </View>
        </Animated.View>

      </ScrollView>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 22, paddingTop: 60, paddingBottom: 60 },

  // Header
  header: { marginBottom: 28 },
  tagline: { fontSize: 11, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  headline: { fontSize: 30, fontWeight: '900', color: '#fff', lineHeight: 38 },

  // Object card
  objectCard: {
    borderRadius: 28,
    borderWidth: 1.5,
    padding: 36,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  shapeEmoji: {
    position: 'absolute',
    fontSize: 48,
    top: '28%',
  },
  themeInfo: { marginTop: 24, alignItems: 'center' },
  themeName: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  themeDesc: { color: '#666', fontSize: 13, marginTop: 4 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#666', fontSize: 11, marginTop: 2, fontWeight: '600', letterSpacing: 1 },

  // Section title
  sectionTitle: {
    color: '#444',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 14,
    marginTop: 4,
  },

  // Theme buttons
  btnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  themeBtn: {
    width: (width - 44 - 10) / 2 - 5,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  themeBtnEmoji: { fontSize: 20 },
  themeBtnLabel: { fontSize: 14, fontWeight: '700' },
  activeDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Preview
  previewBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 10,
  },
  swatchRow: { flexDirection: 'row', gap: 8 },
  swatch: { flex: 1, height: 32, borderRadius: 8 },
  textLine: { height: 10, borderRadius: 6 },
  fakeBtn: {
    marginTop: 18,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  fakeBtnText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
});
