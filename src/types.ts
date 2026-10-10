export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  photoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number; // in INR
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  badge?: string;
  shortDescription: string;
  fullDescription: string;
  materials: string[];
  dimensions: string;
  handmadeDetails: string;
  careInstructions: string;
  shippingInfo: string;
  images: string[];
  reviews: ProductReview[];
  collectionId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
  accentColor?: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  image: string;
  description: string;
  tag: string;
  productIds: string[];
  featuredColor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  apartment?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  deliveryNotes?: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses: SavedAddress[];
  isAdmin: boolean;
  createdAt: string;
}

export type OrderTrackingStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Crafting Your Piece'
  | 'Quality Check'
  | 'Packed with Love'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface TrackingStep {
  title: OrderTrackingStatus;
  description: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

export type RefundStatus = 'None' | 'Requested' | 'Refunded' | 'Partially Refunded';

export interface RefundRecord {
  id: string;
  amount: number;
  reason: string;
  date: string;
  refundTxnId?: string;
  notes?: string;
}

export interface AdminCredentials {
  adminId: string;
  password: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  date: string; // e.g. "2026-08-29"
  time?: string; // e.g. "10:30 AM"
  createdAt?: string; // ISO date string e.g. "2026-08-29T10:30:00.000Z"
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    deliveryNotes?: string;
  };
  shippingMethod: 'Standard Craft Shipping' | 'Express Studio Delivery';
  courierName?: string;
  trackingNumber?: string;
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Partially Refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: OrderTrackingStatus;
  trackingSteps: TrackingStep[];
  refundStatus?: RefundStatus;
  refundAmount?: number;
  refundReason?: string;
  refundDate?: string;
  refundTxnId?: string;
  refundRecords?: RefundRecord[];
  cancellationReason?: string;
  cancelledBy?: 'Customer' | 'Admin';
  cancelledDate?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue: number;
  expiresAt: string;
  description: string;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  replied: boolean;
}

export interface FAQItem {
  id: string;
  category: 'Orders' | 'Shipping' | 'Payments' | 'Care & Materials' | 'Returns & Refunds';
  question: string;
  answer: string;
}

export interface StoreSettings {
  freeShippingThreshold: number;
  email: string;
  phone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  youtubeName: string;
  youtubeUrl: string;
  isStoreActive?: boolean;
  storeInactiveMessage?: string;
  offlineResumingNotice?: string;
  announcementText?: string;
  announcementHighlight?: string;
  showAnnouncementBar?: boolean;
}
