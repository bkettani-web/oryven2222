import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-black/60 backdrop-blur-xs flex items-start justify-center animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Search input bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center space-x-3">
          <Search size={20} className="text-neutral-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un accessoire (ex: Tote Bag, Visor, Headband, Socks)..."
            className="flex-1 text-sm sm:text-base text-neutral-800 placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-neutral-400 hover:text-black">
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black px-2 py-1"
          >
            Fermer
          </button>
        </div>

        {/* Results */}
        <div className="p-4 sm:p-5 max-h-96 overflow-y-auto space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            {filtered.length} Résultat{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          </p>

          {filtered.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onSelectProduct(product);
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-neutral-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover border border-neutral-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#7A283B] transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm line-clamp-1">
                    {product.subtitle}
                  </p>
                  <span className="text-xs font-black text-neutral-900">
                    {product.price} MAD
                  </span>
                </div>
              </div>

              <div className="p-2 text-neutral-400 group-hover:text-[#7A283B] group-hover:translate-x-1 transition-all">
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
