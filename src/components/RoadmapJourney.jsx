import React, { useState, useEffect, useRef } from 'react';

export default function RoadmapJourney({ milestones = [] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);
  const waypointRefs = useRef([]);

  // Default milestones with enriched technical metadata & icons
  const defaultMilestones = [
    {
      year: '2010',
      title: 'Foundation in Dubai',
      badge: 'FOUNDATION',
      desc: 'Established Bureau of Engineering Studies (BEST) in Dubai, securing Grade 1 municipal licensing for complex structural engineering.',
      metric: 'Grade 1 License · Core Team Inception',
      icon: 'domain',
      color: '#E05638', // Warm Terracotta / Orange Red
      lightColor: '#FFEBE6',
    },
    {
      year: '2014',
      title: 'Aviation & Large-Span Milestone',
      badge: 'AVIATION SPECIALTY',
      desc: 'Commissioned for first wide-body aircraft MRO hangar at Dubai South (DWC), establishing our specialized large-span aviation practice.',
      metric: '100m+ Clear-Span · EASA/FAA Compliant',
      icon: 'flight',
      color: '#0284C7', // Sky Blue / Cyan
      lightColor: '#E0F2FE',
    },
    {
      year: '2017',
      title: 'Regional GCC Expansion',
      badge: 'REGIONAL GROWTH',
      desc: 'Expanded operations to Muscat (Sultanate of Oman) and Katara Hotel Towers superstructures in Lusail, Qatar.',
      metric: '3 GCC Nations · 15M+ Sq.Ft Engineered',
      icon: 'public',
      color: '#0D9488', // Teal Emerald
      lightColor: '#CCFBF1',
    },
    {
      year: '2020',
      title: 'G+4 Dubai Licensure',
      badge: 'G+4 LICENSED',
      desc: 'Awarded Dubai Municipality G+4 structural design license, enabling comprehensive residential, commercial, and industrial structural engineering.',
      metric: 'G+4 Floors · Comprehensive Structural Authority',
      icon: 'apartment',
      color: '#D97706', // Architectural Amber Gold
      lightColor: '#FEF3C7',
    },
    {
      year: '2024+',
      title: 'Digital Engineering & BIM Level 3',
      badge: 'INNOVATION',
      desc: 'Delivering 40M+ sq.ft across 1,000+ completed developments with automated FEA modeling, 4D BIM digital twins, and advanced value engineering.',
      metric: '1,000+ Landmark Projects · 4D Digital Twins',
      icon: 'hub',
      color: '#08184E', // Royal Navy & Gold
      lightColor: '#E8EEFA',
    },
  ];

  const items = milestones.length > 0 ? milestones.map((m, i) => ({
    ...defaultMilestones[i % defaultMilestones.length],
    ...m,
  })) : defaultMilestones;

  // Track scroll position inside section to progressively unlock stops
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far through the section the viewport is
      const start = rect.top - windowHeight * 0.7;
      const totalDist = rect.height;
      const progress = Math.min(Math.max(-start / totalDist, 0), 1);
      
      setScrollProgress(progress);

      // Determine active step based on scroll
      let highestStep = 0;
      waypointRefs.current.forEach((el, index) => {
        if (!el) return;
        const elRect = el.getBoundingClientRect();
        // If element is above the bottom 65% of viewport
        if (elRect.top < windowHeight * 0.65) {
          highestStep = index;
        }
      });
      setActiveStep(highestStep);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  const scrollToStep = (index) => {
    setActiveStep(index);
    const target = waypointRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div ref={sectionRef} className="relative w-full max-w-6xl mx-auto py-12 select-none">
      {/* ───────────────────────────────────────────
         HEADER & INTERACTIVE ROAD TRACKER BAR
      ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-[11px] font-sans font-bold tracking-wider uppercase text-[#08184E] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-600 animate-pulse" />
            <span>HISTORICAL ROADMAP // 2010 — PRESENT</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#08184E] tracking-tight mt-2.5">
            Our Journey of <span className="italic text-gradient-gold">Excellence</span>
          </h2>
          <p className="text-[#6E665B] text-xs sm:text-sm font-sans mt-1.5 max-w-xl">
            Follow the winding milestone highway charting 15+ years of landmark structural accomplishments across Dubai and the Middle East.
          </p>
        </div>

        {/* Milestone Quick Jump Tabs */}
        <div className="p-1.5 rounded-2xl glass-tab-bar flex flex-wrap items-center gap-1 shadow-sm self-start md:self-auto">
          {items.map((m, idx) => {
            const isPassed = idx <= activeStep;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToStep(idx)}
                className={`px-3 py-1.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeStep === idx
                    ? 'bg-[#08184E] text-white shadow-md scale-105'
                    : isPassed
                    ? 'text-[#08184E] hover:bg-white/60'
                    : 'text-[#8A8275] hover:text-[#08184E]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ backgroundColor: isPassed ? m.color : '#C4B9A5' }}
                />
                <span>{m.year}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────
         THE 3D WINDING HIGHWAY (SVG Road System + Interactive Stops)
      ─────────────────────────────────────────── */}
      <div className="relative w-full">
        {/* SVG Background Highway Path (Desktop S-Curve Road) */}
        <div className="absolute inset-0 hidden md:block pointer-events-none">
          <svg
            viewBox="0 0 1000 1600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Road Asphalt Texture Gradient */}
              <linearGradient id="roadAsphalt" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1B243B" />
                <stop offset="50%" stopColor="#141C30" />
                <stop offset="100%" stopColor="#0E1424" />
              </linearGradient>

              {/* Road Drop Shadow Filter */}
              <filter id="roadShadow" x="-10%" y="-5%" width="120%" height="110%">
                <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#08184E" floodOpacity="0.14" />
              </filter>
            </defs>

            {/* S-Curve Path: Sweeps through 2010 (left), 2014 (right), 2017 (left), 2020 (right), 2024 (center) */}
            <path
              d="M 500 40 
                 C 220 120, 220 280, 500 360 
                 C 780 440, 780 600, 500 680 
                 C 220 760, 220 920, 500 1000 
                 C 780 1080, 780 1240, 500 1320
                 C 320 1390, 420 1520, 500 1560"
              stroke="#08184E"
              strokeWidth="110"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#roadShadow)"
              opacity="0.08"
            />

            {/* Main Asphalt Highway Surface */}
            <path
              d="M 500 40 
                 C 220 120, 220 280, 500 360 
                 C 780 440, 780 600, 500 680 
                 C 220 760, 220 920, 500 1000 
                 C 780 1080, 780 1240, 500 1320
                 C 320 1390, 420 1520, 500 1560"
              stroke="url(#roadAsphalt)"
              strokeWidth="86"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Road Curb Edge Glow Lines */}
            <path
              d="M 500 40 
                 C 220 120, 220 280, 500 360 
                 C 780 440, 780 600, 500 680 
                 C 220 760, 220 920, 500 1000 
                 C 780 1080, 780 1240, 500 1320
                 C 320 1390, 420 1520, 500 1560"
              stroke="white"
              strokeWidth="84"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.15"
            />

            {/* Inner Asphalt Core */}
            <path
              d="M 500 40 
                 C 220 120, 220 280, 500 360 
                 C 780 440, 780 600, 500 680 
                 C 220 760, 220 920, 500 1000 
                 C 780 1080, 780 1240, 500 1320
                 C 320 1390, 420 1520, 500 1560"
              stroke="#182033"
              strokeWidth="78"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dashed Center Road Stripe */}
            <path
              d="M 500 40 
                 C 220 120, 220 280, 500 360 
                 C 780 440, 780 600, 500 680 
                 C 220 760, 220 920, 500 1000 
                 C 780 1080, 780 1240, 500 1320
                 C 320 1390, 420 1520, 500 1560"
              stroke="#FBF7EE"
              strokeWidth="4"
              strokeDasharray="18 20"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Active Gold Glowing Center Progress Highway */}
            <path
              d="M 500 40 
                 C 220 120, 220 280, 500 360 
                 C 780 440, 780 600, 500 680 
                 C 220 760, 220 920, 500 1000 
                 C 780 1080, 780 1240, 500 1320
                 C 320 1390, 420 1520, 500 1560"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeDasharray="18 20"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDashoffset: `${-(scrollProgress * 600)}`,
                transition: 'stroke-dashoffset 150ms linear',
                filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.8))',
              }}
            />
          </svg>
        </div>

        {/* Mobile Vertical Glowing Road Guide (Visible on Small Screens) */}
        <div className="absolute top-8 bottom-8 left-8 w-2 md:hidden rounded-full bg-[#182033] shadow-inner">
          <div
            className="w-full bg-gradient-to-b from-gold-500 via-amber-400 to-gold-600 rounded-full transition-all duration-300"
            style={{ height: `${Math.min(scrollProgress * 100, 100)}%` }}
          />
        </div>

        {/* ───────────────────────────────────────────
           MILESTONE WAYPOINTS & 3D LOCATION PINS
        ─────────────────────────────────────────── */}
        <div className="relative space-y-16 sm:space-y-24 md:space-y-32 py-8">
          {items.map((milestone, idx) => {
            const isLeft = idx % 2 === 0;
            const isUnlocked = idx <= activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div
                key={idx}
                ref={(el) => (waypointRefs.current[idx] = el)}
                className={`relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 transition-all duration-700 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* 1. MILESTONE CONTENT CARD */}
                <div
                  onClick={() => scrollToStep(idx)}
                  className={`w-full md:w-[45%] ml-16 md:ml-0 cursor-pointer rounded-3xl p-6 sm:p-8 transition-all duration-500 relative overflow-hidden group ${
                    isUnlocked
                      ? 'glass-card shadow-2xl border-white/90 scale-100 opacity-100 hover:border-gold-500/60'
                      : 'glass-panel opacity-60 scale-95 border-dashed border-[#D8CEB9]'
                  }`}
                  style={{
                    boxShadow: isCurrent
                      ? `0 20px 40px -10px ${milestone.color}25, 0 0 0 2px ${milestone.color}40`
                      : undefined,
                  }}
                >
                  {/* Top Ambient Glow Pill */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 opacity-90 transition-all duration-500"
                    style={{
                      background: `linear-gradient(90deg, ${milestone.color}, transparent)`,
                    }}
                  />

                  {/* Top Row: Year Header & Category Badge */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight"
                        style={{ color: isUnlocked ? milestone.color : '#6E665B' }}
                      >
                        {milestone.year}
                      </span>
                      {isCurrent && (
                        <span className="flex h-2.5 w-2.5 relative">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ backgroundColor: milestone.color }}
                          />
                          <span
                            className="relative inline-flex rounded-full h-2.5 w-2.5"
                            style={{ backgroundColor: milestone.color }}
                          />
                        </span>
                      )}
                    </div>

                    <span
                      className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs transition-all"
                      style={{
                        backgroundColor: milestone.lightColor,
                        color: milestone.color,
                        border: `1px solid ${milestone.color}35`,
                      }}
                    >
                      {milestone.badge}
                    </span>
                  </div>

                  {/* Milestone Title */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#08184E] tracking-tight group-hover:text-gold-700 transition-colors">
                    {milestone.title}
                  </h3>

                  {/* Milestone Narrative Description */}
                  <p className="text-xs sm:text-sm text-[#4A443C] font-sans leading-relaxed mt-2.5 font-normal">
                    {milestone.desc}
                  </p>

                  {/* Bottom Technical Metric Bar */}
                  {milestone.metric && (
                    <div className="mt-4 pt-3.5 border-t border-[#EDE5D5] flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-2 text-[#08184E] font-semibold">
                        <span
                          className="material-symbols-outlined text-base"
                          style={{ color: milestone.color }}
                        >
                          verified
                        </span>
                        <span className="text-[11.5px]">{milestone.metric}</span>
                      </div>
                      <span className="text-[10.5px] font-bold text-gold-700 tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                        Stop #{String(idx + 1).padStart(2, '0')} →
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. ELEVATED 3D LOCATION PIN (Centered on Highway / Road Curve) */}
                <div
                  onClick={() => scrollToStep(idx)}
                  className="absolute left-8 md:left-1/2 -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center group/pin"
                >
                  {/* Floating 3D Map Pin Body */}
                  <div
                    className={`relative w-14 h-18 sm:w-16 sm:h-20 flex flex-col items-center justify-center transition-all duration-500 ease-out transform ${
                      isCurrent
                        ? '-translate-y-4 scale-110'
                        : isUnlocked
                        ? '-translate-y-2 scale-100 hover:-translate-y-3.5 hover:scale-105'
                        : 'translate-y-0 scale-90 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* SVG 3D Pin Container */}
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl relative p-1 transition-transform duration-300 group-hover/pin:rotate-6"
                      style={{
                        background: `linear-gradient(145deg, ${milestone.color}, #08184E)`,
                        boxShadow: isCurrent
                          ? `0 14px 28px -4px ${milestone.color}80, 0 0 0 4px #FFFFFF`
                          : `0 8px 20px -4px rgba(0,0,0,0.3), 0 0 0 2px #FFFFFF`,
                      }}
                    >
                      {/* Inner White Core with Material Icon */}
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                        <span
                          className="material-symbols-outlined text-2xl sm:text-3xl font-bold transition-transform group-hover/pin:scale-110"
                          style={{ color: milestone.color }}
                        >
                          {milestone.icon || 'location_on'}
                        </span>
                      </div>

                      {/* Teardrop Pointy Tail */}
                      <div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                        style={{
                          backgroundColor: '#08184E',
                        }}
                      />
                    </div>

                    {/* Ground Asphalt Pin Shadow */}
                    <div
                      className={`w-8 h-3 rounded-full bg-black/40 blur-xs mt-3 transition-all duration-500 ${
                        isCurrent ? 'scale-125 opacity-70' : 'scale-90 opacity-40'
                      }`}
                    />
                  </div>
                </div>

                {/* 3. EMPTY OPPOSITE SPACER (For Balanced 2-Column S-Curve Layout on Desktop) */}
                <div className="hidden md:block md:w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────
         ROADMAP FOOTER CELEBRATION (Present & Future Summit)
      ─────────────────────────────────────────── */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-card border border-gold-400/40 shadow-xl">
          <span className="material-symbols-outlined text-2xl text-gold-600 animate-bounce">
            flag
          </span>
          <div className="text-left">
            <div className="font-serif text-sm font-bold text-[#08184E]">
              15+ Years of Proven Structural Engineering Leadership
            </div>
            <div className="font-sans text-[11px] text-[#6E665B]">
              1,000+ Completed Projects · Expanding into AI-assisted Generative Structural Engineering
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
