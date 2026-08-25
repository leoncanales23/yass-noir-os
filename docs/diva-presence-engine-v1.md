# Diva Presence Engine v1

## Objective

Make Yass Noir feel less like a static luxury landing and more like a digital stage with presence.

The engine does not add heavy WebGL, canvas loops or external dependencies. It uses browser-native primitives and the existing Runtime v2 event bus.

## Components

### Reactive stage light

`--diva-x`, `--diva-y` and `--diva-energy` are updated from pointer position and scroll velocity. CSS consumes those variables to move a restrained gold/violet aura across the page and hero.

### Scene awareness

An `IntersectionObserver` tracks the dominant section and exposes the current scene through:

- `body[data-diva-scene]`
- `[data-diva-active="true"]`
- `yn:presencechange`

The fixed stage label changes between OPENING, PRESENCE, THE GAZE, MOTION, PRIVATE ARCHIVE, PRIVATE SIDE, THRESHOLD and ACCESS.

### Carousel integration

The engine listens directly to the `yn:carouselchange` event emitted by Carousel Runtime v2. A frame change can therefore alter ambient energy and trigger a small visual pulse without adding another carousel controller.

### Magnetic actions

On fine-pointer devices, `.button` elements react by only a few pixels to pointer position and receive a short metallic reflection. Touch devices do not run the magnetic behavior.

### Cursor jewel

Fine-pointer desktop environments receive a small decorative cursor jewel that follows the real pointer. It never replaces native pointer behavior and has `pointer-events:none`.

### Resource behavior

When the document becomes hidden, the engine enters `diva-sleep` and removes the aura/cursor visually. Pointer and scroll paints are scheduled through `requestAnimationFrame`.

## Accessibility

- no semantic content is placed in decorative layers;
- stage label, aura and cursor are `aria-hidden`;
- `prefers-reduced-motion` disables glints, pulse and cursor motion;
- coarse pointer / touch devices skip magnetic and cursor behavior;
- no user-identifying data or network telemetry is created.

## Noir Map copy

The hotspot content no longer assigns invented meanings to tattoos. It now works as a map of gaze: first look, attention, memory and return.

## Contract

Diva Presence Engine is intentionally separate from:

- `landing-runtime.js`, which owns general page behavior;
- `cinematic-carousel.js`, which owns carousel state;
- `diva-presence.js`, which only observes and orchestrates presentation.

This allows later analytics, adaptive copy or NERHIA layers to subscribe to `yn:presencechange` and `yn:carouselchange` without coupling to DOM internals.
