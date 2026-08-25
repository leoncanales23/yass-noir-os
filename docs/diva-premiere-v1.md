# Diva Premiere v1

## Purpose

Replace the generic loader feeling with a short editorial premiere that introduces Yass Noir as a presence before the hero opens.

## Experience

The first entry in a browser tab plays a 1.55 second sequence:

1. black visual silence;
2. Yass Noir signature reveal;
3. restrained gold / violet stage light sweep;
4. VibraAlto credit line;
5. fade into the hero with a brief accent-light response.

Subsequent loads in the same tab use a 420 ms `encore` instead of replaying the full sequence. Anchor entries also use the short mode so deep links are not blocked by a long intro.

`prefers-reduced-motion` collapses the experience to roughly 160 ms and removes flare / sweep motion.

## Architecture

### Existing loader as fail-safe

`index.html` keeps the existing `.loader` element. This is intentional. It paints immediately from the base stylesheet and prevents a flash of the hero while the premiere assets are loading.

`landing-runtime.js` then loads:

- `assets/diva-premiere.css`
- `assets/diva-premiere.js`

The premiere runtime promotes the existing loader node into `.diva-premiere` only after the premiere CSS has loaded. If the premiere assets fail, the old loader is released by a fallback path instead of trapping the visitor.

### Runtime state

The premiere exposes:

- `html[data-diva-premiere="v1"]`
- `.diva-premiere[data-mode="premiere|encore"]`
- `.diva-premiere[data-state="playing|complete"]`
- `body.premiere-running`
- `body.premiere-done`
- `body.premiere-arrival`

It also records a Performance API measure named `yn-premiere` when supported.

### Event bus

On completion the runtime dispatches:

```js
body.dispatchEvent(new CustomEvent('yn:premiereend', {
  detail: {
    mode: 'premiere' | 'encore',
    duration,
    source: 'animationend' | 'fallback'
  }
}));
```

This is the handoff point for Diva Presence, analytics, audio cues, adaptive copy or future orchestration layers without coupling those systems to the premiere implementation.

## Performance decisions

- no video asset is required;
- no canvas or WebGL;
- animation is CSS driven;
- the visual layer disappears from the DOM after completion;
- the full sequence plays once per tab session;
- reduced-motion receives a minimal path;
- failure fallback prevents a permanent loading screen.

## Version

**v1.0 — Diva Premiere**

The landing now has a dedicated entrance lifecycle instead of a generic loader.
