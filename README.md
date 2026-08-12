# The Cliffs

A single-page site for a luxury retreat in the Western Ghats. It has one job: make a visitor want
to stay, then send them to the Airbnb listing to book.

No build step. No npm. No framework.

---

## Open it

**Double-click `index.html`.** That's it — it works straight off the filesystem.

That constraint is load-bearing, not laziness. It shaped four decisions you'd otherwise want to
"improve", and each one silently breaks double-click if you change it:

| Don't | Why |
|---|---|
| `<script type="module">` | CORS-blocked from `file://` (origin `null`). All scripts are classic + `defer`. |
| `fetch()` a local JSON file | Blocked from `file://`. That's why the image manifest is Markdown for humans and a JS global for code — never fetched. |
| Self-host the fonts | `@font-face` files are CORS-restricted from `file://`. Google Fonts sends `Access-Control-Allow-Origin: *`, so it works. |
| `@import` in CSS | Works, but serializes the downloads. Six parallel `<link>` tags instead. |

If you later add a build step, all four become fine. Until then, leave them.

---

## Deploy it

Drag the whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

**First, check OneDrive has finished syncing** — the folder needs green ticks, not blue arrows.
Uploading mid-sync ships truncated placeholder files, and the failure looks like corrupt images
rather than a sync problem. Drag the *folder*, not its contents.

After the first deploy, set `SITE_URL` in `js/00-config.js` to the real URL and redeploy. The
Open Graph preview image and the canonical tag both need an absolute URL to work.

---

## The one line you'll want to change

Every "Book on Airbnb" button on the page — all twelve — reads from a single constant:

```js
// js/00-config.js
TC.CONFIG = {
  AIRBNB_BASE: 'https://www.airbnb.co.in/',
  LISTING_ID : null,   // ← put your listing ID here
  SITE_URL   : 'https://the-cliffs.netlify.app',
};
```

`LISTING_ID` is the number in your listing URL: `airbnb.co.in/rooms/`**`12345678`**. Set it and
every CTA on the site points at your listing.

**Right now it's `null`, so all twelve buttons go to Airbnb's homepage.** That is the single most
important thing to fix. See [`CONTENT.md`](CONTENT.md) row B1.

### The booking bar

The bar across the bottom of the hero is not decoration. Whatever the visitor picks for check-in,
check-out and guests is appended to the Airbnb link:

```
https://www.airbnb.co.in/rooms/12345678?check_in=2026-11-14&check_out=2026-11-17&adults=4
```

Airbnb honours those parameters, so the listing opens with the search already filled in — which
converts better than dropping someone on a cold listing page.

It only works once `LISTING_ID` is set. Until then the bar still moves and still links to Airbnb,
it just can't carry dates to a listing that isn't identified yet.

Three details worth not "simplifying" later:

- **It's a link, not a form.** No submit handler, so it works with JS disabled and opening a new
  tab never trips a popup blocker.
- **Check-out is floored to the day after check-in.** Move check-in past check-out and check-out
  follows; there is no way to build a zero-night stay.
- **Dates are formatted from local date parts, not `toISOString()`.** `toISOString()` converts to
  UTC, so anywhere east of Greenwich local midnight lands on the previous day. In IST that made
  every date one day early.

---

## Before you publish

Read [`CONTENT.md`](CONTENT.md). It's the launch gate.

The short version: there was no property brief, no photographs and no listing when this was
built, so **every fact on the page is invented** — suite names, guest counts, drive times,
elevation, amenities, the lot. It reads as true because that's what makes a page persuasive. It
isn't true yet.

Two things in particular:

1. **The interior photographs are of a different hotel** — Amantaka in Luang Prabang, Laos.
   Properly licensed and credited, and still somebody else's building. Replace them.
2. **Photo attribution has to stay visible** while any placeholder image remains. That's the
   CC BY-SA licence condition, and the footer link to [`CREDITS.md`](CREDITS.md) satisfies it.

---

## Checking your work

Add `?audit=1` to the URL — `index.html?audit=1` — and open the console. It reports:

- images whose `data-slot` has no manifest entry, and manifest entries with no image
- any `<img>` missing `alt`, `width`, `height`, or `loading`
- any CTA whose `href` disagrees with the config, or is missing `target` / `rel`
- any `TKTK` placeholder text still on the page

It costs nothing when the flag is absent.

Also worth testing: disable JavaScript (everything must still be visible and every link must
still work), and turn on *Reduce motion* in your OS (all animation should stop, nothing should
disappear).

---

## Layout

```
index.html          the whole site — 8 sections
css/01-tokens.css   every colour, size and font. Nothing else defines a hex value.
css/02-base.css     reset, landmarks, focus rings, reduced-motion
css/03-layout.css   containers and grids
css/04-components.css   nav, buttons, cards, gallery, lightbox, accordion, footer
css/05-sections.css     the 8 sections
css/06-motion.css       scroll reveals, the elevation spine, the mist
js/00-config.js     ← the Airbnb link
js/…                nav, ascent, reveals, motion, gallery, CTAs
js/99-audit.js      the ?audit=1 checker
assets/images/      41 photographs + MANIFEST.md
```

The numeric prefixes are the cascade order — with no bundler, the filename is what enforces it.
Load them in order.

**To change the look, start with `css/01-tokens.css`.** Every colour, type size, spacing step and
corner radius on the site resolves from that one file.

---

## Post-launch

**Convert the images to WebP.** They're JPEG because the machine this was built on had no
encoder. `cwebp -q 78` over `assets/images/`, then swap `.jpg` → `.webp` in `index.html`. About
60% off the page weight for ten minutes of work. Details in
[`assets/images/MANIFEST.md`](assets/images/MANIFEST.md).

**Self-host the fonts.** Once you're on a real domain the `file://` CORS problem is gone. Download
the Lora and Instrument Sans WOFF2 files, serve them from `assets/fonts/`, and add
`<link rel="preload" as="font" crossorigin>`. Removes two DNS lookups and two TLS handshakes from
the critical path.
