import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SceneController({
  isDark = true,
  scrollProgress = 0,
  currentSection = 0,
  activeWorkIndex = 0,
  isCapabilitiesHovered = false,
  isContactHovered = false,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    scrollProgress,
    currentSection,
    activeWorkIndex,
    isCapabilitiesHovered,
    isContactHovered,
    isDark,
  });

  // Keep state ref updated for animation frame loop
  useEffect(() => {
    stateRef.current = {
      scrollProgress,
      currentSection,
      activeWorkIndex,
      isCapabilitiesHovered,
      isContactHovered,
      isDark,
    };
  }, [scrollProgress, currentSection, activeWorkIndex, isCapabilitiesHovered, isContactHovered, isDark]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7);

    // 2. WebGL Renderer with High-DPI support & ACES tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig for Ultra-Gloss Chrome & Glass
    const ambientLight = new THREE.AmbientLight(0xffffff, stateRef.current.isDark ? 1.8 : 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 4.5);
    mainKeyLight.position.set(6, 8, 6);
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 4.0); // Vibrant indigo-purple iridescent rim
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const topSpecularLight = new THREE.PointLight(0xffffff, 3.5, 20);
    topSpecularLight.position.set(0, 5, 3);
    scene.add(topSpecularLight);

    const fillLight = new THREE.PointLight(0xf472b6, 2.5, 15); // soft pink/mauve warm specular
    fillLight.position.set(4, -3, 2);
    scene.add(fillLight);

    // 4. Studio Environment Reflection Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(stateRef.current.isDark ? 0x050508 : 0xf0f0f5);

    const envLight1 = new THREE.DirectionalLight(0xffffff, 5.0);
    envLight1.position.set(2, 4, 3);
    envScene.add(envLight1);

    const envLight2 = new THREE.DirectionalLight(0xc7d2fe, 4.0);
    envLight2.position.set(-3, -2, -2);
    envScene.add(envLight2);

    const envLight3 = new THREE.DirectionalLight(0xfbcfe8, 3.0);
    envLight3.position.set(-2, 3, -1);
    envScene.add(envLight3);

    const generatedEnvMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = generatedEnvMap;

    // 5. Build Tactile 3D Artifacts
    const artifactsGroup = new THREE.Group();
    scene.add(artifactsGroup);

    // --- Artifact 01: Hero Floating Gloss Chrome Foil Knot ---
    const heroGeometry = new THREE.TorusKnotGeometry(1.25, 0.4, 160, 36, 2, 3);
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      envMapIntensity: 3.5,
    });
    const heroMesh = new THREE.Mesh(heroGeometry, chromeMaterial);
    artifactsGroup.add(heroMesh);

    // --- Artifact 02: Selected Works Morphing Artifacts ---
    const worksGroup = new THREE.Group();
    worksGroup.position.set(1.8, 0, 0); // Positioned on the right side for pinned gallery
    worksGroup.visible = false;
    scene.add(worksGroup);

    // Work 0: Liquid Glass Monolith
    const glassGeo = new THREE.IcosahedronGeometry(1.4, 3);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 1.8,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      envMapIntensity: 2.5,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    worksGroup.add(glassMesh);

    // Work 1: Crinkled Iridescent Foil Star
    const starGeo = new THREE.DodecahedronGeometry(1.3, 1);
    const foilMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5d0fe,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      iridescence: 1.0,
      iridescenceIOR: 1.4,
      envMapIntensity: 2.0,
    });
    const starMesh = new THREE.Mesh(starGeo, foilMat);
    starMesh.visible = false;
    worksGroup.add(starMesh);

    // Work 2: Matte Soft-Touch Sphere with Gyro Ring
    const softSphereGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(1.1, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x222226,
      roughness: 0.85,
      metalness: 0.1,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    softSphereGroup.add(sphereMesh);

    const ringGeo = new THREE.TorusGeometry(1.6, 0.04, 16, 64);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.05,
      clearcoat: 1.0,
      envMapIntensity: 2.5,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    softSphereGroup.add(ringMesh);
    softSphereGroup.visible = false;
    worksGroup.add(softSphereGroup);

    // --- Artifact 03: Capabilities X-Ray / Wave Mesh ---
    const waveGeo = new THREE.TorusGeometry(1.8, 0.6, 32, 100);
    const xRayMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.5,
    });
    const xRayMesh = new THREE.Mesh(waveGeo, xRayMat);
    xRayMesh.position.set(2.0, 0, -1);
    xRayMesh.visible = false;
    scene.add(xRayMesh);

    // --- Artifact 04: Outro Kinetic Core & Micro Particles ---
    const outroGroup = new THREE.Group();
    outroGroup.position.set(0, 0, 0);
    outroGroup.visible = false;
    scene.add(outroGroup);

    const coreGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      envMapIntensity: 2.5,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    outroGroup.add(coreMesh);

    // Particle cloud
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const initialOffsets = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      initialOffsets.push({ x, y, z, speed: 0.5 + Math.random() });
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    outroGroup.add(particleSystem);

    // 6. Interactive Mouse / Pointer Spring Physics
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 7. Responsive Viewport Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // 8. Render Loop & Animation Synchronization
    let animationFrameId;
    let clock = new THREE.Clock();
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        clock.start();
      } else {
        clock.stop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Smooth scale holders for cross-fading
    const currentScales = {
      hero: 1.0,
      glass: 0.0,
      star: 0.0,
      sphere: 0.0,
      xray: 0.0,
      outro: 0.0,
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Mouse Lerp with gentle elastic spring
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const currentSec = stateRef.current.currentSection;
      const progress = stateRef.current.scrollProgress;
      const isDarkMode = stateRef.current.isDark;
      const activeIdx = stateRef.current.activeWorkIndex;

      // Update Theme Lighting dynamic reflection
      ambientLight.intensity = isDarkMode ? 1.4 : 0.9;
      particleMat.color.setHex(isDarkMode ? 0xffffff : 0x111113);
      xRayMat.color.setHex(isDarkMode ? 0xffffff : 0x333336);
      sphereMat.color.setHex(isDarkMode ? 0x222226 : 0xdddddf);

      // Camera subtle parallax tracking
      camera.position.x = mouse.x * 0.4;
      camera.position.y = mouse.y * 0.3;
      camera.lookAt(0, 0, 0);

      // Target scales based on section and active work
      const targetHeroScale = currentSec === 0 ? 1.0 : 0.001;
      const targetGlassScale = currentSec === 1 && activeIdx === 0 ? 1.0 : 0.001;
      const targetStarScale = currentSec === 1 && activeIdx === 1 ? 1.0 : 0.001;
      const targetSphereScale = currentSec === 1 && activeIdx === 2 ? 1.0 : 0.001;
      const targetXrayScale = currentSec === 2 ? 1.0 : 0.001;
      const targetOutroScale = currentSec === 3 ? 1.0 : 0.001;

      // Smooth lerp all scales
      currentScales.hero += (targetHeroScale - currentScales.hero) * 0.08;
      currentScales.glass += (targetGlassScale - currentScales.glass) * 0.08;
      currentScales.star += (targetStarScale - currentScales.star) * 0.08;
      currentScales.sphere += (targetSphereScale - currentScales.sphere) * 0.08;
      currentScales.xray += (targetXrayScale - currentScales.xray) * 0.08;
      currentScales.outro += (targetOutroScale - currentScales.outro) * 0.08;

      // Organic tactile floating offset
      const floatY = Math.sin(elapsedTime * 1.2) * 0.12 + Math.cos(elapsedTime * 0.7) * 0.04;
      const floatRot = Math.cos(elapsedTime * 0.5) * 0.08;

      // 1. Hero Chrome Foil Knot
      heroMesh.visible = currentScales.hero > 0.01;
      if (heroMesh.visible) {
        heroMesh.scale.setScalar(currentScales.hero);
        heroMesh.rotation.x = elapsedTime * 0.25 + mouse.y * 0.5 + floatRot;
        heroMesh.rotation.y = elapsedTime * 0.35 + mouse.x * 0.7;
        const targetHeroX = window.innerWidth < 1024 ? 0 : 1.4 + mouse.x * 0.3;
        heroMesh.position.x += (targetHeroX - heroMesh.position.x) * 0.1;
        heroMesh.position.y = floatY - progress * 2.2;
      }

      // 2. Selected Works Artifacts
      worksGroup.visible = currentSec === 1 || currentScales.glass > 0.01 || currentScales.star > 0.01 || currentScales.sphere > 0.01;
      if (worksGroup.visible) {
        const isMobile = window.innerWidth < 768;
        const targetGroupX = isMobile ? 0 : 1.7 + mouse.x * 0.2;
        worksGroup.position.x += (targetGroupX - worksGroup.position.x) * 0.1;
        worksGroup.position.y = floatY + mouse.y * 0.2;

        // Glass Monolith
        glassMesh.visible = currentScales.glass > 0.01;
        if (glassMesh.visible) {
          glassMesh.scale.setScalar(currentScales.glass);
          glassMesh.rotation.x = elapsedTime * 0.3 + floatRot;
          glassMesh.rotation.y = elapsedTime * 0.4;
        }

        // Foil Star
        starMesh.visible = currentScales.star > 0.01;
        if (starMesh.visible) {
          starMesh.scale.setScalar(currentScales.star);
          starMesh.rotation.x = elapsedTime * 0.45;
          starMesh.rotation.z = elapsedTime * 0.3 + floatRot;
        }

        // Soft Sphere & Gyro Ring
        softSphereGroup.visible = currentScales.sphere > 0.01;
        if (softSphereGroup.visible) {
          softSphereGroup.scale.setScalar(currentScales.sphere);
          sphereMesh.rotation.y = elapsedTime * 0.2;
          ringMesh.rotation.x = elapsedTime * 0.75 + floatRot;
          ringMesh.rotation.y = elapsedTime * 0.4;
        }
      }

      // 3. Capabilities X-Ray
      xRayMesh.visible = currentScales.xray > 0.01;
      if (xRayMesh.visible) {
        xRayMesh.scale.setScalar(currentScales.xray);
        const isHovered = stateRef.current.isCapabilitiesHovered;
        const targetOpacity = isHovered ? 0.75 : 0.35;
        xRayMat.opacity += (targetOpacity - xRayMat.opacity) * 0.1;
        const waveSpeed = isHovered ? 1.4 : 0.45;

        xRayMesh.rotation.x = elapsedTime * waveSpeed;
        xRayMesh.rotation.y = elapsedTime * (waveSpeed * 0.8) + floatRot;
        xRayMesh.position.x = window.innerWidth < 768 ? 0 : 1.9 + mouse.x * 0.25;
        xRayMesh.position.y = floatY;
      }

      // 4. Outro Particles & Core
      outroGroup.visible = currentScales.outro > 0.01;
      if (outroGroup.visible) {
        outroGroup.scale.setScalar(currentScales.outro);
        const isHovered = stateRef.current.isContactHovered;
        const coreScale = isHovered ? 1.25 : 0.95;
        coreMesh.scale.lerp(new THREE.Vector3(coreScale, coreScale, coreScale), 0.1);
        coreMesh.rotation.y = elapsedTime * 0.6;
        coreMesh.rotation.x = elapsedTime * 0.4;

        const positions = particleGeo.attributes.position.array;
        const burstFactor = isHovered ? 1.6 : 1.0;

        for (let i = 0; i < particleCount; i++) {
          const init = initialOffsets[i];
          const factor = burstFactor + Math.sin(elapsedTime * 2 + i) * 0.12;
          positions[i * 3] = init.x * factor;
          positions[i * 3 + 1] = init.y * factor;
          positions[i * 3 + 2] = init.z * factor;
        }
        particleGeo.attributes.position.needsUpdate = true;
        particleSystem.rotation.y = elapsedTime * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Dispose & Clean-up (Prevent memory leaks)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Geometries & Materials
      [heroGeometry, glassGeo, starGeo, sphereGeo, ringGeo, waveGeo, coreGeo, particleGeo].forEach(
        (g) => g?.dispose()
      );
      [
        chromeMaterial,
        glassMat,
        foilMat,
        sphereMat,
        ringMat,
        xRayMat,
        coreMat,
        particleMat,
      ].forEach((m) => m?.dispose());

      generatedEnvMap?.dispose();
      pmremGenerator?.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
}
