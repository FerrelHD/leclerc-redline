import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function HelmetViewer({ activeColor = "#E10600", modelPath = "/images/michael_schumacher_2002_helmet.glb" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 360;
    const height = mountRef.current.clientHeight || 360;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Helmet Group
    const helmetGroup = new THREE.Group();
    scene.add(helmetGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.0);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const redRimLight = new THREE.DirectionalLight(0xE10600, 3.5);
    redRimLight.position.set(-5, -2, -3);
    scene.add(redRimLight);

    const goldSpecLight = new THREE.PointLight(0xFFE500, 2.0, 10);
    goldSpecLight.position.set(0, 3, 2);
    scene.add(goldSpecLight);

    // Try loading GLTF model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / (maxDim || 1);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;
        model.scale.set(scale, scale, scale);

        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        helmetGroup.add(model);
      },
      undefined,
      () => {
        // Fallback procedural helmet if gltf fails
        const shellGeo = new THREE.SphereGeometry(1.2, 64, 64);
        shellGeo.scale(1, 1.15, 1.25);
        const shellMat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(activeColor),
          metalness: 0.3,
          roughness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
        });
        const shellMesh = new THREE.Mesh(shellGeo, shellMat);
        helmetGroup.add(shellMesh);

        const visorGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.45, 32, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
        visorGeo.scale(1, 1.15, 1.25);
        const visorMat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x111111),
          metalness: 0.9,
          roughness: 0.05,
          transmission: 0.3,
          opacity: 0.9,
          transparent: true,
        });
        const visorMesh = new THREE.Mesh(visorGeo, visorMat);
        visorMesh.position.set(0, 0.05, 0.05);
        helmetGroup.add(visorMesh);
      }
    );

    // Mouse Drag Rotation Physics
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      helmetGroup.rotation.y += deltaX * 0.012;
      helmetGroup.rotation.x += deltaY * 0.012;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        helmetGroup.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [activeColor, modelPath]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <div 
        ref={mountRef} 
        className="w-[340px] h-[340px] cursor-grab active:cursor-grabbing relative z-10 filter drop-shadow-[0_20px_35px_rgba(225,6,0,0.3)]"
      />
      <div className="text-[10px] font-mono-telemetry text-neutral-400 tracking-wider uppercase -mt-4 bg-black/60 px-3 py-1 rounded-full border border-white/10">
        DRAG TO ROTATE 360° // THREE.JS ENGINE
      </div>
    </div>
  );
}
