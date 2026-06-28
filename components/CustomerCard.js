import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TIERS } from '../game/config';

// The active "selling to people" loop. Shows the current customer's request and
// either a Serve button (if you have the stall) or a Skip (if you don't / won't).
export default function CustomerCard({ order, canServe, onServe, onSkip, fmt }) {
  if (!order) {
    return (
      <View style={styles.waitingWrap}>
        <Text style={styles.waiting}>🚶  Next customer on the way…</Text>
      </View>
    );
  }

  const t = TIERS[order.tier];
  return (
    <View style={styles.card}>
      <Text style={styles.avatar}>{order.avatar}</Text>

      <View style={styles.mid}>
        <Text style={styles.wants} numberOfLines={1}>
          wants  {t.emoji} {t.name}
        </Text>
        <Text style={styles.reward}>+{fmt(order.reward)} 💰</Text>
        {!canServe && <Text style={styles.need}>reach {t.name} (or bigger) to serve</Text>}
      </View>

      {canServe ? (
        <TouchableOpacity style={styles.serveBtn} onPress={onServe} activeOpacity={0.8}>
          <Text style={styles.serveText}>Serve</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.8}>
          <Text style={styles.skipText}>Skip ↻</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const C = {
  card: '#2a1e16',
  accent: '#d99748',
  text: '#f4e9dd',
  sub: '#b09680',
  green: '#3fa34d',
};

const styles = StyleSheet.create({
  waitingWrap: { alignItems: 'center', paddingVertical: 18 },
  waiting: { color: C.sub, fontSize: 13, fontStyle: 'italic' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: C.accent,
  },
  avatar: { fontSize: 38, marginRight: 10 },
  mid: { flex: 1 },
  wants: { color: C.text, fontSize: 15, fontWeight: '700' },
  reward: { color: C.accent, fontSize: 16, fontWeight: '800', marginTop: 2 },
  need: { color: C.sub, fontSize: 11, marginTop: 2 },

  serveBtn: {
    backgroundColor: C.green,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  serveText: { color: C.text, fontSize: 16, fontWeight: '800' },

  skipBtn: {
    backgroundColor: '#3d2b1d',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  skipText: { color: C.sub, fontSize: 14, fontWeight: '700' },
});
