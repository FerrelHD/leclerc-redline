import React from 'react';

export default function TransparentCutout({
  src = "/images/leclercnewimage.webp",
  alt = "Cutout",
  className = ""
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`w-full h-full object-contain ${className}`}
    />
  );
}
