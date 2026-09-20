import React, { useState, useEffect } from 'react';
import BestLogo from './BestLogo';

export default function Navbar({
  activePage,
  setActivePage,
  onOpenEstimator,
  onOpenCMS,
  onOpenSearch,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
    { id: 'insights', label: 'Insights' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-nav py-3'
            : 'bg-[#FFF9ED]/45 backdrop-blur-md border-b border-white/40 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo with Official Navy BEST Badge */}
          <button
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left group focus:outline-none"
            aria-label="Bureau of Engineering Studies (BEST)"
          >
            <BestLogo size="md" />
          </button>

          {/* Desktop Navigation Links (Frosted Glass Tab Bar) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full glass-tab-bar shadow-sm">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'glass-tab-active'
                      : 'glass-tab-inactive'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTA Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Trigger (⌘K) */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full glass-badge text-[#08184E] text-xs font-medium flex items-center gap-2 transition-all duration-150 shadow-xs hover:shadow-sm"
              aria-label="Search projects"
            >
              <span className="material-symbols-outlined text-base text-[#08184E]">search</span>
              <span className="hidden xl:inline text-[11px] font-semibold">Search</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] bg-white rounded text-[#08184E] border border-white font-sans font-bold shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* CMS Portal Trigger Button */}
            <button
              onClick={onOpenCMS}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-badge text-[#08184E] text-xs font-semibold transition-all shadow-xs"
              title="Manage Portfolio & Projects"
            >
              <span className="material-symbols-outlined text-sm text-gold-600">dashboard_customize</span>
              <span className="hidden md:inline">Admin CMS</span>
            </button>

            {/* Enquire Now CTA Button (Royal Navy + Gold Glow) */}
            <button
              onClick={onOpenEstimator}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#08184E] hover:bg-[#0D226B] text-white px-4 py-2.5 rounded-xl shadow-md border border-[#08184E] hover:shadow-lg transition-all duration-150 hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-[15px] text-gold-400">mail</span>
              <span>Enquire Now</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#08184E] glass-badge transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-2xl text-[#08184E]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FFF9ED]/85 backdrop-blur-3xl lg:hidden pt-24 px-6 flex flex-col justify-between pb-12 animate-in fade-in duration-200">
          <div className="flex flex-col gap-2">
            <div className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-700 pb-2 border-b border-white/60 mb-2 font-bold">
              BEST Navigation
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-left text-base font-serif font-medium py-3 px-4 rounded-2xl flex items-center justify-between transition-all ${
                  activePage === item.id
                    ? 'text-white bg-[#08184E] font-semibold shadow-md'
                    : 'text-[#4A443C] hover:text-[#08184E] glass-panel-subtle'
                }`}
              >
                <span>{item.label}</span>
                <span className="material-symbols-outlined text-sm text-gold-600">arrow_forward</span>
              </button>
            ))}

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCMS();
                }}
                className="py-3 px-3 rounded-xl glass-panel-subtle text-xs font-sans text-[#08184E] font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm text-gold-600">dashboard_customize</span>
                <span>Admin CMS</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEstimator();
                }}
                className="py-3 px-3 rounded-xl bg-gold-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-gold-glow"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
                <span>Enquire Now</span>
              </button>
            </div>
          </div>

          <div className="border-t border-[#E2D9C5] pt-6 text-xs text-steel-500 font-mono space-y-1">
            <p>Opal Tower, Business Bay, Dubai, UAE</p>
            <p className="text-gold-700 font-semibold">1000+ Landmark Projects Engineered</p>
          </div>
        </div>
      )}
    </>
  );
}
