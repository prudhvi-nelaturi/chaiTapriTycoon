// Pure game logic — no React, no storage. Easy to reason about and to unit-test.
import {
  TIERS,
  MAX_TIER,
  SLOT_COUNT,
  BASE_BUY_COST,
  BUY_COST_GROWTH,
  OFFLINE_CAP_SECONDS,
} from './config';

// A fresh game: empty grid, a few coins to make the first buy, no purchases yet.
export function newGame() {
  return {
    coins: 60,
    slots: Array(SLOT_COUNT).fill(null), // each slot is null or a tier index (0..MAX_TIER)
    buys: 0,                              // how many tier-1 stalls bought (drives buy cost)
    lastSeen: Date.now(),
    lastStreakDay: null,                  // YYYY-MM-DD of last claimed daily reward
    boostUntil: 0,                        // timestamp; while now < this, income is boosted
    bestTier: -1,                         // highest tier ever reached (for journey/unlocks)
    served: 0,                            // lifetime "serve" taps, for a sense of activity
  };
}

// Highest tier currently sitting on the board (-1 if board is empty).
export function maxTierInSlots(state) {
  return state.slots.reduce((m, t) => (t === null ? m : Math.max(m, t)), -1);
}

// Record the best tier ever reached, for the journey/progress UI. Returns NEW state.
export function bumpBest(state) {
  const prev = state.bestTier ?? -1;
  const best = Math.max(prev, maxTierInSlots(state));
  return best === prev ? state : { ...state, bestTier: best };
}

// Total coins/second across all placed stalls (before any boost).
export function incomePerSecond(state) {
  return state.slots.reduce(
    (sum, tier) => (tier === null ? sum : sum + TIERS[tier].income),
    0
  );
}

// Effective income including an active rewarded-ad boost.
export function effectiveIncome(state, now = Date.now()) {
  const base = incomePerSecond(state);
  const boosted = now < state.boostUntil;
  return boosted ? base * 2 : base;
}

// Cost of the next tier-1 stall, growing with each purchase.
export function nextBuyCost(state) {
  return Math.floor(BASE_BUY_COST * Math.pow(BUY_COST_GROWTH, state.buys));
}

export function firstEmptySlot(state) {
  return state.slots.findIndex((s) => s === null);
}

// Buy a tier-1 stall into the first empty slot. Returns a NEW state (immutable).
export function buyStall(state) {
  const cost = nextBuyCost(state);
  const slot = firstEmptySlot(state);
  if (slot === -1 || state.coins < cost) return state; // no room / can't afford
  const slots = state.slots.slice();
  slots[slot] = 0;
  return bumpBest({ ...state, coins: state.coins - cost, slots, buys: state.buys + 1 });
}

// Merge stall at slot `a` into slot `b` if they're the same, non-max tier.
// The merged (higher) tier lands on `b`; `a` becomes empty. Returns NEW state.
export function mergeStalls(state, a, b) {
  if (a === b) return state;
  const ta = state.slots[a];
  const tb = state.slots[b];
  if (ta === null || tb === null) return state;
  if (ta !== tb) return state;
  if (ta >= MAX_TIER) return state; // already top tier, can't merge further
  const slots = state.slots.slice();
  slots[b] = ta + 1;
  slots[a] = null;
  return bumpBest({ ...state, slots });
}

// Apply elapsed real time: add idle earnings (capped) and return NEW state plus
// the amount earned, so the UI can show a "while you were away" popup.
export function applyElapsed(state, now = Date.now()) {
  const elapsedMs = Math.max(0, now - state.lastSeen);
  const cappedSeconds = Math.min(elapsedMs / 1000, OFFLINE_CAP_SECONDS);
  const earned = Math.floor(effectiveIncome(state, state.lastSeen) * cappedSeconds);
  return [{ ...state, coins: state.coins + earned, lastSeen: now }, earned];
}

// A single live tick of `seconds` while the app is open.
export function tick(state, seconds, now = Date.now()) {
  const earned = effectiveIncome(state, now) * seconds;
  return { ...state, coins: state.coins + earned, lastSeen: now };
}

// Day key in the device's local time, for the daily-streak check.
export function dayKey(now = Date.now()) {
  const d = new Date(now);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
