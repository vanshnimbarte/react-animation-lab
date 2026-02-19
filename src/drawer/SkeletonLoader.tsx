import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const SkeletonBar = ({ width, height = 16, marginTop = 10 }: any) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const bgColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2a2a3e', '#3e3e5e'],
  });

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: 8,
        backgroundColor: bgColor,
        marginTop,
      }}
    />
  );
};

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((_, i) => (
        <View key={i} style={styles.card}>
          {/* Avatar circle */}
          <View style={styles.row}>
            <SkeletonBar width={50} height={50} marginTop={0} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <SkeletonBar width="80%" height={14} marginTop={4} />
              <SkeletonBar width="50%" height={12} marginTop={8} />
            </View>
          </View>
          {/* Content lines */}
          <SkeletonBar width="100%" height={12} marginTop={16} />
          <SkeletonBar width="90%" height={12} marginTop={8} />
          <SkeletonBar width="70%" height={12} marginTop={8} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 20,
    paddingTop: 50,
  },
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SkeletonLoader;
