// Game configuration — tune these numbers to balance progression.
// This is the "design surface": almost all balancing happens here, not in code.

// Stall tiers. Merge two of the same tier to get the next one.
// income = coins generated per second by one stall of that tier.
export const TIERS = [
  { name: 'Chai Tapri',      emoji: '☕', income: 1 },      // ☕
  { name: 'Chai + Snacks',   emoji: '🫖', income: 4 },      // 🫖
  { name: 'Tiffin Center',   emoji: '🥘', income: 12 },     // 🥘
  { name: 'Dosa Cart',       emoji: '🥞', income: 35 },     // 🥞
  { name: 'Juice Stand',     emoji: '🧃', income: 100 },    // 🧃
  { name: 'Family Cafe',     emoji: '🏪', income: 280 },    // 🏪
  { name: 'Restaurant',      emoji: '🍽️', income: 750 },  // 🍽️
  { name: 'Cloud Kitchen',   emoji: '🚚', income: 2000 },   // 🚚
];

export const MAX_TIER = TIERS.length - 1;

// Grid of slots where stalls live.
export const GRID_COLS = 3;
export const GRID_ROWS = 4;
export const SLOT_COUNT = GRID_COLS * GRID_ROWS;

// Buying a new tier-1 stall. Cost grows with how many you've bought,
// so the player keeps reaching for the next merge instead of spamming buys.
export const BASE_BUY_COST = 50;
export const BUY_COST_GROWTH = 1.15; // each purchase multiplies cost by this

// Tapping the stand to "serve a customer" gives an instant coin pop.
// Keeps the player physically engaged between idle ticks.
export const TAP_REWARD_MULTIPLIER = 2; // tap = 2 seconds of total income, instantly

// Rewarded-ad boost (stubbed): doubles income for this many seconds.
export const BOOST_DURATION_SECONDS = 30;
export const BOOST_MULTIPLIER = 2;

// Daily streak reward (coins) = base * current income, capped, to reward returns.
export const STREAK_REWARD_SECONDS = 120; // "2 minutes of free income" on daily return

// Offline earnings cap so leaving for a week isn't infinite money.
export const OFFLINE_CAP_SECONDS = 8 * 3600; // 8 hours of accrual max

export const SAVE_KEY = 'chai_tapri_save_v1';
