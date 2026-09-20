import React, { useState } from 'react';

export default function ServicesView({ services = [], onOpenEstimator }) {
  const [activeServiceId, setActiveServiceId] = useState('structural-engineering');

  const activeService = services.find((s) => s.id === activeServiceId) || services[0];

  return (
    <div className="view-enter pt-24 pb-24 px-6 md:px-12 max-w-container mx-auto">
      {/* Header */}
      <div className="mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-[11px] font-sans font-bold tracking-wider uppercase text-[#08184E] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#08184E] animate-pulse"></span>
          Disciplines & Expertise • G+Unlimited Dubai Licensed
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#08184E] tracking-tight">
          Comprehensive <span className="italic text-gradient-gold">Engineering Services</span>
        </h1>
        <p className="text-[#4A443C] text-sm sm:text-base max-w-2xl font-sans font-normal mt-2 leading-relaxed">
          From complex 40+ storey towers to specialized wide-body aviation hangars, we provide full-lifecycle structural consultancy, value engineering, and authority approvals across the GCC.
        </p>
      </div>

      {/* Services Tab Selector (Glass Tab Bar) */}
      <div className="flex flex-wrap gap-2.5 p-2 rounded-3xl glass-tab-bar mb-10 shadow-lg">
        {services.map((svc) => {
          const isActive = activeServiceId === svc.id;
          return (
            <button
              key={svc.id}
              onClick={() => setActiveServiceId(svc.id)}
              className={`flex-1 min-w-[200px] p-4 rounded-2xl text-left transition-all duration-200 border ${
                isActive
                  ? 'bg-[#08184E] border-[#08184E] text-white shadow-md scale-[1.01]'
                  : 'bg-transparent border-transparent text-[#4A443C] hover:text-[#08184E] hover:bg-white hover:shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`material-symbols-outlined text-xl ${isActive ? 'text-gold-300' : 'text-gold-600'}`}>
                  {svc.icon}
                </span>
                <span className={`text-[10px] font-sans tracking-widest uppercase font-bold ${isActive ? 'text-gold-300' : 'text-gold-700'}`}>
                  DISCIPLINE
                </span>
              </div>
              <div className={`text-sm font-bold truncate font-sans ${isActive ? 'text-white' : 'text-[#08184E]'}`}>
                {svc.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Service Showcase (Frosted Glass Panel) */}
      {activeService && (
        <div className="rounded-3xl glass-panel shadow-2xl p-8 md:p-12 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase text-[#08184E] glass-badge px-3.5 py-1 rounded-full font-bold font-sans shadow-xs">
              <span className="material-symbols-outlined text-sm text-gold-600">{activeService.icon}</span>
              <span>Core Practice Area</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#08184E] tracking-tight">
              {activeService.title}
            </h2>

            <p className="text-[#3E3830] text-sm sm:text-base font-sans leading-relaxed">
              {activeService.short}
            </p>

            <div className="space-y-3 pt-4 border-t border-white/60">
              <h4 className="text-xs uppercase tracking-wider text-gold-800 font-bold font-sans">
                Key Deliverables & Technical Capabilities:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#3E3830] font-sans">
                {activeService.deliverables.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl glass-panel-subtle shadow-xs">
                    <span className="material-symbols-outlined text-gold-700 text-base shrink-0 mt-0.5">
                      verified
                    </span>
                    <span className="leading-relaxed font-semibold">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenEstimator}
                className="px-7 py-3.5 rounded-xl bg-[#08184E] hover:bg-[#0D226B] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-2.5 transition-all hover:scale-[1.02]"
              >
                <span>Request Scope for this Service</span>
                <span className="material-symbols-outlined text-base text-gold-400">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="p-4 rounded-3xl glass-card shadow-xl space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-inner">
                <img
                  src="/core_data/BEST/List of projects to be showcased/46. DC AVIATION - AL FUTTAIM HANGAR 1.jpeg"
                  alt="Aviation Hangar Engineering"
                  className="w-full h-full object-cover filter brightness-100 contrast-105"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero-bridge.jpg';
                  }}
                />
              </div>

              <div className="p-2 space-y-2 text-xs font-sans text-[#4A443C]">
                <div className="flex justify-between border-b border-white/60 pb-1.5">
                  <span className="text-[#6E665B] font-medium">Standards Compliant:</span>
                  <span className="text-[#08184E] font-bold">IBC, Eurocode, BS, GCAA, EASA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E665B] font-medium">Software Suite:</span>
                  <span className="text-gold-700 font-bold">ETABS, SAFE, Revit, STAAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engineering Delivery Process */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#08184E] tracking-tight">
            Our 4-Stage Engineering Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-[#6E665B] mt-2 font-sans leading-relaxed">
            Rigorous computational modeling and authority compliance from concept to handover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Concept & Structural Scheme',
              desc: 'Architectural coordination, initial column grid optimization, gravity and lateral load system selection.',
              icon: 'draw',
            },
            {
              step: '02',
              title: 'Parametric FEA & Wind Analysis',
              desc: '3D finite element structural modeling, dynamic wind tunnel integration, and seismic response spectrum analysis.',
              icon: 'query_stats',
            },
            {
              step: '03',
              title: 'Authority Permitting & AoR',
              desc: 'Submission to Dubai Municipality, Trakhees, DDA, Civil Defence, and third-party peer review sign-offs.',
              icon: 'verified_user',
            },
            {
              step: '04',
              title: 'Site Supervision & Handover',
              desc: 'Resident engineer inspection, rebar and post-tensioning sign-offs, and final building completion certificates.',
              icon: 'domain_verification',
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl glass-card hover:shadow-xl transition-all space-y-4 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold text-[#08184E] tracking-wider glass-badge px-2.5 py-1 rounded-lg">
                  STAGE {s.step}
                </span>
                <span className="material-symbols-outlined text-gold-600 text-2xl">{s.icon}</span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#08184E]">{s.title}</h3>
              <p className="text-xs text-[#4A443C] font-sans leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
