
import { Product, SubscriptionBox, SubscriptionSize, Order, User } from '../types';

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
    },
    {
        id: 'sb2',
        type: 'Veggie',
        ethnicityFocus: 'Standard',
        size: SubscriptionSize.Medium,
        price: 40.00,
        description: 'Perfect for couples or small families, a variety of fresh veggies.',
        contentsSample: ['Carrots', 'Potatoes', 'Onions', 'Broccoli', 'Lettuce', 'Tomatoes', 'Peppers'],
    },
    {
        id: 'sb3',
        type: 'Fruit',
        ethnicityFocus: 'Standard',
        size: SubscriptionSize.Medium,
        price: 35.00,
        description: 'A delicious assortment of seasonal fruits for 2-3 people.',
        contentsSample: ['Apples', 'Bananas', 'Oranges', 'Berries', 'Grapes'],
    },
    {
        id: 'sb4',
        type: 'Mixed',
        ethnicityFocus: 'Asian',
        size: SubscriptionSize.Medium,
        price: 45.00,
        description: 'A mix of fruits and veggies common in Asian cuisine.',
        contentsSample: ['Bok Choy', 'Daikon Radish', 'Ginger', 'Napa Cabbage', 'Apples', 'Pears'],
    },
];

const MOCK_ORDER_ITEMS = mockProducts.slice(0, 3).map((p, i) => ({ ...p, quantity: i + 1 }));

export const mockOrders: Order[] = [
  { id: 'o1', userId: 'u1', date: '2023-10-26', items: MOCK_ORDER_ITEMS, total: MOCK_ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0), status: 'Delivered' },
  { id: 'o2', userId: 'u2', date: '2023-10-29', items: mockProducts.slice(2, 4).map(p => ({ ...p, quantity: 1 })), total: 4.50, status: 'Processing' },
  { id: 'o3', userId: 'u1', date: '2023-11-02', items: mockProducts.slice(4, 7).map(p => ({ ...p, quantity: 2 })), total: 12.50, status: 'Pending' },
];

export const mockUser: User = {
    id: 'u1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    postalCode: 'M5V 2T6',
    orderHistory: mockOrders.filter(o => o.userId === 'u1'),
};
