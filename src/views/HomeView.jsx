import React, { useState, useEffect, useRef } from 'react';

// Animated numeric counter with cubic easing
function AnimatedCounter({ end, prefix = '', suffix = '', duration = 1600, useLocale = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{useLocale ? count.toLocaleString() : count}{suffix}</span>;
}

export default function HomeView({
  projects = [],
  services = [],
  setActivePage,
  onSelectProject,
  onOpenEstimator,
}) {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

  const heroSlides = [
    {
      title: 'Sharjah Bank Headquarters',
      subtitle: '3B+G+36 Storey Commercial Landmark Tower',
      location: 'Sharjah, UAE',
      category: 'High-Rise & Towers',
      client: 'Bank of Sharjah',
      image: '/core_data/BEST/List of projects to be showcased/1. Sharjah Bank.jpg',
      slNo: 1,
    },
    {
      title: 'Emaar Sales Pavilion Dubai Hills',
      subtitle: 'Iconic Sculptural Pavilion & Structural Architecture',
      location: 'Dubai Hills, Dubai, UAE',
      category: 'Commercial & Corporate',
      client: 'Emaar Properties',
      image: '/core_data/BEST/List of projects to be showcased/10. Emaar Sales Pavilion Dubai Hills, Dubai, UAE.jpg',
      slNo: 10,
    },
    {
      title: 'Amity University Dubai Campus',
      subtitle: 'Higher Education Academic & Innovation Complex',
      location: 'Dubai International Academic City, UAE',
      category: 'Educational & Institutional',
      client: 'Amity University',
      image: '/core_data/BEST/List of projects to be showcased/41. Amity University Dubai, UAE.jpeg',
      slNo: 41,
    },
    {
      title: 'Sanjeev Nanda Luxury Villa',
      subtitle: 'Contemporary Waterfront Mansion with Cantilevered Terraces',
      location: 'Dubai, UAE',
      category: 'Luxury Residential & Villas',
      client: 'Private Client',
      image: '/core_data/BEST/List of projects to be showcased/36.1 SANJEEV NANDA VILLA.jpeg',
      slNo: 36,
    },
    {
      title: 'DC Aviation Widebody Hangar',
      subtitle: 'Large-Span Aircraft Maintenance Facility (100m Clear Span)',
      location: 'Dubai South (DWC), UAE',
      category: 'Aviation & Hangars',
      client: 'DC Aviation / Al-Futtaim',
      image: '/core_data/BEST/List of projects to be showcased/46. DC AVIATION - AL FUTTAIM HANGAR 1.jpeg',
      slNo: 46,
    },
  ];

  // Auto rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const featuredProjects = projects.filter((p) => p.featured || p.slNo <= 12);

  const filteredFeatured = activeCategory === 'all'
    ? featuredProjects.slice(0, 6)
    : projects.filter((p) => p.category === activeCategory).slice(0, 6);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'High-Rise & Towers', label: 'Towers' },
    { id: 'Luxury Residential & Villas', label: 'Villas' },
    { id: 'Hospitality & Hotels', label: 'Hospitality' },
    { id: 'Aviation & Hangars', label: 'Aviation' },
    { id: 'Commercial & Corporate', label: 'Commercial' },
  ];

  return (
    <div className="view-enter pt-16 sm:pt-20">
      {/* ───────────────────────────────────────────
         1. INTERACTIVE HERO (High-Definition Architectural Showcase)
      ─────────────────────────────────────────── */}
      {/* ───────────────────────────────────────────
         1. INTERACTIVE HERO (High-Definition Architectural Showcase with Frosted Glassmorphism)
      ─────────────────────────────────────────── */}
      <section className="relative min-h-[92dvh] flex flex-col justify-end overflow-hidden pt-6 pb-12 sm:pb-16 px-6 md:px-12">
        {/* Dynamic Background Slideshow - Razor Sharp High Definition Photography */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentHeroSlide === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-100 contrast-105 transform scale-100 transition-transform duration-10000 ease-out"
              onError={(e) => {
                e.currentTarget.src = '/images/hero-bridge.jpg';
              }}
            />
            {/* Subtle atmospheric vignette allowing the architectural structure to remain crisp and cinematic */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FFF9ED] to-transparent pointer-events-none" />
          </div>
        ))}

        <div className="relative z-10 max-w-container mx-auto w-full flex flex-col justify-end space-y-5">
          {/* Main Hero Row: Compact Text Glass Card on left + Sleek Floating Slide Widget on right */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            {/* Compact Hero Glassmorphism Box - hugs the text tightly without excess padding */}
            <div className="glass-card-hero p-6 sm:p-7 md:p-8 rounded-3xl max-w-xl w-full lg:w-fit space-y-3.5 shadow-xl">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#08184E] animate-pulse" />
                <span className="font-sans text-[10px] sm:text-[10.5px] font-bold tracking-[0.18em] uppercase text-[#08184E]">
                  Premier Engineering Consultants · Dubai · GCC · India
                </span>
              </div>

              {/* Stately Display Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-[#08184E] leading-[1.14]">
                Transforming Visions <br />
                Into <span className="text-gradient-gold italic whitespace-nowrap">Landmark Structures.</span>
              </h1>

              {/* Compact Subtext */}
              <p className="text-[#1A1815] text-xs sm:text-sm md:text-[15px] max-w-lg font-normal leading-relaxed">
                Specialized in high-rise towers, large-span aviation hangars, luxury villas, and complex structural engineering with 5000+ delivered projects across UAE, India & GCC countries.
              </p>

              {/* Compact Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    setActivePage('portfolio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#08184E] hover:bg-[#0D226B] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg border border-[#08184E] flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Explore 50+ Projects</span>
                  <span className="material-symbols-outlined text-base text-gold-400">arrow_forward</span>
                </button>

                <button
                  onClick={onOpenEstimator}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl glass-card text-[#08184E] hover:border-gold-500/50 font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs hover:shadow-md"
                >
                  <span className="material-symbols-outlined text-base text-gold-600">tune</span>
                  <span>Project Scope Builder</span>
                </button>
              </div>
            </div>

            {/* Right Floating Project Spotlight & Slide Switcher */}
            <div className="glass-card-spotlight p-4 sm:p-5 rounded-2xl w-full lg:w-80 space-y-3 shrink-0 self-end">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[10px] font-bold tracking-[0.18em] uppercase text-[#08184E]">
                  SPOTLIGHT // 0{currentHeroSlide + 1}
                </span>
                {/* Dots navigation */}
                <div className="flex gap-1.5">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentHeroSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentHeroSlide === idx ? 'w-5 bg-[#08184E]' : 'w-1.5 bg-[#08184E]/30 hover:bg-gold-500'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Mini Slide Thumbnail Strip */}
              <div className="grid grid-cols-5 gap-1.5">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroSlide(idx)}
                    className={`relative h-10 rounded-lg overflow-hidden border transition-all duration-200 ${
                      currentHeroSlide === idx
                        ? 'border-[#08184E] ring-2 ring-[#08184E]/40 scale-105 shadow-xs'
                        : 'border-white/60 opacity-60 hover:opacity-100'
                    }`}
                    title={slide.title}
                  >
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover filter brightness-100" />
                  </button>
                ))}
              </div>

              <div>
                <h4 className="font-serif text-base font-bold text-[#08184E] truncate">
                  {heroSlides[currentHeroSlide].title}
                </h4>
                <p className="text-[11px] text-[#4A443C] font-normal truncate">
                  {heroSlides[currentHeroSlide].subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-[#08184E]/10 flex items-center justify-between text-[11px] font-sans text-[#4A443C]">
                <span className="font-medium truncate mr-2">{heroSlides[currentHeroSlide].location}</span>
                <span className="text-[#08184E] font-bold shrink-0">{heroSlides[currentHeroSlide].client}</span>
              </div>
            </div>
          </div>

          {/* Metric Telemetry Counters in a Slim, Transparent Floating Frosted Glass Bar */}
          <div className="py-3.5 px-6 sm:px-8 rounded-2xl glass-card-bar grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 items-center">
            <div className="space-y-0.5">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">
                <AnimatedCounter end={5000} suffix="+" />
              </div>
              <div className="font-sans text-[10px] uppercase tracking-wider text-[#4A443C] font-bold">
                Delivered Projects
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">
                <AnimatedCounter end={15} suffix="+ Years" />
              </div>
              <div className="font-sans text-[10px] uppercase tracking-wider text-[#4A443C] font-bold">
                Engineering Excellence
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">
                <AnimatedCounter end={40} suffix="M+ Sq.Ft" />
              </div>
              <div className="font-sans text-[10px] uppercase tracking-wider text-[#4A443C] font-bold">
                Engineered Built-up Area
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E]">
                GCC & India
              </div>
              <div className="font-sans text-[10px] uppercase tracking-wider text-[#4A443C] font-bold">
                UAE, India & GCC countries
              </div>
            </div>

            <div className="space-y-0.5 col-span-2 md:col-span-1">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-gold-700">
                G+4 Licence
              </div>
              <div className="font-sans text-[10px] uppercase tracking-wider text-[#4A443C] font-bold">
                Dubai Authority License
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────
         2. MARQUEE STRIP (Architectural Disciplines)
      ─────────────────────────────────────────── */}
      <div className="border-y border-[#EDE5D5] glass-panel-subtle py-4 overflow-hidden shadow-xs">
        <div className="marquee-track">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex items-center gap-10 px-6 font-sans text-xs tracking-[0.2em] uppercase text-[#08184E] whitespace-nowrap font-bold"
            >
              <span>High-Rise Structural Engineering</span>
              <span className="text-gold-600">◆</span>
              <span>120m Clear-Span Aviation Hangars</span>
              <span className="text-gold-600">◆</span>
              <span>Bespoke Palm Jumeirah Luxury Villas</span>
              <span className="text-gold-600">◆</span>
              <span>Value Engineering & Peer Review Audits</span>
              <span className="text-gold-600">◆</span>
              <span>Architect of Record & Authority Approvals</span>
              <span className="text-gold-600">◆</span>
              <span>BIM Level 3 Digital Twin Modeling</span>
              <span className="text-gold-600">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────
         3. INTRODUCTION & PHILOSOPHY
      ─────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge font-sans text-[11px] tracking-[0.22em] uppercase text-gold-700 font-bold shadow-xs">
              ABOUT BUREAU OF ENGINEERING STUDIES (BEST) // EST. 2010
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#08184E] tracking-tight leading-tight">
              Shaping Skyline Icons <br />
              <span className="text-gradient-gold italic">With Precision Physics.</span>
            </h2>
            <p className="text-[#4A443C] text-sm sm:text-base font-normal leading-relaxed">
              Founded with the vision to deliver uncompromising engineering integrity, Bureau of Engineering Studies (BEST) has grown into a premier consulting firm trusted by leading developers, royal patrons, and international aviation operators across the Middle East.
            </p>
            <p className="text-[#6E665B] text-xs sm:text-sm font-normal leading-relaxed">
              Our multidisciplinary team combines 40+ years of collective leadership experience, integrating advanced computational finite element models with practical construction economics.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setActivePage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#08184E] hover:text-gold-700 transition-colors"
              >
                <span>Read Full Company Profile & Leadership</span>
                <span className="material-symbols-outlined text-sm text-gold-600">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden glass-card p-3 shadow-xl">
              <img
                src="/core_data/BEST/List of projects to be showcased/10. Emaar Sales Pavilion Dubai Hills, Dubai, UAE.jpg"
                alt="Emaar Pavilion"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl filter brightness-100"
              />
              <div className="p-4 flex items-center justify-between text-xs font-sans text-[#4A443C]">
                <span className="font-medium">Emaar Sales Pavilion · Dubai Hills</span>
                <span className="text-[#08184E] font-bold">Atkins / BEST</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────
         4. CORE DISCIPLINES BENTO GRID
      ─────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12 max-w-container mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#08184E] tracking-tight">
              Our Core <span className="text-gradient-gold italic">Expertise</span>
            </h2>
            <p className="text-[#6E665B] text-sm max-w-xl font-normal mt-1.5">
              Comprehensive multidisciplinary engineering solutions tailored to high-demand commercial and luxury requirements.
            </p>
          </div>

          <button
            onClick={() => {
              setActivePage('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-sans text-[#08184E] hover:text-gold-700 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors self-start md:self-auto"
          >
            <span>View All Detailed Disciplines</span>
            <span className="material-symbols-outlined text-sm text-gold-600">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="p-8 rounded-3xl glass-card space-y-4 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#08184E] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-2xl text-gold-300">{svc.icon}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#08184E]">
                  {svc.title}
                </h3>
                <p className="text-xs text-[#4A443C] font-normal leading-relaxed">
                  {svc.short}
                </p>
              </div>

              <ul className="space-y-1.5 pt-4 border-t border-[#EDE5D5] text-xs font-normal text-[#6E665B]">
                {svc.deliverables.slice(0, 2).map((d, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gold-600 font-bold text-sm">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────
         5. FEATURED PORTFOLIO SHOWCASE
      ─────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 max-w-container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#08184E] tracking-tight">
              Featured <span className="text-gradient-gold italic">Landmark Portfolio</span>
            </h2>
            <p className="text-[#6E665B] text-sm max-w-xl font-normal mt-1.5">
              Explore signature towers, aviation hangars, and luxury residential estates engineered across the region.
            </p>
          </div>

          {/* Category Filter Pills (Glass Tab Bar) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl glass-tab-bar self-start md:self-auto shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat.id
                    ? 'glass-tab-active'
                    : 'glass-tab-inactive'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeatured.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="group cursor-pointer rounded-3xl overflow-hidden glass-card shadow-lg flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-[#FAF4E8]">
                <img
                  src={proj.primaryImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-100"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero-bridge.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08184E]/70 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 font-sans text-[10px] font-bold tracking-wider uppercase glass-badge px-3 py-1 rounded-full text-[#08184E] shadow-sm">
                  {proj.category}
                </span>
                <span className="absolute bottom-4 right-4 font-sans text-xs font-bold text-white bg-[#08184E]/85 px-2.5 py-1 rounded-md backdrop-blur-md">
                  {proj.location}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-sans text-[11px] text-[#6E665B] uppercase tracking-wider mb-1.5 font-bold">
                    Client: {proj.client} · {proj.year}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#08184E] group-hover:text-gold-700 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-[#4A443C] font-normal mt-2 line-clamp-2 leading-relaxed">
                    {proj.details || 'Structural design and engineering consultancy.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EDE5D5] flex items-center justify-between text-xs font-sans text-[#08184E] font-bold">
                  <span>View Project Specs</span>
                  <span className="material-symbols-outlined text-sm text-gold-600 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setActivePage('portfolio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3.5 rounded-2xl glass-card hover:bg-white text-xs font-sans text-[#08184E] font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md"
          >
            View All 53 Portfolio Projects →
          </button>
        </div>
      </section>

      {/* ───────────────────────────────────────────
         6. MILESTONES TIMELINE
      ─────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 max-w-container mx-auto">
        <div className="mb-14">
          <h2 className="font-serif text-3xl font-bold text-[#08184E] tracking-tight">
            Our Journey & <span className="text-gradient-gold italic">Milestone Evolution</span>
          </h2>
          <p className="text-[#6E665B] text-sm max-w-xl font-normal mt-1.5">
            Key chapters in BEST’s engineering growth across the GCC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              year: '2010',
              title: 'Founding in Dubai',
              desc: 'Established with primary focus on high-rise structural design and authority engineering approvals.',
            },
            {
              year: '2015',
              title: 'Aviation Hangar Pioneer',
              desc: 'Engineered our first major 100m+ clear-span aircraft maintenance hangar for DC Aviation at Dubai South.',
            },
            {
              year: '2020',
              title: 'Regional Expansion',
              desc: 'Expanded structural consultancy across Muscat Oman, Lusail Qatar, and luxury Palm Jumeirah master villas.',
            },
            {
              year: '2026+',
              title: '1,000+ Projects & Future',
              desc: 'Delivering mega-towers, BIM digital twin handovers, and sustainable luxury developments.',
            },
          ].map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl glass-card space-y-3 shadow-lg"
            >
              <div className="font-serif text-3xl font-bold text-[#08184E]">
                {m.year}
              </div>
              <h3 className="font-serif text-base font-bold text-[#08184E]">{m.title}</h3>
              <p className="text-xs text-[#4A443C] font-normal leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────
         7. PROPOSAL BUILDER CALLOUT
      ─────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12 max-w-container mx-auto">
        <div className="rounded-3xl glass-panel p-8 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="blueprint-grid-gold absolute inset-0 pointer-events-none opacity-40" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#08184E] glass-badge px-3.5 py-1 rounded-full font-bold shadow-xs">
                <span className="material-symbols-outlined text-sm text-gold-600">tune</span>
                <span>Interactive Proposal Engine</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#08184E] tracking-tight">
                Have a New High-Rise, Aviation Hangar, or Villa Development?
              </h3>
              <p className="text-[#3E3830] text-sm font-normal leading-relaxed max-w-2xl">
                Use our interactive project builder to configure your sector, built-up area, and authority approval requirements for an instant turnaround estimate and direct consultation.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={onOpenEstimator}
                className="px-8 py-4 rounded-2xl bg-[#08184E] hover:bg-[#0D226B] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl border border-[#08184E] flex items-center gap-2.5 transition-all hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined text-lg text-gold-400">edit_document</span>
                <span>Start Project Brief</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
