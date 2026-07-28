/* ============================================================================
   03-ascent.js — the elevation spine

   The signature. As you scroll, the readout climbs from 840 m at the hero to
   1,420 m at the booking CTA, and a brass hairline fills down the left edge.

   Two deliberate cheapnesses:

   1. The number is rounded to the nearest 10 m, so it changes maybe sixty
      times over the whole page instead of on every frame. Writing to a text
      node forces layout; doing that at 60fps for a decorative counter would
      be indefensible.
   2. Progress is written to a CSS custom property and the fill is a scaleY
      transform, which stays on the compositor.

   The spine is aria-hidden. A screen reader announcing a number that ticks
   as you scroll is pure noise.
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  var BASE = 840;
  var PEAK = 1420;

  function init() {
    var spine   = document.querySelector('.spine');
    var readout = document.querySelector('[data-ascent-readout]');
    if (!spine || !readout) return;

    var fill = spine.querySelector('.spine__fill');
    var hero = document.getElementById('hero');
    var darkSections = document.querySelectorAll('.section[data-theme="dark"]');
    var ticking = false;
    var lastShown = -1;

    function update() {
      ticking = false;

      var max = document.documentElement.scrollHeight - window.innerHeight;
      var progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      spine.style.setProperty('--ascent-progress', progress.toFixed(4));
      if (fill) fill.style.transform = 'scaleY(' + progress.toFixed(4) + ')';

      var metres = Math.round((BASE + (PEAK - BASE) * progress) / 10) * 10;
      if (metres !== lastShown) {
        lastShown = metres;
        readout.textContent = metres.toLocaleString('en-IN') + ' M';
      }

      /* Flip the readout's colours when it sits over a dark section, or it
         disappears into the background. */
      var mid = window.innerHeight / 2;
      var overDark = false;
      Array.prototype.forEach.call(darkSections, function (s) {
        var r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) overDark = true;
      });
      spine.classList.toggle('is-over-dark', overDark);

      /* Hidden while the hero card owns the screen — see 06-motion.css. */
      if (hero) {
        var h = hero.getBoundingClientRect();
        spine.classList.toggle('is-hidden', h.bottom > window.innerHeight * 0.5);
      }
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
