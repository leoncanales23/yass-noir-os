# Yass Noir · Noir Map

## Why this section stays

The map is useful because it interrupts the passive scroll between the story and the private archive. It gives the visitor something to explore instead of immediately serving another static image.

The experience is not meant to explain tattoo symbolism. Its job is to create attention, tension and return: the visitor notices a point, touches it, the visual atmosphere changes, and the note reveals another fragment.

## Root cause fixed in v1.0

The map image used `data-b64="/assets/hero-editorial-hq.webp"`, but the legacy hydration function reads `data-b64` files as UTF-8 text and wraps the result in a `data:image/webp;base64,...` URL.

`hero-editorial-hq.webp` is already a binary WebP file, not a Base64 text payload. Treating the binary file as Base64 text produced an invalid image, leaving only the alt text and floating hotspots visible.

## Runtime-safe visual repair

The v1.0 repair lives in the already-loaded `assets/cinematic-breathing.css` layer and uses the existing WebP directly as the visual canvas:

- the valid `/assets/hero-editorial-hq.webp` asset is rendered as the stage background;
- the broken legacy `<img data-b64>` is visually neutralized without changing the stable page markup;
- hotspot interaction remains owned by the existing inline runtime;
- the note remains interactive and continues responding to hotspot level;
- the stage receives a lighter cinematic vignette, controlled glow and better focus treatment;
- desktop and mobile get independent framing.

This is intentionally a surgical compatibility layer. It fixes production immediately without coupling the map repair to the carousel behavior or rewriting the landing architecture.

## Interaction contract

The four hotspots continue to control:

- active point state;
- note title and fragment text;
- local zoom level;
- image luminance;
- ambient violet glow;
- note glass intensity and border response.

Future copy iterations should avoid invented tattoo lore and focus on gaze, memory, detail and tension.

## Version trail

- **v1.0**: binary-WebP hydration bug isolated, direct visual fallback, cinematic map canvas, accessible hotspot focus and responsive framing.
