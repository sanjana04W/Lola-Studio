export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number; // in LKR
  originalPrice?: number; // for sale badges
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  dimensions?: string; // e.g. "15cm x 10cm x 22cm"
  material?: string; // e.g. "Handcrafted Cast Stone / Terracotta"
  color?: string; // e.g. "Warm Ivory / Earth Charcoal"
  stockQuantity: number;
  images: string[];
  isPublished: boolean;
  isFeatured?: boolean;
  weight?: string; // e.g. "1.2kg"
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: SubCategory[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  dimensions?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'COD';
  paymentStatus: 'Pending' | 'Paid';
  cancellationReason?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  isRepeatCustomer: boolean;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  email: string;
  location: string;
  codFeeColombo: number;
  codFeeOther: number;
  freeDeliveryThreshold: number;
  isStoreOpen: boolean;
  announcementText: string;
  metaPixelId: string;
  tiktokPixelId: string;
}
