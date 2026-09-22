import { CustomerOrder } from '../types';

export const STORAGE_KEY_APPS_SCRIPT_URL = 'oryven_apps_script_url';
export const STORAGE_KEY_ORDERS_HISTORY = 'oryven_orders_history';

/**
 * URL de production par défaut du Webhook Google Apps Script.
 * Si un client commande depuis son smartphone, cette URL sera utilisée automatiquement.
 */
export const DEFAULT_PRODUCTION_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbx-ivdfcNdRAA2-W20ZDxehYohxfqUadGZLCMxy6HcHiHGs0GGuv9UAM-kfUzqxwgZVfQ/exec';

/**
 * Récupère l'URL Web App Google Apps Script :
 * 1. Vérifie si une URL personnalisée a été enregistrée en local (Dashboard admin)
 * 2. Vérifie la variable d'environnement Vercel (VITE_GOOGLE_APPS_SCRIPT_URL)
 * 3. Utilise l'URL de production par défaut
 */
export function getAppsScriptUrl(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY_APPS_SCRIPT_URL);
    if (local && local.trim()) return local.trim();
  }
  const envUrl = (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string) || '';
  if (envUrl && envUrl.trim()) return envUrl.trim();

  return DEFAULT_PRODUCTION_WEBHOOK_URL;
}

/**
 * Enregistre l'URL Web App Google Apps Script
 */
export function setAppsScriptUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_APPS_SCRIPT_URL, url.trim());
  }
}

/**
 * Détermine le nom de la feuille dédiée selon le produit commandé
 * - Bandeau
 * - Visière
 * - Tote Bag
 * - Chaussettes
 * - Pack 4 Produits
 */
export function getProductSheetName(productIdOrName: string): string {
  const norm = (productIdOrName || '').toLowerCase();
  if (norm.includes('pack') || norm.includes('4')) return 'Pack 4 Produits';
  if (norm.includes('headband') || norm.includes('bandeau')) return 'Bandeau';
  if (norm.includes('visor') || norm.includes('visiere') || norm.includes('visière')) return 'Visière';
  if (norm.includes('tote') || norm.includes('sac')) return 'Tote Bag';
  if (norm.includes('sock') || norm.includes('chaussette')) return 'Chaussettes';
  return 'Pack 4 Produits';
}

/**
 * Formate le numéro de téléphone pour WhatsApp (+212 pour le Maroc)
 */
export function formatMoroccanPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '212' + cleaned.substring(1);
  } else if (!cleaned.startsWith('212')) {
    cleaned = '212' + cleaned;
  }
  return cleaned;
}

/**
 * Génère le message WhatsApp pré-rempli avec les informations du client
 */
export function generateWhatsAppConfirmationMessage(order: {
  fullName: string;
  orderId: string;
  productDetails: string;
  totalAmount: number;
  city: string;
  address: string;
}): string {
  return (
    `Bonjour ${order.fullName || 'cher(e) client(e)'} ! 🌿\n\n` +
    `C'est l'équipe Oryven Maroc concernant votre commande N° ${order.orderId}.\n\n` +
    `📦 Commande : ${order.productDetails}\n` +
    `💰 Montant total : ${order.totalAmount} MAD (Paiement à la livraison)\n` +
    `📍 Adresse de livraison : ${order.address}, ${order.city}\n\n` +
    `Pouvez-vous s'il vous plaît nous confirmer cette commande afin de programmer l'expédition dès aujourd'hui ?\n` +
    `Merci pour votre confiance ! ✨`
  );
}

/**
 * Formate les détails textuels complets du produit commandé
 */
export function formatOrderProductDetails(order: CustomerOrder): string {
  if (!order.items || order.items.length === 0) return 'Détails non spécifiés';
  
  return order.items
    .map((item) => {
      const pName = item.product?.name || 'Produit Oryven';
      const oTitle = item.offer?.title ? ` [Offre: ${item.offer.title}]` : '';
      const colors =
        item.customColors && item.customColors.length > 0
          ? ` - Variantes : ${item.customColors.join(', ')}`
          : item.selectedColor?.name
          ? ` - Couleur : ${item.selectedColor.name}`
          : '';
      const qty = item.quantity > 1 ? ` (Qté: ${item.quantity})` : '';
      return `${pName}${oTitle}${colors}${qty}`;
    })
    .join(' | ');
}

/**
 * Payload envoyé au script Google Apps Script
 */
