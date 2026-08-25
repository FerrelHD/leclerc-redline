import React, { useEffect, useRef, useState } from 'react';

export default function TransparentCutout({ src = "/images/leclercface.jpe", alt = "Cutout", className = "" }) {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      if (isCancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);

      try {
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        const isHelmet = src.includes('helmet');

        // BFS Flood fill strictly for external background
        const visited = new Uint8Array(w * h);
        const queue = [];

        if (isHelmet) {
          // Helmet: seed all 4 outer edges
          for (let x = 0; x < w; x++) {
            queue.push(x, 0);
            queue.push(x, h - 1);
          }
          for (let y = 0; y < h; y++) {
            queue.push(0, y);
            queue.push(w - 1, y);
          }
        } else {
          // Charles Portrait: ONLY seed top edge and upper side edges (NEVER bottom or lower jacket)
          for (let x = 0; x < w; x++) {
            queue.push(x, 0);
          }
          for (let y = 0; y < Math.round(h * 0.6); y++) {
            queue.push(0, y);
            queue.push(w - 1, y);
          }
        }

        const isBgPixel = (px, py, r, g, b) => {
          if (isHelmet) {
            // Only pure white outer background
            return r >= 246 && g >= 246 && b >= 246;
          } else {
            // Protect jacket: NEVER mask pixels in the lower jacket region (py > 65% height)
            if (py > h * 0.62) {
              return false;
            }

            // Studio neutral background detection around head & upper shoulders
            const isNeutral = Math.abs(r - g) <= 22 && Math.abs(g - b) <= 22 && Math.abs(r - b) <= 22;
            const isStudioBg = isNeutral && r >= 135 && r <= 245;
            const isPureWhite = r >= 225 && g >= 225 && b >= 225;

            return isStudioBg || isPureWhite;
          }
        };

        let head = 0;
        while (head < queue.length) {
          const px = queue[head++];
          const py = queue[head++];
          const idx = py * w + px;

          if (visited[idx]) continue;
          visited[idx] = 1;

          const pIdx = idx * 4;
          const r = data[pIdx];
          const g = data[pIdx + 1];
          const b = data[pIdx + 2];

          if (isBgPixel(px, py, r, g, b)) {
            data[pIdx + 3] = 0; // 100% transparent background

            if (px > 0 && !visited[idx - 1]) queue.push(px - 1, py);
            if (px < w - 1 && !visited[idx + 1]) queue.push(px + 1, py);
            if (py > 0 && !visited[idx - w]) queue.push(px, py - 1);
            // Do not let flood fill expand deep down into the jacket
            if (py < h - 1 && !visited[idx + w] && (isHelmet || py < h * 0.65)) {
              queue.push(px, py + 1);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsReady(true);
      } catch (err) {
        console.warn("Canvas transparency processing:", err);
        setIsReady(true);
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full object-contain ${className}`}
      style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.15s ease-in' }}
    />
  );
}
