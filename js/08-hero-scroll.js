/* ============================================================================
   08-hero-scroll.js — the hero window

   A vanilla port of the "smooth scroll hero" pattern: a sticky stage whose
   photograph is masked to a centred window, and the window widens to the
   full viewport as you scroll.

   Three deliberate departures from the React original:

   1. No framer-motion, and no library at all. The original drove a
      clip-path through four useTransform hooks and a motion template,
      re-rendering a component on every scroll frame. Here the whole
      interpolation is calc() in 05-sections.css and this file writes one
      custom property, so scrolling costs a single style write and the
      visual tuning lives with the rest of the design.

   2. The photograph stays an <img> with srcset, not a CSS background-image
      on two divs. It is the LCP element: as an <img> it is found by the
      preload scanner during HTML tokenisation and it picks a resolution to
      match the device. A background-image is invisible to the preload
      scanner and always the same file, and the original needed two of them
      (one per breakpoint) to do what one srcset does properly.

   3. Progress is rounded before it is written. Three decimals is past the
      point of visible difference in a clip-path and it keeps us from
      writing a style on every frame during slow scrolls.

   --hp defaults to 1 in CSS and is only set to 0 under `.js`, so with
   scripts disabled or motion reduced the hero renders fully open rather
   than stuck as a small closed window.
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  function init() {
    var hero  = document.getElementById('hero');
    var track = hero && hero.querySelector('.hero__track');
    var stage = hero && hero.querySelector('.hero__stage');
    if (!hero || !track || !stage) return;

    /* Reduced motion gets the open state immediately. The CSS also collapses
       the track, so there is no pinned dead scroll to sit through either. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stage.style.setProperty('--hp', '1');
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
