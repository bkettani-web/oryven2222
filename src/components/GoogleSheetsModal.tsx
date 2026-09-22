import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Check,
  Copy,
  ExternalLink,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  getAppsScriptUrl,
  setAppsScriptUrl,
  sendTestOrdersForAllProducts,
  APPS_SCRIPT_CODE_TEMPLATE,
} from '../services/googleSheetsService';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState<string>(getAppsScriptUrl());
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'code' | 'structure'>('config');

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setAppsScriptUrl(url);
    setSaveStatus('URL enregistrée avec succès !');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleRunTestOrders = async () => {
    if (!url.trim()) {
      setTestResult({
        success: false,
        message: 'Veuillez coller votre URL Web App Google Apps Script avant de lancer le test.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await sendTestOrdersForAllProducts(url.trim());
    setIsTesting(false);
    setTestResult({
      success: res.success,
      message: res.message,
    });
  };

  const isConnected = Boolean(url && url.trim().startsWith('https://script.google.com'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#7A283B] text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#7A283B] flex items-center justify-center shadow-md shrink-0">
              <FileSpreadsheet size={22} className="text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold font-heading uppercase tracking-wider">
                  Google Sheets & Tableau de bord
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                      : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                  }`}
                >
                  {isConnected ? 'Connecté' : 'À configurer'}
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                Tableau de bord en direct + 5 feuilles produits avec statuts de commande et livraison
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 mt-4 pt-3 border-t border-white/15 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'config'
                  ? 'bg-white text-[#7A283B] shadow-xs'
                  : 'text-rose-100 hover:bg-white/10'
              }`}
            >
              1. Configuration & Test
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-[#7A283B] shadow-xs'
                  : 'text-rose-100 hover:bg-white/10'
              }`}
            >
              2. Code Apps Script (Code.gs)
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'structure'
                  ? 'bg-white text-[#7A283B] shadow-xs'
                  : 'text-rose-100 hover:bg-white/10'
              }`}
            >
              3. Dashboard & 14 Colonnes
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-neutral-800 text-xs sm:text-sm flex-1">
          {/* TAB 1: CONFIGURATION & TEST */}
          {activeTab === 'config' && (
            <div className="space-y-5">
              {/* Status Alert */}
              <div
                className={`p-3.5 rounded-xl border flex items-start space-x-3 ${
                  isConnected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {isConnected ? (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <div className="font-bold">
                    {isConnected
                      ? 'Liaison Webhook active'
                      : 'URL Google Apps Script manquante'}
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {isConnected
                      ? 'Toutes les nouvelles commandes passées sur la boutique sont envoyées directement vers votre Google Sheet avec statut "Nouveau" et "En attente", et le Tableau de bord se met à jour en temps réel.'
                      : 'Collez ci-dessous l’URL de votre application Web Google Apps Script générée après le déploiement de votre script.'}
                  </p>
                </div>
              </div>

              {/* URL Input Form */}
              <form onSubmit={handleSaveUrl} className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  URL Web App Google Apps Script
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#7A283B] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#7A283B] hover:bg-[#621f2e] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-xs"
                  >
                    Enregistrer l'URL
                  </button>
                </div>
                {saveStatus && (
                  <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                    <Check size={14} />
                    <span>{saveStatus}</span>
                  </p>
                )}
              </form>

              {/* Automated Test Order Trigger */}
              <div className="bg-[#FAF8F5] border border-neutral-200 rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                      <Play size={14} className="text-[#7A283B]" />
                      <span>Création automatique du Tableau de bord & des 5 feuilles</span>
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      En cliquant ci-dessous, le système envoie immédiatement une commande de test pour
                      chacun des 5 produits. Le script va <strong>créer automatiquement la feuille "Tableau de bord" en tête</strong> ainsi que les 5 onglets produits avec leurs 14 colonnes (menus déroulants de statuts et boutons WhatsApp) !
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold shadow-2xs">
                    📊 Tableau de bord (Dashboard)
                  </span>
                  {['Bandeau', 'Visière', 'Tote Bag', 'Chaussettes', 'Pack 4 Produits'].map((sheet) => (
                    <span
                      key={sheet}
                      className="px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[11px] font-semibold text-neutral-700 shadow-2xs"
                    >
                      📑 {sheet}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleRunTestOrders}
                    disabled={isTesting}
                    className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Envoi des 5 commandes de test en cours...</span>
                      </>
                    ) : (
                      <>
                        <Play size={15} />
                        <span>Passer la commande de test (Initialiser Dashboard & Feuilles)</span>
                      </>
                    )}
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded-lg border text-xs flex items-start space-x-2 animate-fadeIn ${
                      testResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{testResult.message}</div>
                      {testResult.success && (
                        <p className="text-[11px] text-emerald-700 mt-1">
                          Consultez dès maintenant votre Google Sheet : vous y découvrirez le <strong>Tableau de bord</strong> complet avec ses compteurs en direct, ainsi que les onglets de vos produits avec menus déroulants et boutons WhatsApp !
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick instructions summary */}
              <div className="border-t border-neutral-100 pt-3 space-y-2">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                  <HelpCircle size={13} />
                  <span>Comment installer le script en 3 étapes :</span>
                </h5>
                <ol className="text-xs text-neutral-600 space-y-1.5 list-decimal pl-4 leading-relaxed">
                  <li>Ouvrez votre Google Sheet, allez dans <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>Copiez-collez le code fourni dans l'onglet <strong>« 2. Code Apps Script »</strong>.</li>
                  <li>
                    Cliquez sur <strong>Déployer &gt; Nouveau déploiement</strong>, sélectionnez le type{' '}
                    <strong>Application Web</strong>, choisissez <em>« Qui a accès : Tout le monde »</em>, puis collez l'URL générée ici.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: CODE APPS SCRIPT */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Fichier Code.gs pour Google Apps Script
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Copiez l'intégralité de ce code et collez-le dans votre éditeur Apps Script.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                    copiedCode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#7A283B] hover:bg-[#621f2e] text-white'
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <Check size={14} />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copier le code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code display block */}
              <div className="relative">
                <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[360px] border border-neutral-700 leading-relaxed">
                  {APPS_SCRIPT_CODE_TEMPLATE}
                </pre>
              </div>

              {/* Deployment hints */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-2 text-neutral-700">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[#7A283B]" />
                  <span>Important lors du déploiement :</span>
                </div>
                <p>
                  Dans la boîte de déploiement Google Apps Script :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                  <li><strong>Type :</strong> Application Web (icône roue dentée ⚙️)</li>
                  <li><strong>Exécuter en tant que :</strong> Moi (votre adresse Gmail / Workspace)</li>
                  <li><strong>Qui a accès :</strong> <span className="font-bold text-neutral-900">Tout le monde</span> (obligatoire pour autoriser la boutique à poster les commandes sans login Google)</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: FEUILLES & COLONNES */}
          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Tableau de bord & 14 Colonnes par produit
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Organisation automatique avec statuts modifiables en un clic et mise à jour instantanée du Tableau de bord.
                </p>
              </div>

              {/* Tableau de bord highlight card */}
              <div className="p-4 bg-gradient-to-r from-stone-900 to-[#531B28] text-white rounded-xl shadow-xs space-y-2.5 border border-[#7A283B]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📊</span>
                    <span className="font-bold text-sm font-heading">Tableau de bord : Commandes & Chiffre d'Affaires (MAD)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                    Temps Réel + Finances
                  </span>
                </div>
                <p className="text-xs text-rose-100 leading-relaxed">
                  Calcule automatiquement en direct vos gains : <strong>Total MAD encaissé (Livrées)</strong>, chiffre d'affaires <strong>par jour</strong> (aujourd'hui, hier, etc.), chiffre d'affaires <strong>par semaine (7 jours)</strong> et <strong>par produit</strong> !
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-emerald-950/60 border border-emerald-500/30 p-2 rounded-lg">
                    <div className="text-[10px] text-emerald-300 font-bold">💰 Total Encaissé</div>
                    <div className="text-xs font-extrabold text-emerald-100">MAD Livré en poche</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <div className="text-[10px] text-rose-200">📅 Gains / Jour</div>
                    <div className="text-xs font-bold">Aujourd'hui & 7j</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <div className="text-[10px] text-rose-200">📈 Total Semaine</div>
                    <div className="text-xs font-bold">7 derniers jours</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <div className="text-[10px] text-rose-200">🏷️ CA par Produit</div>
                    <div className="text-xs font-bold">Bandeau, Visière...</div>
                  </div>
                </div>
              </div>

              {/* 2 Status columns highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                    <span>📌</span>
                    <span>Colonne L : Statut commande</span>
                  </div>
                  <p className="text-[11px] text-blue-800">Menu déroulant automatique :</p>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">Nouveau</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Confirmé</span>
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">Injoignable</span>
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[10px]">Annulé</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <div className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                    <span>🚚</span>
                    <span>Colonne M : Statut livraison</span>
                  </div>
                  <p className="text-[11px] text-amber-800">Menu déroulant automatique :</p>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">En attente</span>
                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded font-semibold text-[10px]">En préparation</span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">Expédié</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Livré</span>
                    <span className="px-1.5 py-0.5 bg-pink-100 text-pink-800 rounded font-semibold text-[10px]">Retour</span>
                  </div>
                </div>
              </div>

              {/* Column details table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <div className="bg-[#7A283B] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Les 14 Colonnes de chaque feuille produit :</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal">14 Colonnes ordonnées</span>
                </div>
                <div className="divide-y divide-neutral-100 text-xs">
                  {[
                    { col: 'A', name: 'Date', example: '22/09/2026 15:30' },
                    { col: 'B', name: 'N° commande', example: 'ORYVEN-MA-482910' },
                    { col: 'C', name: 'Nom complet', example: 'Kawtar Benjelloun' },
                    { col: 'D', name: 'Téléphone', example: '0661234567' },
                    { col: 'E', name: 'Ville', example: 'Casablanca' },
                    { col: 'F', name: 'Adresse', example: '12 Boulevard d’Anfa, Gauthier' },
                    { col: 'G', name: 'Produit', example: 'Oryven Yoga Headband' },
                    { col: 'H', name: 'Formule / Offre', example: 'Duo Collection (2 Bandeaux)' },
                    { col: 'I', name: 'Quantité', example: '2' },
                    { col: 'J', name: 'Variantes / Couleurs', example: '1x Lavande Glacée, 1x Bleu Ciel' },
                    { col: 'K', name: 'Prix Total (DH)', example: '289 DH' },
                    { col: 'L', name: 'Statut commande', example: 'Nouveau (Menu déroulant)' },
                    { col: 'M', name: 'Statut livraison', example: 'En attente (Menu déroulant)' },
                    { col: 'N', name: 'Confirmation WhatsApp', example: '=HYPERLINK("https://wa.me/212661234567?text=" & ENCODEURL(...), "📱 Confirmer sur WhatsApp")' },
                  ].map((c) => (
                    <div key={c.col} className="px-3.5 py-1.5 flex items-center justify-between gap-2 hover:bg-neutral-50">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-200 font-bold text-[10px] flex items-center justify-center text-neutral-700">
                          {c.col}
                        </span>
                        <span className={`font-bold ${c.col === 'L' || c.col === 'M' ? 'text-[#7A283B]' : 'text-neutral-800'}`}>
                          {c.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-500 truncate max-w-[260px] text-right">
                        {c.example}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Advice Box */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle size={15} className="text-amber-700 shrink-0" />
                  <span>Conseil de mise à niveau :</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Pour profiter de ce nouveau système à 14 colonnes et du <strong>Tableau de bord</strong>, collez le nouveau code dans votre éditeur Apps Script, enregistrez et déployez. Supprimez ensuite vos anciennes feuilles (ou lancez le bouton de test) pour laisser le script recréer automatiquement le <strong>Tableau de bord</strong> et les 5 feuilles propres avec leurs menus déroulants !
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-neutral-500">
            Oryven Maroc • Passerelle Google Sheets
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
