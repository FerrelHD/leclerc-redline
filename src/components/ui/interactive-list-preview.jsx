// Built using Hyperiux Vault: https://vault.hyperiux.com

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const DEFAULT_IMAGE_Z_INDEX = 10;
const DEFAULT_IMAGE_SIZE = 1;
const DEFAULT_DURATION = 0.6;
const DEFAULT_SMOOTHNESS = 0.35;
const DEFAULT_LERP = 0.18;
const DEFAULT_ITEMS = [
  { client: "AURORA UI", platform: "NEXT.JS", services: "Motion Design, GSAP, Page Transitions, UI Systems", img: "/images/monaco-track.jpg" },
  { client: "NEON FLOW", platform: "REACT", services: "Interactive UI, Scroll Animations, Effects Library", img: "/images/sparks.jpg" },
  { client: "GLASSMORPH", platform: "NEXT.JS", services: "Glass UI, Components, Motion Architecture", img: "/images/pitstop.jpg" },
  { client: "VOID SYSTEM", platform: "CUSTOM WEBGL", services: "Shaders, Creative Development, Visual Effects", img: "/images/steering-wheel.jpg" },
  { client: "HYPER SCROLL", platform: "FRAMER MOTION", services: "Scroll Storytelling, Motion Systems, Interactions", img: "/images/celebration.jpg" },
  { client: "PIXEL GRID", platform: "TAILWIND CSS", services: "Design Systems, UI Engineering, Responsive Layouts", img: "/images/tifosi.jpg" },
  { client: "MOTION CORE", platform: "HEADLESS CMS", services: "Reusable Components, Motion Engine, Performance", img: "/images/charles-on-track.jpg" },
  { client: "INTERFACE X", platform: "NEXT.JS", services: "Immersive UI, Creative Coding, Transitions, Effects", img: "/images/charles-portrait.jpg" },
  { client: "HYPERIUX", platform: "UI LIBRARY", services: "Animations, Interactive Components, Futuristic Experiences", img: "/images/leclercmain.jpg" },
];

const BASE_IMAGE_WIDTH_REM = 19.5;
const BASE_IMAGE_HEIGHT_REM = 22.5;
const IMAGE_OFFSET_MULTIPLIER = 20;
const ACTIVE_ROW_TEXT_COLOR = "#000000";
const INACTIVE_ROW_TEXT_COLOR = "#ffffff";
const IMAGE_HIDDEN_CLIP_PATH = "inset(50%)";
const IMAGE_VISIBLE_CLIP_PATH = "inset(0%)";
const IMAGE_VISIBILITY_HIDDEN = "hidden";
const IMAGE_VISIBILITY_VISIBLE = "visible";

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(number, min), max);
}

