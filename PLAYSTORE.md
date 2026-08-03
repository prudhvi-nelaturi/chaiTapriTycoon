# Play Store Launch Kit — Chai Tapri Tycoon

Everything needed to ship. Build is produced by EAS (`eas build --platform android
--profile production`); the console steps below are done at
[play.google.com/console](https://play.google.com/console) with
`prudhvinelaturi29@gmail.com` (same account as NexusHub).

## ⚠️ The path to production (same as NexusHub)

Personal dev accounts must pass a closed test **per app** before production:

1. **Create app** in Play Console → upload AAB to **Internal testing** (instant, no review wait) → sanity-check on a real device.
2. Promote to **Closed testing** → recruit **12 testers** who stay opted in **14 consecutive days**. (Reuse the NexusHub tester group — friends/family who did it last time.)
3. After 14 days → **Apply for production** → full rollout.

"Launch day" is therefore ~2–3 weeks after the closed test starts. Share the
closed-test opt-in link via WhatsApp — that IS the WhatsApp launch.

## App details

| Field | Value |
|---|---|
| App name | `Chai Tapri Tycoon` |
| Package | `com.prudhvinelaturi.chaitapritycoon` |
| Default language | English (India) — `en-IN` |
| App or game | Game |
| Category | Casual (alt: Simulation) |
| Free/paid | Free |
| Contains ads | **No** (none integrated yet — update this when AdMob lands) |
| In-app purchases | No |
| Privacy policy URL | `https://prudhvi-nelaturi.github.io/chaiTapriTycoon/privacy.html` |
| Contact email | `prudhvinelaturi29@gmail.com` |

## Store listing copy

**Short description** (70/80 chars):
> Merge chai stalls, serve customers, and grow your street-food empire!

**Full description:**

> ☕ Start with one humble roadside chai tapri. End with a street-food empire.
>
> Chai Tapri Tycoon is a relaxing idle-merge game with a desi heart. Buy chai
> stalls, merge matching ones into bigger businesses, and serve the customers
> who walk up to your counter — from a cutting chai to a full cloud kitchen.
>
> 🫖 MERGE & GROW
> Combine two matching stalls to unlock the next tier: Chai Tapri → Chai +
> Snacks → Tiffin Center → Dosa Cart → Juice Stand → Family Cafe → Restaurant
> → Cloud Kitchen. Watch your income grow with every merge.
>
> 🧑‍🍳 SERVE REAL CUSTOMERS
> Customers walk up wanting a specific stall. Serve them for big coin rewards —
> every order is a little decision: serve now, or merge up first?
>
> 💰 EARN WHILE YOU'RE AWAY
> Your stalls keep earning when the app is closed. Come back to collect your
> idle income — and don't miss your daily reward streak.
>
> 🗺️ TRACK YOUR JOURNEY
> A progress path shows every business you've unlocked and what's next.
>
> ✨ FREE & OFFLINE
> No account. No internet needed. No ads. Just chai.
>
> Can you build the biggest chai empire on the street?

## Graphics checklist

| Asset | Spec | File |
|---|---|---|
| App icon | 512×512 PNG | `store/icon-512.png` ✅ |
| Feature graphic | 1024×500 PNG | `store/feature-graphic.png` ✅ |
| Phone screenshots | ≥2, PNG/JPG, 16:9 or 9:16 | **TODO — capture from the production build on a phone** (or Prudhvi's existing gameplay screenshots) |

## Console questionnaires

**Content rating (IARC):** questionnaire → Game. Answer **No** to everything:
no violence, no sexuality, no language, no controlled substances, no gambling
(coins are earned in-game only, can't be bought or cashed out), no user
interaction/UGC, no data sharing, no location. Expected rating: Everyone / 3+.

**Data safety:** "Does your app collect or share any of the required user data
types?" → **No**. All progress is stored locally on-device; no analytics, no
ads, no accounts. (Matches the privacy policy. Update BOTH when ads/analytics land.)

**Target audience:** 13+ (do NOT tick under-13 — that opts into the Families
program and its extra requirements).

**App access:** All functionality is available without special access (no login).

**Ads declaration:** No ads.

## Upload path

Option A — console UI: Internal testing → Create release → upload the `.aab`
from the EAS build page → roll out.

Option B — CLI (after configuring a service-account key once):
```bash
npx eas-cli submit --platform android --latest
```
(First time requires linking a Google service account JSON — console UI is
faster for release #1; set up eas submit later for one-command releases.)

## Release notes (v1.0.0)

> First release! Merge chai stalls, serve customers, earn idle income, and
> climb from a roadside tapri to a cloud kitchen.

## Post-launch reminders

- When AdMob is added: flip "Contains ads" to Yes, update data safety + privacy policy.
- Play Console → Statistics is the retention dashboard: **D7 > ~10% = keep pushing; below = tune or move to the next experiment.**
- versionCode is auto-incremented by EAS on every production build — no manual bumps.
