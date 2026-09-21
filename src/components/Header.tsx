import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onOpenSearch?: () => void;
  onNavigateHome: () => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateSitemap?: () => void;
  onNavigateProducts?: () => void;
  onOpenGoogleSheets?: () => void;
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigateHome,
  onNavigateSection,
  onNavigateSitemap,
  onNavigateProducts,
  onOpenGoogleSheets,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner (Burgundy) */}
      <div className="bg-[#7A283B] text-white text-xs sm:text-xs font-semibold tracking-wider text-center py-2 px-4 flex items-center justify-center gap-2 uppercase">
        <span>Livraison Gratuite au Maroc - Paiement à la Livraison</span>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full bg-white transition-all duration-300 border-b border-[#F0EBE4] ${
          isScrolled ? 'shadow-sm py-3' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-800 hover:text-black focus:outline-none"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo 'Oryven' */}
          <div className="flex items-center">
            <button
              id="brand-logo-btn"
              onClick={onNavigateHome}
              className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 font-heading flex items-center hover:opacity-85 transition-opacity cursor-pointer lowercase"
            >
              oryven
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-9 text-[13px] font-semibold tracking-wider uppercase text-neutral-800">
            <button
              id="nav-produits"
              onClick={() => {
                if (onNavigateProducts) {
                  onNavigateProducts();
                } else {
                  onNavigateHome();
                  setTimeout(() => onNavigateSection('essentiels'), 100);
                }
              }}
              className="hover:text-[#7A283B] transition-colors cursor-pointer"
            >
              Tous les produits
            </button>
            <button
              id="nav-accessoires"
              onClick={() => {
                if (onNavigateProducts) {
                  onNavigateProducts();
                } else {
                  onNavigateHome();
                  setTimeout(() => onNavigateSection('essentiels'), 100);
                }
              }}
              className="hover:text-[#7A283B] transition-colors cursor-pointer"
            >
              Accessoires
            </button>
            <button
              id="nav-univers"
              onClick={() => {
                onNavigateHome();
                setTimeout(() => onNavigateSection('studio'), 100);
              }}
              className="hover:text-[#7A283B] transition-colors cursor-pointer"
            >
              Notre Univers
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 text-neutral-800">
            {/* Cart Icon with count */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="p-1.5 relative hover:text-[#7A283B] transition-colors cursor-pointer"
              aria-label="Panier"
              title="Mon panier"
            >
              <ShoppingBag size={22} strokeWidth={1.8} />
              <span className="absolute -top-1 -right-1 bg-[#7A283B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#F0EBE4] px-4 pt-3 pb-5 space-y-3 animate-fadeIn">
            <button
              onClick={() => {
                if (onNavigateProducts) {
                  onNavigateProducts();
                } else {
                  onNavigateHome();
                  onNavigateSection('essentiels');
                }
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-[#7A283B] hover:text-black"
            >
              Tous les produits (Les 4 Essentiels)
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onNavigateSection('essentiels');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-neutral-800 hover:text-[#7A283B]"
            >
              Nouveautés
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onNavigateSection('essentiels');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-neutral-800 hover:text-[#7A283B]"
            >
              Accessoires
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onNavigateSection('studio');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-neutral-800 hover:text-[#7A283B]"
            >
              Notre Univers
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                onNavigateSection('faq');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-wider text-neutral-800 hover:text-[#7A283B]"
            >
              FAQ & Livraison
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
