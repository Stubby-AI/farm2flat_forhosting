import { Product, SubscriptionBox, SubscriptionSize, Order, User, Farmer, Hub, CartItem, PortalUser } from '../types';

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Organic Carrots', price: 2.50, unit: 'bunch', imageUrl: 'https://picsum.photos/id/1080/400/300', farmer: 'Green Acres Farm' },
  { id: 'p2', name: 'Heirloom Tomatoes', price: 4.00, unit: 'lb', imageUrl: 'https://picsum.photos/id/1078/400/300', farmer: 'Sunnyvale Orchards' },
  { id: 'p3', name: 'Red Bell Peppers', price: 1.50, unit: 'each', imageUrl: 'https://picsum.photos/id/1025/400/300', farmer: 'Green Acres Farm' },
  { id: 'p4', name: 'Spinach', price: 3.00, unit: 'bag', imageUrl: 'https://picsum.photos/id/292/400/300', farmer: 'Riverbend Gardens' },
  { id: 'p5', name: 'Gala Apples', price: 3.50, unit: 'lb', imageUrl: 'https://picsum.photos/id/431/400/300', farmer: 'Sunnyvale Orchards' },
  { id: 'p6', name: 'Cucumbers', price: 1.00, unit: 'each', imageUrl: 'https://picsum.photos/id/202/400/300', farmer: 'Riverbend Gardens' },
  { id: 'p7', name: 'Potatoes', price: 2.75, unit: '5lb bag', imageUrl: 'https://picsum.photos/id/1043/400/300', farmer: 'Green Acres Farm' },
  { id: 'p8', name: 'Onions', price: 1.25, unit: 'lb', imageUrl: 'https://picsum.photos/id/1079/400/300', farmer: 'Riverbend Gardens' },
];

export const mockSubscriptionBoxes: SubscriptionBox[] = [
    {
        id: 'sb1',
        type: 'Veggie',
        ethnicityFocus: 'Standard',
        size: SubscriptionSize.Small,
        price: 25.00,
        description: 'A weekly selection of essential vegetables for one person.',
        contentsSample: ['Carrots', 'Potatoes', 'Onions', 'Broccoli', 'Lettuce'],
        imageUrl: 'https://picsum.photos/id/102/400/300',
    },
    {
        id: 'sb2',
        type: 'Veggie',
        ethnicityFocus: 'Standard',
        size: SubscriptionSize.Medium,
        price: 40.00,
        description: 'Perfect for couples or small families, a variety of fresh veggies.',
        contentsSample: ['Carrots', 'Potatoes', 'Onions', 'Broccoli', 'Lettuce', 'Tomatoes', 'Peppers'],
        imageUrl: 'https://picsum.photos/id/103/400/300',
    },
    {
        id: 'sb3',
        type: 'Fruit',
        ethnicityFocus: 'Standard',
        size: SubscriptionSize.Medium,
        price: 35.00,
        description: 'A delicious assortment of seasonal fruits for 2-3 people.',
        contentsSample: ['Apples', 'Bananas', 'Oranges', 'Berries', 'Grapes'],
        imageUrl: 'https://picsum.photos/id/104/400/300',
    },
    {
        id: 'sb4',
        type: 'Mixed',
        ethnicityFocus: 'Asian',
        size: SubscriptionSize.Medium,
        price: 45.00,
        description: 'A mix of fruits and veggies common in Asian cuisine.',
        contentsSample: ['Bok Choy', 'Daikon Radish', 'Ginger', 'Napa Cabbage', 'Apples', 'Pears'],
        imageUrl: 'https://picsum.photos/id/105/400/300',
    },
];

// FIX: Added cartId to mock order items to match the CartItem type.
const MOCK_ORDER_ITEMS: CartItem[] = mockProducts.slice(0, 3).map((p, i) => ({ ...p, quantity: i + 1, type: 'product', cartId: `mock-cart-${p.id}-${i}` }));

export const mockOrders: Order[] = [
  { 
    id: 'o1', 
    userId: 'u1', 
    date: '2023-10-26', 
    items: MOCK_ORDER_ITEMS, 
    total: MOCK_ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0), 
    status: 'Delivered',
    deliveryDetails: {
        estimatedArrival: 'October 27, 2023',
        trackingStatus: 'Delivered'
    } 
  },
  { 
    id: 'o2', 
    userId: 'u1', 
    date: '2023-10-29', 
    items: mockProducts.slice(2, 4).map((p,i) => ({ ...p, quantity: 1, type: 'product', cartId: `mock-cart-${p.id}-${i+3}` })), 
    total: 4.50, 
    status: 'Processing',
    deliveryDetails: {
        estimatedArrival: 'November 3, 2023',
        trackingStatus: 'Out for Delivery'
    }
  },
  { 
    id: 'o3', 
    userId: 'u1', 
    date: '2023-11-02', 
    items: mockProducts.slice(4, 7).map((p,i) => ({ ...p, quantity: 2, type: 'product', cartId: `mock-cart-${p.id}-${i+5}` })), 
    total: 12.50, 
    status: 'Pending',
    deliveryDetails: {
        estimatedArrival: 'November 8, 2023',
        trackingStatus: 'Order Confirmed'
    } 
  },
];

export const mockUser: User = {
    id: 'u1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    postalCode: 'M5V 2T6',
    orderHistory: mockOrders.filter(o => o.userId === 'u1'),
    familySize: 2,
    preferences: ['organic', 'local-only'],
    regularPurchaseList: ['p1', 'p4'],
    groceryBudget: { amount: 100, period: 'Weekly' },
    loyaltyCredits: 75.50,
};

export const mockPortalUsers: PortalUser[] = [
  {
    id: 'admin1',
    email: 'admin@frescohub.com',
    password: 'adminpassword',
    name: 'Super Admin',
    role: 'admin',
  },
  {
    id: 'farmer1',
    email: 'farmer@greenacres.com',
    password: 'farmerpassword',
    name: 'John Farmer (Green Acres)',
    role: 'farmer',
  },
  {
    id: 'biz1',
    email: 'buyer@restaurant.com',
    password: 'businesspassword',
    name: 'The Grand Restaurant',
    role: 'business',
  },
];


export const mockFarmers: Farmer[] = [
    { id: 'f1', name: 'Green Acres Farm', location: 'Guelph, ON', specialty: ['Vegetables', 'Root Crops'] },
    { id: 'f2', name: 'Sunnyvale Orchards', location: 'Niagara, ON', specialty: ['Fruits', 'Apples', 'Tomatoes'] },
    { id: 'f3', name: 'Riverbend Gardens', location: 'Ottawa, ON', specialty: ['Leafy Greens', 'Herbs'] },
    { id: 'f4', name: 'Prairie Harvest', location: 'Brant, ON', specialty: ['Grains', 'Potatoes'] },
];

export const mockHubs: Hub[] = [
    { id: 'h1', postalCodePrefix: 'M', location: 'Toronto Downtown Core' },
    { id: 'h2', postalCodePrefix: 'K', location: 'Ottawa Region' },
    { id: 'h3', postalCodePrefix: 'L', location: 'Greater Toronto Area' },
];

export const mockHubFarmerMap: Record<string, string[]> = {
    'h1': ['f1', 'f2'],
    'h2': ['f3'],
    'h3': ['f1', 'f4'],
};