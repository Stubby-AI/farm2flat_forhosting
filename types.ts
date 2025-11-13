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
  moq?: number;
  isSeasonal?: boolean;
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
  currentContents?: string[]; // Array of product IDs
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
  lifetimeValue?: number;
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
  customerId?: string; // For direct customers of farmers/businesses
  date: string;
  items: CartItem[];
  total: number;
  status: "Pending" | "Processing" | "Delivered" | "Packed" | "Dispatched";
  deliveryDetails?: {
    estimatedArrival: string;
    trackingStatus: 'Order Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  };
  orderType?: 'one_time' | 'subscription';
  paymentStatus?: 'paid' | 'pending' | 'failed';
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
    type: 'Restaurant' | 'Grocer' | 'Individual' | 'Platform';
    contactEmail: string;
    orderHistory?: Order[];
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
  performanceScore?: number;
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

// === Super Admin Portal Types ===

export interface Driver {
  id: string;
  name: string;
  vehicleId: string;
  contact: string;
  status: 'On Duty' | 'Off Duty' | 'On Break';
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  capacity: number; // in kg
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface Route {
  id:string;
  driverId: string;
  hubId: string;
  orders: string[]; // order ids
  status: 'Planned' | 'In Progress' | 'Completed' | 'Delayed';
  estimatedCompletion: string;
}

export interface SeasonalTrend {
  productId: string;
  productName: string;
  months: number[]; // 0-11 for Jan-Dec
  trend: 'High Supply' | 'Peak Season' | 'Low Supply' | 'Off-Season';
}

export interface Campaign {
  id: string;
  name: string;
  targetSegment: 'All Users' | 'New Users' | 'High-Value Customers';
  channel: 'Email' | 'SMS' | 'Push Notification';
  status: 'Draft' | 'Active' | 'Completed';
  sentDate?: string;
  engagementRate?: number; // as percentage
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userRole: PortalUserRole | 'user';
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdDate: string;
  assignedTo?: string; // admin user id
}

export interface SourcedProduct {
  id: string;
  name: string;
  supplierId: string;
  supplierName: string;
  imageUrl: string;
  unit: string;
  category: string;
  costPrice: number;
  publishStatus: 'unpublished' | 'published';
  sellingPrice?: number;
  publishTarget?: ('retail' | 'wholesale')[];
  baseProductName?: string;
  availableQuantity?: number;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  method: 'Credit Card' | 'PayPal';
}

export interface Invoice {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'Customer' | 'Supplier';
  date: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface AISuggestion {
  name: string;
  reason: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  isStoreItem: boolean;
}

export interface Recipe {
  id: string;
  name:string;
  description: string;
  imageUrl: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
}
