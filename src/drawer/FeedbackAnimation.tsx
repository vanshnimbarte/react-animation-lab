import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FeedbackAnimation = () => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const [showSuccess, setShowSuccess] = useState(false);
  const [input, setInput] = useState('');

  const shake = () => {
    setShowSuccess(false);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const showSuccessAnim = () => {
    setShowSuccess(true);
    successScale.setValue(0);
    Animated.spring(successScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = () => {
    if (input.trim() === '') {
      shake();
    } else {
      showSuccessAnim();
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback Animations</Text>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          placeholderTextColor="#555"
          value={input}
          onChangeText={setInput}
        />
      </Animated.View>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>

      {showSuccess && (
        <Animated.View style={[styles.successBox, { transform: [{ scale: successScale }] }]}>
          <Text style={styles.successText}>✅ Success! Great job!</Text>
        </Animated.View>
      )}

      <Text style={styles.hint}>Leave empty → Shake ❌ | Type something → Pulse ✅</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  input: {
    width: 300,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#6c63ff',
  },
  btn: {
    marginTop: 16,
    backgroundColor: '#6c63ff',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  successBox: {
    marginTop: 24,
    backgroundColor: '#1a3a2a',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  successText: { color: '#2ecc71', fontSize: 16, fontWeight: '600' },
  hint: {
    position: 'absolute',
    bottom: 40,
    color: '#444',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default FeedbackAnimation;
