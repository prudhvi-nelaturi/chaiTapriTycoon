import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TIERS } from '../game/config';

// The "how far have I come" strip: a progress bar to the top tier plus the
// full path of stalls, with everything past your best tier shown locked.
export default function Journey({ bestTier }) {
  const reached = bestTier + 1;            // count of tiers unlocked
  const pct = Math.max(0, Math.min(1, reached / TIERS.length));
  const next = bestTier + 1 < TIERS.length ? TIERS[bestTier + 1] : null;

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label} numberOfLines={1}>
          {next ? `Next  ${next.emoji}  ${next.name}` : '🏆  Empire complete!'}
        </Text>
        <Text style={styles.count}>{reached}/{TIERS.length}</Text>
      </View>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {TIERS.map((t, i) => {
          const isReached = i <= bestTier;
          const isCurrent = i === bestTier;
          return (
            <View key={i} style={styles.node}>
              <View
                style={[
                  styles.chip,
                  isReached && styles.chipReached,
                  isCurrent && styles.chipCurrent,
                ]}
              >
                <Text style={[styles.chipEmoji, !isReached && styles.dim]}>
                  {isReached ? t.emoji : '🔒'}
                </Text>
              </View>
              <Text style={[styles.nodeName, !isReached && styles.dim]} numberOfLines={1}>
                {t.name}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const C = {
  accent: '#d99748',
  card: '#2a1e16',
  cardOn: '#3d2b1d',
  text: '#f4e9dd',
  sub: '#b09680',
};

const styles = StyleSheet.create({
  wrap: { marginTop: 6, marginBottom: 4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  label: { color: C.text, fontSize: 13, fontWeight: '700', flex: 1 },
  count: { color: C.accent, fontSize: 13, fontWeight: '800' },

  barBg: { height: 8, borderRadius: 6, backgroundColor: C.card, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: C.accent, borderRadius: 6 },

  strip: { paddingVertical: 8, paddingRight: 8 },
  node: { alignItems: 'center', width: 60 },
  chip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipReached: { backgroundColor: C.cardOn },
  chipCurrent: { borderColor: C.accent },
  chipEmoji: { fontSize: 20 },
  nodeName: { color: C.text, fontSize: 9, marginTop: 3, textAlign: 'center' },
  dim: { opacity: 0.35 },
});
