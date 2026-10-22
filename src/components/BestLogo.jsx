import React from 'react';

export default function BestLogo({ 
  variant = 'full', 
  className = '', 
  size = 'md',
  isLight = false 
}) {
  // Dimensions for the official BEST logo mark
  const badgeSizes = {
    sm: 'h-8 rounded-md',
    md: 'h-10 sm:h-11 rounded-lg',
    lg: 'h-12 sm:h-14 rounded-xl',
    xl: 'h-16 sm:h-20 rounded-2xl',
  };

  const badgeClass = badgeSizes[size] || badgeSizes.md;

  if (variant === 'badge-only') {
    return (
      <img
        src="/images/best-official-logo.jpg"
        alt="BEST Logo"
        className={`object-contain shadow-sm border border-[#08184E]/20 select-none shrink-0 ${badgeClass} ${className}`}
      />
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official BEST Logo Image Mark */}
      <img
        src="/images/best-official-logo.jpg"
        alt="BEST Logo"
        className={`object-contain shadow-sm border border-[#08184E]/20 select-none shrink-0 ${badgeClass}`}
      />

      {/* Typography Label */}
      <div className="flex flex-col justify-center min-w-0">
        <div className={`font-display font-bold tracking-[0.06em] leading-none uppercase ${
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
        } ${isLight ? 'text-white' : 'text-[#08184E]'}`}>
          Bureau of Engineering Studies
        </div>
        <div className={`font-sans text-[10px] tracking-[0.18em] font-semibold uppercase mt-1 ${
          isLight ? 'text-gold-400' : 'text-[#7E6123]'
        }`}>
          Consulting Engineers L.L.C
        </div>
      </div>
    </div>
  );
}
