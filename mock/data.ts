import { Product, SubscriptionBox, SubscriptionSize, Order, User, Farmer, Hub, CartItem, PortalUser, StaffMember, Supplier, Customer, PurchaseOrder, Business, Driver, Vehicle, Route, SeasonalTrend, Campaign, Ticket, SourcedProduct, Payment, Invoice } from '../types';

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Organic Carrots', price: 2.50, unit: 'bunch', imageUrl: 'https://picsum.photos/id/1080/400/300', farmer: 'Green Acres Farm' },
  { id: 'p2', name: 'Heirloom Tomatoes', price: 4.00, unit: 'lb', imageUrl: 'https://picsum.photos/id/1078/400/300', farmer: 'Sunnyvale Orchards' },
  { id: 'p3', name: 'Red Bell Peppers', price: 1.50, unit: 'each', imageUrl: 'https://picsum.photos/id/1025/400/300', farmer: 'Green Acres Farm' },
  { id: 'p4', name: 'Spinach', price: 3.00, unit: 'bag', imageUrl: 'https://picsum.photos/id/292/400/300', farmer: 'Riverbend Gardens' },
  { id: 'p5', name: 'Gala Apples', price: 3.50, unit: 'lb', imageUrl: 'https://picsum.photos/id/431/400/300', farmer: 'Sunnyvale Orchards' },
  { id: 'p6', name: 'Cucumbers', price: 1.00, unit: 'each', imageUrl: 'https://picsum.photos/id/202/400/300', farmer: 'Riverbend Gardens' },
  { id: 'p7', name: 'Potatoes', price: 2.75, unit: '5lb bag', imageUrl: 'https://picsum.photos/id/1043/400/300', farmer: 'Green Acres Farm' },
  { id: 'p8', name: 'Onions', price: 1.25, unit: 'lb', imageUrl: 'https://picsum.photos/id/1079/400/300', farmer: 'Riverbend Gardens' },
  { id: 'p9', name: 'Sweet Potatoes', price: 3.20, unit: 'lb', imageUrl: 'https://picsum.photos/id/1044/400/300', farmer: 'Green Acres Farm' },
  { id: 'p10', name: 'Broccoli', price: 2.80, unit: 'head', imageUrl: 'https://picsum.photos/id/1045/400/300', farmer: 'Riverbend Gardens' }
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
        currentContents: ['p1', 'p7', 'p8', 'p10'],
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
        currentContents: ['p1', 'p7', 'p8', 'p10', 'p2', 'p3'],
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
        currentContents: ['p5'],
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
        currentContents: ['p1', 'p5'],
    },
];

// FIX: Explicitly type the return of the map to CartItem to prevent type widening on the 'type' property.
const MOCK_ORDER_ITEMS: CartItem[] = mockProducts.slice(0, 3).map((p, i): CartItem => ({
    cartId: `mock-cart-${p.id}-${i}`,
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    quantity: i + 1,
    type: 'product',
    unit: p.unit,
}));

