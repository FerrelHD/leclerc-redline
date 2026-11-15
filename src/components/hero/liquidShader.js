/**
 * liquidShader.js
 * High-performance WebGL GLSL Shader pipeline for Charles Leclerc Hero Helmet Liquid Reveal.
 * Features:
 * - Distance-field metaball blending with smooth minimum (smin)
 * - Organic surface tension ripple noise
 * - Real-time optical lens edge refraction & chromatic dispersion (RGB split)
 * - Exact aspect-ratio-corrected UV mapping matching 'object-contain object-bottom'
 * - F1 Ferrari Redline ambient edge glow for signature cinematic look
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

  // Aspect ratios for exact object-contain object-bottom alignment
  uniform vec2 u_faceAspect;    // (width, height) = (1350, 1125)
  uniform vec2 u_helmetAspect;  // (width, height) = (1018, 1018)
  uniform vec2 u_helmetTransform; // (scale, offsetY)

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

  // Maps viewport UV (screenUv: 0=top, 1=bottom) to object-contain object-bottom UV coordinates
  vec2 getContainBottomUv(vec2 uv, vec2 imgDim, vec2 customScaleOffset) {
    float boxAspect = u_resolution.x / u_resolution.y;
    float imgAspect = imgDim.x / imgDim.y;
    vec2 st = uv;

    if (boxAspect > imgAspect) {
      // Container is wider than image -> image height fits 100%, width centered
      float factor = imgAspect / boxAspect;
      st.x = (st.x - 0.5) / factor + 0.5;
      st.y = st.y;
    } else {
      // Container is taller than image -> image width fits 100%, anchored at bottom
      float factor = boxAspect / imgAspect;
      st.x = st.x;
      st.y = (st.y - 1.0) / factor + 1.0;
    }

    // Apply custom scale and offset around center
    float scale = customScaleOffset.x;
    float offsetY = customScaleOffset.y;
    if (scale != 1.0 || offsetY != 0.0) {
      st.x = (st.x - 0.5) / scale + 0.5;
      st.y = (st.y - 0.5) / scale + 0.5 + offsetY;
    }

    return st;
  }

  void main() {
    // 1. Invert Y for standard WebGL texture coordinates (origin top-left in web UI)
    vec2 screenUv = vec2(vUv.x, 1.0 - vUv.y);
    float aspect = u_resolution.x / u_resolution.y;

    // Aspect-ratio-corrected coordinate for distance measurements
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
      float r = pt.z * (0.35 + 0.65 * pow(pt.w, 0.7));
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

    // If no trail points are active, mask stays 0
    if (activeWeights <= 0.001) {
      liquidMask = 0.0;
    }

    // Blend with full reveal progress (e.g. mobile toggle)
    float effectiveMask = max(liquidMask, u_revealProgress);

    // 4. Optical Lens Edge & Chromatic Refraction
    float edgeZone = smoothstep(0.02, 0.45, liquidMask) * (1.0 - smoothstep(0.55, 0.98, liquidMask));
    edgeZone *= (1.0 - u_revealProgress); // Fade out refraction when fully revealed

    // Refraction vector pointing outwards from the fluid boundary
    vec2 centerOffset = screenUv - vec2(0.5, 0.5);
    vec2 refractVec = normalize(centerOffset + vec2(0.001)) * edgeZone * 0.024;

    // 5. Sample Face Texture
    vec2 faceUv = getContainBottomUv(screenUv, u_faceAspect, vec2(1.0, 0.0));
    vec4 faceColor = vec4(0.0);
    if (faceUv.x >= 0.0 && faceUv.x <= 1.0 && faceUv.y >= 0.0 && faceUv.y <= 1.0) {
      faceColor = texture2D(u_texFace, faceUv);
      faceColor.rgb = (faceColor.rgb - 0.5) * 1.04 + 0.5 + 0.02;
    }

    // 6. Sample Helmet Texture with Chromatic Dispersion
    vec2 helmetBaseUv = getContainBottomUv(screenUv, u_helmetAspect, u_helmetTransform);
    vec4 helmetColor = vec4(0.0);

    vec2 uvR = helmetBaseUv + refractVec * 1.08;
    vec2 uvG = helmetBaseUv + refractVec * 1.00;
    vec2 uvB = helmetBaseUv + refractVec * 0.92;

    if (helmetBaseUv.x >= 0.0 && helmetBaseUv.x <= 1.0 && helmetBaseUv.y >= 0.0 && helmetBaseUv.y <= 1.0) {
      float r = texture2D(u_texHelmet, clamp(uvR, 0.0, 1.0)).r;
      float g = texture2D(u_texHelmet, clamp(uvG, 0.0, 1.0)).g;
      float b = texture2D(u_texHelmet, clamp(uvB, 0.0, 1.0)).b;
      float a = texture2D(u_texHelmet, clamp(helmetBaseUv, 0.0, 1.0)).a;

      helmetColor = vec4(r, g, b, a);
      helmetColor.rgb = (helmetColor.rgb - 0.5) * 1.10 + 0.5 + 0.04;
    }

    // 7. Composite Face + Refracted Helmet via Liquid Mask
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
      resolve({ texture, width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}
