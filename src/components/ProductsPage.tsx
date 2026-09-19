import React, { useState } from 'react';
import {
  Heart,
  Star,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../types';

interface ProductsPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  onNavigateHome: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onNavigateHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedColors, setSelectedColors] = useState<{ [productId: string]: number }>({});
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tous les produits', count: products.length },
    { id: 'pack', label: 'Packs & Coffrets', matchIds: ['pack-complet-oryven'] },
    { id: 'sac', label: 'Sacs & Rangement', matchIds: ['oryven-tote-bag'] },
    { id: 'visiere', label: 'Visières & Casquettes', matchIds: ['oryven-visor'] },
    { id: 'bandeau', label: 'Bandeaux & Cheveux', matchIds: ['oryven-yoga-headband'] },
    { id: 'chaussettes', label: 'Chaussettes Pilates & Grip', matchIds: ['oryven-non-slip-grip-socks'] },
  ];

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    const cat = categories.find((c) => c.id === selectedCategory);
    return cat?.matchIds?.includes(p.id);
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // 'featured' keeps standard order
  });

  const handleColorSelect = (productId: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedColors((prev) => ({ ...prev, [productId]: index }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1800);
  };

  return (
    <div className="w-full bg-[#FAF6F1] min-h-screen">
      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center space-x-2 text-xs text-neutral-500 mb-6"
        >
          <button
            onClick={onNavigateHome}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-[#7A283B] font-bold">Tous les produits</span>
        </nav>

        {/* Category Filters & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE5DB]">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#7A283B] text-white shadow-sm'
                      : 'bg-white text-neutral-700 hover:bg-white/80 border border-[#EDE5DB]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-neutral-500 font-medium">
              <strong className="text-neutral-900">{sortedProducts.length}</strong> produit{sortedProducts.length > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-1.5 bg-white border border-[#EDE5DB] rounded-lg px-2.5 py-1.5">
              <SlidersHorizontal size={13} className="text-neutral-500" />
              <select
                aria-label="Trier les produits"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="featured">Sélection Oryven</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4 Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8 pt-8">
          {sortedProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const activeColorIdx = selectedColors[product.id] ?? 0;
            const activeColor =
              product.colors && product.colors.length > 0
                ? product.colors[activeColorIdx] || product.colors[0]
                : null;

            // Discount percentage calculation
            const discountPct = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;

            const isJustAdded = addedAnimationId === product.id;

            return (
              <div
                key={product.id}
                id={`catalog-product-card-${product.id}`}
                onClick={() => onSelectProduct(product)}
                className="group flex flex-col bg-white rounded-2xl border border-[#EDE5DB] overflow-hidden hover:shadow-xl hover:border-neutral-300 transition-all duration-300 cursor-pointer"
              >
                {/* Product Image Box */}
                <div className="relative aspect-square bg-[#FAF6F1] p-3 sm:p-5 flex items-center justify-center overflow-hidden">
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-xs text-neutral-800 border border-neutral-200">
                      {product.badge}
                    </span>
                  )}

                  {/* Discount Tag */}
                  {discountPct && (
                    <span className="absolute bottom-2.5 left-2.5 z-10 bg-[#7A283B] text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs">
                      -{discountPct}%
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-xs transition-transform active:scale-90 shadow-sm ${
                      isWishlisted
                        ? 'bg-[#7A283B] text-white'
                        : 'bg-white/90 text-neutral-600 hover:bg-white hover:text-black'
                    }`}
                    aria-label="Ajouter aux favoris"
                  >
                    <Heart
                      size={15}
                      className={isWishlisted ? 'fill-current' : ''}
                      strokeWidth={1.8}
                    />
                  </button>

                  {/* Image with hover scale */}
                  <img
                    src={activeColor?.image || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details Section */}
                <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Category / Subtitle */}
                    <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400 line-clamp-1">
                      {product.subtitle}
                    </div>

                    {/* Product Name */}
                    <a
                      href={`/produits/${product.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProduct(product);
                      }}
                      className="text-xs sm:text-base font-bold text-neutral-900 group-hover:text-[#7A283B] transition-colors leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] block"
                    >
                      {product.name}
                    </a>

                    {/* Price and strike-through */}
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-sm sm:text-lg font-black text-neutral-900">
                        {product.price} MAD
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] sm:text-xs text-neutral-400 line-through">
                          {product.originalPrice} MAD
                        </span>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-[11px] text-neutral-600 pt-0.5">
                      <div className="flex items-center text-amber-500">
                        <Star size={11} className="fill-current" />
                      </div>
                      <span className="font-bold text-neutral-800">{product.rating}</span>
                      <span className="text-neutral-400">({product.reviewCount})</span>
                    </div>

                    {/* Color Swatches if available */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center space-x-1.5 pt-1">
                        {product.colors.map((color, idx) => {
                          const isSelected = idx === activeColorIdx;
                          return (
                            <button
                              key={color.name}
                              type="button"
                              onClick={(e) => handleColorSelect(product.id, idx, e)}
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border transition-all cursor-pointer ${
                                isSelected
                                  ? 'ring-2 ring-[#7A283B] ring-offset-1 scale-110'
                                  : 'border-neutral-300 hover:scale-105'
                              }`}
                              style={{ backgroundColor: color.code }}
                              title={color.name}
                              aria-label={color.name}
                            />
                          );
                        })}
                        <span className="text-[10px] text-neutral-500 ml-1">
                          {product.colors.length} coloris
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions: View Details / Quick Add */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#7A283B] hover:bg-[#681F30] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Commander</span>
                      <ArrowRight size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`inline-flex items-center justify-center p-2.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white hover:bg-neutral-100 text-neutral-800 border-[#EDE5DB]'
                      }`}
                      title="Ajouter au panier"
                      aria-label="Ajouter au panier"
                    >
                      {isJustAdded ? (
                        <Check size={14} className="text-white" />
                      ) : (
                        <ShoppingBag size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 Pillars of Oryven reassurance */}
      <section className="bg-white border-t border-[#EDE5DB] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Les Engagements Oryven
            </span>
            <h3 className="text-xl sm:text-3xl font-black font-heading tracking-tight text-neutral-900 uppercase mt-1">
              Pourquoi choisir Oryven au Maroc
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#FAF6F1] border border-[#EDE5DB]">
              <div className="w-10 h-10 rounded-lg bg-[#7A283B]/10 text-[#7A283B] flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Livraison Gratuite 24-48h
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Livraison rapide partout au Maroc sans minimum d'achat requis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#FAF6F1] border border-[#EDE5DB]">
              <div className="w-10 h-10 rounded-lg bg-[#7A283B]/10 text-[#7A283B] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Paiement à la Livraison
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Réglez en espèces à la réception de votre colis en toute confiance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#FAF6F1] border border-[#EDE5DB]">
              <div className="w-10 h-10 rounded-lg bg-[#7A283B]/10 text-[#7A283B] flex items-center justify-center shrink-0">
                <RotateCcw size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Échanges sous 14 jours
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Changement de couleur ou d'avis sans complication via notre service client.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#FAF6F1] border border-[#EDE5DB]">
              <div className="w-10 h-10 rounded-lg bg-[#7A283B]/10 text-[#7A283B] flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Offres Multi-Packs
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Économisez jusqu'à 30% en commandant par pack de 2 ou 3 articles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
