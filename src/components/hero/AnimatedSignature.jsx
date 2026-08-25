import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedSignature({ progress = 0, color = "#E10600" }) {
  const canvasRef = useRef(null);
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/images/leclerc-signature.png';
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

        // Parse hex color to target RGB
        const hex = color.replace('#', '');
        const rTarget = parseInt(hex.substring(0, 2), 16) || 225;
        const gTarget = parseInt(hex.substring(2, 4), 16) || 6;
        const bTarget = parseInt(hex.substring(4, 6), 16) || 0;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;

            // Remove bottom-left Google Lens watermark badge if present
            if (x < w * 0.15 && y > h * 0.75) {
              data[idx + 3] = 0;
              continue;
            }

            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const brightness = (r + g + b) / 3;

            // Detect signature ink stroke (dark pixels < 160)
            if (brightness < 160) {
              const inkStrength = Math.min(1, (160 - brightness) / 120);
              data[idx] = rTarget;
              data[idx + 1] = gTarget;
              data[idx + 2] = bTarget;
              data[idx + 3] = Math.min(255, inkStrength * 255 * 1.8);
            } else {
              // Checkerboard / white background -> 100% transparent
              data[idx + 3] = 0;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsProcessed(true);
      } catch (err) {
        console.warn("Signature canvas processing:", err);
        setIsProcessed(true);
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [color]);

  const clampedProgress = Math.min(1, Math.max(0, progress));
  const clipPercentage = (1 - clampedProgress) * 100;

  return (
    <div className="relative w-full h-full pointer-events-none select-none flex items-center justify-center">
      <div
        className="w-full max-w-[560px] aspect-[2/1] relative flex items-center justify-center transition-all duration-75 translate-y-12"
        style={{
          clipPath: `inset(0 ${clipPercentage}% 0 0)`,
          opacity: clampedProgress > 0.02 ? 1 : 0,
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_20px_rgba(225,6,0,0.55)]"
          style={{ opacity: isProcessed ? 1 : 0 }}
        />
      </div>
    </div>
  );
}
