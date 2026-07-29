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

    /* duration+easing runs a fixed-length tween per scroll gesture, and this
       curve (like most "expensive" ease-outs) starts at near-zero velocity —
       maybe 50ms of almost no visible movement before it accelerates. A
       trackpad or wheel fires a new gesture every couple of frames, so that
       slow-start replays constantly, and it reads as "I scrolled and nothing
       happened for a beat" rather than as smoothing. lerp mode has no such
       thing: every frame moves the visible position a fixed fraction of the
       remaining distance toward the input, so it starts responding on the
       very next frame and never re-plays a launch animation. Higher lerp =
       tighter tracking to the input; 0.15 is smoothed but not delayed. */
    var lenis = new window.Lenis({
      lerp: 0.15,
      wheelMultiplier: 1,
      smoothWheel: true
    });

    /* Lenis's docs call this out explicitly: native CSS smooth-scrolling and
       Lenis both try to own the scroll position, and running both at once is
       a documented source of stutter — two easing curves fighting over the
       same scrollTop. `scroll-behavior: smooth` in 02-base.css stays as the
       fallback for no-JS, reduced-motion and touch (where Lenis never
       starts); it only steps aside once Lenis is confirmed running. */
    document.documentElement.classList.add('has-lenis');

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
