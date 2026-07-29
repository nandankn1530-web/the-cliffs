/* ============================================================================
   05-motion.js — the mobile CTA bar, and the experiences-rail autoplay
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  /* ── On smooth scrolling ──────────────────────────────────────────────────
     There was a Lenis (JS smooth-scroll) integration here. It is gone, and
     that is deliberate.

     Every JS smooth-scroll works the same way: it swallows the native scroll
     and re-drives scrollTop itself, one animation frame behind your input.
     Tuned well it feels expensive; tuned at all it still cannot be as
     immediate as the compositor-driven scrolling the browser does off the
     main thread. And when anything else on the page occupies the main
     thread, the interpolation stalls while native scrolling would not — so
     the very thing added for smoothness becomes the thing that stutters.

     Native scrolling is smooth. `scroll-behavior: smooth` in 02-base.css
     still eases the anchor-link jumps, which is the one place a tween
     genuinely helps.                                                       */

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

  /* ── Experiences rail autoplay ────────────────────────────────────────────
     The rail (04-components.css) is a real native scroll-snap carousel —
     drag, swipe, wheel and arrow keys all work with JS disabled. What it
     didn't have was motion of its own: nothing moved until a visitor
     physically dragged it, which reads as "stuck" to anyone who never tries.

     This drifts it sideways on its own — slow, continuous, no fixed
     duration — and reverses direction at each end rather than jump-cutting
     back to the start, since there are only five cards and no duplicated
     set to loop over seamlessly. Any real input (pointer, touch, wheel,
     keyboard) pauses it immediately and hands control back for a couple of
     seconds before it resumes, so it never fights a visitor trying to
     browse at their own pace. */
  function initRailAutoplay() {
    var rail = document.querySelector('.rail');
    if (!rail) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var SPEED     = 34;    /* px per second */
    var RESUME_MS = 2200;  /* pause length after a one-off nudge */

    var direction   = 1;
    var nudged      = false;  /* transient: a drag/wheel/keypress just happened */
    var held        = false;  /* sticky: pointer is over it, or focus is inside */
    var inView      = true;
    var resumeTimer = null;
    var last        = null;

    function snapOn()  { rail.style.scrollSnapType = ''; }      /* back to the stylesheet's mandatory */
    function snapOff() { rail.style.scrollSnapType = 'none'; }  /* a continuous drift would fight snap points */

    /* Sticky hold. Hovering or tabbing in means the visitor is reading this
       card *now* — sliding it out from under them is the single most
       irritating thing an autoplaying carousel can do. Nothing resumes until
       they actually leave. */
    function hold()    { held = true; snapOn(); }
    function release() { held = false; last = null; if (!nudged) snapOff(); }

    /* Hover-hold only where hover is real. Touch browsers fire a synthetic
       mouseenter on tap, and the matching mouseleave may never arrive — that
       would latch `held` on and strand the rail for the rest of the visit.
       Focus is bound unconditionally: it is the keyboard path, and it always
       pairs correctly. */
    if (window.matchMedia('(hover: hover)').matches) {
      rail.addEventListener('mouseenter', hold);
      rail.addEventListener('mouseleave', release);
    }
    rail.addEventListener('focusin', hold);
    rail.addEventListener('focusout', release);

    /* Transient nudge — a wheel tick or swipe that doesn't leave the pointer
       resting on the rail. Gives control back for a beat, then resumes. */
    function nudge() {
      nudged = true;
      snapOn();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(function () {
        nudged = false;
        last = null; /* re-baseline dt so the pause isn't counted as travel */
        if (!held) snapOff();
      }, RESUME_MS);
    }

    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(function (evt) {
      rail.addEventListener(evt, nudge, { passive: true });
    });

    /* Don't spend a rAF loop scrolling something nobody can see */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
      }, { threshold: 0.1 }).observe(rail);
    }

    function tick(time) {
      requestAnimationFrame(tick);
      if (last === null) { last = time; return; }
      var dt = (time - last) / 1000;
      last = time;

      if (nudged || held || !inView) return;

      var max = rail.scrollWidth - rail.clientWidth;
      if (max <= 0) return;

      var next = rail.scrollLeft + direction * SPEED * dt;
      if (next >= max) { next = max; direction = -1; }
      else if (next <= 0) { next = 0; direction = 1; }
      rail.scrollLeft = next;
    }

    snapOff();
    requestAnimationFrame(tick);
  }

  function init() {
    initMobileBar();
    initRailAutoplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

})(window.TC);
