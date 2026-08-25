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
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;

        // Flood fill from all 4 corners to remove the background checkerboard
        const visited = new Uint8Array(w * h);
        const queue = [];

        // Push perimeter points
        for (let x = 0; x < w; x++) {
          queue.push(x, 0);
          queue.push(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          queue.push(0, y);
          queue.push(w - 1, y);
        }

        const isBgPixel = (r, g, b) => {
          // Checkerboard is pure white (255,255,255) and grey (~192-220,192-220,192-220)
          const isGrey = r >= 170 && g >= 170 && b >= 170 && Math.abs(r - g) <= 12 && Math.abs(g - b) <= 12 && Math.abs(r - b) <= 12;
          const isWhite = r >= 240 && g >= 240 && b >= 240;
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

            // Check 4 neighbors
            if (px > 0 && !visited[idx - 1]) queue.push(px - 1, py);
            if (px < w - 1 && !visited[idx + 1]) queue.push(px + 1, py);
            if (py > 0 && !visited[idx - w]) queue.push(px, py - 1);
            if (py < h - 1 && !visited[idx + w]) queue.push(px, py + 1);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsReady(true);
      } catch (err) {
        console.warn("Canvas transparency fallback:", err);
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
