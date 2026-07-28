/* ============================================================================
   05-motion.js — Lenis smooth scroll, and the mobile CTA bar
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  function initLenis() {
    /* Four guards, all of them load-bearing:

       reduced motion  — smooth scrolling is motion, and some people get
                         motion sick from it.
       pointer: fine   — never on touch. iOS momentum scrolling is better
                         than any JS emulation of it, and hijacking it feels
                         broken on a phone.
       window.Lenis    — if the CDN is blocked or down, native scrolling just
                         carries on. That is the whole reason for choosing a
                         library that drives real scrollTop rather than
                         transforming a wrapper: sticky positioning, anchor
                         links, scroll-driven CSS and find-in-page all keep
                         working when it isn't there. */

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (typeof window.Lenis !== 'function') return;

    var lenis = new window.Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      wheelMultiplier: 0.9,
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    TC.lenis = lenis;
  }

  function initMobileBar() {
    var bar = document.querySelector('[data-mobile-bar]');
    var hero = document.getElementById('hero');
    var book = document.getElementById('book');
    if (!bar || !hero || !('IntersectionObserver' in window)) return;

    var pastHero = false;
    var onFinal  = false;

    function apply() {
      /* Hidden over the final section on purpose. Two competing primary
         buttons on one screen reads as desperate and measurably lowers
         click-through on both. */
      bar.classList.toggle('is-visible', pastHero && !onFinal);
    }

    new IntersectionObserver(function (e) {
      pastHero = !e[0].isIntersecting;
      apply();
    }, { threshold: 0 }).observe(hero);

    if (book) {
      new IntersectionObserver(function (e) {
        onFinal = e[0].isIntersecting;
        apply();
      }, { threshold: 0.25 }).observe(book);
    }

    /* Keep the footer clear of the bar without a layout jump */
    var pad = bar.offsetHeight;
    document.body.style.paddingBottom = pad + 'px';
    var mq = window.matchMedia('(min-width: 720px)');
    function syncPad() { document.body.style.paddingBottom = mq.matches ? '' : pad + 'px'; }
    syncPad();
    if (mq.addEventListener) mq.addEventListener('change', syncPad);
  }

  function init() {
    initLenis();
    initMobileBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

})(window.TC);
