/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BenefitBar } from './components/BenefitBar';
import { EssentialsSection } from './components/EssentialsSection';
import { MovementBanner } from './components/MovementBanner';
import { StudioBanner } from './components/StudioBanner';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ProductPage } from './components/ProductPage';
import { ProductsPage } from './components/ProductsPage';
import { SitemapPage } from './components/SitemapPage';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { ThankYouPage } from './components/ThankYouPage';
import { WhatsAppButton } from './components/WhatsAppButton';
import { PRODUCTS } from './data/products';
import { Product, CartItem, ProductOffer, CustomerOrder } from './types';
import { Check } from 'lucide-react';

const normalizeSlug = (raw: string): string => {
  const clean = raw.toLowerCase().trim();
  if (
    clean === 'tote-bag' ||
    clean === 'alo-tote-bag' ||
    clean === 'oryven-tote-bag' ||
    clean === 'sac' ||
    clean === 'sac-cabas'
  ) {
    return 'oryven-tote-bag';
  }
  if (
    clean === 'headband' ||
    clean === 'yoga-headband' ||
    clean === 'alo-yoga-headband' ||
    clean === 'oryven-yoga-headband' ||
    clean === 'bandeau'
  ) {
    return 'oryven-yoga-headband';
  }
  if (
    clean === 'visor' ||
    clean === 'alo-visor' ||
    clean === 'oryven-visor' ||
    clean === 'visiere'
  ) {
    return 'oryven-visor';
  }
  if (
    clean === 'socks' ||
    clean === 'grip-socks' ||
    clean === 'alo-grip-socks' ||
    clean === 'alo-non-slip-grip-socks' ||
    clean === 'oryven-grip-socks' ||
    clean === 'oryven-non-slip-grip-socks' ||
    clean === 'chaussettes'
  ) {
    return 'oryven-non-slip-grip-socks';
  }
  return clean;
};

const resolveRoute = (
  pathname: string
): { view: 'home' | 'product' | 'sitemap' | 'products' | 'thankyou'; product: Product | null } => {
  const path = pathname.toLowerCase();

  if (
    path === '/thankyoupage' ||
    path === '/thankyoupage/' ||
    path === '/thank-you' ||
    path === '/thank-you/' ||
    path === '/thankyou' ||
    path === '/thankyou/' ||
    path === '/merci' ||
    path === '/merci/'
  ) {
    return { view: 'thankyou', product: null };
  }

  if (path === '/plan-du-site' || path === '/sitemap' || path === '/sitemap.html') {
    return { view: 'sitemap', product: null };
  }

  if (
    path === '/produits' ||
    path === '/produits/' ||
    path === '/collections' ||
    path === '/collections/' ||
    path === '/boutique' ||
    path === '/boutique/'
  ) {
    return { view: 'products', product: null };
  }

  const productMatch = path.match(/^\/produits?\/([a-z0-9_-]+)/i);
  if (productMatch) {
    const rawSlug = productMatch[1];
    const normalized = normalizeSlug(rawSlug);
    const found = PRODUCTS.find(
      (p) => p.slug === normalized || p.id === normalized || p.slug === rawSlug || p.id === rawSlug
    );
    if (found) {
      return { view: 'product', product: found };
    }
  }

  return { view: 'home', product: null };
};