export const mockOrders: Order[] = [
  { 
    id: 'o1', 
    userId: 'u1', 
    date: '2023-10-26', 
    items: MOCK_ORDER_ITEMS, 
    total: MOCK_ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0), 
    status: 'Delivered',
    orderType: 'one_time',
    paymentStatus: 'paid',
    deliveryDetails: {
        estimatedArrival: 'October 27, 2023',
        trackingStatus: 'Delivered'
    } 
  },
  { 
    id: 'o2', 
    userId: 'b1', // This order is from a business customer
    date: '2023-10-29', 
    // FIX: Explicitly type the return of the map to CartItem to prevent type widening on the 'type' property.
    items: mockProducts.slice(2, 4).map((p,i): CartItem => ({
        cartId: `mock-cart-${p.id}-${i+3}`,
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        quantity: 1,
        type: 'product',
        unit: p.unit,
    })), 
    total: 4.50, 
    status: 'Processing',
    orderType: 'one_time',
    paymentStatus: 'paid',
    deliveryDetails: {
        estimatedArrival: 'November 3, 2023',
        trackingStatus: 'Out for Delivery'
    }
  },
  { 
    id: 'o3', 
    userId: 'u1', 
    date: '2023-11-02', 
    items: [
        // FIX: Explicitly type the return of the map to CartItem to prevent type widening on the 'type' property.
        ...mockProducts.slice(4, 7).map((p,i): CartItem => ({
            cartId: `mock-cart-${p.id}-${i+5}`,
            id: p.id,
            name: p.name,
            price: p.price,
            imageUrl: p.imageUrl,
            quantity: 2,
            type: 'product',
            unit: p.unit,
        })),
        { cartId: 'mock-cart-sb1', id: 'sb1', name: 'Veggie Box (Small)', price: 25.00, imageUrl: '', quantity: 1, type: 'subscription' }
    ], 
    total: 37.50, 
    status: 'Pending',
    orderType: 'subscription',
    paymentStatus: 'pending',
    deliveryDetails: {
        estimatedArrival: 'November 8, 2023',
        trackingStatus: 'Order Confirmed'
    } 
  },
  {
    id: 'o4',
    userId: 'u1',
    date: '2023-11-05',
    // FIX: Explicitly type the return of the map to CartItem to prevent type widening on the 'type' property.
    items: mockProducts.slice(1, 3).map((p, i): CartItem => ({
        cartId: `mock-cart-${p.id}-${i+10}`,
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        quantity: 1,
        type: 'product',
        unit: p.unit,
    })),
    total: 5.50,
    status: 'Packed',
    orderType: 'one_time',
    paymentStatus: 'paid',
    deliveryDetails: {
        estimatedArrival: 'November 9, 2023',
        trackingStatus: 'Preparing'
    }
  }
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
    lifetimeValue: 450.75,
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

export const mockFarmerDirectOrders: Order[] = [
    {
        id: 'd-o1',
        userId: 'farmer1',
        customerId: 'cust1',
        date: '2024-07-25',
        items: [
            { cartId: 'fc1', id: 'p1', name: 'Organic Carrots', price: 2.50, imageUrl: '', quantity: 20, type: 'product', unit: 'bunch' },
            { cartId: 'fc2', id: 'p3', name: 'Red Bell Peppers', price: 1.50, imageUrl: '', quantity: 30, type: 'product', unit: 'each' },
        ],
        total: 95.00,
        status: 'Delivered',
    }
];

export const mockFarmerCustomers: Customer[] = [
    { id: 'cust1', name: 'The Corner Cafe', type: 'Restaurant', contactEmail: 'orders@cornercafe.com', orderHistory: mockFarmerDirectOrders },
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
        performanceScore: 92,
    },
    { 
        id: 'f2', 
        name: 'Sunnyvale Orchards', 
        location: 'Niagara, ON', 
        specialty: ['Fruits', 'Apples', 'Tomatoes'], 
        productIds: ['p2', 'p5'],
        performanceScore: 95,
    },
    { 
        id: 'f3', 
        name: 'Riverbend Gardens', 
        location: 'Ottawa, ON', 
        specialty: ['Leafy Greens', 'Herbs'], 
        productIds: ['p4', 'p6', 'p8'],
        performanceScore: 88,
    },
    { 
        id: 'f4', 
        name: 'Prairie Harvest', 
        location: 'Brant, ON', 
        specialty: ['Grains', 'Potatoes'],
        performanceScore: 81,
    },
];

