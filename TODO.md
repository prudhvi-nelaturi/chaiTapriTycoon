# TODO — Chai Tapri Tycoon

Status: **playable prototype.** Core loop (buy → merge → serve → idle) works;
journey, unlocks, customer orders, and safe-area layout are done. What's left,
roughly in priority order.

---

## 🔴 Before any real launch (the stubs)

- [ ] **Real art instead of emoji.** Generate a stall sprite set with an image
      model (the AI-leverage angle). Replace emoji in `config.js` `TIERS` and the
      coin/customer icons. Add an app icon + splash screen (`assets/`).
- [ ] **Rewarded ads (AdMob).** The `⚡ 2× Boost` button (`onBoost` in App.js)
      currently grants the boost instantly. Wire a real rewarded ad and grant the
      boost on the ad-complete callback. Needs a dev build (not Expo Go).
- [ ] **In-app purchases.** Add at least one SKU (coin pack / remove ads).

## 🟠 Retention (highest-impact next feature)

- [ ] **Free-gift appointment timer.** A reward chest ready every N hours with a
      live countdown ("Free gift in 02:45") and a collect button. This is the
      single strongest retention lever for idle games.
- [ ] **Push notifications** (`expo-notifications`). Fire a local notification when
      the free gift is ready / offline earnings are full. The notification is what
      actually drags players back. Start with local (no server needed).

## 🌐 Community & social (the bigger swing — learn it here first)

The goal is a *community-driven* game in general (Coin Master / Ludo King style —
NOT PUBG/real-time, which is studio-scale). Use this game as the cheap testbed to
learn the social playbook before betting big on a dedicated community title.

Rule of thumb: **async social = solo-buildable; real-time = not.** All of the
below are async and run on a free managed backend (Firebase or Supabase free tier).
This is the point where the app stops being $0 on-device and needs a backend.

- [ ] **Global + friends leaderboard.** Cheapest possible social hook. Firebase/Supabase.
- [ ] **Weekly tournament.** Reset every 7 days, top players get a reward — a recurring
      reason to come back and compete (the appointment loop, but social).
- [ ] **Friend invites / referral.** Share a link via WhatsApp → both get a bonus.
      Turns players into your free user-acquisition (the anti-paid-UA move).
- [ ] **Gifting** between friends (send/receive coins or boosts) — the Coin Master hook.
- [ ] **Clans / teams** with a shared goal (later, only if the simpler social lifts retention).
- [ ] Decide backend: **Firebase** (fastest to wire, generous free tier) vs **Supabase**
      (Postgres, more control). Pick one; don't hand-roll servers.

**Sequencing:** prove single-player retention first (D7 > ~10%). Social bolted onto
a game nobody returns to is wasted effort. Then add leaderboard → tournament →
invites in that order and measure whether each lifts retention.

## 🟡 Game design & balance

- [ ] **Smooth the late climb.** Family Cafe → Restaurant → Cloud Kitchen is where
      players hook or drop. Tune the income curve / buy costs in `config.js`.
- [ ] **More tiers.** Currently 8; hit games run 12–15 so there's always a "next
      thing." Add tiers above Cloud Kitchen (e.g. Restaurant Chain → Food Empire).
- [ ] **Tune order economy.** `ORDER_REWARD_SECONDS` (90) vs idle income — make
      sure serving feels rewarding but doesn't make idle pointless.
- [ ] **Prestige / reset-for-bonus** loop for long-term retention (later).

## 🟢 Polish

- [ ] Merge animation (stalls visibly combine) + a small sound/haptic on serve.
- [ ] Confirm dialog on `reset` (it wipes the save with no warning).
- [ ] Empty-board onboarding for brand-new players (first-time hint flow).
- [ ] Consider lakh/crore number formatting as an optional desi flavor toggle
      (decided against for now — K/M/B is the gaming convention even in India).

## 📋 Ship & measure

- [ ] Build with EAS, ship to a Play Store **closed track**.
- [ ] Drive ~100–300 installs from own Reels/WhatsApp.
- [ ] Watch retention — **D7 is the go/no-go**: >~10% = tune & push, <~10% = kill
      and try the next concept (see README).
- [ ] Route monetization through India per the personal plan, once revenue exists.

## ⚠️ Policy

- [ ] **Avoid real-money / wagering mechanics** — India restricted/banned online
      money-gaming (~2025). Verify current official rules before designing anything
      money-game-adjacent.

---

See [ARCHITECTURE.md](ARCHITECTURE.md) for how the code is organized and
[README.md](README.md) for run instructions + the retention plan.
