/**
 * Meta Pixel Tracking Service
 * Pixel ID: 2072921564110635
 * Tracks visitor actions, browsing, cart updates, and e-commerce purchases
 */

import { Product, ProductOffer, CartItem, CustomerOrder } from '../types';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const PIXEL_ID = '2072921564110635';

/**
 * Safe helper to invoke window.fbq if present
 */
function callFbq(...args: unknown[]): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq(...args);
    } catch (e) {
      console.warn('[Meta Pixel] Error sending event:', e);
    }
  }
}

/**
 * Track PageView event
 */
export function trackPageView(pageName?: string): void {
  if (pageName) {
    callFbq('track', 'PageView', { page_name: pageName });
  } else {
    callFbq('track', 'PageView');
  }
}

/**
 * Track ViewContent when a user views a product
 */
export function trackViewContent(product: Product): void {
  callFbq('track', 'ViewContent', {
    content_name: product.name,
    content_category: 'Accessoires Sport & Lifestyle',
    content_ids: [product.id, product.slug],
    content_type: 'product',
    value: product.price,
    currency: 'MAD',
  });
}

/**
 * Track AddToCart when user adds a product or offer to the cart
 */
export function trackAddToCart(
  product: Product,
  offer: ProductOffer,
  quantity = 1,
  selectedColors?: string[]
): void {
  const totalItems = (offer.quantity || 1) * quantity;
  const totalPrice = Number(Number(offer.totalPrice * quantity).toFixed(2));

  callFbq('track', 'AddToCart', {
    content_name: product.name,
    content_ids: [product.id, product.slug],
    content_type: 'product',
    contents: [
      {
        id: product.id,
        quantity: totalItems,
        item_price: Number(Number(offer.unitPrice || offer.totalPrice).toFixed(2)),
      },
    ],
    value: totalPrice,
    currency: 'MAD',
    num_items: totalItems,
    offer_id: offer.id,
    offer_title: offer.title,
    colors: selectedColors && selectedColors.length > 0 ? selectedColors.join(', ') : undefined,
  });
}

/**
 * Track InitiateCheckout when user clicks to finalize checkout
 */
export function trackInitiateCheckout(items: CartItem[], totalAmount: number): void {
  const contentIds = items.map((i) => i.product.id);
  const totalCount = items.reduce(
    (acc, item) => acc + (item.offer.quantity || 1) * (item.quantity || 1),
    0
  );
  const contents = items.map((item) => ({
    id: item.product.id,
    quantity: (item.offer.quantity || 1) * (item.quantity || 1),
    item_price: Number(Number(item.offer.totalPrice || item.product.price).toFixed(2)),
  }));

  callFbq('track', 'InitiateCheckout', {
    content_ids: contentIds,
    content_type: 'product',
    contents,
    value: Number(Number(totalAmount).toFixed(2)),
    currency: 'MAD',
    num_items: totalCount,
  });
}

/**
 * Track Purchase event on order confirmation
 */
export function trackPurchase(order: CustomerOrder): void {
  const contentIds = order.items.map((i) => i.product.id);
  const contentNames = order.items.map((i) => i.product.name).join(', ');
  const totalCount = order.items.reduce(
    (acc, item) => acc + (item.offer.quantity || 1) * (item.quantity || 1),
    0
  );

  const numericValue = Number(Number(order.totalAmount).toFixed(2));

  const contents = order.items.map((item) => ({
    id: item.product.id,
    quantity: (item.offer?.quantity || 1) * (item.quantity || 1),
    item_price: Number(Number(item.offer?.totalPrice || item.product.price).toFixed(2)),
  }));

  callFbq(
    'track',
    'Purchase',
    {
      content_ids: contentIds,
      content_name: contentNames,
      content_type: 'product',
      contents,
      value: numericValue,
      currency: 'MAD',
      num_items: totalCount,
      order_id: order.orderId,
    },
    { eventID: order.orderId }
  );
}

/**
 * Track AddToWishlist event
 */
export function trackAddToWishlist(product: Product): void {
  callFbq('track', 'AddToWishlist', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'MAD',
  });
}

/**
 * Track Contact event (WhatsApp, Call, Form assistance)
 */
export function trackContact(method: 'whatsapp' | 'call' | 'support' = 'whatsapp'): void {
  callFbq('track', 'Contact', {
    contact_method: method,
  });
}

/**
 * Track Search query event
 */
export function trackSearch(searchQuery: string): void {
  if (!searchQuery.trim()) return;
  callFbq('track', 'Search', {
    search_string: searchQuery.trim(),
  });
}
