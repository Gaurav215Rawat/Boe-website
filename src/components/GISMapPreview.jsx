import React, { useState, useRef } from 'react';

export default function GISMapPreview({ onSelectProject }) {
  const [activeLayers, setActiveLayers] = useState({
    bridges: true,
    facilities: true,
    storm: true,
    sewers: false,
    parcels: false,
  });

  const [selectedPin, setSelectedPin] = useState(null);
  const [mouseCoords, setMouseCoords] = useState({ lat: '34.0537° N', lng: '118.2427° W' });

  const pins = [
    {
      id: 'sixth-st',
      code: 'LA-BRG-6TH',
      title: 'Sixth Street Viaduct',
      type: 'bridges',
      x: 62, // % from left
      y: 52, // % from top
      status: 'Commissioned 2022',
      budget: '$588M',
      spec: '10 Continuous Arches · Base Isolated M8.0',
      tag: 'Bridges & Highways',
    },
    {
      id: 'civic-center',
      code: 'LA-FAC-CIVIC',
      title: 'Civic Center Sustainable Complex',
      type: 'facilities',
      x: 48,
      y: 42,
      status: 'Construction Phase',
      budget: '$340M',
      spec: 'Mass Timber Hybrid · LEED Platinum',
      tag: 'Public Facilities',
    },
    {
      id: 'sustainability-hub',
      code: 'LA-ENV-WATER',
      title: 'Urban Watershed Reclamation',
      type: 'storm',
      x: 35,
      y: 65,
      status: 'Active Operations',
      budget: '$215M',
      spec: '2.4B Gal/yr Recharge · Santa Monica Bay',
      tag: 'Clean Water',
    },
    {
      id: 'hyperion-2035',
      code: 'LA-HYP-2035',
      title: 'Hyperion Water Transformation',
      type: 'sewers',
      x: 22,
      y: 78,
      status: 'Environmental Review',
      budget: '$1.2B',
      spec: '100% Recycled Water by 2035',
      tag: 'Wastewater',
    },
    {
      id: 'van-nuys-hub',
      code: 'LA-VAL-01',
      title: 'Valley Municipal Service Hub',
      type: 'facilities',
      x: 28,
      y: 22,
      status: 'Active Public Counter',
      budget: '$85M',
      spec: 'District Engineering Office & Permit Desk',
      tag: 'Municipal Services',
    },
  ];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const lat = (34.0537 + (50 - yPct) * 0.003).toFixed(4);
    const lng = (118.2427 + (50 - xPct) * 0.003).toFixed(4);
    setMouseCoords({ lat: `${lat}° N`, lng: `${lng}° W` });
  };

  const toggleLayer = (layerKey) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="rounded-2xl bg-brand-900 border border-white/[0.08] overflow-hidden shadow-glass-2 relative">
      {/* Top Map HUD Bar */}
      <div className="px-5 py-3.5 bg-brand-950/90 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold tracking-wider text-white">
            NavigateLA 2.0 GIS CAD ENGINE
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-steel-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
            DATUM: NAVD88 / NAD83
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-steel-400">
          <div className="hidden md:flex items-center gap-2 bg-brand-850 px-2.5 py-1 rounded border border-white/[0.06]">
            <span className="text-steel-500">CURSOR:</span>
            <span className="text-cobalt-400 font-medium">{mouseCoords.lat}, {mouseCoords.lng}</span>
          </div>
          <a
            href="https://navigatela.lacity.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-cobalt-400 hover:text-cobalt-300 font-semibold"
          >
            <span>Launch Official GIS</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Layer Toggles Toolbar */}
      <div className="px-5 py-2.5 bg-brand-900/90 border-b border-white/[0.06] flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-[10px] uppercase tracking-wider text-steel-500 mr-2">
          ACTIVE LAYERS:
        </span>
        {[
          { key: 'bridges', label: 'Bridges & Overpasses', color: 'bg-blue-500' },
          { key: 'facilities', label: 'Civic Buildings', color: 'bg-emerald-500' },
          { key: 'storm', label: 'Watershed & Storm', color: 'bg-cyan-500' },
          { key: 'sewers', label: '6,700mi Sewer Network', color: 'bg-amber-500' },
          { key: 'parcels', label: 'Cadastral Parcels', color: 'bg-purple-500' },
        ].map((layer) => {
          const active = activeLayers[layer.key];
          return (
            <button
              key={layer.key}
              type="button"
              onClick={() => toggleLayer(layer.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] transition-all duration-200 border ${
                active
                  ? 'bg-white/[0.08] border-white/20 text-white shadow-sm'
                  : 'bg-transparent border-transparent text-steel-500 hover:text-steel-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${layer.color} ${active ? 'opacity-100' : 'opacity-30'}`} />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Map Canvas Simulation */}
      <div
        className="relative h-[420px] md:h-[480px] bg-brand-950 blueprint-grid cursor-crosshair overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onClick={() => setSelectedPin(null)}
      >
        {/* Subtle Map Topography Contours and Roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          {/* Simulated LA River / Coastal Arteries */}
          <path d="M -50,120 Q 200,180 380,240 T 700,320 T 1200,400" fill="none" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 4" opacity="0.4" />
          <path d="M 100,0 Q 280,180 500,220 T 900,350 T 1400,480" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="8 6" opacity="0.3" />
          {/* Simulated Freeway Arteries (101, 10, 110, 405) */}
          <line x1="0" y1="210" x2="1400" y2="210" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <line x1="520" y1="0" x2="520" y2="600" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <line x1="280" y1="0" x2="280" y2="600" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="840" y1="0" x2="840" y2="600" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Dynamic Sewer Network Layer */}
        {activeLayers.sewers && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 animate-pulse" xmlns="http://www.w3.org/2000/svg">
            <path d="M 120,400 L 300,340 L 520,380 L 800,410 L 1100,460" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M 520,100 L 520,380 L 300,340 L 150,420" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
        )}

        {/* Dynamic Stormwater Layer */}
        {activeLayers.storm && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35%" cy="65%" r="60" fill="rgba(6, 182, 212, 0.12)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="22%" cy="78%" r="45" fill="rgba(6, 182, 212, 0.12)" stroke="#06b6d4" strokeWidth="1" />
          </svg>
        )}

        {/* Interactive Map Pins */}
        {pins.map((pin) => {
          if (!activeLayers[pin.type]) return null;
          const isSelected = selectedPin?.id === pin.id;

          return (
            <div
              key={pin.id}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPin(pin);
              }}
            >
              {/* Pin Ring Marker */}
              <button
                type="button"
                className={`relative flex items-center justify-center transition-transform duration-200 ${
                  isSelected ? 'scale-125' : 'hover:scale-110'
                }`}
                aria-label={`Inspect ${pin.title}`}
              >
                <span className="absolute w-7 h-7 rounded-full bg-cobalt-500/20 animate-ping" />
                <span className="relative w-4 h-4 rounded-full bg-cobalt-500 border-2 border-white shadow-cobalt-glow flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </button>

              {/* Pin Label Tooltip */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-brand-950/90 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-white pointer-events-none shadow-sm backdrop-blur-md">
                {pin.title}
              </div>
            </div>
          );
        })}

        {/* Selected Pin Detail Callout Card */}
        {selectedPin && (
          <div
            className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 p-5 rounded-xl bg-brand-900/95 border border-cobalt-500/40 backdrop-blur-2xl shadow-glass-2 z-30 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-cobalt-400 font-semibold">
                {selectedPin.code} · {selectedPin.tag}
              </span>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-steel-400 hover:text-white p-0.5"
                aria-label="Close details"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <h4 className="font-display text-base font-bold text-white mb-1">
              {selectedPin.title}
            </h4>
            <p className="text-xs text-steel-300 font-light leading-relaxed mb-3">
              {selectedPin.spec}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-4 bg-brand-950/60 p-2.5 rounded border border-white/[0.06]">
              <div>
                <span className="text-steel-500 block text-[9px] uppercase">Status</span>
                <span className="text-emerald-400 font-medium">{selectedPin.status}</span>
              </div>
              <div>
                <span className="text-steel-500 block text-[9px] uppercase">Budget</span>
                <span className="text-white font-medium">{selectedPin.budget}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onSelectProject) {
                  onSelectProject({
                    id: selectedPin.id,
                    code: selectedPin.code,
                    title: selectedPin.title,
                    category: selectedPin.tag,
                    year: '2024',
                    budget: selectedPin.budget,
                    span: selectedPin.spec,
                    concrete: 'High-Performance Spec',
                    seismic: 'Triple Pendulum M8.0',
                    image: '/images/hero-bridge.jpg',
                    desc: selectedPin.spec,
                    fullDescription: `${selectedPin.title} is a signature civil engineering project delivering next-generation public infrastructure in the City of Los Angeles.`,
                  });
                }
              }}
              className="w-full py-2 px-3 rounded bg-cobalt-600 hover:bg-cobalt-500 text-white font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect Full Specifications</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        )}
      </div>

      {/* Map Bottom Legend Footer */}
      <div className="px-5 py-2.5 bg-brand-950/90 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[11px] font-mono text-steel-500">
        <div className="flex items-center gap-4">
          <span>COORDINATE SYSTEM: CA ZONE 5 (FT)</span>
          <span>·</span>
          <span>SCALE: 1:24,000</span>
        </div>
        <div className="text-steel-400">
          Click any landmark marker to inspect active engineering parameters
        </div>
      </div>
    </div>
  );
}
