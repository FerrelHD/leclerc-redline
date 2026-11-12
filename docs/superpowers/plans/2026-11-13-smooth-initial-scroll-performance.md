# Initial Scroll Performance & Stutter Elimination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate initial scroll stutter (*patah-patah*) and frame drops when first opening the web application, establishing 60/120fps fluid scrolling from the very first frame.

**Architecture:** 
1. Revert unstable below-the-fold dynamic code splitting (`React.lazy` + `Suspense`) in `App.jsx` to lock in document height and eliminate mid-scroll layout shifts.
2. Replace the initial "Refresh Storm" (multiple image load listeners and cascading timeouts) with a single debounced `ScrollTrigger.refresh()` call and restore GSAP's `lagSmoothing(500, 33)` to eliminate scroll jolt.
3. Pause `Lenis` during the preloader (`LoadingScreen`) to prevent buffered wheel delta discharge.
4. Isolate the Hero WebGL canvas and card zoom into dedicated GPU composite layers while trimming the shader iteration count from 15 to 10.

**Tech Stack:** React 19, GSAP 3 (ScrollTrigger), Lenis 1.x, WebGL / GLSL, Vite.

**Spec:** Technical Root Cause Analysis documented in conversation b7f3fc75-5565-4460-be45-a899252261c3.

