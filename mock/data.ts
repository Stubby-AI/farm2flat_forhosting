import { Product, SubscriptionBox, SubscriptionSize, Order, User, Farmer, Hub, CartItem, PortalUser, StaffMember, Supplier, Customer, PurchaseOrder, Business, Driver, Vehicle, Route, SeasonalTrend, Campaign, Ticket } from '../types';

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
    userId: 'b1', // This order is from a business customer
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


// --- New Mock Data for Portals ---

export const mockStaff: StaffMember[] = [
    { id: 's1', name: 'Maria Garcia', role: 'Farm Hand', contact: '555-1234' },
    { id: 's2', name: 'Tom Chen', role: 'Logistics Manager', contact: '555-5678' },
];

export const mockFarmerSuppliers: Supplier[] = [
    { id: 'sup1', name: 'Guelph Seed Co.', category: 'Seeds', contactEmail: 'sales@guelphseed.com' },
    { id: 'sup2', name: 'AgriPak Solutions', category: 'Packaging', contactEmail: 'contact@agripak.com' },
];

export const mockFarmerCustomers: Customer[] = [
    { id: 'cust1', name: 'The Corner Cafe', type: 'Restaurant', contactEmail: 'orders@cornercafe.com' },
    { id: 'cust2', name: 'Local Roots Grocer', type: 'Grocer', contactEmail: 'buyer@localroots.com' },
    { id: 'cust3', name: 'FrescoHub', type: 'Platform', contactEmail: 'procurement@frescohub.com' },
];

export const mockFarmerPurchases: PurchaseOrder[] = [
    { id: 'po1', supplierId: 'sup1', date: '2024-03-15', items: [{ name: 'Carrot Seeds', quantity: 50, unit: 'packet' }], total: 125.00, status: 'Received' },
    { id: 'po2', supplierId: 'sup2', date: '2024-05-10', items: [{ name: 'Cardboard Boxes', quantity: 200, unit: 'box' }], total: 350.00, status: 'Pending' },
];


export const mockFarmers: Farmer[] = [
    { 
        id: 'f1', 
        name: 'Green Acres Farm', 
        location: 'Guelph, ON', 
        specialty: ['Vegetables', 'Root Crops'],
        geolocation: { lat: 43.5448, lng: -80.2482 },
        certifications: ['Certified Organic', 'Local Food Plus'],
        description: 'A family-owned farm specializing in root vegetables and sustainable farming practices.',
        farmImageUrl: 'https://picsum.photos/id/1015/600/400',
        operatingHours: 'Mon-Sat: 9am - 5pm',
        publicProfileBlurb: 'Fresh, organic vegetables straight from our family to yours.',
        productIds: ['p1', 'p3', 'p7'],
        staff: mockStaff,
        suppliers: mockFarmerSuppliers,
        customers: mockFarmerCustomers,
        purchaseHistory: mockFarmerPurchases,
    },
    { id: 'f2', name: 'Sunnyvale Orchards', location: 'Niagara, ON', specialty: ['Fruits', 'Apples', 'Tomatoes'], productIds: ['p2', 'p5'] },
    { id: 'f3', name: 'Riverbend Gardens', location: 'Ottawa, ON', specialty: ['Leafy Greens', 'Herbs'], productIds: ['p4', 'p6', 'p8'] },
    { id: 'f4', name: 'Prairie Harvest', location: 'Brant, ON', specialty: ['Grains', 'Potatoes'] },
];

export const mockBusinessProducts: Product[] = [
    { id: 'bp1', name: 'Garden Salad', price: 12.50, unit: 'plate', imageUrl: 'https://picsum.photos/id/203/400/300', farmer: 'The Grand Restaurant', moq: 1, isSeasonal: true },
    { id: 'bp2', name: 'Tomato Soup', price: 8.00, unit: 'bowl', imageUrl: 'https://picsum.photos/id/204/400/300', farmer: 'The Grand Restaurant', moq: 1, isSeasonal: true },
    { id: 'bp3', name: 'Roast Chicken', price: 24.00, unit: 'plate', imageUrl: 'https://picsum.photos/id/205/400/300', farmer: 'The Grand Restaurant', moq: 1, isSeasonal: false },
];

export const mockBusinesses: Business[] = [
    {
        id: 'b1',
        name: 'The Grand Restaurant',
        type: 'Restaurant',
        location: 'Toronto, ON',
        contactEmail: 'buyer@restaurant.com',
        staff: [{ id: 'bs1', name: 'Chef Antoine', role: 'Head Chef', contact: 'chef@restaurant.com' }],
        suppliers: [{id: 'fhub', name: 'FrescoHub', category: 'Fresh Produce', contactEmail: 'sales@frescohub.com'}],
        customers: [], // B2C customers not tracked here
        purchaseHistory: mockOrders.filter(o => o.userId === 'b1'),
        products: mockBusinessProducts,
    }
]


