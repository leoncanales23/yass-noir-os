# Yass Noir · Carousel Runtime v2

## Goal

Collapse the cinematic archive into one authoritative controller and remove carousel behavior from `index.html`.

The previous architecture had two layers acting on the same carousel:

1. a legacy inline controller in `index.html` that owned autoplay, buttons, dots, swipe and visibility;
2. `assets/cinematic-carousel.js`, which observed and extended the state created by that controller.

That worked, but it created duplicated listeners, competing pause/resume paths and unnecessary coupling between page markup and component behavior.

## v2 architecture

### Markup

`index.html` is now presentation markup only. Inline CSS and inline JavaScript were removed from the document.

The page loads:

- `assets/landing.css` for page-level presentation;
- `assets/carousel-base.css` for the structural carousel contract;
- `assets/landing-runtime.js` for generic landing behavior;
- `assets/cinematic-carousel.js` for the archive carousel.

### Single controller

`assets/cinematic-carousel.js` is the only carousel state owner.

It owns:

- current slide index;
- track translation;
- autoplay timing;
- previous/next controls;
- dot navigation;
- horizontal swipe;
- keyboard navigation (`ArrowLeft`, `ArrowRight`, `Home`, `End`);
- hover/focus/visibility pause state;
- IntersectionObserver awake/sleeping lifecycle;
- predictive neighbor prefetch;
- portrait/landscape/square classification;
- cinematic progress line;
- local visual memory;
- desktop rAF parallax;
- reduced-motion behavior;
- ARIA current/hidden/selected state and live announcements.

No MutationObserver is required to discover the active frame anymore because v2 owns the transition itself.

## Runtime state contract

The root carousel exposes inspectable state:

- `data-runtime="v2"`
- `data-controller="cinematic-carousel"`
- `data-ready="true"`
- `data-index`
- `data-lifecycle="awake|sleeping"`
- `data-paused="true|false"`
- `data-memory="new|restored|unavailable"`
- `data-memory-index`

Every frame change also emits a `yn:carouselchange` CustomEvent with:

```js
{
  index,
  total,
  source
}
```

This gives future analytics, adaptive copy or NERHIA-style experience logic a clean integration point without coupling them to the carousel internals.

## Persistence

Visual memory keeps the existing versioned key `yn.carousel.memory.v1` so visitors do not lose their remembered frame during the runtime migration. The payload schema now reports `version: 2` internally.

## Page runtime extraction

Generic page behavior moved to `assets/landing-runtime.js`:

- loader lifecycle;
- visit-memory line;
- reveal observer;
- rAF-scheduled page progress;
- Noir Map hotspot behavior;
- motion-video error fallback.

The scroll progress indicator no longer paints directly inside every scroll event. It is scheduled through `requestAnimationFrame`.

## Styling layers

The architecture now separates three responsibilities:

1. `landing.css`: page identity and section design;
2. `carousel-base.css`: minimum structural contract required for a functional slider;
3. `cinematic-breathing.css`: optional final cinematic composition and adaptive rendering layer.

This means visual iteration no longer requires touching the component state machine.

## Version trail

- v1.0: cinematic presentation and progress.
- v1.1: predictive prefetch and accessibility enhancements.
- v1.2: visibility-aware lifecycle.
- v1.3: persistent visual memory.
- v1.4: breathing composition layer.
- **v2.0: single authoritative controller, markup/runtime separation, explicit state contract and component event API.**
