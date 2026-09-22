import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Copy,
  Check,
  Search,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  HelpCircle,
  Layers,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../types';

interface SitemapPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateHome: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({
  products,
  onSelectProduct,
  onNavigateHome,
  onNavigateSection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://oryven-maroc.com';
    const fullUrl = `${origin}/produits/${slug}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullUrl);
    }
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  return (
    <div className="py-8 sm:py-14 bg-[#FAF8F5] min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Breadcrumbs */}
        <nav aria-label="Fil d'ariane" className="flex items-center space-x-2 text-xs text-neutral-500">
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-1 hover:text-[#7A283B] transition-colors"
          >
            <Home size={14} />
            <span>Accueil</span>
          </button>
          <span>/</span>
          <span className="font-semibold text-neutral-800">Plan du site (Sitemap)</span>
        </nav>

        {/* Hero Section of Sitemap */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-3 sm:space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A283B]/10 text-[#7A283B] text-xs font-bold uppercase tracking-wider">
              <FileText size={14} />
              <span>Indexation & Architecture E-Commerce</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-neutral-900 uppercase">
              Plan du Site Officiel Oryven Maroc
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Explorez l’ensemble des pages de la boutique Oryven Maroc : chaque produit dispose de sa propre URL dédiée indexable (<code className="px-1.5 py-0.5 bg-neutral-100 rounded text-[#7A283B] font-mono text-[11px]">/produits/nom-du-produit</code>). Retrouvez également l’accès direct à nos collections, guides d’achat, services de livraison et fichier technique XML.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors"
              >
                <FileText size={14} />
                <span>Voir le fichier Sitemap.xml</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>

              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <span>Robots.txt</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Live Filter Bar */}
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrer les produits ou pages (ex: Tote Bag, Visor, Headband, Socks)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#7A283B] focus:border-transparent shadow-xs"
          />
        </div>

        {/* Section 1: Individual Product URLs (The core user request) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#7A283B]/10 text-[#7A283B]">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black font-heading uppercase text-neutral-900 tracking-tight">
                  1. Fiches Produits Dédiées (Liens Individuels)
                </h2>
                <p className="text-xs text-neutral-500">
                  Chaque accessoire dispose de sa propre page permanente avec commande express
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const productPath = `/produits/${product.slug}`;
              const isCopied = copiedSlug === product.slug;

              return (
                <article
                  key={product.id}
                  id={`sitemap-product-${product.slug}`}
                  className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col justify-between hover:border-[#7A283B]/40 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-neutral-100 bg-[#FAF8F5] shrink-0 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A283B] bg-[#7A283B]/10 px-2 py-0.5 rounded-md">
                            {product.badge || 'Essentiel'}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            En stock
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-[#7A283B] transition-colors truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-1">
                          {product.subtitle}
                        </p>
                        <p className="text-xs font-black text-neutral-900">
                          {product.price} MAD{' '}
                          <span className="text-[10px] font-normal text-neutral-400">
                            (Paiement à la livraison)
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Dedicated URL display box */}
                    <div className="bg-[#FAF8F5] border border-neutral-200/80 rounded-xl p-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 shrink-0">
                          Lien direct :
                        </span>
                        <code className="text-xs font-mono font-semibold text-[#7A283B] truncate">
                          {productPath}
                        </code>
                      </div>

                      <button
                        onClick={() => handleCopyLink(product.slug)}
                        title="Copier le lien complet"
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0 transition-colors ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check size={12} />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Open Product Page CTA */}
                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">
                      Offres solo, duo & packs disponibles
                    </span>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7A283B] hover:bg-[#681F30] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Accéder au produit</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section 2: Store Collections & Sections */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-neutral-200/80 pb-3">
            <div className="p-2 rounded-xl bg-neutral-900 text-white">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-heading uppercase text-neutral-900 tracking-tight">
                2. Rayons & Collections de la Boutique
              </h2>
              <p className="text-xs text-neutral-500">
                Navigation rapide à travers les sections principales de la boutique
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => {
                onNavigateHome();
                setTimeout(() => onNavigateSection('essentiels'), 100);
              }}
              className="bg-white p-4 rounded-2xl border border-neutral-200/90 hover:border-[#7A283B]/40 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-900 group-hover:text-[#7A283B] transition-colors">
                  Les 4 Essentiels
                </span>
                <code className="text-[10px] text-neutral-400 font-mono">#essentiels</code>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-2">
                La sélection phare : Sac cabas, Visière, Bandeau et Chaussettes de pilates.
              </p>
            </div>

            <div
              onClick={() => {
                onNavigateHome();
                setTimeout(() => onNavigateSection('studio'), 100);
              }}
              className="bg-white p-4 rounded-2xl border border-neutral-200/90 hover:border-[#7A283B]/40 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-900 group-hover:text-[#7A283B] transition-colors">
                  Du Studio À La Ville
                </span>
                <code className="text-[10px] text-neutral-400 font-mono">#studio</code>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-2">
                Des lignes épurées et des matières durables pour passer sans effort de la séance à la journée.
              </p>
            </div>

            <div
              onClick={() => {
                onNavigateHome();
                setTimeout(() => onNavigateSection('movement'), 100);
              }}
              className="bg-white p-4 rounded-2xl border border-neutral-200/90 hover:border-[#7A283B]/40 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-900 group-hover:text-[#7A283B] transition-colors">
                  Conçus Pour Bouger
                </span>
                <code className="text-[10px] text-neutral-400 font-mono">#movement</code>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-2">
                Performance athlétique, maintien anatomique et textures respirantes.
              </p>
            </div>

            <div
              onClick={() => {
                onNavigateHome();
                setTimeout(() => onNavigateSection('reviews'), 100);
              }}
              className="bg-white p-4 rounded-2xl border border-neutral-200/90 hover:border-[#7A283B]/40 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-900 group-hover:text-[#7A283B] transition-colors">
                  Avis Clientes Vérifiées
                </span>
                <code className="text-[10px] text-neutral-400 font-mono">#reviews</code>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-2">
                Plus de 400 retours d’expérience au Maroc avec 98% de satisfaction.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: E-commerce Services, Shipping & Reassurance */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-neutral-200/80 pb-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-heading uppercase text-neutral-900 tracking-tight">
                3. Services E-Commerce & Réassurance Client
              </h2>
              <p className="text-xs text-neutral-500">
                Paiement à la livraison, suivi express et garanties de conformité
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wide">
                <Truck size={16} />
                <span>Livraison Partout au Maroc</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Expédition gratuite 24/48h à Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir et toutes les autres villes du Royaume.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 space-y-2">
              <div className="flex items-center space-x-2 text-neutral-900 font-bold text-xs uppercase tracking-wide">
                <ShieldCheck size={16} className="text-[#7A283B]" />
                <span>Paiement Cash à la Livraison</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Réglez en espèces directement auprès du livreur après vérification de votre colis. Aucune carte bancaire requise.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wide">
                <MessageCircle size={16} />
                <span>Assistance WhatsApp 7j/7</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Notre équipe marocaine est joignable directement par WhatsApp pour toute question de taille, coloris ou suivi d’envoi.
              </p>
              <a
                href="https://api.whatsapp.com/send?phone=212676809781"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline pt-1"
              >
                <span>Contacter le support client</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </section>

        {/* Section 4: Technical SEO Index & Specifications */}
        <section className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider font-heading flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span>Index Technique SEO & Moteurs de Recherche</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Structure sémantique optimisée pour Google, Bing et les partages réseaux sociaux
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                Sitemap XML actif
              </span>
              <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[11px] font-semibold border border-neutral-700">
                Robots.txt indexable
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-neutral-800/60 rounded-xl p-3 border border-neutral-800">
              <span className="text-neutral-400 text-[10px] block uppercase font-bold">Protocole</span>
              <span className="font-bold text-white">HTTPS Sécurisé</span>
            </div>
            <div className="bg-neutral-800/60 rounded-xl p-3 border border-neutral-800">
              <span className="text-neutral-400 text-[10px] block uppercase font-bold">Données Structurées</span>
              <span className="font-bold text-white">Schema.org (Product & Breadcrumb)</span>
            </div>
            <div className="bg-neutral-800/60 rounded-xl p-3 border border-neutral-800">
              <span className="text-neutral-400 text-[10px] block uppercase font-bold">Format URLs</span>
              <span className="font-bold text-[#DDB8B8] font-mono">/produits/:slug</span>
            </div>
            <div className="bg-neutral-800/60 rounded-xl p-3 border border-neutral-800">
              <span className="text-neutral-400 text-[10px] block uppercase font-bold">Balisage Social</span>
              <span className="font-bold text-white">OpenGraph & Twitter Cards</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
