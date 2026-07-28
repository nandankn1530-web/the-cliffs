# CONTENT.md — the launch gate

**Nothing on this site is confirmed.** There was no property brief, no listing, no photographs
and no copy when it was built. Every fact below was invented to make the page coherent and
persuasive. It reads as true. It is not.

Work down this file, replace each value, and delete each row as you confirm it. When the file is
empty the site is ready to publish. Until then it is a design, not a live listing.

Placeholder tokens in the markup are written `TKTK` so `index.html?audit=1` can find them.

---

## 🔴 Blocking — the site must not go live with these

| ID | What | Current value | Where |
|---|---|---|---|
| **B1** | **Real Airbnb listing URL** | `https://www.airbnb.co.in/` — Airbnb's **homepage**. Every one of the 12 CTAs currently sends visitors to a generic search page instead of your listing. | `js/00-config.js` → `LISTING_ID` |
| **B2** | **Suite + gallery interiors are another hotel** | Photographs of **Amantaka, Luang Prabang, Laos**. Legally licensed, correctly attributed, and completely not your property. | 9 slots — see `CREDITS.md` |
| **B3** | **Photography attribution must stay visible** | CC BY-SA 4.0 requires it. The footer link to `CREDITS.md` satisfies it. Remove both only when every placeholder photo is gone. | footer, `CREDITS.md` |
| **B4** | **Live site URL** | `https://the-cliffs.netlify.app` — a guess. Wrong value breaks the OG preview image and the canonical tag. | `js/00-config.js` → `SITE_URL`, plus `<meta>` in `index.html` |

---

## 🟠 Invented facts — every one of these is fiction

### Property and location

| ID | Claim | Invented value |
|---|---|---|
| L1 | Region | Above the Bhadra valley, **Chikmagalur district, Karnataka** |
| L2 | Elevation | **1,420 m** |
| L3 | Nearest town | Chikmagalur, **1 hour** |
| L4 | Nearest airports | Mangaluru (MLR) **3 h 30**; Bengaluru (BLR) **5 h 30** |
| L5 | Railhead | Kadur, **1 h 20** |
| L6 | Best months | **October to March** |
| L7 | Coordinates | Used in JSON-LD `geo`. **Currently omitted rather than guessed** — add real ones or leave out |
| A1 | Elevation markers in the scroll spine | 840 · 960 · 1120 · 1240 · 1310 · 1380 · 1400 · 1420 m — atmospheric, entirely invented |

### The suites

| ID | Claim | Invented value |
|---|---|---|
| S1 | **The Canopy Suite** | 2 guests · king · private veranda · valley-facing |
| S2 | **The Long Room** | 4 guests · king + daybed · fireplace · corner windows |
| S3 | **The Rain Room** | 2 guests · king · freestanding bath · monsoon-facing |
| S4 | Property total | 3 suites, 8 guests |
| S5 | All amenity lines under each suite | invented |

### Booking terms

| ID | Claim | Invented value |
|---|---|---|
| T1 | Check-in / check-out | 2:00 pm / 11:00 am |
| T2 | Minimum stay | 2 nights |
| T3 | Cancellation | "Cancellation window set by the host" — deliberately vague because the real policy is set in your Airbnb settings. Make it specific once you know it. |
| T4 | Gallery card photo count | "+ 34 more photos on Airbnb" |
| T5 | Rate | **Not shown anywhere, on purpose.** A wrong price destroys trust at the exact moment of the click. Add it only when it's real. |

### FAQ answers (§7)

Six questions ship with written answers. All six are invented: getting there · best months ·
what's included · minimum stay · cancellation · families and pets. **Answers still containing
`TKTK` are excluded from the `FAQPage` JSON-LD** — shipping fabricated FAQ markup is a Google
structured-data policy violation.

### Copy

All headlines, section prose and suite descriptions are written to a plausible fiction, not from
your property. Read them as a draft to correct, not as text to approve. The one **verifiable**
claim on the page is that the Western Ghats are a UNESCO World Heritage site and one of the
world's eight biodiversity hotspots — that is true and can stay.

---

## 🟢 Deliberately absent — and should stay absent

These were considered and left out. Adding them back would cost more than it gains.

- **Star rating / review count.** The reference design had "4.9 rated on Airbnb". You have no
  reviews yet, and fabricated `aggregateRating` markup is grounds for a Google manual action.
  The hero carries an honest trust pill instead: *"Booking, payment and cancellation handled by
  Airbnb."* When you have a real rating, put it in — it belongs in the pill, not in JSON-LD.
- **Testimonials.** No guests, so every quote and face would be fake. Airbnb's real reviews do
  this job better, after the click.
- **Scarcity ("only 2 nights left").** No availability data behind it.
- **Contact form, phone number, newsletter, social icons, map embed.** Each is an exit that
  isn't Airbnb. The page has one job.
- **The Airbnb logo / Bélo mark.** Reference 1 used it as its own logo. Third-party use is
  restricted and invites a takedown. The word "Airbnb" in text is safe and reads cleaner.

---

## Launch checklist

1. Set `LISTING_ID` in `js/00-config.js` (B1).
2. Replace all 9 Amantaka photographs with real photography of The Cliffs (B2).
3. Deploy, then set `SITE_URL` and redeploy (B4).
4. Correct every 🟠 row above, or delete the claim.
5. Run `index.html?audit=1` — it must report zero `TKTK` tokens.
6. Once all placeholder photos are gone: delete `CREDITS.md` and its footer link (B3).
7. Convert `assets/images/` to WebP — see `README.md`. Cuts page weight ~60%.
