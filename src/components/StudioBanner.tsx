import React from 'react';
import { IMAGES, PRODUCTS } from '../data/products';
import { Product } from '../types';

interface StudioBannerProps {
  onSelectProduct?: (product: Product) => void;
  onUniversClick?: () => void;
}

export const StudioBanner: React.FC<StudioBannerProps> = ({ onSelectProduct, onUniversClick }) => {
  const packProduct =
    PRODUCTS.find((p) => p.id === 'pack-complet-oryven' || p.slug === 'pack-complet-oryven') ||
    PRODUCTS[0];

  const handleClick = () => {
    if (onSelectProduct && packProduct) {
      onSelectProduct(packProduct);
    } else if (onUniversClick) {
      onUniversClick();
    }
  };

  return (
    <section
      id="studio"
      onClick={handleClick}
      className="w-full bg-[#FAF5F0] border-b border-[#F0EAE1] overflow-hidden cursor-pointer group select-none transition-opacity duration-200 hover:opacity-98"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label="Découvrir le Pack Complet Oryven (1 Sac + 1 Visière + 2 Bandeaux)"
    >
      {/* Mobile Banner: 4:5 / vertical aspect suited for mobile screens */}
      <div className="block sm:hidden w-full overflow-hidden">
        <img
          src={IMAGES.studioMobileBanner}
          alt="Pack Complet Oryven - 1 Sac, 1 Visière, 2 Bandeaux (Bannière Mobile)"
          className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-[1.01]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>

      {/* Desktop / Tablet Banner: Panoramic wide landscape */}
      <div className="hidden sm:block w-full overflow-hidden">
        <img
          src={IMAGES.studioDesktopBanner}
          alt="Pack Complet Oryven - 1 Sac, 1 Visière, 2 Bandeaux (Bannière Desktop)"
          className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-[1.008]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
    </section>
  );
};

