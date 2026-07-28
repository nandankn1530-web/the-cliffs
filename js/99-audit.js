/* ============================================================================
   99-audit.js — dev-only checker. Runs when the URL has ?audit=1.

   Costs one string comparison when the flag is absent.

   It catches the things that are invisible in a browser but expensive in
   production: an image slot that drifted out of the manifest, a missing
   width/height (layout shift), a CTA pointing somewhere unintended, or a
   TKTK placeholder that made it to launch.
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  if (window.location.search.indexOf('audit=1') === -1) return;

  function run() {
    var problems = 0;
    var group = function (label) { console.group('%c' + label, 'font-weight:600'); };

    console.log('%cThe Cliffs — audit', 'font:600 15px/1.4 system-ui; color:#3D4A3F');

    /* ── 1. Listing URL ───────────────────────────────────────────────── */
    group('Airbnb link');
    if (TC.isPlaceholderUrl && TC.isPlaceholderUrl()) {
      problems++;
      console.warn(
        'LISTING_ID is null — all CTAs point at the Airbnb HOMEPAGE, not this ' +
        'property. Set it in js/00-config.js. (CONTENT.md row B1)'
      );
    } else {
      console.log('✓ ' + TC.airbnbUrl());
    }
    console.groupEnd();

    /* ── 2. Slots vs manifest, both directions ────────────────────────── */
    group('Image slots');
    var domSlots = {};
    var slotted = document.querySelectorAll('[data-slot]');
    Array.prototype.forEach.call(slotted, function (el) {
      domSlots[el.getAttribute('data-slot')] = true;
    });

    Object.keys(domSlots).forEach(function (slot) {
      if (!TC.IMAGES || !TC.IMAGES[slot]) {
        problems++;
        console.warn('In the page but not in the manifest: ' + slot);
      }
    });
    Object.keys(TC.IMAGES || {}).forEach(function (slot) {
      if (!domSlots[slot] && slot !== 'og-cover') {
        console.info('In the manifest but unused in the page: ' + slot);
      }
    });
    console.log(Object.keys(domSlots).length + ' slots in the page');
    console.groupEnd();

    /* ── 3. Image hygiene ─────────────────────────────────────────────── */
    group('Images');
    /* The lightbox image is swapped at runtime, sits outside the document
       flow and is sized by object-fit — width/height and lazy do not apply. */
    var imgs = document.querySelectorAll('img:not(.lightbox__img)');
    Array.prototype.forEach.call(imgs, function (im) {
      var where = im.getAttribute('data-slot') || im.currentSrc || im.src || '(inline)';

      if (im.getAttribute('alt') === null) {
        problems++;
        console.warn('Missing alt (empty alt="" is fine, absent is a bug): ' + where);
      }
      if (!im.getAttribute('width') || !im.getAttribute('height')) {
        problems++;
        console.warn('Missing width/height — causes layout shift: ' + where);
      }
      /* The hero must not be lazy: it is the LCP candidate and is preloaded. */
      var isHero = im.getAttribute('data-slot') === 'hero-cloudline';
      if (!isHero && im.loading !== 'lazy') {
        console.warn('Below the fold but not lazy: ' + where);
      }
      if (isHero && im.loading === 'lazy') {
        problems++;
        console.warn('The hero is lazy-loaded — this defeats the preload.');
      }
      /* Over-serving: rendered much smaller than the file actually is */
      if (im.naturalWidth && im.clientWidth && im.naturalWidth > im.clientWidth * 2.2) {
        console.info(
          'Over-served (' + im.naturalWidth + 'px file rendered at ' +
          im.clientWidth + 'px): ' + where
        );
      }
    });
    console.groupEnd();

    /* ── 4. CTAs ──────────────────────────────────────────────────────── */
    group('CTAs');
    var expected = TC.airbnbUrl();
    var ctas = document.querySelectorAll('[data-cta]');
    Array.prototype.forEach.call(ctas, function (a) {
      var name = a.getAttribute('data-cta');
      if (a.getAttribute('href') !== expected) {
        problems++;
        console.warn('href disagrees with config [' + name + ']: ' + a.getAttribute('href'));
      }
      if (a.target !== '_blank') {
        problems++;
        console.warn('Missing target="_blank" [' + name + ']');
      }
      if (a.rel.indexOf('noopener') === -1) {
        problems++;
        console.warn('Missing rel="noopener" [' + name + ']');
      }
      if (a.rel.indexOf('noreferrer') !== -1) {
        console.warn(
          'rel includes noreferrer [' + name + '] — this hides the referrer ' +
          'from Airbnb, so the host loses attribution for their own traffic.'
        );
      }
    });
    console.log(ctas.length + ' CTAs (expected 12)');
    if (ctas.length !== 12) console.warn('CTA count is not 12.');
    console.groupEnd();

    /* ── 5. Placeholder text ──────────────────────────────────────────── */
    group('Placeholder copy');
    var body = document.body.innerText || '';
    var hits = body.match(/TKTK|LOREM|\bXXX\b/gi);
    if (hits) {
      problems += hits.length;
      console.warn(hits.length + ' placeholder token(s) still on the page: ' + hits.join(', '));
    } else {
      console.log('✓ no TKTK tokens');
    }
    console.groupEnd();

    /* ── 6. Structure ─────────────────────────────────────────────────── */
    group('Structure');
    var h1s = document.querySelectorAll('h1');
    if (h1s.length !== 1) { problems++; console.warn('Expected exactly one <h1>, found ' + h1s.length); }
    var sections = document.querySelectorAll('main > section');
    console.log(sections.length + ' sections (expected 8)');
    Array.prototype.forEach.call(sections, function (s) {
      if (!s.getAttribute('aria-labelledby')) {
        problems++;
        console.warn('Section without aria-labelledby: #' + (s.id || '(no id)'));
      }
    });
    console.groupEnd();

    console.log(
      problems === 0
        ? '%c✓ clean'
        : '%c' + problems + ' problem(s) — see above',
      'font:600 14px system-ui; color:' + (problems ? '#a4442f' : '#3D4A3F')
    );
  }

  if (document.readyState === 'complete') { run(); }
  else { window.addEventListener('load', run); }

})(window.TC);
