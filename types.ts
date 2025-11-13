
export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  farmer: string;
}

export interface CartItem extends Product {
  quantity: number;
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  postalCode: string;
  orderHistory: Order[];
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Pending" | "Processing" | "Delivered";
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
