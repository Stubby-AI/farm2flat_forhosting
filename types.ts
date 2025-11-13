export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  farmer: string;
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

export interface Farmer {
  id: string;
  name: string;
  location: string;
  specialty: string[];
}