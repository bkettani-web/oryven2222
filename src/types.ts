export interface ProductColor {
  name: string;
  code: string; // hex color for swatch
  image?: string;
}

export interface ProductOffer {
  id: 'x1' | 'x2' | 'x3';
  title: string;
  quantity: number;
  badge?: string;
  popular?: boolean;
  bestValue?: boolean;
  unitPrice: number;
  totalPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  shipping: string;
  bonus?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number; // in MAD
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  image: string;
  gallery: string[];
  colors: ProductColor[];
  description: string;
  features: string[];
  materials: string;
  dimensions?: string;
  care: string;
  inStock: boolean;
  stockCount: number;
  offers: ProductOffer[];
}

export interface CartItem {
  product: Product;
  selectedColor?: ProductColor;
  offer: ProductOffer;
  customColors?: string[]; // for multi-packs
  quantity: number;
}

export interface CustomerOrder {
  orderId: string;
  createdAt: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  status: 'confirmed' | 'processing' | 'shipped';
  paymentMethod: 'cash_on_delivery';
}

export interface Testimonial {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  productName?: string;
  verified: boolean;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  iconName: 'truck' | 'creditCard' | 'rotateCcw' | 'messageCircle';
}
