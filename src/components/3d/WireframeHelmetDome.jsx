import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WireframeHelmetDome({ mouseTilt = { rotateX: 0, rotateY: 0 } }) {
  const mountRef = useRef(null);
  const domeGroupRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 320;
    const height = mountRef.current.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Group for Dome Mesh
    const domeGroup = new THREE.Group();
    scene.add(domeGroup);
    domeGroupRef.current = domeGroup;

    // 1. Semi-spherical CAD Wireframe Dome (Lando Norris style)
    const domeGeo = new THREE.SphereGeometry(1.05, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
    
    // Wireframe lines
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x222222,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.Mesh(domeGeo, wireframeMat);
    domeGroup.add(wireframeMesh);

    // Outer subtle glow wireframe
    const outerGeo = new THREE.SphereGeometry(1.08, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const redAccentMat = new THREE.MeshBasicMaterial({
      color: 0xE10600,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const outerMesh = new THREE.Mesh(outerGeo, redAccentMat);
    domeGroup.add(outerMesh);

    // 2. Latitude Ring Ribs
    const ringGeo = new THREE.RingGeometry(0.98, 1.02, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xE10600,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const baseRing = new THREE.Mesh(ringGeo, ringMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -0.15;
    domeGroup.add(baseRing);

    // 3. Crown Monogram Plate (#16 / Scuderia Ferrari)
    const crownGeo = new THREE.CircleGeometry(0.28, 32);
    const crownMat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const crownMesh = new THREE.Mesh(crownGeo, crownMat);
    crownMesh.position.set(0, 1.06, 0);
    crownMesh.rotation.x = -Math.PI / 2;
    domeGroup.add(crownMesh);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth lag tilt
      if (domeGroupRef.current) {
        domeGroupRef.current.rotation.y += (mouseTilt.rotateY * 0.05 - domeGroupRef.current.rotation.y) * 0.1;
        domeGroupRef.current.rotation.x += (mouseTilt.rotateX * 0.05 - domeGroupRef.current.rotation.x) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update target rotation when mouseTilt changes
  useEffect(() => {
    if (domeGroupRef.current) {
      domeGroupRef.current.rotation.y = (mouseTilt.rotateY * Math.PI) / 180;
      domeGroupRef.current.rotation.x = (mouseTilt.rotateX * Math.PI) / 180;
    }
  }, [mouseTilt]);

  return (
    <div className="relative w-full h-full pointer-events-none">
      <div ref={mountRef} className="w-full h-full" />
      {/* Crown Tag Monogram Label */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[11px] font-racing font-black text-neutral-800 pointer-events-none">
        <span>16</span>
      </div>
    </div>
  );
}
