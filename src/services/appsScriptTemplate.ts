/**
 * Template de script Google Apps Script (Code.gs)
 * Version enrichie avec :
 *   ✅ Suivi financier complet en MAD (CA Livré encaissé, CA par jour, CA par semaine, CA par produit)
 *   ✅ Tableau de bord en direct SANS #ERROR! avec calculs dynamiques
 *   ✅ Compatibilité WhatsApp mobile (iOS & Android) et desktop via api.whatsapp.com
 *   ✅ Déclencheur onEdit(e) automatique et coloration intelligente des statuts
 */
export const APPS_SCRIPT_CODE_TEMPLATE = `/**
 * ==============================================================================
 * 🌸 ORYVEN MAROC - GOOGLE APPS SCRIPT WEBHOOK AUTOMATIQUE & DASHBOARD FINANCIER
 * ==============================================================================
 * Ce script reçoit les commandes en temps réel depuis le site Oryven, les classe
 * automatiquement dans les feuilles dédiées aux produits, et met à jour en direct
 * un TABLEAU DE BORD complet avec KPIs de volume et INDICATEURS FINANCIERS EN MAD :
 *
 * 💰 NOUVEAU - INDICATEURS FINANCIERS EN MAD :
 *   - Total MAD encaissé (Commandes Livrées)
 *   - Total MAD en cours de livraison (Expédié / En préparation)
 *   - Total MAD confirmé potentiel
 *   - Chiffre d'affaires livré PAR JOUR (Aujourd'hui, Hier, J-2... J-6)
 *   - Chiffre d'affaires livré PAR SEMAINE (Total 7 jours)
 *   - Chiffre d'affaires livré PAR PRODUIT (pour savoir quel produit rapporte le plus)
 *
 * 📱 NOUVEAU - COMPATIBILITÉ WHATSAPP MOBILE & DESKTOP :
 *   - Compatible smartphones (iPhone iOS & Android) et ordinateurs
 *   - Pas de code %20 ni %0A : texte propre avec sauts de ligne et émojis
 *
 * 📑 FEUILLES GÉRÉES AUTOMATIQUEMENT :
 *   📊 Tableau de bord (Onglet principal avec KPIs financiers & volume en direct)
 *   1. Bandeau
 *   2. Visière
 *   3. Tote Bag
 *   4. Chaussettes
 *   5. Pack 4 Produits
 * ==============================================================================
 */

var PRODUCT_SHEETS = ["Bandeau", "Visière", "Tote Bag", "Chaussettes", "Pack 4 Produits"];

function doPost(e) {
  var lock = LockService.getScriptLock();
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

    // Support d'une commande unique ou d'une liste de commandes
    var orders = Array.isArray(data) ? data : [data];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var results = [];

    // S'assurer que le tableau de bord et les feuilles existent
    ensureAllSheetsAndDashboard(ss);

    for (var i = 0; i < orders.length; i++) {
      var order = orders[i];
      var sheetName = determineSheetName(order);
      var sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        setupSheetHeaders(sheet);
      } else {
        if (sheet.getLastRow() === 0) {
          setupSheetHeaders(sheet);
        } else if (sheet.getLastRow() === 1 && sheet.getLastColumn() <= 12) {
          sheet.clear();
          setupSheetHeaders(sheet);
        }
      }

      // Formatage du numéro de téléphone marocain (+212)
      var cleanPhone = formatMoroccanPhone(order.phone);

      // Formule WhatsApp compatible mobile (iOS / Android) et desktop
      var waFormula = buildWhatsAppFormula(cleanPhone, order);

      // Extraction détaillée des colonnes
      var prodName = order.productName || extractProductName(order);
      var offer = order.offerTitle || extractOfferTitle(order);
      var qty = order.quantity || extractQuantity(order);
      var variants = order.variants || extractVariants(order);
      var priceFormatted = (order.totalAmount != null ? order.totalAmount + " DH" : "");
      var orderStatus = order.orderStatus || "Nouveau";
      var deliveryStatus = order.deliveryStatus || "En attente";

      // 14 colonnes ordonnées
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
        orderStatus,
        deliveryStatus,
        waFormula
      ];

      sheet.appendRow(rowData);
      var lastRow = sheet.getLastRow();

      // Styliser la ligne insérée
      var dataRange = sheet.getRange(lastRow, 1, 1, 14);
      dataRange.setVerticalAlignment("middle");
      dataRange.setFontFamily("Arial");
      dataRange.setFontSize(10);
      dataRange.setWrap(true);

      // Centrage quantité et prix
      sheet.getRange(lastRow, 9).setHorizontalAlignment("center");
      sheet.getRange(lastRow, 11).setHorizontalAlignment("center");
      sheet.getRange(lastRow, 11).setFontWeight("bold");

      // Menus déroulants et styles pour Statut commande & Statut livraison
      var orderStatusCell = sheet.getRange(lastRow, 12);
      orderStatusCell.setHorizontalAlignment("center");
      orderStatusCell.setFontWeight("bold");
      orderStatusCell.setBackground("#E3F2FD");
      orderStatusCell.setFontColor("#1565C0");

      var deliveryStatusCell = sheet.getRange(lastRow, 13);
      deliveryStatusCell.setHorizontalAlignment("center");
      deliveryStatusCell.setFontWeight("bold");
      deliveryStatusCell.setBackground("#FFF8E1");
      deliveryStatusCell.setFontColor("#F57F17");

      // Cellule WhatsApp
      var waCell = sheet.getRange(lastRow, 14);
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

    // Actualiser le Tableau de bord avec les données en direct et le CA en MAD
    updateDashboardLive(ss);

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
 * Configure la ligne d'en-tête avec les 14 colonnes distinctes et les listes déroulantes
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
    "Statut commande",
    "Statut livraison",
    "Confirmation WhatsApp"
  ];

  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#7A283B");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Arial");
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 40);

  // Figer la 1ère ligne
  sheet.setFrozenRows(1);

  // Largeurs optimisées des 14 colonnes
  sheet.setColumnWidth(1, 140);  // Date
  sheet.setColumnWidth(2, 150);  // N° commande
  sheet.setColumnWidth(3, 170);  // Nom complet
  sheet.setColumnWidth(4, 130);  // Téléphone
  sheet.setColumnWidth(5, 120);  // Ville
  sheet.setColumnWidth(6, 220);  // Adresse
  sheet.setColumnWidth(7, 180);  // Produit
  sheet.setColumnWidth(8, 170);  // Formule / Offre
  sheet.setColumnWidth(9, 90);   // Quantité
  sheet.setColumnWidth(10, 240); // Variantes / Couleurs
  sheet.setColumnWidth(11, 120); // Prix Total (DH)
  sheet.setColumnWidth(12, 155); // Statut commande
  sheet.setColumnWidth(13, 155); // Statut livraison
  sheet.setColumnWidth(14, 220); // Confirmation WhatsApp

  // Application des menus déroulants (Data Validation) sur toute la colonne
  var orderStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Nouveau", "Confirmé", "Injoignable", "Annulé"], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange("L2:L1000").setDataValidation(orderStatusRule);

  var deliveryStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["En attente", "En préparation", "Expédié", "Livré", "Retour"], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange("M2:M1000").setDataValidation(deliveryStatusRule);
}

/**
 * Construit la formule WhatsApp propre.
 * Utilise api.whatsapp.com/send qui est universellement reconnu par Android & iOS
 * pour ouvrir directement l'application WhatsApp sans passer par une page web intermédiaire.
 */
function buildWhatsAppFormula(cleanPhone, order) {
  var pName = order.productName || extractProductName(order);
  var offer = order.offerTitle || extractOfferTitle(order);
  var variants = order.variants || extractVariants(order);
  var amount = (order.totalAmount != null ? order.totalAmount + " MAD" : "Paiement à la livraison");
  var clientName = order.fullName || "cher(e) client(e)";
  var orderNum = order.orderId || "";
  var addr = (order.address || "") + (order.city ? ", " + order.city : "");

  var lines = [
    '"Bonjour ' + escapeFormulaText(clientName) + ' ! 🌿"',
    'CHAR(10)',
    'CHAR(10)',
    '"C\'est l\'équipe Oryven Maroc concernant votre commande N° ' + escapeFormulaText(orderNum) + '."',
    'CHAR(10)',
    'CHAR(10)',
    '"📦 Commande : ' + escapeFormulaText(pName) + ' [' + escapeFormulaText(offer) + '] - Variantes : ' + escapeFormulaText(variants) + '"',
    'CHAR(10)',
    '"💰 Montant total : ' + escapeFormulaText(amount) + ' (Paiement à la livraison)"',
    'CHAR(10)',
    '"📍 Adresse de livraison : ' + escapeFormulaText(addr) + '"',
    'CHAR(10)',
    'CHAR(10)',
    '"Pouvez-vous s\'il vous plaît nous confirmer cette commande afin de programmer l\'expédition dès aujourd\'hui ?"',
    'CHAR(10)',
    '"Merci pour votre confiance ! ✨"'
  ];

  return '=HYPERLINK("https://api.whatsapp.com/send?phone=' + cleanPhone + '&text=" & ENCODEURL(' + lines.join(" & ") + '); "📱 Confirmer sur WhatsApp")';
}

function escapeFormulaText(str) {
  if (!str) return "";
  return ("" + str).replace(/"/g, '""').replace(/\\r?\\n/g, ' ');
}

/**
 * Crée ou réinitialise le Tableau de bord avec indicateurs KPIs et calculs en direct
 */
function ensureAllSheetsAndDashboard(ss) {
  for (var i = 0; i < PRODUCT_SHEETS.length; i++) {
    var pSheet = ss.getSheetByName(PRODUCT_SHEETS[i]);
    if (!pSheet) {
      pSheet = ss.insertSheet(PRODUCT_SHEETS[i]);
      setupSheetHeaders(pSheet);
    }
  }

  var dash = ss.getSheetByName("Tableau de bord");
  if (!dash) {
    dash = ss.insertSheet("Tableau de bord", 0);
    buildDashboardSheet(dash);
  }
}

/**
 * Construit l'interface complète du Tableau de bord avec sections Volume et FINANCES (MAD)
 */
function buildDashboardSheet(sheet) {
  sheet.clear();
  sheet.setTabColor("#7A283B");
  sheet.setHiddenGridlines(false);

  // 1. En-tête Principal
  sheet.getRange("A1:N2").merge();
  var mainTitle = sheet.getRange("A1");
  mainTitle.setValue("🌸 ORYVEN MAROC — TABLEAU DE BORD COMMANDES & CHIFFRE D'AFFAIRES (MAD)");
  mainTitle.setBackground("#7A283B");
  mainTitle.setFontColor("#FFFFFF");
  mainTitle.setFontFamily("Arial");
  mainTitle.setFontSize(14);
  mainTitle.setFontWeight("bold");
  mainTitle.setHorizontalAlignment("center");
  mainTitle.setVerticalAlignment("middle");

  sheet.getRange("A3:N3").merge();
  var subTitle = sheet.getRange("A3");
  subTitle.setValue("⚡ Suivi automatique en direct • Chiffre d'affaires encaissé en MAD, colis du jour et de la semaine");
  subTitle.setBackground("#531B28");
  subTitle.setFontColor("#E0D2D6");
  subTitle.setFontFamily("Arial");
  subTitle.setFontSize(10);
  subTitle.setHorizontalAlignment("center");
  subTitle.setVerticalAlignment("middle");

  // 2. BLOCS KPI VOLUME (Lignes 5 à 7)
  var kpiConfigs = [
    { labelRange: "A5:B5", valRange: "A6:B7", label: "TOTAL COMMANDES", bg: "#F8F9FA", textCol: "#212529" },
    { labelRange: "C5:D5", valRange: "C6:D7", label: "COMMANDES CONFIRMÉES", bg: "#E8F5E9", textCol: "#2E7D32" },
    { labelRange: "E5:F5", valRange: "E6:F7", label: "COMMANDES LIVRÉES", bg: "#C8E6C9", textCol: "#1B5E20" },
    { labelRange: "G5:H5", valRange: "G6:H7", label: "EN COURS (PRÉPA / EXPÉDIÉ)", bg: "#E3F2FD", textCol: "#1565C0" },
    { labelRange: "I5:J5", valRange: "I6:J7", label: "ANNULÉES / INJOIGNABLE", bg: "#FFEBEE", textCol: "#C62828" },
    { labelRange: "K5:L5", valRange: "K6:L7", label: "RETOURS", bg: "#FCE4EC", textCol: "#AD1457" },
    { labelRange: "M5:N5", valRange: "M6:N7", label: "TAUX DE LIVRAISON", bg: "#EDE7F6", textCol: "#4527A0" }
  ];

  for (var k = 0; k < kpiConfigs.length; k++) {
    var item = kpiConfigs[k];
    sheet.getRange(item.labelRange).merge().setValue(item.label);
    var lbl = sheet.getRange(item.labelRange);
    lbl.setBackground(item.bg);
    lbl.setFontColor(item.textCol);
    lbl.setFontSize(8.5);
    lbl.setFontWeight("bold");
    lbl.setHorizontalAlignment("center");
    lbl.setVerticalAlignment("middle");

    sheet.getRange(item.valRange).merge();
    var val = sheet.getRange(item.valRange);
    val.setBackground(item.bg);
    val.setFontColor(item.textCol);
    val.setFontSize(16);
    val.setFontWeight("bold");
    val.setHorizontalAlignment("center");
    val.setVerticalAlignment("middle");
    val.setValue("0");
  }

  // 3. BLOCS FINANCIERS EN MAD (Lignes 8 à 10)
  var financeConfigs = [
    {
      labelRange: "A8:C8",
      valRange: "A9:C10",
      label: "💰 TOTAL ENCAISSÉ (LIVRÉ)",
      sub: "Argent réel en poche",
      bg: "#1B5E20",
      textCol: "#FFFFFF"
    },
    {
      labelRange: "D8:F8",
      valRange: "D9:F10",
      label: "🚚 CA EN COURS DE LIVRAISON",
      sub: "Colis expédiés / en prépa",
      bg: "#0D47A1",
      textCol: "#FFFFFF"
    },
    {
      labelRange: "G8:I8",
      valRange: "G9:I10",
      label: "🎯 CA CONFIRMÉ TOTAL",
      sub: "Potentiel commandes validées",
      bg: "#4A148C",
      textCol: "#FFFFFF"
    },
    {
      labelRange: "J8:N8",
      valRange: "J9:N10",
      label: "📅 CA ENCAISSÉ CETTE SEMAINE (7J)",
      sub: "Gains des 7 derniers jours",
      bg: "#E65100",
      textCol: "#FFFFFF"
    }
  ];

  for (var f = 0; f < financeConfigs.length; f++) {
    var fItem = financeConfigs[f];
    sheet.getRange(fItem.labelRange).merge().setValue(fItem.label);
    var fLbl = sheet.getRange(fItem.labelRange);
    fLbl.setBackground(fItem.bg);
    fLbl.setFontColor(fItem.textCol);
    fLbl.setFontSize(9.5);
    fLbl.setFontWeight("bold");
    fLbl.setHorizontalAlignment("center");
    fLbl.setVerticalAlignment("middle");

    sheet.getRange(fItem.valRange).merge();
    var fVal = sheet.getRange(fItem.valRange);
    fVal.setBackground(fItem.bg);
    fVal.setFontColor("#FFFFFF");
    fVal.setFontSize(18);
    fVal.setFontWeight("bold");
    fVal.setHorizontalAlignment("center");
    fVal.setVerticalAlignment("middle");
    fVal.setValue("0 MAD");
  }

  // 4. TABLEAU 1 : STATUTS DE COMMANDE (Ligne 12 à 17, Colonnes A à E)
  sheet.getRange("A12:E12").merge().setValue("📦 1. RÉPARTITION PAR STATUT DE COMMANDE");
  styleSectionTitle(sheet.getRange("A12:E12"));

  sheet.getRange("A13").setValue("Statut Commande");
  sheet.getRange("B13").setValue("Nombre");
  sheet.getRange("C13").setValue("% Total");
  sheet.getRange("D13:E13").merge().setValue("Action recommandée");
  styleTableHeader(sheet.getRange("A13:E13"));

  var orderStatuses = [
    { name: "Nouveau", action: "Contacter rapidement sur WhatsApp", bg: "#E3F2FD", col: "#1565C0" },
    { name: "Confirmé", action: "Préparer le colis en stock", bg: "#E8F5E9", col: "#2E7D32" },
    { name: "Injoignable", action: "Relancer dans 2 heures / WhatsApp", bg: "#FFF3E0", col: "#E65100" },
    { name: "Annulé", action: "Archiver la commande", bg: "#FFEBEE", col: "#C62828" }
  ];

  for (var os = 0; os < orderStatuses.length; os++) {
    var r = 14 + os;
    var st = orderStatuses[os];
    sheet.getRange("A" + r).setValue(st.name).setFontWeight("bold").setFontColor(st.col).setBackground(st.bg);
    sheet.getRange("B" + r).setValue(0).setHorizontalAlignment("center").setFontWeight("bold");
    sheet.getRange("C" + r).setValue("0%").setHorizontalAlignment("center");
    sheet.getRange("D" + r + ":E" + r).merge().setValue(st.action).setFontSize(9).setFontColor("#555555");
    sheet.setRowHeight(r, 26);
  }

  // 5. TABLEAU 2 : STATUTS DE LIVRAISON (Ligne 12 à 18, Colonnes G à N)
  sheet.getRange("G12:N12").merge().setValue("🚚 2. RÉPARTITION PAR STATUT DE LIVRAISON");
  styleSectionTitle(sheet.getRange("G12:N12"));

  sheet.getRange("G13").setValue("Statut Livraison");
  sheet.getRange("H13").setValue("Colis");
  sheet.getRange("I13").setValue("% Total");
  sheet.getRange("J13:N13").merge().setValue("Suivi Livreur / Logistique");
  styleTableHeader(sheet.getRange("G13:N13"));

  var deliveryStatuses = [
    { name: "En attente", desc: "Commande en attente de validation client", bg: "#FFF8E1", col: "#F57F17" },
    { name: "En préparation", desc: "Colis en emballage au dépôt", bg: "#FFFDE7", col: "#F9A825" },
    { name: "Expédié", desc: "Colis remis à la société de livraison", bg: "#E3F2FD", col: "#1565C0" },
    { name: "Livré", desc: "Paiement encaissé avec succès", bg: "#E8F5E9", col: "#2E7D32" },
    { name: "Retour", desc: "Refus / Échec livraison (retour dépôt)", bg: "#FCE4EC", col: "#AD1457" }
  ];

  for (var ds = 0; ds < deliveryStatuses.length; ds++) {
    var rowDel = 14 + ds;
    var dSt = deliveryStatuses[ds];
    sheet.getRange("G" + rowDel).setValue(dSt.name).setFontWeight("bold").setFontColor(dSt.col).setBackground(dSt.bg);
    sheet.getRange("H" + rowDel).setValue(0).setHorizontalAlignment("center").setFontWeight("bold");
    sheet.getRange("I" + rowDel).setValue("0%").setHorizontalAlignment("center");
    sheet.getRange("J" + rowDel + ":N" + rowDel).merge().setValue(dSt.desc).setFontSize(9).setFontColor("#555555");
    sheet.setRowHeight(rowDel, 26);
  }

  // 6. TABLEAU 3 : PERFORMANCE & REVENUS PAR PRODUIT (Ligne 20)
  sheet.getRange("A20:I20").merge().setValue("🏷️ 3. PERFORMANCE & CHIFFRE D'AFFAIRES PAR PRODUIT (FEUILLES)");
  styleSectionTitle(sheet.getRange("A20:I20"));

  var prodHeaders = ["Feuille Produit", "Total", "Confirmées", "Livrées", "En Attente", "Annulées", "Taux Livraison", "CA Livré (MAD)"];
  var prodCols = ["A21", "B21", "C21", "D21", "E21", "F21", "G21", "H21:I21"];
  for (var ph = 0; ph < prodHeaders.length; ph++) {
    if (ph === 7) {
      sheet.getRange(prodCols[ph]).merge().setValue(prodHeaders[ph]);
    } else {
      sheet.getRange(prodCols[ph]).setValue(prodHeaders[ph]);
    }
  }
  styleTableHeader(sheet.getRange("A21:I21"));

  for (var p = 0; p < PRODUCT_SHEETS.length; p++) {
    var pRow = 22 + p;
    var shName = PRODUCT_SHEETS[p];
    sheet.getRange("A" + pRow).setValue(shName).setFontWeight("bold");
    sheet.getRange("B" + pRow).setValue(0).setHorizontalAlignment("center");
    sheet.getRange("C" + pRow).setValue(0).setHorizontalAlignment("center");
    sheet.getRange("D" + pRow).setValue(0).setHorizontalAlignment("center");
    sheet.getRange("E" + pRow).setValue(0).setHorizontalAlignment("center");
    sheet.getRange("F" + pRow).setValue(0).setHorizontalAlignment("center");
    sheet.getRange("G" + pRow).setValue("0.0%").setHorizontalAlignment("center");
    sheet.getRange("H" + pRow + ":I" + pRow).merge().setValue("0 MAD").setHorizontalAlignment("center").setFontWeight("bold").setBackground("#E8F5E9").setFontColor("#1B5E20");
    sheet.setRowHeight(pRow, 25);
  }

  // Ligne Total Produits
  var totalPRow = 22 + PRODUCT_SHEETS.length;
  sheet.getRange("A" + totalPRow).setValue("TOTAL GLOBAL").setFontWeight("bold").setBackground("#F0F0F0");
  sheet.getRange("B" + totalPRow).setValue(0).setFontWeight("bold").setHorizontalAlignment("center").setBackground("#F0F0F0");
  sheet.getRange("C" + totalPRow).setValue(0).setFontWeight("bold").setHorizontalAlignment("center").setBackground("#F0F0F0");
  sheet.getRange("D" + totalPRow).setValue(0).setFontWeight("bold").setHorizontalAlignment("center").setBackground("#F0F0F0");
  sheet.getRange("E" + totalPRow).setValue(0).setFontWeight("bold").setHorizontalAlignment("center").setBackground("#F0F0F0");
  sheet.getRange("F" + totalPRow).setValue(0).setFontWeight("bold").setHorizontalAlignment("center").setBackground("#F0F0F0");
  sheet.getRange("G" + totalPRow).setValue("0.0%").setFontWeight("bold").setHorizontalAlignment("center").setBackground("#F0F0F0");
  sheet.getRange("H" + totalPRow + ":I" + totalPRow).merge().setValue("0 MAD").setFontWeight("bold").setHorizontalAlignment("center").setBackground("#C8E6C9").setFontColor("#1B5E20");

  // 7. TABLEAU 4 : SUIVI QUOTIDIEN & HEBDOMADAIRE (7 DERNIERS JOURS + GAINS EN MAD)
  var qStart = totalPRow + 2;
  sheet.getRange("A" + qStart + ":I" + qStart).merge().setValue("📅 4. SUIVI QUOTIDIEN & REVENUS (7 DERNIERS JOURS)");
  styleSectionTitle(sheet.getRange("A" + qStart + ":I" + qStart));

  var qHeadRow = qStart + 1;
  sheet.getRange("A" + qHeadRow).setValue("Jour / Date");
  sheet.getRange("B" + qHeadRow).setValue("Créées");
  sheet.getRange("C" + qHeadRow).setValue("Confirmées");
  sheet.getRange("D" + qHeadRow).setValue("Livrées");
  sheet.getRange("E" + qHeadRow + ":F" + qHeadRow).merge().setValue("CA Livré (MAD)");
  sheet.getRange("G" + qHeadRow + ":I" + qHeadRow).merge().setValue("Observations / Suivi");
  styleTableHeader(sheet.getRange("A" + qHeadRow + ":I" + qHeadRow));

  var daysBack = [
    { label: "Aujourd'hui", offset: 0 },
    { label: "Hier", offset: 1 },
    { label: "J - 2", offset: 2 },
    { label: "J - 3", offset: 3 },
    { label: "J - 4", offset: 4 },
    { label: "J - 5", offset: 5 },
    { label: "J - 6", offset: 6 }
  ];

  for (var d = 0; d < daysBack.length; d++) {
    var dayRow = qHeadRow + 1 + d;
    var dayItem = daysBack[d];
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - dayItem.offset);
    var dateLabelStr = Utilities.formatDate(targetDate, "GMT+1", "dd/MM/yyyy");

    sheet.getRange("A" + dayRow).setValue(dayItem.label + " (" + dateLabelStr + ")").setFontWeight(dayItem.offset === 0 ? "bold" : "normal");
    sheet.getRange("B" + dayRow).setValue(0).setHorizontalAlignment("center").setFontWeight("bold");
    sheet.getRange("C" + dayRow).setValue(0).setHorizontalAlignment("center");
    sheet.getRange("D" + dayRow).setValue(0).setHorizontalAlignment("center").setFontWeight("bold");
    sheet.getRange("E" + dayRow + ":F" + dayRow).merge().setValue("0 MAD").setHorizontalAlignment("center").setFontWeight("bold").setBackground("#E8F5E9").setFontColor("#1B5E20");
    sheet.getRange("G" + dayRow + ":I" + dayRow).merge().setValue(dayItem.offset === 0 ? "⚡ Commandes reçues ce jour" : "-").setFontSize(9).setFontColor("#555555");
    sheet.setRowHeight(dayRow, 24);
  }

  // Ligne Total 7 derniers jours (Semaine)
  var weekTotalRow = qHeadRow + 1 + daysBack.length;
  sheet.getRange("A" + weekTotalRow).setValue("TOTAL SEMAINE (7 JOURS)").setFontWeight("bold").setBackground("#FFF3E0").setFontColor("#E65100");
  sheet.getRange("B" + weekTotalRow).setValue(0).setFontWeight("bold").setHorizontalAlignment("center").setBackground("#FFF3E0");
  sheet.getRange("C" + weekTotalRow).setValue(0).setFontWeight("bold").setHorizontalAlignment("center").setBackground("#FFF3E0");
  sheet.getRange("D" + weekTotalRow).setValue(0).setFontWeight("bold").setHorizontalAlignment("center").setBackground("#FFF3E0");
  sheet.getRange("E" + weekTotalRow + ":F" + weekTotalRow).merge().setValue("0 MAD").setFontWeight("bold").setHorizontalAlignment("center").setBackground("#FFE0B2").setFontColor("#B71C1C").setFontSize(11);
  sheet.getRange("G" + weekTotalRow + ":I" + weekTotalRow).merge().setValue("Chiffre d'affaires encaissé sur les 7 derniers jours").setFontSize(9).setFontWeight("bold").setFontColor("#E65100").setBackground("#FFF3E0");
  sheet.setRowHeight(weekTotalRow, 28);

  // Ajustement des largeurs de colonnes pour le Dashboard
  sheet.setColumnWidth(1, 170); // A
  sheet.setColumnWidth(2, 90);  // B
  sheet.setColumnWidth(3, 100); // C
  sheet.setColumnWidth(4, 90);  // D
  sheet.setColumnWidth(5, 80);  // E
  sheet.setColumnWidth(6, 80);  // F
  sheet.setColumnWidth(7, 120); // G
  sheet.setColumnWidth(8, 90);  // H
  sheet.setColumnWidth(9, 100); // I
  sheet.setColumnWidth(10, 110);
  sheet.setColumnWidth(11, 110);
  sheet.setColumnWidth(12, 130);
  sheet.setColumnWidth(13, 130);
  sheet.setColumnWidth(14, 130);

  // Remplir immédiatement avec les vraies données
  updateDashboardLive(sheet.getParent());
}

/**
 * Calcule et actualise en direct tous les indicateurs du Tableau de bord (Volume & Finances MAD).
 */
function updateDashboardLive(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName("Tableau de bord");
  if (!dash) return;

  var totalOrders = 0;
  var orderStatusCounts = { "Nouveau": 0, "Confirmé": 0, "Injoignable": 0, "Annulé": 0 };
  var deliveryStatusCounts = { "En attente": 0, "En préparation": 0, "Expédié": 0, "Livré": 0, "Retour": 0 };
  var productStats = {};

  var totalDeliveredRevenue = 0;   // CA Livré (encaissé en poche)
  var totalInProgressRevenue = 0;  // CA En cours (Expédié + En préparation)
  var totalConfirmedRevenue = 0;   // CA Confirmé total
  var weeklyDeliveredRevenue = 0;  // CA Livré des 7 derniers jours

  // 7 derniers jours au format JJ/MM/AAAA
  var dailyCounts = [0, 0, 0, 0, 0, 0, 0];
  var dailyConfirmed = [0, 0, 0, 0, 0, 0, 0];
  var dailyDelivered = [0, 0, 0, 0, 0, 0, 0];
  var dailyRevenue = [0, 0, 0, 0, 0, 0, 0];
  var dailyDates = [];
  var now = new Date();
  for (var d = 0; d < 7; d++) {
    var dt = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    dailyDates.push(Utilities.formatDate(dt, "GMT+1", "dd/MM/yyyy"));
  }

  for (var p = 0; p < PRODUCT_SHEETS.length; p++) {
    var shName = PRODUCT_SHEETS[p];
    productStats[shName] = {
      total: 0,
      confirmed: 0,
      delivered: 0,
      waiting: 0,
      cancelled: 0,
      revenueDelivered: 0
    };
    var sh = ss.getSheetByName(shName);
    if (!sh) continue;

    var lastRow = sh.getLastRow();
    if (lastRow <= 1) continue;

    var numRows = lastRow - 1;
    var data = sh.getRange(2, 1, numRows, 14).getValues();

    for (var r = 0; r < data.length; r++) {
      var row = data[r];
      var dateVal = "" + (row[0] || "");
      var orderId = "" + (row[1] || "");
      if (!orderId) continue;

      totalOrders++;
      productStats[shName].total++;

      // Prix en DH (Colonne K, index 10)
      var priceVal = row[10];
      var amount = parseAmount(priceVal);

      // Statut commande (Colonne L, index 11)
      var ordSt = ("" + (row[11] || "")).trim();
      if (!ordSt) ordSt = "Nouveau";
      if (orderStatusCounts[ordSt] !== undefined) {
        orderStatusCounts[ordSt]++;
      }
      if (ordSt === "Confirmé") {
        productStats[shName].confirmed++;
        totalConfirmedRevenue += amount;
      }
      if (ordSt === "Annulé") productStats[shName].cancelled++;

      // Statut livraison (Colonne M, index 12)
      var delSt = ("" + (row[12] || "")).trim();
      if (!delSt) delSt = "En attente";
      if (deliveryStatusCounts[delSt] !== undefined) {
        deliveryStatusCounts[delSt]++;
      }

      if (delSt === "Livré") {
        productStats[shName].delivered++;
        productStats[shName].revenueDelivered += amount;
        totalDeliveredRevenue += amount;
      } else if (delSt === "En préparation" || delSt === "Expédié") {
        totalInProgressRevenue += amount;
      } else if (delSt === "En attente") {
        productStats[shName].waiting++;
      }

      // Suivi quotidien par date
      for (var dayIdx = 0; dayIdx < 7; dayIdx++) {
        if (dateVal.indexOf(dailyDates[dayIdx]) !== -1) {
          dailyCounts[dayIdx]++;
          if (ordSt === "Confirmé") dailyConfirmed[dayIdx]++;
          if (delSt === "Livré") {
            dailyDelivered[dayIdx]++;
            dailyRevenue[dayIdx] += amount;
            weeklyDeliveredRevenue += amount;
          }
          break;
        }
      }
    }
  }

  // Calculs taux
  var confirmedTotal = orderStatusCounts["Confirmé"];
  var deliveredTotal = deliveryStatusCounts["Livré"];
  var inProgressTotal = deliveryStatusCounts["En préparation"] + deliveryStatusCounts["Expédié"];
  var cancelledTotal = orderStatusCounts["Annulé"] + orderStatusCounts["Injoignable"];
  var returnTotal = deliveryStatusCounts["Retour"];
  var deliveryRate = confirmedTotal > 0
    ? ((deliveredTotal / confirmedTotal) * 100).toFixed(1) + "%"
    : totalOrders > 0
    ? ((deliveredTotal / totalOrders) * 100).toFixed(1) + "%"
    : "0.0%";

  // 1. Écriture des 7 blocs KPI de volume (Lignes 5 à 7)
  dash.getRange("A6").setValue(totalOrders);
  dash.getRange("C6").setValue(confirmedTotal);
  dash.getRange("E6").setValue(deliveredTotal);
  dash.getRange("G6").setValue(inProgressTotal);
  dash.getRange("I6").setValue(cancelledTotal);
  dash.getRange("K6").setValue(returnTotal);
  dash.getRange("M6").setValue(deliveryRate);

  // 2. Écriture des 4 blocs financiers en MAD (Lignes 8 à 10)
  dash.getRange("A9").setValue(formatMAD(totalDeliveredRevenue));
  dash.getRange("D9").setValue(formatMAD(totalInProgressRevenue));
  dash.getRange("G9").setValue(formatMAD(totalConfirmedRevenue));
  dash.getRange("J9").setValue(formatMAD(weeklyDeliveredRevenue));

  // 3. Écriture du Tableau 1 : Statuts de commande (Ligne 14 à 17)
  var orderStatusKeys = ["Nouveau", "Confirmé", "Injoignable", "Annulé"];
  for (var os = 0; os < orderStatusKeys.length; os++) {
    var rowIdx = 14 + os;
    var count = orderStatusCounts[orderStatusKeys[os]] || 0;
    var pct = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) + "%" : "0%";
    dash.getRange("B" + rowIdx).setValue(count);
    dash.getRange("C" + rowIdx).setValue(pct);
  }

  // 4. Écriture du Tableau 2 : Statuts de livraison (Ligne 14 à 18)
  var deliveryStatusKeys = ["En attente", "En préparation", "Expédié", "Livré", "Retour"];
  for (var ds = 0; ds < deliveryStatusKeys.length; ds++) {
    var rowDelIdx = 14 + ds;
    var delCount = deliveryStatusCounts[deliveryStatusKeys[ds]] || 0;
    var delPct = totalOrders > 0 ? ((delCount / totalOrders) * 100).toFixed(1) + "%" : "0%";
    dash.getRange("H" + rowDelIdx).setValue(delCount);
    dash.getRange("I" + rowDelIdx).setValue(delPct);
  }

  // 5. Écriture du Tableau 3 : Performance & CA par produit (Ligne 22 à 27)
  var sumTot = 0, sumConf = 0, sumLiv = 0, sumAtt = 0, sumAnn = 0, sumRev = 0;
  for (var pIdx = 0; pIdx < PRODUCT_SHEETS.length; pIdx++) {
    var pRow = 22 + pIdx;
    var pName = PRODUCT_SHEETS[pIdx];
    var stat = productStats[pName];
    sumTot += stat.total;
    sumConf += stat.confirmed;
    sumLiv += stat.delivered;
    sumAtt += stat.waiting;
    sumAnn += stat.cancelled;
    sumRev += stat.revenueDelivered;

    var pRate = stat.confirmed > 0
      ? ((stat.delivered / stat.confirmed) * 100).toFixed(1) + "%"
      : stat.total > 0
      ? ((stat.delivered / stat.total) * 100).toFixed(1) + "%"
      : "0.0%";

    dash.getRange("B" + pRow).setValue(stat.total);
    dash.getRange("C" + pRow).setValue(stat.confirmed);
    dash.getRange("D" + pRow).setValue(stat.delivered);
    dash.getRange("E" + pRow).setValue(stat.waiting);
    dash.getRange("F" + pRow).setValue(stat.cancelled);
    dash.getRange("G" + pRow).setValue(pRate);
    dash.getRange("H" + pRow).setValue(formatMAD(stat.revenueDelivered));
  }

  var totalPRow = 22 + PRODUCT_SHEETS.length;
  var globalRate = sumConf > 0
    ? ((sumLiv / sumConf) * 100).toFixed(1) + "%"
    : sumTot > 0
    ? ((sumLiv / sumTot) * 100).toFixed(1) + "%"
    : "0.0%";

  dash.getRange("B" + totalPRow).setValue(sumTot);
  dash.getRange("C" + totalPRow).setValue(sumConf);
  dash.getRange("D" + totalPRow).setValue(sumLiv);
  dash.getRange("E" + totalPRow).setValue(sumAtt);
  dash.getRange("F" + totalPRow).setValue(sumAnn);
  dash.getRange("G" + totalPRow).setValue(globalRate);
  dash.getRange("H" + totalPRow).setValue(formatMAD(sumRev));

  // 6. Écriture du Tableau 4 : Suivi quotidien (7 derniers jours)
  var qHeadRow = totalPRow + 3;
  var sumWeekCreated = 0, sumWeekConf = 0, sumWeekLiv = 0, sumWeekRev = 0;

  for (var dIdx = 0; dIdx < 7; dIdx++) {
    var dRow = qHeadRow + 1 + dIdx;
    sumWeekCreated += dailyCounts[dIdx];
    sumWeekConf += dailyConfirmed[dIdx];
    sumWeekLiv += dailyDelivered[dIdx];
    sumWeekRev += dailyRevenue[dIdx];

    dash.getRange("B" + dRow).setValue(dailyCounts[dIdx]);
    dash.getRange("C" + dRow).setValue(dailyConfirmed[dIdx]);
    dash.getRange("D" + dRow).setValue(dailyDelivered[dIdx]);
    dash.getRange("E" + dRow).setValue(formatMAD(dailyRevenue[dIdx]));
  }

  // Ligne Total Semaine (Ligne 40)
  var weekRow = qHeadRow + 1 + 7;
  dash.getRange("B" + weekRow).setValue(sumWeekCreated);
  dash.getRange("C" + weekRow).setValue(sumWeekConf);
  dash.getRange("D" + weekRow).setValue(sumWeekLiv);
  dash.getRange("E" + weekRow).setValue(formatMAD(sumWeekRev));
}

function parseAmount(val) {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  var str = ("" + val).replace(/[^0-9.,]/g, "").replace(",", ".");
  var n = parseFloat(str);
  return isNaN(n) ? 0 : n;
}

function formatMAD(amount) {
  return Math.round(amount).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, " ") + " MAD";
}

/**
 * Trigger automatique quand l'utilisateur change un statut dans une feuille
 */
function onEdit(e) {
  if (!e || !e.range) return;
  try {
    var sheet = e.range.getSheet();
    var sheetName = sheet.getName();
    if (PRODUCT_SHEETS.indexOf(sheetName) !== -1) {
      var col = e.range.getColumn();
      // Si la colonne 12 (Statut commande) ou 13 (Statut livraison) est modifiée
      if (col === 12 || col === 13) {
        var row = e.range.getRow();
        if (row >= 2) {
          var val = ("" + e.range.getValue()).trim();
          if (col === 12) {
            if (val === "Confirmé") {
              e.range.setBackground("#E8F5E9").setFontColor("#2E7D32");
            } else if (val === "Nouveau") {
              e.range.setBackground("#E3F2FD").setFontColor("#1565C0");
            } else if (val === "Injoignable") {
              e.range.setBackground("#FFF3E0").setFontColor("#E65100");
            } else if (val === "Annulé") {
              e.range.setBackground("#FFEBEE").setFontColor("#C62828");
            }
          } else if (col === 13) {
            if (val === "Livré") {
              e.range.setBackground("#E8F5E9").setFontColor("#2E7D32");
            } else if (val === "Expédié") {
              e.range.setBackground("#E3F2FD").setFontColor("#1565C0");
            } else if (val === "En préparation") {
              e.range.setBackground("#FFFDE7").setFontColor("#F9A825");
            } else if (val === "En attente") {
              e.range.setBackground("#FFF8E1").setFontColor("#F57F17");
            } else if (val === "Retour") {
              e.range.setBackground("#FCE4EC").setFontColor("#AD1457");
            }
          }
        }
        // Mise à jour instantanée du Tableau de bord et du CA en direct
        updateDashboardLive(sheet.getParent());
      }
    }
  } catch (err) {
    // Silencieux
  }
}

function styleSectionTitle(range) {
  range.setBackground("#8B3045");
  range.setFontColor("#FFFFFF");
  range.setFontFamily("Arial");
  range.setFontSize(11);
  range.setFontWeight("bold");
  range.setVerticalAlignment("middle");
}

function styleTableHeader(range) {
  range.setBackground("#F3EBEF");
  range.setFontColor("#4A1521");
  range.setFontFamily("Arial");
  range.setFontSize(9.5);
  range.setFontWeight("bold");
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
}

/**
 * Menu personnalisé 🌸 Oryven dans Google Sheets pour actualiser en 1 clic
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🌸 Oryven")
    .addItem("📊 Actualiser le Tableau de bord & Revenus (MAD)", "menuRebuildDashboard")
    .addItem("🧪 Envoyer les 5 commandes tests pour initialiser", "testerCreationFeuilles")
    .addToUi();
}

function menuRebuildDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureAllSheetsAndDashboard(ss);
  updateDashboardLive(ss);
  SpreadsheetApp.getUi().alert("✅ Tableau de bord & Revenus actualisés avec succès !");
}

/**
 * Détermination automatique du nom de la feuille selon le produit commandé
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

function extractProductName(order) {
  if (order.productName) return order.productName;
  if (!order.productDetails) return "Produit Oryven";
  var bracketIdx = order.productDetails.indexOf("[");
  if (bracketIdx !== -1) return order.productDetails.substring(0, bracketIdx).trim();
  var dashIdx = order.productDetails.indexOf("-");
  if (dashIdx !== -1) return order.productDetails.substring(0, dashIdx).trim();
  return order.productDetails;
}

function extractOfferTitle(order) {
  if (order.offerTitle) return order.offerTitle;
  if (!order.productDetails) return "Solo";
  var m = order.productDetails.match(/\\[(.*?)\\]/);
  if (m && m[1]) return m[1].replace(/Offre:\\s*/i, "").trim();
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
  if (varIdx !== -1) return order.productDetails.substring(varIdx + 11).trim();
  var colIdx = order.productDetails.indexOf("Couleur :");
  if (colIdx !== -1) return order.productDetails.substring(colIdx + 9).trim();
  return "-";
}

function formatMoroccanPhone(phone) {
  if (!phone) return "";
  var clean = ("" + phone).replace(/[^0-9]/g, "");
  if (clean.indexOf("0") === 0) clean = "212" + clean.substring(1);
  else if (clean.indexOf("212") !== 0) clean = "212" + clean;
  return clean;
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
          totalAmount: 289,
          orderStatus: "Confirmé",
          deliveryStatus: "Livré"
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
          totalAmount: 199,
          orderStatus: "Confirmé",
          deliveryStatus: "En préparation"
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
          totalAmount: 349,
          orderStatus: "Confirmé",
          deliveryStatus: "Expédié"
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
          totalAmount: 179,
          orderStatus: "Confirmé",
          deliveryStatus: "Livré"
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
          totalAmount: 590,
          orderStatus: "Nouveau",
          deliveryStatus: "En attente"
        }
      ])
    }
  };
  doPost(e);
}
`;
