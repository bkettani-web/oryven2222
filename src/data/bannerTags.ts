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
    top: '11%',
    left: '74%',
    align: 'right',
  },
  {
    id: 'oryven-tote-bag',
    slug: 'oryven-tote-bag',
    label: 'Tote Bag',
    price: 299,
    top: '51%',
    left: '57%',
    align: 'left',
  },
  {
    id: 'oryven-yoga-headband',
    slug: 'oryven-yoga-headband',
    label: 'Bandeau',
    price: 299,
    top: '41%',
    left: '73%',
    align: 'right',
  },
  {
    id: 'oryven-non-slip-grip-socks',
    slug: 'oryven-non-slip-grip-socks',
    label: 'Chaussettes',
    price: 249,
    top: '73%',
    left: '70%',
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
    top: '10%',
    left: '49%',
    align: 'right',
  },
  {
    id: 'oryven-tote-bag',
    slug: 'oryven-tote-bag',
    label: 'Tote Bag',
    price: 299,
    top: '48%',
    left: '20%',
    align: 'right',
  },
  {
    id: 'oryven-yoga-headband',
    slug: 'oryven-yoga-headband',
    label: 'Bandeau',
    price: 299,
    top: '36%',
    left: '44%',
    align: 'right',
  },
  {
    id: 'oryven-non-slip-grip-socks',
    slug: 'oryven-non-slip-grip-socks',
    label: 'Chaussettes',
    price: 249,
    top: '74%',
    left: '57%',
    align: 'left',
  },
];
