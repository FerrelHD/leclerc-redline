import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  MAX_TRAIL_POINTS,
  VERTEX_SHADER_SOURCE,
  FRAGMENT_SHADER_SOURCE,
  createProgram,
  loadTexture,
} from './liquidShader';

const LiquidHelmetCanvas = forwardRef(function LiquidHelmetCanvas(
  {
    faceSrc = '/images/leclercnewimage.webp',
    helmetSrc = '/images/charles-helmet-monaco.webp',
    isHovered = false,
    forceFullReveal = false,
    className = 'w-full h-full',
  },
  ref
) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const texturesRef = useRef({ face: null, helmet: null });
  const uniformsRef = useRef({});
  const animIdRef = useRef(null);

  // Fluid physics & trail state
  const trailRef = useRef([]);
  const lastPointerRef = useRef({ x: -1, y: -1, time: 0 });
  const revealProgressRef = useRef(0.0);
  const isHoveredRef = useRef(isHovered);
  const forceFullRevealRef = useRef(forceFullReveal);
  const isVisibleRef = useRef(true);
  const isLoadedRef = useRef(false);

  // Trail buffer for gl.uniform4fv
  const trailBufferRef = useRef(new Float32Array(MAX_TRAIL_POINTS * 4));

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    forceFullRevealRef.current = forceFullReveal;
    // Wake up render loop to animate reveal transition
    startLoop();
  }, [forceFullReveal]);

  const onPointerMove = (normX, normY) => {
    if (!isHoveredRef.current || normX < 0 || normX > 1 || normY < 0 || normY > 1) {
      onPointerLeave();
      return;
    }

    const now = performance.now();
    const last = lastPointerRef.current;

    // Radius in normalized UV coordinates (approx ~120px on 1000px height -> 0.12)
    const baseRadius = 0.135;

    if (last.x < 0) {
      trailRef.current.unshift({
        x: normX,
        y: normY,
        r: baseRadius,
        life: 1.0,
        decay: 0.032,
      });
      lastPointerRef.current = { x: normX, y: normY, time: now };
    } else {
      const dist = Math.hypot(normX - last.x, normY - last.y);
      if (dist >= 0.008) {
        // Sub-step interpolation for continuous ribbon flow on fast strokes
        const steps = Math.min(10, Math.max(1, Math.floor(dist / 0.012)));
        for (let s = 1; s <= steps; s++) {
          const ix = last.x + (normX - last.x) * (s / steps);
          const iy = last.y + (normY - last.y) * (s / steps);
          trailRef.current.unshift({
            x: ix,
            y: iy,
            r: baseRadius,
            life: 1.0,
            decay: 0.032,
          });
        }
        lastPointerRef.current = { x: normX, y: normY, time: now };
      }
    }

    // Cap maximum active points
    if (trailRef.current.length > MAX_TRAIL_POINTS) {
      trailRef.current.length = MAX_TRAIL_POINTS;
    }

    startLoop();
  };

  const onPointerLeave = () => {
    lastPointerRef.current = { x: -1, y: -1, time: 0 };
  };

  useImperativeHandle(ref, () => ({
    onPointerMove,
    onPointerLeave,
  }));

  const startLoop = () => {
    if (isVisibleRef.current && !animIdRef.current) {
      animIdRef.current = requestAnimationFrame(render);
    }
  };

  const stopLoop = () => {
    if (animIdRef.current) {
      cancelAnimationFrame(animIdRef.current);
      animIdRef.current = null;
    }
  };

  const render = () => {
    const gl = glRef.current;
    if (!gl || !isLoadedRef.current) {
      animIdRef.current = null;
      return;
    }

    // 1. Decay trail points
    const active = [];
    for (let i = 0; i < trailRef.current.length; i++) {
      const p = trailRef.current[i];
      p.life -= p.decay;
      if (p.life > 0.015) {
        active.push(p);
      }
    }
    trailRef.current = active;

    // 2. Smoothly animate reveal progress (for mobile toggle)
    const targetReveal = forceFullRevealRef.current ? 1.0 : 0.0;
    revealProgressRef.current += (targetReveal - revealProgressRef.current) * 0.12;
    if (Math.abs(targetReveal - revealProgressRef.current) < 0.001) {
      revealProgressRef.current = targetReveal;
    }

    // 3. Upload uniforms
    const u = uniformsRef.current;
    gl.useProgram(programRef.current);

    gl.uniform1f(u.u_time, performance.now() * 0.001);
    gl.uniform1f(u.u_revealProgress, revealProgressRef.current);

    // Pack trail into float array
    const buf = trailBufferRef.current;
    const count = Math.min(active.length, MAX_TRAIL_POINTS);
    for (let i = 0; i < count; i++) {
      const p = active[i];
      const offset = i * 4;
      buf[offset + 0] = p.x;
      buf[offset + 1] = p.y;
      buf[offset + 2] = p.r;
      buf[offset + 3] = p.life;
    }
    gl.uniform1i(u.u_trailCount, count);
    if (count > 0) {
      gl.uniform4fv(u.u_trail, buf);
    }

    // 4. Draw screen quad
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // 5. Idle sleep detection: if not hovered, trail is gone, and reveal is settled -> sleep RAF
    const isSettled =
      !isHoveredRef.current &&
      active.length === 0 &&
      (revealProgressRef.current === 0.0 || revealProgressRef.current === 1.0);

    if (isSettled) {
      animIdRef.current = null;
      return;
    }

    animIdRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      console.warn('WebGL not supported for Liquid Helmet Reveal');
      return;
    }
    glRef.current = gl;

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let program;
    try {
      program = createProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
      programRef.current = program;
      gl.useProgram(program);
    } catch (err) {
      console.error('Failed to create WebGL program:', err);
      return;
    }

    // Setup Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations
    uniformsRef.current = {
      u_texFace: gl.getUniformLocation(program, 'u_texFace'),
      u_texHelmet: gl.getUniformLocation(program, 'u_texHelmet'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_revealProgress: gl.getUniformLocation(program, 'u_revealProgress'),
      u_faceAspect: gl.getUniformLocation(program, 'u_faceAspect'),
      u_helmetAspect: gl.getUniformLocation(program, 'u_helmetAspect'),
      u_helmetTransform: gl.getUniformLocation(program, 'u_helmetTransform'),
      u_trailCount: gl.getUniformLocation(program, 'u_trailCount'),
      u_trail: gl.getUniformLocation(program, 'u_trail'),
    };

    // Bind texture units
    gl.uniform1i(uniformsRef.current.u_texFace, 0);
    gl.uniform1i(uniformsRef.current.u_texHelmet, 1);

    // Default transformation for Monaco GP helmet alignment on Charles's face
    gl.uniform2f(uniformsRef.current.u_faceAspect, 1350.0, 1125.0);
    gl.uniform2f(uniformsRef.current.u_helmetAspect, 1018.0, 1018.0);
    // Helmet scale = 0.77, offsetY = 0.095 (anchored from bottom, shifted up)
    gl.uniform2f(uniformsRef.current.u_helmetTransform, 0.77, 0.095);

    // Load textures
    let isDisposed = false;
    Promise.all([loadTexture(gl, faceSrc), loadTexture(gl, helmetSrc)])
      .then(([faceTexData, helmetTexData]) => {
        if (isDisposed) return;
        texturesRef.current = {
          face: faceTexData.texture,
          helmet: helmetTexData.texture,
        };

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, faceTexData.texture);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, helmetTexData.texture);

        isLoadedRef.current = true;
        handleResize();
        startLoop();
      })
      .catch((err) => {
        console.error('Error loading liquid helmet textures:', err);
      });

    // Responsive Canvas Resize
    const handleResize = () => {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 1000;
      const h = canvas.clientHeight || 1000;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(uniformsRef.current.u_resolution, canvas.width, canvas.height);

      startLoop();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      isDisposed = true;
      stopLoop();
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (texturesRef.current.face) gl.deleteTexture(texturesRef.current.face);
      if (texturesRef.current.helmet) gl.deleteTexture(texturesRef.current.helmet);
      if (program) gl.deleteProgram(program);
    };
  }, [faceSrc, helmetSrc]);

  return (
    <canvas
      ref={canvasRef}
      className={`relative w-full h-full pointer-events-none ${className}`}
      style={{ display: 'block' }}
    />
  );
});

export default React.memo(LiquidHelmetCanvas);
