import React from 'react';

export default function BestLogo({ 
  variant = 'full', 
  className = '', 
  size = 'md',
  isLight = false 
}) {
  // Size dimensions
  const badgeHeights = {
    sm: 'h-8 px-2.5 text-base',
    md: 'h-10 px-3.5 text-xl',
    lg: 'h-12 px-4 text-2xl',
    xl: 'h-16 px-5 text-4xl',
  };

  const badgeClass = badgeHeights[size] || badgeHeights.md;

  if (variant === 'badge-only') {
    return (
      <div 
        className={`inline-flex items-center justify-center bg-[#08184E] text-white font-logo tracking-wider rounded-lg shadow-sm select-none ${badgeClass} ${className}`}
        style={{ letterSpacing: '0.08em' }}
      >
        <span className="font-extrabold leading-none pt-0.5">BEST</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Royal Navy Logo Badge matching the user's provided identity */}
      <div 
        className={`inline-flex items-center justify-center bg-[#08184E] text-white font-logo rounded-xl shadow-md border border-[#08184E] shrink-0 ${badgeClass}`}
        style={{ letterSpacing: '0.08em' }}
      >
        <span className="font-extrabold leading-none pt-0.5">BEST</span>
      </div>

      {/* Typography Label */}
      <div className="flex flex-col justify-center min-w-0">
        <div className={`font-display font-bold tracking-[0.06em] leading-none uppercase ${
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
        } ${isLight ? 'text-white' : 'text-[#08184E]'}`}>
          Bureau of Engineering Studies
        </div>
        <div className={`font-sans text-[10px] tracking-[0.22em] font-semibold uppercase mt-1 ${
          isLight ? 'text-gold-400' : 'text-[#7E6123]'
        }`}>
          Consulting Engineers
        </div>
      </div>
    </div>
  );
}
