import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProgressBarProps {
  label: string;
  percent: number;
  color: string;
  delay: number;
}

const ProgressBar = ({ label, percent, color, delay }: ProgressBarProps) => {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(width, {
        toValue: percent,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, delay);
  }, [percent]);

  const animWidth = width.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.barContainer}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Animated.Text style={[styles.barPercent, { color }]}>
          {width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })}
        </Animated.Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: animWidth, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const ProgressAnimation = () => {
  const [key, setKey] = useState(0);

  const skills = [
    { label: 'React Native', percent: 88, color: '#6c63ff', delay: 0 },
    { label: 'TypeScript', percent: 75, color: '#2ecc71', delay: 200 },
    { label: 'Animations', percent: 92, color: '#ff6b6b', delay: 400 },
    { label: 'UI/UX', percent: 65, color: '#f39c12', delay: 600 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skills Progress</Text>
      {skills.map((skill, i) => (
        <ProgressBar key={`${key}-${i}`} {...skill} />
      ))}
      <TouchableOpacity style={styles.btn} onPress={() => setKey(k => k + 1)}>
        <Text style={styles.btnText}>↺ Replay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 24,
    paddingTop: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  barContainer: { marginBottom: 22 },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  barLabel: { color: '#ccc', fontSize: 15, fontWeight: '600' },
  barPercent: { fontSize: 14, fontWeight: 'bold' },
  track: {
    height: 10,
    backgroundColor: '#1e1e2e',
    borderRadius: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 8,
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6c63ff',
  },
  btnText: { color: '#6c63ff', fontWeight: 'bold', fontSize: 15 },
});

export default ProgressAnimation;
