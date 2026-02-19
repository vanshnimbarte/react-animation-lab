import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SWIPE_THRESHOLD = -120;

const SwipeItem = ({ label }: { label: string }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) translateX.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateX, { toValue: -400, duration: 250, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
          ]).start();
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const deleteOpacity = translateX.interpolate({
    inputRange: [-150, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.wrapper}>
      {/* Delete background */}
      <Animated.View style={[styles.deleteBox, { opacity: deleteOpacity }]}>
        <Text style={styles.deleteText}>🗑 Delete</Text>
      </Animated.View>
      {/* Swipeable row */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.item, { transform: [{ translateX }], opacity }]}
      >
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.hint}>← swipe to delete</Text>
      </Animated.View>
    </View>
  );
};

const SwipeToDelete = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Swipe to Delete</Text>
    {['Item One 🍎', 'Item Two 🎵', 'Item Three 🚀'].map((label, i) => (
      <SwipeItem key={i} label={label} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  wrapper: {
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  deleteBox: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 120,
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  item: {
    backgroundColor: '#1e1e2e',
    padding: 20,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  label: { color: '#fff', fontSize: 16, fontWeight: '600' },
  hint: { color: '#555', fontSize: 12 },
});

export default SwipeToDelete;
