# Heavy Cutout Images WebP Optimization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce total cutout image payload by ~6.75 MB (~88% bandwidth reduction) across `StorytellingScroll` and `MonacoMaranelloSplit` by converting large PNGs to modern high-fidelity WebP format without visual loss.

**Architecture:** 
1. Use Node.js + `sharp` to transcode the three heaviest cutout PNGs (`f1.png`, `leclerc monaco side.png`, `leclerc first win side-Photoroom.png`) into lossless/alpha-preserved WebP at quality 90 and compression effort 6.
2. Update component references in `StorytellingScroll.jsx` and `MonacoMaranelloSplit.jsx` to load the `.webp` versions eagerly, preserving original PNG paths in `onError` handlers as a resilient fallback.
3. Validate build output and verify clean transparency masking and drop shadows.

**Tech Stack:** Node.js, `sharp`, React, Vite.

**Spec:** High-Impact Asset Optimization discussion in conversation b7f3fc75-5565-4460-be45-a899252261c3.

## Global Constraints
- Do not remove the original `.png` source files so they remain available as fallback.
- Alpha transparency and shadow edges must remain pristine without clipping or color bleeding.
- Every task must be committed independently as an **atomic commit** with a conventional commit message.

## Review Focus
1. **Alpha Channel Integrity:** Verify that cutouts remain transparent and do not develop black or white halos.
2. **SVG Image Compatibility:** Verify SVG `<image>` tag in `StorytellingScroll.jsx` accepts `.webp` in all major browsers.
3. **Fallback Resilience:** Ensure `onError` correctly falls back to `.png` if `.webp` fails to load.
4. **Production Bundle Verification:** Verify `npm run build` runs smoothly and reports reduced network transfer cost.

---

### Task 1: Generate High-Fidelity WebP Cutouts via Sharp

**Files:**
- Create: `public/images/f1.webp`
- Create: `public/images/leclerc-monaco-side.webp`
- Create: `public/images/leclerc-first-win-side.webp`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Consumes: `public/images/f1.png`, `public/images/leclerc monaco side.png`, `public/images/leclerc first win side-Photoroom.png`
- Produces: 3 optimized `.webp` files in `public/images/` with ~88% size savings.

- [ ] **Step 1: Execute sharp conversion script**
  Run Node script converting each PNG to WebP with `quality: 90, effort: 6`.
  Confirm files generated:
  - `f1.webp`: ~360 KB (down from 2.76 MB)
  - `leclerc-monaco-side.webp`: ~328 KB (down from 2.60 MB)
  - `leclerc-first-win-side.webp`: ~248 KB (down from 2.32 MB)

- [ ] **Step 2: Atomic Commit**
  ```bash
  git add public/images/f1.webp public/images/leclerc-monaco-side.webp public/images/leclerc-first-win-side.webp package.json package-lock.json
  git commit -m "perf(assets): convert heavy cutout pngs to high-fidelity webp format"
  ```

---

### Task 2: Update Component Asset References to WebP

**Files:**
- Modify: `src/components/sections/StorytellingScroll.jsx:230-245`
- Modify: `src/components/sections/MonacoMaranelloSplit.jsx:155-170, 220-235`

**Interfaces:**
- Consumes: `/images/f1.webp`, `/images/leclerc-monaco-side.webp`, `/images/leclerc-first-win-side.webp`
- Produces: Updated JSX with WebP primary sources and resilient PNG fallbacks.

- [ ] **Step 1: Update `StorytellingScroll.jsx`**
  Update `<image href="/images/f1.webp" xlinkHref="/images/f1.webp" />`.

- [ ] **Step 2: Update `MonacoMaranelloSplit.jsx`**
  - Left card (Monaco): `src="/images/leclerc-monaco-side.webp"` (fallback: `charles-helmet-monaco.png`).
  - Right card (Spa): `src="/images/leclerc-first-win-side.webp"` (fallback: `leclerc first win side.png`).

- [ ] **Step 3: Run production build**
  Run: `npm run build`
  Expected: Clean build (`✓ built in ~4-6s`).

- [ ] **Step 4: Atomic Commit**
  ```bash
  git add src/components/sections/StorytellingScroll.jsx src/components/sections/MonacoMaranelloSplit.jsx
  git commit -m "feat(ui): point storytelling and split cards to optimized webp assets"
  ```

---

### Task 3: Build Verification & Push

**Files:**
- Verification only

- [ ] **Step 1: Run production build**
  Run: `npm run build`
  Expected: Clean build.

- [ ] **Step 2: Push atomic commits to GitHub**
  Run: `git push origin main`
  Expected: Fast-forward push successful.
