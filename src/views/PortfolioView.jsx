import React, { useState, useMemo } from 'react';

export default function PortfolioView({ projects = [], onSelectProject, onOpenEstimator }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClient, setSelectedClient] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'bento' | 'list'

  // Extract unique filter options
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const categoryCounts = useMemo(() => {
    const counts = { All: projects.length };
    projects.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [projects]);

  const categoryIcons = {
    All: 'apps',
    'High-Rise & Towers': 'domain',
    'Luxury Residential & Villas': 'villa',
    'Hospitality & Hotels': 'hotel',
    'Commercial & Corporate': 'corporate_fare',
    'Aviation & Hangars': 'flight',
    'Educational & Institutional': 'school',
    'Industrial & Manufacturing': 'factory',
  };

  const clients = useMemo(() => {
    const set = new Set(projects.map((p) => p.client).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const locations = useMemo(() => {
    const set = new Set(projects.map((p) => p.location).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Check if any filters are active
  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedClient !== 'All' ||
    selectedLocation !== 'All' ||
    searchQuery.trim() !== '';

  // Multi-faceted filtering
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchClient = selectedClient === 'All' || p.client === selectedClient;
      const matchLocation = selectedLocation === 'All' || p.location === selectedLocation;
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.details && p.details.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchClient && matchLocation && matchSearch;
    });
  }, [projects, selectedCategory, selectedClient, selectedLocation, searchQuery]);

  return (
    <div className="view-enter pt-24 pb-24 px-6 md:px-12 max-w-container mx-auto">
      {/* Portfolio Header */}
      <div className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge font-sans text-[11px] tracking-[0.22em] uppercase text-gold-700 font-bold shadow-xs">
          PORTFOLIO ARCHIVE // 1,000+ DEVELOPMENTS ENGINEERED
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#08184E] tracking-tight">
              Landmark <span className="text-gradient-gold italic">Project Showcase</span>
            </h1>
            <p className="text-[#4A443C] text-sm sm:text-base max-w-2xl font-normal mt-2 leading-relaxed">
              Explore our comprehensive portfolio across high-rise residential towers, large-span aviation hangars, five-star luxury hotels, and bespoke beachfront mansions.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            {/* View Mode Switcher */}
            <div className="p-1 rounded-xl glass-tab-bar flex items-center shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#08184E] text-white shadow-sm' : 'text-[#4A443C] hover:text-[#08184E]'
                }`}
                title="Grid View"
              >
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('bento')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'bento' ? 'bg-[#08184E] text-white shadow-sm' : 'text-[#4A443C] hover:text-[#08184E]'
                }`}
                title="Bento View"
              >
                <span className="material-symbols-outlined text-lg">view_quilt</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#08184E] text-white shadow-sm' : 'text-[#4A443C] hover:text-[#08184E]'
                }`}
                title="List View"
              >
                <span className="material-symbols-outlined text-lg">view_list</span>
              </button>
            </div>

            <button
              onClick={onOpenEstimator}
              className="px-4 py-2.5 rounded-xl bg-[#08184E] hover:bg-[#0D226B] text-white font-sans text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-sm text-gold-400">tune</span>
              <span>Project Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────
         Sleek Architectural Portfolio Curation Bar
      ─────────────────────────────────────────── */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-xl mb-12 space-y-4">
        {/* Top Control Bar: Search + Filter Dropdowns + Live Stats */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#08184E]/70 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search by tower, client, hangar, location, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-[#FAF6ED] hover:bg-[#F5EFE0] focus:bg-white border border-[#E8DFCE] focus:border-[#08184E] rounded-2xl text-xs text-[#08184E] placeholder-[#8A8275] focus:outline-none transition-all font-sans font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[#8A8275] hover:text-[#08184E] hover:bg-white transition-colors"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Inline Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Client Filter Pill Dropdown */}
            <div className="relative flex items-center bg-[#FAF6ED] border border-[#E8DFCE] rounded-2xl px-3 py-1.5 hover:border-[#08184E]/40 transition-colors">
              <span className="material-symbols-outlined text-sm text-gold-700 mr-1.5">business</span>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="bg-transparent text-xs font-sans font-bold text-[#08184E] focus:outline-none cursor-pointer pr-2"
              >
                {clients.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#08184E]">
                    {c === 'All' ? 'All Client Brands' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter Pill Dropdown */}
            <div className="relative flex items-center bg-[#FAF6ED] border border-[#E8DFCE] rounded-2xl px-3 py-1.5 hover:border-[#08184E]/40 transition-colors">
              <span className="material-symbols-outlined text-sm text-gold-700 mr-1.5">location_on</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-xs font-sans font-bold text-[#08184E] focus:outline-none cursor-pointer pr-2"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="bg-white text-[#08184E]">
                    {loc === 'All' ? 'All Territories / Cities' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Counter & Clear Trigger */}
            <div className="flex items-center gap-2 pl-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#08184E]/5 border border-[#08184E]/10 font-sans text-xs text-[#08184E] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{filteredProjects.length}</span>
                <span className="text-[#8A8275] font-normal text-[11px]">/ {projects.length} Works</span>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedClient('All');
                    setSelectedLocation('All');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 rounded-2xl bg-[#08184E] hover:bg-[#0D226B] text-white font-sans text-xs font-bold transition-all shadow-sm flex items-center gap-1 animate-in fade-in"
                  title="Reset all filters"
                >
                  <span className="material-symbols-outlined text-xs">restart_alt</span>
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Horizontal Capsule Carousel */}
        <div className="pt-3 border-t border-[#EDE5D5] flex items-center gap-2 overflow-x-auto pb-1.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            const icon = categoryIcons[cat] || 'apartment';
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-sans flex items-center gap-2 whitespace-nowrap transition-all duration-200 border shrink-0 ${
                  isActive
                    ? 'bg-[#08184E] border-[#08184E] text-white font-bold shadow-md scale-[1.02]'
                    : 'bg-[#FAF6ED] hover:bg-white border-[#E8DFCE] hover:border-[#08184E]/30 text-[#4A443C] hover:text-[#08184E] font-medium'
                }`}
              >
                <span className={`material-symbols-outlined text-sm ${isActive ? 'text-gold-300' : 'text-gold-700'}`}>
                  {icon}
                </span>
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EAE2D2] text-[#08184E]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Criteria Chips (Dynamic) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[#EDE5D5] text-xs font-sans animate-in fade-in">
            <span className="text-[#8A8275] text-[11px] font-semibold">Filtered By:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#08184E]/10 text-[#08184E] font-bold border border-[#08184E]/20 text-[11px]">
                <span>Category: {selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="hover:text-red-600 transition-colors ml-0.5 text-xs font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {selectedClient !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#08184E]/10 text-[#08184E] font-bold border border-[#08184E]/20 text-[11px]">
                <span>Client: {selectedClient}</span>
                <button
                  type="button"
                  onClick={() => setSelectedClient('All')}
                  className="hover:text-red-600 transition-colors ml-0.5 text-xs font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {selectedLocation !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#08184E]/10 text-[#08184E] font-bold border border-[#08184E]/20 text-[11px]">
                <span>Location: {selectedLocation}</span>
                <button
                  type="button"
                  onClick={() => setSelectedLocation('All')}
                  className="hover:text-red-600 transition-colors ml-0.5 text-xs font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#08184E]/10 text-[#08184E] font-bold border border-[#08184E]/20 text-[11px]">
                <span>Search: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-600 transition-colors ml-0.5 text-xs font-bold"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl glass-panel shadow-lg">
          <span className="material-symbols-outlined text-4xl text-[#6E665B]">search_off</span>
          <h3 className="font-serif text-lg font-bold text-[#08184E]">No projects found</h3>
          <p className="text-xs text-[#6E665B] font-normal">
            No developments match your active filter criteria. Try adjusting the search or category filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* 3-Column Luxury Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => (
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
                <span className="absolute top-4 left-4 font-sans text-[10px] tracking-wider uppercase glass-badge px-3 py-1 rounded-full text-[#08184E] font-bold shadow-xs">
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

                <div className="pt-4 border-t border-white/60 flex items-center justify-between text-xs font-sans text-[#08184E] font-bold">
                  <span>View Project Specs</span>
                  <span className="material-symbols-outlined text-sm text-gold-600 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'bento' ? (
        /* 2-Column Bento Editorial View */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {filteredProjects.map((proj, idx) => {
            const isWide = idx % 3 === 0;
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className={`${
                  isWide ? 'md:col-span-8' : 'md:col-span-4'
                } group cursor-pointer rounded-3xl overflow-hidden glass-card shadow-lg flex flex-col justify-between min-h-[360px] relative`}
              >
                <img
                  src={proj.primaryImage}
                  alt={proj.title}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero-bridge.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08184E]/90 via-[#08184E]/30 to-transparent" />

                <div className="relative z-10 p-6 flex justify-between items-start">
                  <span className="font-sans text-[10px] uppercase tracking-wider glass-badge px-3 py-1 rounded-full text-[#08184E] font-bold shadow-xs">
                    {proj.category}
                  </span>
                  <span className="font-sans text-xs font-bold text-white bg-[#08184E]/85 px-2.5 py-1 rounded-md backdrop-blur-md">
                    {proj.location}
                  </span>
                </div>

                <div className="relative z-10 p-6 space-y-2">
                  <div className="font-sans text-[11px] text-gold-300 uppercase tracking-widest font-bold">
                    {proj.client} · {proj.year}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-gold-200 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-white/85 font-normal line-clamp-2 max-w-xl leading-relaxed">
                    {proj.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="rounded-3xl glass-panel shadow-lg overflow-hidden">
          <table className="w-full text-left text-xs font-sans">
            <thead className="glass-panel-subtle border-b border-white/60 font-sans text-[11px] text-[#08184E] uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4 pl-6">#</th>
                <th className="p-4">Project Name</th>
                <th className="p-4">Developer / Client</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Year</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 text-[#4A443C]">
              {filteredProjects.map((p, idx) => (
                <tr
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="hover:bg-white/70 cursor-pointer transition-colors"
                >
                  <td className="p-4 pl-6 font-mono text-[#6E665B]">{p.slNo || idx + 1}</td>
                  <td className="p-4 font-serif text-sm font-bold text-[#08184E] group-hover:text-gold-700">
                    {p.title}
                  </td>
                  <td className="p-4 font-medium text-[#1A1815]">{p.client}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans glass-badge text-[#08184E] font-bold">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 font-sans text-[#6E665B]">{p.location}</td>
                  <td className="p-4 font-sans text-[#6E665B]">{p.year}</td>
                  <td className="p-4 pr-6 text-right font-sans text-[#08184E] font-bold">
                    Inspect →
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
