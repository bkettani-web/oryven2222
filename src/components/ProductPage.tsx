import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Heart,
  Star,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { Product, ProductOffer, CustomerOrder } from '../types';
import { MOROCCAN_CITIES, IMAGES, PRODUCTS } from '../data/products';
import {
  sendOrderToGoogleSheets,
  getAppsScriptUrl,
} from '../services/googleSheetsService';

interface ProductVisualHighlight {
  image: string;
  title: string;
  description: string;
}

const getProductHighlights = (product: Product): ProductVisualHighlight[] => {
  switch (product.id) {
    case 'oryven-tote-bag':
    case 'alo-tote-bag':
      return [
        {
          image: product.gallery[0] || product.image,
          title: 'Toile Bio 480 g/m² Ultrarésistante',
          description:
            'Tissage dense en coton biologique déperlant, conçu pour résister aux frottements et protéger vos affaires en toutes circonstances.',
        },
        {
          image: product.gallery[1] || IMAGES.toteDetail,
          title: 'Finitions & Coutures Renforcées',
          description:
            'Double piquage des anses et rivets en métal brossé garantissant une robustesse à toute épreuve, même lourdement chargé.',
        },
        {
          image: product.gallery[2] || IMAGES.heroScene,
          title: 'Volume 28L & Rangement Dédié',
          description:
            'Grand compartiment pour gourde, maintien élastique pour tapis de yoga et poche intérieure zippée pour vos clés et téléphone.',
        },
        {
          image: product.gallery[3] || IMAGES.lifestyle,
          title: 'Port Épaule Ergonomique',
          description:
            'Anses larges et confortables étudiées pour un maintien naturel sans glisser, idéal pour le studio, le travail ou le week-end.',
        },
      ];

    case 'oryven-yoga-headband':
    case 'alo-yoga-headband':
      return [
        {
          image: product.gallery[0] || product.image,
          title: 'Microfibre Oryven Soft Seconde Peau',
          description:
            'Tricotage extensible ultra-doux au toucher qui épouse parfaitement le tour de tête sans aucune sensation de pression.',
        },
        {
          image: product.gallery[1] || IMAGES.yogaMatDetail,
          title: 'Maintien Anti-Glisse Actif',
          description:
            'Micro-texture intérieure respirante maintenant les cheveux bien en place même lors des séances de yoga ou de fitness intenses.',
        },
        {
          image: product.gallery[2] || IMAGES.heroScene,
          title: 'Absorption & Séchage Instantané',
          description:
            'Technologie QuickDry régulant l’humidité pour vous garder au sec et concentrée tout au long de votre séance.',
        },
        {
          image: product.gallery[3] || IMAGES.lifestyle,
          title: 'Maille Côtelée & Finitions Douces',
          description:
            'Coutures plates thermo-soudées qui ne laissent aucune trace sur le front, avec logo signature discret et élégant.',
        },
      ];

    case 'oryven-visor':
    case 'alo-visor':
      return [
        {
          image: product.gallery[0] || product.image,
          title: 'Protection Solaire UV Haute Performance',
          description:
            'Visière galbée avec écran antireflet offrant une ombre protectrice optimale pour le padel, la course et les activités extérieures.',
        },
        {
          image: product.gallery[1] || IMAGES.lifestyle,
          title: 'Bandeau Éponge Intérieur Absorbant',
          description:
            'Doublure frontale en molleton doux absorbant immédiatement la transpiration pour éviter qu’elle ne coule dans les yeux.',
        },
        {
          image: product.gallery[2] || IMAGES.heroScene,
          title: 'Lanière Réglable Anti-Accroche',
          description:
            'Fermeture arrière micro-velcro douce qui ne tire pas les cheveux et permet un ajustement précis et personnalisé.',
        },
        {
          image: product.gallery[3] || IMAGES.toteDetail,
          title: 'Poids Plume & Résistance Déperlante',
          description:
            'Ne pèse que 65 grammes pour un confort d’oubli total, avec tissu micro-sergé qui repousse l’humidité et les taches.',
        },
      ];

    case 'oryven-non-slip-grip-socks':
    case 'alo-non-slip-grip-socks':
      return [
        {
          image: product.gallery[0] || product.image,
          title: 'Picots Silicone Anti-Dérapants',
          description:
            'Adhérence maximale sous la voûte plantaire assurant une stabilité parfaite sur le tapis de sol ou le reformer de pilates.',
        },
        {
          image: product.gallery[1] || IMAGES.yogaMatDetail,
          title: 'Maintien de Voûte Anatomique',
          description:
            'Bande élastique de compression douce qui enveloppe le pied et empêche la chaussette de tourner ou de glisser.',
        },
        {
          image: product.gallery[2] || IMAGES.heroScene,
          title: 'Coton Peigné Doux & Respirant',
          description:
            'Tissage aéré favorisant la régulation thermique pour garder les pieds frais et confortables pendant l’effort.',
        },
        {
          image: product.gallery[3] || IMAGES.lifestyle,
          title: 'Finition Sans Couture Gênante',
          description:
            'Pointe et talon ergonomiques sans frottement pour une liberté de mouvement totale et un confort digne d’une seconde peau.',
        },
      ];

    case 'pack-complet-oryven':
      return [
        {
          image: product.image || IMAGES.studioDesktopBanner,
          title: 'La Collection Complète : 1 Sac + 1 Visière + 2 Bandeaux',
          description:
            'Tote Bag spacieux 28L en toile bio, visière athlétique UPF 50+ et 2 bandeaux absorbants ultra-doux réunis dans un seul coffret.',
        },
        {
          image: IMAGES.tote,
          title: '1x Oryven Tote Bag Toile Épaisse 480 g/m²',
          description:
            'Le cabas grande contenance avec pochettes dédiées pour votre gourde, tapis de yoga et vos indispensables quotidiens.',
        },
        {
          image: IMAGES.visor,
          title: '1x Visière Sport Athlétique UPF 50+',
          description:
            'La protection solaire athlétique avec bandeau éponge doux qui reste parfaitement en place pendant vos séances.',
        },
        {
          image: IMAGES.headband,
          title: '2x Bandeaux Yoga Headband au Choix',
          description:
            'Deux bandeaux élastiques au maintien seconde peau et séchage QuickDry aux coloris de votre choix.',
        },
      ];

    default:
      return [
        {
          image: product.gallery[0] || product.image,
          title: 'Conception & Finitions Premium',
          description:
            'Chaque détail est pensé pour allier durabilité, confort d’usage et style contemporain adapté à votre rythme actif.',
        },
        {
          image: product.gallery[1] || product.image,
          title: 'Matières Sélectionnées',
          description:
            'Tissus techniques respirants et résistants, conçus pour durer et conserver leur tenue lavage après lavage.',
        },
        {
          image: product.gallery[2] || IMAGES.heroScene,
          title: 'Ergonomie & Polyvalence',
          description:
            'Un accessoire pensé pour s’adapter aussi bien à vos entraînements quotidiens qu’à vos sorties en ville.',
        },
        {
          image: product.gallery[3] || IMAGES.lifestyle,
          title: 'Qualité Contrôlée & Confort',
          description:
            'Testé pour répondre aux exigences du mouvement libre, sans compromis sur l’élégance et la praticité.',
        },
      ];
  }
};

