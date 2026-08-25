# Yass Noir Premiere Entry v1

## Goal

Turn the first 1.5 seconds of the landing into a controlled brand entrance instead of a generic loader.

## Experience

The visitor first sees visual silence: black stage, Yass Noir signature, restrained gold/violet halo and a single moving light cue. The interface remains muted while the signature is on stage. The premiere then exits and hands visual control to the hero.

## Runtime

- `assets/diva-premiere.css` owns the visual sequence.
- `assets/diva-premiere.js` owns duration, session memory, fallback and completion event.
- Full premiere is ~1550 ms.
- Repeat views in the same session use an abbreviated encore.
- `prefers-reduced-motion` uses a short static version.
- A fallback timer guarantees the interface is never trapped behind the premiere.

## Critical boot path v1.1

Previously the premiere stylesheet and runtime were injected by `landing-runtime.js`. That meant the most important first impression depended on a secondary runtime loading first.

The premiere is now promoted to a first-class boot dependency:

1. `yass-noir-logo.svg` is preloaded.
2. `diva-premiere.css` is linked directly in `<head>`.
3. `diva-premiere.js` executes before the general landing runtime.
4. `landing-runtime.js` no longer owns or injects premiere assets.

This removes a potential flash between loader and premiere styling and makes the opening deterministic.

## Events

`yn:premiereend`

Detail:

```js
{
  mode: 'premiere' | 'encore',
  duration: number,
  source: 'animationend' | 'fallback'
}
```

Future experience layers can listen to this event without controlling the premiere itself.

## Design rule

The premiere is not a loading screen. It is the first scene of Yass Noir.
