import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, MessageCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

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
  onSelectProduct?: (product: Product) => void;
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigateHome,
  onNavigateSection,
  onNavigateProducts,
  onSelectProduct,
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

  const packProduct = PRODUCTS.find((p) => p.id === 'pack-complet-oryven');

  const handleHomeClick = () => {
    setMobileMenuOpen(false);
    onNavigateHome();
  };

  const handleProductsClick = () => {
    setMobileMenuOpen(false);
    if (onNavigateProducts) {
      onNavigateProducts();
    } else {
      onNavigateHome();
      setTimeout(() => onNavigateSection('essentiels'), 100);
    }
  };

  const handlePackClick = () => {
    setMobileMenuOpen(false);
    if (packProduct && onSelectProduct) {
      onSelectProduct(packProduct);
    } else if (onNavigateProducts) {
      onNavigateProducts();
    } else {
      onNavigateHome();
      setTimeout(() => onNavigateSection('essentiels'), 100);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateHome();
    setTimeout(() => {
      onNavigateSection(sectionId);
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Reassurance Bar */}
      <div className="bg-[#7A283B] text-white text-[11px] sm:text-xs font-medium tracking-wider text-center py-2 px-4 uppercase">
        <span>Livraison Gratuite au Maroc • Paiement à la Livraison</span>
      </div>

      {/* Main Bar */}
      <div
        className={`w-full bg-white transition-all duration-300 border-b border-[#F0EBE4] ${
          isScrolled ? 'shadow-xs py-3' : 'py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button (Hamburger) */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-neutral-800 hover:text-black focus:outline-none cursor-pointer"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <button
              id="brand-logo-btn"
              onClick={handleHomeClick}
              className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 font-heading lowercase cursor-pointer hover:opacity-85 transition-opacity"
            >
              oryven
            </button>
          </div>

          {/* Desktop Simple Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-[13px] font-semibold tracking-wider uppercase text-neutral-700">
            <button
              onClick={handleHomeClick}
              className="hover:text-[#7A283B] transition-colors cursor-pointer"
            >
              Accueil
            </button>
            <button
              onClick={handleProductsClick}
              className="hover:text-[#7A283B] transition-colors cursor-pointer"
            >
              Tous les produits
            </button>
            <button
              onClick={handlePackClick}
              className="hover:text-[#7A283B] transition-colors cursor-pointer"
            >
              Le Pack 4-en-1
            </button>
            <button
              onClick={() => handleSectionClick('studio')}
              className="hover:text-[#7A283B] transition-colors cursor-pointer"
            >
              Notre Histoire
            </button>
            <button
              onClick={() => handleSectionClick('faq')}
              className="hover:text-[#7A283B] transition-colors cursor-pointer"
            >
              FAQ & Livraison
            </button>
          </nav>

          {/* Right: Cart Icon */}
          <div className="flex items-center space-x-2">
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="p-2 relative text-neutral-800 hover:text-[#7A283B] transition-colors cursor-pointer"
              aria-label="Mon panier"
              title="Mon panier"
            >
              <ShoppingBag size={22} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#7A283B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Simple & Clean Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#F0EBE4] px-6 py-6 animate-fadeIn shadow-lg">
            <nav className="flex flex-col space-y-4 text-base font-semibold text-neutral-800">
              <button
                onClick={handleHomeClick}
                className="text-left py-1 hover:text-[#7A283B] transition-colors cursor-pointer"
              >
                Accueil
              </button>
              <button
                onClick={handleProductsClick}
                className="text-left py-1 hover:text-[#7A283B] transition-colors cursor-pointer"
              >
                Tous les produits
              </button>
              <button
                onClick={handlePackClick}
                className="text-left py-1 hover:text-[#7A283B] transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Le Pack 4-en-1</span>
                <span className="text-[10px] bg-[#7A283B] text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  Bestseller
                </span>
              </button>
              <button
                onClick={() => handleSectionClick('studio')}
                className="text-left py-1 hover:text-[#7A283B] transition-colors cursor-pointer"
              >
                Notre Histoire
              </button>
              <button
                onClick={() => handleSectionClick('faq')}
                className="text-left py-1 hover:text-[#7A283B] transition-colors cursor-pointer"
              >
                FAQ & Livraison
              </button>
            </nav>

            <div className="pt-6 mt-6 border-t border-[#F0EBE4] flex items-center justify-between text-xs text-neutral-500">
              <a
                href="https://api.whatsapp.com/send?phone=212676809781"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-neutral-700 hover:text-[#25D366] transition-colors font-medium"
              >
                <MessageCircle size={15} className="text-[#25D366]" />
                <span>Contact WhatsApp</span>
              </a>
              <span>🇲🇦 Maroc</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
