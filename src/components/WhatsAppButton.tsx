import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    const text = encodeURIComponent(
      "Bonjour Oryven Maroc ! J'aimerais avoir des informations sur les accessoires ou passer une commande."
    );
    window.open(`https://wa.me/212600000000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3">
      {showTooltip && (
        <div className="hidden sm:flex items-center space-x-2 bg-white text-neutral-800 text-xs font-semibold py-2 px-3.5 rounded-full shadow-lg border border-neutral-200 animate-fadeIn">
          <span>Besoin d'aide ? Contactez-nous sur WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-neutral-700"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <button
        id="floating-whatsapp-btn"
        onClick={handleClick}
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group"
        aria-label="Contacter sur WhatsApp"
        title="Assistance WhatsApp 7j/7"
      >
        <MessageCircle size={26} strokeWidth={2} />
      </button>
    </div>
  );
};
