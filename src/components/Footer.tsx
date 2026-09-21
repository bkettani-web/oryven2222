import React from 'react';
import { Instagram, MessageCircle, FileSpreadsheet } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onNavigateHome: () => void;
  onNavigateSitemap?: () => void;
  onNavigateProducts?: () => void;
  onOpenGoogleSheets?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onNavigateHome,
  onNavigateSitemap,
  onNavigateProducts,
  onOpenGoogleSheets,
}) => {
  return (
    <footer className="bg-[#14171A] text-neutral-300 pt-16 pb-12 border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={onNavigateHome}
              className="text-4xl font-black tracking-tight text-white lowercase font-heading cursor-pointer"
            >
              oryven
            </button>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xs leading-relaxed">
              Move Different. Au Maroc.
              <br />
              La référence des accessoires de yoga, pilates et mouvement actif au Maroc.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-[#7A283B] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>

              {/* Custom TikTok Icon */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-[#7A283B] flex items-center justify-center text-white transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.32a6.34 6.34 0 0 0-.85-.06A6.33 6.33 0 0 0 3.1 15.6a6.34 6.34 0 0 0 10.84 4.47V10.7a8.27 8.27 0 0 0 5.65 2.19v-3.46a4.84 4.84 0 0 1-3.45-2.74z" />
                </svg>
              </a>

              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-[#25D366] flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {/* Column: Boutique */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Boutique
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onNavigateSection('essentiels');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Nouveautés
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onNavigateSection('essentiels');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Accessoires
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onNavigateSection('studio');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Notre univers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onNavigateProducts) {
                      onNavigateProducts();
                    } else {
                      onNavigateHome();
                      setTimeout(() => onNavigateSection('essentiels'), 100);
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  Les 4 Essentiels (Boutique)
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateSitemap}
                  className="hover:text-white text-rose-300/90 font-medium transition-colors flex items-center gap-1"
                >
                  <span>Plan du site (Sitemap)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Aide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Aide
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onNavigateSection('faq');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Suivi de commande
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onNavigateSection('faq');
                  }}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onNavigateSection('faq');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Échanges et retours
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Nous contacter (WhatsApp)
                </a>
              </li>
              {onOpenGoogleSheets && (
                <li>
                  <button
                    onClick={onOpenGoogleSheets}
                    className="hover:text-emerald-400 text-emerald-500 font-medium transition-colors flex items-center gap-1.5 pt-1"
                  >
                    <FileSpreadsheet size={13} />
                    <span>Google Sheets App Script</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column: À Propos & Country */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              À Propos
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onNavigateSection('studio');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Notre histoire
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    onNavigateSection('movement');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Nos valeurs
                </button>
              </li>
              <li>
                <span className="text-neutral-400">Le Maroc, notre inspiration</span>
              </li>
            </ul>

            {/* Country Selector */}
            <div className="pt-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-neutral-800/80 text-xs text-neutral-200 border border-neutral-700">
                <span className="text-sm">🇲🇦</span>
                <span>Maroc (MAD)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© 2024 Oryven Maroc. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              onClick={onNavigateSitemap}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Plan du site (HTML)
            </button>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Sitemap XML
            </a>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">
              Conditions générales
            </span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">
              Politique de confidentialité
            </span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">
              Mentions légales
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