export const mockFarmerProducts: Product[] = [
    { ...mockProducts[0], category: 'Vegetable', subcategory: 'Root', availableDate: '2024-05-20', status: 'Available', quantity: 150, farmer: 'Green Acres Farm', moq: 10, isSeasonal: true }, // Carrots
    { ...mockProducts[2], category: 'Vegetable', subcategory: 'Fruit Vegetable', availableDate: '2024-05-22', status: 'Available', quantity: 80, farmer: 'Green Acres Farm', moq: 5, isSeasonal: true }, // Peppers
    { ...mockProducts[6], category: 'Vegetable', subcategory: 'Tuber', availableDate: '2024-05-25', status: 'Unavailable', quantity: 0, farmer: 'Green Acres Farm', moq: 20, isSeasonal: false }, // Potatoes
    { ...mockProducts[3], category: 'Vegetable', subcategory: 'Leafy Green', availableDate: '2024-05-20', status: 'Available', quantity: 120, farmer: 'Riverbend Gardens', moq: 15, isSeasonal: true }, // Spinach
    { ...mockProducts[4], category: 'Fruit', subcategory: 'Pome', availableDate: '2024-06-01', status: 'Available', quantity: 200, farmer: 'Sunnyvale Orchards', moq: 25, isSeasonal: false }, // Apples
];

export const mockImportedFarmerProducts: Product[] = [
    { id: 'imp1', name: 'Zucchini', price: 1.75, unit: 'each', imageUrl: 'https://picsum.photos/id/211/400/300', farmer: 'Green Acres Farm', category: 'Vegetable', subcategory: 'Fruit Vegetable', availableDate: '2024-06-10', status: 'Available', quantity: 90, moq: 12, isSeasonal: true },
    { id: 'imp2', name: 'Strawberries', price: 5.50, unit: 'quart', imageUrl: 'https://picsum.photos/id/1082/400/300', farmer: 'Green Acres Farm', category: 'Fruit', subcategory: 'Berry', availableDate: '2024-06-15', status: 'Available', quantity: 60, moq: 1, isSeasonal: true },
    { id: 'imp3', name: 'Asparagus', price: 4.25, unit: 'bunch', imageUrl: 'https://picsum.photos/id/495/400/300', farmer: 'Green Acres Farm', category: 'Vegetable', subcategory: 'Stem', availableDate: '2024-06-05', status: 'Unavailable', quantity: 0, moq: 10, isSeasonal: true },
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

// --- Super Admin Mock Data ---
export const mockDrivers: Driver[] = [
    { id: 'd1', name: 'Carlos Ray', vehicleId: 'v1', contact: '555-0101', status: 'On Duty' },
    { id: 'd2', name: 'Susan Ivanova', vehicleId: 'v2', contact: '555-0102', status: 'Off Duty' },
    { id: 'd3', name: 'Michael Garibaldi', vehicleId: 'v3', contact: '555-0103', status: 'On Duty' },
];

export const mockVehicles: Vehicle[] = [
    { id: 'v1', licensePlate: 'FRESH-1', model: 'Refrigerated Van', capacity: 500, status: 'Active' },
    { id: 'v2', licensePlate: 'FARM-2-U', model: 'Cargo Van', capacity: 300, status: 'Active' },
    { id: 'v3', licensePlate: 'DELIVER-3', model: 'Refrigerated Van', capacity: 500, status: 'Maintenance' },
];

export const mockRoutes: Route[] = [
    { id: 'r1', driverId: 'd1', hubId: 'h1', orders: ['o1', 'o3'], status: 'In Progress', estimatedCompletion: '2024-07-28 14:00' },
    { id: 'r2', driverId: 'd3', hubId: 'h2', orders: ['o2'], status: 'Planned', estimatedCompletion: '2024-07-28 16:00' },
];

export const mockSeasonalTrends: SeasonalTrend[] = [
    { productId: 'p2', productName: 'Heirloom Tomatoes', months: [5, 6, 7, 8], trend: 'Peak Season' },
    { productId: 'p5', productName: 'Gala Apples', months: [8, 9, 10], trend: 'Peak Season' },
    { productId: 'imp2', productName: 'Strawberries', months: [5, 6], trend: 'High Supply' },
    { productId: 'p7', productName: 'Potatoes', months: [0,1,2,3,4,5,6,7,8,9,10,11], trend: 'High Supply' },
    { productId: 'imp3', productName: 'Asparagus', months: [3, 4, 5], trend: 'Low Supply' },
];

export const mockCampaigns: Campaign[] = [
    { id: 'c1', name: 'Summer Fruit Festival', targetSegment: 'All Users', channel: 'Email', status: 'Completed', sentDate: '2024-06-15', engagementRate: 22.5 },
    { id: 'c2', name: 'Welcome Offer - 10% Off', targetSegment: 'New Users', channel: 'Push Notification', status: 'Active' },
    { id: 'c3', name: 'Weekly Veggie Box Promo', targetSegment: 'High-Value Customers', channel: 'SMS', status: 'Draft' },
];

export const mockTickets: Ticket[] = [
    { id: 't1', userId: 'u1', userName: 'Jane Doe', userRole: 'user', subject: 'Late Delivery', description: 'My order o3 was supposed to arrive yesterday but I have not received it yet.', status: 'Open', priority: 'High', createdDate: '2023-11-03', assignedTo: 'admin1' },
    { id: 't2', userId: 'farmer1', userName: 'John Farmer', userRole: 'farmer', subject: 'Payment not received for Q3', description: 'The quarterly payment for our produce has not been reflected in our account.', status: 'In Progress', priority: 'Urgent', createdDate: '2023-10-30', assignedTo: 'admin1' },
    { id: 't3', userId: 'biz1', userName: 'The Grand Restaurant', userRole: 'business', subject: 'Incorrect produce in order o2', description: 'We received spinach instead of kale in our last order.', status: 'Resolved', priority: 'Medium', createdDate: '2023-10-30' },
];