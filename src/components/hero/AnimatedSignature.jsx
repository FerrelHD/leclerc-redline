import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedSignature({ progress = 0, color = "#E10600" }) {
  const canvasRef = useRef(null);
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/images/leclerc-signature.png';
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

        // Parse hex color into RGB
        const hex = color.replace('#', '');
        const rTarget = parseInt(hex.substring(0, 2), 16) || 225;
        const gTarget = parseInt(hex.substring(2, 4), 16) || 6;
        const bTarget = parseInt(hex.substring(4, 6), 16) || 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;

          // If pixel is dark ink (stroke of signature)
          if (brightness < 180) {
            const opacity = 1 - (brightness / 180);
            data[i] = rTarget;
            data[i + 1] = gTarget;
            data[i + 2] = bTarget;
            data[i + 3] = Math.min(255, opacity * 255 * 1.5);
          } else {
            // Checkerboard/white background -> 100% transparent
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsProcessed(true);
      } catch (err) {
        console.warn("Signature canvas processing:", err);
        setIsProcessed(true);
      }
    };
  }, [color]);

  // Clamp progress between 0 and 1
  const clampedProgress = Math.min(1, Math.max(0, progress));
  // Reveal percentage from left to right (0% to 100%)
  const clipPercentage = (1 - clampedProgress) * 100;

  return (
    <div className="relative w-full h-full pointer-events-none select-none flex items-center justify-center p-8">
      <div
        className="w-full max-w-[480px] aspect-[2/1] relative flex items-center justify-center transition-all duration-75"
        style={{
          clipPath: `inset(0 ${clipPercentage}% 0 0)`,
          opacity: clampedProgress > 0.02 ? 1 : 0,
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(225,6,0,0.4)]"
          style={{ opacity: isProcessed ? 1 : 0 }}
        />
      </div>
    </div>
  );
}
