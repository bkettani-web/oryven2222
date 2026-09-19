import React, { useState } from 'react';
import { Mail, CheckCircle2, Send } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="bg-[#F8EAEB] border-b border-[#EED7DA] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text & Envelope Icon */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            {/* Prominent Mail Icon - Visible on all screens */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-xs border border-rose-200/80 flex items-center justify-center text-[#7A283B] flex-shrink-0">
              <Mail size={28} strokeWidth={1.8} />
            </div>

            <div>
              {/* Distinctive Newsletter Tag */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 text-[#7A283B] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-rose-200 shadow-2xs">
                <Mail size={12} className="text-[#7A283B]" />
                <span>Newsletter Oryven</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading uppercase text-neutral-900 tracking-tight">
                -10 % Sur votre première commande
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Abonnez-vous à notre newsletter pour recevoir nos nouveautés et offres exclusives.
              </p>
            </div>
          </div>

          {/* Right Input Form */}
          <div className="w-full md:w-auto flex-shrink-0">
            {submitted ? (
              <div className="flex items-center space-x-2 text-sm font-semibold text-[#7A283B] bg-white/90 py-3.5 px-6 rounded-lg border border-rose-200 shadow-xs">
                <CheckCircle2 size={18} className="text-[#7A283B]" />
                <span>Code promo BIENVENUE10 appliqué à votre panier !</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <div className="relative flex-1 min-w-[240px]">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                  <input
                    id="newsletter-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse e-mail"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white text-neutral-800 placeholder-neutral-400 text-xs sm:text-sm rounded-md border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#7A283B] shadow-2xs"
                  />
                </div>
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  className="px-6 py-3 bg-[#7A283B] hover:bg-[#681F30] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Je m’inscris</span>
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
