import React, { useState, useEffect } from 'react';
import BestLogo from './BestLogo';

export default function Footer({
  setActivePage,
  onOpenEstimator,
  onOpenCMS,
}) {
  const [dubaiTime, setDubaiTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setDubaiTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative z-10 glass-nav border-t border-white/60 text-steel-700 pt-20 pb-12 px-6 md:px-12">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/50">
          {/* Brand & Mandate */}
          <div className="md:col-span-5 space-y-6">
            <BestLogo size="lg" />

            <p className="text-xs sm:text-sm leading-relaxed text-[#4A443C] max-w-md font-normal">
              Premier structural engineering and architectural consultancy headquartered in Dubai, UAE. Over 15+ years of delivering high-rise towers, 100m+ clear-span aviation hangars, ultra-luxury villas, and value engineering across the GCC.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl glass-badge font-sans text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-steel-500">Dubai HQ (GST):</span>
                <span className="text-[#08184E] font-bold">{dubaiTime || '12:00:00 PM GST'}</span>
              </div>

              {/* Admin CMS Trigger in Footer */}
              <button
                onClick={onOpenCMS}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-card text-[#08184E] font-sans text-xs font-bold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-sm text-gold-600">dashboard_customize</span>
                <span>Admin CMS</span>
              </button>
            </div>
          </div>

          {/* Core Engineering Disciplines */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold-700 font-bold">
              Engineering Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs font-normal text-steel-600">
              <li>
                <button
                  onClick={() => {
                    setActivePage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold-700 transition-colors text-left"
                >
                  Structural Engineering & Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold-700 transition-colors text-left"
                >
                  Aviation Hangars & Large-Span Steel
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold-700 transition-colors text-left"
                >
                  Luxury Residential & Villas
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold-700 transition-colors text-left"
                >
                  Value Engineering & Peer Review
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold-700 transition-colors text-left"
                >
                  BIM Level 3 & Digital Twin
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenEstimator}
                  className="text-gold-700 hover:text-gold-800 flex items-center gap-1.5 transition-colors font-semibold pt-1"
                >
                  <span className="material-symbols-outlined text-[15px]">calculate</span>
                  <span>Interactive Proposal Estimator</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Headquarters */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold-700 font-bold">
              Headquarters
            </h4>
            <ul className="space-y-2.5 text-xs font-normal text-steel-600">
              <li>
                <strong className="text-[#1A1815] block font-semibold">Dubai Headquarters</strong>
                <span>101 Detroit House, Motor City, Dubai, UAE</span>
                <span className="block font-mono text-[10px] text-steel-500 mt-0.5">P.O. Box: 123606</span>
                <span className="block font-mono text-[10px] text-steel-500 mt-1 font-semibold">
                  Tel: <a href="tel:+97144572075" className="hover:text-gold-700">+971 4 457 2075</a> &amp; <a href="tel:+97145148067" className="hover:text-gold-700">+971 4 514 8067</a>
                </span>
                <span className="block font-mono text-[10px] text-steel-500 mt-0.5 font-semibold">Fax: +971 4 457 2076</span>
                <a href="mailto:info@bureauofengineering.com" className="block font-mono text-[10px] text-gold-700 hover:text-gold-800 mt-0.5 transition-colors">
                  info@bureauofengineering.com
                </a>
              </li>
            </ul>
          </div>

          {/* Sitemaps & Compliance */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold-700 font-bold">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-normal text-steel-600">
              <li>
                <button
                  onClick={() => {
                    setActivePage('portfolio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold-700 transition-colors text-left"
                >
                  Project Portfolio (53 Works)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold-700 transition-colors text-left"
                >
                  About Us & Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('insights');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold-700 transition-colors text-left"
                >
                  Technical Insights & Case Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-gold-700 transition-colors text-left"
                >
                  Contact & RFP Request
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-steel-500">
          <p>© {new Date().getFullYear()} Bureau of Engineering Studies Consulting Engineers L.L.C. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-semibold">
            <span className="text-gold-700">Dubai Municipality G+4 Licence</span>
            <span>·</span>
            <span>Trakhees Certified</span>
            <span>·</span>
            <span>ISO 9001 Quality Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
