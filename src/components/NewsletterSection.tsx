import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { IMAGES } from '../data/products';

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
    <section className="relative w-full overflow-hidden border-b border-neutral-800 py-16 sm:py-24 lg:py-28 flex items-center">
      {/* Background Image: Mobile (Square) & Desktop (Wide) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <picture className="w-full h-full block">
          <source
            media="(max-width: 640px)"
            srcSet={IMAGES.newsletterMobileBanner}
          />
          <img
            src={IMAGES.newsletterBanner}
            alt="Le Club Oryven"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </picture>
        {/* Balanced contrast overlay keeping the blue padel court and lights visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/70 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/40 sm:to-black/25" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          {/* Left Text Block */}
          <div className="w-full lg:max-w-xl text-left space-y-3 sm:space-y-4">
            {/* Top Club Tag */}
            <div className="inline-flex items-center gap-2.5 text-white/95">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-white/80 flex items-center justify-center">
                <Mail size={16} strokeWidth={2.2} className="text-white" />
              </div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-white">
                LE CLUB ORYVEN
              </span>
            </div>

            {/* Huge -10 % Title */}
            <div className="font-black text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-tight text-white leading-none drop-shadow-md select-none">
              -10 %
            </div>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-heading uppercase text-white tracking-wide leading-tight drop-shadow-sm">
              SUR VOTRE PREMIÈRE COMMANDE
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-100/90 font-normal max-w-lg leading-relaxed drop-shadow-xs">
              Nouveautés, conseils et offres exclusives, directement dans votre boîte mail.
            </p>
          </div>

          {/* Right: Glassmorphic Email Card */}
          <div className="w-full lg:w-auto lg:min-w-[420px] max-w-md">
            <div className="bg-[#0b1b36]/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/15">
              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} strokeWidth={2.2} />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    Bienvenue dans le Club !
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-200">
                    Votre code promo <strong>BIENVENUE10</strong> est activé. Vérifiez vos emails !
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Email Input Field */}
                  <div className="relative w-full">
                    <Mail
                      size={20}
                      className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                    />
                    <input
                      id="newsletter-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre adresse e-mail"
                      required
                      className="w-full h-14 sm:h-15 pl-12 sm:pl-13 pr-4 bg-white text-neutral-900 placeholder-neutral-500 text-sm sm:text-base font-medium rounded-2xl border-0 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>

                  {/* CTA Button */}
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    className="w-full h-14 sm:h-15 rounded-2xl bg-gradient-to-r from-[#D7E9F7] via-[#DCEBFA] to-[#CBE2F6] hover:from-[#cbe2f6] hover:to-[#bedbf2] text-[#0d2238] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>JE PROFITE DE -10 %</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </button>

                  {/* Privacy / Anti-Spam reassurance */}
                  <div className="text-center pt-1">
                    <span className="text-[11px] sm:text-xs text-neutral-200/80 font-normal tracking-wide">
                      Sans spam · Désinscription en un clic
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

