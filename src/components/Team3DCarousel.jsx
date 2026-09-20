import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Team3DCarousel({ teamMembers = [], initialIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const autoPlayRef = useRef(null);

  const total = teamMembers.length;

  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < total) {
      setActiveIndex(initialIndex);
    }
  }, [initialIndex, total]);

  // Responsive window resize tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-rotation timer
  useEffect(() => {
    if (isAutoPlaying && !isHovered && total > 0) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, isHovered, nextSlide, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch & Drag handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!teamMembers || total === 0) return null;

  const currentMember = teamMembers[activeIndex];

  const stageRef = useRef(null);

  const handleCardClick = (idx) => {
    if (idx === activeIndex) return;
    setActiveIndex(idx);
    // Reset auto-play timer so the user has full inspection time on their selected card
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      if (isAutoPlaying) {
        autoPlayRef.current = setInterval(() => {
          nextSlide();
        }, 5000);
      }
    }
  };

  // Stage-level click fallback for easy selecting on outer edges
  const handleStageClick = (e) => {
    if (!stageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const clickX = e.clientX - stageRect.left;
    const stageWidth = stageRect.width;
    const relX = clickX / stageWidth; // 0 to 1

    let targetDiff = 0;
    if (relX < 0.18) targetDiff = -3;
    else if (relX < 0.33) targetDiff = -2;
    else if (relX < 0.44) targetDiff = -1;
    else if (relX <= 0.56) targetDiff = 0;
    else if (relX <= 0.67) targetDiff = 1;
    else if (relX <= 0.82) targetDiff = 2;
    else targetDiff = 3;

    if (targetDiff !== 0) {
      const targetIdx = (activeIndex + targetDiff + total * 10) % total;
      handleCardClick(targetIdx);
    }
  };

  // Helper to compute 3D position and rotation for each card relative to activeIndex
  // Continuous 3D orbital curve so cards transition seamlessly with zero pop-in or sudden layout snaps
  const getCardStyle = (index) => {
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const isMobile = windowWidth < 640;
    const isTablet = windowWidth >= 640 && windowWidth < 1024;
    const absDiff = Math.abs(diff);
    const dir = diff > 0 ? 1 : diff < 0 ? -1 : 0;

    if (diff === 0) {
      // Active center card - in FRONT, large, crisp, prominent
      return {
        transform: 'translateX(0px) translateZ(80px) scale(1.10) rotateY(0deg)',
        opacity: 1,
        zIndex: 50,
        pointerEvents: 'auto',
        filter: 'brightness(1) contrast(1.05)',
      };
    } else if (absDiff === 1) {
      // Step 1: Immediate adjacent cards
      const tx = isMobile ? dir * 105 : isTablet ? dir * 145 : dir * 170;
      const rot = -dir * 14;
      const sc = isMobile ? 0.85 : 0.90;
      return {
        transform: `translateX(${tx}px) translateZ(20px) scale(${sc}) rotateY(${rot}deg)`,
        opacity: 0.92,
        zIndex: 40,
        pointerEvents: 'auto',
        filter: 'brightness(0.96) contrast(1)',
      };
    } else if (absDiff === 2) {
      // Step 2: Flanking cards - 100% interactive and clearly visible
      const tx = isMobile ? dir * 155 : isTablet ? dir * 250 : dir * 315;
      const rot = -dir * 24;
      const sc = isMobile ? 0.72 : 0.76;
      const op = isMobile ? 0.5 : 0.80;
      return {
        transform: `translateX(${tx}px) translateZ(-35px) scale(${sc}) rotateY(${rot}deg)`,
        opacity: op,
        zIndex: 30,
        pointerEvents: 'auto',
        filter: 'brightness(0.90) contrast(0.98)',
      };
    } else if (absDiff === 3) {
      // Step 3: Outer perimeter cards - fully interactive and unclipped
      const tx = isMobile ? dir * 190 : isTablet ? dir * 310 : dir * 425;
      const rot = -dir * 30;
      const sc = isMobile ? 0.6 : 0.64;
      const op = isMobile ? 0 : 0.65;
      return {
        transform: `translateX(${tx}px) translateZ(-80px) scale(${sc}) rotateY(${rot}deg)`,
        opacity: op,
        zIndex: 20,
        pointerEvents: isMobile ? 'none' : 'auto',
        filter: 'brightness(0.85) contrast(0.95)',
      };
    } else if (absDiff === 4) {
      // Step 4: Staged seamlessly just behind the horizon for butter-smooth entry/exit
      const tx = isMobile ? dir * 220 : isTablet ? dir * 360 : dir * 510;
      const rot = -dir * 36;
      return {
        transform: `translateX(${tx}px) translateZ(-160px) scale(0.48) rotateY(${rot}deg)`,
        opacity: 0,
        zIndex: 10,
        pointerEvents: 'none',
        filter: 'brightness(0.7)',
      };
    } else {
      // Step 5+: Smoothly parked on the rear orbital radius
      const tx = isMobile ? dir * 240 : isTablet ? dir * 400 : dir * 580;
      const rot = -dir * 42;
      return {
        transform: `translateX(${tx}px) translateZ(-250px) scale(0.35) rotateY(${rot}deg)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'brightness(0.6)',
      };
    }
  };

  return (
    <div
      className="relative w-full max-w-6xl mx-auto py-6 px-2 sm:px-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header & Tactical Controls */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[11px] font-bold tracking-widest uppercase text-gold-700">
            STAFF SPOTLIGHT // {String(activeIndex + 1).padStart(2, '0')} OF {String(total).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge text-[10px] font-sans font-bold text-[#08184E] hover:border-gold-600 transition-colors shadow-xs"
            title={isAutoPlaying ? 'Click to pause rotation' : 'Click to start auto-rotation'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAutoPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-[#8A8275]'
              }`}
            />
            <span>{isAutoPlaying ? 'Auto-Rotating' : 'Paused'}</span>
          </button>
        </div>

        {/* Previous / Next Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            className="w-10 h-10 rounded-full glass-tab-bar hover:bg-[#08184E] hover:text-white text-[#08184E] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
            aria-label="Previous staff member"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="w-10 h-10 rounded-full glass-tab-bar hover:bg-[#08184E] hover:text-white text-[#08184E] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
            aria-label="Next staff member"
          >
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────
         3D CONVEX ARC STAGE (Click on any image to select)
      ─────────────────────────────────────────── */}
      <div
        ref={stageRef}
        onClick={handleStageClick}
        className="relative h-[380px] sm:h-[420px] md:h-[450px] flex items-center justify-center overflow-visible cursor-pointer"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {teamMembers.map((member, idx) => {
            const style = getCardStyle(idx);
            const isCurrent = idx === activeIndex;

            return (
              <div
                key={member.id || idx}
                role="button"
                tabIndex={0}
                aria-label={`Select ${member.name} - ${member.role}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(idx);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(idx);
                  }
                }}
                className={`absolute w-[170px] sm:w-[185px] md:w-[200px] aspect-[3/4] cursor-pointer rounded-3xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-gold-500 hover:z-50 hover:brightness-110`}
                style={{
                  ...style,
                  transformOrigin: 'center center',
                  transition:
                    'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), filter 500ms ease, box-shadow 400ms ease, border-color 300ms ease',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {/* Card Container with active gold highlight */}
                <div
                  className={`w-full h-full rounded-3xl overflow-hidden relative transition-all duration-500 ${
                    isCurrent
                      ? 'ring-4 ring-gold-500/80 shadow-2xl scale-100 border-2 border-white'
                      : 'border border-[#E8DFCE] shadow-lg group-hover:border-gold-500/70 group-hover:shadow-xl'
                  }`}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top filter brightness-100 transition-transform duration-700 group-hover:scale-105 bg-[#FAF4E8]"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero-bridge.jpg';
                    }}
                  />
                  {/* Atmospheric Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08184E]/90 via-black/20 to-transparent pointer-events-none" />

                  {/* Badge on Card */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                    <span className="font-sans text-[9px] sm:text-[9.5px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white font-bold border border-white/20 truncate max-w-full">
                      {member.experience || 'Specialist'}
                    </span>
                    {!isCurrent && (
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-sans font-bold text-gold-300 bg-[#08184E]/80 px-2 py-0.5 rounded-full border border-gold-400/40">
                        Click
                      </span>
                    )}
                  </div>

                  {/* Bottom Name Preview on Card */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white pointer-events-none">
                    <div className="font-serif text-sm sm:text-base md:text-lg font-bold truncate leading-tight drop-shadow-md group-hover:text-gold-200 transition-colors">
                      {member.name}
                    </div>
                    <div className="font-sans text-[10px] sm:text-[11px] text-gold-300 font-medium truncate mt-0.5">
                      {member.role}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────
         ACTIVE SPOTLIGHT DESCRIPTION PEDESTAL
      ─────────────────────────────────────────── */}
      <div className="mt-6 sm:mt-8 max-w-2xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E8DFCE] space-y-3.5 text-center relative overflow-hidden transition-all duration-500">
          {/* Top gold line accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent rounded-full" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge font-sans text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-gold-700 shadow-xs transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#08184E] animate-pulse" />
            <span>{currentMember.role}</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#08184E] tracking-tight transition-all duration-300">
            {currentMember.name}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-sans text-[#6E665B] transition-all duration-300">
            <span className="font-semibold text-[#08184E]">{currentMember.qualification}</span>
            <span>•</span>
            <span className="text-gold-700 font-bold">{currentMember.experience}</span>
          </div>

          <p className="text-xs sm:text-sm text-[#4A443C] font-sans font-normal leading-relaxed max-w-xl mx-auto pt-3 border-t border-[#EDE5D5] transition-all duration-300">
            {currentMember.bio}
          </p>

          {/* Key Competency Badges */}
          {currentMember.highlights && (
            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              {currentMember.highlights.slice(0, 3).map((item, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-[#FAF6ED] border border-[#E8DFCE] text-[10.5px] font-sans font-semibold text-[#08184E] transition-all duration-300"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-6">
        {teamMembers.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? 'w-7 bg-[#08184E]'
                : 'w-1.5 bg-[#D8CEB9] hover:bg-gold-500'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
