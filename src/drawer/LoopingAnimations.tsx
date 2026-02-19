import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

const PulseCircle = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.4, duration: 900, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.2, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.8, duration: 900, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.pulseWrapper}>
      {/* Outer ring */}
      <Animated.View style={[styles.pulseRing, { transform: [{ scale }], opacity }]} />
      {/* Inner dot */}
      <View style={styles.pulseDot}>
        <Text style={{ fontSize: 22 }}>💜</Text>
      </View>
    </View>
  );
};

const RotatingLoader = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.loader, { transform: [{ rotate }] }]}>
      <View style={styles.loaderInner} />
    </Animated.View>
  );
};

const FloatingDot = ({ delay, x }: { delay: number; x: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, { toValue: -20, duration: 1200, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }, delay);
  }, []);

  return (
    <Animated.View
      style={[styles.floatDot, { left: x, transform: [{ translateY }] }]}
    />
  );
};

const LoopingAnimations = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Looping Animations</Text>

    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Pulse</Text>
      <PulseCircle />
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Rotating Loader</Text>
      <RotatingLoader />
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Floating Dots</Text>
      <View style={styles.floatRow}>
        {[20, 55, 90, 125, 160].map((x, i) => (
          <FloatingDot key={i} x={x} delay={i * 200} />
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 24,
    paddingTop: 60,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
  section: {
    backgroundColor: '#1e1e2e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  sectionLabel: { color: '#888', fontSize: 13, marginBottom: 16 },

  // Pulse
  pulseWrapper: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6c63ff44',
    borderWidth: 2,
    borderColor: '#6c63ff',
  },
  pulseDot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e1e2e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loader
  loader: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4,
    borderColor: '#6c63ff',
    borderTopColor: 'transparent',
  },
  loaderInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ff6b6b',
    borderBottomColor: 'transparent',
  },

  // Float
  floatRow: { height: 50, width: 220, position: 'relative' },
  floatDot: {
    position: 'absolute',
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#6c63ff',
  },
});

export default LoopingAnimations;