export interface GoogleSheetOrderPayload {
  sheetName: string;
  date: string;
  orderId: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  productName: string;
  offerTitle: string;
  quantity: number;
  variants: string;
  totalAmount: number;
  productDetails: string;
  orderStatus: string;
  deliveryStatus: string;
  whatsappMessage: string;
  whatsappUrl: string;
  whatsappFormula: string;
  notes?: string;
  isTest?: boolean;
}

/**
 * Prépare le payload pour une commande donnée
 */
export function buildGoogleSheetPayload(order: CustomerOrder, isTest = false): GoogleSheetOrderPayload {
  const firstItem = order.items?.[0];
  const prodIdentifier = firstItem?.product?.id || firstItem?.product?.slug || firstItem?.product?.name || '';
  const sheetName = getProductSheetName(prodIdentifier);

  const productName = firstItem?.product?.name || 'Produit Oryven';
  const offerTitle = firstItem?.offer?.title || (firstItem?.quantity && firstItem.quantity > 1 ? `Quantité : ${firstItem.quantity}` : 'Solo');
  const quantity = firstItem?.offer?.quantity || firstItem?.quantity || 1;

  let variants = '-';
  if (firstItem?.customColors && firstItem.customColors.length > 0) {
    variants = firstItem.customColors.join(', ');
  } else if (firstItem?.selectedColor?.name) {
    variants = firstItem.selectedColor.name;
  }

  const productDetails = formatOrderProductDetails(order);

  // Date locale formatée JJ/MM/AAAA HH:mm
  const dateObj = order.createdAt ? new Date(order.createdAt) : new Date();
  const dateStr = dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const cleanPhone = formatMoroccanPhoneForWhatsApp(order.phone);
  const waMsg = generateWhatsAppConfirmationMessage({
    fullName: order.fullName,
    orderId: order.orderId,
    productDetails,
    totalAmount: order.totalAmount,
    city: order.city,
    address: order.address,
  });

  const escapeFormulaText = (str: string) => (str || '').replace(/"/g, '""').replace(/\r?\n/g, ' ');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
  const waLines = [
    `"Bonjour ${escapeFormulaText(order.fullName || 'cher(e) client(e)')} ! 🌿"`,
    'CHAR(10)',
    'CHAR(10)',
    `"C'est l'équipe Oryven Maroc concernant votre commande N° ${escapeFormulaText(order.orderId)}."`,
    'CHAR(10)',
    'CHAR(10)',
    `"📦 Commande : ${escapeFormulaText(productName)} [${escapeFormulaText(offerTitle)}] - Variantes : ${escapeFormulaText(variants)}"`,
    'CHAR(10)',
    `"💰 Montant total : ${order.totalAmount} MAD (Paiement à la livraison)"`,
    'CHAR(10)',
    `"📍 Adresse de livraison : ${escapeFormulaText(order.address || '')}, ${escapeFormulaText(order.city || '')}"`,
    'CHAR(10)',
    'CHAR(10)',
    `"Pouvez-vous s'il vous plaît nous confirmer cette commande afin de programmer l'expédition dès aujourd'hui ?"`,
    'CHAR(10)',
    `"Merci pour votre confiance ! ✨"`,
  ];
  const waFormula = `=HYPERLINK("https://api.whatsapp.com/send?phone=${cleanPhone}&text=" & ENCODEURL(${waLines.join(' & ')}); "📱 Confirmer sur WhatsApp")`;

  return {
    sheetName,
    date: dateStr,
    orderId: order.orderId,
    fullName: order.fullName,
    phone: order.phone,
    city: order.city,
    address: order.address,
    productName,
    offerTitle,
    quantity,
    variants,
    totalAmount: order.totalAmount,
    productDetails,
    orderStatus: 'Nouveau',
    deliveryStatus: 'En attente',
    whatsappMessage: waMsg,
    whatsappUrl: waUrl,
    whatsappFormula: waFormula,
    notes: order.notes || '',
    isTest,
  };
}

/**
 * Envoie la commande au Webhook Google Apps Script
 */
export async function sendOrderToGoogleSheets(
  order: CustomerOrder,
  customUrl?: string,
  isTest = false
): Promise<{ success: boolean; message: string; sheetName: string }> {
  const url = (customUrl || getAppsScriptUrl()).trim();
  const payload = buildGoogleSheetPayload(order, isTest);

  // Sauvegarde locale dans l'historique
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS_HISTORY) || '[]');
    existing.unshift({
      ...payload,
      sentToSheets: Boolean(url),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY_ORDERS_HISTORY, JSON.stringify(existing.slice(0, 100)));
  } catch {
    // Ignore storage issues
  }

  if (!url) {
    return {
      success: false,
      message: 'URL Google Apps Script non configurée. La commande est sauvegardée localement.',
      sheetName: payload.sheetName,
    };
  }

  try {
    // Envoi en mode 'no-cors' avec 'text/plain' pour compatibilité totale avec les Web Apps Google Apps Script
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: `Commande #${order.orderId} synchronisée avec succès dans la feuille "${payload.sheetName}"`,
      sheetName: payload.sheetName,
    };
  } catch (error) {
    console.error('Erreur lors de la synchronisation Google Sheets:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur de transmission',
      sheetName: payload.sheetName,
    };
  }
}

