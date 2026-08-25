import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HelmetViewer({ activeColor = "#E10600" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(340, 340);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Helmet Group
    const helmetGroup = new THREE.Group();
    scene.add(helmetGroup);

    // 1. Helmet Main Shell (Sculpted organic egg-sphere)
    const shellGeo = new THREE.SphereGeometry(1.2, 64, 64);
    shellGeo.scale(1, 1.15, 1.25);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeColor),
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    helmetGroup.add(shellMesh);

    // 2. Reflective Chrome Visor
    const visorGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.45, 32, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
    visorGeo.scale(1, 1.15, 1.25);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x111111),
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.3,
      opacity: 0.9,
      transparent: true,
      reflectivity: 1.0,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.05, 0.05);
    helmetGroup.add(visorMesh);

    // 3. Carbon Fiber Chin Spoiler & Aerodynamic Wing
    const aeroGeo = new THREE.BoxGeometry(1.4, 0.15, 0.6);
    const aeroMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.4,
      metalness: 0.8
    });
    const aeroMesh = new THREE.Mesh(aeroGeo, aeroMat);
    aeroMesh.position.set(0, -1.0, 0.8);
    aeroMesh.rotation.x = 0.2;
    helmetGroup.add(aeroMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const redRimLight = new THREE.DirectionalLight(0xE10600, 4.0);
    redRimLight.position.set(-5, -2, -3);
    scene.add(redRimLight);

    const goldSpecLight = new THREE.PointLight(0xFFE500, 2.0, 10);
    goldSpecLight.position.set(0, 3, 2);
    scene.add(goldSpecLight);

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

    // Animation Loop (Gentle float & auto-spin)
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
  }, [activeColor]);

  return (
    <div className="relative flex flex-col items-center justify-center">
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
