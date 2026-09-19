import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart size={20} className="text-[#7A283B] fill-current" />
              <h2 className="text-base font-black font-heading uppercase text-neutral-900 tracking-tight">
                Mes Favoris ({products.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-black rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {products.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <Heart size={28} />
                </div>
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                  Aucun coup de cœur enregistré
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Cliquez sur l’icône cœur pour enregistrer vos accessoires préférés.
                </p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex space-x-3 p-3 rounded-xl border border-neutral-200 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-neutral-200 cursor-pointer"
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-xs font-bold text-neutral-900 truncate hover:text-[#7A283B] cursor-pointer"
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                    >
                      {product.name}
                    </h4>
                    <p className="text-xs font-black text-neutral-900 mt-0.5">
                      {product.price} MAD
                    </p>

                    <button
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="mt-2 inline-flex items-center space-x-1.5 text-[11px] font-bold text-[#7A283B] hover:underline"
                    >
                      <ShoppingBag size={12} />
                      <span>Voir les offres & commander</span>
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => onRemoveWishlist(product.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Retirer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
