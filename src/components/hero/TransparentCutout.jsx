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

        // 1. BFS Flood fill from outer perimeter
        const visited = new Uint8Array(w * h);
        const queue = [];

        for (let x = 0; x < w; x++) {
          queue.push(x, 0);
          queue.push(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          queue.push(0, y);
          queue.push(w - 1, y);
        }

        const isBgPixel = (r, g, b) => {
          const isNeutral = Math.abs(r - g) <= 30 && Math.abs(g - b) <= 30 && Math.abs(r - b) <= 30;
          const isStudioBg = isNeutral && r >= 55;
          const isWhiteOrLight = r >= 175 && g >= 175 && b >= 175;
          return isStudioBg || isWhiteOrLight;
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

          if (isBgPixel(r, g, b)) {
            data[pIdx + 3] = 0; // 100% transparent

            if (px > 0 && !visited[idx - 1]) queue.push(px - 1, py);
            if (px < w - 1 && !visited[idx + 1]) queue.push(px + 1, py);
            if (py > 0 && !visited[idx - w]) queue.push(px, py - 1);
            if (py < h - 1 && !visited[idx + w]) queue.push(px, py + 1);
          }
        }

        // 2. Strict Top Hair Halo Cleanup (Zero stray white specks above hair)
        for (let y = 0; y < Math.round(h * 0.4); y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            const pIdx = idx * 4;

            if (data[pIdx + 3] > 0) {
              const r = data[pIdx];
              const g = data[pIdx + 1];
              const b = data[pIdx + 2];
              const brightness = (r + g + b) / 3;

              // Any light speck bordering transparent space in top 40% height is completely cleared
              if (brightness > 60) {
                const isNearTransparent =
                  (y > 0 && data[((y - 1) * w + x) * 4 + 3] === 0) ||
                  (x > 0 && data[(y * w + (x - 1)) * 4 + 3] === 0) ||
                  (x < w - 1 && data[(y * w + (x + 1)) * 4 + 3] === 0);

                if (isNearTransparent) {
                  data[pIdx + 3] = 0;
                }
              }
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
