/**
 * liquidShader.js
 * High-performance WebGL GLSL Shader pipeline for Charles Leclerc Hero Helmet Liquid Reveal.
 * Features:
 * - Distance-field metaball blending with smooth minimum (smin)
 * - Organic surface tension ripple noise
 * - Real-time optical lens edge refraction & chromatic dispersion (RGB split)
 * - Exact 1:1 pixel-accurate bounding box mapping matching CSS layout
 * - F1 Ferrari Redline ambient edge sheen
 */

export const MAX_TRAIL_POINTS = 24;

export const VERTEX_SHADER_SOURCE = `
  precision mediump float;
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    vUv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  varying vec2 vUv;

  uniform sampler2D u_texFace;
  uniform sampler2D u_texHelmet;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_revealProgress;

  // Normalized bounding boxes: (xMin, yMin, width, height) in 0.0 to 1.0 screen space
  uniform vec4 u_faceBounds;
  uniform vec4 u_helmetBounds;

  // Fluid trail uniforms
  uniform int u_trailCount;
  uniform vec4 u_trail[${MAX_TRAIL_POINTS}]; // (normX, normY, radius, life)

  // Smooth minimum (Polynomial smin by Inigo Quilez)
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  // Pseudo-random noise for fluid surface tension wobble
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    // 1. Invert Y for standard WebGL texture coordinates (0=top, 1=bottom in screen UV)
    vec2 screenUv = vec2(vUv.x, 1.0 - vUv.y);
    float aspect = u_resolution.x / u_resolution.y;

    // Aspect-ratio-corrected coordinate for circular fluid distance measurements
    vec2 p = screenUv;
    p.x *= aspect;

    // 2. Compute organic metaball distance field from mouse trail
    float minDist = 999.0;
    float activeWeights = 0.0;

    for (int i = 0; i < ${MAX_TRAIL_POINTS}; i++) {
      if (i >= u_trailCount) break;
      vec4 pt = u_trail[i];
      vec2 ptPos = pt.xy;
      ptPos.x *= aspect;

      float dist = length(p - ptPos);
      // Quick aerodynamic shrink curve: rapid evaporation without abrupt cutoffs
      float r = pt.z * (0.22 + 0.78 * pow(pt.w, 1.4));
      float d = dist - r;

      minDist = smin(minDist, d, 0.065);
      activeWeights += pt.w;
    }

    // Add subtle liquid surface ripple / tension wobble
    float ripple = (noise(screenUv * 16.0 + u_time * 1.2) - 0.5) * 0.022;
    minDist += ripple;

    // 3. Liquid mask with smooth anti-aliased edge
    float liquidMask = 1.0 - smoothstep(-0.018, 0.018, minDist);
    liquidMask = clamp(liquidMask, 0.0, 1.0);

    if (activeWeights <= 0.001) {
      liquidMask = 0.0;
    }

    // Blend with full reveal progress (e.g. mobile button toggle)
    float effectiveMask = max(liquidMask, u_revealProgress);

    // 4. Optical Lens Edge & Chromatic Refraction
    float edgeZone = smoothstep(0.02, 0.45, liquidMask) * (1.0 - smoothstep(0.55, 0.98, liquidMask));
    edgeZone *= (1.0 - u_revealProgress);

    // Refraction vector pointing outwards from the fluid boundary
    vec2 centerOffset = screenUv - vec2(0.5, 0.5);
    vec2 refractVec = normalize(centerOffset + vec2(0.001)) * edgeZone * 0.024;

    // 5. Sample Face Texture (Base Layer - Charles Leclerc Face)
    vec2 faceUv = (screenUv - u_faceBounds.xy) / u_faceBounds.zw;
    vec4 faceColor = vec4(0.0);
    if (faceUv.x >= 0.0 && faceUv.x <= 1.0 && faceUv.y >= 0.0 && faceUv.y <= 1.0) {
      faceColor = texture2D(u_texFace, faceUv);
      faceColor.rgb = (faceColor.rgb - 0.5) * 1.04 + 0.5 + 0.02;
    }

    // High-performance early exit: skip all helmet sampling where mask is inactive
    if (effectiveMask <= 0.001) {
      gl_FragColor = faceColor;
      return;
    }

    // 6. Sample Helmet Texture ONLY within the active fluid area
    vec2 helmetBaseUv = (screenUv - u_helmetBounds.xy) / u_helmetBounds.zw;
    vec4 helmetColor = vec4(0.0);

    if (helmetBaseUv.x >= 0.0 && helmetBaseUv.x <= 1.0 && helmetBaseUv.y >= 0.0 && helmetBaseUv.y <= 1.0) {
      if (edgeZone > 0.005) {
        // Chromatic split ONLY along the active fluid boundary
        vec2 uvR = helmetBaseUv + refractVec * 1.08;
        vec2 uvG = helmetBaseUv + refractVec * 1.00;
        vec2 uvB = helmetBaseUv + refractVec * 0.92;
        float r = texture2D(u_texHelmet, clamp(uvR, 0.0, 1.0)).r;
        float g = texture2D(u_texHelmet, clamp(uvG, 0.0, 1.0)).g;
        float b = texture2D(u_texHelmet, clamp(uvB, 0.0, 1.0)).b;
        float a = texture2D(u_texHelmet, clamp(helmetBaseUv, 0.0, 1.0)).a;
        helmetColor = vec4(r, g, b, a);
      } else {
        // Single unified texture read inside the fluid core
        helmetColor = texture2D(u_texHelmet, helmetBaseUv);
      }
      helmetColor.rgb = (helmetColor.rgb - 0.5) * 1.10 + 0.5 + 0.04;
    }

    // 7. Composite: Default shows Face; Hovered liquid trail reveals Helmet!
    vec4 composite = mix(faceColor, helmetColor, effectiveMask * helmetColor.a);

    // Subtle Ferrari Racing Redline sheen along the fluid edge
    vec3 redlineAccent = vec3(0.88, 0.02, 0.0);
    float edgeSheen = edgeZone * 0.28 * helmetColor.a;
    composite.rgb += redlineAccent * edgeSheen;

    gl_FragColor = composite;
  }
`;

/**
 * Compiles a WebGL shader.
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

/**
 * Creates and links a WebGL program.
 */
export function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${info}`);
  }
  return program;
}

/**
 * Loads an image URL into a WebGL texture with RGBA clamping.
 */
export function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0])
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      resolve({
        texture,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}
