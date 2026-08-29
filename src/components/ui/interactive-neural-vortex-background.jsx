import React, { useEffect, useRef } from 'react';

/**
 * InteractiveNeuralVortex
 * High-performance WebGL GLSL shader simulating organic neural/fluid vortex.
 * Calibrated for Charles Leclerc Redline luxury aesthetic:
 * - Pure white background (#FFFFFF)
 * - Subtle graphite/charcoal grey fluid tones
 * - Responsive pointer tracking with inertia
 */
export default function InteractiveNeuralVortex({
  className = "absolute inset-0 w-full h-full pointer-events-none z-0",
  children,
  fluidTone = "charcoal", // 'charcoal' | 'subtle' | 'ferrari-accent'
}) {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, tX: window.innerWidth / 2, tY: window.innerHeight / 2 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const gl = canvasEl.getContext('webgl', { alpha: false, antialias: true }) || 
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

    // Fragment Shader: Inverted for White Background with Elegant Charcoal/Grey Fluid
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;
      
      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }
      
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 15; j++) {
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
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0., 1.);
        p = .5 * pow(1. - p, 2.);
        float t = .0008 * u_time;
        
        float noise = neuro_shape(uv, t, p);
        noise = 1.05 * pow(noise, 2.6);
        noise = max(0.0, noise - 0.32);
        noise *= (1.0 - length(vUv - 0.5) * 0.4);
        
        // Base Luxury Palette: Pure White Background (#FFFFFF)
        vec3 bgColor = vec3(1.0, 1.0, 1.0);
        
        // Fluid Palette: Sophisticated Aerodynamic Graphite / Titanium Grey
        vec3 fluidColor = vec3(0.32, 0.32, 0.35);
        fluidColor = mix(fluidColor, vec3(0.52, 0.52, 0.56), 0.35 + 0.15 * sin(2.0 * u_scroll_progress + 1.2));
        
        // Fluid visibility: crisp, elegant graphite streamlines (delicate 35% peak contrast)
        float intensity = clamp(noise * 0.55, 0.0, 0.35);
        
        // Inverted blend: Clean white canvas with silky graphite streamlines
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
    const uScrollProgress = gl.getUniformLocation(program, 'u_scroll_progress');

    // Resize Handler
    const resizeCanvas = () => {
      if (!canvasEl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

    // Render Loop
    const render = () => {
      const currentTime = performance.now();
      
      // Smooth pointer interpolation
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.15;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.15;
      
      const rect = canvasEl.getBoundingClientRect();
      const relX = rect.width > 0 ? (pointer.current.x - rect.left) / rect.width : 0.5;
      const relY = rect.height > 0 ? 1.0 - (pointer.current.y - rect.top) / rect.height : 0.5;

      gl.uniform1f(uTime, currentTime);
      gl.uniform2f(uPointerPosition, relX, relY);
      gl.uniform1f(uScrollProgress, window.pageYOffset / (2 * window.innerHeight || 1));
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    // Event listeners
    const handleMouseMove = (e) => {
      pointer.current.tX = e.clientX;
      pointer.current.tY = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        pointer.current.tX = e.touches[0].clientX;
        pointer.current.tY = e.touches[0].clientY;
      }
    };

    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationRef.current);
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
}
