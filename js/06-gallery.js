/* ============================================================================
   06-gallery.js — filter pills and the lightbox

   The lightbox is the most accessibility-sensitive component on the page:
   it takes over the viewport, so it has to trap focus, close on Escape, and
   put focus back where it came from. Getting any of those wrong strands a
   keyboard user inside a modal with no way out.
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  function init() {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    var items   = Array.prototype.slice.call(grid.querySelectorAll('.gallery__item'));
    var buttons = Array.prototype.slice.call(grid.querySelectorAll('.gallery__btn'));
    var status  = document.querySelector('[data-gallery-status]');

    /* ── Filters ──────────────────────────────────────────────────────── */

    var filters = document.querySelectorAll('.filter');

    /* 06-motion.css styles `.gallery__item.is-filtering` to shrink slightly as
       it fades — "a plain opacity drop reads as a rendering glitch". Nothing
       ever added that class, so the rule was dead and items just vanished the
       instant `hidden` was set. Now the class drives an exit transition and
       `hidden` is deferred until it finishes.

       Under reduced motion the exit is zero-length: 02-base.css pins these
       items to opacity 1, so waiting out a transition that cannot animate
       would just leave removed photographs on screen for 420ms. */
    var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var EXIT_MS  = reduced ? 0 : 420;   /* matches --dur-mid */

    function applyFilter(cat) {
      var shown = 0;

      items.forEach(function (item) {
        var itemCat = item.getAttribute('data-cat');
        /* The terminal Airbnb card has no data-cat and always stays. It is
           the point of the section, not a photograph to be filtered out. */
        var keep = !itemCat || cat === 'all' || itemCat === cat;
        if (keep && itemCat) shown++;

        /* Cleared every pass, or fast repeated filtering leaves a stale timer
           that hides a cell the newest filter just brought back. */
        window.clearTimeout(item._filterTimer);

        if (keep) {
          item.hidden = false;
          /* Next frame: the element needs a laid-out start state to animate
             from, which it does not have in the same tick as `hidden=false`. */
          requestAnimationFrame(function () { item.classList.remove('is-filtering'); });
        } else {
          var wasVisible = !item.hidden;
          item.classList.add('is-filtering');
          if (wasVisible && EXIT_MS) {
            item._filterTimer = window.setTimeout(function () { item.hidden = true; }, EXIT_MS);
          } else {
            item.hidden = true;   /* already gone, or motion is suppressed */
          }
        }
      });

      if (status) {
        status.textContent = cat === 'all'
          ? shown + ' photographs'
          : shown + ' photographs in this set';
      }
    }

    Array.prototype.forEach.call(filters, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(filters, function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        applyFilter(btn.getAttribute('data-filter'));
      });
    });

    /* ── Lightbox ─────────────────────────────────────────────────────── */

    var box     = document.querySelector('[data-lightbox]');
    if (!box) return;

    var img     = box.querySelector('[data-lb-img]');
    var caption = box.querySelector('[data-lb-caption]');
    var btnPrev = box.querySelector('[data-lb-prev]');
    var btnNext = box.querySelector('[data-lb-next]');
    var btnClose= box.querySelector('[data-lb-close]');

    var index = 0;
    var opener = null;
    var hideTimer = null;

    function visibleButtons() {
      return buttons.filter(function (b) {
        var li = b.closest('.gallery__item');
        return li && !li.hidden;
      });
    }

    function render(list) {
      var btn  = list[index];
      if (!btn) return;
      var slot = btn.getAttribute('data-slot');
      var meta = (TC.IMAGES && TC.IMAGES[slot]) || {};
      var thumb = btn.querySelector('img');

      img.src = btn.getAttribute('data-full');
      img.alt = thumb ? thumb.alt : '';
      caption.textContent = (meta.caption || '') + (meta.credit ? '  ·  ' + meta.credit : '');

      /* Warm only the neighbours. Preloading the whole set would pull several
         megabytes for photographs nobody may look at. */
      [index - 1, index + 1].forEach(function (i) {
        var n = list[i];
        if (n) { var pre = new Image(); pre.src = n.getAttribute('data-full'); }
      });
    }

    function open(btn) {
      var list = visibleButtons();
      index = list.indexOf(btn);
      if (index < 0) return;

      opener = btn;
      /* close() hides the box on a timer. Reopening inside that window would
         otherwise let the old timer fire and hide the viewer the visitor has
         just opened. */
      window.clearTimeout(hideTimer);
      box.hidden = false;
      /* Next frame, so the transition has a start state to animate from */
      requestAnimationFrame(function () { box.classList.add('is-open'); });
      render(list);
      document.body.style.overflow = 'hidden';
      if (TC.lenis) TC.lenis.stop();
      btnClose.focus();
    }

    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      if (TC.lenis) TC.lenis.start();
      hideTimer = window.setTimeout(function () { box.hidden = true; }, 420);
      if (opener) opener.focus();
      opener = null;
    }

    function step(delta) {
      var list = visibleButtons();
      if (!list.length) return;
      index = (index + delta + list.length) % list.length;
      render(list);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn); });
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { step(-1); });
    btnNext.addEventListener('click', function () { step(1); });

    box.addEventListener('click', function (e) {
      if (e.target === box) close();
    });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape')     { close(); }
      else if (e.key === 'ArrowLeft')  { step(-1); }
      else if (e.key === 'ArrowRight') { step(1); }
      else if (e.key === 'Tab') {
        /* Focus trap. Without this, Tab walks out of the dialog and into the
           page behind it, which the modal is visually covering. */
        var focusables = box.querySelectorAll('button');
        if (!focusables.length) return;
        var first = focusables[0];
        var last  = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });

    /* Swipe */
    var startX = null;
    box.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });

    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
      startX = null;
    }, { passive: true });

    applyFilter('all');
    wave();
    window.addEventListener('resize', debounce(wave, 180), { passive: true });
  }

  /* ── Diagonal reveal wave ───────────────────────────────────────────────
     --i used to be hard-coded 0–11 in source order, which sweeps the mosaic
     left-to-right and reads mechanical. Measuring each cell's real position
     instead gives a true diagonal, and it stays correct across the 2-, 3- and
     4-column breakpoints rather than being tuned for one of them.

     Distance along the diagonal is (top + left), normalised to eight steps —
     enough to read as a sweep, few enough that the last cell is not still
     arriving after the visitor has scrolled past.                          */

  function wave() {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    var cells = grid.querySelectorAll('.gallery__item');
    if (!cells.length) return;

    var d = [], min = Infinity, max = -Infinity;

    Array.prototype.forEach.call(cells, function (el, i) {
      /* offsetLeft/Top are layout-relative, so they do not shift as the page
         scrolls — getBoundingClientRect would give a different wave depending
         on where the visitor happened to be when this ran. */
      var v = el.offsetTop + el.offsetLeft;
      d[i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    });

    var span = Math.max(1, max - min);
    Array.prototype.forEach.call(cells, function (el, i) {
      el.style.setProperty('--i', Math.round((d[i] - min) / span * 8));
    });
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      window.clearTimeout(t);
      t = window.setTimeout(fn, ms);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

})(window.TC);
