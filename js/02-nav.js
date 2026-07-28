/* ============================================================================
   02-nav.js — sticky nav state and scrollspy
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  function init() {
    var nav   = document.getElementById('nav');
    var links = document.querySelectorAll('.nav__link');
    if (!nav) return;

    /* --- Solid background once the page has moved -------------------------
       A 1px sentinel at the top of the document is cheaper and smoother than
       a scroll handler: the observer fires twice in the page's whole life. */

    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none';
    document.body.prepend(sentinel);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
      }).observe(sentinel);
    }

    /* --- Scrollspy --------------------------------------------------------
       rootMargin pins the "active" band to roughly the upper third of the
       viewport, so the highlighted link matches what the reader is looking
       at rather than whatever happens to touch the top edge. */

    var targets = [];
    Array.prototype.forEach.call(links, function (link) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var el = document.querySelector(id);
      if (el) targets.push({ el: el, link: link });
    });

    if (!targets.length || !('IntersectionObserver' in window)) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = targets.filter(function (t) { return t.el === entry.target; })[0];
        if (!match) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          match.link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    targets.forEach(function (t) { spy.observe(t.el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

})(window.TC);
