import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.offer.totalPrice * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={20} className="text-[#7A283B]" />
              <h2 className="text-base font-black font-heading uppercase text-neutral-900 tracking-tight">
                Votre Panier ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-black rounded-lg transition-colors"
              aria-label="Fermer le panier"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Alert */}
          <div className="bg-[#F8EAEB] px-5 py-3 border-b border-[#EED7DA] flex items-center space-x-2 text-xs font-semibold text-[#7A283B]">
            <Truck size={16} />
            <span>Livraison Gratuite & Paiement à la livraison activés !</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                  Votre panier est vide
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Découvrez les 4 essentiels Oryven et profitez de nos offres multi-quantités.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 bg-[#7A283B] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
                >
                  Découvrir la collection
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex space-x-3 p-3 rounded-xl border border-neutral-200 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-neutral-200"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      {item.offer.title}
                    </p>
                    {item.customColors && item.customColors.filter(Boolean).length > 0 && (
                      <p className="text-[10px] text-neutral-400 truncate">
                        Couleur(s) : {item.customColors.filter(Boolean).join(', ')}
                      </p>
                    )}
                    <div className="mt-1 flex items-baseline space-x-2">
                      <span className="text-xs font-black text-neutral-900">
                        {item.offer.totalPrice} MAD
                      </span>
                      {item.offer.originalPrice && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {item.offer.originalPrice} MAD
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Sous-total :</span>
                  <span className="font-bold text-neutral-900">{total} MAD</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Livraison au Maroc :</span>
                  <span className="font-bold text-emerald-600 uppercase">Gratuite (0 MAD)</span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total à payer à la livraison :</span>
                  <span className="text-[#7A283B]">{total} MAD</span>
                </div>
              </div>

              <button
                id="cart-checkout-btn"
                onClick={onCheckout}
                className="w-full py-3.5 px-4 bg-[#7A283B] hover:bg-[#681F30] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Finaliser la commande ({total} MAD)</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-neutral-500">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Paiement en espèces à la livraison partout au Maroc</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
