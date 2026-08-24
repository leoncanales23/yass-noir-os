# Yass Noir Cinematic Carousel

## Purpose

The editorial carousel is treated as an experience layer rather than a conventional image slider. The core rule is simple: preserve the complete photograph, then build atmosphere around it instead of cropping the subject to fit a fixed frame.

## Architecture

The base carousel remains in `index.html` and owns slide movement, autoplay, swipe, arrows and dots. `assets/cinematic-carousel.js` mounts a progressive enhancement layer on top of that stable base.

This separation keeps the gallery functional even if the cinematic layer fails to load.

## Technology currently registered

### Adaptive editorial framing

Each image is classified at runtime as portrait, landscape or near-square using its natural dimensions. The presentation changes accordingly while keeping `object-fit: contain` as the no-crop guarantee.

### Ambient frame synthesis

The active photograph is reused as a blurred, darkened background layer. This creates image-specific ambient light without generating or storing a second background asset.

### Cinematic timing

A 5.2 second visual progress line mirrors the carousel autoplay cadence. It pauses during pointer hover, keyboard focus and document visibility changes.

### Predictive neighbor prefetch

Only the previous and next photographs are prefetched around the active frame. Prefetch work is scheduled with `requestIdleCallback` when available and falls back to a short timeout. This avoids loading the entire archive eagerly while reducing transition latency.

### Accessible carousel state

The enhancement layer maintains active-slide `aria-hidden` / `aria-current` state, uses roving tab focus for dots, supports Left, Right, Home and End keys, and announces slide changes through a polite `aria-live` region.

### Frame-safe parallax

Desktop pointer parallax is painted through `requestAnimationFrame` so multiple pointer events collapse into one visual update per frame. Touch/coarse-pointer devices do not receive the effect.

### Visibility-aware lifecycle

The carousel now has an explicit runtime lifecycle driven by `IntersectionObserver`.

When the carousel moves more than 280 px beyond the viewport buffer, it enters `sleeping` state. In that state the enhancement layer:

- pauses the base autoplay through the existing carousel event contract;
- stops the cinematic progress animation;
- cancels pending parallax frames and clears transforms;
- stops predictive neighbor prefetch work;
- removes `will-change` hints;
- disables the blurred ambient background layer;
- removes the large cinematic viewport shadow.

The carousel wakes before it becomes visible again because the observer uses a 280 px root margin. This gives the browser a short warm-up zone so the user sees the full cinematic treatment instead of a cold restart.

The state is also exposed as `data-lifecycle="awake|sleeping"`, which makes the behavior inspectable without adding visible UI.

Document visibility, pointer hover and keyboard focus share the same pause-state coordinator. This avoids competing pause/resume paths and keeps the visual timer aligned with the underlying autoplay.

### Reduced-motion path

`prefers-reduced-motion` disables progress animation and image motion while preserving navigation and content.

## Version trail

- **v1.0**: adaptive cinematic presentation, ambient backgrounds, progress line, keyboard arrows and desktop parallax.
- **v1.1**: predictive neighbor prefetch, assistive announcements, roving focus, Home/End navigation, focus-aware autoplay pause and rAF parallax scheduling.
- **v1.2**: IntersectionObserver lifecycle, offscreen sleep mode, shared pause coordinator, render-cost reduction and warm-up-before-visible behavior.

The implementation intentionally remains framework-free and additive to the static VibraAlto/Firebase landing architecture.
