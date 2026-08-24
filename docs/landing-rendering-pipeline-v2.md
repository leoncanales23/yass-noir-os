# Yass Noir · Landing Rendering Pipeline v2.0

## Goal

Keep the landing visually heavy and editorial while reducing unnecessary browser work outside the viewport.

## Technology added

### 1. Viewport rendering budget

Below-the-fold sections use `content-visibility:auto` when supported. The browser can skip layout and paint work for sections that are not currently relevant while `contain-intrinsic-size` preserves document geometry and prevents scroll jumps.

### 2. Component containment

The Noir Map, cinematic carousel and editorial frames use CSS containment so layout and paint invalidations stay local to each experience instead of propagating through the whole page.

### 3. Native scroll-driven motion

Browsers supporting View Timeline receive a subtle heading lift driven by scroll position. No scroll event listener is required for this effect. Browsers without support keep the existing reveal system.

### 4. Adaptive rendering

`update: slow` reduces expensive blur and glow work on slower display pipelines. Coarse-pointer devices receive larger interactive targets. Higher-contrast preferences receive stronger borders and navigation visibility.

### 5. Reduced-motion contract

Reduced-motion users avoid cinematic transforms and long-running animation work while keeping the content and interactions intact.

### 6. Hash-aware navigation

Where `:has()` is supported, the navigation reflects the currently targeted section without adding another JavaScript navigation controller.

### 7. Noir Map decode cleanup

The old CSS fallback attempted to decode the Base64-text map asset as a binary background image. That failed request path has been removed. The map is now owned exclusively by the runtime Base64 hydrator introduced in the previous commit.

## Design principle

Yass Noir should feel computationally rich without behaving like a heavy application. Visual weight belongs in the composition. Runtime weight should appear only while that composition is actually being seen.

## Version trail

- v1.x: cinematic carousel, visibility lifecycle, memory and breathing composition.
- v1.0 Noir Map: runtime Base64 hydration repair.
- **v2.0 Landing Rendering Pipeline:** viewport rendering budget, containment, native scroll timelines, adaptive rendering and accessibility media contracts.
