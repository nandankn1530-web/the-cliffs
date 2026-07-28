/* ============================================================================
   00-config.js — The Cliffs
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════
     THE ONLY PLACE THE AIRBNB LINK IS DEFINED

     LISTING_ID is null, so every one of the twelve CTAs on this site
     currently sends visitors to Airbnb's HOMEPAGE — a generic search page,
     not this property.

     Fix: take the number out of your listing URL
         https://www.airbnb.co.in/rooms/12345678
                                       ^^^^^^^^
     and set it below. Nothing else needs to change.

     See CONTENT.md row B1.
     ══════════════════════════════════════════════════════════════════════ */

  TC.CONFIG = {
    AIRBNB_BASE: 'https://www.airbnb.co.in/',
    LISTING_ID:  null,                              // ← set this
    SITE_URL:    'https://the-cliffs.netlify.app'   // ← set after first deploy
  };

  /**
   * Build the Airbnb URL every CTA points at.
   *
   * Once LISTING_ID is set you can also pass check-in/check-out/guest values —
   * Airbnb honours them as query params and a pre-filled search converts
   * measurably better than a cold listing page.
   *
   * @param {{checkIn?:string, checkOut?:string, adults?:number}} [opts]
   * @returns {string}
   */
  TC.airbnbUrl = function (opts) {
    var c = TC.CONFIG;

    if (!c.LISTING_ID) return c.AIRBNB_BASE;

    var url = c.AIRBNB_BASE.replace(/\/+$/, '') + '/rooms/' + c.LISTING_ID;
    if (!opts) return url;

    var q = [];
    if (opts.checkIn)  q.push('check_in='  + encodeURIComponent(opts.checkIn));
    if (opts.checkOut) q.push('check_out=' + encodeURIComponent(opts.checkOut));
    if (opts.adults)   q.push('adults='    + encodeURIComponent(opts.adults));

    return q.length ? url + '?' + q.join('&') : url;
  };

  /** True while the listing is unset — the audit uses this to warn loudly. */
  TC.isPlaceholderUrl = function () {
    return !TC.CONFIG.LISTING_ID;
  };

})(window.TC);
