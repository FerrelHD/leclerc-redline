import React, { useRef, useState, useEffect } from 'react';
import TransparentCutout from './TransparentCutout';

export default function MainVisualStack({
  topImage = "/images/leclercnewimage.png",
  bottomImage = "/images/charles-helmet-monaco.png",
  className = "",
  globalMouse = { x: -500, y: -500 },
  isHovered = false,
}) {
  const containerRef = useRef(null);
  const visualWrapperRef = useRef(null);
  const maskPathRef = useRef(null);
  const shadowPathRef = useRef(null);
  const helmetWrapperRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 1000, h: 1000 });

  const trailRef = useRef([]);
  const lastMouseRef = useRef({ x: -500, y: -500, time: 0 });
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(true);

  // Volumetric 3D Studio Spatial Depth & Natural Camera Perspective refs
  const parallaxTargetRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0, shadowX: 0, shadowY: 20 });
  const parallaxCurrentRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0, shadowX: 0, shadowY: 20 });

  // Keep track of container dimensions for SVG viewbox
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          w: containerRef.current.offsetWidth || 1000,
          h: containerRef.current.offsetHeight || 1000,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Track mouse with CSS scale compensation & volumetric 3D depth
  useEffect(() => {
    isHoveredRef.current = isHovered;
    if (!containerRef.current || !isHovered || globalMouse.x < 0) {
      lastMouseRef.current = { x: -500, y: -500, time: 0 };
      parallaxTargetRef.current = { x: 0, y: 0, rotX: 0, rotY: 0, shadowX: 0, shadowY: 20 };
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Scale compensation factor: converts screen pixels -> local element SVG coordinates
    const scaleX = containerRef.current.offsetWidth / rect.width;
    const scaleY = containerRef.current.offsetHeight / rect.height;

    const localX = (globalMouse.x - rect.left) * scaleX;
    const localY = (globalMouse.y - rect.top) * scaleY;

    // Normalized mouse coordinates (-1 to +1 from center)
    const normX = Math.max(-1, Math.min(1, (localX / (containerRef.current.offsetWidth || 1000) - 0.5) * 2));
    const normY = Math.max(-1, Math.min(1, (localY / (containerRef.current.offsetHeight || 1000) - 0.5) * 2));

    // Volumetric 3D targets: natural head turn + bodily shift + lighting shadow response
    parallaxTargetRef.current = {
      x: normX * 8.5,
      y: normY * 5.5,
      rotX: -normY * 2.2, // Subtle pitch (max 2.2 deg)
      rotY: normX * 2.8,  // Subtle yaw (max 2.8 deg)
      shadowX: -normX * 14,
      shadowY: 20 - normY * 6,
    };

    const now = performance.now();
    const last = lastMouseRef.current;

    if (last.x === -500) {
      // First point on hover entry
      trailRef.current.unshift({
        x: localX,
        y: localY,
        baseR: 115,
        life: 1.0,
        decay: 0.038,
      });
      lastMouseRef.current = { x: localX, y: localY, time: now };
    } else {
      const dist = Math.hypot(localX - last.x, localY - last.y);
      if (dist >= 8) {
        // Sub-step interpolation so fast strokes form a continuous liquid ribbon
        const steps = Math.min(12, Math.max(1, Math.floor(dist / 10)));
        for (let s = 1; s <= steps; s++) {
          const ix = last.x + (localX - last.x) * (s / steps);
          const iy = last.y + (localY - last.y) * (s / steps);
          trailRef.current.unshift({
            x: ix,
            y: iy,
            baseR: 115,
            life: 1.0,
            decay: 0.038,
          });
        }
        lastMouseRef.current = { x: localX, y: localY, time: now };
      }
    }
  }, [globalMouse, isHovered]);

  // High-performance RAF loop: direct DOM mutation without React re-render churn
  useEffect(() => {
    let animId;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animId) {
          animId = requestAnimationFrame(updateMeshAndParallax);
        }
      },
      { threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const updateMeshAndParallax = () => {
      if (!isVisibleRef.current) {
        animId = null;
        return;
      }

      // 1. Smooth 3D Volumetric Inertia Interpolation
      const target = parallaxTargetRef.current;
      const curr = parallaxCurrentRef.current;
      curr.x += (target.x - curr.x) * 0.08;
      curr.y += (target.y - curr.y) * 0.08;
      curr.rotX += (target.rotX - curr.rotX) * 0.08;
      curr.rotY += (target.rotY - curr.rotY) * 0.08;
      curr.shadowX += (target.shadowX - curr.shadowX) * 0.08;
      curr.shadowY += (target.shadowY - curr.shadowY) * 0.08;

      if (visualWrapperRef.current) {
        visualWrapperRef.current.style.transform = `perspective(1800px) translate3d(${curr.x.toFixed(2)}px, ${curr.y.toFixed(2)}px, 12px) rotateX(${curr.rotX.toFixed(2)}deg) rotateY(${curr.rotY.toFixed(2)}deg)`;
      }

      // 2. Decay all existing trail points
      const active = [];
      for (let i = 0; i < trailRef.current.length; i++) {
        const p = trailRef.current[i];
        p.life -= p.decay;
        if (p.life > 0.02) {
          active.push(p);
        }
      }
      trailRef.current = active;

      const pts = trailRef.current;
      if (pts.length === 0) {
        if (maskPathRef.current) maskPathRef.current.setAttribute('d', 'M 0 0');
        if (shadowPathRef.current) shadowPathRef.current.setAttribute('d', '');
        if (helmetWrapperRef.current) helmetWrapperRef.current.style.opacity = '0';
        animId = requestAnimationFrame(updateMeshAndParallax);
        return;
      }

      let d = "";

      // 3. If single point: render a smooth circle
      if (pts.length === 1) {
        const p = pts[0];
        const r = p.baseR * Math.pow(p.life, 0.65);
        d = `M ${(p.x - r).toFixed(1)} ${p.y.toFixed(1)} a ${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0 a ${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0 Z`;
      } else {
        // 4. Build Organic Continuous Fluid Ribbon (Tapered from head P0 to tail Pn)
        const n = pts.length;
        const leftPts = [];
        const rightPts = [];

        for (let i = 0; i < n; i++) {
          const currPt = pts[i];
          let vx, vy;

          if (i === 0) {
            vx = currPt.x - pts[1].x;
            vy = currPt.y - pts[1].y;
          } else if (i === n - 1) {
            vx = pts[i - 1].x - currPt.x;
            vy = pts[i - 1].y - currPt.y;
          } else {
            vx = pts[i - 1].x - pts[i + 1].x;
            vy = pts[i - 1].y - pts[i + 1].y;
          }

          const len = Math.hypot(vx, vy) || 1;
          const nx = -vy / len;
          const ny = vx / len;

          const taperRatio = 1 - (i / n) * 0.78;
          const r = currPt.baseR * Math.pow(currPt.life, 0.6) * taperRatio;

          leftPts.push({ x: currPt.x + nx * r, y: currPt.y + ny * r });
          rightPts.push({ x: currPt.x - nx * r, y: currPt.y - ny * r });
        }

        const p0 = pts[0];
        const r0 = p0.baseR * Math.pow(p0.life, 0.6);
        const pn = pts[n - 1];
        const rn = pn.baseR * Math.pow(pn.life, 0.6) * 0.22;

        d = `M ${rightPts[0].x.toFixed(1)} ${rightPts[0].y.toFixed(1)}`;
        d += ` A ${r0.toFixed(1)} ${r0.toFixed(1)} 0 0 1 ${leftPts[0].x.toFixed(1)} ${leftPts[0].y.toFixed(1)}`;

        for (let i = 0; i < n - 1; i++) {
          const midX = (leftPts[i].x + leftPts[i + 1].x) / 2;
          const midY = (leftPts[i].y + leftPts[i + 1].y) / 2;
          d += ` Q ${leftPts[i].x.toFixed(1)} ${leftPts[i].y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
        }
        d += ` L ${leftPts[n - 1].x.toFixed(1)} ${leftPts[n - 1].y.toFixed(1)}`;

        d += ` A ${rn.toFixed(1)} ${rn.toFixed(1)} 0 0 1 ${rightPts[n - 1].x.toFixed(1)} ${rightPts[n - 1].y.toFixed(1)}`;

        for (let i = n - 1; i > 0; i--) {
          const midX = (rightPts[i].x + rightPts[i - 1].x) / 2;
          const midY = (rightPts[i].y + rightPts[i - 1].y) / 2;
          d += ` Q ${rightPts[i].x.toFixed(1)} ${rightPts[i].y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
        }
        d += ` L ${rightPts[0].x.toFixed(1)} ${rightPts[0].y.toFixed(1)} Z`;
      }

      if (maskPathRef.current) maskPathRef.current.setAttribute('d', d);
      if (shadowPathRef.current) shadowPathRef.current.setAttribute('d', d);
      if (helmetWrapperRef.current) helmetWrapperRef.current.style.opacity = '1';

      animId = requestAnimationFrame(updateMeshAndParallax);
    };

    animId = requestAnimationFrame(updateMeshAndParallax);
    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none pointer-events-none ${className}`}
    >
      {/* SVG ClipPath Definition matching container coordinates */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
      >
        <defs>
          <clipPath id="fluid-ribbon-mask">
            <path ref={maskPathRef} d="M 0 0" />
          </clipPath>
        </defs>
      </svg>

      {/* MATCHING LIQUID BACKDROP SHADOW */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
      >
        <path
          ref={shadowPathRef}
          d=""
          fill="#E5E3DB"
          opacity="0.8"
          style={{
            filter: 'blur(22px)',
          }}
        />
      </svg>

      {/* SUBTLE 2D MICRO-PARALLAX WRAPPER */}
      <div
        ref={visualWrapperRef}
        className="relative w-full h-full flex items-end justify-center pointer-events-none will-change-transform"
      >
        {/* 1. TOP LAYER: Charles Leclerc Clean Cutout - Responsive: elevated on mobile so face & shoulders are hero-focused */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none -translate-y-8 sm:translate-y-4 md:translate-y-14 scale-[1.38] sm:scale-105 md:scale-100 origin-bottom">
          <TransparentCutout
            src={topImage}
            alt="Charles Leclerc Top Face"
            className="max-h-[98%] md:max-h-[100%] max-w-full object-contain object-bottom filter brightness-[1.02] contrast-[1.04]"
          />
        </div>

        {/* 2. BOTTOM LAYER: Official Monaco GP Helmet */}
        <div
          ref={helmetWrapperRef}
          className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none -translate-y-8 sm:translate-y-4 md:translate-y-14 scale-[1.38] sm:scale-105 md:scale-100 origin-bottom transition-opacity duration-150"
          style={{
            clipPath: 'url(#fluid-ribbon-mask)',
            WebkitClipPath: 'url(#fluid-ribbon-mask)',
            opacity: 0,
          }}
        >
          <div className="w-full h-full flex items-end justify-center">
            <TransparentCutout
              src={bottomImage}
              alt="Charles Leclerc Official Monaco GP Helmet Worn"
              className="max-h-[98%] md:max-h-[100%] object-contain object-bottom filter brightness-[1.05] contrast-[1.12] drop-shadow-[0_20px_45px_rgba(225,6,0,0.4)] scale-[0.77] -translate-y-[9.5%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
