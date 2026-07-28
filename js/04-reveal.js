/* ============================================================================
   04-reveal.js — scroll reveals

   One observer for the whole page. Elements are unobserved the moment they
   reveal, so the observed set only ever shrinks — by the time a visitor
   reaches the footer there is nothing left to watch.

   JS owns the class toggle and nothing else. All timing, easing and
   staggering lives in CSS (`--i` is set inline in the HTML), which keeps
   motion tunable from 06-motion.css without touching a script.
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  function init() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Safety net: if the API is missing or motion is suppressed, show
       everything immediately. Content must never be trapped at opacity 0. */
    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        obs.unobserve(el);

        /* Drop the compositor hint once the transition is done. Leaving
           will-change on would keep a layer alive for every revealed element
           for the life of the page. */
        window.setTimeout(function () { el.style.willChange = ''; }, 1500);
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.15
    });

    Array.prototype.forEach.call(items, function (el) {
      el.style.willChange = 'opacity, transform';
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

})(window.TC);
