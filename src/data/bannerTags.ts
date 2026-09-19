import { ProductTag } from '../types';

/**
 * Coordonnées officielles des pings produits sur les bannières.
 * Ces coordonnées sont la SOURCE DE VÉRITÉ unique pour tous les visiteurs,
 * sur Vercel comme en développement local.
 */

// Bannière Version Ordinateur (1918 x 820 px)
export const OFFICIAL_DESKTOP_BANNER_TAGS: ProductTag[] = [
  {
    id: 'oryven-visor',
    slug: 'oryven-visor',
    label: 'Visière',
    price: 349,
    top: '24%',
    left: '25%',
    align: 'right',
  },
  {
    id: 'oryven-tote-bag',
    slug: 'oryven-tote-bag',
    label: 'Tote Bag',
    price: 299,
    top: '52%',
    left: '48%',
    align: 'left',
  },
  {
    id: 'oryven-yoga-headband',
    slug: 'oryven-yoga-headband',
    label: 'Bandeau',
    price: 299,
    top: '32%',
    left: '68%',
    align: 'right',
  },
  {
    id: 'oryven-non-slip-grip-socks',
    slug: 'oryven-non-slip-grip-socks',
    label: 'Chaussettes',
    price: 279,
    top: '72%',
    left: '80%',
    align: 'left',
  },
];

// Bannière Version Mobile (1:1 carré 1254 x 1254 px)
export const OFFICIAL_MOBILE_BANNER_TAGS: ProductTag[] = [
  {
    id: 'oryven-visor',
    slug: 'oryven-visor',
    label: 'Visière',
    price: 349,
    top: '16%',
    left: '50%',
    align: 'right',
  },
  {
    id: 'oryven-tote-bag',
    slug: 'oryven-tote-bag',
    label: 'Tote Bag',
    price: 299,
    top: '38%',
    left: '60%',
    align: 'left',
  },
  {
    id: 'oryven-yoga-headband',
    slug: 'oryven-yoga-headband',
    label: 'Bandeau',
    price: 299,
    top: '58%',
    left: '42%',
    align: 'right',
  },
  {
    id: 'oryven-non-slip-grip-socks',
    slug: 'oryven-non-slip-grip-socks',
    label: 'Chaussettes',
    price: 279,
    top: '80%',
    left: '58%',
    align: 'left',
  },
];