## Global Constraints
- Do not alter visual styling, colors (#0A0A0A, #FFFFFF, #E10600), or animation choreographies (signature draw, zoom out, marquee).
- Production build (`npm run build`) must pass cleanly at every task without warnings or errors.
- Every task must be committed independently as an **atomic commit** with a conventional commit message.

## Review Focus
1. **Lenis / GSAP Ticker Stability:** Ensure `lenis.raf` does not receive unclamped delta jumps after CPU pauses.
2. **Scroll Height Stability:** Ensure document height is established immediately on mount without sudden jumps.
3. **ScrollTrigger Pin Registration:** Ensure all pinned sections (Hero, PodiumGallery, ArchiveZoomParallax) register their pin-spacers accurately.
4. **Preloader Exit Synchronization:** Ensure `lenis.start()` is called only when `LoadingScreen` completes its exit transition.
5. **GPU Rasterization:** Ensure the Hero card's `clipPath` and `boxShadow` animations do not trigger full-page re-rasterization on every frame.

---

### Task 1: Revert Lazy Suspense on Core Flow to Prevent Layout Shift

**Files:**
- Modify: `src/App.jsx:1-25, 95-150`

**Interfaces:**
- Consumes: Standard synchronous component imports for all 7 main sections.
- Produces: Stable initial DOM structure with immediate document height calculation.

- [ ] **Step 1: Replace lazy imports with eager imports in `src/App.jsx`**
  ```javascript
  import StorytellingScroll from './components/sections/StorytellingScroll';
  import PodiumGallery from './components/sections/PodiumGallery';
  import MonacoMaranelloSplit from './components/sections/MonacoMaranelloSplit';
  import F1Calendar from './components/sections/F1Calendar';
  import ArchiveZoomParallax from './components/sections/ArchiveZoomParallax';
  import SocialsDeck from './components/sections/SocialsDeck';
  import Footer from './components/sections/Footer';
  ```

- [ ] **Step 2: Remove `<Suspense>` wrappers and fallback placeholder divs from `src/App.jsx`**
  Mount all sections directly inside `<main>` and the footer wrapper so the DOM height is 100% stable from frame 0.

- [ ] **Step 3: Run build to verify clean module graph**
  Run: `npm run build`
  Expected: Clean build (`✓ built in ~6-8s`), no chunk resolution errors.

- [ ] **Step 4: Atomic Commit**
  ```bash
  git add src/App.jsx
  git commit -m "refactor(core): remove lazy suspense wrappers to stabilize initial scroll height and prevent layout shift"
  ```

---

### Task 2: Debounce ScrollTrigger Refresh Storm & Restore GSAP lagSmoothing

**Files:**
- Modify: `src/App.jsx:40-75`
- Modify: `src/components/sections/PodiumGallery.jsx:50-70`

**Interfaces:**
- Consumes: `gsap.ticker`, `ScrollTrigger.refresh()`
- Produces: Single debounced refresh mechanism and smoothed frame delta interpolation.

- [ ] **Step 1: Update `gsap.ticker.lagSmoothing` in `src/App.jsx`**
  Change `gsap.ticker.lagSmoothing(0)` to `gsap.ticker.lagSmoothing(500, 33)` (or remove the override to use GSAP's default). This ensures any initial frame hiccups are smoothly dampened instead of violently jumping.

- [ ] **Step 2: Implement debounced refresh in `src/App.jsx`**
  Replace individual image `load`/`error` listeners and cascading `setTimeout`s (150ms, 500ms, 1200ms) with:
  ```javascript
  let refreshTimer;
  const debouncedRefresh = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
  };
  ```
  Hook `debouncedRefresh` to `window.addEventListener('load', debouncedRefresh)` and `document.fonts.ready.then(debouncedRefresh)`.

- [ ] **Step 3: Clean up redundant refresh calls in `src/components/sections/PodiumGallery.jsx`**
  Remove the `images.forEach(img => img.addEventListener('load', ...))` and `setTimeout(() => ScrollTrigger.refresh(), 300)` that duplicate the root handler and trigger unnecessary unpin/repin cycles.

- [ ] **Step 4: Run build to verify**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Atomic Commit**
  ```bash
  git add src/App.jsx src/components/sections/PodiumGallery.jsx
  git commit -m "perf(scroll): debounce ScrollTrigger refresh storm and restore GSAP lagSmoothing"
  ```

---

### Task 3: Pause and Resume Lenis Lifecycle with LoadingScreen

**Files:**
- Modify: `src/App.jsx:30-85`
- Modify: `src/components/ui/LoadingScreen.jsx:55-75`

**Interfaces:**
- Consumes: `lenis.stop()`, `lenis.start()`
- Produces: Zero buffered scroll velocity upon preloader completion.

- [ ] **Step 1: Export or share Lenis control in `src/App.jsx`**
  Initialize Lenis with `lenis.stop()` immediately on mount so wheel and touch events during the loading screen are not buffered into sudden velocity.
  Pass `onLoaded` and `onComplete` handlers to `<LoadingScreen>`:
  - When `LoadingScreen` starts exit: call `ScrollTrigger.refresh()`
  - When `LoadingScreen` finishes exit and unmounts: call `lenis.start()`

- [ ] **Step 2: Update `LoadingScreen.jsx` completion callbacks**
  Accept `onComplete` prop in `LoadingScreen({ onLoaded, onComplete })`.
  In `exitTl`'s `onComplete`, invoke `if (onComplete) onComplete();` after restoring `document.body.style.overflow = ''`.

- [ ] **Step 3: Run build to verify**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 4: Atomic Commit**
  ```bash
  git add src/App.jsx src/components/ui/LoadingScreen.jsx
  git commit -m "fix(scroll): pause and resume Lenis during preloader to prevent buffered scroll velocity"
  ```

---

### Task 4: GPU Layer Isolation and Neural Vortex Shader Streamlining

**Files:**
- Modify: `src/components/hero/FaceHelmetReveal.jsx:220-270`
- Modify: `src/components/ui/interactive-neural-vortex-background.jsx:55-66, 175-185`

**Interfaces:**
- Consumes: WebGL GLSL shader, CSS transform / will-change
- Produces: Isolated GPU composite layer for Hero Card and 33% lower fragment shader instruction count.

- [ ] **Step 1: Reduce loop iterations in `interactive-neural-vortex-background.jsx`**
  Change shader loop in `fsSource` from `for (int j = 0; j < 15; j++)` to `for (int j = 0; j < 10; j++)`. Visually identical fluid vortices with 33% fewer trig operations per pixel.

- [ ] **Step 2: Optimize uniform updates in `interactive-neural-vortex-background.jsx`**
  Only pass updated uniforms when values actually change, avoiding redundant GPU pipeline stall.

- [ ] **Step 3: Add GPU isolation on Hero Card in `FaceHelmetReveal.jsx`**
  Add `will-change-transform will-change-[clip-path] [transform:translateZ(0)]` on `heroCardRef.current` so animating its `scale` and `clipPath` does not trigger whole-page rasterization.

- [ ] **Step 4: Run build to verify**
  Run: `npm run build`
  Expected: PASS

- [ ] **Step 5: Atomic Commit**
  ```bash
  git add src/components/hero/FaceHelmetReveal.jsx src/components/ui/interactive-neural-vortex-background.jsx
  git commit -m "perf(hero): isolate GPU composite layers and streamline neural vortex shader iterations"
  ```

---

### Task 5: End-to-End Build & Performance Verification

**Files:**
- Verification only

- [ ] **Step 1: Run production build**
  Run: `npm run build`
  Expected: Clean build (`✓ built in ~6-7s`).

- [ ] **Step 2: Check git commit history**
  Run: `git log --oneline -n 6`
  Expected: 4 clean atomic commits representing Tasks 1 through 4.

- [ ] **Step 3: Final verification and summary presentation**
  Verify dev server responds and confirm initial scroll is smooth.
