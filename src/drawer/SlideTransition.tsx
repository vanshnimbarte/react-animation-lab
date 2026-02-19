import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const screens = [
  { title: 'Home 🏠', color: '#1a1a2e', accent: '#6c63ff' },
  { title: 'Explore 🌍', color: '#1a2e1a', accent: '#2ecc71' },
  { title: 'Profile 👤', color: '#2e1a1a', accent: '#ff6b6b' },
];

const SlideTransition = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goTo = (nextIndex: number) => {
    const direction = nextIndex > currentIndex ? -width : width;
    slideAnim.setValue(direction);
    setCurrentIndex(nextIndex);
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const screen = screens[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: screen.color }]}>
      <Animated.View
        style={[styles.screen, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={[styles.screenTitle, { color: screen.accent }]}>
          {screen.title}
        </Text>
        <Text style={styles.screenSub}>Screen {currentIndex + 1} of {screens.length}</Text>

        {/* Decorative circles */}
        <View style={[styles.circle, { backgroundColor: screen.accent + '22', top: 60, right: 30 }]} />
        <View style={[styles.circle, { backgroundColor: screen.accent + '11', bottom: 120, left: 20, width: 120, height: 120 }]} />
      </Animated.View>

      {/* Navigation dots */}
      <View style={styles.dots}>
        {screens.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === currentIndex ? screen.accent : '#333' },
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, { opacity: currentIndex === 0 ? 0.3 : 1, backgroundColor: screen.accent }]}
          onPress={() => currentIndex > 0 && goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <Text style={styles.btnText}>← Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { opacity: currentIndex === screens.length - 1 ? 0.3 : 1, backgroundColor: screen.accent }]}
          onPress={() => currentIndex < screens.length - 1 && goTo(currentIndex + 1)}
          disabled={currentIndex === screens.length - 1}
        >
          <Text style={styles.btnText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screen: {
    width: width - 40,
    height: 280,
    backgroundColor: '#ffffff08',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff15',
    overflow: 'hidden',
  },
  screenTitle: { fontSize: 36, fontWeight: 'bold' },
  screenSub: { color: '#aaa', marginTop: 10, fontSize: 14 },
  circle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  dots: { flexDirection: 'row', marginTop: 24, gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  btnRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 30,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default SlideTransition;
