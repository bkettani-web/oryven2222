import React from 'react';
import { Truck, CreditCard, RotateCcw, MessageCircle } from 'lucide-react';

export const BenefitBar: React.FC = () => {
  const benefits = [
    {
      icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800" strokeWidth={1.8} />,
      title: 'Livraison gratuite',
      subtitle: 'au Maroc',
    },
    {
      icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800" strokeWidth={1.8} />,
      title: 'Paiement à la livraison',
      subtitle: 'Espèces à la réception',
    },
    {
      icon: <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800" strokeWidth={1.8} />,
      title: 'Échange facile',
      subtitle: 'sous 14 jours',
    },
    {
      icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800" strokeWidth={1.8} />,
      title: 'Assistance WhatsApp',
      subtitle: '7j/7 dédiée',
    },
  ];

  return (
    <section className="bg-white border-b border-[#F0EAE1] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 sm:space-x-4 p-2 transition-transform hover:-translate-y-0.5"
            >
              <div className="p-2.5 rounded-full bg-[#FAF5F0] border border-[#F0EAE1] flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
