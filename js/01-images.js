/* ============================================================================
   01-images.js — the image manifest as a plain global.

   This NEVER sets a src. Every image in index.html carries a real src and
   srcset so the browser's preload scanner finds it during HTML tokenisation,
   before CSS or JS have even parsed. Injecting sources from here would cost
   300-800ms of LCP on a page whose largest element is a photograph, break
   social crawlers that don't run scripts, and render a blank page with JS off.

   It exists for exactly two consumers: lightbox captions, and 99-audit.js.

   A JSON file would be tidier, but fetch() is blocked from file:// — and
   double-clicking index.html has to work. See README.
   ========================================================================= */

window.TC = window.TC || {};

(function (TC) {
  'use strict';

  TC.IMAGES = {
    'hero-cloudline':      { w: 1920, h: 1280, credit: 'Timothy A. Gonsalves · CC BY-SA 4.0',
                             caption: 'Cloud moving through the ridges below the house.' },
    'hero-reveal':         { w: 1440, h: 960,  credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'The pool terrace at dusk.' },
    'place-road':          { w: 1280, h: 853,  credit: 'Timothy A. Gonsalves · CC BY-SA 4.0',
                             caption: 'The last of the estate road.' },
    'place-band':          { w: 1920, h: 1280, credit: 'Vivek Kumar · CC0',
                             caption: 'Mist across the tea slopes.' },
    'location-ridges':     { w: 1920, h: 1080, credit: 'Timothy A. Gonsalves · CC BY-SA 4.0',
                             caption: 'The range, looking west.' },
    'book-dusk':           { w: 1920, h: 1446, credit: 'Pradyumnakp · CC0',
                             caption: 'Dusk over the Ghats.' },

    'suite-canopy':        { w: 1920, h: 1280, credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'The Canopy Suite.' },
    'suite-veranda':       { w: 1920, h: 1280, credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'The Long Room.' },
    'suite-bath':          { w: 1920, h: 1280, credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'The Rain Room.' },

    'exp-tea':             { w: 1920, h: 839,  credit: 'Rainer Halama · CC BY-SA 4.0',
                             caption: 'The ridge track.' },
    'exp-trogon':          { w: 1280, h: 853,  credit: "Shiv's fotografia · CC BY-SA 4.0",
                             caption: 'Malabar trogon.' },
    'exp-waterfall':       { w: 1280, h: 853,  credit: 'Samson Joseph · CC BY-SA 4.0',
                             caption: 'The pool below the falls.' },
    'exp-coffee':          { w: 1280, h: 853,  credit: 'Vallari.a · CC BY-SA 4.0',
                             caption: 'Filter coffee, six in the morning.' },
    'exp-spa':             { w: 1280, h: 853,  credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'The treatment room.' },

    'gallery-cliff-figure':{ w: 960, h: 540,  credit: 'Pramodv1993 · CC BY-SA 4.0',
                             caption: 'The edge of the lawn, last light.' },
    'gallery-mist-layers': { w: 960, h: 723,  credit: 'Pradyumnakp · CC0',
                             caption: 'Ridge after ridge, fading out.' },
    'gallery-suite-bed':   { w: 960, h: 720,  credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'A canopy bed under a high ceiling.' },
    'gallery-lounge-dusk': { w: 960, h: 686,  credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'The lounge at blue hour.' },
    'gallery-library':     { w: 960, h: 640,  credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'The library.' },
    'gallery-table':       { w: 960, h: 640,  credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'Dinner, laid.' },
    'gallery-pool':        { w: 960, h: 640,  credit: 'Basile Morin · CC BY-SA 4.0',
                             caption: 'The pool and terrace.' },
    'gallery-spices':      { w: 960, h: 640,  credit: 'Rainer Halama · CC BY-SA 4.0',
                             caption: 'Cardamom, growing wild along the track.' },
    'gallery-ponmudi':     { w: 960, h: 639,  credit: 'Shishirdasika · CC BY-SA 4.0',
                             caption: 'Hills folding away to the plain.' },
    'gallery-sunrise':     { w: 960, h: 720,  credit: 'Jigyasu · CC BY-SA 4.0',
                             caption: 'Sunrise, cloud still in the valleys.' },
    'gallery-shola':       { w: 960, h: 640,  credit: 'SeethaG · CC BY-SA 4.0',
                             caption: 'Shola forest in a fold of grassland.' },

    'og-cover':            { w: 1280, h: 853, credit: 'Timothy A. Gonsalves · CC BY-SA 4.0',
                             caption: 'Social preview image (never rendered on the page).' }
  };

})(window.TC);
