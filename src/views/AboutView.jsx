import React, { useState } from 'react';
import Team3DCarousel from '../components/Team3DCarousel';
import RoadmapJourney from '../components/RoadmapJourney';

export default function AboutView({ staff = [], onOpenEstimator }) {
  const [teamDisplayMode, setTeamDisplayMode] = useState('3d'); // '3d' | 'grid'
  const [selectedStaffIndex, setSelectedStaffIndex] = useState(0);
  const milestones = [
    {
      year: '2010',
      title: 'Foundation in Dubai',
      desc: 'Established Bureau of Engineering Studies (BEST) in Dubai, securing Grade 1 municipal licensing for complex structural engineering.',
      badge: 'FOUNDATION',
    },
    {
      year: '2014',
      title: 'Aviation & Large-Span Milestone',
      desc: 'Commissioned for first wide-body aircraft MRO hangar at Dubai South (DWC), establishing our specialized large-span aviation practice.',
      badge: 'AVIATION SPECIALTY',
    },
    {
      year: '2017',
      title: 'Regional GCC Expansion',
      desc: 'Expanded operations to Muscat (Sultanate of Oman) and Katara Hotel Towers superstructures in Lusail, Qatar.',
      badge: 'REGIONAL GROWTH',
    },
    {
      year: '2020',
      title: 'G+Unlimited Dubai Licensure',
      desc: 'Awarded Dubai Municipality G+Unlimited structural design license, enabling unlimited height tower and mega-structure engineering.',
      badge: 'G+UNLIMITED',
    },
    {
      year: '2024+',
      title: 'Digital Engineering & BIM Level 3',
      desc: 'Delivering 40M+ sq.ft across 1,000+ completed developments with automated FEA modeling, 4D BIM digital twins, and advanced value engineering.',
      badge: 'INNOVATION',
    },
  ];

  const coreValues = [
    {
      icon: 'domain_verification',
      title: 'Structural Precision & Safety',
      desc: 'Zero-compromise structural safety through multi-tier computational finite element modeling, dynamic wind tunnel validation, and seismic resilience.',
    },
    {
      icon: 'query_stats',
      title: 'High-Impact Value Engineering',
      desc: 'Auditing and optimizing structural frame geometry, rebar tonnage, and foundation systems to deliver 10-20% material savings for clients.',
    },
    {
      icon: 'flight',
      title: 'Aviation & Clear-Span Authority',
      desc: 'Proven track record in 100m+ clear-span aircraft hangars, paint facilities, and logistics centers compliant with EASA, FAA, and GCAA codes.',
    },
    {
      icon: 'verified_user',
      title: 'Seamless Authority Clearances',
      desc: 'Decades of deep liaison with Dubai Municipality, Trakhees, DDA, Civil Defence, and Muscat Municipality for fast-track approvals.',
    },
  ];

  return (
    <div className="view-enter pt-24 pb-24 px-6 md:px-12 max-w-container mx-auto">
      {/* ───────────────────────────────────────────
         1. HERO SECTION (High-Definition Architectural Showcase)
      ─────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl mb-20 min-h-[580px] sm:min-h-[640px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 border border-[#E8DFCE]">
        {/* Dynamic Architectural Background - 100% Visible High Definition */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/core_data/BEST/List of projects to be showcased/1. Sharjah Bank.jpg"
            alt="Bureau of Engineering Studies Heritage"
            className="w-full h-full object-cover object-right md:object-center filter brightness-100 contrast-105"
            onError={(e) => {
              e.currentTarget.src = '/images/hero-bridge.jpg';
            }}
          />
          {/* Subtle cinematic gradient to ensure contrast without washing out the building */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none" />
        </div>

        {/* Frosted Glass Content Box - Hugs text tightly with frosted glassmorphism */}
        <div className="relative z-10 max-w-xl lg:max-w-2xl p-6 sm:p-8 md:p-10 rounded-3xl glass-card-hero space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 font-sans text-[10.5px] sm:text-[11px] tracking-wider uppercase text-[#08184E] glass-badge px-3.5 py-1.5 rounded-full font-bold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#08184E] animate-pulse" />
            <span>ESTABLISHED 2010 · G+UNLIMITED LICENSED</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#08184E] tracking-tight leading-[1.14]">
            Engineering Landmark Spaces. <br />
            <span className="italic text-gradient-gold">Inspiring Tomorrow.</span>
          </h1>

          <p className="text-[#1A1815] text-xs sm:text-sm md:text-[15px] font-sans font-normal leading-relaxed">
            Bureau of Engineering Studies (BEST) is a premier structural engineering and architectural consultancy headquartered in Dubai, UAE. Over 15+ years, our team of seasoned engineers has designed, audited, and delivered more than 1,000 landmark developments across the Middle East, Africa, and Asia.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onOpenEstimator}
              className="px-6 py-3 rounded-xl bg-[#08184E] hover:bg-[#0D226B] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-base text-gold-400">mail</span>
              <span>Enquire for Engineering Consultation</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stats (Frosted Glass Sub-Bar) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 p-5 sm:p-6 rounded-2xl glass-card-bar max-w-4xl">
          <div className="space-y-0.5">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">1000+</div>
            <div className="text-[10px] sm:text-[11px] font-sans text-[#4A443C] uppercase tracking-wider font-bold">Projects Engineered</div>
          </div>
          <div className="space-y-0.5">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-700">15+</div>
            <div className="text-[10px] sm:text-[11px] font-sans text-[#4A443C] uppercase tracking-wider font-bold">Years of Excellence</div>
          </div>
          <div className="space-y-0.5">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">40M+</div>
            <div className="text-[10px] sm:text-[11px] font-sans text-[#4A443C] uppercase tracking-wider font-bold">Sq. Ft Built-Up Area</div>
          </div>
          <div className="space-y-0.5">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-700">G+Unltd</div>
            <div className="text-[10px] sm:text-[11px] font-sans text-[#4A443C] uppercase tracking-wider font-bold">Dubai Authority License</div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────
         2. CORE VALUES & ENGINEERING ETHICS
      ─────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-[11px] font-sans font-bold tracking-wider uppercase text-[#08184E] shadow-xs">
            ENGINEERING PRINCIPLES
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#08184E] tracking-tight">
            Built on Rigor, Innovation & <span className="italic text-gradient-gold">Integrity</span>
          </h2>
          <p className="text-[#6E665B] text-xs sm:text-sm font-sans leading-relaxed">
            Our multidisciplinary practice bridges structural safety, architectural ambition, and economic efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl glass-card hover:shadow-xl transition-all duration-300 space-y-4 shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#08184E] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-2xl text-gold-300">{val.icon}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#08184E]">{val.title}</h3>
              <p className="text-xs text-[#4A443C] font-sans leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────
         3. FOUNDING LEADERSHIP PROFILES (4 EXECUTIVE BOARD MEMBERS)
      ─────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-[11px] font-sans font-bold tracking-wider uppercase text-[#08184E] shadow-xs">
            EXECUTIVE BOARD
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#08184E] tracking-tight">
            Founding <span className="italic text-gradient-gold">Partners & Leadership</span>
          </h2>
          <p className="text-[#6E665B] text-xs sm:text-sm max-w-xl font-sans">
            Over a century of collective structural leadership, G+Unlimited Dubai Municipality licenses, and complex project execution across the GCC.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Partner 1: R.K. Gupta */}
          <div className="p-8 sm:p-10 rounded-3xl glass-card shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-[#08184E]/40 transition-all">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/80 bg-[#FAF4E8] flex-shrink-0 shadow-md">
                  <img
                    src="/images/leadership/rk-gupta.jpg"
                    alt="R.K. Gupta"
                    className="w-full h-full object-cover object-top filter brightness-100"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero-bridge.jpg';
                    }}
                  />
                </div>
                <div>
                  <div className="font-sans text-[10.5px] text-gold-700 uppercase tracking-widest mb-1 font-bold">
                    FOUNDING PARTNER & MANAGING DIRECTOR
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">R.K. Gupta</h3>
                  <div className="text-xs text-[#4A443C] font-sans font-medium mt-0.5">
                    M.Tech Structural Engineering (IIT Kanpur)
                  </div>
                  <div className="inline-block px-3 py-1 mt-2 rounded-lg glass-badge text-[#08184E] font-sans text-[11px] font-bold shadow-xs">
                    41+ Years Industry Experience
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/80 pt-5 text-xs sm:text-[13px] text-[#4A443C] font-sans leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Eminent Structural Engineer with exposure of over 41 years in the civil and construction industry.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Expert in large-span structures, high-rise residential & commercial towers, and industrial manufacturing plants.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Previous Leadership Experience: <strong>Holford Associates</strong> & <strong>Hyder Consulting</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Masters in Structural Engineering from <strong>IIT Kanpur</strong>, India. Registered G+Unlimited Structural Consultant.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Partner 2: Tomy Varghese */}
          <div className="p-8 sm:p-10 rounded-3xl glass-card shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-[#08184E]/40 transition-all">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/80 bg-[#FAF4E8] flex-shrink-0 shadow-md">
                  <img
                    src="/images/leadership/tomy-varghese.jpg"
                    alt="Tomy Varghese"
                    className="w-full h-full object-cover object-top filter brightness-100"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero-bridge.jpg';
                    }}
                  />
                </div>
                <div>
                  <div className="font-sans text-[10.5px] text-gold-700 uppercase tracking-widest mb-1 font-bold">
                    MANAGING PARTNER & EXECUTIVE DIRECTOR
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">Tomy Varghese</h3>
                  <div className="text-xs text-[#4A443C] font-sans font-medium mt-0.5">
                    M.Tech Construction Mgmt · LL.B Law
                  </div>
                  <div className="inline-block px-3 py-1 mt-2 rounded-lg glass-badge text-[#08184E] font-sans text-[11px] font-bold shadow-xs">
                    38+ Years Industry Experience
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/80 pt-5 text-xs sm:text-[13px] text-[#4A443C] font-sans leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Eminent Civil & Structural Engineer with over 38 years directing mega-developments across the Middle East.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Expert in Project Management, FIDIC Contractual Matters, Site Execution & Structural Dispute Arbitration.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Previous Leadership Experience: Head, <strong>R.J. Crocker & Partners</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Bachelor of Law (LL.B) from <strong>Govt. Law College, Ernakulam</strong> · B-Tech Civil & M-Tech Construction Engineering Management.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Partner 3: Ibrahim Kutty */}
          <div className="p-8 sm:p-10 rounded-3xl glass-card shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-[#08184E]/40 transition-all">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/80 bg-[#FAF4E8] flex-shrink-0 shadow-md">
                  <img
                    src="/images/leadership/ibrahim-kutty.jpg"
                    alt="Ibrahim Kutty"
                    className="w-full h-full object-cover object-top filter brightness-100"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero-bridge.jpg';
                    }}
                  />
                </div>
                <div>
                  <div className="font-sans text-[10.5px] text-gold-700 uppercase tracking-widest mb-1 font-bold">
                    PARTNER & BUSINESS DEVELOPMENT
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">Ibrahim Kutty</h3>
                  <div className="text-xs text-[#4A443C] font-sans font-medium mt-0.5">
                    Bachelors in Civil Engineering
                  </div>
                  <div className="inline-block px-3 py-1 mt-2 rounded-lg glass-badge text-[#08184E] font-sans text-[11px] font-bold shadow-xs">
                    28+ Years Experience · DM Unlimited
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/80 pt-5 text-xs sm:text-[13px] text-[#4A443C] font-sans leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Eminent Structural Engineer with exposure of over 28 years directing landmark infrastructure & commercial projects.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Dubai Municipality (DM) Registered Engineer Number: <strong>114375400 (Unlimited Floors)</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Bachelors in Civil Engineering with specialized expertise in commercial operations and client advisory.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Directs strategic GCC business expansion, client developer partnerships, and multi-agency municipal approvals.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Partner 4: Vineet Singla */}
          <div className="p-8 sm:p-10 rounded-3xl glass-card shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-[#08184E]/40 transition-all">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/80 bg-[#FAF4E8] flex-shrink-0 shadow-md">
                  <img
                    src="/images/leadership/vineet-singla.jpg"
                    alt="Vineet Singla"
                    className="w-full h-full object-cover object-top filter brightness-100"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero-bridge.jpg';
                    }}
                  />
                </div>
                <div>
                  <div className="font-sans text-[10.5px] text-gold-700 uppercase tracking-widest mb-1 font-bold">
                    PARTNER & PRINCIPAL ENGINEER
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">Vineet Singla</h3>
                  <div className="text-xs text-[#4A443C] font-sans font-medium mt-0.5">
                    B.Tech Civil Engineering (IIT BHU Varanasi)
                  </div>
                  <div className="inline-block px-3 py-1 mt-2 rounded-lg glass-badge text-[#08184E] font-sans text-[11px] font-bold shadow-xs">
                    14+ Years Experience · DM Unlimited
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/80 pt-5 text-xs sm:text-[13px] text-[#4A443C] font-sans leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Eminent Structural Engineer with exposure of over 14 years specializing in high-rise towers and complex engineering.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Dubai Municipality (DM) Registered Engineer Number: <strong>876019 (Unlimited Floors)</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>B. Tech Civil Engineering from <strong>Indian Institute of Technology (IIT, BHU)</strong>, Varanasi.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gold-600 font-bold">◆</span>
                  <span>Leads principal structural design, finite element dynamic modeling, ETABS/SAFE simulations, and peer review audits.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────
         4. SPECIALIZED TECHNICAL & ARCHITECTURAL TEAM (3D CONVEX CAROUSEL)
      ─────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-[11px] font-sans font-bold tracking-wider uppercase text-[#08184E] shadow-xs">
              TECHNICAL EXPERTISE
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#08184E] tracking-tight mt-2">
              Engineering & Architectural <span className="italic text-gradient-gold">Specialists</span>
            </h2>
            <p className="text-[#6E665B] text-xs sm:text-sm font-sans mt-1">
              Experienced structural engineers, BIM managers, project directors, and MEP specialists across the Middle East.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* View Mode Switcher */}
            <div className="p-1 rounded-2xl glass-tab-bar flex items-center shadow-xs">
              <button
                type="button"
                onClick={() => setTeamDisplayMode('3d')}
                className={`px-3 py-1.5 rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 transition-all ${
                  teamDisplayMode === '3d'
                    ? 'bg-[#08184E] text-white shadow-sm'
                    : 'text-[#4A443C] hover:text-[#08184E]'
                }`}
                title="3D Arc Showcase"
              >
                <span className="material-symbols-outlined text-sm">view_in_ar</span>
                <span>3D Carousel</span>
              </button>
              <button
                type="button"
                onClick={() => setTeamDisplayMode('grid')}
                className={`px-3 py-1.5 rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 transition-all ${
                  teamDisplayMode === 'grid'
                    ? 'bg-[#08184E] text-white shadow-sm'
                    : 'text-[#4A443C] hover:text-[#08184E]'
                }`}
                title="Grid Directory"
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
                <span>Grid View</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3D Convex Carousel or Grid View */}
        {teamDisplayMode === '3d' ? (
          <div className="w-full">
            <Team3DCarousel
              teamMembers={staff}
              initialIndex={selectedStaffIndex}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {staff
              .filter((m) => !['staff-1', 'staff-2', 'staff-3', 'staff-4'].includes(m.id))
              .map((member) => {
                const globalIdx = staff.findIndex((s) => s.id === member.id);
                return (
                  <div
                    key={member.id}
                    onClick={() => {
                      if (globalIdx !== -1) {
                        setSelectedStaffIndex(globalIdx);
                        setTeamDisplayMode('3d');
                      }
                    }}
                    className="p-6 rounded-3xl glass-card shadow-lg flex flex-col justify-between group cursor-pointer hover:border-gold-500/50 hover:shadow-xl transition-all duration-300"
                    title={`Click to view ${member.name} in 3D Spotlight`}
                  >
                    <div>
                      <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF4E8] mb-5 border border-white/80 relative group-hover:border-[#08184E]/40 transition-colors shadow-inner">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-top filter brightness-100 group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = '/images/hero-bridge.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08184E]/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg glass-badge text-[#08184E] font-bold shadow-xs">
                            {member.experience}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-sans font-bold text-gold-300 bg-[#08184E]/80 px-2 py-0.5 rounded-full border border-gold-400/40">
                            View in 3D
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#08184E] group-hover:text-gold-700 transition-colors">
                        {member.name}
                      </h3>
                      <div className="text-xs text-gold-700 font-semibold mt-0.5 font-sans">{member.role}</div>
                      <div className="text-[11px] font-sans text-[#6E665B] mt-1">{member.qualification}</div>

                      <p className="text-xs text-[#4A443C] font-sans leading-relaxed mt-3 pt-3 border-t border-[#EDE5D5]">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────
         5. MILESTONE JOURNEY TIMELINE (Interactive 3D Road Journey)
      ─────────────────────────────────────────── */}
      <section className="mb-24">
        <RoadmapJourney milestones={milestones} />
      </section>

      {/* ───────────────────────────────────────────
         6. ACCREDITATIONS & AUTHORITY LICENSES
      ─────────────────────────────────────────── */}
      <section className="p-8 sm:p-12 rounded-3xl glass-panel shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-[11px] font-sans font-bold tracking-wider uppercase text-[#08184E] shadow-xs">
          LICENSURE & STATUTORY COMPLIANCE
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E] tracking-tight">
          Fully Licensed for Unlimited Structural Heights in Dubai & the GCC
        </h2>
        <p className="text-xs sm:text-sm text-[#4A443C] max-w-3xl mx-auto font-sans leading-relaxed">
          Registered and approved with Dubai Municipality (G+Unlimited Height Category), Trakhees (Port, Customs and Free Zone Corporation), Dubai Development Authority (DDA), Dubai South (DWC Aviation), and Civil Defence Fire Life Safety Authorities.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 font-sans text-xs text-[#08184E]">
          <span className="px-4 py-2 rounded-xl glass-panel-subtle font-bold shadow-xs">
            ✓ Dubai Municipality G+Unlimited
          </span>
          <span className="px-4 py-2 rounded-xl glass-panel-subtle font-bold shadow-xs">
            ✓ Trakhees Structural Consultant
          </span>
          <span className="px-4 py-2 rounded-xl glass-panel-subtle font-bold shadow-xs">
            ✓ DDA & DWC Registered
          </span>
          <span className="px-4 py-2 rounded-xl glass-panel-subtle font-bold shadow-xs">
            ✓ Muscat Municipality Grade 1
          </span>
        </div>
      </section>
    </div>
  );
}
