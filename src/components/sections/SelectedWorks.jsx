import React, { useState } from 'react';
import { ArrowUpRight, X, Layers, Cpu, Eye, Sparkles } from 'lucide-react';
import { playMicroSound } from '../../utils/audio';

const PROJECTS = [
  {
    id: 'aether',
    title: 'Aether Monolith',
    category: 'Interactive WebGL / Optics',
    year: '2026',
    client: 'Lumina Studio Geneva',
    artifactName: 'Liquid Glass Monolith',
    description:
      'A real-time optical refraction monolith simulating internal caustics, physical glass transmission, and high-precision dispersion. Built to challenge browser graphics boundaries.',
    metrics: ['60 FPS Fixed', 'IOR 1.52', 'Custom GLSL Transmission'],
    tags: ['Three.js', 'Custom Shaders', 'Optics Engine', 'GSAP'],
  },
  {
    id: 'kroma',
    title: 'Kroma Stellar',
    category: 'Physical Computing / 3D',
    year: '2025',
    client: 'Vanguard Audio Works',
    artifactName: 'Crinkled Metallic Foil Star',
    description:
      'Tactile generative foil geometry featuring procedural vertex wrinkles, iridescent clearcoat, and micro-particle audio reaction.',
    metrics: ['0.8s Latency', 'Multi-layer Specular', 'Audio-reactive'],
    tags: ['WebGL', 'Audio Synthesis', 'Procedural Geometry', 'Tailwind'],
  },
  {
    id: 'kinetic',
    title: 'Kinetic Orbit Core',
    category: 'Design Engineering / UI',
    year: '2025',
    client: 'Matter Formative Systems',
    artifactName: 'Matte Soft-touch Sphere with Floating Gyro',
    description:
      'Editorial interface system integrating gyroscopic physical inertia with Swiss typographic modularity and seamless page transitions.',
    metrics: ['100 Lighthouse', 'Zero Cumulative Shift', 'Lenis Smooth Sync'],
    tags: ['React', 'Three.js', 'Lenis', 'Design System'],
  },
];

export default function SelectedWorks({ activeWorkIndex, setActiveWorkIndex, audioEnabled }) {
  const [selectedModalProject, setSelectedModalProject] = useState(null);

  const handleSelectWork = (idx) => {
    setActiveWorkIndex(idx);
    playMicroSound('click', audioEnabled);
  };

  const handleOpenModal = (project) => {
    playMicroSound('modal', audioEnabled);
    setSelectedModalProject(project);
  };

  const handleCloseModal = () => {
    playMicroSound('click', audioEnabled);
    setSelectedModalProject(null);
  };

  return (
    <section
      id="works"
      className="relative min-h-screen w-full px-6 py-24 md:px-16 md:py-32 z-10 select-none"
    >
      {/* Section Header */}
      <div className="reveal-item flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-subtle pb-6 mb-12">
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-muted">
            INDEX 02 // ARCHIVE
          </span>
          <span className="h-3 w-px bg-border-subtle"></span>
          <h2 className="font-display font-bold text-xl md:text-2xl uppercase tracking-tight">
            Selected Works
          </h2>
        </div>
        <span className="font-mono-tech text-xs text-muted mt-2 sm:mt-0">
          [ 03 TACTILE EXPERIMENTS ]
        </span>
      </div>

      {/* 2-Column Pinned Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Project Catalog */}
        <div className="lg:col-span-6 space-y-4">
          {PROJECTS.map((project, idx) => {
            const isActive = activeWorkIndex === idx;
            return (
              <div
                key={project.id}
                data-speed={(idx + 1) * 0.04}
                onClick={() => handleSelectWork(idx)}
                onMouseEnter={() => {
                  setActiveWorkIndex(idx);
                  playMicroSound('hover', audioEnabled);
                }}
                className={`reveal-item p-6 sm:p-8 rounded-2xl border transition-all duration-400 cursor-pointer pointer-events-auto ${
                  isActive
                    ? 'border-strong glass-panel shadow-2xl scale-[1.02]'
                    : 'border-subtle bg-transparent hover:border-strong/50 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-tech text-xs text-muted">
                      0{idx + 1}
                    </span>
                    <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full border border-subtle bg-primary/10 text-muted">
                      {project.year}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(project);
                    }}
                    onMouseEnter={() => playMicroSound('hover', audioEnabled)}
                    className="p-2 rounded-full border border-subtle hover:bg-primary hover:text-primary transition-all duration-200"
                    title="View Technical Specs"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl mt-4 uppercase tracking-tight">
                  {project.title}
                </h3>
                <p className="text-xs font-mono-tech text-muted mt-1 uppercase">
                  {project.category}
                </p>

                <div className="mt-4 pt-4 border-t border-subtle flex flex-wrap items-center gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono-tech text-muted px-2 py-0.5 rounded-md border border-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-mono-tech text-muted">
                  <span>Artifact: {project.artifactName}</span>
                  <span className="text-primary font-medium underline underline-offset-4">
                    Inspect Specs →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: 3D Visual Focus Area Helper & Live Artifact Metadata */}
        <div className="lg:col-span-6 hidden lg:flex flex-col justify-between h-[520px] p-8 rounded-2xl border border-subtle glass-panel pointer-events-none sticky top-28">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-muted">
              REAL-TIME WEBGL RENDERPORT
            </span>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>60 FPS GLSL</span>
            </div>
          </div>

          <div className="text-center my-auto">
            {/* 3D Artifact Canvas is positioned behind this backdrop */}
          </div>

          <div className="pt-4 border-t border-subtle flex items-center justify-between font-mono-tech text-xs text-muted">
            <span>OBJECT: {PROJECTS[activeWorkIndex]?.artifactName}</span>
            <span>INTERACT: DRAG TO ROTATE / LERP TILT</span>
          </div>
        </div>
      </div>

      {/* Project Spec Detail Modal */}
      {selectedModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-2xl rounded-2xl p-6 sm:p-10 border border-strong glass-panel shadow-2xl relative animate-scaleUp overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={handleCloseModal}
              onMouseEnter={() => playMicroSound('hover', audioEnabled)}
              className="absolute top-6 right-6 p-2 rounded-full border border-subtle hover:scale-105 transition-transform"
            >
              <X className="w-5 h-5 text-primary" />
            </button>

            <div className="flex items-center gap-3">
              <span className="font-mono-tech text-xs text-muted uppercase">
                PROJECT CASE STUDY // {selectedModalProject.year}
              </span>
            </div>

            <h3 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 uppercase tracking-tight">
              {selectedModalProject.title}
            </h3>
            <p className="font-mono-tech text-xs text-muted mt-1 uppercase">
              CLIENT: {selectedModalProject.client}
            </p>

            <p className="mt-6 text-sm sm:text-base leading-relaxed text-muted font-light">
              {selectedModalProject.description}
            </p>

            <div className="mt-8 pt-6 border-t border-subtle">
              <h4 className="font-mono-tech text-xs uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                TECHNICAL PERFORMANCE METRICS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedModalProject.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-subtle bg-primary/5 font-mono-tech text-xs font-medium"
                  >
                    {metric}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {selectedModalProject.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full border border-subtle font-mono-tech text-xs text-muted"
                >
                  #{t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-full border border-strong glass-panel font-mono-tech text-xs uppercase hover:bg-primary hover:text-black transition-colors"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
