import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import {
  TIERS,
  GRID_COLS,
  TAP_REWARD_MULTIPLIER,
  BOOST_DURATION_SECONDS,
  STREAK_REWARD_SECONDS,
} from './game/config';
import {
  incomePerSecond,
  effectiveIncome,
  nextBuyCost,
  firstEmptySlot,
  buyStall,
  mergeStalls,
  applyElapsed,
  tick,
  dayKey,
} from './game/engine';
import { loadGame, saveGame, resetGame } from './game/storage';

// Compact number formatting: 1.2K, 3.4M, etc.
function fmt(n) {
  n = Math.floor(n);
  if (n < 1000) return `${n}`;
  const units = ['', 'K', 'M', 'B', 'T'];
  const i = Math.min(units.length - 1, Math.floor(Math.log10(n) / 3));
  const v = n / Math.pow(1000, i);
  return `${v.toFixed(v < 10 ? 1 : 0)}${units[i]}`;
}

export default function App() {
  const [state, setState] = useState(null);      // null until loaded
  const [selected, setSelected] = useState(-1);   // selected slot index for merging
  const [awayEarned, setAwayEarned] = useState(0); // "while you were away" amount
  const [, setBoostNow] = useState(0);            // re-render trigger for boost timer
  const stateRef = useRef(null);

  // Keep a ref in sync so interval callbacks read the latest state.
  useEffect(() => { stateRef.current = state; }, [state]);

  // Initial load + offline earnings.
  useEffect(() => {
    (async () => {
      const loaded = await loadGame();
      const [withIdle, earned] = applyElapsed(loaded);
      setState(withIdle);
      if (earned > 0) setAwayEarned(earned);
    })();
  }, []);

  // Live income tick + autosave, once per second.
  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      if (!s) return;
      const next = tick(s, 1);
      setState(next);
      saveGame(next);
      setBoostNow(Date.now()); // refresh boost countdown display
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!state) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={styles.loadingText}>☕ Brewing…</Text>
      </SafeAreaView>
    );
  }

  const income = incomePerSecond(state);
  const buyCost = nextBuyCost(state);
  const canBuy = state.coins >= buyCost && firstEmptySlot(state) !== -1;
  const boostActive = Date.now() < state.boostUntil;
  const boostLeft = Math.max(0, Math.ceil((state.boostUntil - Date.now()) / 1000));
  const streakAvailable = state.lastStreakDay !== dayKey();

  // --- Actions ---
  const onSlotPress = (i) => {
    const tier = state.slots[i];
    if (tier === null) { setSelected(-1); return; }
    if (selected === -1) { setSelected(i); return; }
    if (selected === i) { setSelected(-1); return; }
    const merged = mergeStalls(state, selected, i);
    setState(merged);
    saveGame(merged);
    setSelected(-1);
  };

  const onServe = () => {
    const reward = Math.max(1, income * TAP_REWARD_MULTIPLIER);
    const next = { ...state, coins: state.coins + reward };
    setState(next);
  };

  const onBuy = () => {
    const next = buyStall(state);
    setState(next);
    saveGame(next);
  };

  const onBoost = () => {
    // STUB: in production this plays a rewarded ad, then grants the boost on completion.
    const next = { ...state, boostUntil: Date.now() + BOOST_DURATION_SECONDS * 1000 };
    setState(next);
    saveGame(next);
  };

  const onClaimStreak = () => {
    const reward = Math.max(50, effectiveIncome(state) * STREAK_REWARD_SECONDS);
    const next = { ...state, coins: state.coins + reward, lastStreakDay: dayKey() };
    setState(next);
    saveGame(next);
  };

  const onReset = async () => {
    const fresh = await resetGame();
    setState(fresh);
    setSelected(-1);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* Header: coins + income */}
      <View style={styles.header}>
        <Text style={styles.title}>Chai Tapri Tycoon</Text>
        <Text style={styles.coins}>🪙 {fmt(state.coins)}</Text>
        <Text style={styles.income}>
          {fmt(income)}/sec {boostActive ? `· ⚡2× (${boostLeft}s)` : ''}
        </Text>
      </View>

      {/* Hint */}
      <Text style={styles.hint}>
        {selected === -1
          ? 'Tap a stall, then tap a matching one to merge ☕→🫖'
          : 'Now tap another stall of the same kind to merge'}
      </Text>

      {/* Grid */}
      <View style={styles.grid}>
        {state.slots.map((tier, i) => {
          const isSel = selected === i;
          const t = tier === null ? null : TIERS[tier];
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.slot,
                tier !== null && styles.slotFilled,
                isSel && styles.slotSelected,
              ]}
              onPress={() => onSlotPress(i)}
              activeOpacity={0.7}
            >
              {t ? (
                <>
                  <Text style={styles.slotEmoji}>{t.emoji}</Text>
                  <Text style={styles.slotName}>{t.name}</Text>
                  <Text style={styles.slotIncome}>{fmt(t.income)}/s</Text>
                </>
              ) : (
                <Text style={styles.slotEmpty}>＋</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Primary actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, !canBuy && styles.btnDisabled]}
          onPress={onBuy}
          disabled={!canBuy}
        >
          <Text style={styles.btnText}>Buy Stall</Text>
          <Text style={styles.btnSub}>🪙 {fmt(buyCost)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnServe]} onPress={onServe}>
          <Text style={styles.btnText}>Serve ☕</Text>
          <Text style={styles.btnSub}>+{fmt(Math.max(1, income * TAP_REWARD_MULTIPLIER))}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnBoost, boostActive && styles.btnDisabled]}
          onPress={onBoost}
          disabled={boostActive}
        >
          <Text style={styles.btnText}>⚡ 2× Boost</Text>
          <Text style={styles.btnSub}>Watch ad</Text>
        </TouchableOpacity>
      </View>

      {/* Daily streak */}
      {streakAvailable && (
        <TouchableOpacity style={styles.streak} onPress={onClaimStreak}>
          <Text style={styles.streakText}>🎁 Claim daily reward</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.reset} onPress={onReset}>
        <Text style={styles.resetText}>reset</Text>
      </TouchableOpacity>

      {/* While-you-were-away popup */}
      <Modal transparent visible={awayEarned > 0} animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setAwayEarned(0)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Welcome back! 🙏</Text>
            <Text style={styles.modalBody}>
              Your stalls earned{'\n'}
              <Text style={styles.modalAmount}>🪙 {fmt(awayEarned)}</Text>
              {'\n'}while you were away
            </Text>
            <View style={styles.modalBtn}>
              <Text style={styles.modalBtnText}>Collect</Text>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const C = {
  bg: '#1c1410',
  card: '#2a1e16',
  cardFilled: '#3d2b1d',
  accent: '#d99748',
  accent2: '#8a5a2b',
  text: '#f4e9dd',
  sub: '#b09680',
  green: '#3fa34d',
  purple: '#7a4ca0',
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 16 },
  loading: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: C.text, fontSize: 28 },

  header: { alignItems: 'center', paddingTop: 12, paddingBottom: 6 },
  title: { color: C.accent, fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  coins: { color: C.text, fontSize: 40, fontWeight: '800', marginTop: 4 },
  income: { color: C.sub, fontSize: 15, marginTop: 2 },

  hint: { color: C.sub, fontSize: 12, textAlign: 'center', marginVertical: 8 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slot: {
    width: `${100 / GRID_COLS - 3}%`,
    aspectRatio: 0.92,
    backgroundColor: C.card,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  slotFilled: { backgroundColor: C.cardFilled },
  slotSelected: { borderColor: C.accent },
  slotEmoji: { fontSize: 34 },
  slotName: { color: C.text, fontSize: 11, marginTop: 4, textAlign: 'center', paddingHorizontal: 2 },
  slotIncome: { color: C.accent, fontSize: 10, marginTop: 2 },
  slotEmpty: { color: C.accent2, fontSize: 30 },

  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  btn: {
    flex: 1,
    backgroundColor: C.accent2,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnServe: { backgroundColor: C.green },
  btnBoost: { backgroundColor: C.purple },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: C.text, fontSize: 15, fontWeight: '700' },
  btnSub: { color: C.text, fontSize: 12, marginTop: 2, opacity: 0.85 },

  streak: {
    marginTop: 12,
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  streakText: { color: '#1c1410', fontSize: 15, fontWeight: '800' },

  reset: { alignSelf: 'center', marginTop: 'auto', marginBottom: 8, padding: 8 },
  resetText: { color: C.sub, fontSize: 11, opacity: 0.5 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: C.card, borderRadius: 20, padding: 28, alignItems: 'center', width: '78%' },
  modalTitle: { color: C.accent, fontSize: 22, fontWeight: '800' },
  modalBody: { color: C.text, fontSize: 16, textAlign: 'center', marginTop: 12, lineHeight: 24 },
  modalAmount: { color: C.accent, fontSize: 26, fontWeight: '800' },
  modalBtn: { backgroundColor: C.green, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 40, marginTop: 20 },
  modalBtnText: { color: C.text, fontSize: 16, fontWeight: '700' },
});
