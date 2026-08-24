# Noir Map Runtime v2

## Root cause

`assets/hero-editorial-hq.webp` is not stored as binary WebP bytes. It contains Base64 text beginning with the WebP signature payload (`UklGR...`). A CSS `background-image:url(...)` therefore cannot render it as an image.

## Fix

The existing cinematic runtime now hydrates the map image explicitly:

1. fetch the Base64-text asset as text;
2. strip whitespace;
3. validate the `UklGR` WebP payload prefix;
4. assign a `data:image/webp;base64,...` URL to the existing map `<img>`;
5. remove the legacy `data-b64` attribute so the image becomes visible again;
6. expose `is-map-ready` / `is-map-error` stage state for inspection.

This preserves the existing hotspots, zoom, glow, note panel, carousel lifecycle, memory and breathing layer without introducing another image asset or changing the landing markup.
