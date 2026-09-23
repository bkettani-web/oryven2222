import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';

interface EssentialsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

// Photos des produits prises au sol sur terrain de padel
const PADEL_COURT_THUMBNAILS: Record<string, string> = {
  'oryven-tote-bag':
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911773/ChatGPT_Image_20_sept._2026_14_42_24_mlkskn.webp',
  'oryven-yoga-headband':
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/bbyapbwquohxaokxpysv_jmqzsa.webp',
  'oryven-visor':
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_20_5_ldvl8u.webp',
  'oryven-non-slip-grip-socks':
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789912252/ChatGPT_Image_20_sept._2026_14_50_13_wzbqb0.webp',
};

// Variantes couleur prises sur le sol de padel
const PADEL_VARIANT_IMAGES: Record<string, Record<string, string>> = {
  'oryven-yoga-headband': {
    'Lavande Glacée':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/etndrdmao8yzwvzbwcch_dda6mr.webp',
    'Bleu Ciel':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/jwmbcpxtiqanr9uiklxa_ssrh4p.webp',
    'Noir Intense':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/bbyapbwquohxaokxpysv_jmqzsa.webp',
    'Corail Énergie':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/cdbz8bgrcxdvje6kyeay_gyeifc.webp',
    'Vert Forêt':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/auitayygzmelcd9fdjbl_emckuz.webp',
    'Beige Sable':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/lzwshgcbf1e7ntlzynue_ghlm7z.webp',
  },
  'oryven-visor': {
    'Bleu Glacier':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_18_1_zttxjl.webp',
    'Rose Framboise':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_19_2_s702mz.webp',
    'Mauve Nude':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911354/ChatGPT_Image_20_sept._2026_14_32_19_3_afxtpd.webp',
    'Noir Intense':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_20_5_ldvl8u.webp',
    'Blanc Perle':
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_19_4_qh8xk2.webp',
  },
};

export const EssentialsSection: React.FC<EssentialsSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}) => {
  const [selectedColors, setSelectedColors] = useState<{ [productId: string]: number }>({});

  const handleColorSelect = (productId: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedColors((prev) => ({ ...prev, [productId]: index }));
  };

  return (
    <section id="essentiels" className="py-10 sm:py-20 bg-white border-b border-[#F0EAE1]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-14 border-b border-neutral-100 pb-4 sm:pb-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-neutral-500 uppercase block mb-1">
              Nos Incontournables
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-neutral-900 uppercase">
              Les 4 Essentiels
            </h2>
          </div>
          <div className="mt-2 md:mt-0 max-w-md">
            <div className="hidden md:block w-16 h-px bg-neutral-300 mb-2" />
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Des accessoires pensés pour vous accompagner sur chaque mouvement.
            </p>
          </div>
        </div>

        {/* Products Grid: 2 columns on mobile (grid-cols-2), 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {products
            .filter((p) => p.id !== 'pack-complet-oryven')
            .map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const activeColorIdx = selectedColors[product.id] ?? 0;
            const activeColor =
              product.colors && product.colors.length > 0
                ? product.colors[activeColorIdx] || product.colors[0]
                : null;

            // Image sur sol terrain de padel avec adaptation dynamique au changement de couleur
            const padelVariantImg = activeColor && PADEL_VARIANT_IMAGES[product.id]?.[activeColor.name];
            const currentThumbnail = padelVariantImg || PADEL_COURT_THUMBNAILS[product.id] || product.image;

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                onClick={() => onSelectProduct(product)}
                className="group flex flex-col bg-white rounded-xl border border-neutral-200/80 overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all duration-300 cursor-pointer"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-square bg-[#FBF7F2] p-2 sm:p-4 flex items-center justify-center overflow-hidden">
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-white/95 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-xs text-neutral-800">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    id={`wishlist-btn-${product.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
                      isWishlisted
                        ? 'bg-[#7A283B] text-white'
                        : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-black'
                    }`}
                    aria-label="Ajouter aux favoris"
                  >
                    <Heart
                      size={15}
                      className={isWishlisted ? 'fill-current' : ''}
                      strokeWidth={1.8}
                    />
                  </button>

                  {/* Main Product Image */}
                  <img
                    src={currentThumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Quick View Overlay on hover */}
                  <div className="absolute inset-x-2 sm:inset-x-4 bottom-2 sm:bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/75 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-medium tracking-wide rounded-full shadow">
                      <Eye size={12} />
                      <span className="hidden sm:inline">Détails & Offres</span>
                      <span className="sm:hidden">Détails</span>
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
                  <div>
                    {/* Name with SEO anchor */}
                    <a
                      href={`/produits/${product.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProduct(product);
                      }}
                      className="text-xs sm:text-base lg:text-lg font-bold text-neutral-900 group-hover:text-[#7A283B] transition-colors leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] block"
                    >
                      {product.name}
                    </a>

                    {/* Price */}
                    <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-lg lg:text-xl font-extrabold text-neutral-900">
                        {product.price} MAD
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                          {product.originalPrice} MAD
                        </span>
                      )}
                    </div>

                    {/* Rating & Reviews */}
                    <div className="mt-1.5 flex items-center space-x-1 sm:space-x-1.5 text-[10px] sm:text-xs text-neutral-600">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className="fill-current text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-neutral-800">
                        {product.rating}
                      </span>
                      <span className="text-neutral-400">({product.reviewCount})</span>
                    </div>

                    {/* Color Swatches */}
                    {product.colors && product.colors.length > 1 && activeColor && (
                      <div className="mt-2.5 flex items-center space-x-1.5">
                        {product.colors.map((c, i) => (
                          <button
                            key={c.name}
                            onClick={(e) => handleColorSelect(product.id, i, e)}
                            title={c.name}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                              activeColorIdx === i
                                ? 'ring-2 ring-[#7A283B] ring-offset-1 scale-110'
                                : 'border-neutral-300 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.code }}
                            aria-label={c.name}
                          />
                        ))}
                        <span className="text-[10px] text-neutral-500 ml-1 hidden sm:inline">
                          {activeColor.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="pt-1.5 sm:pt-2">
                    <button
                      id={`add-to-cart-btn-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="w-full py-2 sm:py-3 px-2 sm:px-4 bg-[#7A283B] hover:bg-[#681F30] text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-md shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 group/btn cursor-pointer"
                    >
                      <ShoppingBag size={13} className="group-hover/btn:scale-110 transition-transform" />
                      <span className="hidden sm:inline">Ajouter au panier</span>
                      <span className="sm:hidden">Ajouter</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
