import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

/**
 * InteractiveNeuralVortex
 * High-performance WebGL GLSL shader simulating organic aerodynamic fluid vortex wake.
 * Calibrated for Charles Leclerc Redline luxury aesthetic:
 * - Pure white background (#FFFFFF)
 * - Subtle graphite/charcoal grey aerodynamic streamlines
 * - Real-time velocity-driven vortex curl and Ferrari Redline shear shimmer
 */
const InteractiveNeuralVortex = forwardRef(function InteractiveNeuralVortex(
  {
    className = 'absolute inset-0 w-full h-full pointer-events-none z-0',
    children,
    fluidTone = 'charcoal',
  },
  ref
) {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: 0.5, y: 0.5, tX: 0.5, tY: 0.5 });
  const velocityRef = useRef({ x: 0, y: 0, tX: 0, tY: 0, speed: 0 });
  const wakeIntensityRef = useRef(0.0);
  const lastPosRef = useRef({ x: 0.5, y: 0.5, time: 0 });
  const isHoveredRef = useRef(false);

  const onPointerMove = (clientX, clientY) => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const normX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, 1.0 - (clientY - rect.top) / rect.height));

    const now = performance.now();
    const dt = Math.max(8, Math.min(60, now - (lastPosRef.current.time || now)));

    const dx = normX - lastPosRef.current.x;
    const dy = normY - lastPosRef.current.y;
    lastPosRef.current = { x: normX, y: normY, time: now };

    // Velocity in normalized units per 100ms
    const vx = (dx / dt) * 100.0;
    const vy = (dy / dt) * 100.0;
    const rawSpeed = Math.hypot(vx, vy);

    velocityRef.current.tX = Math.max(-2.5, Math.min(2.5, vx));
    velocityRef.current.tY = Math.max(-2.5, Math.min(2.5, vy));
    wakeIntensityRef.current = Math.min(1.0, wakeIntensityRef.current + Math.min(0.45, rawSpeed * 0.4));

    pointer.current.tX = normX;
    pointer.current.tY = normY;
    isHoveredRef.current = true;
  };

  const onPointerLeave = () => {
    isHoveredRef.current = false;
    velocityRef.current.tX = 0;
    velocityRef.current.tY = 0;
  };

  useImperativeHandle(ref, () => ({
    onPointerMove,
    onPointerLeave,
  }));

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const gl =
      canvasEl.getContext('webgl', { alpha: false, antialias: true }) ||
      canvasEl.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported for Neural Vortex');
      return;
    }

    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Inverted for White Background with Aerodynamic Fluid Vortex Wake
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform vec2 u_pointer_velocity;
      uniform float u_pointer_speed;
      uniform float u_wake_intensity;
      uniform float u_scroll_progress;
      
      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }
      
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 7; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2);
        }
        return res.x + res.y;
      }
      
      void main() {
        vec2 uv = .5 * vUv;
        uv.x *= u_ratio;

        // Relative vector to pointer with aspect ratio correction
        vec2 pointerDelta = vUv - u_pointer_position;
        pointerDelta.x *= u_ratio;
        float dist = length(pointerDelta);

        // Aerodynamic vortex wake deflection:
        // When cursor moves, the air around it curls into a vortex slipstream
        float wakeRadius = 0.42;
        float wakeFactor = smoothstep(wakeRadius, 0.0, dist) * u_wake_intensity;

        // Tangential curl (perpendicular swirl around pointer)
        vec2 curl = vec2(-pointerDelta.y, pointerDelta.x) * (2.8 * u_pointer_speed);
        // Linear velocity slipstream drag
        vec2 slipstream = u_pointer_velocity * 1.6;

        vec2 deflection = (curl + slipstream) * wakeFactor;
        vec2 deflectedUv = uv - deflection * 0.28;

        float p = clamp(dist, 0., 1.);
        p = .5 * pow(1. - p, 2.) + wakeFactor * (1.2 + 2.0 * u_pointer_speed);

        float speedBoost = u_pointer_speed * wakeFactor * 1.5;
        float t = .0008 * u_time + speedBoost;
        
        float noise = neuro_shape(deflectedUv, t, p);
        noise = 1.05 * pow(noise, 2.6);
        noise = max(0.0, noise - 0.32);
        noise *= (1.0 - length(vUv - 0.5) * 0.4);
        
        // Base Luxury Palette: Pure White Background (#FFFFFF)
        vec3 bgColor = vec3(1.0, 1.0, 1.0);
        
        // Fluid Palette: Sophisticated Aerodynamic Graphite / Titanium Grey
        vec3 fluidColor = vec3(0.32, 0.32, 0.35);
        fluidColor = mix(fluidColor, vec3(0.52, 0.52, 0.56), 0.35 + 0.15 * sin(2.0 * u_scroll_progress + 1.2));
        
        // Subtle Ferrari Racing Redline shear glow on rapid aerodynamic wakes
        float shearStress = smoothstep(0.18, 0.02, dist) * u_pointer_speed * u_wake_intensity;
        vec3 redlineWarmth = vec3(0.85, 0.06, 0.02);
        fluidColor = mix(fluidColor, redlineWarmth, clamp(shearStress * 0.42, 0.0, 0.5));

        // Fluid visibility: crisp, elegant graphite streamlines (delicate 35% peak contrast, up to 50% under wake)
        float intensity = clamp(noise * (0.55 + shearStress * 0.35), 0.0, 0.52);
        
        // Inverted blend: Clean white canvas with silky graphite streamlines + aerodynamic wake
        vec3 finalColor = mix(bgColor, fluidColor, intensity);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const compileShader = (glContext, source, type) => {
      const shader = glContext.createShader(type);
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error('Shader compile error:', glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Quad Geometry
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRatio = gl.getUniformLocation(program, 'u_ratio');
    const uPointerPosition = gl.getUniformLocation(program, 'u_pointer_position');
    const uPointerVelocity = gl.getUniformLocation(program, 'u_pointer_velocity');
    const uPointerSpeed = gl.getUniformLocation(program, 'u_pointer_speed');
    const uWakeIntensity = gl.getUniformLocation(program, 'u_wake_intensity');
    const uScrollProgress = gl.getUniformLocation(program, 'u_scroll_progress');

    let isVisible = true;
    let animId = null;

    // Resize Handler with capped DPR for optimal Retina performance
    const resizeCanvas = () => {
      if (!canvasEl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const parent = canvasEl.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      canvasEl.width = w * dpr;
      canvasEl.height = h * dpr;
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
      gl.uniform1f(uRatio, canvasEl.width / canvasEl.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Render Loop (automatically paused when off-screen)
    const render = () => {
      if (!isVisible) {
        animId = null;
        return;
      }

      const currentTime = performance.now();

      // Smooth pointer interpolation
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.15;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.15;

      // Smooth velocity interpolation and calibrated friction decay matching liquid helmet trail
      const vel = velocityRef.current;
      vel.x += (vel.tX - vel.x) * 0.15;
      vel.y += (vel.tY - vel.y) * 0.15;
      vel.tX *= 0.90;
      vel.tY *= 0.90;

      const currentSpeed = Math.hypot(vel.x, vel.y);
      vel.speed += (currentSpeed - vel.speed) * 0.18;

      // Wake intensity friction decay (~600ms sustained vortex wake)
      wakeIntensityRef.current *= 0.96;
      if (wakeIntensityRef.current < 0.003) {
        wakeIntensityRef.current = 0.0;
      }

      gl.uniform1f(uTime, currentTime);
      gl.uniform2f(uPointerPosition, pointer.current.x, pointer.current.y);
      gl.uniform2f(uPointerVelocity, vel.x, vel.y);
      gl.uniform1f(uPointerSpeed, vel.speed);
      gl.uniform1f(uWakeIntensity, wakeIntensityRef.current);
      gl.uniform1f(
        uScrollProgress,
        (window.scrollY || 0) / (2 * (window.innerHeight || 1))
      );

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };

    // IntersectionObserver: 0% GPU load when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animId) {
            animId = requestAnimationFrame(render);
          }
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvasEl);

    animId = requestAnimationFrame(render);

    // Fallback window pointer listeners when no direct imperative events arrive
    const handleWindowMouseMove = (e) => {
      if (!isVisible || isHoveredRef.current) return;
      onPointerMove(e.clientX, e.clientY);
    };

    const handleWindowTouchMove = (e) => {
      if (!isVisible || isHoveredRef.current) return;
      if (e.touches && e.touches[0]) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('pointermove', handleWindowMouseMove, { passive: true });
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handleWindowMouseMove);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      if (animId) {
        cancelAnimationFrame(animId);
      }
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(vertexBuffer);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        id="neural-vortex-canvas"
        className="w-full h-full block"
      />
      {children}
    </div>
  );
});

export default React.memo(InteractiveNeuralVortex);
