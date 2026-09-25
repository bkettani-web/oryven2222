import heroSceneImg from '../assets/images/alo_hero_scene_1789548783650.jpg';
import wideHeroBannerImg from '../assets/images/alo_wide_hero_banner_1789549354120.jpg';
import wideLifestyleBannerImg from '../assets/images/alo_wide_lifestyle_banner_1789549368665.jpg';
import wideMovementBannerImg from '../assets/images/alo_wide_movement_banner_1789549386362.jpg';
import toteImg from '../assets/images/alo_tote_bag_1789548794871.jpg';
import headbandImg from '../assets/images/alo_headband_1789548805865.jpg';
import visorImg from '../assets/images/alo_visor_1789548816381.jpg';
import socksImg from '../assets/images/alo_grip_socks_1789548827394.jpg';
import lifestyleImg from '../assets/images/alo_lifestyle_model_1789548842780.jpg';
import toteDetailImg from '../assets/images/alo_detail_tote_texture_1789548892566.jpg';
import yogaMatDetailImg from '../assets/images/alo_detail_yoga_mat_1789548904208.jpg';
import { Product, Testimonial, FaqItem } from '../types';

export const IMAGES = {
  heroScene: heroSceneImg,
  wideHeroBanner:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1790028760/ChatGPT_Image_21_sept._2026_22_43_39_imf9oy.webp',
  mobileHeroBanner:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1790093742/ChatGPT_Image_22_sept._2026_17_15_19_un5qsx.webp',
  newsletterBanner:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789985797/ChatGPT_Image_21_sept._2026_11_15_20_dri9ht.webp',
  newsletterMobileBanner:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1790024685/ChatGPT_Image_21_sept._2026_22_04_20_kes1jp.webp',
  wideLifestyleBanner: wideLifestyleBannerImg,
  studioDesktopBanner:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1790093281/ChatGPT_Image_22_sept._2026_17_07_06_ydc4u8.webp',
  studioMobileBanner:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1790093196/ChatGPT_Image_22_sept._2026_17_05_06_qtmu3s.webp',
  wideMovementBanner:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789816142/ChatGPT_Image_19_sept._2026_12_08_46_mvaybv.webp',
  mobileMovementBanner:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789808701/ChatGPT_Image_19_sept._2026_10_04_35_br7ig8.webp',
  tote: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911773/ChatGPT_Image_20_sept._2026_14_42_24_mlkskn.webp',
  headband:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/bbyapbwquohxaokxpysv_jmqzsa.webp',
  visor:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_20_5_ldvl8u.webp',
  socks:
    'https://res.cloudinary.com/diptsoc4h/image/upload/v1789660961/j0dq1fvx1ejox3rdnqcc_zhfvmq.webp',
  lifestyle: lifestyleImg,
  toteDetail: toteDetailImg,
  yogaMatDetail: yogaMatDetailImg,
};

