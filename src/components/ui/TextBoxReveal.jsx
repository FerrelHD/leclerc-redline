import React from 'react';
import { motion } from 'framer-motion';

export default function TextBoxReveal({
  children,
  text,
  delay = 0.2,
  duration = 0.55,
  boxColor = "#E10600",
  className = "",
  as = "div",
  once = false,
}) {
  const Component = as;
  const content = text || children;

  return (
    <Component className={`relative inline-block overflow-hidden align-middle ${className}`}>
      {/* 1. Underlying Text with entrance opacity */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: once, amount: 0.1 }}
        transition={{ delay: delay + duration * 0.35, duration: 0.15 }}
      >
        {content}
      </motion.div>

      {/* 2. Ferrari Red Box Wipe (Sweeps in from Left, Sweeps out to Right) */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{
          scaleX: [0, 1, 1, 0],
          originX: [0, 0, 1, 1],
        }}
        viewport={{ once: once, amount: 0.1 }}
        transition={{
          delay: delay,
          duration: duration,
          times: [0, 0.45, 0.55, 1],
          ease: [0.77, 0, 0.175, 1],
        }}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ backgroundColor: boxColor }}
      />
    </Component>
  );
}
