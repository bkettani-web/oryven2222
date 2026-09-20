import React, { useState } from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
  ArrowLeft,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { CustomerOrder } from '../types';

interface ThankYouPageProps {
  order: CustomerOrder | null;
  onNavigateHome: () => void;
  onNavigateProducts?: () => void;
  onOpenGoogleSheets?: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  order,
  onNavigateHome,
  onNavigateProducts,
  onOpenGoogleSheets,
}) => {
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Fallback demo order if visitor navigates directly to /thankyoupage without previous order
  const displayOrder: CustomerOrder = order || {
    orderId: 'ORYVEN-MA-DEMO1',
    createdAt: new Date().toISOString(),
    fullName: 'Client Test',
    phone: '06 12 34 56 78',
    city: 'Casablanca',
    address: 'Boulevard d’Anfa, Résidence Les Palmiers, Étage 3, N° 12',
    notes: 'Appeler avant de livrer s’il vous plaît',
    items: [
      {
        product: {
          id: 'oryven-pack-complet',
          slug: 'oryven-pack-complet',
          name: 'Pack Complet Oryven (4 Produits)',
          subtitle: 'Collection Signature',
          price: 490,
          rating: 4.9,
          reviewCount: 184,
          image:
            'https://res.cloudinary.com/diptsoc4h/image/upload/v1789912635/ChatGPT_Image_20_sept._2026_14_56_35_k0wtya.webp',
          gallery: [],
          colors: [{ name: 'Pack Signature', code: '#7A283B' }],
          description: '',
          features: [],
          materials: '',
          care: '',
          inStock: true,
          stockCount: 12,
          offers: [
            {
              id: 'x1',
              title: 'Pack Complet (Sac + Visière + 2 Bandeaux)',
              quantity: 1,
              unitPrice: 490,
              totalPrice: 490,
              shipping: 'Gratuite',
            },
          ],
        },
        offer: {
          id: 'x1',
          title: 'Pack Complet (Sac + Visière + 2 Bandeaux)',
          quantity: 1,
          unitPrice: 490,
          totalPrice: 490,
          shipping: 'Gratuite',
        },
        customColors: ['Noir Intense', 'Rose Framboise', 'Bleu Glacier', 'Toile Écru Naturelle'],
        quantity: 1,
      },
    ],
    totalAmount: 490,
    status: 'confirmed',
    paymentMethod: 'cash_on_delivery',
  };

  const isDemo = !order;
  const primaryItem = displayOrder.items[0];

  // Format order date nicely
  const orderDateFormatted = (() => {
    try {
      const d = new Date(displayOrder.createdAt);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return displayOrder.createdAt;
    }
  })();

  // Construct item summary string
  const itemsSummaryString = displayOrder.items
    .map((it) => {
      let desc = `${it.product.name} (${it.offer.title})`;
      if (it.customColors && it.customColors.filter(Boolean).length > 0) {
        desc += ` [Couleurs: ${it.customColors.filter(Boolean).join(', ')}]`;
      } else if (it.selectedColor) {
        desc += ` [Couleur: ${it.selectedColor.name}]`;
      }
      return desc;
    })
    .join(' + ');

  // WhatsApp Pre-filled message
  const generateWhatsAppMessage = () => {
    return (
      `Bonjour Oryven Maroc ! 🇲🇦\n\n` +
      `Je confirme ma commande *#${displayOrder.orderId}* passée sur votre boutique en ligne.\n\n` +
      `📦 *Détails des articles :*\n` +
      `${itemsSummaryString}\n\n` +
      `💰 *Total à payer à la livraison :* ${displayOrder.totalAmount} MAD\n\n` +
      `👤 *Mes coordonnées de livraison :*\n` +
      `• Nom : ${displayOrder.fullName}\n` +
      `• Téléphone : ${displayOrder.phone}\n` +
      `• Ville : ${displayOrder.city}\n` +
      `• Adresse : ${displayOrder.address}\n` +
      (displayOrder.notes ? `• Note : ${displayOrder.notes}\n` : '') +
      `\nMerci de m'informer dès la prise en charge par le livreur !`
    );
  };

  const handleWhatsAppConfirm = () => {
    const rawMessage = generateWhatsAppMessage();
    const encoded = encodeURIComponent(rawMessage);
    window.open(`https://wa.me/212600000000?text=${encoded}`, '_blank');
  };

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(displayOrder.orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2500);
  };

  const handleCopySummary = () => {
    const summaryText = generateWhatsAppMessage();
    navigator.clipboard?.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 pb-20 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigation & Top Controls */}
        <div className="flex items-center justify-between no-print">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-[#7A283B] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Retour à l’accueil</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
              title="Imprimer le bon de commande"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            {onOpenGoogleSheets && (
              <button
                type="button"
                onClick={onOpenGoogleSheets}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <span>Google Sheets</span>
              </button>
            )}
          </div>
        </div>

        {/* Notice for direct URL access without fresh order */}
        {isDemo && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600 shrink-0" />
              <span>
                <strong>Aperçu /thankyoupage :</strong> Ceci est un modèle de démonstration de la page de confirmation de commande.
              </span>
            </div>
            {onNavigateProducts && (
              <button
                type="button"
                onClick={onNavigateProducts}
                className="underline font-bold text-amber-950 hover:text-amber-800 shrink-0 ml-2 cursor-pointer"
              >
                Passer une vraie commande
              </button>
            )}
          </div>
        )}

        {/* HERO SUCCESS BANNER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#7A283B] via-[#8E3247] to-[#5C1E2C] text-white p-6 sm:p-8 text-center relative">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#7A283B] shadow-xl mb-4 transform hover:scale-105 transition-transform">
              <CheckCircle2 size={38} className="sm:w-12 sm:h-12 text-emerald-600" strokeWidth={2.5} />
            </div>

            <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-widest text-rose-200 mb-1">
              Commande Confirmée avec Succès
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight">
              Merci pour votre confiance, {displayOrder.fullName.split(' ')[0]} !
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl mx-auto mt-2 leading-relaxed">
              Votre commande a été enregistrée dans notre système. Nous préparons votre colis pour une expédition express partout au Maroc.
            </p>

            {/* Quick Order Meta Badge Bar */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
              <div className="bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-full font-mono font-bold flex items-center gap-2 border border-white/10">
                <span>N° {displayOrder.orderId}</span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Copier le numéro de commande"
                >
                  {copiedOrderId ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                </button>
              </div>

              <div className="bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 text-white/90">
                <Calendar size={13} />
                <span>{orderDateFormatted}</span>
              </div>

              <div className="bg-emerald-500/30 backdrop-blur-xs text-emerald-200 px-3.5 py-1.5 rounded-full font-semibold border border-emerald-400/40 flex items-center gap-1.5">
                <CreditCard size={13} />
                <span>Paiement à la livraison ({displayOrder.totalAmount} MAD)</span>
              </div>
            </div>
          </div>

          {/* ================= PROMINENT WHATSAPP CONFIRMATION CTA ================= */}
          <div className="bg-gradient-to-b from-emerald-50/70 to-white p-6 sm:p-8 border-b border-neutral-100">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <MessageCircle size={14} className="text-emerald-700" />
                <span>Confirmation Express en 1 Clic</span>
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
                Confirmez directement votre commande sur WhatsApp
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Cliquez sur le bouton ci-dessous pour ouvrir WhatsApp avec votre message pré-rempli. 
                Cela permet à notre équipe de valider votre adresse et d’expédier votre colis dès aujourd’hui !
              </p>

              {/* Big CTA Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="thankyou-whatsapp-confirm-btn"
                  type="button"
                  onClick={handleWhatsAppConfirm}
                  className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white text-sm sm:text-base font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-emerald-400/40"
                >
                  <MessageCircle size={22} strokeWidth={2.2} />
                  <span>Confirmer directement sur WhatsApp 💬</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="w-full sm:w-auto px-4 py-3.5 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold rounded-xl border border-neutral-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Copier le message complet"
                >
                  {copiedSummary ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span>Message copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copier le texte du message</span>
                    </>
                  )}
                </button>
              </div>

              {/* Message preview container */}
              <div className="text-left bg-white rounded-xl p-3.5 border border-emerald-200/80 shadow-2xs text-[11px] sm:text-xs text-neutral-600 space-y-1 mt-3">
                <div className="font-bold text-neutral-800 flex items-center gap-1.5 text-[11px]">
                  <span>Aperçu du message WhatsApp envoyé :</span>
                </div>
                <div className="bg-neutral-50 rounded-lg p-2.5 font-mono text-[10px] sm:text-[11px] text-neutral-700 whitespace-pre-line border border-neutral-200">
                  {generateWhatsAppMessage()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT: Order Details + Customer Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* LEFT: ORDER ITEMS & PRICE BREAKDOWN (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <PackageCheck size={18} className="text-[#7A283B]" />
                  <span>Détails de la commande</span>
                </h3>
                <span className="text-xs font-semibold text-neutral-500">
                  {displayOrder.items.length} article{displayOrder.items.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 divide-y divide-neutral-100">
                {displayOrder.items.map((it, idx) => {
                  const hasCustomColors = it.customColors && it.customColors.filter(Boolean).length > 0;
                  return (
                    <div key={idx} className={`pt-3 first:pt-0 flex gap-3.5 sm:gap-4 items-start`}>
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-neutral-200 shrink-0 bg-neutral-50"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug">
                            {it.product.name}
                          </h4>
                          <span className="font-black text-xs sm:text-sm text-[#7A283B] shrink-0">
                            {it.offer.totalPrice} MAD
                          </span>
                        </div>

                        <div className="text-[11px] sm:text-xs font-semibold text-neutral-600">
                          {it.offer.title}
                        </div>

                        {/* Color swatches / tags */}
                        {hasCustomColors ? (
                          <div className="pt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                              Variantes & Couleurs sélectionnées :
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {it.customColors?.filter(Boolean).map((colorName, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-neutral-200 text-neutral-800 text-[10px] font-medium px-2 py-0.5 rounded-md"
                                >
                                  <span className="w-2 h-2 rounded-full bg-[#7A283B]" />
                                  <span>{colorName}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : it.selectedColor ? (
                          <div className="text-[11px] text-neutral-600 flex items-center gap-1.5 pt-0.5">
                            <span
                              className="w-3 h-3 rounded-full border border-neutral-300"
                              style={{ backgroundColor: it.selectedColor.code }}
                            />
                            <span>Couleur : <strong>{it.selectedColor.name}</strong></span>
                          </div>
                        ) : null}

                        <div className="text-[10px] text-neutral-500 pt-0.5">
                          Quantité : <strong>{it.quantity}</strong> • Paiement en espèces à la livraison
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Sous-total articles</span>
                  <span>{displayOrder.totalAmount} MAD</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Truck size={14} />
                    <span>Livraison Express Partout au Maroc (24h - 48h)</span>
                  </span>
                  <span className="uppercase font-bold tracking-wider text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Gratuite
                  </span>
                </div>

                <div className="border-t border-neutral-200 pt-3 flex items-center justify-between text-sm sm:text-base font-black text-neutral-900">
                  <span>Montant Total à payer à la livraison</span>
                  <span className="text-xl sm:text-2xl text-[#7A283B]">
                    {displayOrder.totalAmount} MAD
                  </span>
                </div>

                <p className="text-[10px] sm:text-[11px] text-neutral-500 italic pt-1">
                  * Vous ne payez rien en ligne. Le règlement se fait en espèces directement au livreur après inspection de votre colis.
                </p>
              </div>
            </div>

            {/* Delivery Steps Timeline */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-800 mb-4 flex items-center gap-2">
                <Truck size={16} className="text-[#7A283B]" />
                <span>Étapes d’acheminement de votre colis</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>1. Enregistrée</span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    Commande validée et synchronisée avec notre logistique.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <PackageCheck size={15} className="text-amber-600" />
                    <span>2. Préparation</span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    Contrôle qualité de chaque article et emballage soigné.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                    <Truck size={15} className="text-neutral-500" />
                    <span>3. Livraison 24-48h</span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    Appel du livreur avant passage à votre adresse.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CUSTOMER DETAILS & GUARANTEES (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Customer Information Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
                <User size={18} className="text-[#7A283B]" />
                <span>Coordonnées du client</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <User size={16} className="text-[#7A283B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Destinataire
                    </span>
                    <strong className="text-neutral-900 font-semibold">{displayOrder.fullName}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone size={16} className="text-[#7A283B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Téléphone de contact
                    </span>
                    <a
                      href={`tel:${displayOrder.phone}`}
                      className="text-neutral-900 font-semibold hover:text-[#7A283B] transition-colors"
                    >
                      {displayOrder.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#7A283B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Ville & Destination
                    </span>
                    <strong className="text-neutral-900 font-semibold">{displayOrder.city}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Truck size={16} className="text-[#7A283B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Adresse complète de livraison
                    </span>
                    <p className="text-neutral-800 leading-relaxed">{displayOrder.address}</p>
                  </div>
                </div>

                {displayOrder.notes && (
                  <div className="bg-[#FAF8F5] p-3 rounded-lg border border-neutral-200/80 text-neutral-700 text-xs">
                    <span className="font-bold block text-[10px] uppercase text-neutral-500 mb-0.5">
                      Instructions au livreur :
                    </span>
                    {displayOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-neutral-200/90 p-5 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Vos garanties Oryven Maroc</span>
              </h4>

              <ul className="space-y-2 text-xs text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Vérification à l'ouverture :</strong> Inspectez le contenu de votre colis avant de régler le livreur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Échange sous 14 jours :</strong> Changement de coloris ou retour facile et rapide.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Support réactif 7j/7 :</strong> Une question sur votre livraison ? Notre équipe vous répond immédiatement sur WhatsApp.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={handleWhatsAppConfirm}
                  className="w-full py-2.5 px-3 bg-white hover:bg-neutral-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle size={15} className="text-emerald-600" />
                  <span>Contacter le support WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Back to catalog button */}
            <div className="no-print space-y-2">
              <button
                type="button"
                onClick={onNavigateProducts || onNavigateHome}
                className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>Continuer mes achats sur la boutique</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
