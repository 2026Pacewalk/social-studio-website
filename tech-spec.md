# Tech Spec - KINETIC FLUX

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM renderer |
| vite | ^6.0.0 | Build tool |
| @vitejs/plugin-react | ^4.4.0 | Vite React integration |
| three | ^0.172.0 | WebGL fluid simulation (raw shaders + FBO ping-pong) |
| gsap | ^3.12.7 | Animation engine, ScrollTrigger, SplitText |
| lenis | ^1.2.0 | Smooth scroll with inertia |
| tailwindcss | ^4.0.0 | Utility CSS |
| @tailwindcss/vite | ^4.0.0 | Tailwind Vite plugin |
| typescript | ^5.7.0 | Type safety |
| @types/react | ^19.0.0 | React type defs |
| @types/react-dom | ^19.0.0 | ReactDOM type defs |
| @types/three | ^0.172.0 | Three.js type defs |

Fonts loaded via Google Fonts CDN: **Big Shoulders Display** (display/headings), **Inter** (body).

---

## Component Inventory

### Layout

| Component | Source | Reuse | Notes |
|-----------|--------|-------|-------|
| CustomCursor | Custom | Global | 4px red dot + 40px hollow circle; tracks pointer via refs; expands on interactive hover |
| SmoothScrollProvider | Custom (wraps Lenis) | Global | Root-level provider; exposes Lenis instance for pause/resume (grid hover lock) |
| NavLink | Custom | Global | Mechanical text-swap hover: old text slides up, identical text slides in from below |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSurface | Custom | CSS ambient gradient background; SplitText 3D letter entrance |
| KineticManifesto | Custom | Sticky 200vh wrapper; FluidCanvasSystem (lazy-mounted via IntersectionObserver); glass metric panel |
| SpatialIndexing | Custom | 400vh scroll-driven horizontal text tracks with CSS 3D rotation |
| CinematicArchive | Custom | 3-column asymmetric grid with scroll-synced Z-depth entrance; hover scroll-lock |
| TerminalInterface | Custom | Split-layout contact form with floating labels |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| FluidCanvasSystem | Custom (Three.js) | KineticManifesto |
| Perspective3DText | Custom (GSAP + SplitText) | HeroSurface |
| SpatialScrollTracks | Custom (GSAP ScrollTrigger) | SpatialIndexing |
| StaggeredGridReveal | Custom (GSAP ScrollTrigger) | CinematicArchive |

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| FluidCanvasSystem (Navier-Stokes sim) | Three.js raw shaders + FBO ping-pong | Two WebGLRenderTargets (FloatType, 1/4 resolution); OrthographicCamera; custom sim + display fragment shaders; pointer velocity drives `iMouse` uniform | **High** 🔒 |
| FluxGradientSystem | CSS only | `::before` pseudo-element with `radial-gradient`, `mix-blend-mode: screen`, `blur(80px)`, `gradientShift` keyframes over 12s | Low |
| Perspective3DText | GSAP + SplitText | SplitText splits into chars; per-character `rotateX(90→0)` + `translateY(100%→0)`, stagger 0.03s, cubic-bezier ease | Medium |
| SpatialScrollTracks | GSAP ScrollTrigger | 3 horizontal track rows; alternating `xPercent: -100` / `100`; `scrub: 1` for viscous momentum; CSS `rotateX(±20deg)` + `perspective: 1000px` | Medium |
| StaggeredGridReveal | GSAP ScrollTrigger | Per-image timeline: `z:-500→100`, `rotateX:45→0→15`, `brightness→2`, `opacity:0`; `scrub: true`; sibling dim on hover | Medium |
| CustomCursor | Custom (RAF) | `requestAnimationFrame` loop; transform via refs; no React state for position; CSS transition for size change on interactive hover | Medium |
| TextSwapHover | Custom (CSS/JS) | Overflow-hidden container; two stacked text spans; on hover, translate both by line-height | Low |
| FloatingLabels | CSS only | `:focus` and `:not(:placeholder-shown)` pseudo-selectors drive label transform | Low |
| SectionEntrance (hero label, nav, contact) | GSAP | Simple `opacity` + `y`/`x` tween with ScrollTrigger or timeline | Low |
| GridHoverScrollLock | GSAP + Lenis | On `mouseenter`: pause Lenis + dim siblings; on `mouseleave`: resume Lenis | Medium |

---

## State & Logic

### Three.js ↔ React Bridge (FluidCanvasSystem)

The fluid simulation runs entirely outside React's render cycle. A single `useEffect` owns the Three.js lifecycle (renderer, scene, camera, materials, render targets, RAF loop). Pointer data is written to a shared ref (`mouseRef: { current: [x, y, prevX, prevY] }`) consumed by the shader uniform each frame — no React state for mouse position. On unmount (IntersectionObserver or component cleanup), dispose renderer, geometries, materials, and render targets.

### IntersectionObserver Gate for FluidCanvasSystem

The fluid canvas must only mount when scrolled into view and unmount when scrolled out. Use a native `IntersectionObserver` on the KineticManifesto wrapper (threshold 0). When intersecting: initialize Three.js scene and start RAF loop. When not intersecting: dispose everything and cancel RAF. This is critical for mobile battery performance.

### Lenis Scroll Pause/Resume (Grid Hover)

CinematicArchive hover lock requires pausing the global Lenis instance. Expose Lenis via a React context (or callback ref) so the grid item hover handler can call `lenis.stop()` / `lenis.start()`. This bridges a DOM event (hover) with the smooth scroll controller outside React's normal data flow.

### SpatialScrollTracks Ref Architecture

Three track rows require a dynamic ref array (`useRef<HTMLDivElement[]>([])`). In `useGSAP`, iterate the array and apply alternating `xPercent` animations. The inline transform (`rotateX`) comes from CSS classes; the GSAP-driven `xPercent` comes from inline styles set by the animation engine.
