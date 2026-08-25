import React, { useState } from 'react';
import { Send, Check, Mail, ArrowUpRight, Globe, Share2 } from 'lucide-react';
import { playMicroSound } from '../../utils/audio';

export default function Outro({ setIsContactHovered, audioEnabled }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSent(true);
    playMicroSound('modal', audioEnabled);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full px-6 py-24 md:px-16 md:py-32 z-10 select-none flex flex-col justify-between"
    >
      {/* Section Header */}
      <div className="reveal-item flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-subtle pb-6 mb-12">
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-muted">
            INDEX 04 // SYNTHESIS
          </span>
          <span className="h-3 w-px bg-border-subtle"></span>
          <h2 className="font-display font-bold text-xl md:text-2xl uppercase tracking-tight">
            Outro &amp; Contact
          </h2>
        </div>
        <span className="font-mono-tech text-xs text-muted mt-2 sm:mt-0">
          [ OPEN FOR SELECTED COMMISSIONS ]
        </span>
      </div>

      {/* Main Contact Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        {/* Left Editorial Prompt with Parallax */}
        <div data-speed="0.12" className="reveal-item lg:col-span-6 space-y-6">
          <h3 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase tracking-tighter leading-[0.95]">
            Let's Shape <br />
            <span className="italic font-serif-editorial text-iridescent">
              Digital Matter.
            </span>
          </h3>
          <p className="text-muted text-sm sm:text-base font-light max-w-md leading-relaxed">
            Have a project requiring high-end tactile WebGL, computational design, or bespoke interactive choreography? Let's discuss your vision.
          </p>

          <div className="pt-4 flex flex-col gap-3 font-mono-tech text-xs">
            <a
              href="mailto:contact@form-and-matter.studio"
              onMouseEnter={() => playMicroSound('hover', audioEnabled)}
              className="flex items-center gap-2 text-primary hover:underline underline-offset-4 pointer-events-auto"
            >
              <Mail className="w-4 h-4 text-muted" />
              <span>contact@form-and-matter.studio</span>
            </a>
            <div className="flex items-center gap-4 text-muted pt-2 pointer-events-auto">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => playMicroSound('hover', audioEnabled)}
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => playMicroSound('hover', audioEnabled)}
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => playMicroSound('hover', audioEnabled)}
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X / Twitter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-6 pointer-events-auto">
          <form
            onSubmit={handleSubmit}
            onMouseEnter={() => {
              setIsContactHovered(true);
            }}
            onMouseLeave={() => setIsContactHovered(false)}
            className="p-8 sm:p-10 rounded-2xl border border-subtle glass-panel space-y-4"
          >
            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-muted mb-2">
                Your Name / Studio
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Elena Rostova"
                className="w-full px-4 py-3 rounded-lg border border-subtle bg-primary/5 focus:border-strong focus:outline-none font-mono-tech text-xs text-primary transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-muted mb-2">
                Electronic Mail
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="elena@studio.com"
                className="w-full px-4 py-3 rounded-lg border border-subtle bg-primary/5 focus:border-strong focus:outline-none font-mono-tech text-xs text-primary transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono-tech text-xs uppercase tracking-wider text-muted mb-2">
                Project Scope / Message
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your requirements, timeline, or design brief..."
                className="w-full px-4 py-3 rounded-lg border border-subtle bg-primary/5 focus:border-strong focus:outline-none font-mono-tech text-xs text-primary transition-colors resize-none"
              />
            </div>

            {/* Magnetic CTA Submit Button */}
            <button
              type="submit"
              onMouseEnter={() => playMicroSound('hover', audioEnabled)}
              className="w-full py-4 rounded-xl border border-strong glass-panel font-mono-tech text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-all duration-300 hover:scale-[1.01]"
            >
              {isSent ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>TRANSMISSION DISPATCHED</span>
                </>
              ) : (
                <>
                  <span>Dispatch Transmission</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Colophon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-12 border-t border-subtle font-mono-tech text-xs text-muted">
        <div>
          <span>FORM &amp; MATTER © 2026</span>
          <span className="mx-2">•</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>
        <div>
          <span>DESIGNED WITH TACTILE PRECISION</span>
        </div>
      </div>
    </section>
  );
}
