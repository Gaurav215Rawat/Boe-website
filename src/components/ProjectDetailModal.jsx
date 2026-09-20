import React, { useState, useEffect } from 'react';

export default function ProjectDetailModal({ project, onClose, onSelectProject, allProjects = [] }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.primaryImage];
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.location === project.location))
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#08184E]/40 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto glass-modal rounded-3xl text-[#08184E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass-panel border-b border-white/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="font-sans text-xs text-[#08184E] uppercase tracking-wider font-bold">
              BEST ARCHIVE // #{project.slNo || project.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-steel-600 hover:text-[#08184E] hover:bg-white/60 transition-colors focus:outline-none"
            aria-label="Close Project Viewer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 md:p-10 space-y-8">
          {/* Main Visual Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden glass-panel aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center shadow-md">
              <img
                src={images[activeImageIndex] || project.primaryImage}
                alt={project.title}
                className="w-full h-full object-cover filter brightness-100 contrast-105"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero-bridge.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08184E]/70 via-transparent to-transparent pointer-events-none" />
              
              {/* Category & Client Badge */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider glass-badge shadow-sm">
                  {project.category}
                </span>
                {project.client && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider glass-badge shadow-sm">
                    Client: {project.client}
                  </span>
                )}
              </div>

              {/* Location & Year */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-sans text-[#08184E]">
                <div className="flex items-center gap-1.5 glass-badge px-3 py-1 rounded-md shadow-sm font-semibold">
                  <span className="material-symbols-outlined text-sm text-gold-600">location_on</span>
                  <span>{project.location}</span>
                </div>
                <div className="glass-badge px-3 py-1 rounded-md shadow-sm font-semibold">
                  <span>Delivered: {project.year}</span>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 glass-tab-bar p-2 rounded-2xl">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#08184E] shadow-md scale-105 ring-2 ring-[#08184E]'
                        : 'border-white/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover filter brightness-100"
                      onError={(e) => {
                        e.currentTarget.src = '/images/hero-bridge.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Scope Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#08184E] tracking-tight leading-tight">
                {project.title}
              </h2>

              <div className="p-5 rounded-2xl glass-panel space-y-3">
                <h4 className="font-sans text-xs uppercase tracking-widest text-gold-800 font-bold">
                  Engineering Scope & Technical Parameters
                </h4>
                <p className="text-sm text-steel-800 font-sans leading-relaxed whitespace-pre-line">
                  {project.details || 'Comprehensive civil and structural engineering consultancy delivered by Bureau of Engineering Studies (BEST).'}
                </p>
              </div>

              {/* Services Tags */}
              <div>
                <h5 className="font-sans text-[11px] uppercase tracking-wider text-steel-600 mb-2.5 font-semibold">
                  Core Services Rendered:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(project.services || ['Structural Engineering', 'Authority AoR Clearances']).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-sans glass-badge flex items-center gap-1.5 font-medium"
                    >
                      <span className="material-symbols-outlined text-sm text-gold-600">check_circle</span>
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Fact Sheet Box */}
            <div className="lg:col-span-4 p-6 rounded-2xl glass-panel-subtle space-y-5">
              <h4 className="font-sans text-xs uppercase tracking-widest text-gold-800 font-bold border-b border-white/50 pb-3">
                Project Key Data
              </h4>

              <div className="space-y-3 text-xs font-sans">
                <div>
                  <span className="text-steel-500 block text-[10px] uppercase font-semibold">Client / Brand</span>
                  <span className="text-[#08184E] font-bold text-sm">{project.client}</span>
                </div>
                <div>
                  <span className="text-steel-500 block text-[10px] uppercase font-semibold">Category</span>
                  <span className="text-steel-800 font-medium">{project.category}</span>
                </div>
                <div>
                  <span className="text-steel-500 block text-[10px] uppercase font-semibold">Sector</span>
                  <span className="text-steel-800 font-medium">{project.sector || 'Commercial'}</span>
                </div>
                <div>
                  <span className="text-steel-500 block text-[10px] uppercase font-semibold">Location</span>
                  <span className="text-steel-800 font-medium">{project.location}</span>
                </div>
                <div>
                  <span className="text-steel-500 block text-[10px] uppercase font-semibold">Status</span>
                  <span className="text-emerald-700 font-bold">Delivered & Verified</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/50">
                <a
                  href={`https://wa.me/97144567890?text=Inquiry%20regarding%20BEST%20Project:%20${encodeURIComponent(project.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#08184E] hover:bg-[#0c226b] text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span className="material-symbols-outlined text-base text-gold-400">chat</span>
                  <span>Enquire About Similar Project</span>
                </a>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="pt-8 border-t border-white/50 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#08184E]">
                Related Landmark Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProjects.map((rp) => (
                  <div
                    key={rp.id}
                    onClick={() => onSelectProject(rp)}
                    className="p-3 rounded-xl glass-card cursor-pointer transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={rp.primaryImage}
                      alt={rp.title}
                      className="w-16 h-14 object-cover rounded-lg shrink-0 filter brightness-100"
                      onError={(e) => {
                        e.currentTarget.src = '/images/hero-bridge.jpg';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#08184E] group-hover:text-gold-700 transition-colors truncate">
                        {rp.title}
                      </div>
                      <div className="text-[10px] font-sans text-steel-500 truncate mt-0.5">
                        {rp.client} · {rp.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
