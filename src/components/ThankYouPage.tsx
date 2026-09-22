import React, { useState } from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  MapPin,
  Phone,
  User,
  Package,
  ArrowLeft,
  Copy,
  Check,
  ShoppingBag,
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
}) => {
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Fallback demo order if visitor navigates directly to /thankyoupage without previous order
  const displayOrder: CustomerOrder = order || {
    orderId: 'ORYVEN-MA-190473',
    createdAt: new Date().toISOString(),
    fullName: 'Client Oryven',
    phone: '06 61 23 45 67',
    city: 'Casablanca',
    address: 'Boulevard d’Anfa, Résidence Les Palmiers, Étage 3',
    items: [
      {
        product: {
          id: 'oryven-yoga-headband',
          slug: 'oryven-yoga-headband',
          name: 'Oryven Yoga Headband',
          subtitle: 'Maintien absolu',
          price: 179,
          rating: 4.9,
          reviewCount: 342,
          image:
            'https://res.cloudinary.com/diptsoc4h/image/upload/v1789664999/ozfmjvjz1zysmzpojycj_c2iyta.webp',
          gallery: [],
          colors: [{ name: 'Lavande Glacée', code: '#B4A7D6' }],
          description: '',
          features: [],
          materials: '',
          care: '',
          inStock: true,
          stockCount: 15,
          offers: [
            {
              id: 'x2',
              title: 'Duo Collection (2 Bandeaux)',
              quantity: 2,
              unitPrice: 144.5,
              totalPrice: 289,
              shipping: 'Gratuite',
            },
          ],
        },
        offer: {
          id: 'x2',
          title: 'Duo Collection (2 Bandeaux)',
          quantity: 2,
          unitPrice: 144.5,
          totalPrice: 289,
          shipping: 'Gratuite',
        },
        customColors: ['Lavande Glacée', 'Bleu Ciel'],
        quantity: 2,
      },
    ],
    totalAmount: 289,
    status: 'confirmed',
    paymentMethod: 'cash_on_delivery',
  };

  // Format order date
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
      let desc = `${it.product.name} [${it.offer.title}]`;
      if (it.customColors && it.customColors.filter(Boolean).length > 0) {
        desc += ` - Variantes : ${it.customColors.filter(Boolean).join(', ')}`;
      } else if (it.selectedColor) {
        desc += ` - Couleur : ${it.selectedColor.name}`;
      }
      return desc;
    })
    .join(' + ');

  // WhatsApp Pre-filled message with "N°" to avoid # fragment truncation
  const generateWhatsAppMessage = () => {
    return (
      `Bonjour Oryven Maroc ! 🌿\n\n` +
      `Je confirme ma commande N° ${displayOrder.orderId}.\n\n` +
      `📦 Commande : ${itemsSummaryString}\n` +
      `💰 Montant total : ${displayOrder.totalAmount} MAD (Paiement à la livraison)\n` +
      `📍 Adresse de livraison : ${displayOrder.address}, ${displayOrder.city}\n\n` +
      `Merci de programmer l'expédition de mon colis ! ✨`
    );
  };

  const handleWhatsAppConfirm = () => {
    const rawMessage = generateWhatsAppMessage();
    const encoded = encodeURIComponent(rawMessage);
    window.open(`https://api.whatsapp.com/send?phone=212600000000&text=${encoded}`, '_blank');
  };

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(displayOrder.orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 pb-16 pt-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back link */}
        <div>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#7A283B] transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Retour à l’accueil</span>
          </button>
        </div>

        {/* 1. Main Thank You & WhatsApp Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 text-center shadow-xs space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <CheckCircle2 size={36} strokeWidth={2.2} />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Merci pour votre commande !
            </h1>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Nous avons bien reçu votre demande. Votre colis est en cours de préparation pour une livraison express.
            </p>
          </div>

          {/* Order reference badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-100 rounded-full text-xs font-mono text-neutral-700">
            <span>Commande <strong>N° {displayOrder.orderId}</strong></span>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
              title="Copier le numéro"
            >
              {copiedOrderId ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            </button>
            <span className="text-neutral-300">•</span>
            <span className="font-sans text-neutral-500">{orderDateFormatted}</span>
          </div>

          {/* Prominent WhatsApp Confirmation Button */}
          <div className="pt-2">
            <button
              id="thankyou-whatsapp-confirm-btn"
              type="button"
              onClick={handleWhatsAppConfirm}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
            >
              <MessageCircle size={20} className="fill-white/20" />
              <span>Confirmer rapidement sur WhatsApp</span>
            </button>
            <p className="text-[11px] text-neutral-500 mt-2">
              Un message pré-rempli s’ouvre directement pour valider votre commande en 1 clic.
            </p>
          </div>
        </div>

        {/* 2. Order Summary Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <Package size={16} className="text-[#7A283B]" />
              <span>Détails de la commande</span>
            </h2>
            <span className="text-xs font-semibold text-neutral-500">
              {displayOrder.items.length} article{displayOrder.items.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3 divide-y divide-neutral-100">
            {displayOrder.items.map((it, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3.5">
                <img
                  src={it.product.image}
                  alt={it.product.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-neutral-200 bg-neutral-50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 truncate">
                      {it.product.name}
                    </h3>
                    <span className="font-bold text-xs sm:text-sm text-[#7A283B] shrink-0">
                      {it.offer.totalPrice} DH
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    {it.offer.title}
                  </div>
                  {it.customColors && it.customColors.filter(Boolean).length > 0 && (
                    <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
                      Variantes : {it.customColors.filter(Boolean).join(', ')}
                    </div>
                  )}
                  {it.selectedColor && !it.customColors?.length && (
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      Couleur : {it.selectedColor.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Livraison express (24h - 48h)</span>
              <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                Gratuite
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Mode de règlement</span>
              <span className="font-medium text-neutral-800">Paiement à la livraison</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 flex justify-between items-baseline font-bold text-sm sm:text-base text-neutral-900">
              <span>Total à régler</span>
              <span className="text-lg sm:text-xl text-[#7A283B]">
                {displayOrder.totalAmount} DH
              </span>
            </div>
          </div>
        </div>

        {/* 3. Customer Info Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-xs space-y-3">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3 flex items-center gap-2">
            <User size={16} className="text-[#7A283B]" />
            <span>Informations de livraison</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-neutral-400">Destinataire</span>
              <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <User size={13} className="text-neutral-500" />
                <span>{displayOrder.fullName}</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-neutral-400">Téléphone</span>
              <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <Phone size={13} className="text-neutral-500" />
                <a href={`tel:${displayOrder.phone}`} className="hover:text-[#7A283B] transition-colors">
                  {displayOrder.phone}
                </a>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-neutral-400">Ville</span>
              <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <MapPin size={13} className="text-neutral-500" />
                <span>{displayOrder.city}</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-neutral-400">Adresse</span>
              <p className="text-neutral-800 flex items-start gap-1.5 leading-snug">
                <Truck size={13} className="text-neutral-500 mt-0.5 shrink-0" />
                <span>{displayOrder.address}</span>
              </p>
            </div>
          </div>

          {displayOrder.notes && (
            <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-xs text-neutral-700 mt-2">
              <span className="text-[10px] font-bold uppercase text-neutral-500 block">Note :</span>
              {displayOrder.notes}
            </div>
          )}
        </div>

        {/* Bottom CTA: Return to shop */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateProducts || onNavigateHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span>Continuer mes achats</span>
          </button>
        </div>
      </div>
    </div>
  );
};
