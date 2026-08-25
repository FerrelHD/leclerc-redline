import React, { useEffect, useRef, useState } from 'react';

export default function TransparentCutout({ src = "/images/leclercface.jpe", alt = "Charles Leclerc", className = "" }) {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
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

        // Flood fill from perimeter to remove checkerboard
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
          const isGrey = r >= 170 && g >= 170 && b >= 170 && Math.abs(r - g) <= 15 && Math.abs(g - b) <= 15 && Math.abs(r - b) <= 15;
          const isWhite = r >= 238 && g >= 238 && b >= 238;
          return isGrey || isWhite;
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
            data[pIdx + 3] = 0; // Make transparent

            if (px > 0 && !visited[idx - 1]) queue.push(px - 1, py);
            if (px < w - 1 && !visited[idx + 1]) queue.push(px + 1, py);
            if (py > 0 && !visited[idx - w]) queue.push(px, py - 1);
            if (py < h - 1 && !visited[idx + w]) queue.push(px, py + 1);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsReady(true);
      } catch (err) {
        console.warn("Canvas transparency processing:", err);
        setIsReady(true);
      }
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full object-contain ${className}`}
      style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.2s ease-in' }}
    />
  );
}
