import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

// A "+250" that floats up and fades out, then removes itself. The little hit of
// feedback on every tap — the core of the serve-loop dopamine.
export default function FloatingText({ text, onDone }) {
  const y = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(y, { toValue: -90, duration: 850, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 850, useNativeDriver: true }),
    ]).start(() => onDone && onDone());
  }, []);

  return (
    <Animated.Text style={[styles.float, { opacity, transform: [{ translateY: y }] }]}>
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  float: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#ffd98a',
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
});
