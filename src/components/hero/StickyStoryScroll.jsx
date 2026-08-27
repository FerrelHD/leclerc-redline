import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const currentFrame = (index) => `/sequence/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

export default function StickyStoryScroll() {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Chapter Refs
  const chap1Ref = useRef(null);
  const chap2Ref = useRef(null);
  const chap3Ref = useRef(null);
  const chap4Ref = useRef(null);

  // State to manage image sequence loading
  const [images, setImages] = useState([]);
  const [usePlaceholder, setUsePlaceholder] = useState(true);

  // Preload images
  useEffect(() => {
    // Try to load the first image to check if the sequence exists
    const testImg = new Image();
    testImg.src = currentFrame(0);
    
    testImg.onload = () => {
      // Sequence exists! Preload all
      setUsePlaceholder(false);
      const loadedImages = [];
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        loadedImages.push(img);
      }
      setImages(loadedImages);
    };

    testImg.onerror = () => {
      // Sequence not found, use placeholder
      setUsePlaceholder(true);
    };
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const renderPlaceholder = (frameIndex) => {
      // Draw dark Monoposto Noir background
      context.fillStyle = '#0A0A0A';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw dynamic grid lines
      context.strokeStyle = 'rgba(225, 6, 0, 0.15)'; // Ferrari Rosso Corsa
      context.lineWidth = 1;
      
      const offsetX = (frameIndex * 2) % 100;
      const offsetY = (frameIndex * 2) % 100;
      
      context.beginPath();
      for (let x = offsetX; x < canvas.width; x += 100) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
      }
      for (let y = offsetY; y < canvas.height; y += 100) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
      }
      context.stroke();

      // Draw sleek telemetry text
      context.fillStyle = 'rgba(248, 249, 250, 0.2)'; // F8F9FA
      context.font = 'bold 120px monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(`FRAME ${frameIndex.toString().padStart(3, '0')}`, canvas.width / 2, canvas.height / 2);
      
      context.font = '24px monospace';
      context.fillStyle = 'rgba(225, 6, 0, 0.5)';
      context.fillText('WAITING FOR SEQUENCE IMAGES', canvas.width / 2, canvas.height / 2 + 80);
    };

    const renderFrame = (frameIndex) => {
      if (!usePlaceholder && images[frameIndex] && images[frameIndex].complete) {
        // Draw the actual image covering the canvas (object-fit: cover logic)
        const img = images[frameIndex];
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        }
        
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        renderPlaceholder(frameIndex);
      }
    };

    // Initial render
    renderFrame(0);

    let ctx = gsap.context(() => {
      const sequenceObj = { frame: 0 };
      
      // Create a master timeline attached to the container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          pin: pinRef.current,
        }
      });

      // Canvas Sequence tween (runs across the entire 800vh)
      tl.to(sequenceObj, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        duration: 10, // Base duration for proportional mapping
        onUpdate: () => renderFrame(sequenceObj.frame)
      }, 0);

      // Initially hide chapters
      gsap.set([chap1Ref.current, chap2Ref.current, chap3Ref.current, chap4Ref.current], { autoAlpha: 0 });

      // CHAPTER 1 (Starts slightly after sequence begins to establish image first)
      tl.to(chap1Ref.current, {
        autoAlpha: 1,
        duration: 1.5,
        ease: "power2.out"
      }, 1) // Enters at t=1
      .to(chap1Ref.current, {
        scale: 1.5,
        autoAlpha: 0,
        y: -100,
        duration: 1.5,
        ease: "power1.inOut"
      }, 2.5); // Exits at t=2.5

      // CHAPTER 2 (Left telemetry)
      tl.fromTo(chap2Ref.current, 
        { x: -80, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1, ease: "power2.out" },
        3.5
      )
      .to(chap2Ref.current, { x: 50, autoAlpha: 0, filter: "blur(8px)", duration: 1, ease: "power2.in" }, 5.5);

      // CHAPTER 3 (Right narrative)
      tl.fromTo(chap3Ref.current,
        { x: 80, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1, ease: "power2.out" },
        6.0
      )
      .to(chap3Ref.current, { x: -50, autoAlpha: 0, filter: "blur(8px)", duration: 1, ease: "power2.in" }, 8.0);

      // CHAPTER 4 (Finale CTA)
      tl.fromTo(chap4Ref.current,
        { scale: 0.8, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1.5, ease: "power2.out" },
        8.5
      );

    }, containerRef);

    // Handle Resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Triggers GSAP to re-evaluate and re-draw current frame via scrub on scroll update
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [images, usePlaceholder]);

  return (
    <div ref={containerRef} className="h-[800vh] relative w-full bg-[#0A0A0A] z-50 mt-[100vh]">
      <div 
        ref={pinRef} 
        className="h-screen w-full flex items-center justify-center overflow-hidden relative"
      >
        {/* HTML5 Canvas for High-Performance Sequence Rendering */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none"
        />
        
        {/* Vignette Overlay for Better Text Readability over Images */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/90 pointer-events-none" />
        
        {/* Story Layers Container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center px-8 md:px-16 pointer-events-none">
          
          {/* Chapter 1 */}
          <div ref={chap1Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-[#F8F9FA]">
              CL16 <br/><span className="text-transparent" style={{ WebkitTextStroke: '2px #F8F9FA' }}>Il Predestinato</span>
            </h1>
          </div>

          {/* Chapter 2 */}
          <div ref={chap2Ref} className="absolute inset-0 flex flex-col items-start justify-center text-left max-w-2xl px-8 md:px-16">
            <div className="border-l-4 border-[#E10600] pl-6">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#F8F9FA]">
                Sector 1 Apex
              </h2>
              <p className="mt-4 font-mono text-xl tracking-widest text-[#E10600]">
                280 KM/H
              </p>
              <p className="mt-4 text-[#F8F9FA]/90 text-lg leading-relaxed max-w-md drop-shadow-md">
                Precision meets raw velocity. Telemetry locked. Maximum attack on the racing line.
              </p>
            </div>
          </div>

          {/* Chapter 3 */}
          <div ref={chap3Ref} className="absolute inset-0 flex flex-col items-end justify-center text-right max-w-2xl px-8 md:px-16 ml-auto">
            <div className="border-r-4 border-[#E10600] pr-6">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-[#F8F9FA]">
                Push to Pass <br/> <span className="text-[#E10600]">Mode Race</span>
              </h2>
              <p className="mt-4 text-[#F8F9FA]/90 text-lg leading-relaxed max-w-md ml-auto drop-shadow-md">
                The rhythm of the circuit. A dance on the edge of grip. Scuderia Ferrari spirit unleashed.
              </p>
            </div>
          </div>

          {/* Chapter 4 */}
          <div ref={chap4Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-auto">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#F8F9FA]">
              Monte Carlo <br/> <span className="text-[#E10600]">To Maranello</span>
            </h2>
            <button className="mt-12 px-8 py-4 bg-[#F8F9FA] text-[#0A0A0A] font-bold uppercase tracking-widest hover:bg-[#E10600] hover:text-[#F8F9FA] transition-colors duration-300 rounded-sm">
              Enter The Paddock
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
