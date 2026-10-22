import React, { useState } from 'react';

export default function InsightsView({ onOpenEstimator, onSelectProject }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [readingArticle, setReadingArticle] = useState(null);

  const categories = [
    'All',
    'Aviation & Large-Span',
    'High-Rise & Seismic',
    'Value Engineering',
    'Luxury Architecture',
    'BIM & Digital Twin',
  ];

  const articles = [
    {
      id: 'insight-1',
      title: 'Engineering 100m+ Clear-Span Aviation Hangars: The Physics of Widebody MRO Structures',
      category: 'Aviation & Large-Span',
      readTime: '6 min read',
      date: 'Q1 2026',
      author: 'Veereswara Rao, M.Tech Structural',
      image: '/core_data/BEST/List of projects to be showcased/46. DC AVIATION - AL FUTTAIM HANGAR 1.jpeg',
      summary: 'Designing column-free 100-meter clear-span aircraft maintenance hangars requires rigorous thermal expansion compensation, roof crane gantry load combinations, and specialized tail-door framing.',
      tags: ['Aviation', 'Steel Trusses', 'Clear Span', 'DWC Dubai South'],
      content: `
### Executive Summary
Aviation Maintenance, Repair, and Overhaul (MRO) facilities represent some of the most structurally demanding challenges in modern civil engineering. At Dubai South (DWC), Bureau of Engineering Studies (BEST) engineered the DC Aviation / Al-Futtaim widebody hangar and the SATYS paint facility, spanning up to 100+ meters without intermediate vertical support columns.

### Critical Engineering Challenges
1. **Deflection Limits under Gantry Crane Operations:** Aircraft docking systems require strict vertical deflection limits ($L/600$ to $L/800$) to prevent misalignment with aircraft fuselages during heavy maintenance.
2. **Thermal Expansion Across 100m Spans:** In desert climates with extreme ambient temperatures reaching $50^\circ\text{C}$, thermal expansion can induce significant lateral thrust at truss support piers. We implemented slotted PTFE sliding bearings and guided expansion joints.
3. **Tail-Cut Truss Framing:** Modern widebody aircraft (e.g., Airbus A380, Boeing 777-9) feature vertical empennages exceeding 24 meters in height. The main front door truss must feature a specialized cantilevered tail notch capable of supporting motorized bi-parting sliding mega-doors.
4. **Foam Deluge Fire Suppression Integration:** NFPA 409 code requires overhead foam water deluge discharge systems. The roof trusses were engineered to support dense water supply manifolds and rapid-discharge foam generators under simultaneous maximum wind loads.

### Key Results
- **Zero Structural Rework:** 100% pre-engineered structural steel members assembled on-site with zero bolt-hole mismatch via LOD 400 Tekla/Revit detailing.
- **EASA / GCAA Compliance:** Fully certified for commercial and VIP private jet operations under international civil aviation guidelines.
      `,
    },
    {
      id: 'insight-2',
      title: 'Dynamic Wind Tunnel Analysis & Seismic Design of 36+ Storey Slender Towers',
      category: 'High-Rise & Seismic',
      readTime: '8 min read',
      date: 'Q4 2025',
      author: 'R.K. Gupta, Founding Partner',
      image: '/core_data/BEST/List of projects to be showcased/1. Sharjah Bank.jpg',
      summary: 'A deep dive into high-aspect ratio commercial towers: mitigating vortex shedding, optimizing outrigger wall systems, and post-tensioned floor plates in the GCC.',
      tags: ['High-Rise', 'Wind Tunnel', 'ETABS', 'Bank of Sharjah'],
      content: `
### Overview
For high-rise commercial structures such as the 3B+G+36 Storey Bank of Sharjah headquarters and Ahad Towers, structural design is predominantly governed by lateral wind forces and dynamic comfort criteria rather than gravity loads alone.

### Lateral Load Resisting System (LLRS)
To achieve architectural transparency while maintaining stiffness:
- **Reinforced Concrete Core Walls:** High-performance C60/75 self-consolidating concrete with ductile link beams dissipates seismic and wind energy.
- **Virtual Outrigger System:** Strategic belt trusses and deep perimeter transfer beams engage exterior columns, significantly increasing the effective structural depth of the building.
- **Vortex Shedding Mitigation:** Aerodynamic edge corner chamfers were introduced in collaboration with the architectural team, reducing base overturning moments by 14%.

### Foundation & Deep Excavation
- 3 basements below the water table required a secant pile shoring wall anchored with multi-tier prestressed ground tiebacks.
- Deep pile-raft foundation verified using 3D finite element soil-structure interaction (PLAXIS and SAFE).
      `,
    },
    {
      id: 'insight-3',
      title: 'Value Engineering Methodology: Achieving 18% Steel Tonnage Reduction Without Architectural Compromise',
      category: 'Value Engineering',
      readTime: '5 min read',
      date: 'Q3 2025',
      author: 'Tomy Varghese, Managing Partner',
      image: '/core_data/BEST/List of projects to be showcased/10. Emaar Sales Pavilion Dubai Hills, Dubai, UAE.jpg',
      summary: 'How independent third-party peer reviews and topological optimization can reduce construction capital expenditure while preserving safety margins.',
      tags: ['Value Engineering', 'Cost Optimization', 'Rebar Detailing'],
      content: `
### The Value Engineering Imperative
In modern real estate development, structural systems represent between 25% and 40% of total superstructure capital costs. Sub-optimal designs frequently result from accelerated tender schedules and excessive safety factors applied consecutively by multiple consultants.

### BEST 4-Step VE Process
1. **Structural Scheme Audit:** Review of load paths, column grids, and framing typology.
2. **Floor Plate Optimization:** Converting conventional reinforced beam-slab systems to two-way bonded Post-Tensioned (PT) flat slabs, reducing concrete thickness and overall building dead weight.
3. **Foundation Re-Engineering:** Performing high-strain dynamic pile testing and re-evaluating end-bearing capacities to reduce required pile lengths and cluster counts.
4. **Rebar Scheduling & Standardization:** Eliminating non-standard lap splices and incorporating mechanical couplers in high-density columns.

### Documented Case Study
On a recent 450,000 sq. ft commercial logistics hub in the UAE, BEST's peer review identified 18% excess structural steel tonnage, saving the client over $1.4 million USD in procurement costs with zero change to the building footprint.
      `,
    },
    {
      id: 'insight-4',
      title: 'Structural Architecture of Ultra-Luxury Waterfront Mansions on Palm Jumeirah',
      category: 'Luxury Architecture',
      readTime: '6 min read',
      date: 'Q2 2025',
      author: 'Maya Gharibeh, Head of Architecture',
      image: '/core_data/BEST/List of projects to be showcased/29 VILLA AT PALM JUMEIRAH.jpeg',
      summary: 'Overcoming coastal foundation challenges, massive cantilevered infinity terraces, and column-free beachfront glass facades in bespoke signature villas.',
      tags: ['Palm Jumeirah', 'Luxury Villa', 'Cantilever', 'Infinity Pool'],
      content: `
### The Architectural Brief
Ultra-luxury private residences on Palm Jumeirah demand uncompromised panoramic vistas of the Arabian Gulf. This translates into 15-meter wide column-free living spaces, double-height glazing, cantilevered upper-floor bedroom suites, and elevated rooftop infinity pools.

### Structural Solutions
- **Post-Tensioned Cantilevers:** 6-meter post-tensioned concrete cantilevers framing the master suite terrace without vertical corner columns.
- **Marine Environment Durability:** Strict chloride-resistant concrete mix designs with silica fume and corrosion-inhibiting admixtures ensuring 100-year design life in high-salinity coastal groundwater.
- **Subterranean Basement Spas:** Waterproofing with dual-layer pre-applied membranes and waterstop injection hoses to withstand continuous hydrostatic groundwater pressure.
      `,
    },
    {
      id: 'insight-5',
      title: 'BIM Level 3 Workflows: Accelerating Dubai Municipality & Civil Defence Permitting',
      category: 'BIM & Digital Twin',
      readTime: '7 min read',
      date: 'Q1 2025',
      author: 'Mohd Shafeer, BIM Lead',
      image: '/core_data/BEST/List of projects to be showcased/19. RTA Bus depot at Lusail, Qatar.jpg',
      summary: 'Automated clash detection between structural post-tensioned tendons and MEP gravity services for zero on-site core-drilling reworks.',
      tags: ['BIM Level 3', 'Revit', 'Navisworks', 'Dubai Municipality'],
      content: `
### Moving Beyond 2D CAD
Authority approvals in Dubai now mandate coordinated digital models. Bureau of Engineering Studies (BEST) deploys unified Autodesk Revit workflows adhering to ISO 19650 standards.

### Key Workflow Advantages
- **LOD 400 Concrete & Rebar Detailing:** Precise 3D modeling of dense rebar zones, post-tensioning anchor blocks, and shear links.
- **Clash Resolution:** Over 450 MEP/structural clashes resolved virtually before issuing IFC (Issued for Construction) tender drawings.
- **Digital Twin Readiness:** COBie data integration enabling asset managers to track structural inspection schedules and MEP equipment warranties throughout the facility lifecycle.
      `,
    },
  ];

  const filteredArticles = articles.filter(
    (a) => selectedCategory === 'All' || a.category === selectedCategory
  );

  return (
    <div className="view-enter pt-24 pb-24 px-6 md:px-12 max-w-container mx-auto">
      {/* Header */}
      <div className="mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge text-[11px] font-sans font-bold tracking-wider uppercase text-[#08184E] shadow-xs">
          Technical Publications & Case Studies
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#08184E] tracking-tight">
              Engineering <span className="italic text-gradient-gold">Insights</span>
            </h1>
            <p className="text-[#4A443C] text-sm sm:text-base max-w-2xl font-sans font-normal mt-2 leading-relaxed">
              Technical whitepapers, case studies, and engineering breakthroughs from BEST’s senior structural directors and technical leads.
            </p>
          </div>

          <button
            onClick={onOpenEstimator}
            className="self-start lg:self-auto px-6 py-3.5 rounded-xl bg-[#08184E] hover:bg-[#0D226B] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-base text-gold-400">request_quote</span>
            <span>Request Technical Consultation</span>
          </button>
        </div>
      </div>

      {/* Category Pills (Glass Tab Bar) */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-3xl glass-tab-bar mb-12 shadow-sm">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-sans text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? 'glass-tab-active'
                  : 'glass-tab-inactive'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Featured Lead Article (Frosted Glass Panel) */}
      {filteredArticles.length > 0 && (
        <div
          onClick={() => setReadingArticle(filteredArticles[0])}
          className="rounded-3xl glass-card shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 mb-16 cursor-pointer group hover:border-[#08184E]/40 hover:shadow-2xl transition-all duration-300"
        >
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[320px] overflow-hidden">
            <img
              src={filteredArticles[0].image}
              alt={filteredArticles[0].title}
              className="w-full h-full object-cover filter brightness-100 contrast-105 group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = '/images/hero-bridge.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08184E]/70 via-transparent to-transparent lg:hidden" />
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1.5 rounded-full glass-badge text-[#08184E] font-sans text-[11px] font-bold uppercase tracking-wider shadow-md">
                FEATURED WHITEPAPER
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-sans text-[#6E665B]">
                <span className="text-gold-700 font-bold uppercase tracking-wide">{filteredArticles[0].category}</span>
                <span>•</span>
                <span>{filteredArticles[0].readTime}</span>
                <span>•</span>
                <span>{filteredArticles[0].date}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E] group-hover:text-gold-700 transition-colors leading-snug">
                {filteredArticles[0].title}
              </h2>

              <p className="text-xs sm:text-sm text-[#4A443C] font-sans font-normal leading-relaxed">
                {filteredArticles[0].summary}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {filteredArticles[0].tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg glass-panel-subtle text-[11px] font-sans text-[#08184E] font-bold shadow-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/60">
              <div className="text-xs font-sans text-[#6E665B]">
                By <strong className="text-[#08184E]">{filteredArticles[0].author}</strong>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#08184E] group-hover:text-gold-700 group-hover:translate-x-1 transition-all">
                <span>Read Full Paper</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Remaining Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.slice(1).map((article) => (
          <div
            key={article.id}
            onClick={() => setReadingArticle(article)}
            className="rounded-3xl glass-card shadow-lg overflow-hidden flex flex-col justify-between cursor-pointer group hover:border-[#08184E]/40 hover:shadow-xl transition-all duration-300"
          >
            <div>
              <div className="w-full h-48 overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover filter brightness-100 contrast-105 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero-bridge.jpg';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg glass-badge text-[#08184E] font-sans text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-sans text-[#6E665B]">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#08184E] group-hover:text-gold-700 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-[#4A443C] font-sans leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between border-t border-white/60 mt-4">
              <span className="text-[11px] font-sans text-[#6E665B] truncate max-w-[65%]">
                {article.author}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-sans font-bold text-[#08184E] group-hover:text-gold-700 group-hover:translate-x-1 transition-all">
                <span>Read</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Full Reader Modal (Frosted Glass Modal) */}
      {readingArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#08184E]/50 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setReadingArticle(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-modal rounded-3xl shadow-2xl p-6 sm:p-10 text-[#08184E] space-y-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/60 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 font-sans text-xs text-gold-700 font-semibold">
                  <span className="uppercase tracking-wider font-bold">{readingArticle.category}</span>
                  <span>•</span>
                  <span>{readingArticle.readTime}</span>
                  <span>•</span>
                  <span>{readingArticle.date}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#08184E] tracking-tight">
                  {readingArticle.title}
                </h2>
                <div className="text-xs font-sans text-[#6E665B]">
                  Published by <span className="text-[#08184E] font-semibold">{readingArticle.author}</span> · Bureau of Engineering Studies Consulting Engineers L.L.C
                </div>
              </div>

              <button
                onClick={() => setReadingArticle(null)}
                className="p-2.5 rounded-xl glass-panel-subtle hover:bg-white text-[#08184E] transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden relative shadow-lg">
              <img
                src={readingArticle.image}
                alt={readingArticle.title}
                className="w-full h-full object-cover filter brightness-100"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero-bridge.jpg';
                }}
              />
            </div>

            {/* Article Content */}
            <div className="prose max-w-none text-[#1A1815] text-sm sm:text-base font-sans leading-relaxed space-y-4 whitespace-pre-line">
              {readingArticle.content}
            </div>

            {/* Footer Actions */}
            <div className="pt-8 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {readingArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full glass-badge text-[#08184E] font-sans text-xs font-semibold shadow-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setReadingArticle(null);
                    onOpenEstimator();
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#08184E] hover:bg-[#0D226B] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-base text-gold-400">mail</span>
                  <span>Enquire for Similar Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
