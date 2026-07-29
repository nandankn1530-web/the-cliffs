# Image manifest

**The filename is the slot name.** Every image is `{slot}-{width}.jpg`, and the width in the
filename is the real pixel width — `srcset` descriptors depend on that being true.

## How to replace a photo

Drop a file with the same name into this folder. **No code changes.** For example, to replace
the hero, save your photograph as `hero-cloudline-1920.jpg` (and `hero-cloudline-1280.jpg` for
the smaller variant) and you're done.

If your photo is a different width, rename it to match its real width *and* update the `srcset`,
`width` and `height` attributes on that `<img>` in `index.html`. Keeping to 960 / 1280 / 1920 is
easier — those are the widths the layout is built around.

Attribution for every current photo lives in [`CREDITS.md`](../../CREDITS.md). All of it is
placeholder photography; see [`CONTENT.md`](../../CONTENT.md) rows B2 and B3.

## Alt text policy

- **Informative** — suites, gallery, location. Describes what a booker needs to know.
- **Atmospheric** — hero, full-bleed bands. Mood and subject, ≤125 characters. Never "Image of…".
- **Decorative** — `alt=""`. An empty alt is correct; a *missing* alt is a bug the audit flags.

---

## Slots

| Slot | Widths | Native | Used in | Alt class | Replacement note |
|---|---|---|---|---|---|
| `hero-cloudline` | 1280 · 1920 | 1920×1280 | §1 hero **background**, preloaded | atmospheric | The single most important shot. Wants a wide, layered view with cloud actually moving through the ridges — not a clear-day panorama. Landscape, 3:2 minimum. |
| `place-road` | 1280 | 1280×853 | §2 The Place | atmospheric | The approach road. Should feel like arriving, not like a landscape. |
| `place-band` | 1920 | 1920×1280 | §2 pinned band | atmospheric | Full-bleed band. Needs to work cropped very wide. |
| `location-ridges` | 1920 | 1920×1080 | §6 Location | informative | Show the actual terrain guests will drive through. |
| `book-dusk` | 1280 · 1920 | 1920×1446 | §8 final CTA, behind scrim | **decorative** (`alt=""`) | Dusk. Text sits on top, so keep the upper third simple and avoid a bright sky behind the headline. Alt is empty on purpose — the heading already says what the section is, and a description read out over the booking button is noise. |
| `suite-canopy` | 1280 · 1920 | 1920×1280 | §3 The Canopy Suite | informative | ⚠️ Amantaka, Laos. Replace with the real suite: bed, window, and the view in one frame. |
| `suite-veranda` | 1280 · 1920 | 1920×1280 | §3 The Long Room | informative | ⚠️ Amantaka, Laos. |
| `suite-bath` | 1280 · 1920 | 1920×1280 | §3 The Rain Room | informative | ⚠️ Amantaka, Laos. |
| `exp-tea` | 1920 | 1920×839 | §4 rail panel | atmospheric | Ultra-wide (2.29:1) — chosen because the rail panel is letterboxed. |
| `exp-trogon` | 1280 | 1280×853 | §4 rail panel | informative | Malabar Trogon. Any Ghats endemic works; keep the shallow depth of field. |
| `exp-waterfall` | 1280 | 1280×853 | §4 rail panel | atmospheric | |
| `exp-coffee` | 1280 | 1280×853 | §4 rail panel | informative | South Indian filter coffee. |
| `exp-spa` | 1280 | 1280×853 | §4 rail panel | informative | ⚠️ Amantaka, Laos. |
| `gallery-cliff-figure` | 960 · 1920 | 1920×1080 | §5 mosaic, feature cell | atmospheric | **The anchor image** — a lone figure on a clifftop at dusk. Whatever replaces it must carry the same "this is the edge" feeling; the gallery is built around it. |
| `gallery-mist-layers` | 960 · 1920 | 1920×1446 | §5 mosaic | atmospheric | |
| `gallery-suite-bed` | 960 · 1920 | 1920×1440 | §5 mosaic | informative | ⚠️ Amantaka, Laos. |
| `gallery-lounge-dusk` | 960 · 1920 | 1920×1371 | §5 mosaic | informative | ⚠️ Amantaka, Laos. |
| `gallery-library` | 960 · 1920 | 1920×1280 | §5 mosaic | informative | ⚠️ Amantaka, Laos. |
| `gallery-table` | 960 · 1920 | 1920×1280 | §5 mosaic | informative | ⚠️ Amantaka, Laos. |
| `gallery-pool` | 960 · 1920 | 1920×1280 | §5 mosaic | informative | ⚠️ Amantaka, Laos. |
| `gallery-spices` | 960 · 1920 | 1920×1280 | §5 mosaic | informative | |
| `gallery-ponmudi` | 960 · 1920 | 1920×1277 | §5 mosaic | atmospheric | |
| `gallery-sunrise` | 960 · 1920 | 1920×1440 | §5 mosaic | atmospheric | |
| `gallery-shola` | 960 · 1920 | 1920×1280 | §5 mosaic | atmospheric | Shola forest — the cloud-forest ecosystem the Ghats are known for. |
| `og-cover` | 1280 | 1280×853 | `og:image` only | — | Never rendered on the page. Social previews crop to roughly 1.91:1, so keep the subject centred. |

**960 = gallery thumbnail · 1280 = page image · 1920 = lightbox and full-bleed.**

---

## Known limitation: JPEG only

There is no WebP or AVIF encoder on the machine this site was built on, so every image ships as
JPEG. Total weight is about 15 MB — roughly 2.5× what WebP would cost.

Only the hero loads eagerly (460 KB at 1920, 214 KB at 1280). Everything else is lazy, and
lightbox images are fetched on click. So the page *feels* fast, but the numbers are worse than
they need to be.

**Fix before launch:**

```
cwebp -q 78 input.jpg -o output.webp     # per file
```

or drag the folder into [squoosh.app](https://squoosh.app). Then change `.jpg` → `.webp` in
`index.html`. Roughly a 60% reduction, no layout change.
