import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const EntranceAnimation = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.text}>👋 Welcome!</Text>
        <Text style={styles.sub}>Fade + Scale Entrance</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1e1e2e',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6c63ff',
    shadowColor: '#6c63ff',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  text: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  sub: { fontSize: 14, color: '#6c63ff', marginTop: 8 },
});

export default EntranceAnimation;
