export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  farmer: string;
  category?: string;
  subcategory?: string;
  availableDate?: string;
  status?: 'Available' | 'Unavailable' | 'Archived';
  quantity?: number;
}

export interface CartItem {
  cartId: string; // Unique ID for the item in the cart
  id: string; // Product or Subscription ID
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  type: 'product' | 'subscription';
  unit?: string;
  frequency?: SubscriptionFrequency;
  isTrial?: boolean;
}


export enum SubscriptionSize {
  Small = "Small (1 person)",
  Medium = "Medium (2-3 people)",
  Large = "Large (4-5 people)",
}

export enum SubscriptionFrequency {
  Weekly = "Weekly",
  BiWeekly = "Bi-Weekly",
  TriWeekly = "Every 3 Weeks",
  Monthly = "Monthly",
}

export interface SubscriptionBox {
  id: string;
  type: "Veggie" | "Fruit" | "Mixed";
  ethnicityFocus: "Standard" | "Asian" | "Mediterranean";
  size: SubscriptionSize;
  price: number;
  description: string;
  contentsSample: string[];
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  postalCode: string;
  orderHistory: Order[];
  familySize?: number;
  preferences?: ('organic' | 'local-only' | 'vegan')[];
  regularPurchaseList?: string[]; // array of product ids
  groceryBudget?: {
    amount: number;
    period: 'Weekly' | 'Monthly';
  };
  loyaltyCredits?: number;
}

export type PortalUserRole = 'admin' | 'farmer' | 'business';

export interface PortalUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: PortalUserRole;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Pending" | "Processing" | "Delivered";
  deliveryDetails?: {
    estimatedArrival: string;
    trackingStatus: 'Order Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  };
}

export interface Hub {
  id: string;
  postalCodePrefix: string;
  location: string;
}

// New detailed interfaces for portal management
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  contact: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string; // e.g., 'Seeds', 'Equipment', 'Packaging'
  contactEmail: string;
}

export interface Customer {
    id: string;
    name: string;
    type: 'Restaurant' | 'Grocer' | 'Individual';
    contactEmail: string;
}

export interface PurchaseOrder {
    id: string;
    supplierId: string;
    date: string;
    items: { name: string; quantity: number; unit: string; }[];
    total: number;
    status: 'Pending' | 'Received' | 'Cancelled';
}


export interface Farmer {
  id: string;
  name: string;
  location: string;
  specialty: string[];
  geolocation?: { lat: number; lng: number };
  certifications?: string[];
  description?: string;
  farmImageUrl?: string;
  operatingHours?: string;
  publicProfileBlurb?: string;
  productIds?: string[];
  staff?: StaffMember[];
  suppliers?: Supplier[];
  customers?: Customer[];
  purchaseHistory?: PurchaseOrder[];
}

export interface Business {
  id: string;
  name: string;
  type: 'Restaurant' | 'Cafe' | 'Grocer';
  location: string;
  contactEmail: string;
  staff?: StaffMember[];
  suppliers?: Supplier[];
  customers?: Customer[];
  purchaseHistory?: Order[]; // Purchases from FrescoHub
  products?: Product[]; // Their own products, e.g., menu items
}