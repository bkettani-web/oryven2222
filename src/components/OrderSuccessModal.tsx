import React from 'react';
import { CheckCircle2, MessageCircle, X, MapPin, Phone, PackageCheck, FileSpreadsheet } from 'lucide-react';
import { CustomerOrder } from '../types';
import { getProductSheetName, getAppsScriptUrl } from '../services/googleSheetsService';

interface OrderSuccessModalProps {
  order: CustomerOrder;
  onClose: () => void;
  onOpenGoogleSheets?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, onOpenGoogleSheets }) => {
  const item = order.items[0];
  const targetSheet = item?.product ? getProductSheetName(item.product.id || item.product.slug) : 'Pack 4 Produits';
  const hasGoogleSheetsConfig = Boolean(getAppsScriptUrl());
  const handleWhatsAppConfirm = () => {
    const item = order.items[0];
    const text = encodeURIComponent(
      `Bonjour Oryven Maroc ! Je confirme ma commande N° ${order.orderId}.\n\n` +
        `📦 Produit : ${item.product.name} - ${item.offer.title}\n` +
        `💰 Montant : ${order.totalAmount} MAD (Paiement à la livraison)\n` +
        `👤 Destinataire : ${order.fullName} (${order.phone})\n` +
        `📍 Ville : ${order.city}\n` +
        `🏠 Adresse : ${order.address}\n\n` +
        `Merci de m'informer dès l'expédition de mon colis !`
    );
    window.open(`https://api.whatsapp.com/send?phone=212676809781&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Modal Header with celebratory background */}
        <div className="bg-[#7A283B] text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          <div className="w-14 h-14 rounded-full bg-white text-[#7A283B] mx-auto flex items-center justify-center mb-3 shadow-md">
            <CheckCircle2 size={32} strokeWidth={2.5} />
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading uppercase tracking-tight">
            Merci {order.fullName} !
          </h3>
          <p className="text-xs text-rose-100 mt-1">
            Votre commande a bien été enregistrée et est en cours de préparation.
          </p>

          <div className="mt-3 inline-block bg-black/20 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider">
            N° de Commande : {order.orderId}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Tracking Step progress */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-1.5">
              <PackageCheck size={16} className="text-[#7A283B]" />
              <span>Statut de votre livraison</span>
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-bold text-[10px]">
                  ✓
                </div>
                <span className="font-bold text-neutral-800 block">Confirmée</span>
                <span className="text-[10px] text-neutral-400">Aujourd'hui</span>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#7A283B] text-white flex items-center justify-center mx-auto font-bold text-[10px] animate-pulse">
                  2
                </div>
                <span className="font-bold text-neutral-800 block">Préparation</span>
                <span className="text-[10px] text-[#7A283B] font-semibold">En cours</span>
              </div>

              <div className="space-y-1 opacity-50">
                <div className="w-6 h-6 rounded-full bg-neutral-300 text-neutral-600 flex items-center justify-center mx-auto font-bold text-[10px]">
                  3
                </div>
                <span className="font-bold text-neutral-800 block">Livraison</span>
                <span className="text-[10px] text-neutral-400">24h - 48h</span>
              </div>
            </div>
          </div>

          {/* Order Details summary */}
          <div className="border border-neutral-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-2">
              Récapitulatif de la commande
            </h4>

            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-xs">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-200"
                />
                <div className="flex-1">
                  <div className="font-bold text-neutral-900">{item.product.name}</div>
                  <div className="text-neutral-500 text-[11px]">{item.offer.title}</div>
                  {item.customColors && item.customColors.filter(Boolean).length > 0 && (
                    <div className="text-neutral-500 text-[10px]">
                      Couleurs : {item.customColors.filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
                <div className="font-black text-neutral-900 text-sm">
                  {item.offer.totalPrice} MAD
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-sm font-black text-neutral-900">
              <span>Montant à régler à la livraison :</span>
              <span className="text-[#7A283B] text-base">{order.totalAmount} MAD</span>
            </div>
          </div>

          {/* Delivery coordinates */}
          <div className="text-xs space-y-1.5 text-neutral-600 bg-[#FAF8F5] p-3 rounded-lg border border-neutral-200">
            <div className="flex items-center space-x-2">
              <Phone size={13} className="text-[#7A283B]" />
              <span className="font-semibold text-neutral-800">{order.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={13} className="text-[#7A283B]" />
              <span>
                {order.address}, <strong>{order.city}</strong>
              </span>
            </div>
          </div>

          {/* Google Sheets Sync Card */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-emerald-900">
              <FileSpreadsheet size={16} className="text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold">Google Sheets App Script :</span>{' '}
                <span className="text-emerald-800">
                  {hasGoogleSheetsConfig ? `Classée dans la feuille « ${targetSheet} »` : `Feuille cible « ${targetSheet} »`}
                </span>
              </div>
            </div>
            {onOpenGoogleSheets && (
              <button
                type="button"
                onClick={onOpenGoogleSheets}
                className="text-[11px] font-bold text-[#7A283B] hover:underline shrink-0 bg-white px-2 py-1 rounded-lg border border-emerald-200"
              >
                Gérer
              </button>
            )}
          </div>

          {/* CTAs */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleWhatsAppConfirm}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageCircle size={17} />
              <span>Suivre ma commande sur WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
