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

        // BFS Flood fill to detect background
        const visited = new Uint8Array(w * h);
        const queue = [];

        // Seed all four borders
        for (let x = 0; x < w; x++) {
          queue.push(x, 0);
          queue.push(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          queue.push(0, y);
          queue.push(w - 1, y);
        }

        const isBgPixel = (r, g, b) => {
          // Studio background: neutral grey or white
          const isNeutral = Math.abs(r - g) <= 28 && Math.abs(g - b) <= 28 && Math.abs(r - b) <= 28;
          const isStudioBg = isNeutral && r >= 65;
          const isWhite = r >= 195 && g >= 195 && b >= 195;
          return isStudioBg || isWhite;
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
            data[pIdx + 3] = 0; // 100% transparent alpha

            if (px > 0 && !visited[idx - 1]) queue.push(px - 1, py);
            if (px < w - 1 && !visited[idx + 1]) queue.push(px + 1, py);
            if (py > 0 && !visited[idx - w]) queue.push(px, py - 1);
            if (py < h - 1 && !visited[idx + w]) queue.push(px, py + 1);
          }
        }

        // Second Pass: De-fringing Hair Edge Matting & Feathering
        // Cleans up any leftover white/grey halos around hair strands and blends softly
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;
            const pIdx = idx * 4;

            // Only check non-transparent pixels that border transparent background
            if (data[pIdx + 3] > 0) {
              const neighborTransparent =
                data[((y - 1) * w + x) * 4 + 3] === 0 ||
                data[((y + 1) * w + x) * 4 + 3] === 0 ||
                data[(y * w + (x - 1)) * 4 + 3] === 0 ||
                data[(y * w + (x + 1)) * 4 + 3] === 0;

              if (neighborTransparent) {
                const r = data[pIdx];
                const g = data[pIdx + 1];
                const b = data[pIdx + 2];
                const brightness = (r + g + b) / 3;

                // If edge pixel has light grey/white halo artifact (brightness > 80 near top hair area)
                if (brightness > 80 && y < h * 0.55) {
                  // Suppress white halo to natural dark hair tone and smooth alpha
                  const factor = Math.max(0, (brightness - 80) / 120);
                  data[pIdx] = Math.round(r * (1 - factor * 0.8) + 20 * factor * 0.8);
                  data[pIdx + 1] = Math.round(g * (1 - factor * 0.8) + 16 * factor * 0.8);
                  data[pIdx + 2] = Math.round(b * (1 - factor * 0.8) + 14 * factor * 0.8);
                  data[pIdx + 3] = Math.round(data[pIdx + 3] * (1 - factor * 0.5));
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