interface PackItemVariant {
  name: string;
  code: string;
  image: string;
}

interface PackItemVariantConfig {
  id: string;
  name: string;
  defaultImage: string;
  variants: PackItemVariant[];
  defaultVariant: string;
}

const PACK_COMPLET_ITEMS: PackItemVariantConfig[] = [
  {
    id: 'tote',
    name: '1x Sac Tote Bag Grand Format 28L',
    defaultImage:
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911773/ChatGPT_Image_20_sept._2026_14_42_24_mlkskn.webp',
    variants: [
      {
        name: 'Toile Écru Naturelle',
        code: '#DACFB9',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911773/ChatGPT_Image_20_sept._2026_14_42_24_mlkskn.webp',
      },
    ],
    defaultVariant: 'Toile Écru Naturelle',
  },
  {
    id: 'visor',
    name: '1x Visière Sport UPF 50+',
    defaultImage:
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_20_5_ldvl8u.webp',
    variants: [
      {
        name: 'Noir Intense',
        code: '#171717',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_20_5_ldvl8u.webp',
      },
      {
        name: 'Bleu Glacier',
        code: '#8FA9BA',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_18_1_zttxjl.webp',
      },
      {
        name: 'Rose Framboise',
        code: '#B8395B',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_19_2_s702mz.webp',
      },
      {
        name: 'Mauve Nude',
        code: '#A88B96',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911354/ChatGPT_Image_20_sept._2026_14_32_19_3_afxtpd.webp',
      },
      {
        name: 'Blanc Perle',
        code: '#F5F3ED',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_19_4_qh8xk2.webp',
      },
    ],
    defaultVariant: 'Noir Intense',
  },
  {
    id: 'headband1',
    name: '1er Bandeau Yoga Headband',
    defaultImage: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/etndrdmao8yzwvzbwcch_dda6mr.webp',
    variants: [
      {
        name: 'Lavande Glacée',
        code: '#C8C2E6',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/etndrdmao8yzwvzbwcch_dda6mr.webp',
      },
      {
        name: 'Bleu Ciel',
        code: '#97C4E8',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/jwmbcpxtiqanr9uiklxa_ssrh4p.webp',
      },
      {
        name: 'Noir Intense',
        code: '#171717',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/bbyapbwquohxaokxpysv_jmqzsa.webp',
      },
      {
        name: 'Corail Énergie',
        code: '#F26D5B',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/cdbz8bgrcxdvje6kyeay_gyeifc.webp',
      },
      {
        name: 'Vert Forêt',
        code: '#2E543D',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/auitayygzmelcd9fdjbl_emckuz.webp',
      },
      {
        name: 'Beige Sable',
        code: '#DACFB9',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/lzwshgcbf1e7ntlzynue_ghlm7z.webp',
      },
    ],
    defaultVariant: 'Lavande Glacée',
  },
  {
    id: 'headband2',
    name: '2ème Bandeau Yoga Headband',
    defaultImage: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/jwmbcpxtiqanr9uiklxa_ssrh4p.webp',
    variants: [
      {
        name: 'Bleu Ciel',
        code: '#97C4E8',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/jwmbcpxtiqanr9uiklxa_ssrh4p.webp',
      },
      {
        name: 'Lavande Glacée',
        code: '#C8C2E6',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/etndrdmao8yzwvzbwcch_dda6mr.webp',
      },
      {
        name: 'Noir Intense',
        code: '#171717',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/bbyapbwquohxaokxpysv_jmqzsa.webp',
      },
      {
        name: 'Corail Énergie',
        code: '#F26D5B',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/cdbz8bgrcxdvje6kyeay_gyeifc.webp',
      },
      {
        name: 'Vert Forêt',
        code: '#2E543D',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/auitayygzmelcd9fdjbl_emckuz.webp',
      },
      {
        name: 'Beige Sable',
        code: '#DACFB9',
        image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/lzwshgcbf1e7ntlzynue_ghlm7z.webp',
      },
    ],
    defaultVariant: 'Bleu Ciel',
  },
];

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onOrderSuccess: (order: CustomerOrder) => void;
  onAddToCart: (product: Product, offer: ProductOffer, selectedColors: string[]) => void;
  onSelectProduct?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistIds?: string[];
  onOpenGoogleSheets?: () => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onBack,
  onOrderSuccess,
  onAddToCart,
  onSelectProduct,
  onToggleWishlist,
  wishlistIds = [],
  onOpenGoogleSheets,
}) => {
  const isPackComplet = product.id === 'pack-complet-oryven' || product.slug === 'pack-complet-oryven';

  // Gallery state
  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);

  // Check if product has multiple color variants
  const hasVariants = Boolean(product.colors && product.colors.length > 1);

  // Pack item variant custom selections (for pack-complet-oryven: 1 sac, 1 visière, 2 bandeaux)
  const [packCustomSelections, setPackCustomSelections] = useState<{
    [packIndex: number]: { [itemId: string]: string };
  }>({
    0: {
      tote: 'Toile Écru Naturelle',
      visor: 'Noir Intense',
      headband1: 'Lavande Glacée',
      headband2: 'Bleu Ciel',
    },
    1: {
      tote: 'Toile Écru Naturelle',
      visor: 'Rose Framboise',
      headband1: 'Noir Intense',
      headband2: 'Corail Énergie',
    },
  });
  const [activePackIndex, setActivePackIndex] = useState(0);

  const handlePackItemSelect = (packIndex: number, itemId: string, variantName: string) => {
    setPackCustomSelections((prev) => ({
      ...prev,
      [packIndex]: {
        ...(prev[packIndex] || {}),
        [itemId]: variantName,
      },
    }));

    // Update active gallery image with the selected variant's photo for extra visibility
    const itemConfig = PACK_COMPLET_ITEMS.find((it) => it.id === itemId);
    const variantObj = itemConfig?.variants.find((v) => v.name === variantName);
    if (variantObj?.image) {
      setActiveImage(variantObj.image);
    }
  };

  const getPackCompletColorsList = () => {
    const list: string[] = [];
    const qty = currentOffer.quantity || 1;
    for (let i = 0; i < qty; i++) {
      const p = packCustomSelections[i] || packCustomSelections[0];
      const prefix = qty > 1 ? `[Coffret ${i + 1}] ` : '';
      list.push(
        `${prefix}Sac : Toile Écru Naturelle`,
        `${prefix}Visière : ${p?.visor || 'Noir Intense'}`,
        `${prefix}1er Bandeau : ${p?.headband1 || 'Lavande Glacée'}`,
        `${prefix}2ème Bandeau : ${p?.headband2 || 'Bleu Ciel'}`
      );
    }
    return list;
  };

  // Sync state when product changes
  useEffect(() => {
    setActiveImage(product.gallery[0] || product.image);
    setSelectedOfferId('x1');
    const defaultColorName = product.colors?.[0]?.name || '';
    setSelectedColor(defaultColorName);
    setPackColors({
      0: defaultColorName,
      1: product.colors?.[1]?.name || defaultColorName,
      2: product.colors?.[2]?.name || defaultColorName,
    });
    setActivePackIndex(0);
  }, [product.id, product.image]);

  // Active color for x1
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');

  // Multi-pack color choices (for x2 and x3)
  const [packColors, setPackColors] = useState<{ [index: number]: string }>({
    0: product.colors?.[0]?.name || '',
    1: product.colors?.[1]?.name || product.colors?.[0]?.name || '',
    2: product.colors?.[2]?.name || product.colors?.[0]?.name || '',
  });

  // Selected Offer: default to x1 as requested
  const [selectedOfferId, setSelectedOfferId] = useState<'x1' | 'x2' | 'x3'>('x1');

  // Accordion state
  const [openTab, setOpenTab] = useState<'description' | 'features' | 'care' | 'reviews'>('description');

  // Customer Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Offer Object
  const currentOffer = product.offers.find((o) => o.id === selectedOfferId) || product.offers[0];

  // 4 Visual highlights with descriptions for this product
  const productHighlights = getProductHighlights(product);

  const handleOfferChange = (offerId: 'x1' | 'x2' | 'x3') => {
    setSelectedOfferId(offerId);
  };

  const handlePackColorChange = (index: number, colorName: string) => {
    setPackColors((prev) => ({ ...prev, [index]: colorName }));
  };

  // Form Validation & Submit
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = 'Veuillez saisir votre nom complet';
    if (!phone.trim()) {
      errors.phone = 'Veuillez saisir votre numéro de téléphone';
    } else {
      const cleanPhone = phone.replace(/[\s\-\.]/g, '');
      if (cleanPhone.length < 9) {
        errors.phone = 'Numéro de téléphone invalide (ex: 06 12 34 56 78)';
      }
    }
    if (!city.trim()) errors.city = 'Veuillez indiquer votre ville de livraison';
    if (!address.trim()) errors.address = 'Veuillez indiquer votre adresse de livraison';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const chosenColors = isPackComplet
      ? getPackCompletColorsList()
      : hasVariants && product.colors && product.colors.length > 0
        ? currentOffer.quantity === 1
          ? [selectedColor]
          : Array.from({ length: currentOffer.quantity }).map(
              (_, idx) => packColors[idx] || product.colors?.[0]?.name || ''
            )
        : [];

    const newOrder: CustomerOrder = {
      orderId: `ORYVEN-MA-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      notes: notes.trim(),
      items: [
        {
          product,
          selectedColor:
            product.colors && product.colors.length > 0
              ? product.colors.find((c) => c.name === selectedColor) || product.colors[0]
              : undefined,
          offer: currentOffer,
          customColors: chosenColors.length > 0 ? chosenColors : undefined,
          quantity: 1,
        },
      ],
      totalAmount: currentOffer.totalPrice,
      status: 'confirmed',
      paymentMethod: 'cash_on_delivery',
    };

    // Send order data to Google Sheets App Script (asynchronously)
    try {
      await sendOrderToGoogleSheets(newOrder);
    } catch (err) {
      console.warn('Google Sheets Webhook notification:', err);
    }

    setIsSubmitting(false);
    onOrderSuccess(newOrder);
  };

  // Direct WhatsApp Order
  const handleWhatsAppOrder = () => {
    const targetCity = city.trim() || 'Maroc';
    const colorsText = isPackComplet
      ? getPackCompletColorsList().join('\n  • ')
      : hasVariants && product.colors && product.colors.length > 0
        ? currentOffer.quantity === 1
          ? selectedColor
          : Array.from({ length: currentOffer.quantity })
              .map((_, i) => `Pièce ${i + 1}: ${packColors[i] || selectedColor}`)
              .join(', ')
        : '';

    const colorLine = colorsText
      ? isPackComplet
        ? `🎨 Variantes du Pack :\n  • ${colorsText}\n`
        : `🎨 Couleur(s) : ${colorsText}\n`
      : '';

    const message = encodeURIComponent(
      `Bonjour Oryven Maroc ! Je souhaite commander :\n\n` +
        `🛍️ Produit : ${product.name}\n` +
        `📦 Offre : ${currentOffer.title} (${currentOffer.quantity} pièces)\n` +
        colorLine +
        `💰 Total : ${currentOffer.totalPrice} MAD (Paiement à la livraison)\n\n` +
        `👤 Client : ${fullName || 'À préciser'}\n` +
        `📞 Tél : ${phone || 'À préciser'}\n` +
        `📍 Ville : ${targetCity}\n` +
        `🏠 Adresse : ${address || 'À préciser'}`
    );

    window.open(`https://api.whatsapp.com/send?phone=212676809781&text=${message}`, '_blank');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20">
      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* ================= LEFT COLUMN: IMAGES & PRODUCT INFORMATION ================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Main Image Display */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-md flex items-center justify-center p-3">
              {/* Main Photo */}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail Navigation */}
            {product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img
                        ? 'border-[#7A283B] ring-2 ring-[#7A283B]/20 scale-102 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} vue ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Reassurance Banner for Mobile & Desktop */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-xl border border-neutral-200 text-center">
              <div className="flex flex-col items-center space-y-1">
                <Truck size={18} className="text-[#7A283B]" />
                <span className="text-[11px] font-bold text-neutral-800">Livraison Gratuite</span>
                <span className="text-[10px] text-neutral-500">24h - 48h au Maroc</span>
              </div>
              <div className="flex flex-col items-center space-y-1 border-x border-neutral-100">
                <ShieldCheck size={18} className="text-[#7A283B]" />
                <span className="text-[11px] font-bold text-neutral-800">Paiement Réception</span>
                <span className="text-[10px] text-neutral-500">Vérifiez avant de payer</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RotateCcw size={18} className="text-[#7A283B]" />
                <span className="text-[11px] font-bold text-neutral-800">Échange Facile</span>
                <span className="text-[10px] text-neutral-500">14 jours garantis</span>
              </div>
            </div>

            {/* Product Details Tabs / Accordions */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100">
              {/* Tab: Description */}
              <div>
                <button
                  onClick={() => setOpenTab(openTab === 'description' ? 'description' : 'description')}
                  className="w-full py-4 px-5 flex items-center justify-between text-left font-bold text-neutral-900 text-sm hover:bg-neutral-50"
                >
                  <span className="uppercase tracking-wider text-xs">Description & Conception</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      openTab === 'description' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openTab === 'description' && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-4">
                    <p>{product.description}</p>
                    <ul className="space-y-1.5 pt-2">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <CheckCircle size={14} className="text-[#7A283B] flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tab: Composition & Care */}
              <div>
                <button
                  onClick={() => setOpenTab(openTab === 'care' ? 'description' : 'care')}
                  className="w-full py-4 px-5 flex items-center justify-between text-left font-bold text-neutral-900 text-sm hover:bg-neutral-50"
                >
                  <span className="uppercase tracking-wider text-xs">Matières & Entretien</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${openTab === 'care' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openTab === 'care' && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-2">
                    <p>
                      <strong>Composition :</strong> {product.materials}
                    </p>
                    {product.dimensions && (
                      <p>
                        <strong>Dimensions :</strong> {product.dimensions}
                      </p>
                    )}
                    <p>
                      <strong>Entretien :</strong> {product.care}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: OFFERS & EXPRESS ORDER FORM IN 1 UNIFIED BLOCK ================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Product Title, Subtitle & Stock */}
            <div className="space-y-1.5 pb-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En stock ({product.stockCount} disponibles)
                </span>
                <button
                  onClick={onBack}
                  className="text-xs text-neutral-500 hover:text-[#7A283B] transition-colors cursor-pointer"
                >
                  ← Retour au catalogue
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase text-neutral-900 tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* ================= UNIFIED SIMPLIFIED BLOCK: OFFERS + FORM ================= */}
            <div
              id="order-unified-block"
              className="bg-white rounded-2xl border-2 border-neutral-200/90 shadow-sm p-4 sm:p-5 space-y-4"
            >
              {/* Block Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600">
                    <Truck size={16} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black font-heading uppercase text-neutral-900 tracking-wide">
                    Offres & Commande Express
                  </h3>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Livraison Gratuite
                </span>
              </div>

              {/* 1. QUANTITY OFFERS STACKED ONE BELOW THE OTHER WITH INTEGRATED VARIANTS */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black mr-1.5 shadow-xs">
                      1
                    </span>
                    {isPackComplet ? 'Choisissez votre offre :' : (hasVariants ? 'Choisissez votre offre & couleurs :' : 'Choisissez votre offre :')}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">Cliquez pour sélectionner</span>
                </div>

                <div className="space-y-2.5">
                  {product.offers.map((offer) => {
                    const isSelected = selectedOfferId === offer.id;
                    return (
                      <div
                        key={offer.id}
                        onClick={() => handleOfferChange(offer.id)}
                        className={`w-full rounded-xl border-2 transition-all cursor-pointer p-3 sm:p-3.5 relative overflow-hidden ${
                          isSelected
                            ? 'border-orange-500 bg-gradient-to-br from-orange-500/[0.08] via-amber-500/[0.03] to-transparent shadow-xs ring-2 ring-orange-500/25'
                            : 'border-neutral-200/90 bg-[#FCFAF8] hover:border-orange-300 hover:bg-orange-50/25'
                        }`}
                      >
                        {/* Top row: Radio, Title, Badge, and Price */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            {/* Radio indicator */}
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-500 ring-2 ring-orange-200'
                                  : 'border-neutral-300 bg-white'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>

                            {/* Title & Badge */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs sm:text-sm tracking-tight ${
                                  isSelected ? 'font-black text-neutral-900' : 'font-bold text-neutral-800'
                                }`}
                              >
                                {offer.title}
                              </span>

                              {offer.badge && (
                                <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                                  {offer.badge}
                                </span>
                              )}

                              {offer.bonus && (
                                <span className="hidden sm:inline-block text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                                  {offer.bonus}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right shrink-0">
                            <div className="flex items-baseline justify-end gap-1.5">
                              <span className="text-sm sm:text-base font-black text-neutral-900">
                                {offer.totalPrice}{' '}
                                <span className={`text-[10px] sm:text-xs font-bold ${isSelected ? 'text-orange-600' : 'text-neutral-700'}`}>
                                  MAD
                                </span>
                              </span>
                              {offer.originalPrice && (
                                <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                                  {offer.originalPrice} MAD
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Integrated Variant Choice when selected (only if single product has multiple color variants) */}
                        {isSelected && !isPackComplet && hasVariants && product.colors && product.colors.length > 1 && (
                          <div
                            className="mt-3 pt-2.5 border-t border-orange-200/60 space-y-2 animate-fadeIn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">
                                  {offer.quantity === 1
                                    ? 'Couleur au choix :'
                                    : `Couleurs (${offer.quantity} pièces) :`}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {Array.from({ length: offer.quantity }).map((_, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-1.5 sm:p-2 bg-white rounded-lg border border-neutral-200 text-xs shadow-xs"
                                  >
                                    <span className="text-neutral-500 font-medium text-[11px] pl-1">
                                      {offer.quantity === 1 ? 'Couleur :' : `Pièce ${idx + 1} :`}
                                    </span>
                                    <select
                                      value={
                                        (offer.quantity === 1 ? selectedColor : packColors[idx]) ||
                                        product.colors?.[0]?.name ||
                                        ''
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (offer.quantity === 1) {
                                          setSelectedColor(val);
                                        }
                                        handlePackColorChange(idx, val);
                                      }}
                                      className="bg-neutral-50 border border-neutral-200 text-neutral-800 text-[11px] rounded px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                                    >
                                      {product.colors.map((c) => (
                                        <option key={c.name} value={c.name}>
                                          {c.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SYSTEM TO COMPLETE THE PACK COMPLET BY CHOOSING PRODUCT VARIANTS (SIMPLE & EASY) */}
              {isPackComplet && (
                <div className="bg-[#FAF7F2] rounded-xl p-3 sm:p-3.5 border border-orange-200/90 shadow-2xs space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 flex items-center">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black mr-1.5 shadow-xs">
                        2
                      </span>
                      Complétez votre pack :
                    </span>
                    <span className="text-[10px] text-orange-700 font-bold bg-orange-100/80 px-2 py-0.5 rounded-full border border-orange-200">
                      1 Sac + 1 Visière + 2 Bandeaux inclus
                    </span>
                  </div>

                  {/* If Offer is Duo (2 coffrets) */}
                  {currentOffer.quantity > 1 && (
                    <div className="flex gap-2">
                      {Array.from({ length: currentOffer.quantity }).map((_, packIdx) => (
                        <button
                          key={packIdx}
                          type="button"
                          onClick={() => setActivePackIndex(packIdx)}
                          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            activePackIndex === packIdx
                              ? 'bg-white border-orange-500 text-orange-700 shadow-xs'
                              : 'bg-neutral-100/90 border-neutral-200 text-neutral-600 hover:bg-neutral-200/60'
                          }`}
                        >
                          Coffret {packIdx + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 4 items with enlarged preview image of selected color and elegant dropdown menus */}
                  <div className="space-y-3">
                    {PACK_COMPLET_ITEMS.map((item) => {
                      const currentPackSel = packCustomSelections[activePackIndex] || packCustomSelections[0];
                      const selectedVariant = currentPackSel?.[item.id] || item.defaultVariant;
                      const selectedVariantObj = item.variants.find((v) => v.name === selectedVariant);
                      const selectedImage = selectedVariantObj?.image || item.defaultImage;
                      const isFixed = item.variants.length <= 1;

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-neutral-200 shadow-2xs transition-all hover:border-orange-300 hover:shadow-xs"
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            {/* Enlarged preview image showing the product in selected color */}
                            <div
                              onClick={() => setActiveImage(selectedImage)}
                              title="Cliquer pour afficher en grand dans la galerie principale"
                              className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-2xs shrink-0 bg-neutral-50 group cursor-pointer transition-all hover:scale-[1.02] hover:border-orange-400"
                            >
                              <img
                                src={selectedImage}
                                alt={`${item.name} - ${selectedVariant}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              {selectedVariantObj && (
                                <span
                                  className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-xs"
                                  style={{ backgroundColor: selectedVariantObj.code }}
                                  title={`Couleur : ${selectedVariant}`}
                                />
                              )}
                              <span className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                                Zoom
                              </span>
                            </div>

                            {/* Product Info & Dropdown Menu */}
                            <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                                  {item.name}
                                </span>
                                <span className="text-[10px] sm:text-[11px] font-bold text-orange-800 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-full shrink-0">
                                  {selectedVariant}
                                </span>
                              </div>

                              {!isFixed ? (
                                <div className="space-y-1 pt-0.5">
                                  <label
                                    htmlFor={`pack-select-${item.id}`}
                                    className="text-[11px] font-semibold text-neutral-500 flex items-center justify-between"
                                  >
                                    <span>Choisir la couleur :</span>
                                    <span className="text-[10px] text-orange-600 font-medium hidden sm:inline">
                                      {item.variants.length} coloris disponibles
                                    </span>
                                  </label>
                                  <div className="relative flex items-center">
                                    <span
                                      className="absolute left-3 w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs pointer-events-none z-10 shrink-0"
                                      style={{ backgroundColor: selectedVariantObj?.code || '#171717' }}
                                    />
                                    <select
                                      id={`pack-select-${item.id}`}
                                      value={selectedVariant}
                                      onChange={(e) => handlePackItemSelect(activePackIndex, item.id, e.target.value)}
                                      className="w-full bg-[#FAF7F2]/90 hover:bg-white text-neutral-900 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl border border-neutral-300 pl-8.5 pr-8 py-2 sm:py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer shadow-2xs"
                                    >
                                      {item.variants.map((v) => (
                                        <option key={v.name} value={v.name}>
                                          {v.name}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown
                                      size={16}
                                      className="absolute right-3 text-neutral-400 pointer-events-none"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="text-[11px] sm:text-xs text-emerald-800 font-medium flex items-center gap-1.5 pt-0.5 bg-emerald-50/80 border border-emerald-200/80 rounded-lg sm:rounded-xl px-2.5 py-2">
                                  <CheckCircle size={14} className="shrink-0 text-emerald-600" />
                                  <span>Coloris unique : Toile Écru Naturelle Signature (Inclus)</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2 / 3. SIMPLIFIED EXPRESS DELIVERY FORM */}
              <form onSubmit={handleSubmitOrder} className="space-y-3 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black mr-1.5 shadow-xs">
                      {isPackComplet ? 3 : 2}
                    </span>
                    Vos coordonnées de livraison :
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Full Name */}
                  <div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (formErrors.fullName) setFormErrors((p) => ({ ...p, fullName: '' }));
                      }}
                      placeholder="Nom complet *"
                      className={`w-full px-3 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        formErrors.fullName ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[10px] text-red-500 mt-0.5">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-500 text-xs font-bold">
                        🇲🇦
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: '' }));
                        }}
                        placeholder="Téléphone (ex: 06 XX XX XX XX) *"
                        className={`w-full pl-8 pr-3 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          formErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[10px] text-red-500 mt-0.5">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* City */}
                  <div>
                    <input
                      type="text"
                      list="moroccan-cities"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (formErrors.city) setFormErrors((p) => ({ ...p, city: '' }));
                      }}
                      placeholder="Ville de livraison (ex: Casablanca, Tanger...) *"
                      className={`w-full px-3 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        formErrors.city ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                      }`}
                    />
                    <datalist id="moroccan-cities">
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    {formErrors.city && (
                      <p className="text-[10px] text-red-500 mt-0.5">{formErrors.city}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (formErrors.address) setFormErrors((p) => ({ ...p, address: '' }));
                      }}
                      placeholder="Adresse de livraison *"
                      className={`w-full px-3 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        formErrors.address ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-[10px] text-red-500 mt-0.5">{formErrors.address}</p>
                    )}
                  </div>
                </div>

                {/* Submit & Secondary Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    id="confirm-order-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-4 bg-gradient-to-r from-[#FF6B00] via-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:via-[#C2410C] hover:to-[#9A3412] text-white text-xs sm:text-sm md:text-base font-black uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/45 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer ring-2 ring-orange-400/30"
                  >
                    {isSubmitting ? (
                      <span>Confirmation en cours...</span>
                    ) : (
                      <>
                        <Truck size={18} />
                        <span>Commander • {currentOffer.totalPrice} MAD (Paiement à la livraison)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={15} />
                    <span>Commander rapidement par WhatsApp 💬</span>
                  </button>
                </div>

                {/* Reassurance footer */}
                <div className="pt-1 flex items-center justify-center gap-3 text-[10px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>Vérification à l'ouverture</span>
                  </span>
                  <span>•</span>
                  <span>Échange 14 jours</span>
                </div>
              </form>
            </div>

            {/* ================= 4 IMAGES & DESCRIPTIONS SECTION (UNDER ORDER FORM) ================= */}
            {!isPackComplet && (
              <section
                id="product-highlights-gallery"
                aria-label="Détails et points forts en images"
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden"
              >
                <div className="p-5 sm:p-6 text-center border-b border-neutral-100 bg-white">
                  <div className="inline-flex p-2 rounded-xl bg-[#7A283B]/10 text-[#7A283B] mb-2">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-heading uppercase text-neutral-900 tracking-wide">
                    Détails & Atouts en Images
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                    Découvrez en grand format la confection, les matières et le confort
                  </p>
                </div>

                <div className="divide-y divide-neutral-200/80">
                  {productHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      id={`highlight-item-${idx + 1}`}
                      className="group bg-white overflow-hidden"
                    >
                      {/* Centered Title Without Numbering */}
                      <div className="px-4 py-3.5 sm:px-6 sm:py-4 bg-white text-center">
                        <h4 className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 tracking-tight font-heading text-center">
                          {item.title}
                        </h4>
                      </div>

                      {/* Full-width Image Covering Entire Width of White Block - Square Format */}
                      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Descriptive Text */}
                      <div className="p-4 sm:p-5 sm:pb-6 bg-white text-center">
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* ================= COMPLÉTEZ VOTRE STYLE (CROSS-SELL / UPSELL SECTION) ================= */}
      <section
        id="complete-your-style"
        aria-label="Complétez votre style"
        className="w-full bg-[#F5F2EB]/70 border-t border-neutral-200/80 mt-14 sm:mt-20 py-12 sm:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/90 border border-orange-200 text-orange-800 text-[11px] font-bold uppercase tracking-wider mb-3 shadow-2xs">
              <Sparkles size={13} className="text-orange-600" />
              <span>Associations Idéales • Total Look</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading uppercase text-neutral-900 tracking-tight">
              Complétez votre style
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              Associez vos essentiels Oryven pour une silhouette harmonieuse et élégante, pensée du studio à la ville.
            </p>
          </div>

          {/* Suggested Products Grid (2 par ligne sur mobile, 2 sur tablette, 3 sur desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 xs:gap-3.5 sm:gap-6 lg:gap-8">
            {PRODUCTS.filter((p) => p.id !== product.id && p.slug !== product.slug)
              .slice(0, 3)
              .map((item) => {
                const isWishlisted = wishlistIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    id={`suggested-product-${item.id}`}
                    className="group bg-white rounded-xl sm:rounded-2xl border border-neutral-200/90 hover:border-orange-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Image Container with link */}
                    <div
                      onClick={() => {
                        if (onSelectProduct) {
                          onSelectProduct(item);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="relative aspect-square sm:aspect-4/3 w-full bg-neutral-100 overflow-hidden cursor-pointer"
                    >
                      {/* Badge */}
                      {item.badge && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-neutral-900/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-xs">
                          {item.badge}
                        </span>
                      )}

                      {/* Wishlist Button */}
                      {onToggleWishlist && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(item);
                          }}
                          aria-label="Ajouter aux favoris"
                          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
                            isWishlisted
                              ? 'bg-[#7A283B] text-white'
                              : 'bg-white/90 text-neutral-600 hover:bg-white hover:text-black'
                          }`}
                        >
                          <Heart
                            size={12}
                            className={`sm:w-3.5 sm:h-3.5 ${isWishlisted ? 'fill-current' : ''}`}
                          />
                        </button>
                      )}

                      {/* Main Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 bg-white/95 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5">
                          <span>Découvrir</span>
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3.5">
                      <div className="space-y-1 sm:space-y-1.5">
                        {/* Rating */}
                        <div className="flex items-center gap-1 text-amber-500 text-[10px] sm:text-[11px]">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} className="fill-current text-amber-400 sm:w-[11px] sm:h-[11px]" />
                            ))}
                          </div>
                          <span className="text-neutral-500 text-[9px] sm:text-[10px] font-medium ml-0.5 sm:ml-1">
                            ({item.reviewCount})
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => {
                            if (onSelectProduct) {
                              onSelectProduct(item);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="text-xs sm:text-base font-bold text-neutral-900 group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-1 font-heading"
                        >
                          {item.name}
                        </h3>

                        {/* Subtitle */}
                        <p className="text-[11px] sm:text-xs text-neutral-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                          {item.subtitle}
                        </p>

                        {/* Color swatches */}
                        {item.colors && item.colors.length > 1 && (
                          <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
                            <span className="hidden xs:inline text-[10px] text-neutral-400 font-medium">Couleurs :</span>
                            <div className="flex items-center gap-1">
                              {item.colors.map((c) => (
                                <span
                                  key={c.name}
                                  title={c.name}
                                  style={{ backgroundColor: c.code }}
                                  className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-neutral-300 shadow-2xs inline-block"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price & Action Button */}
                      <div className="pt-2 sm:pt-3 border-t border-neutral-100 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2">
                        <div>
                          <div className="flex items-baseline gap-1 sm:gap-1.5">
                            <span className="text-sm sm:text-lg font-black text-neutral-900">
                              {item.price} <span className="text-[10px] sm:text-xs font-bold text-orange-600">MAD</span>
                            </span>
                            {item.originalPrice && (
                              <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                                {item.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold block leading-tight">
                            En stock
                          </span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 mt-0.5 xs:mt-0">
                          <button
                            type="button"
                            onClick={() => {
                              const defaultOffer = item.offers[0];
                              const defaultColors = item.colors && item.colors.length > 0 ? [item.colors[0].name] : [];
                              onAddToCart(item, defaultOffer, defaultColors);
                            }}
                            className="flex-1 xs:flex-initial px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold tracking-wide flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title="Ajouter au panier"
                          >
                            <ShoppingBag size={12} className="sm:w-[13px] sm:h-[13px]" />
                            <span className="xs:inline sm:inline">Ajouter</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectProduct) {
                                onSelectProduct(item);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className="p-1.5 sm:p-2 border border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-black rounded-lg sm:rounded-xl text-xs transition-colors cursor-pointer bg-neutral-50 hover:bg-white"
                            title="Voir la fiche détaillée"
                          >
                            <ArrowRight size={13} className="sm:w-[14px] sm:h-[14px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Reassurance strip */}
          <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-neutral-900">
                  Livraison Express Gratuite au Maroc
                </p>
                <p className="text-[11px] text-neutral-500">
                  Combinez plusieurs accessoires pour bénéficier d'un colis unique prioritaire et du paiement à la livraison.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle size={14} />
                Paiement en espèces à la livraison
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
