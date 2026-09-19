import React from 'react';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '../data/products';

interface HeroProps {
  onDiscoverClick: () => void;
  onViewEssentialsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDiscoverClick, onViewEssentialsClick }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF6F1] border-b border-[#F0EAE1]">
      {/* ============================================================ */}
      {/* MOBILE HERO BANNER: Square 1:1 format (Image only)            */}
      {/* Displayed ONLY on mobile devices (hidden on sm screens & up)  */}
      {/* ============================================================ */}
      <div
        id="mobile-hero-banner"
        onClick={onDiscoverClick}
        className="block sm:hidden relative w-full aspect-square overflow-hidden cursor-pointer active:opacity-95 transition-opacity"
        role="button"
        tabIndex={0}
        aria-label="Découvrir les accessoires Oryven"
      >
        <img
          src={IMAGES.mobileHeroBanner}
          alt="Oryven Accessoires - Les Essentiels"
          className="w-full h-full object-cover object-center block"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* ============================================================ */}
      {/* DESKTOP HERO BANNER: Rectangular 1918x820 panoramic format    */}
      {/* Displayed ONLY on desktop / tablet (hidden on mobile)         */}
      {/* ============================================================ */}
      <div className="hidden sm:flex relative w-full aspect-[1918/820] items-center overflow-hidden">
        {/* Full-bleed background image covering the banner without cropping */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={IMAGES.wideHeroBanner}
            alt="Oryven Accessoires - Les 4 Essentiels"
            className="w-full h-full object-cover object-center block"
            referrerPolicy="no-referrer"
          />
          {/* Soft gradient overlay on the left to preserve text legibility while letting the subject shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF0EB]/90 via-[#FAF0EB]/70 via-50% sm:via-[#FAF0EB]/45 sm:via-40% to-transparent w-[85%] sm:w-3/5 lg:w-1/2 pointer-events-none" />
          {/* Subtle bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-4 sm:h-8 lg:h-12 bg-gradient-to-t from-[#FAF6F1]/80 to-transparent pointer-events-none" />
        </div>

        {/* Content layout: Harmonious overlay with typography and CTAs scaled to banner dimensions */}
        <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-8 lg:py-12">
          <div className="grid grid-cols-12 gap-2 sm:gap-6 lg:gap-12 items-center">
            {/* Left Content Column (Text & CTAs) */}
            <div className="col-span-8 sm:col-span-7 lg:col-span-6 space-y-1 xs:space-y-1.5 sm:space-y-4 lg:space-y-6 z-10 max-w-xl">
              {/* Tagline / Eyebrow */}
              <div className="hidden sm:block space-y-0.5">
                <p className="text-[9px] sm:text-xs font-semibold tracking-wider sm:tracking-widest text-neutral-500 uppercase">
                  Plus qu’un accessoire
                </p>
                <p className="text-[9px] sm:text-xs font-semibold tracking-wider sm:tracking-widest text-neutral-500 uppercase">
                  Un art de vivre
                </p>
              </div>

              {/* Giant Title */}
              <div className="space-y-0 tracking-tight leading-[0.95]">
                <h1 className="text-base xs:text-xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black font-heading text-neutral-900 uppercase">
                  Move
                </h1>
                <h1 className="text-base xs:text-xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black font-heading text-[#7A283B] uppercase">
                  Different
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-[9px] xs:text-[11px] sm:text-sm lg:text-base xl:text-lg text-neutral-700 font-normal max-w-[240px] sm:max-w-md leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                Les essentiels qui donnent du style à chaque mouvement.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-3 pt-0.5 sm:pt-2">
                <button
                  id="hero-discover-btn"
                  onClick={onDiscoverClick}
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-6 sm:py-3 bg-[#7A283B] hover:bg-[#681F30] text-white text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase rounded-md shadow-xs transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Découvrir</span>
                  <ArrowRight size={14} className="hidden sm:inline" />
                </button>

                <button
                  id="hero-essentials-btn"
                  onClick={onViewEssentialsClick}
                  className="inline-flex items-center justify-center px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-5 sm:py-3 bg-white/90 hover:bg-white text-neutral-800 border border-neutral-300 text-[8px] xs:text-[9px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase rounded-md shadow-2xs transition-all duration-200 backdrop-blur-xs cursor-pointer"
                >
                  Les 4 essentiels
                </button>
              </div>

              {/* Categories Footer in Hero */}
              <div className="hidden md:flex pt-2 sm:pt-3 text-[9px] sm:text-xs font-medium tracking-wider sm:tracking-widest text-neutral-600 uppercase items-center space-x-1.5 sm:space-x-3">
                <span>Yoga</span>
                <span className="text-neutral-400">×</span>
                <span>Bien-être</span>
                <span className="text-neutral-400">×</span>
                <span>Au quotidien</span>
              </div>
            </div>

            {/* Right Column: Transparent area to let image subject shine through */}
            <div className="col-span-4 sm:col-span-5 lg:col-span-6 relative flex flex-col justify-start items-end pointer-events-none">
              {/* Top right corner tag from mockup */}
              <div className="hidden sm:block text-right text-[10px] sm:text-xs font-semibold tracking-widest text-neutral-600 uppercase leading-snug bg-white/75 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-white shadow-xs">
                <div>Small</div>
                <div>Accessories</div>
                <div>Big</div>
                <div>Difference</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
