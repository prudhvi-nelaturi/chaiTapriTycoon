import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { TIERS } from '../game/config';

// The "I'm growing it!" moment: pops in with a spring when you reach a brand-new
// tier for the first time, holds, then fades. Auto-dismisses via onDone.
export default function UnlockBanner({ tier, onDone }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]),
      Animated.delay(1400),
      Animated.timing(opacity, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start(() => onDone && onDone());
  }, []);

  const t = TIERS[tier];
  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.kicker}>✨ NEW STALL UNLOCKED ✨</Text>
        <Text style={styles.emoji}>{t.emoji}</Text>
        <Text style={styles.name}>{t.name}</Text>
        <Text style={styles.income}>+{t.income}/sec</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: '#2a1e16',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 44,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d99748',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  kicker: { color: '#d99748', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  emoji: { fontSize: 64, marginVertical: 8 },
  name: { color: '#f4e9dd', fontSize: 22, fontWeight: '800' },
  income: { color: '#3fa34d', fontSize: 16, fontWeight: '700', marginTop: 4 },
});