/**
 * Données d'exemple pour initialiser les feuilles lors d'une commande de test
 */
export function getTestOrdersForAllSheets(): GoogleSheetOrderPayload[] {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const productsConfig = [
    {
      sheetName: 'Bandeau',
      productName: 'Oryven Yoga Headband',
      offerTitle: 'Duo Collection (2 Bandeaux)',
      quantity: 2,
      variants: '1x Lavande Glacée, 1x Bleu Ciel',
      total: 289,
    },
    {
      sheetName: 'Visière',
      productName: 'Oryven Visor UPF 50+',
      offerTitle: 'Solo (1 Visière)',
      quantity: 1,
      variants: '1x Bleu Glacier',
      total: 199,
    },
    {
      sheetName: 'Tote Bag',
      productName: 'Oryven Tote Bag 28L',
      offerTitle: 'Pack Solo (1 Sac)',
      quantity: 1,
      variants: '1x Toile Écru Naturelle',
      total: 349,
    },
    {
      sheetName: 'Chaussettes',
      productName: 'Oryven Non-Slip Grip Socks',
      offerTitle: 'Duo (2 Paires)',
      quantity: 2,
      variants: '1x Blanc Studio, 1x Noir Onyx',
      total: 179,
    },
    {
      sheetName: 'Pack 4 Produits',
      productName: 'Pack Complet Oryven (4 Produits)',
      offerTitle: 'Pack Solo Essentiels',
      quantity: 4,
      variants: 'Visière: Noir Intense, Sac: Écru, 1er Bandeau: Bleu Ciel, 2ème Bandeau: Lavande Glacée',
      total: 590,
    },
  ];

  return productsConfig.map((item, idx) => {
    const orderId = `TEST-ORYVEN-00${idx + 1}`;
    const fullName = 'Kawtar Benjelloun (Test)';
    const phone = '0661234567';
    const city = 'Casablanca';
    const address = '12 Boulevard d’Anfa, Étage 3, Gauthier';
    const cleanPhone = '212661234567';
    const productDetails = `${item.productName} [${item.offerTitle}] - Variantes : ${item.variants}`;

    const waMsg = generateWhatsAppConfirmationMessage({
      fullName,
      orderId,
      productDetails,
      totalAmount: item.total,
      city,
      address,
    });

    const encodedMsg = encodeURIComponent(waMsg);
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
    const waFormula = `=HYPERLINK("${waUrl}"; "📱 Confirmer sur WhatsApp")`;

    return {
      sheetName: item.sheetName,
      date: dateStr,
      orderId,
      fullName,
      phone,
      city,
      address,
      productName: item.productName,
      offerTitle: item.offerTitle,
      quantity: item.quantity,
      variants: item.variants,
      totalAmount: item.total,
      productDetails,
      orderStatus: 'Nouveau',
      deliveryStatus: 'En attente',
      whatsappMessage: waMsg,
      whatsappUrl: waUrl,
      whatsappFormula: waFormula,
      notes: 'Commande de test automatique pour initialiser la feuille',
      isTest: true,
    };
  });
}

/**
 * Envoie une commande de test pour chacune des 5 feuilles afin de les créer automatiquement
 */
export async function sendTestOrdersForAllProducts(
  customUrl?: string
): Promise<{ success: boolean; count: number; message: string }> {
  const url = (customUrl || getAppsScriptUrl()).trim();
  if (!url) {
    return {
      success: false,
      count: 0,
      message: 'Veuillez renseigner votre URL Google Apps Script avant de lancer le test.',
    };
  }

  const testOrders = getTestOrdersForAllSheets();

  try {
    // On envoie le tableau complet des 5 commandes au script
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(testOrders),
    });

    return {
      success: true,
      count: testOrders.length,
      message: '5 commandes de test envoyées avec succès ! Les feuilles produits et le Tableau de bord vont être créés.',
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      message: error instanceof Error ? error.message : 'Erreur lors de l’envoi des tests',
    };
  }
}

// Ré-exporte le code template Apps Script
export { APPS_SCRIPT_CODE_TEMPLATE } from './appsScriptTemplate';
