# Architecture — Chai Tapri Tycoon ☕

An idle-merge mobile game. Tap to **buy** stalls, **merge** matching ones into
higher tiers, **serve customers** for big rewards, and earn **idle income** while
away. Built to be tuned by editing numbers, not rewriting logic.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | **Expo SDK 54** / React Native 0.81 | Same stack as the Content Engine App; runs in Expo Go via QR (App Store Expo Go only supports SDK 54 — do **not** bump past it without a dev build) |
| Language | JavaScript (no TypeScript) | Keep the prototype light |
| Persistence | `@react-native-async-storage/async-storage` | Local save; no backend needed for v1 |
| Safe area | `react-native-safe-area-context` | Real device insets so buttons clear the home indicator / nav bar |
| Animation | RN `Animated` (built-in) | Floating coins + unlock pop; no extra deps |

No backend, no navigation library, no game engine. Single screen.

---

## Layered design

The golden rule: **pure logic is separate from React and from storage.**

```
config.js   →  all tunable numbers (the "design surface")
engine.js   →  pure game logic (no React, no storage) — unit-testable
storage.js  →  AsyncStorage save/load/reset
App.js      →  React UI: state, the 1s tick, wiring, layout
components/  →  presentational pieces (Journey, CustomerCard, animations)
```

### `game/config.js` — the design surface
Almost all balancing lives here: the 8 stall `TIERS` (name/emoji/income), grid
size, buy-cost curve, boost duration, daily-streak reward, offline cap, and the
customer-order constants (reward seconds, arrival delay, tier spread, avatars).
**To rebalance the game, edit this file — not the logic.**

### `game/engine.js` — pure functions
Every function takes a state object and returns a **new** state (immutable). No
side effects, so it can be tested in plain Node. Key functions:

- `newGame()` — fresh state object
- `incomePerSecond` / `effectiveIncome` — coins/sec (with boost)
- `nextBuyCost`, `buyStall` — buying tier-0 stalls (cost grows with purchases)
- `mergeStalls(a, b)` — combine two same-tier stalls into the next tier
- `applyElapsed` — offline earnings (capped) on return
- `tick(seconds)` — one live income step
- `bumpBest` / `maxTierInSlots` — track highest tier ever reached (journey/unlocks)
- `rollOrder`, `canServeOrder`, `maybeSpawnOrder`, `serveOrder`, `skipOrder` — the
  customer-order loop

### `game/storage.js`
`loadGame` merges the saved object over `newGame()` so older saves get defaults
for new fields automatically (forward-compatible). `saveGame` is best-effort
(a failed write never crashes the game). `resetGame` clears the save.

### `App.js`
Holds the live React state, runs a **1-second `setInterval`** that ticks income +
spawns customers + autosaves, and wires user actions to engine functions. Also
owns the layout and the `fmt()` number formatter.

### `components/`
- `Journey.js` — progress bar + the full tier path (reached / current / locked)
- `CustomerCard.js` — the current order with a Serve or Skip button
- `FloatingText.js` — the "+coins 💰" pop that floats up and fades
- `UnlockBanner.js` — spring-in celebration when a new tier is first reached

---

## The game state (one plain object)

```js
{
  coins,          // current balance
  slots: [...],   // 12 slots; each is null or a tier index (0..7)
  buys,           // # of tier-0 stalls bought (drives buy cost)
  lastSeen,       // timestamp for offline-earnings math
  lastStreakDay,  // YYYY-MM-DD of last daily reward
  boostUntil,     // timestamp; income is 2× while now < this
  bestTier,       // highest tier ever reached (journey + unlock detection)
  order,          // current customer { tier, reward, avatar } or null
  orderReadyAt,   // timestamp the next customer may arrive
  ordersFilled,   // lifetime orders served
}
```

This whole object is what gets saved to AsyncStorage and reloaded.

---

## Core loops & data flow

1. **Idle income** — every second, `tick()` adds `effectiveIncome` to coins. On
   app launch, `applyElapsed()` grants capped offline earnings and shows the
   "while you were away" popup.
2. **Merge** — tap a stall to select, tap a matching one to merge → next tier.
   `bumpBest` records a new high tier, which fires the `UnlockBanner`.
3. **Customer orders** (active loop) — `maybeSpawnOrder` brings a customer asking
   for a tier; if you have that tier **or higher**, **Serve** pays the reward and
   the next customer arrives after `ORDER_ARRIVAL_MS`. Otherwise **Skip**.
4. **Persistence** — every mutating action and every tick calls `saveGame`.

```
user action / 1s tick → engine function (pure) → setState + saveGame → re-render
```

---

## Notable decisions

- **Numbers stay fully visible to 100M** (`56,380` not `56K`) then abbreviate
  M/B/T. The decimal-free full number visibly ticking is a deliberate dopamine
  hook. The coin counter auto-shrinks (`adjustsFontSizeToFit`) so long numbers fit.
- **Bottom padding uses `Math.max(insets.bottom, 24) + 22`** because Expo Go can
  under-report `insets.bottom`; this guarantees the action bar clears the gesture
  zone on every device.
- **Serve accepts the requested tier or any higher one** — intuitive ("a Restaurant
  can serve a Family Cafe order") and keeps Skip rare.
- **Ads, IAP, and art are stubbed** — see [TODO.md](TODO.md).

---

## Run & verify

```bash
npx expo start              # scan QR with Camera (iOS) / Expo Go (Android)
npx expo export --platform web   # bundle to check everything compiles
```

Engine functions are pure, so they can be smoke-tested in Node by copying
`game/` and adding `.js` extensions to the imports.
