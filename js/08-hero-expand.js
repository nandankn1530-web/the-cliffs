/* ============================================================================
   08-hero-expand.js — the hero reveal

   A vanilla port of the "scroll expansion hero" pattern. As you scroll, the
   background landscape recedes, the property photograph opens out of it, and
   the headline parts to either side.

   Two deliberate departures from the React original:

   1. No scroll hijacking. The original bound a non-passive `wheel` handler,
      called preventDefault on every tick and forced scrollTo(0, 0) until the
      expansion finished. That accumulates progress from wheel deltas, which
      means keyboard scrolling, dragging the scrollbar, Page Down, Home/End
      and find-in-page all stop working, and it fights the smooth-scroll
      library this site already loads. Here the effect is driven by a tall
      track with a sticky stage, so progress is read from real scroll
      position. Every input method works, and nothing is intercepted.

   2. All interpolation lives in CSS. This file writes exactly one custom
      property, --p (0 → 1). Every width, opacity and translate is a calc()
      in 05-sections.css, so the visual tuning is where the rest of the design
      is, and the JS stays a scroll listener and one style write.

   --p defaults to 1 in CSS, so with JS disabled or motion reduced the hero
   renders fully open rather than stuck at the closed state.
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  function init() {
    var hero  = document.getElementById('hero');
    var track = hero && hero.querySelector('.hero__track');
    if (!hero || !track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.style.setProperty('--p', '1');
      return;
    }

    var ticking = false;
    var last = -1;

    function update() {
      ticking = false;

      /* Distance the track can travel before the sticky stage unpins. */
      var span = track.offsetHeight - window.innerHeight;
      var p = span > 0
        ? Math.min(1, Math.max(0, -track.getBoundingClientRect().top / span))
        : 1;

      /* Three decimals is past the point of visible difference, and it keeps
         us from writing a style on every frame during slow scrolls. */
      var rounded = Math.round(p * 1000) / 1000;
      if (rounded === last) return;
      last = rounded;

      hero.style.setProperty('--p', rounded);
      hero.classList.toggle('is-open', rounded > 0.99);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

})(window.TC);
