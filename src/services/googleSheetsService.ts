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
    `C'est l'équipe Oryven Maroc concernant votre commande #${order.orderId}.\n\n` +
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

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
  const waFormula = `=HYPERLINK("${waUrl}"; "📱 Confirmer sur WhatsApp")`;

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
 * Données d'exemple pour initialiser les 5 feuilles lors d'une commande de test
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

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
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
      message: '5 commandes de test envoyées avec succès ! Les 5 feuilles vont être créées avec les colonnes détaillées.',
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      message: error instanceof Error ? error.message : 'Erreur lors de l’envoi des tests',
    };
  }
}

/**
 * Code source complet du script Google Apps Script (Code.gs)
 * prêt à être copié-collé par l'administrateur de la boutique dans Google Sheets.
 */
export const APPS_SCRIPT_CODE_TEMPLATE = `/**
 * ==============================================================================
 * 🌸 ORYVEN MAROC - GOOGLE APPS SCRIPT WEBHOOK AUTOMATIQUE (VERSION DÉTAILLÉE)
 * ==============================================================================
 * Ce script reçoit les commandes en temps réel depuis le site Oryven et les classe
 * automatiquement dans la feuille dédiée au produit commandé :
 *   1. Bandeau
 *   2. Visière
 *   3. Tote Bag
 *   4. Chaussettes
 *   5. Pack 4 Produits
 *
 * ✨ CRÉATION AUTOMATIQUE :
 * Si la feuille du produit n'existe pas encore dans votre classeur Google Sheet,
 * elle est créée automatiquement avec ses 12 colonnes distinctes et son design bordeaux Oryven !
 *
 * 📋 LES 12 COLONNES CRÉÉES DANS CHAQUE FEUILLE :
 *   1. Date
 *   2. N° commande
 *   3. Nom complet
 *   4. Téléphone
 *   5. Ville
 *   6. Adresse
 *   7. Produit
 *   8. Formule / Offre
 *   9. Quantité
 *   10. Variantes / Couleurs
 *   11. Prix Total (DH)
 *   12. Confirmation WhatsApp (Lien cliquable avec message pré-rempli)
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Verrouillage pour éviter les conflits lors de commandes simultanées
  lock.tryLock(10000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Aucune donnée reçue (payload vide)"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    // Support d'une commande unique ou d'une liste de commandes (test multi-feuilles)
    var orders = Array.isArray(data) ? data : [data];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var results = [];

    for (var i = 0; i < orders.length; i++) {
      var order = orders[i];
      var sheetName = determineSheetName(order);
      var sheet = ss.getSheetByName(sheetName);

      // 1. Création automatique de la feuille si elle n'existe pas encore
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        setupSheetHeaders(sheet);
      } else {
        // Si la feuille est totalement vide ou n'a que l'ancien en-tête à 8 colonnes
        if (sheet.getLastRow() === 0) {
          setupSheetHeaders(sheet);
        } else if (sheet.getLastRow() === 1 && sheet.getLastColumn() <= 8) {
          // Mise à niveau automatique des en-têtes si la feuille n'a qu'une seule ligne
          sheet.clear();
          setupSheetHeaders(sheet);
        }
      }

      // 2. Formatage du numéro de téléphone marocain (+212)
      var cleanPhone = formatMoroccanPhone(order.phone);

      // 3. Message de confirmation WhatsApp pré-rempli
      var waMsg = order.whatsappMessage || generateWhatsAppMsg(order);
      var waUrl = "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(waMsg);

      // Formule Google Sheets HYPERLINK pour clic direct
      var waFormula = '=HYPERLINK("' + waUrl + '"; "📱 Confirmer sur WhatsApp")';

      // 4. Extraction détaillée des colonnes produits
      var prodName = order.productName || extractProductName(order);
      var offer = order.offerTitle || extractOfferTitle(order);
      var qty = order.quantity || extractQuantity(order);
      var variants = order.variants || extractVariants(order);
      var priceFormatted = (order.totalAmount != null ? order.totalAmount + " DH" : "");

      // 5. Construction de la ligne avec les 12 colonnes détaillées :
      var rowData = [
        order.date || Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm"),
        order.orderId || "",
        order.fullName || "",
        order.phone ? "'" + order.phone : "",
        order.city || "",
        order.address || "",
        prodName,
        offer,
        qty,
        variants,
        priceFormatted,
        waFormula
      ];

      sheet.appendRow(rowData);
      var lastRow = sheet.getLastRow();

      // Styliser la ligne insérée
      var dataRange = sheet.getRange(lastRow, 1, 1, 12);
      dataRange.setVerticalAlignment("middle");
      dataRange.setFontFamily("Arial");
      dataRange.setFontSize(10);
      dataRange.setWrap(true);

      // Alignements spécifiques pour une lecture fluide
      sheet.getRange(lastRow, 9).setHorizontalAlignment("center"); // Quantité
      sheet.getRange(lastRow, 11).setHorizontalAlignment("center"); // Prix
      sheet.getRange(lastRow, 11).setFontWeight("bold");

      // Mettre en évidence la cellule WhatsApp en vert doux
      var waCell = sheet.getRange(lastRow, 12);
      waCell.setBackground("#E8F5E9");
      waCell.setFontColor("#1B5E20");
      waCell.setFontWeight("bold");
      waCell.setHorizontalAlignment("center");

      results.push({
        orderId: order.orderId,
        sheet: sheetName,
        success: true
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Commande(s) enregistrée(s) avec succès dans Google Sheets",
      results: results
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Configure la ligne d'en-tête avec les 12 colonnes distinctes et fixe les largeurs
 */
function setupSheetHeaders(sheet) {
  var headers = [
    "Date",
    "N° commande",
    "Nom complet",
    "Téléphone",
    "Ville",
    "Adresse",
    "Produit",
    "Formule / Offre",
    "Quantité",
    "Variantes / Couleurs",
    "Prix Total (DH)",
    "Confirmation WhatsApp"
  ];

  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#7A283B"); // Marron bordeaux Oryven
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Arial");
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 40);

  // Figer la 1ère ligne pour garder les titres visibles lors du défilement
  sheet.setFrozenRows(1);

  // Largeurs optimisées des 12 colonnes
  sheet.setColumnWidth(1, 140); // Date
  sheet.setColumnWidth(2, 150); // N° commande
  sheet.setColumnWidth(3, 170); // Nom complet
  sheet.setColumnWidth(4, 130); // Téléphone
  sheet.setColumnWidth(5, 120); // Ville
  sheet.setColumnWidth(6, 220); // Adresse
  sheet.setColumnWidth(7, 180); // Produit
  sheet.setColumnWidth(8, 170); // Formule / Offre
  sheet.setColumnWidth(9, 90);  // Quantité
  sheet.setColumnWidth(10, 240); // Variantes / Couleurs
  sheet.setColumnWidth(11, 120); // Prix Total (DH)
  sheet.setColumnWidth(12, 220); // Confirmation WhatsApp
}

/**
 * Détermine le nom de la feuille dédiée selon le produit
 */
function determineSheetName(order) {
  if (order.sheetName && order.sheetName.trim()) {
    return order.sheetName.trim();
  }
  var str = ((order.productDetails || "") + " " + (order.productName || "") + " " + (order.productId || "")).toLowerCase();
  if (str.indexOf("pack") !== -1 || str.indexOf("4 produits") !== -1) return "Pack 4 Produits";
  if (str.indexOf("headband") !== -1 || str.indexOf("bandeau") !== -1) return "Bandeau";
  if (str.indexOf("visor") !== -1 || str.indexOf("visiere") !== -1 || str.indexOf("visière") !== -1) return "Visière";
  if (str.indexOf("tote") !== -1 || str.indexOf("sac") !== -1) return "Tote Bag";
  if (str.indexOf("sock") !== -1 || str.indexOf("chaussette") !== -1) return "Chaussettes";
  return "Pack 4 Produits";
}

/**
 * Fonctions d'extraction pour compatibilité ascendante si données composites
 */
function extractProductName(order) {
  if (order.productName) return order.productName;
  if (!order.productDetails) return "Produit Oryven";
  var bracketIdx = order.productDetails.indexOf("[");
  if (bracketIdx !== -1) {
    return order.productDetails.substring(0, bracketIdx).trim();
  }
  var dashIdx = order.productDetails.indexOf("-");
  if (dashIdx !== -1) {
    return order.productDetails.substring(0, dashIdx).trim();
  }
  return order.productDetails;
}

function extractOfferTitle(order) {
  if (order.offerTitle) return order.offerTitle;
  if (!order.productDetails) return "Solo";
  var m = order.productDetails.match(/\\[(.*?)\\]/);
  if (m && m[1]) {
    return m[1].replace(/Offre:\\s*/i, "").trim();
  }
  return "Solo";
}

function extractQuantity(order) {
  if (order.quantity) return order.quantity;
  if (!order.productDetails) return 1;
  var m = order.productDetails.match(/\\(Qté:\\s*(\\d+)\\)/i);
  if (m && m[1]) return parseInt(m[1], 10);
  if (order.productDetails.toLowerCase().indexOf("duo") !== -1) return 2;
  if (order.productDetails.toLowerCase().indexOf("trio") !== -1) return 3;
  if (order.productDetails.toLowerCase().indexOf("4 produits") !== -1 || order.productDetails.toLowerCase().indexOf("pack complet") !== -1) return 4;
  return 1;
}

function extractVariants(order) {
  if (order.variants) return order.variants;
  if (!order.productDetails) return "-";
  var varIdx = order.productDetails.indexOf("Variantes :");
  if (varIdx !== -1) {
    return order.productDetails.substring(varIdx + 11).trim();
  }
  var colIdx = order.productDetails.indexOf("Couleur :");
  if (colIdx !== -1) {
    return order.productDetails.substring(colIdx + 9).trim();
  }
  return "-";
}

/**
 * Nettoyage et formatage du numéro marocain pour WhatsApp
 */
function formatMoroccanPhone(phone) {
  if (!phone) return "";
  var clean = ("" + phone).replace(/[^0-9]/g, "");
  if (clean.indexOf("0") === 0) {
    clean = "212" + clean.substring(1);
  } else if (clean.indexOf("212") !== 0) {
    clean = "212" + clean;
  }
  return clean;
}

/**
 * Génère le message WhatsApp pré-rempli
 */
function generateWhatsAppMsg(order) {
  var details = order.productDetails;
  if (!details) {
    var p = order.productName || "Produit Oryven";
    var o = order.offerTitle ? " [" + order.offerTitle + "]" : "";
    var v = order.variants ? " - " + order.variants : "";
    details = p + o + v;
  }
  return "Bonjour " + (order.fullName || "cher(e) client(e)") + " ! 🌿\\n\\n" +
    "C'est l'équipe Oryven Maroc concernant votre commande #" + (order.orderId || "") + ".\\n\\n" +
    "📦 Commande : " + details + "\\n" +
    "💰 Montant total : " + (order.totalAmount ? order.totalAmount + " MAD" : "Paiement à la livraison") + "\\n" +
    "📍 Adresse de livraison : " + (order.address || "") + ", " + (order.city || "") + "\\n\\n" +
    "Pouvez-vous s'il vous plaît nous confirmer cette commande afin de programmer l'expédition dès aujourd'hui ?\\n" +
    "Merci pour votre confiance ! ✨";
}

/**
 * Fonction de test manuelle exécutable directement depuis l'éditeur Apps Script
 */
function testerCreationFeuilles() {
  var e = {
    postData: {
      contents: JSON.stringify([
        {
          sheetName: "Bandeau",
          orderId: "TEST-001",
          fullName: "Sara Alami (Test)",
          phone: "0661112233",
          city: "Casablanca",
          address: "Gauthier",
          productName: "Oryven Yoga Headband",
          offerTitle: "Duo Collection (2 Bandeaux)",
          quantity: 2,
          variants: "1x Lavande Glacée, 1x Bleu Ciel",
          totalAmount: 289
        },
        {
          sheetName: "Visière",
          orderId: "TEST-002",
          fullName: "Lina Berrada (Test)",
          phone: "0662223344",
          city: "Rabat",
          address: "Agdal",
          productName: "Oryven Visor UPF 50+",
          offerTitle: "Solo (1 Visière)",
          quantity: 1,
          variants: "Bleu Glacier",
          totalAmount: 199
        },
        {
          sheetName: "Tote Bag",
          orderId: "TEST-003",
          fullName: "Ghita Bennani (Test)",
          phone: "0663334455",
          city: "Marrakech",
          address: "Guéliz",
          productName: "Oryven Tote Bag 28L",
          offerTitle: "Pack Solo (1 Sac)",
          quantity: 1,
          variants: "Toile Écru Naturelle",
          totalAmount: 349
        },
        {
          sheetName: "Chaussettes",
          orderId: "TEST-004",
          fullName: "Yasmine Tazi (Test)",
          phone: "0664445566",
          city: "Tanger",
          address: "Malabata",
          productName: "Oryven Non-Slip Grip Socks",
          offerTitle: "Duo (2 Paires)",
          quantity: 2,
          variants: "1x Blanc Studio, 1x Noir Onyx",
          totalAmount: 179
        },
        {
          sheetName: "Pack 4 Produits",
          orderId: "TEST-005",
          fullName: "Kawtar Fassi (Test)",
          phone: "0665556677",
          city: "Casablanca",
          address: "Anfa",
          productName: "Pack Complet Oryven (4 Produits)",
          offerTitle: "Pack Solo Essentiels",
          quantity: 4,
          variants: "Visière: Noir Intense, Sac: Écru, 1er Bandeau: Bleu Ciel, 2ème Bandeau: Lavande Glacée",
          totalAmount: 590
        }
      ])
    }
  };
  doPost(e);
}
`;
