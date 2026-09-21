import React, { useState } from 'react';
import { Plus, Minus, Truck, CreditCard, RotateCcw } from 'lucide-react';
import { FAQS } from '../data/products';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('livraison');

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck size={18} className="text-neutral-800" />;
      case 'creditCard':
        return <CreditCard size={18} className="text-neutral-800" />;
      case 'rotateCcw':
        return <RotateCcw size={18} className="text-neutral-800" />;
      default:
        return <Truck size={18} className="text-neutral-800" />;
    }
  };

  return (
    <section id="faq" className="py-14 sm:py-20 bg-white border-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <span className="text-[11px] sm:text-xs font-bold tracking-widest text-neutral-500 uppercase block">
            Vos questions, nos réponses
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-neutral-900 uppercase">
            FAQ
          </h2>
          <div className="w-12 h-0.5 bg-[#7A283B] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Une question sur votre commande ou la livraison au Maroc ? Notre équipe est également disponible 7j/7 sur WhatsApp.
          </p>
        </div>

        {/* Q&A Accordion List Below */}
        <div className="space-y-3.5 sm:space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-neutral-200/90 rounded-xl overflow-hidden bg-[#FCFAF7] shadow-xs hover:border-neutral-300 transition-all"
              >
                <button
                  id={`faq-toggle-${faq.id}`}
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left focus:outline-none hover:bg-[#F7F2EB] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <div className="p-2 rounded-lg bg-white border border-neutral-200/80 shrink-0">
                      {getIcon(faq.iconName)}
                    </div>
                    <span className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className="text-neutral-600 p-1 shrink-0">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-2 text-neutral-600 text-xs sm:text-sm leading-relaxed border-t border-neutral-100 bg-white">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
