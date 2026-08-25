import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function GLTFHelmet({ 
  modelPath = "/images/michael_schumacher_2002_helmet.glb",
  mode = "mesh", // 'mesh' | 'wireframe' | 'full'
  interactive = true,
  mousePos = { x: 0, y: 0 },
  autoRotate = false,
  className = "w-full h-full"
}) {
  const mountRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sceneRef = useRef(null);
  const helmetGroupRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 400;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    const redRimLight = new THREE.DirectionalLight(0xE10600, 4.0);
    redRimLight.position.set(0, -4, -4);
    scene.add(redRimLight);

    const topLight = new THREE.PointLight(0xFFE500, 1.5, 10);
    topLight.position.set(0, 4, 2);
    scene.add(topLight);

    const helmetGroup = new THREE.Group();
    scene.add(helmetGroup);
    helmetGroupRef.current = helmetGroup;

    // 3. Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Auto center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.6 / (maxDim || 1);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;
        model.scale.set(scale, scale, scale);

        // Apply wireframe or realistic materials
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (mode === 'wireframe') {
              child.material = new THREE.MeshBasicMaterial({
                color: 0xE10600,
                wireframe: true,
                transparent: true,
                opacity: 0.7,
              });
            } else if (child.material) {
              child.material.metalness = child.material.metalness !== undefined ? Math.max(child.material.metalness, 0.4) : 0.4;
              child.material.roughness = child.material.roughness !== undefined ? Math.min(child.material.roughness, 0.25) : 0.2;
              if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                child.material.envMapIntensity = 1.5;
              }
            }
          }
        });

        helmetGroup.add(model);
        setLoaded(true);
      },
      undefined,
      (error) => {
        console.warn("GLTF Load error, falling back to procedural:", error);
        setLoadError(true);

        // Fallback procedural geometry
        const shellGeo = new THREE.SphereGeometry(0.85, 32, 32);
        shellGeo.scale(1, 1.15, 1.25);
        const shellMat = new THREE.MeshPhysicalMaterial({
          color: 0xE10600,
          metalness: 0.4,
          roughness: 0.1,
          wireframe: mode === 'wireframe',
        });
        const shell = new THREE.Mesh(shellGeo, shellMat);
        helmetGroup.add(shell);
        setLoaded(true);
      }
    );

    // 4. Drag and Interactive controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      helmetGroup.rotation.y += deltaX * 0.01;
      helmetGroup.rotation.x += deltaY * 0.01;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let animId;
    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);

      if (autoRotate && !isDragging) {
        helmetGroup.rotation.y += 0.005;
      }

      // Smooth mouse parallax response when not dragging
      if (!isDragging && mousePos) {
        const targetRotY = (mousePos.x / window.innerWidth - 0.5) * 0.4;
        const targetRotX = (mousePos.y / window.innerHeight - 0.5) * 0.3;
        helmetGroup.rotation.y += (targetRotY - helmetGroup.rotation.y) * 0.05;
        helmetGroup.rotation.x += (targetRotX - helmetGroup.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [modelPath, mode, interactive, autoRotate]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
