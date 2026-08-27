import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function KineticText({
  text,
  className = '',
  charClassName = '',
  tag = 'h2',
  delay = 0,
  stagger = 0.025,
  triggerHook = 'top 85%',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.kinetic-char');
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          yPercent: 110,
          rotateX: -80,
          transformOrigin: '50% 100%',
        },
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 0.85,
          stagger: stagger,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: triggerHook,
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
            invalidateOnRefresh: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text, delay, stagger, triggerHook]);

  // Split words and characters preserving spaces cleanly
  const words = text.split(' ');

  const Tag = tag;

  return (
    <Tag
      ref={containerRef}
      className={`inline-block overflow-hidden [perspective:1000px] select-none ${className}`}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className={`kinetic-char inline-block will-change-transform ${charClassName}`}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
