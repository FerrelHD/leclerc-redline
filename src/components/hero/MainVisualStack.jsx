import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import LiquidHelmetCanvas from './LiquidHelmetCanvas';

const MainVisualStack = forwardRef(function MainVisualStack(
  {
    topImage = '/images/leclercnewimage.webp',
    bottomImage = '/images/charles-helmet-monaco.webp',
    className = '',
    isHovered = false,
    forceFullReveal = false,
  },
  ref
) {
  const containerRef = useRef(null);
  const visualWrapperRef = useRef(null);
  const liquidCanvasRef = useRef(null);

  const isHoveredRef = useRef(isHovered);
  const isVisibleRef = useRef(true);

  // Volumetric 3D Studio Spatial Depth & Natural Camera Perspective refs
  const parallaxTargetRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0, shadowX: 0, shadowY: 20 });
  const parallaxCurrentRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0, shadowX: 0, shadowY: 20 });
  const animIdRef = useRef(null);

  const onPointerLeave = () => {
    parallaxTargetRef.current = { x: 0, y: 0, rotX: 0, rotY: 0, shadowX: 0, shadowY: 20 };
    liquidCanvasRef.current?.onPointerLeave();
    startParallaxLoop();
  };

  const onPointerMove = (clientX, clientY) => {
    if (!containerRef.current || !isHoveredRef.current || clientX < 0) {
      onPointerLeave();
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Normalized coordinates (-1 to +1 from center for 3D head/body parallax)
    const normX = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width - 0.5) * 2));
    const normY = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height - 0.5) * 2));

    // Volumetric 3D targets: natural head turn + bodily shift
    parallaxTargetRef.current = {
      x: normX * 8.5,
      y: normY * 5.5,
      rotX: -normY * 2.2, // Subtle pitch (max 2.2 deg)
      rotY: normX * 2.8,  // Subtle yaw (max 2.8 deg)
      shadowX: -normX * 14,
      shadowY: 20 - normY * 6,
    };

    // Normalized UV coordinates (0.0 to 1.0) for WebGL shader fluid trail
    const uvX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const uvY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    liquidCanvasRef.current?.onPointerMove(uvX, uvY);
    startParallaxLoop();
  };

  useImperativeHandle(ref, () => ({
    onPointerMove,
    onPointerLeave,
  }));

  // Synchronize hover state
  useEffect(() => {
    isHoveredRef.current = isHovered;
    if (!isHovered) {
      onPointerLeave();
    }
  }, [isHovered]);

  const startParallaxLoop = () => {
    if (isVisibleRef.current && !animIdRef.current) {
      animIdRef.current = requestAnimationFrame(updateParallax);
    }
  };

  const updateParallax = () => {
    if (!isVisibleRef.current) {
      animIdRef.current = null;
      return;
    }

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

    const isSettled =
      !isHoveredRef.current &&
      Math.abs(target.x - curr.x) < 0.05 &&
      Math.abs(target.y - curr.y) < 0.05 &&
      Math.abs(target.rotX - curr.rotX) < 0.05 &&
      Math.abs(target.rotY - curr.rotY) < 0.05;

    if (isSettled) {
      animIdRef.current = null;
      return;
    }

    animIdRef.current = requestAnimationFrame(updateParallax);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startParallaxLoop();
        } else if (animIdRef.current) {
          cancelAnimationFrame(animIdRef.current);
          animIdRef.current = null;
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    startParallaxLoop();

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      animIdRef.current = null;
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none pointer-events-none ${className}`}
    >
      {/* 3D MICRO-PARALLAX WRAPPER */}
      <div
        ref={visualWrapperRef}
        className="relative w-full h-full flex items-end justify-center pointer-events-none will-change-transform"
      >
        {/* RESPONSIVE HERO VISUAL WRAPPER: Elevated on mobile for portrait focus */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none -translate-y-8 sm:translate-y-4 md:translate-y-14 scale-[1.38] sm:scale-105 md:scale-100 origin-bottom">
          <LiquidHelmetCanvas
            ref={liquidCanvasRef}
            faceSrc={topImage}
            helmetSrc={bottomImage}
            isHovered={isHovered}
            forceFullReveal={forceFullReveal}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
});

export default React.memo(MainVisualStack);