export const mockBusinessProducts: Product[] = [
    { id: 'bp1', name: 'Garden Salad', price: 12.50, unit: 'plate', imageUrl: 'https://picsum.photos/id/203/400/300', farmer: 'The Grand Restaurant', moq: 1, isSeasonal: true },
    { id: 'bp2', name: 'Tomato Soup', price: 8.00, unit: 'bowl', imageUrl: 'https://picsum.photos/id/204/400/300', farmer: 'The Grand Restaurant', moq: 1, isSeasonal: true },
    { id: 'bp3', name: 'Roast Chicken', price: 24.00, unit: 'plate', imageUrl: 'https://picsum.photos/id/205/400/300', farmer: 'The Grand Restaurant', moq: 1, isSeasonal: false },
];

export const mockBusinessCustomerOrders: Order[] = [
    {
        id: 'b-cust-o1',
        userId: 'biz1',
        customerId: 'bcust1',
        date: '2024-07-28',
        items: [
            { cartId: 'bc1', id: 'bp1', name: 'Garden Salad', price: 12.50, imageUrl: '', quantity: 10, type: 'product', unit: 'plate' },
        ],
        total: 125.00,
        status: 'Delivered',
    }
];

export const mockBusinessCustomers: Customer[] = [
    { id: 'bcust1', name: 'Regular Diner A', type: 'Individual', contactEmail: 'diner-a@example.com', orderHistory: mockBusinessCustomerOrders },
    { id: 'bcust2', name: 'Corporate Catering Client', type: 'Individual', contactEmail: 'catering@example.com' }
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
        customers: mockBusinessCustomers,
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

export const mockSourcedProducts: SourcedProduct[] = [
    { id: 'sp1', name: 'Organic Carrots', baseProductName: 'Carrots', supplierId: 'f1', supplierName: 'Green Acres Farm', costPrice: 1.80, unit: 'bunch', imageUrl: 'https://picsum.photos/id/1080/400/300', category: 'Vegetable', publishStatus: 'published', sellingPrice: 2.50, publishTarget: ['retail', 'wholesale'], availableQuantity: 55 },
    { id: 'sp1_alt', name: 'Carrots', baseProductName: 'Carrots', supplierId: 'f4', supplierName: 'Prairie Harvest', costPrice: 1.65, unit: 'bunch', imageUrl: 'https://picsum.photos/id/1080/400/300', category: 'Vegetable', publishStatus: 'unpublished', availableQuantity: 120 },
    { id: 'sp2', name: 'Heirloom Tomatoes', baseProductName: 'Tomatoes', supplierId: 'f2', supplierName: 'Sunnyvale Orchards', costPrice: 2.90, unit: 'lb', imageUrl: 'https://picsum.photos/id/1078/400/300', category: 'Vegetable', publishStatus: 'published', sellingPrice: 4.00, publishTarget: ['retail'], availableQuantity: 8 },
    { id: 'sp2_alt', name: 'Roma Tomatoes', baseProductName: 'Tomatoes', supplierId: 'f1', supplierName: 'Green Acres Farm', costPrice: 2.75, unit: 'lb', imageUrl: 'https://picsum.photos/id/1078/400/300', category: 'Vegetable', publishStatus: 'unpublished', availableQuantity: 60 },
    { id: 'sp3', name: 'Red Bell Peppers', baseProductName: 'Peppers', supplierId: 'f1', supplierName: 'Green Acres Farm', costPrice: 1.05, unit: 'each', imageUrl: 'https://picsum.photos/id/1025/400/300', category: 'Vegetable', publishStatus: 'unpublished', availableQuantity: 150 },
    { id: 'sp4', name: 'Spinach', baseProductName: 'Spinach', supplierId: 'f3', supplierName: 'Riverbend Gardens', costPrice: 2.10, unit: 'bag', imageUrl: 'https://picsum.photos/id/292/400/300', category: 'Vegetable', publishStatus: 'published', sellingPrice: 3.00, publishTarget: ['retail'], availableQuantity: 40 },
    { id: 'sp5', name: 'Gala Apples', baseProductName: 'Apples', supplierId: 'f2', supplierName: 'Sunnyvale Orchards', costPrice: 2.50, unit: 'lb', imageUrl: 'https://picsum.photos/id/431/400/300', category: 'Fruit', publishStatus: 'unpublished', availableQuantity: 200 },
    { id: 'sp6', name: 'Cucumbers', baseProductName: 'Cucumbers', supplierId: 'f3', supplierName: 'Riverbend Gardens', costPrice: 0.70, unit: 'each', imageUrl: 'https://picsum.photos/id/202/400/300', category: 'Vegetable', publishStatus: 'unpublished', availableQuantity: 100 },
    { id: 'sp7', name: 'Potatoes (5lb)', baseProductName: 'Potatoes', supplierId: 'f4', supplierName: 'Prairie Harvest', costPrice: 1.95, unit: '5lb bag', imageUrl: 'https://picsum.photos/id/1043/400/300', category: 'Vegetable', publishStatus: 'published', sellingPrice: 2.75, publishTarget: ['wholesale'], availableQuantity: 9 },
    { id: 'sp7_alt', name: 'Russet Potatoes', baseProductName: 'Potatoes', supplierId: 'f1', supplierName: 'Green Acres Farm', costPrice: 2.15, unit: '5lb bag', imageUrl: 'https://picsum.photos/id/1043/400/300', category: 'Vegetable', publishStatus: 'unpublished', availableQuantity: 80 },
    { id: 'sp8', name: 'Onions', baseProductName: 'Onions', supplierId: 'f3', supplierName: 'Riverbend Gardens', costPrice: 0.90, unit: 'lb', imageUrl: 'https://picsum.photos/id/1079/400/300', category: 'Vegetable', publishStatus: 'published', sellingPrice: 1.25, publishTarget: ['retail', 'wholesale'], availableQuantity: 110 },
    { id: 'sp9', name: 'Zucchini', baseProductName: 'Zucchini', supplierId: 'f1', supplierName: 'Green Acres Farm', costPrice: 1.25, unit: 'each', imageUrl: 'https://picsum.photos/id/211/400/300', category: 'Vegetable', publishStatus: 'unpublished', availableQuantity: 70 },
    { id: 'sp10', name: 'Strawberries', baseProductName: 'Strawberries', supplierId: 'f1', supplierName: 'Green Acres Farm', costPrice: 4.00, unit: 'quart', imageUrl: 'https://picsum.photos/id/1082/400/300', category: 'Fruit', publishStatus: 'published', sellingPrice: 5.50, publishTarget: ['retail'], availableQuantity: 0 },
];

export const mockPayments: Payment[] = [
    { id: 'pay_1', orderId: 'o1', userId: 'u1', userName: 'Jane Doe', amount: 30.50, date: '2023-10-26', status: 'Completed', method: 'Credit Card' },
    { id: 'pay_2', orderId: 'o2', userId: 'b1', userName: 'The Grand Restaurant', amount: 4.50, date: '2023-10-29', status: 'Completed', method: 'Credit Card' },
    { id: 'pay_3', orderId: 'o3', userId: 'u1', userName: 'Jane Doe', amount: 12.50, date: '2023-11-02', status: 'Pending', method: 'PayPal' },
];

export const mockInvoices: Invoice[] = [
    { id: 'inv_f1_1', entityId: 'f1', entityName: 'Green Acres Farm', entityType: 'Supplier', date: '2023-10-01', dueDate: '2023-10-31', amount: 1250.00, status: 'Paid' },
    { id: 'inv_b1_1', entityId: 'b1', entityName: 'The Grand Restaurant', entityType: 'Customer', date: '2023-10-15', dueDate: '2023-11-15', amount: 890.00, status: 'Pending' },
    { id: 'inv_f2_1', entityId: 'f2', entityName: 'Sunnyvale Orchards', entityType: 'Supplier', date: '2023-09-20', dueDate: '2023-10-20', amount: 980.50, status: 'Overdue' },
];