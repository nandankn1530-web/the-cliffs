/* ============================================================================
   07-cta.js — binds every [data-cta] to the single config URL
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  /* Every CTA also carries the literal href in the HTML. That is deliberate,
     not redundant:

       hardcoded href → works with JS off, is visible to search and social
                        crawlers (which do not run scripts), and never shows
                        a dead link mid-load.
       JS rewrite     → one edit in 00-config.js updates all twelve, even if
                        an HTML instance was missed.

     99-audit.js flags any hardcoded href that disagrees with the config. */

  function bind() {
    var url  = TC.airbnbUrl();
    var ctas = document.querySelectorAll('[data-cta]');

    Array.prototype.forEach.call(ctas, function (el) {
      if (el.tagName !== 'A') return;

      el.href = url;
      el.target = '_blank';

      /* noopener without noreferrer: severing the opener is a security
         requirement, but the referrer is how the host sees where their
         bookings came from. Dropping it would throw that away. */
      el.rel = 'noopener';

      el.addEventListener('click', function () {
        if (window.dataLayer && typeof window.dataLayer.push === 'function') {
          window.dataLayer.push({
            event: 'airbnb_cta_click',
            placement: el.getAttribute('data-cta')
          });
        }
      });
    });
  }

  /* ── Booking bar ────────────────────────────────────────────────────────
     Turns the hero's check-in / check-out / guests values into Airbnb query
     params, so the listing opens with the search already filled in.

     The action is a real <a>, not a submit button, for two reasons: it works
     with JS disabled (falling back to the plain listing URL), and opening a
     new tab from a genuine link never trips a popup blocker.               */

  function initCheckbar() {
    var bar = document.querySelector('.checkbar');
    if (!bar) return;

    var inEl  = bar.querySelector('[data-checkbar="in"]');
    var outEl = bar.querySelector('[data-checkbar="out"]');
    var gEl   = bar.querySelector('[data-checkbar="guests"]');
    var go    = bar.querySelector('[data-checkbar="go"]');
    if (!go) return;

    /* Local date parts, not toISOString(). toISOString() converts to UTC, so
       anywhere east of Greenwich local midnight lands on the previous day —
       in IST (+5:30) every date came out one day early, which pushed the
       check-out floor back onto the check-in date and allowed a zero-night
       stay. `<input type="date">` values are already local ISO strings, so
       this is the format to match. */
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function iso(d) {
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }

    function addDays(dateStr, n) {
      var d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d)) return null;
      d.setDate(d.getDate() + n);
      return iso(d);
    }

    /* No one books yesterday. */
    var today = iso(new Date());
    if (inEl) inEl.min = today;
    if (outEl) outEl.min = addDays(today, 1);

    function sync() {
      /* Check-out must follow check-in. Rather than validating after the
         fact, move the floor and drag an now-invalid value along with it. */
      if (inEl && outEl && inEl.value) {
        var floor = addDays(inEl.value, 1);
        outEl.min = floor;
        if (outEl.value && outEl.value <= inEl.value) outEl.value = floor;
      }

      var opts = {};
      if (inEl && inEl.value)  opts.checkIn  = inEl.value;
      if (outEl && outEl.value) opts.checkOut = outEl.value;
      if (gEl && gEl.value)     opts.adults   = gEl.value;

      go.href = TC.airbnbUrl(opts);
    }

    [inEl, outEl, gEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener('change', sync);
      el.addEventListener('input', sync);

      /* Enter inside a field should do what it looks like it does. */
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); sync(); go.click(); }
      });
    });

    sync();
  }

  function start() { bind(); initCheckbar(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})(window.TC);