export const PRODUCTS: Product[] = [
  {
    id: 'oryven-tote-bag',
    slug: 'oryven-tote-bag',
    name: 'Oryven Tote Bag',
    subtitle: 'Le sac cabas iconique, spacieux et structuré pour votre quotidien actif.',
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviewCount: 128,
    badge: 'Incontournable',
    image: 'https://res.cloudinary.com/diptsoc4h/image/upload/v1789744916/vf21tchknrdevrjf5ct1_ir5iuw.webp',
    gallery: [
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789744916/vf21tchknrdevrjf5ct1_ir5iuw.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789744916/n4a7zxb3lzqlw0eu4dng_qgh2dr.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789744915/cdyjnu5hjwxkmrwrrsov_t6uof3.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789744915/zaenmv3kguxwg98bpy8s_s7tctv.webp',
    ],
    colors: [],
    description:
      'Conçu en toile de coton biologique ultrarésistante avec un renfort intérieur imperméabilisé, le Oryven Tote Bag allie minimalisme intemporel et praticité absolue. Doté d’un compartiment dédié pour votre bouteille ou tapis de yoga, d’une pochette zippée pour vos essentiels et de doubles anses ergonomiques.',
    features: [
      'Toile premium dense 480 g/m² indéchirable et déperlante',
      'Poche intérieure zippée avec attache-clés sécurisée',
      'Compartiment latéral pour gourde et maintien de tapis',
      'Fermoir magnétique robuste & finitions coutures renforcées',
      'Logo signature Oryven sérigraphié haute durabilité',
    ],
    materials: '100% Coton biologique épais, doublure déperlante certifiée Oeko-Tex.',
    dimensions: '48 cm (L) × 36 cm (H) × 16 cm (P) - Volume : 28 Litres',
    care: 'Nettoyage en surface avec un chiffon doux humide. Ne pas javelliser.',
    inStock: true,
    stockCount: 14,
    offers: [
      {
        id: 'x1',
        title: 'Pack Solo (1 Sac)',
        quantity: 1,
        unitPrice: 349,
        totalPrice: 349,
        originalPrice: 449,
        shipping: 'Livraison Gratuite au Maroc',
      },
      {
        id: 'x2',
        title: 'Duo Collection (2 Sacs)',
        quantity: 2,
        popular: true,
        badge: 'PLUS POPULAIRE -15%',
        unitPrice: 296,
        totalPrice: 593,
        originalPrice: 698,
        discountPercentage: 15,
        shipping: 'Livraison Express Gratuite',
        bonus: 'Économisez 105 MAD',
      },
      {
        id: 'x3',
        title: 'Pack Famille & Cadeau (3 Sacs)',
        quantity: 3,
        bestValue: true,
        badge: 'MEILLEURE OFFRE -25%',
        unitPrice: 261,
        totalPrice: 785,
        originalPrice: 1047,
        discountPercentage: 25,
        shipping: 'Livraison Express Prioritaire Gratuite',
        bonus: 'Économisez 262 MAD',
      },
    ],
  },
  {
    id: 'oryven-yoga-headband',
    slug: 'oryven-yoga-headband',
    name: 'Oryven Yoga Headband',
    subtitle: 'Bandeau absorbant ultra-doux avec maintien sans compression.',
    price: 179,
    originalPrice: 229,
    rating: 4.8,
    reviewCount: 96,
    badge: 'Bestseller',
    image:
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/bbyapbwquohxaokxpysv_jmqzsa.webp',
    gallery: [
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789664999/ozfmjvjz1zysmzpojycj_c2iyta.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789665000/vdbabkhg4bzbdpa5rtu8_rjhwtk.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789665002/sj6jdiegzs2k4tuum8ar_rzi7yi.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789665002/djtckeltvqfk2wjohbpg_jadrig.webp',
    ],
    colors: [
      {
        name: 'Noir',
        code: '#171717',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/bbyapbwquohxaokxpysv_jmqzsa.webp',
      },
      {
        name: 'Lavande',
        code: '#C8C2E6',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/etndrdmao8yzwvzbwcch_dda6mr.webp',
      },
      {
        name: 'Bleu',
        code: '#97C4E8',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/jwmbcpxtiqanr9uiklxa_ssrh4p.webp',
      },
      {
        name: 'Corail',
        code: '#F26D5B',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/cdbz8bgrcxdvje6kyeay_gyeifc.webp',
      },
      {
        name: 'Vert',
        code: '#2E543D',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/auitayygzmelcd9fdjbl_emckuz.webp',
      },
      {
        name: 'Beige',
        code: '#DACFB9',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789910363/lzwshgcbf1e7ntlzynue_ghlm7z.webp',
      },
    ],
    description:
      'Le bandeau Oryven Yoga Headband maintient parfaitement vos cheveux et absorbe l’humidité pendant les séances de yoga vinyasa, pilates, course ou pour vos journées actives. Sa maille côtelée ultra-douce s’adapte à toutes les morphologies de tête sans jamais serrer.',
    features: [
      'Tissu extensible microfibre Oryven Soft seconde peau',
      'Régulation thermique et séchage instantané QuickDry',
      'Grip intérieur anti-glisse discret',
      'Logo brodé ton sur ton haute définition',
      'Ne laisse aucune marque sur le front',
    ],
    materials: '87% Polyamide technique respirant, 13% Élasthanne Spandex.',
    dimensions: 'Taille unique extensible (largeur 8 cm).',
    care: 'Lavage en machine à 30°C cycle délicat. Séchage à l’air libre.',
    inStock: true,
    stockCount: 22,
    offers: [
      {
        id: 'x1',
        title: '1 Bandeau',
        quantity: 1,
        unitPrice: 179,
        totalPrice: 179,
        originalPrice: 229,
        shipping: 'Livraison Gratuite au Maroc',
      },
      {
        id: 'x2',
        title: 'Pack Duo 2 Bandeaux (Mix Couleurs)',
        quantity: 2,
        popular: true,
        badge: 'LE PLUS DEMANDÉ -15%',
        unitPrice: 152,
        totalPrice: 304,
        originalPrice: 358,
        discountPercentage: 15,
        shipping: 'Livraison Express Gratuite',
        bonus: 'Économisez 54 MAD',
      },
      {
        id: 'x3',
        title: 'Pack Trio (3 Bandeaux)',
        quantity: 3,
        bestValue: true,
        badge: 'MEILLEURE OFFRE -25%',
        unitPrice: 134,
        totalPrice: 402,
        originalPrice: 537,
        discountPercentage: 25,
        shipping: 'Livraison Express Gratuite',
        bonus: '3 couleurs au choix',
      },
    ],
  },
  {
    id: 'oryven-visor',
    slug: 'oryven-visor',
    name: 'Oryven Visor',
    subtitle: 'La visière de sport sculptée au design athlétique premium.',
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    reviewCount: 112,
    badge: 'Coup de Cœur',
    image:
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_20_5_ldvl8u.webp',
    gallery: [
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789657377/d1y5f1m6fmkr7n0vpequ_hrboez.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789657376/rctgcnwr21zh1glry8ql_zghrzb.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789657375/up2ffm3dwarna3yejibg_wpugyi.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789657378/j8fjvhrm390ajxr44cvn_h1md8u.webp',
    ],
    colors: [
      {
        name: 'Noir',
        code: '#171717',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_20_5_ldvl8u.webp',
      },
      {
        name: 'Bleu',
        code: '#8FA9BA',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_18_1_zttxjl.webp',
      },
      {
        name: 'Rose',
        code: '#B8395B',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_19_2_s702mz.webp',
      },
      {
        name: 'Mauve',
        code: '#A88B96',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911354/ChatGPT_Image_20_sept._2026_14_32_19_3_afxtpd.webp',
      },
      {
        name: 'Blanc',
        code: '#F5F3ED',
        image:
          'https://res.cloudinary.com/diptsoc4h/image/upload/v1789911355/ChatGPT_Image_20_sept._2026_14_32_19_4_qh8xk2.webp',
      },
    ],
    description:
      'Alliez protection solaire anti-UV et style architectural affûté avec la visière Oryven Visor. Dotée d’un bandeau intérieur absorbant éponge et d’une lanière ajustable velcro douce, elle accompagne vos séances de padel, running, tennis ou vos promenades ensoleillées.',
    features: [
      'Visière rigide profilée avec filtre solaire UPF 50+',
      'Bandeau frontal absorbant en tissu éponge molletonné',
      'Attache arrière réglable en micro-velcro anti-accroche cheveux',
      'Logo signature Oryven thermo-soudé haute définition',
      'Poids plume ultra-léger (seulement 65 g)',
    ],
    materials: 'Micro-sergé technique déperlant et doublure respirante.',
    dimensions: 'Circonférence ajustable de 52 à 62 cm.',
    care: 'Nettoyage délicat à la main à l’eau tiède.',
    inStock: true,
    stockCount: 9,
    offers: [
      {
        id: 'x1',
        title: '1 Visière',
        quantity: 1,
        unitPrice: 299,
        totalPrice: 299,
        originalPrice: 399,
        shipping: 'Livraison Gratuite au Maroc',
      },
      {
        id: 'x2',
        title: 'Pack Duo (2 Visières)',
        quantity: 2,
        popular: true,
        badge: 'COUP DE CŒUR -15%',
        unitPrice: 254,
        totalPrice: 508,
        originalPrice: 598,
        discountPercentage: 15,
        shipping: 'Livraison Express Gratuite',
        bonus: 'Économisez 90 MAD',
      },
      {
        id: 'x3',
        title: 'Pack Trio Club',
        quantity: 3,
        bestValue: true,
        badge: 'MEILLEUR PRIX -25%',
        unitPrice: 224,
        totalPrice: 672,
        originalPrice: 897,
        discountPercentage: 25,
        shipping: 'Livraison Express Gratuite',
        bonus: 'Livraison Prioritaire 24h',
      },
    ],
  },
  {
    id: 'oryven-non-slip-grip-socks',
    slug: 'oryven-non-slip-grip-socks',
    name: 'Oryven Non-Slip Grip Socks',
    subtitle: 'Chaussettes de pilates et yoga avec picots en silicone adhérents.',
    price: 279,
    originalPrice: 320,
    rating: 4.8,
    reviewCount: 87,
    badge: 'Essentiel Studio',
    image:
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789660961/j0dq1fvx1ejox3rdnqcc_zhfvmq.webp',
    gallery: [
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789660961/j0dq1fvx1ejox3rdnqcc_zhfvmq.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789660963/ibzin3lgqfeqflla8sac_oaa5bc.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789660965/vqxlnr0isp0r2swwe0ik_cvb4rz.webp',
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1789660965/rf71sk34tncgg4tafymw_z7uhs5.webp',
    ],
    colors: [
      { name: 'Orange', code: '#E25F2E' },
      { name: 'Noir', code: '#171717' },
      { name: 'Blanc', code: '#F8F6F0' },
    ],
    description:
      'Développées pour le Pilates Reformer, le Barre et le Yoga, les chaussettes Oryven Grip Socks garantissent une stabilité absolue au sol et sur machine. La semelle intègre des centaines de picots en silicone haute adhérence disposés stratégiquement sous la voûte plantaire.',
    features: [
      'Picots antidérapants en silicone médical 100% durable',
      'Support de voûte plantaire avec compression douce de maintien',
      'Coton peigné doux haute respirabilité anti-frottements',
      'Coutures plates au bout des orteils pour un confort zéro gêne',
      'Bord-côte côtelé qui reste bien en place sans comprimer la cheville',
    ],
    materials: '80% Coton peigné naturel, 17% Élasthanne, 3% Silicone.',
    dimensions: 'Pointures 35-40 (Stretch ergonomique).',
    care: 'Lavage à l’envers à 30°C pour préserver les grips en silicone.',
    inStock: false,
    stockCount: 0,
    offers: [
      {
        id: 'x1',
        title: '1 Paire',
        quantity: 1,
        unitPrice: 279,
        totalPrice: 279,
        originalPrice: 320,
        shipping: 'Livraison Gratuite au Maroc',
      },
      {
        id: 'x2',
        title: 'Pack Duo 2 Paires (Mix Couleurs)',
        quantity: 2,
        popular: true,
        badge: 'LE PLUS POPULAIRE -15%',
        unitPrice: 237,
        totalPrice: 474,
        originalPrice: 558,
        discountPercentage: 15,
        shipping: 'Livraison Express Gratuite',
        bonus: 'Économisez 84 MAD',
      },
      {
        id: 'x3',
        title: 'Pack Semaine 3 Paires',
        quantity: 3,
        bestValue: true,
        badge: 'SUPER PACK -25%',
        unitPrice: 209,
        totalPrice: 627,
        originalPrice: 837,
        discountPercentage: 25,
        shipping: 'Livraison Express Gratuite',
        bonus: 'Pochette de lavage offerte',
      },
    ],
  },
  {
    id: 'pack-complet-oryven',
    slug: 'pack-complet-oryven',
    name: 'Pack Complet Oryven (1 Sac + 1 Visière + 2 Bandeaux)',
    subtitle: 'L’ensemble complet signature : 1 Sac Tote Bag 28L, 1 Visière Sport et 2 Bandeaux Yoga Headband.',
    price: 750,
    originalPrice: 1006,
    rating: 5.0,
    reviewCount: 142,
    badge: 'Offre Complète Exclusive -25%',
    image:
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1790114072/ChatGPT_Image_22_sept._2026_22_54_08_yafylq.webp',
    gallery: [
      'https://res.cloudinary.com/diptsoc4h/image/upload/v1790114072/ChatGPT_Image_22_sept._2026_22_54_08_yafylq.webp',
    ],
    colors: [],
    description:
      'Le Pack Complet Oryven réunit 4 indispensables pour votre pratique sportive et vos déplacements : 1 grand Sac Tote Bag 28L en toile de coton biologique, 1 Visière athlétique UPF 50+ Oryven Visor, et 2 Bandeaux absorbants ultra-doux Oryven Yoga Headband aux coloris de votre choix. Profitez d’une réduction exclusive sur l’ensemble complet.',
    features: [
      '1x Oryven Tote Bag (toile bio 480 g/m² ultra-résistante avec rangements dédiés)',
      '1x Oryven Visor (visière anti-UV UPF 50+ avec bandeau éponge doux absorbant)',
      '2x Oryven Yoga Headbands (maintien élastique seconde peau et séchage QuickDry)',
      'Livraison express prioritaire 24h offerte partout au Maroc',
      'Paiement en espèces à la livraison avec vérification du colis avant paiement',
    ],
    materials: 'Coton biologique premium, microfibre Oryven Soft, sergé technique UV.',
    dimensions: '1 Sac Tote 28L + 1 Visière réglable + 2 Bandeaux élastiques (taille unique universelle).',
    care: 'Lavage délicat à 30°C pour les bandeaux et le sac, nettoyage au chiffon doux pour la visière.',
    inStock: true,
    stockCount: 8,
    offers: [
      {
        id: 'x1',
        title: 'Pack Complet (1 Sac + 1 Visière + 2 Bandeaux)',
        quantity: 1,
        unitPrice: 750,
        totalPrice: 750,
        originalPrice: 1006,
        discountPercentage: 25,
        badge: 'MEILLEURE OFFRE -256 MAD',
        shipping: 'Livraison Express Gratuite 24h',
        bonus: 'Économisez 256 MAD sur l’ensemble',
      },
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Sarah K.',
    city: 'Casablanca',
    rating: 5,
    comment: 'Une qualité incroyable ! Le tote est spacieux et élégant, je l’utilise tous les jours.',
    productName: 'Oryven Tote Bag',
    verified: true,
    date: 'Il y a 3 jours',
  },
  {
    id: '2',
    author: 'Inès M.',
    city: 'Rabat',
    rating: 5,
    comment: 'Confortable, stylé et pratique. Le headband reste bien en place même pendant les séances intenses !',
    productName: 'Oryven Yoga Headband',
    verified: true,
    date: 'Il y a 5 jours',
  },
  {
    id: '3',
    author: 'Nora A.',
    city: 'Marrakech',
    rating: 5,
    comment: 'Livraison rapide et service au top. Les chaussettes sont super confortables et le visor est magnifique !',
    productName: 'Oryven Visor & Socks',
    verified: true,
    date: 'Il y a 1 semaine',
  },
  {
    id: '4',
    author: 'Kenza B.',
    city: 'Tanger',
    rating: 5,
    comment: 'Les picots adhérents font toute la différence sur reformer pilates. Le maintien de la voûte plantaire est parfait.',
    productName: 'Oryven Non-Slip Grip Socks',
    verified: true,
    date: 'Il y a 10 jours',
  },
  {
    id: '5',
    author: 'Yasmine T.',
    city: 'Fès',
    rating: 5,
    comment: 'Très légère et protège parfaitement du soleil pendant mes séances de padel et de course. Finition haut de gamme.',
    productName: 'Oryven Visor',
    verified: true,
    date: 'Il y a 2 semaines',
  },
  {
    id: '6',
    author: 'Salma E.',
    city: 'Agadir',
    rating: 5,
    comment: 'J’ai commandé le pack complet, aucun regret ! La matière est douce, résistante et la livraison a été ultra rapide.',
    productName: 'Pack 4 Essentiels',
    verified: true,
    date: 'Il y a 2 semaines',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'livraison',
    question: 'Livraison',
    answer:
      'La livraison est 100% GRATUITE dans tout le Maroc. Nous expédions sous 24h à 48h à Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir et toutes les autres villes du Royaume. Vous recevez un SMS et un appel de notre livreur avant le passage.',
    iconName: 'truck',
  },
  {
    id: 'paiement',
    question: 'Paiement',
    answer:
      'Le paiement s’effectue en espèces directement au livreur lors de la réception de votre colis (Paiement à la livraison / Cash on Delivery). Vous avez le droit d’ouvrir et de vérifier votre colis avant de régler.',
    iconName: 'creditCard',
  },
  {
    id: 'echanges',
    question: 'Échanges & Retours',
    answer:
      'Vous disposez de 14 jours après réception pour demander un échange gratuit (changement de couleur ou de produit) ou un retour simple. Notre service client WhatsApp prend en charge la récupération à votre domicile.',
    iconName: 'rotateCcw',
  },
];

export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tanger',
  'Fès',
  'Agadir',
  'Mohammedia',
  'Kénitra',
  'Salé',
  'Tétouan',
  'Oujda',
  'Meknès',
  'El Jadida',
  'Nador',
  'Béni Mellal',
  'Safi',
  'Dakhla',
  'Laâyoune',
  'Essaouira',
  'Berrechid',
  'Taza',
  'Taroudant',
  'Ouarzazate',
  'Al Hoceïma',
  'Khémisset',
  'Guelmim',
];