export default function InteractiveListPreview({
  items = DEFAULT_ITEMS,
  imageSize = DEFAULT_IMAGE_SIZE,
  duration = DEFAULT_DURATION,
  smoothness = DEFAULT_SMOOTHNESS,
  lerp = DEFAULT_LERP,
  bgColor = "transparent",
  className = "",
}) {
  const imageRefs = useRef([]);
  const imageContainerRef = useRef(null);
  const tableRef = useRef(null);
  const highlightRef = useRef(null);
  const rowRefs = useRef({});
  const pendingLeaveRef = useRef({});
  const tweenGenerationRef = useRef({});
  const activeIndexRef = useRef(null);
  const zIndexRef = useRef(DEFAULT_IMAGE_Z_INDEX);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const reduceMotionRef = useRef(
    typeof window !== "undefined" &&
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false)
  );
  const safeImageSize = clampNumber(imageSize, 0.5, 2, DEFAULT_IMAGE_SIZE);
  const safeDuration = clampNumber(duration, 0.1, 2, DEFAULT_DURATION);
  const safeSmoothness = clampNumber(smoothness, 0.05, 1.5, DEFAULT_SMOOTHNESS);
  const safeLerp = clampNumber(lerp, 0.02, 1, DEFAULT_LERP);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const onChange = (event) => {
      reduceMotionRef.current = event.matches;
      if (event.matches && imageContainerRef.current) {
        gsap.killTweensOf(imageContainerRef.current);
        gsap.set(imageContainerRef.current, { x: 0, y: 0 });
        pointerTargetRef.current = { x: 0, y: 0 };
        pointerCurrentRef.current = { x: 0, y: 0 };
      }
    };

    reduceMotionRef.current = mq.matches;
    if (mq.matches && imageContainerRef.current) {
      gsap.set(imageContainerRef.current, { x: 0, y: 0 });
      pointerTargetRef.current = { x: 0, y: 0 };
      pointerCurrentRef.current = { x: 0, y: 0 };
    }
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let frameId;

    const tick = () => {
      const imageContainer = imageContainerRef.current;

      if (imageContainer && !reduceMotionRef.current) {
        const current = pointerCurrentRef.current;
        const target = pointerTargetRef.current;

        current.x += (target.x - current.x) * safeLerp;
        current.y += (target.y - current.y) * safeLerp;

        gsap.set(imageContainer, {
          x: current.x,
          y: current.y,
        });
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [safeLerp]);

  useEffect(() => {
    imageRefs.current.forEach((imageElement) => {
      if (!imageElement) return;

      if (reduceMotionRef.current) {
        // Reduced-motion: opacity only — keep full clip, start hidden.
        gsap.set(imageElement, {
          clipPath: IMAGE_VISIBLE_CLIP_PATH,
          opacity: 0,
          visibility: IMAGE_VISIBILITY_HIDDEN,
        });
      } else {
        gsap.set(imageElement, {
          clipPath: IMAGE_HIDDEN_CLIP_PATH,
          visibility: IMAGE_VISIBILITY_HIDDEN,
        });
      }
    });

    if (!highlightRef.current) return;

    gsap.set(highlightRef.current, {
      opacity: 0,
      y: 0,
      height: 0,
    });
  }, []);

  const getNextTweenGeneration = (index) => {
    tweenGenerationRef.current[index] =
      (tweenGenerationRef.current[index] || 0) + 1;

    return tweenGenerationRef.current[index];
  };

  const setImageRef = (index, element) => {
    imageRefs.current[index] = element;
  };

  const setRowTextColor = (index, color) => {
    const rowElement = rowRefs.current[index];

    if (!rowElement) return;

    gsap.to(rowElement.querySelectorAll("td"), {
      color,
      duration: safeSmoothness,
      ease: "power2.out",
      overwrite: "auto",
    });

    // Also toggle any child spans with subtle text color
    gsap.to(rowElement.querySelectorAll(".sub-text"), {
      color: color === ACTIVE_ROW_TEXT_COLOR ? "#333333" : "rgba(255, 255, 255, 0.4)",
      duration: safeSmoothness,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const moveHighlightToRow = (rowElement) => {
    const tableElement = tableRef.current;
    const highlightElement = highlightRef.current;

    if (!tableElement || !highlightElement || !rowElement) return;

    const tableBounds = tableElement.getBoundingClientRect();
    const rowBounds = rowElement.getBoundingClientRect();

    gsap.to(highlightElement, {
      y: rowBounds.top - tableBounds.top,
      height: rowBounds.height,
      opacity: 1,
      duration: safeSmoothness,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const animateImageOut = (index) => {
    const imageElement = imageRefs.current[index];

    if (!imageElement) return;

    const tweenGeneration = getNextTweenGeneration(index);
    const reduceMotion = reduceMotionRef.current;

    gsap.killTweensOf(imageElement);

    gsap.to(imageElement, {
      ...(reduceMotion
        ? { opacity: 0 }
        : { clipPath: IMAGE_HIDDEN_CLIP_PATH, opacity: 0 }),
      duration: reduceMotion ? Math.min(safeSmoothness, 0.35) : safeDuration,
      ease: reduceMotion ? "power2.out" : "power3.inOut",
      onComplete: () => {
        if (tweenGenerationRef.current[index] !== tweenGeneration) return;

        gsap.set(imageElement, {
          visibility: IMAGE_VISIBILITY_HIDDEN,
        });
      },
    });
  };

  const onRowEnter = (rowElement, index) => {
    const imageElement = imageRefs.current[index];

    if (!imageElement) return;

    const reduceMotion = reduceMotionRef.current;
    const previousIndex = activeIndexRef.current;

    pendingLeaveRef.current[index] = false;
    rowRefs.current[index] = rowElement;

    // Reduced-motion: only one image at a time — fade the previous out first.
    if (reduceMotion && previousIndex !== null && previousIndex !== index) {
      pendingLeaveRef.current[previousIndex] = false;
      animateImageOut(previousIndex);
    }

    zIndexRef.current += 1;

    const tweenGeneration = getNextTweenGeneration(index);

    gsap.killTweensOf(imageElement);

    if (reduceMotion) {
      gsap.set(imageElement, {
        zIndex: zIndexRef.current,
        visibility: IMAGE_VISIBILITY_VISIBLE,
        clipPath: IMAGE_VISIBLE_CLIP_PATH,
        opacity: 0,
      });

      gsap.to(imageElement, {
        opacity: 1,
        duration: Math.min(safeSmoothness, 0.35),
        ease: "power2.out",
        onComplete: () => {
          if (tweenGenerationRef.current[index] !== tweenGeneration) return;
          if (!pendingLeaveRef.current[index]) return;

          pendingLeaveRef.current[index] = false;
          animateImageOut(index);
        },
      });
    } else {
      gsap.set(imageElement, {
        zIndex: zIndexRef.current,
        visibility: IMAGE_VISIBILITY_VISIBLE,
        clipPath: IMAGE_HIDDEN_CLIP_PATH,
        opacity: 1,
      });

      gsap.to(imageElement, {
        clipPath: IMAGE_VISIBLE_CLIP_PATH,
        opacity: 1,
        duration: safeDuration,
        ease: "power2.inOut",
        onComplete: () => {
          if (tweenGenerationRef.current[index] !== tweenGeneration) return;
          if (!pendingLeaveRef.current[index]) return;

          pendingLeaveRef.current[index] = false;
          animateImageOut(index);
        },
      });
    }

    if (previousIndex !== null && previousIndex !== index) {
      setRowTextColor(previousIndex, INACTIVE_ROW_TEXT_COLOR);
    }

    activeIndexRef.current = index;

    setRowTextColor(index, ACTIVE_ROW_TEXT_COLOR);
    moveHighlightToRow(rowElement);
  };

  const onRowLeave = (index) => {
    const imageElement = imageRefs.current[index];

    if (!imageElement) return;

    if (gsap.isTweening(imageElement)) {
      pendingLeaveRef.current[index] = true;
      return;
    }

    animateImageOut(index);
  };

  const onTableLeave = () => {
    if (activeIndexRef.current !== null) {
      setRowTextColor(activeIndexRef.current, INACTIVE_ROW_TEXT_COLOR);
      activeIndexRef.current = null;
    }

    if (!highlightRef.current) return;

    gsap.to(highlightRef.current, {
      opacity: 0,
      duration: safeSmoothness,
      ease: "power2.out",
      overwrite: "auto",
    });

    pointerTargetRef.current = { x: 0, y: 0 };
  };

  const onMouseMove = (event) => {
    // Reduced-motion: no cursor parallax on the preview images.
    if (reduceMotionRef.current) return;
    if (!imageContainerRef.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerTargetRef.current = {
      x: x * IMAGE_OFFSET_MULTIPLIER,
      y: y * IMAGE_OFFSET_MULTIPLIER,
    };
  };

  return (
    <>
      {!isCoarsePointer && (
        <div
          style={{ backgroundColor: bgColor }}
          className={`relative w-full overflow-hidden font-mono text-white ${className}`}
          onMouseMove={onMouseMove}
        >
          {/* Sliding White Row Highlight Pill */}
          <div
            ref={highlightRef}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-white"
          />

          {/* Floating Hover Preview Image Container */}
          <div
            ref={imageContainerRef}
            className="pointer-events-none absolute inset-0 z-20"
            style={{ mixBlendMode: "difference" }}
          >
            {items.map((item, index) => (
              <div
                key={`${item.client}-${index}`}
                ref={(element) => setImageRef(index, element)}
                className="invisible absolute left-[40%] top-1/2 -translate-y-1/2"
                style={{
                  width: `${BASE_IMAGE_WIDTH_REM * safeImageSize}rem`,
                  height: `${BASE_IMAGE_HEIGHT_REM * safeImageSize}rem`,
                  willChange: "clip-path, opacity",
                  zIndex: DEFAULT_IMAGE_Z_INDEX,
                }}
              >
                <img
                  src={item.img}
                  alt={item.client}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <div
            ref={tableRef}
            className="relative w-full"
            onMouseLeave={onTableLeave}
          >
            <table className="relative z-30 w-full table-fixed border-collapse">
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>

              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={`${item.client}-${index}`}
                    className="border-b border-white/[0.08] transition-colors cursor-pointer"
                    onMouseEnter={(event) =>
                      onRowEnter(event.currentTarget, index)
                    }
                    onMouseLeave={() => onRowLeave(index)}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-xs uppercase tracking-widest font-bold">
                      {item.client}
                      {item.date && (
                        <span className="sub-text block text-[10px] text-white/40 tracking-normal mt-0.5">
                          {item.date}
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-xs uppercase tracking-widest font-extrabold">
                      {item.platform}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-xs uppercase tracking-widest">
                      <span className="sub-text text-white/60">
                        {item.circuit || item.services}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-xs uppercase tracking-widest text-right">
                      {item.status || item.services}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={4} className="p-0" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isCoarsePointer && (
        <div style={{ backgroundColor: bgColor }} className={`w-full font-mono text-white ${className}`}>
          {items.map((item, index) => (
            <div key={`${item.client}-${index}`} className="flex border-b border-white/10">
              <div className="flex w-1/2 flex-col justify-between gap-3 p-4">
                <div className="flex flex-col gap-1">
                  <p className="font-bold uppercase tracking-widest max-md:text-sm max-[1025px]:text-xl">
                    {item.client}
                  </p>

                  {item.platform && (
                    <p className="uppercase tracking-widest text-white/70 max-md:text-xs max-[1025px]:text-lg font-semibold">
                      {item.platform}
                    </p>
                  )}

                  <p className="leading-relaxed text-white/50 max-md:text-xs max-[1025px]:text-base">
                    {item.circuit || item.services}
                  </p>
                </div>

                {item.status && (
                  <p className="text-[10px] text-[#E10600] font-bold uppercase tracking-wider">
                    {item.status}
                  </p>
                )}
              </div>

              <div className="relative aspect-3/4 h-full w-1/2 max-[1025px]:h-[25vh]">
                <img
                  src={item.img}
                  alt={item.client}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
