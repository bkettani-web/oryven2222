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
                  Google Sheets App Script
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
                Réception automatique des commandes sur 5 feuilles dédiées par produit
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
              3. Feuilles & Colonnes
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
                      ? 'Toutes les nouvelles commandes passées sur la boutique sont envoyées directement vers votre Google Sheet dans l’onglet dédié du produit.'
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
                      <span>Création automatique des 5 feuilles de commande</span>
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      En cliquant ci-dessous, le système envoie immédiatement une commande de test pour
                      chacun des 5 produits. Le script va <strong>créer automatiquement les 5 onglets</strong> s'ils
                      n'existent pas encore dans votre Google Sheet avec les en-têtes et le bouton de confirmation WhatsApp !
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
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
                    className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Envoi des 5 commandes de test en cours...</span>
                      </>
                    ) : (
                      <>
                        <Play size={15} />
                        <span>Passer la commande de test (Initialiser les 5 feuilles)</span>
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
                          Consultez dès maintenant votre Google Sheet : vous y verrez les onglets créés
                          avec les colonnes formatées et le lien WhatsApp pré-rempli !
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
                  <span>Comment récupérer l'URL Apps Script en 3 étapes :</span>
                </h5>
                <ol className="text-xs text-neutral-600 space-y-1.5 list-decimal pl-4 leading-relaxed">
                  <li>Ouvrez votre Google Sheet, allez dans <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>Copiez-collez le code fourni dans l'onglet <strong>« 2. Code Apps Script »</strong>.</li>
                  <li>
                    Cliquez sur <strong>Déployer &gt; Nouveau déploiement</strong>, sélectionnez le type{' '}
                    <strong>Application Web</strong>, choisissez <em>« Qui a accès : Tout le monde »</em>, puis collez l'URL fournie ici.
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
                    Copiez l'intégralité de ce code et remplacez le contenu de votre éditeur Apps Script.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
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
                  Dans la fenêtre de déploiement Google Apps Script :
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
                  Structure des 5 feuilles et colonnes générées
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Conformément à votre demande, chaque produit dispose de sa feuille dédiée avec les 8 colonnes exactes.
                </p>
              </div>

              {/* 5 Sheets display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { name: 'Bandeau', desc: 'Commandes du Oryven Yoga Headband (Solo & Packs Duo/Trio)', color: 'bg-indigo-50 border-indigo-200 text-indigo-900' },
                  { name: 'Visière', desc: 'Commandes de la Visière Sport Oryven UPF 50+', color: 'bg-sky-50 border-sky-200 text-sky-900' },
                  { name: 'Tote Bag', desc: 'Commandes du Sac Oryven Tote Bag 28L', color: 'bg-amber-50 border-amber-200 text-amber-900' },
                  { name: 'Chaussettes', desc: 'Commandes des chaussettes antidérapantes Non-Slip Grip Socks', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
                  { name: 'Pack 4 Produits', desc: 'Commandes du Pack Complet Oryven (Sac + Visière + 2 Bandeaux)', color: 'bg-rose-50 border-rose-200 text-rose-900' },
                ].map((s) => (
                  <div key={s.name} className={`p-3 rounded-xl border ${s.color} space-y-1`}>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <FileSpreadsheet size={14} />
                      <span>Feuille « {s.name} »</span>
                    </div>
                    <p className="text-[11px] opacity-80">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Column details table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <div className="bg-[#7A283B] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Les 12 Colonnes détaillées de chaque feuille :</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal">Colonnes séparées</span>
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
                    { col: 'L', name: 'Confirmation WhatsApp', example: '=HYPERLINK("https://wa.me/212661234567?text=Bonjour...", "📱 Confirmer sur WhatsApp")' },
                  ].map((c) => (
                    <div key={c.col} className="px-3.5 py-1.5 flex items-center justify-between gap-2 hover:bg-neutral-50">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-200 font-bold text-[10px] flex items-center justify-center text-neutral-700">
                          {c.col}
                        </span>
                        <span className="font-bold text-neutral-800">{c.name}</span>
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
                  <span>Dois-je supprimer les feuilles existantes dans Google Sheets ?</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  <strong>Oui, c'est vivement conseillé !</strong> Supprimez simplement vos feuilles actuelles (comme <em>Bandeau</em>, <em>Visière</em>, etc.) dans votre classeur Google Sheets. Dès que vous collez le nouveau script et recevez une commande ou lancez le test, les feuilles sont <strong>recréées automatiquement à neuf avec ces 12 colonnes propres</strong>.
                </p>
              </div>

              {/* WhatsApp explanation */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span>Formule cliquable WhatsApp directe</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Dans la colonne <strong>Confirmation WhatsApp</strong>, le script génère un lien cliquable{' '}
                  <code className="bg-white px-1 py-0.5 rounded border border-emerald-200 text-emerald-800 font-mono text-[10px]">
                    =HYPERLINK(...)
                  </code>{' '}
                  contenant un message WhatsApp pré-rempli avec le nom, le numéro de commande, le détail des articles commandés, la ville et l'adresse. Un simple clic dans votre feuille ouvre instantanément la conversation avec le client !
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
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
