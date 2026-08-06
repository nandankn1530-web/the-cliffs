/* ============================================================================
   08-hero-scroll.js — the hero parallax

   A vanilla port of the GSAP/ScrollTrigger parallax: a sticky stage whose
   four planes travel different distances as it is scrolled past. This file
   supplies one number, --hp (0 → 1); 05-sections.css turns that into the
   per-plane distances.

   Four deliberate departures from the reference component:

   1. No GSAP and no ScrollTrigger. They are ~70KB gzipped to schedule four
      transforms against scroll position, which is the one thing a scroll
      listener already does. Keeping the interpolation in calc() also keeps
      the composition next to the rest of the design rather than buried in
      a timeline.

   2. No Lenis. It was in this codebase and was removed on purpose: every
      JS smooth-scroll re-drives scrollTop a frame behind the input, and
      when anything occupies the main thread the interpolation stalls where
      native scrolling would not. Re-adding it would bring back the exact
      "scroll gets stuck" this project has already fixed once.

   3. The photograph stays an <img> with srcset, not a CSS background-image.
      It is the LCP element: as an <img> the preload scanner finds it during
      HTML tokenisation and it picks a resolution to match the device. A
      background-image is invisible to the preload scanner and always ships
      the same file.

   4. Progress is rounded before it is written. Three decimals is past the
      point of visible difference in a transform, and it avoids a style
      write on frames where nothing would change.

   --hp defaults to 0 in CSS — the scene at rest — so with scripts disabled
   or motion reduced the hero is a still photograph with the name on it,
   rather than a half-drifted composition.
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  function init() {
    var hero  = document.getElementById('hero');
    var track = hero && hero.querySelector('.hero__track');
    var stage = hero && hero.querySelector('.hero__stage');
    if (!hero || !track || !stage) return;

    /* Reduced motion: leave --hp at its CSS default of 0, which is the scene
       already composed — the planes simply never separate. The CSS also
       collapses the track, so there is no pinned dead scroll to sit through
       either. Writing a value here would be wrong as well as unnecessary:
       1 is the fully-drifted state, not the resting one. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;
    var last = -1;

    function update() {
      ticking = false;

      /* Distance the track can travel before the sticky stage unpins. */
      var span = track.offsetHeight - window.innerHeight;
      var p = span > 0
        ? Math.min(1, Math.max(0, -track.getBoundingClientRect().top / span))
        : 1;

      var rounded = Math.round(p * 1000) / 1000;
      if (rounded === last) return;
      last = rounded;

      stage.style.setProperty('--hp', rounded);
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
