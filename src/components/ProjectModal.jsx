import React, { useState, useEffect } from 'react';

export default function ProjectModal({ project, onClose }) {
  const [viewMode, setViewMode] = useState('photo'); // 'photo' | 'blueprint'
  const [activeLayer, setActiveLayer] = useState('structural'); // 'structural' | 'seismic' | 'environmental'

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-brand-950/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-brand-900 border border-white/15 rounded-2xl shadow-glass-2 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-brand-950/90 border-b border-white/[0.08] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cobalt-400 animate-pulse" />
            <span className="font-mono text-xs text-cobalt-400 tracking-widest uppercase">
              MUNICIPAL ARCHIVE // {project.code || 'LA-CIVIC-01'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-steel-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close Project Viewer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Visual Header with Toggle */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-brand-950 min-h-[340px] flex items-center justify-center">
            {viewMode === 'photo' ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-80 md:h-[400px] object-cover filter brightness-95 hover:brightness-100 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-80 md:h-[400px] blueprint-grid flex flex-col items-center justify-center p-8 text-center bg-brand-950 relative">
                {/* Simulated CAD Wireframe Overlay */}
                <div className="w-24 h-24 rounded-full border border-cobalt-400/40 flex items-center justify-center text-cobalt-400 mb-4 animate-pulse">
                  <span className="material-symbols-outlined text-5xl">architecture</span>
                </div>
                <div className="font-mono text-xs text-cobalt-400 tracking-[0.3em] uppercase mb-1">
                  CAD BLUEPRINT & BIM SCHEMATIC
                </div>
                <div className="text-base font-semibold text-white max-w-md">
                  {project.title} — Structural Engineering Model & Coordinate Grid
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs font-mono text-steel-400">
                  <span className="bg-brand-900 px-3 py-1 rounded border border-white/10">SCALE: 1:500</span>
                  <span className="bg-brand-900 px-3 py-1 rounded border border-white/10">DATUM: NAVD88</span>
                  <span className="bg-brand-900 px-3 py-1 rounded border border-white/10">SEISMIC CAT: D / M8.0</span>
                </div>
              </div>
            )}

            {/* Mode Switcher Pill */}
            <div className="absolute bottom-4 right-4 flex items-center bg-brand-950/90 border border-white/10 p-1 rounded-lg backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode('photo')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${
                  viewMode === 'photo'
                    ? 'bg-cobalt-600 text-white font-bold shadow-sm'
                    : 'text-steel-400 hover:text-white'
                }`}
              >
                Site View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('blueprint')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${
                  viewMode === 'blueprint'
                    ? 'bg-cobalt-600 text-white font-bold shadow-sm'
                    : 'text-steel-400 hover:text-white'
                }`}
              >
                CAD Blueprint
              </button>
            </div>
          </div>

          {/* Project Title & Overview */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2.5">
              <span className="px-2.5 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider bg-cobalt-500/20 text-cobalt-300 border border-cobalt-400/30">
                {project.category || 'Civil Infrastructure'}
              </span>
              <span className="text-xs font-mono text-steel-400">
                Delivered {project.year || '2024'} · City of Los Angeles
              </span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
              {project.title}
            </h3>
            <p className="text-steel-300 text-sm leading-relaxed mt-2.5 font-light">
              {project.fullDescription || project.desc}
            </p>
          </div>

          {/* Engineering Specifications Grid */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-cobalt-400 font-semibold mb-3">
              Engineering & Structural Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-brand-950 border border-white/[0.08]">
                <span className="block font-mono text-[10px] text-steel-400 uppercase">Capital Budget</span>
                <span className="block font-display text-xl font-bold text-white mt-1">
                  {project.budget || '$588M'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-brand-950 border border-white/[0.08]">
                <span className="block font-mono text-[10px] text-steel-400 uppercase">Structural Dimension</span>
                <span className="block font-display text-xl font-bold text-white mt-1">
                  {project.span || '3,500 ft'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-brand-950 border border-white/[0.08]">
                <span className="block font-mono text-[10px] text-steel-400 uppercase">Material Schedule</span>
                <span className="block font-display text-xl font-bold text-white mt-1">
                  {project.concrete || '110,000 CY'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-brand-950 border border-white/[0.08]">
                <span className="block font-mono text-[10px] text-steel-400 uppercase">Seismic Rating</span>
                <span className="block font-display text-xl font-bold text-white mt-1">
                  {project.seismic || 'M8.0 Rated'}
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Leadership Strip */}
          <div className="p-5 rounded-xl bg-brand-950/80 border border-cobalt-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 shrink-0">
                <span className="material-symbols-outlined text-2xl">energy_savings_leaf</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Sustainability & LEED Platinum Verification</div>
                <div className="text-xs text-steel-400 font-light">
                  Envision Platinum Infrastructure Verified · 45% Embodied Carbon Reduction Target
                </div>
              </div>
            </div>
            <a
              href="https://engpermits.lacity.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-xs font-mono text-cobalt-300 border border-white/10 transition-colors whitespace-nowrap"
            >
              Request Public Project Record
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