export default function App() {
  const initialRoute = resolveRoute(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'sitemap' | 'products' | 'thankyou'>(initialRoute.view);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialRoute.product);

  // Cart & Wishlist local state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('oryven_cart') || localStorage.getItem('alo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('oryven_wishlist') || localStorage.getItem('alo_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawers and modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(() => {
    try {
      const saved = localStorage.getItem('oryven_latest_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('oryven_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Save Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('oryven_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handlers
  const handleSelectProduct = (product: Product, pushHistory = true) => {
    setSelectedProduct(product);
    setCurrentView('product');
    if (pushHistory && typeof window !== 'undefined') {
      const targetPath = `/produits/${product.slug}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view: 'product', slug: product.slug }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = (pushHistory = true) => {
    setCurrentView('home');
    setSelectedProduct(null);
    if (pushHistory && typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        window.history.pushState({ view: 'home' }, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSitemap = (pushHistory = true) => {
    setCurrentView('sitemap');
    setSelectedProduct(null);
    if (pushHistory && typeof window !== 'undefined') {
      if (window.location.pathname !== '/plan-du-site') {
        window.history.pushState({ view: 'sitemap' }, '', '/plan-du-site');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductsPage = (pushHistory = true) => {
    setCurrentView('products');
    setSelectedProduct(null);
    if (pushHistory && typeof window !== 'undefined') {
      if (window.location.pathname !== '/produits') {
        window.history.pushState({ view: 'products' }, '', '/produits');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser navigation popstate listener (Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const route = resolveRoute(window.location.pathname);
      setCurrentView(route.view);
      setSelectedProduct(route.product);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO, title and Schema.org metadata
  useEffect(() => {
    const existingScript = document.getElementById('oryven-schema-ld') || document.getElementById('alo-schema-ld');
    if (existingScript) existingScript.remove();

    if (currentView === 'product' && selectedProduct) {
      document.title = `${selectedProduct.name} | Oryven Maroc - Paiement à la Livraison`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          `${selectedProduct.name} : ${selectedProduct.subtitle} Commandez avec livraison gratuite au Maroc et paiement à la livraison.`
        );
      }

      // Add Schema.org JSON-LD
      const schemaScript = document.createElement('script');
      schemaScript.id = 'oryven-schema-ld';
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: selectedProduct.name,
        image: selectedProduct.image,
        description: selectedProduct.description,
        brand: {
          '@type': 'Brand',
          name: 'Oryven',
        },
        offers: {
          '@type': 'Offer',
          url: `${window.location.origin}/produits/${selectedProduct.slug}`,
          priceCurrency: 'MAD',
          price: selectedProduct.price,
          availability: selectedProduct.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: selectedProduct.rating,
          reviewCount: selectedProduct.reviewCount,
        },
      });
      document.head.appendChild(schemaScript);
    } else if (currentView === 'products') {
      document.title = 'Tous les Produits (Les 4 Essentiels) | Oryven Maroc';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Explorez les 4 Essentiels Oryven au Maroc : Tote Bag, Signature Yoga Headband, Sun & Court Visor et Chaussettes Pilates antidérapantes. Livraison gratuite au Maroc et paiement à la livraison.'
        );
      }

      // Add ItemList Schema.org JSON-LD
      const schemaScript = document.createElement('script');
      schemaScript.id = 'oryven-schema-ld';
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'ItemList',
        name: 'Les 4 Essentiels Oryven',
        itemListElement: PRODUCTS.map((prod, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: prod.name,
          url: `${window.location.origin}/produits/${prod.slug}`,
          image: prod.image,
        })),
      });
      document.head.appendChild(schemaScript);
    } else if (currentView === 'sitemap') {
      document.title = 'Plan du site (Sitemap E-commerce) | Oryven Maroc';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Plan du site officiel Oryven Maroc : explorez l’ensemble de nos fiches produits dédiées, collections yoga & pilates, informations de livraison et service client.'
        );
      }
    } else if (currentView === 'thankyou') {
      document.title = 'Merci pour votre commande | Oryven Maroc';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Confirmation de votre commande Oryven Maroc avec récapitulatif des articles, adresse de livraison et bouton de confirmation direct WhatsApp.'
        );
      }
    } else {
      document.title = 'Oryven Maroc | Boutique Officielle - Les 4 Essentiels';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Boutique en ligne officielle Oryven au Maroc - Les 4 Essentiels : Tote Bag, Yoga Headband, Visor et Non-Slip Grip Socks avec paiement à la livraison et offres multi-quantités.'
        );
      }
    }
  }, [currentView, selectedProduct]);

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product: Product, customOffer?: ProductOffer, customColors?: string[]) => {
    const offerToUse = customOffer || product.offers[0];
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;

    const newItem: CartItem = {
      product,
      selectedColor: defaultColor,
      offer: offerToUse,
      customColors:
        customColors && customColors.length > 0
          ? customColors
          : defaultColor?.name
          ? [defaultColor.name]
          : undefined,
      quantity: 1,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
    showToast(`✓ ${product.name} ajouté à votre panier`);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Retiré des favoris : ${product.name}`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`❤️ Ajouté aux favoris : ${product.name}`);
        return [...prev, product.id];
      }
    });
  };

  const handleOrderSuccess = (order: CustomerOrder) => {
    setConfirmedOrder(order);
    try {
      localStorage.setItem('oryven_latest_order', JSON.stringify(order));
    } catch {
      // ignore
    }
    // Clear cart
    setCartItems([]);
    // Direct navigate to /thankyoupage
    setCurrentView('thankyou');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'thankyou' }, '', '/thankyoupage');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProceedCheckoutFromCart = () => {
    if (cartItems.length > 0) {
      setIsCartOpen(false);
      const targetProduct = cartItems[0].product;
      setSelectedProduct(targetProduct);
      setCurrentView('product');
      setTimeout(() => {
        const formEl = document.getElementById('order-form');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  };

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1E1E]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center space-x-2 text-xs font-semibold animate-fadeIn border border-neutral-700">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        cartCount={cartItems.length}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateHome={handleBackToHome}
        onNavigateSection={handleNavigateSection}
        onNavigateSitemap={handleOpenSitemap}
        onNavigateProducts={handleOpenProductsPage}
        onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
      />

      {/* View Switcher: Home View vs Products Catalog vs Product View vs Sitemap View */}
      <main className="flex-1">
        {currentView === 'home' ? (
          <div>
            {/* 1. Hero Section (Pixel-perfect to mockup) */}
            <Hero
              onDiscoverClick={() => handleNavigateSection('essentiels')}
              onViewEssentialsClick={() => handleNavigateSection('essentiels')}
            />

            {/* 2. 4 Pillars Reassurance Bar */}
            <BenefitBar />

            {/* 3. "Nos Incontournables / Les 4 Essentiels" Grid */}
            <EssentialsSection
              products={PRODUCTS}
              onSelectProduct={handleSelectProduct}
              onAddToCart={(p) => handleAddToCart(p)}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />

            {/* 4. "Mind Body Everywhere / Conçus Pour Bouger" + 3 Pillars */}
            <MovementBanner
              onExploreClick={handleOpenProductsPage}
              onNavigateProducts={handleOpenProductsPage}
              onSelectProduct={handleSelectProduct}
            />

            {/* 5. "Du Studio À La Ville" Lifestyle Section */}
            <StudioBanner
              onSelectProduct={handleSelectProduct}
              onUniversClick={() => handleNavigateSection('essentiels')}
            />

            {/* 6. "Elles en parlent mieux que nous" Reviews Section */}
            <ReviewsSection />

            {/* 7. FAQ Section */}
            <FaqSection />

            {/* 8. Newsletter -10% Banner */}
            <NewsletterSection />
          </div>
        ) : currentView === 'products' ? (
          <ProductsPage
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(p) => handleAddToCart(p)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onNavigateHome={handleBackToHome}
          />
        ) : currentView === 'sitemap' ? (
          <SitemapPage
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onNavigateHome={handleBackToHome}
            onNavigateSection={handleNavigateSection}
          />
        ) : currentView === 'thankyou' ? (
          <ThankYouPage
            order={confirmedOrder}
            onNavigateHome={handleBackToHome}
            onNavigateProducts={handleOpenProductsPage}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
          />
        ) : selectedProduct ? (
          <ProductPage
            product={selectedProduct}
            onBack={handleBackToHome}
            onOrderSuccess={handleOrderSuccess}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
          />
        ) : (
          <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900 font-heading uppercase">
              Produit introuvable
            </h2>
            <p className="text-sm text-neutral-500">
              Le lien demandé n’existe pas ou le produit a été déplacé.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleBackToHome}
                className="px-5 py-2.5 bg-[#7A283B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
              >
                Retour à l’accueil
              </button>
              <button
                onClick={handleOpenSitemap}
                className="px-5 py-2.5 bg-white border border-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:bg-neutral-50"
              >
                Consulter le plan du site
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer (Mockup matching) */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onNavigateHome={handleBackToHome}
        onNavigateSitemap={handleOpenSitemap}
        onNavigateProducts={handleOpenProductsPage}
        onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleProceedCheckoutFromCart}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistedProducts}
        onRemoveWishlist={(id) => {
          setWishlistIds((prev) => prev.filter((item) => item !== id));
        }}
        onSelectProduct={handleSelectProduct}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={handleSelectProduct}
      />

      {/* Google Sheets Integration Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
      />

      {/* Floating WhatsApp Assistance Button */}
      <WhatsAppButton />
    </div>
  );
}
