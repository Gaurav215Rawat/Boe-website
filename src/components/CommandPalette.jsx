import React, { useState, useEffect } from 'react';

export default function CommandPalette({
  isOpen,
  onClose,
  projects = [],
  setActivePage,
  onSelectProject,
  onOpenEstimator,
  onOpenCMS,
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Static Navigation shortcuts
  const navShortcuts = [
    {
      category: 'Pages & Direct Navigation',
      icon: 'grid_view',
      title: 'Portfolio Showcase (All 50+ Projects)',
      subtitle: 'Browse by category, client brand, sector, and location',
      action: () => {
        setActivePage('portfolio');
        onClose(false);
      },
    },
    {
      category: 'Pages & Direct Navigation',
      icon: 'engineering',
      title: 'Services & Engineering Disciplines',
      subtitle: 'Structural design, aviation hangars, luxury villas, BIM',
      action: () => {
        setActivePage('services');
        onClose(false);
      },
    },
    {
      category: 'Pages & Direct Navigation',
      icon: 'groups',
      title: 'About Bureau of Engineering Studies (BEST) & Executive Team',
      subtitle: 'Leadership profiles, 15+ years legacy, Dubai credentials',
      action: () => {
        setActivePage('about');
        onClose(false);
      },
    },
    {
      category: 'Tools & Enquiries',
      icon: 'calculate',
      title: 'Interactive Project Scope & Proposal Builder',
      subtitle: 'Estimate design timeline and request proposal',
      action: () => {
        onOpenEstimator();
        onClose(false);
      },
    },
    {
      category: 'Tools & Enquiries',
      icon: 'dashboard_customize',
      title: 'Admin CMS Management Portal',
      subtitle: 'Add, edit, or delete projects and export database',
      action: () => {
        onOpenCMS();
        onClose(false);
      },
    },
  ];

  // Dynamic project matches
  const projectMatches = projects.map((p) => ({
    category: `Project · ${p.category}`,
    icon: p.category.includes('Aviation') ? 'flight' : p.category.includes('Villa') ? 'villa' : 'domain',
    title: p.title,
    subtitle: `${p.client} · ${p.location} (${p.year})`,
    image: p.primaryImage,
    action: () => {
      onSelectProject(p);
      onClose(false);
    },
  }));

  const allItems = [...navShortcuts, ...projectMatches];

  const filtered = allItems.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      i.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#08184E]/40 backdrop-blur-xl animate-in fade-in duration-150"
      onClick={() => onClose(false)}
    >
      <div
        className="w-full max-w-2xl glass-modal rounded-3xl overflow-hidden text-[#08184E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/60 glass-panel-subtle">
          <span className="material-symbols-outlined text-gold-600 text-xl">search</span>
          <input
            type="text"
            autoFocus
            placeholder="Search projects, client brands, aviation hangars, services, team..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#08184E] placeholder-steel-400 focus:outline-none font-sans font-medium"
          />
          <kbd className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#08184E] glass-badge shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1.5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-steel-500 font-sans">
              No matching projects or services found for "{query}"
            </div>
          ) : (
            filtered.slice(0, 15).map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full p-3 rounded-2xl flex items-center gap-3.5 text-left glass-card hover:bg-white/60 transition-all group"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/60 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero-bridge.jpg';
                    }}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl glass-badge group-hover:border-gold-500/40 flex items-center justify-center text-gold-600 transition-colors shrink-0">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#08184E] group-hover:text-gold-700 transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-sans text-steel-500 uppercase truncate font-semibold">
                      · {item.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-steel-600 font-normal truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
                <span className="material-symbols-outlined text-steel-400 group-hover:text-gold-600 text-sm group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 glass-panel-subtle border-t border-white/60 flex items-center justify-between text-[11px] font-sans text-steel-600 font-medium">
          <span>Navigate with ↵ or click</span>
          <span>BEST Archive & Project Engine</span>
        </div>
      </div>
    </div>
  );
}
