# Chai Tapri Tycoon ☕

An idle-merge mobile game. First experiment in the "earn money by leveraging AI" /
game-portfolio plan. Built with Expo / React Native — same stack as the Content Engine App.

## The loop
Serve chai → earn coins → **buy** stalls → **merge** two matching stalls into a higher
tier → bigger income → idle earnings accrue while away → come back, collect, repeat.

## Run it
```bash
cd "ChaiTapriTycoon"
npx expo start            # then press 'i' (iOS sim), 'a' (Android), or scan in Expo Go
npx expo start --web      # run in a browser
```

## Code map
- `game/config.js` — **all tuning lives here** (tiers, costs, rewards, caps). Balance the game by editing numbers, not logic.
- `game/engine.js` — pure game logic (income, buy, merge, idle/offline math). No React, no storage — unit-testable.
- `game/storage.js` — save/load/reset via AsyncStorage.
- `App.js` — the single game screen (grid, taps, buttons, popups, autosave tick).

## What's stubbed (wire before launch)
- **Rewarded ads** — the `⚡ 2× Boost` button (`onBoost` in App.js) currently grants the boost instantly. Replace with AdMob rewarded ad; grant boost on ad-complete callback.
- **IAP** — no purchase flow yet. Add a "remove ads / coin pack" SKU.
- **Art** — using emoji placeholders. Generate a real stall sprite set with an image model (the AI-leverage angle).

## The only metric that matters: retention
Ship to a Play Store closed track, drive ~100–300 installs from your own Reels/WhatsApp,
then watch the curve. **D7 retention is the go/no-go number.**

| Metric | Kill it | Promising | Chase it hard |
|---|---|---|---|
| D1 retention | < 25% | 30–35% | 40%+ |
| **D7 retention** | < 8% | 10–15% | 20%+ |
| D30 retention | < 3% | ~5% | 8%+ |
| ARPDAU | < ₹1 | ₹2–4 | ₹5+ |

Rough target for the ~$2k/mo India bar: `DAU × ARPDAU ≈ $65/day`.
At ₹4 ARPDAU that's ~1,300 daily actives — only reachable if D7 holds above ~15%.
**If a few tuning passes can't get D7 over ~10%, kill it and try the next concept.** That's
the portfolio plan working, not failing.

## India policy note
Avoid real-money / wagering mechanics — India restricted/banned online money-gaming
(~2025 legislation). Verify current official rules before designing anything money-game-adjacent.
