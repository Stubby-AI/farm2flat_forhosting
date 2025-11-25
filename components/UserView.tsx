
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCart } from '../hooks/useCart';
import { mockProducts, mockSubscriptionBoxes, mockUser, mockOrders, mockSourcedProducts } from '../mock/data';
import { Product, SubscriptionBox, SubscriptionFrequency, User, CartItem, Order, AISuggestion, Recipe } from '../types';
import { getPersonalizedSuggestions, generateRecipes } from '../services/geminiService';
import { ShoppingCartIcon, LeafIcon, UserIcon, TrashIcon, PlusIcon, MinusIcon, ArrowRightIcon, MapPinIcon, HeartIcon, CogIcon, BookOpenIcon, HomeModernIcon } from './Icons';

type UserViewType = 'SHOP' | 'SUBSCRIPTIONS' | 'CART' | 'PROFILE' | 'AUTH' | 'CHECKOUT' | 'GATEWAY' | 'CONFIRMATION';
type OrderWindow = 'Wednesday' | 'Sunday';

// This utility function is now defined here to be accessible by both UserView and CountdownTimer
const calculateDeadlineDate = (day: OrderWindow): Date => {
    const now = new Date();
    const deadline = new Date(now.getTime());
    const targetDayUTC = day === 'Wednesday' ? 3 : 0; // Date.getUTCDay(): Sunday = 0, Wednesday = 3

    deadline.setUTCHours(12, 0, 0, 0);

    const currentDayUTC = deadline.getUTCDay();
    const daysToAdd = (targetDayUTC - currentDayUTC + 7) % 7;

    deadline.setUTCDate(deadline.getUTCDate() + daysToAdd);

    if (deadline.getTime() < now.getTime()) {
        deadline.setUTCDate(deadline.getUTCDate() + 7);
    }
    
    return deadline;
};

// #region Helper Components
const Header: React.FC<{
    onNavigate: (view: UserViewType) => void;
    cartItemCount: number;
    postalCode: string;
    onPostalCodeChange: (postalCode: string) => void;
    isAuthenticated: boolean;
    onSignOut: () => void;
}> = ({ onNavigate, cartItemCount, postalCode, onPostalCodeChange, isAuthenticated, onSignOut }) => {
    const [localPostalCode, setLocalPostalCode] = useState(postalCode);

    const handlePostalCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedCode = localPostalCode.toUpperCase().replace(/\s/g, '');
        onPostalCodeChange(formattedCode);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div onClick={() => onNavigate('SHOP')} className="flex items-center cursor-pointer">
                    <LeafIcon className="h-8 w-8 text-green-600" />
                    <h1 className="text-2xl font-bold text-gray-800 ml-2">Farm2Flat</h1>
                </div>
                <div className="flex items-center gap-4">
                     <form onSubmit={handlePostalCodeSubmit} className="hidden md:flex items-center border rounded-lg overflow-hidden">
                        <MapPinIcon className="w-5 h-5 text-gray-400 ml-2" />
                        <input
                            type="text"
                            value={localPostalCode}
                            onChange={(e) => setLocalPostalCode(e.target.value)}
                            placeholder="A1A 1A1"
                            className="px-2 py-1 text-sm focus:outline-none"
                            aria-label="Postal Code"
                        />
                        <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 text-sm font-semibold">
                            Update
                        </button>
                    </form>
                    <nav className="flex items-center space-x-4">
                        <button onClick={() => onNavigate('SHOP')} className="text-gray-600 hover:text-green-600">Shop</button>
                        <button onClick={() => onNavigate('SUBSCRIPTIONS')} className="text-gray-600 hover:text-green-600">Subscriptions</button>
                        {isAuthenticated ? (
                            <div className="relative group">
                                <button onClick={() => onNavigate('PROFILE')} className="text-gray-600 hover:text-green-600 flex items-center gap-1">
                                    <UserIcon className="h-6 w-6" />
                                    <span className="hidden sm:inline text-sm">Dashboard</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
                                     <button onClick={() => onNavigate('PROFILE')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">My Dashboard</button>
                                     <button onClick={onSignOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Sign Out</button>
                                </div>
                            </div>
                        ) : (
                             <button onClick={() => onNavigate('AUTH')} className="text-gray-600 hover:text-green-600 font-semibold">Sign In</button>
                        )}
                    </nav>
                    <button onClick={() => onNavigate('CART')} className="relative" aria-label={`Cart with ${cartItemCount} items`}>
                        <ShoppingCartIcon className="h-6 w-6 text-gray-600 hover:text-green-600" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

const CountdownTimer: React.FC<{
    deadlineDate: Date;
    onDeadlineChange: (window: OrderWindow) => void;
    selectedDeadline: OrderWindow;
}> = ({ deadlineDate, onDeadlineChange, selectedDeadline }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = deadlineDate.getTime() - new Date().getTime();
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft('Order window closed!');
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Initial call
        
        return () => clearInterval(timer);
    }, [deadlineDate]);

    return (
        <div className="bg-green-600 text-white text-center py-2 px-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            <div className="flex items-center">
                <span className="font-bold mr-2">Next order deadline:</span>
                <select 
                    value={selectedDeadline}
                    onChange={(e) => onDeadlineChange(e.target.value as OrderWindow)}
                    className="bg-green-700 border-none rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                >
                    <option value="Sunday">Sunday at 12 PM UTC</option>
                    <option value="Wednesday">Wednesday at 12 PM UTC</option>
                </select>
            </div>
            <div className="flex items-center">
                <span className="font-semibold mr-2">Time left:</span>
                <span className="font-mono">{timeLeft}</span>
            </div>
        </div>
    );
};

const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void; isRegular: boolean; onToggleRegular: (productId: string) => void; available: boolean }> = ({ product, onAddToCart, isRegular, onToggleRegular, available }) => (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 group ${!available ? 'opacity-60 pointer-events-none grayscale' : 'hover:scale-105'}`}>
        <div className="relative">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
             {available && (
                <button 
                    onClick={() => onToggleRegular(product.id)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all ${isRegular ? 'bg-red-500 text-white' : 'bg-white/70 text-gray-700 hover:bg-white'}`}
                    aria-label={isRegular ? 'Remove from regulars' : 'Add to regulars'}
                >
                    <HeartIcon className="w-5 h-5" filled={isRegular} />
                </button>
             )}
             {!available && (
                 <div className="absolute inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center">
                     <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">Out of Stock in Area</span>
                 </div>
             )}
        </div>
        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>{product.name}</h3>
            <p className="text-sm text-gray-500 truncate">{product.farmer}</p>
            <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)} <span className="text-sm font-normal text-gray-600">/ {product.unit}</span></p>
                <button disabled={!available} onClick={() => onAddToCart(product)} className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-400">Add</button>
            </div>
        </div>
    </div>
);


const SubscriptionCard: React.FC<{ 
    subscription: SubscriptionBox; 
    onAddToCart: (sub: SubscriptionBox, options: { frequency: SubscriptionFrequency; isTrial?: boolean }) => void;
    isSubscribed: boolean;
    onManageSubscription: () => void;
}> = ({ subscription, onAddToCart, isSubscribed, onManageSubscription }) => {
    const [frequency, setFrequency] = useState<SubscriptionFrequency>(SubscriptionFrequency.Weekly);

    return (
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row relative ${isSubscribed ? 'border-2 border-green-500' : ''}`}>
            {isSubscribed && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    SUBSCRIBED
                </div>
            )}
            <img src={subscription.imageUrl} alt={`${subscription.type} Box`} className="md:w-1/3 h-64 md:h-auto object-cover" />
            <div className="p-6 flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{subscription.type} Box - {subscription.size}</h3>
                <p className="text-md text-gray-600 mt-1">{subscription.ethnicityFocus} Focus</p>
                <p className="text-gray-700 mt-4">{subscription.description}</p>
                <p className="text-sm text-gray-500 mt-2">Example contents: {subscription.contentsSample.join(', ')}</p>
                <p className="text-2xl font-bold text-gray-900 my-4">${subscription.price.toFixed(2)}</p>
                <div className="flex flex-wrap gap-4 items-center">
                    {isSubscribed ? (
                         <button onClick={onManageSubscription} className="bg-gray-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center gap-2">
                             <CogIcon className="w-5 h-5" /> Manage Subscription
                         </button>
                    ) : (
                        <>
                            <select value={frequency} onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)} className="border rounded-md px-3 py-2">
                                {Object.values(SubscriptionFrequency).map(freq => <option key={freq} value={freq}>{freq}</option>)}
                            </select>
                            <button onClick={() => onAddToCart(subscription, { frequency })} className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition">Subscribe</button>
                            <button onClick={() => onAddToCart(subscription, { frequency, isTrial: true })} className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">One-time Trial</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const CartView: React.FC<{ items: CartItem[]; cartTotal: number; updateQuantity: (id: string, q: number) => void; removeFromCart: (id: string) => void; onCheckout: () => void }> = ({ items, cartTotal, updateQuantity, removeFromCart, onCheckout }) => (
    <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>
        {items.length === 0 ? (
            <p>Your cart is empty.</p>
        ) : (
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <ul className="space-y-4">
                        {items.map(item => (
                            <li key={item.cartId} className="flex items-center bg-white p-4 rounded-lg shadow">
                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                <div className="flex-grow ml-4">
                                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                    {item.type === 'subscription' && <p className="text-sm text-gray-500">{item.isTrial ? 'One-time Trial' : item.frequency}</p>}
                                    <p className="text-gray-600 font-bold">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon className="w-4 h-4" /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon className="w-4 h-4" /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.cartId)} className="ml-4 text-red-500 hover:text-red-700"><TrashIcon className="w-6 h-6" /></button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow sticky top-24">
                        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-gray-500">
                            <span>Delivery</span>
                            <span>$5.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>${(cartTotal + 5).toFixed(2)}</span>
                        </div>
                        {cartTotal < 20 && <p className="text-red-500 text-sm mt-2">Minimum order is $20.00</p>}
                        <button 
                          onClick={onCheckout}
                          disabled={cartTotal < 20}
                          className="w-full bg-green-500 text-white mt-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                          Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);

const AuthView: React.FC<{ onAuthSuccess: (user: User) => void }> = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (email === 'ami@gmail.com' && password === 'Ami12345') {
            onAuthSuccess({ ...mockUser, name: 'Ami', email: 'ami@gmail.com' });
        } else {
            setError('Invalid credentials. Access is restricted.');
        }
    };
    
    return (
        <div className="container mx-auto px-6 py-12 flex justify-center">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="p-3 border rounded w-full mb-4" required />
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="p-3 border rounded w-full mb-4" required />
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const CheckoutView: React.FC<{ cartTotal: number; user: User; onConfirmOrder: () => void; onBackToCart: () => void }> = ({ cartTotal, user, onConfirmOrder, onBackToCart }) => (
    <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h2>
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-6">Shipping & Payment</h3>
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name" defaultValue={user.name.split(' ')[0]} className="p-3 border rounded w-full" />
                        <input type="text" placeholder="Last Name" defaultValue={user.name.split(' ').slice(1).join(' ')} className="p-3 border rounded w-full" />
                    </div>
                    <input type="text" placeholder="Address" className="p-3 border rounded w-full mt-4" />
                    <input type="tel" placeholder="Phone Number" className="p-3 border rounded w-full mt-4" />
                    <input type="text" placeholder="Postal Code" defaultValue={user.postalCode} className="p-3 border rounded w-full mt-4" />
                    
                    <h3 className="text-xl font-semibold my-6 pt-4 border-t">Payment Details</h3>
                    <input type="text" placeholder="Card Number" className="p-3 border rounded w-full" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <input type="text" placeholder="MM/YY" className="p-3 border rounded w-full" />
                        <input type="text" placeholder="CVC" className="p-3 border rounded w-full" />
                    </div>
                    
                    <h3 className="text-xl font-semibold my-6 pt-4 border-t">Promo Code</h3>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Enter code" className="p-3 border rounded w-full" />
                        <button type="button" className="bg-gray-600 text-white px-6 rounded-lg font-semibold hover:bg-gray-700">Apply</button>
                    </div>
                </form>
            </div>
            <div className="lg:w-1/3">
                <div className="bg-white p-6 rounded-lg shadow sticky top-24">
                    <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-gray-500">
                        <span>Delivery</span>
                        <span>$5.00</span>
                    </div>
                     <div className="flex justify-between mb-2 text-gray-500">
                        <span>Taxes</span>
                        <span>${(cartTotal * 0.13).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
                        <span>Total</span>
                        <span>${(cartTotal + 5 + (cartTotal * 0.13)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-8 gap-4">
                        <button onClick={onBackToCart} className="text-gray-600 hover:text-gray-800 font-semibold py-3 px-4 rounded-lg border hover:bg-gray-100 w-1/2">Back</button>
                        <button onClick={onConfirmOrder} className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition w-1/2">Pay Now</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PaymentGatewayView: React.FC<{ onPaymentSuccess: () => void }> = ({ onPaymentSuccess }) => (
    <div className="container mx-auto px-6 py-16 text-center">
        <div className="bg-white p-12 rounded-lg shadow-lg max-w-md mx-auto">
             <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Payment</h2>
             <p className="text-gray-600 mb-6">You are being redirected to our secure payment provider to complete your purchase.</p>
             <div className="bg-gray-50 p-4 rounded-md border text-left mb-6">
                <p><strong>Merchant:</strong> Farm2Flat</p>
                <p><strong>Amount:</strong> $--.-- (dynamic amount)</p>
             </div>
             <button onClick={onPaymentSuccess} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition w-full">
                Simulate Successful Payment
            </button>
        </div>
    </div>
);


const ConfirmationView: React.FC<{ onContinue: () => void }> = ({ onContinue }) => (
    <div className="container mx-auto px-6 py-16 text-center">
        <div className="bg-white p-12 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LeafIcon className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your farm-fresh goodies are on their way. You can track your order in your profile.</p>
            <button onClick={onContinue} className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2 mx-auto">
                View My Orders <ArrowRightIcon className="w-5 h-5"/>
            </button>
        </div>
    </div>
);


const PersonalizedSuggestions: React.FC<{ 
    user: User; 
    onGetSuggestions: () => void; 
    suggestions: AISuggestion[]; 
    isLoading: boolean; 
    onAddToCart: (product: Product) => void;
    availableProducts: Product[];
}> = ({ user, onGetSuggestions, suggestions, isLoading, onAddToCart, availableProducts }) => (
    <div className="mb-12 bg-green-50 border-2 border-green-200 border-dashed rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-green-800 mb-2">Just for you, {user.name.split(' ')[0]}!</h3>
        <p className="text-green-700 mb-4">Based on your recent orders, here are some fresh picks we think you'll love.</p>
        <button onClick={onGetSuggestions} disabled={isLoading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400">
            {isLoading ? 'Thinking...' : 'Get AI Suggestions'}
        </button>
        {suggestions.length > 0 && !suggestions[0]?.name.includes('Error') && (
            <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {suggestions.map((item, index) => {
                        // Find matching product in catalog to allow adding to cart
                        // Loose matching: check if suggestion name is contained in product name or vice versa
                        const product = availableProducts.find(p => 
                            p.name.toLowerCase().includes(item.name.toLowerCase()) || 
                            item.name.toLowerCase().includes(p.name.toLowerCase())
                        );

                        return (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-left flex flex-col justify-between h-full">
                                <div>
                                    <p className="font-bold text-green-800">{item.name}</p>
                                    <p className="text-sm text-green-700 mb-2">{item.reason}</p>
                                    {product && (
                                        <div className="text-xs text-gray-500 mb-2">
                                            Match: {product.name} - ${product.price.toFixed(2)}
                                        </div>
                                    )}
                                </div>
                                {product ? (
                                    <button 
                                        onClick={() => onAddToCart(product)}
                                        className="mt-2 w-full bg-green-100 text-green-700 py-2 rounded-md hover:bg-green-200 font-semibold text-sm flex items-center justify-center gap-1"
                                    >
                                        <PlusIcon className="w-4 h-4" /> Add to Cart
                                    </button>
                                ) : (
                                    <button disabled className="mt-2 w-full bg-gray-100 text-gray-400 py-2 rounded-md font-semibold text-sm cursor-not-allowed">
                                        Unavailable
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
    </div>
);

const DeliveryStatusTracker: React.FC<{ status: 'Order Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' }> = ({ status }) => {
    const steps = ['Order Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentStepIndex = steps.indexOf(status);

    return (
        <div className="w-full mt-4">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center w-1/4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
                                    {isCompleted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
                                </div>
                                <p className={`text-xs mt-2 text-center transition-colors duration-300 ${isCurrent ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const BudgetTracker: React.FC<{ user: User }> = ({ user }) => {
    if (!user.groceryBudget) return null;

    const { amount, period } = user.groceryBudget;

    const spentThisPeriod = user.orderHistory.reduce((total, order) => {
        const orderDate = new Date(order.date);
        const now = new Date();
        let isWithinPeriod = false;

        if (period === 'Weekly') {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            startOfWeek.setHours(0, 0, 0, 0);
            if (orderDate >= startOfWeek) {
                isWithinPeriod = true;
            }
        } else { // Monthly
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            if (orderDate >= startOfMonth) {
                isWithinPeriod = true;
            }
        }

        return isWithinPeriod ? total + order.total : total;
    }, 0);

    const percentage = Math.min((spentThisPeriod / amount) * 100, 100);
    const progressBarColor = percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">{period} Budget</h4>
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-bold text-gray-800">${spentThisPeriod.toFixed(2)} spent</span>
                <span className="text-gray-500">of ${amount.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

// #region Dashboard Components for Signed-in User

const DashboardView: React.FC<{ 
    user: User;
    suggestions: AISuggestion[];
    isLoadingSuggestions: boolean;
    onGetSuggestions: () => void;
    regionalProducts: Product[];
    recipes: Recipe[];
    isLoadingRecipes: boolean;
    onGenerateRecipes: () => void;
    onSelectRecipe: (recipe: Recipe) => void;
    onAddToCart: (product: Product) => void;
}> = ({ user, suggestions, isLoadingSuggestions, onGetSuggestions, regionalProducts, recipes, isLoadingRecipes, onGenerateRecipes, onSelectRecipe, onAddToCart }) => {
    return (
        <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">My Dashboard</h3>
            
            <PersonalizedSuggestions 
                user={user} 
                onGetSuggestions={onGetSuggestions} 
                suggestions={suggestions} 
                isLoading={isLoadingSuggestions} 
                onAddToCart={onAddToCart}
                availableProducts={regionalProducts}
            />

            <div className="my-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                        <BookOpenIcon className="w-8 h-8 text-green-600" />
                        Meal Ideas & Recipes
                    </h2>
                    <p className="text-gray-600 mt-2">Discover delicious meals you can make with our fresh ingredients.</p>
                    <button 
                        onClick={onGenerateRecipes} 
                        disabled={isLoadingRecipes}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                        {isLoadingRecipes ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                </div>
                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {recipes.map(recipe => (
                            <div key={recipe.id} onClick={() => onSelectRecipe(recipe)} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 group">
                                <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 italic">Click "Generate with AI" to get personalized recipe ideas based on currently available produce!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// #endregion


const ProfileView: React.FC<{ 
    user: User; 
    onUpdateUser: (updatedUser: User) => void; 
    onToggleRegular: (productId: string) => void; 
    onAddToCart: (product: Product) => void;
    initialTab?: 'dashboard' | 'orders' | 'subscriptions' | 'regulars' | 'preferences' | 'manage';
    // Dashboard specific props
    suggestions: AISuggestion[];
    isLoadingSuggestions: boolean;
    onGetSuggestions: () => void;
    regionalProducts: Product[];
    recipes: Recipe[];
    isLoadingRecipes: boolean;
    onGenerateRecipes: () => void;
    onSelectRecipe: (recipe: Recipe) => void;
}> = ({ user, onUpdateUser, onToggleRegular, onAddToCart, initialTab = 'dashboard', suggestions, isLoadingSuggestions, onGetSuggestions, regionalProducts, recipes, isLoadingRecipes, onGenerateRecipes, onSelectRecipe }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'subscriptions' | 'regulars' | 'preferences' | 'manage'>(initialTab);
    
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);
    
    const activeSubscriptions = user.orderHistory
        .flatMap(o => o.items)
        .filter(item => item.type === 'subscription' && !item.isTrial);

    const renderProfileContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <DashboardView 
                        user={user}
                        suggestions={suggestions}
                        isLoadingSuggestions={isLoadingSuggestions}
                        onGetSuggestions={onGetSuggestions}
                        regionalProducts={regionalProducts}
                        recipes={recipes}
                        isLoadingRecipes={isLoadingRecipes}
                        onGenerateRecipes={onGenerateRecipes}
                        onSelectRecipe={onSelectRecipe}
                        onAddToCart={onAddToCart}
                    />
                );
            case 'orders':
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">My Orders</h3>
                        <div className="space-y-6">
                            {user.orderHistory.map(order => (
                                <div key={order.id} className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">Order ID: {order.id}</p>
                                            <p className="text-sm text-gray-500">Date: {order.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</p>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-orange-100 text-orange-800'
                                            }`}>{order.status}</span>
                                        </div>
                                    </div>
                                    <ul className="text-sm text-gray-600 my-2 border-y py-2">
                                        {order.items.map(item => <li key={item.cartId}>- {item.name} (x{item.quantity})</li>)}
                                    </ul>
                                    {order.deliveryDetails && (
                                       <>
                                           <p className="text-sm text-gray-600 font-semibold">
                                               Estimated Arrival: {order.deliveryDetails.estimatedArrival}
                                           </p>
                                           <DeliveryStatusTracker status={order.deliveryDetails.trackingStatus} />
                                       </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'subscriptions':
                 return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">My Subscriptions</h3>
                        {activeSubscriptions.length > 0 ? (
                            <div className="space-y-4">
                               {activeSubscriptions.map(sub => (
                                   <div key={sub.cartId} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                                       <div>
                                           <p className="font-semibold">{sub.name}</p>
                                           <p className="text-sm text-gray-500">{sub.frequency}</p>
                                       </div>
                                       <button className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md">Manage</button>
                                   </div>
                               ))}
                            </div>
                        ) : <p>You have no active subscriptions.</p>}
                    </div>
                );
            case 'regulars':
                const regularProducts = mockProducts.filter(p => user.regularPurchaseList?.includes(p.id));
                return (
                     <div>
                        <h3 className="text-xl font-semibold mb-4">My Regulars</h3>
                        <p className="text-gray-600 mb-4 text-sm">These are your favorite items. You can quickly add them to your cart from here.</p>
                        {regularProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {regularProducts.map(product => (
                                   <div key={product.id} className="bg-gray-50 p-3 rounded-lg border flex items-center justify-between">
                                       <div className="flex items-center gap-3">
                                            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                                            <div>
                                                 <p className="font-semibold">{product.name}</p>
                                                 <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                                            </div>
                                       </div>
                                       <div className="flex flex-col gap-2">
                                            <button onClick={() => onAddToCart(product)} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"><PlusIcon className="w-4 h-4" /></button>
                                            <button onClick={() => onToggleRegular(product.id)} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"><TrashIcon className="w-4 h-4" /></button>
                                       </div>
                                   </div>
                                ))}
                            </div>
                        ) : <p>You haven't added any regular items yet. Click the heart icon on products you love!</p>}
                    </div>
                );
            case 'preferences':
                 return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Preferences & Budget</h3>
                        <BudgetTracker user={user} />
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Family Size</label>
                                <input type="number" defaultValue={user.familySize} className="mt-1 p-2 border rounded-md w-full md:w-1/2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dietary Preferences</label>
                                <div className="mt-2 space-y-2">
                                    <label className="flex items-center"><input type="checkbox" defaultChecked={user.preferences?.includes('organic')} className="h-4 w-4 text-green-600 border-gray-300 rounded" /> <span className="ml-2 text-gray-700">Organic</span></label>
                                    <label className="flex items-center"><input type="checkbox" defaultChecked={user.preferences?.includes('local-only')} className="h-4 w-4 text-green-600 border-gray-300 rounded" /> <span className="ml-2 text-gray-700">Local Only</span></label>
                                    <label className="flex items-center"><input type="checkbox" defaultChecked={user.preferences?.includes('vegan')} className="h-4 w-4 text-green-600 border-gray-300 rounded" /> <span className="ml-2 text-gray-700">Vegan</span></label>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Grocery Budget</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-gray-500">$</span>
                                    <input type="number" defaultValue={user.groceryBudget?.amount} className="p-2 border rounded-md w-full" />
                                    <select defaultValue={user.groceryBudget?.period} className="p-2 border rounded-md">
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600">Save Preferences</button>
                        </form>
                    </div>
                 );
            case 'manage':
                 return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Manage Profile</h3>
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" defaultValue={user.name} className="mt-1 p-2 border rounded-md w-full" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" defaultValue={user.email} className="mt-1 p-2 border rounded-md w-full" />
                            </div>
                            <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600">Save Changes</button>
                        </div>
                    </div>
                 );
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome, {user.name.split(' ')[0]}!</h2>
                    <p className="text-gray-600">Manage your orders, preferences, and personal details here.</p>
                </div>
                <div className="bg-blue-100 text-blue-800 font-bold p-3 rounded-lg text-center">
                    <p className="text-sm">Loyalty Credits</p>
                    <p className="text-2xl">${user.loyaltyCredits?.toFixed(2) || '0.00'}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <nav className="flex flex-col space-y-2 sticky top-24">
                         <button onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-md text-left font-semibold flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}><HomeModernIcon className="w-5 h-5"/>Dashboard</button>
                         <button onClick={() => setActiveTab('orders')} className={`p-3 rounded-md text-left font-semibold flex items-center gap-3 ${activeTab === 'orders' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}><ShoppingCartIcon className="w-5 h-5"/>My Orders</button>
                         <button onClick={() => setActiveTab('subscriptions')} className={`p-3 rounded-md text-left font-semibold flex items-center gap-3 ${activeTab === 'subscriptions' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}><LeafIcon className="w-5 h-5"/>My Subscriptions</button>
                         <button onClick={() => setActiveTab('regulars')} className={`p-3 rounded-md text-left font-semibold flex items-center gap-3 ${activeTab === 'regulars' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}><HeartIcon className="w-5 h-5"/>My Regulars</button>
                         <button onClick={() => setActiveTab('preferences')} className={`p-3 rounded-md text-left font-semibold flex items-center gap-3 ${activeTab === 'preferences' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}><CogIcon className="w-5 h-5"/>Preferences & Budget</button>
                         <button onClick={() => setActiveTab('manage')} className={`p-3 rounded-md text-left font-semibold flex items-center gap-3 ${activeTab === 'manage' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}><UserIcon className="w-5 h-5"/>Manage Profile</button>
                    </nav>
                </aside>
                <main className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                    {renderProfileContent()}
                </main>
            </div>
        </div>
    );
};
// #endregion

const RecipeDetailModal: React.FC<{
    recipe: Recipe;
    availableProducts: Product[];
    onClose: () => void;
    onAddToCart: (items: { product: Product; quantity: number }[]) => void;
}> = ({ recipe, availableProducts, onClose, onAddToCart }) => {
    const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
    
    useEffect(() => {
        const storeItems = new Set<string>();
        recipe.ingredients.forEach(ing => {
            if (ing.isStoreItem) {
                const productMatch = availableProducts.find(p => p.name.toLowerCase().includes(ing.name.toLowerCase()));
                if (productMatch) {
                    storeItems.add(productMatch.id);
                }
            }
        });
        setSelectedIngredients(storeItems);
    }, [recipe, availableProducts]);

    const handleToggleIngredient = (productId: string) => {
        setSelectedIngredients(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const handleAddToCart = () => {
        const itemsToAdd = Array.from(selectedIngredients).map(productId => {
            const product = availableProducts.find(p => p.id === productId);
            return product ? { product, quantity: 1 } : null;
        }).filter((item): item is { product: Product; quantity: number } => item !== null);
        
        onAddToCart(itemsToAdd);
        onClose();
    };

    const storeIngredients = recipe.ingredients.filter(i => i.isStoreItem).map(ing => {
        const productMatch = availableProducts.find(p => p.name.toLowerCase().includes(ing.name.toLowerCase()));
        return { ...ing, product: productMatch };
    });
    const pantryIngredients = recipe.ingredients.filter(i => !i.isStoreItem);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800">{recipe.name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-bold">&times;</button>
                </div>
                <div className="p-6">
                    <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-64 object-cover rounded-md mb-4"/>
                    <p className="text-gray-600 mb-6">{recipe.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Ingredients</h4>
                            <h5 className="font-bold text-sm text-green-700 mt-4 mb-2">From Farm2Flat</h5>
                            <ul className="space-y-2">
                                {storeIngredients.map((ing, i) => (
                                    <li key={i} className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id={`ing-${ing.product?.id || i}`}
                                            checked={ing.product ? selectedIngredients.has(ing.product.id) : false}
                                            onChange={() => ing.product && handleToggleIngredient(ing.product.id)}
                                            disabled={!ing.product}
                                            className="h-4 w-4 text-green-600 border-gray-300 rounded disabled:opacity-50"
                                        />
                                        <label htmlFor={`ing-${ing.product?.id || i}`} className={`ml-2 ${!ing.product ? 'text-gray-400 line-through' : ''}`}>
                                            {ing.quantity} {ing.name} {!ing.product ? '(Not in store)' : ''}
                                        </label>
                                    </li>
                                ))}
                            </ul>

                             <h5 className="font-bold text-sm text-gray-600 mt-4 mb-2">Pantry Staples</h5>
                             <ul className="space-y-1 text-sm text-gray-500 list-disc list-inside">
                                {pantryIngredients.map((ing, i) => <li key={i}>{ing.quantity} {ing.name}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Instructions</h4>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 bg-gray-50 p-4 border-t flex justify-end gap-4">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">Close</button>
                    <button onClick={handleAddToCart} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400" disabled={selectedIngredients.size === 0}>
                        Add {selectedIngredients.size} items to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple hashing function to determine availability based on strings
const getRegionalProductData = (product: Product, postalCode: string) => {
    // Sanitize
    const cleanPostal = postalCode.replace(/\s/g, '').toUpperCase();
    if (cleanPostal.length < 3) return { ...product, available: true };

    const postalPrefix = cleanPostal.substring(0, 3);
    
    // Hash based on chars
    let hash = 0;
    for (let i = 0; i < postalPrefix.length; i++) {
        hash = ((hash << 5) - hash) + postalPrefix.charCodeAt(i);
        hash |= 0;
    }
    const productHash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const combinedHash = Math.abs(hash + productHash);

    // 10% chance item is unavailable in this region
    const isAvailable = (combinedHash % 10) !== 0; 
    
    // Price variance +/- 10% based on region
    const priceVariance = ((combinedHash % 20) - 10) / 100;
    const regionalPrice = product.price * (1 + priceVariance);

    return {
        ...product,
        price: regionalPrice,
        available: isAvailable
    };
};


const UserView: React.FC = () => {
    const [currentView, setCurrentView] = useState<UserViewType>('SHOP');
    const [postalCode, setPostalCode] = useState(mockUser.postalCode);
    const [selectedDeadline, setSelectedDeadline] = useState<OrderWindow>('Sunday');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    const [profileInitialTab, setProfileInitialTab] = useState<'dashboard' | 'orders' | 'subscriptions' | 'regulars' | 'preferences' | 'manage'>('dashboard');

    const cart = useCart();
    
    const deadlineDate = calculateDeadlineDate(selectedDeadline);

    // Apply Regional Logic
    const regionalProducts = useMemo(() => {
        return mockProducts.map(p => getRegionalProductData(p, postalCode));
    }, [postalCode]);

    // Apply Category Filter
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'All') return regionalProducts;
        return regionalProducts.filter(p => p.category === selectedCategory);
    }, [regionalProducts, selectedCategory]);

    // Extract unique categories for sidebar
    const categories = useMemo(() => {
        const cats = new Set(mockProducts.map(p => p.category));
        return ['All', ...Array.from(cats)];
    }, []);

    const activeSubscriptions = useMemo(() => {
        if (!currentUser) return new Set<string>();
        const subIds = new Set<string>();
        currentUser.orderHistory.forEach(order => {
            order.items.forEach(item => {
                if (item.type === 'subscription' && !item.isTrial) {
                    subIds.add(item.id);
                }
            });
        });
        return subIds;
    }, [currentUser]);

    const handleGetSuggestions = useCallback(async () => {
        setIsLoadingSuggestions(true);
        const productsInHistory = (currentUser || mockUser).orderHistory
            .flatMap(order => order.items)
            .map(cartItem => mockProducts.find(p => p.id === cartItem.id))
            .filter((p): p is Product => p !== undefined);
        
        const result = await getPersonalizedSuggestions(productsInHistory);
        setSuggestions(result);
        setIsLoadingSuggestions(false);
    }, [currentUser]);

    const handleGenerateRecipes = useCallback(async () => {
        setIsLoadingRecipes(true);
        const result = await generateRecipes(regionalProducts.filter(p => p.available));
        setRecipes(result);
        setIsLoadingRecipes(false);
    }, [regionalProducts]);

    const handleAddRecipeItemsToCart = (items: { product: Product; quantity: number }[]) => {
        items.forEach(item => {
            cart.addToCart(item.product);
        });
    };
    
    const handleToggleRegular = (productId: string) => {
        if (!currentUser) return;
        
        const isRegular = currentUser.regularPurchaseList?.includes(productId);
        const newRegulars = isRegular
            ? currentUser.regularPurchaseList?.filter(id => id !== productId)
            : [...(currentUser.regularPurchaseList || []), productId];
            
        setCurrentUser({ ...currentUser, regularPurchaseList: newRegulars });
    };

    const handleAuthSuccess = (user: User) => {
        setIsAuthenticated(true);
        setCurrentUser(user);
        // If cart is not empty, go to checkout, else go to shop
        if (cart.items.length > 0) {
            setCurrentView('CHECKOUT');
        } else {
            setCurrentView('SHOP');
        }
    };
    
    const handleSignOut = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentView('SHOP');
    };
    
    const handleCheckout = () => {
        if (isAuthenticated) {
            setCurrentView('CHECKOUT');
        } else {
            setCurrentView('AUTH');
        }
    };

    const handlePaymentSuccess = () => {
        if (currentUser) {
            const newOrder: Order = {
                id: `o${Date.now()}`,
                userId: currentUser.id,
                date: new Date().toISOString().split('T')[0],
                items: cart.items,
                total: cart.cartTotal,
                status: 'Processing',
                deliveryDetails: {
                    estimatedArrival: 'In 3-5 business days',
                    trackingStatus: 'Preparing'
                }
            };
            setCurrentUser({
                ...currentUser,
                orderHistory: [newOrder, ...currentUser.orderHistory]
            });
        }
        cart.clearCart();
        setCurrentView('CONFIRMATION');
    };
    
    const handleDeadlineChange = (window: OrderWindow) => {
        setSelectedDeadline(window);
    };

    const handleNavigate = (view: UserViewType) => {
        if (view === 'PROFILE') {
            setProfileInitialTab('dashboard');
        }
        setCurrentView(view);
    };
    
    const handleManageSubscription = () => {
        setProfileInitialTab('subscriptions');
        setCurrentView('PROFILE');
    };

    const renderContent = () => {
        switch (currentView) {
            case 'SHOP':
                return (
                     <div className="container mx-auto px-6 py-8">
                        {/* Only show welcome banner/suggestions if logged in and on shop page, otherwise standard shop */}
                         {!isAuthenticated && (
                             <div className="mb-8 p-8 bg-green-50 rounded-lg text-center border border-green-100">
                                 <h2 className="text-3xl font-bold text-gray-800 mb-2">Fresh From Our Local Farms</h2>
                                 <p className="text-gray-600">Join Farm2Flat today for personalized recipes and exclusive local produce!</p>
                                 <button onClick={() => setCurrentView('AUTH')} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">Sign Up / Sign In</button>
                             </div>
                         )}

                         {isAuthenticated && currentUser && (
                            <PersonalizedSuggestions 
                                user={currentUser}
                                onGetSuggestions={handleGetSuggestions}
                                suggestions={suggestions}
                                isLoading={isLoadingSuggestions}
                                onAddToCart={cart.addToCart}
                                availableProducts={regionalProducts}
                            />
                        )}

                        <div className="">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Fresh from the Farm Catalog</h2>
                            
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Sidebar Filters */}
                                <aside className="lg:w-1/4">
                                    <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
                                        <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
                                        <ul className="space-y-1 max-h-[70vh] overflow-y-auto pr-2">
                                            {categories.map(cat => (
                                                <li key={cat}>
                                                    <button 
                                                        onClick={() => setSelectedCategory(cat)}
                                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${selectedCategory === cat ? 'bg-green-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                                                    >
                                                        {cat}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </aside>

                                {/* Product Grid */}
                                <div className="lg:w-3/4">
                                    <div className="flex justify-between items-center mb-4">
                                         <p className="text-sm text-gray-500">Showing {filteredProducts.length} items for region: <span className="font-bold text-green-700">{postalCode || 'Default'}</span></p>
                                    </div>
                                   
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredProducts.map(p => (
                                            <ProductCard 
                                                key={p.id} 
                                                product={p} 
                                                onAddToCart={cart.addToCart}
                                                isRegular={currentUser?.regularPurchaseList?.includes(p.id) || false}
                                                onToggleRegular={handleToggleRegular}
                                                available={p.available}
                                            />
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <div className="col-span-full text-center py-12 text-gray-500">
                                                No products found in this category.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'SUBSCRIPTIONS':
                return (
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Subscription Boxes</h2>
                        <div className="space-y-8">
                            {mockSubscriptionBoxes.map(s => 
                                <SubscriptionCard 
                                    key={s.id} 
                                    subscription={s} 
                                    onAddToCart={cart.addToCart} 
                                    isSubscribed={isAuthenticated && activeSubscriptions.has(s.id)}
                                    onManageSubscription={handleManageSubscription}
                                />
                            )}
                        </div>
                    </div>
                );
            case 'CART':
                return <CartView items={cart.items} cartTotal={cart.cartTotal} updateQuantity={cart.updateQuantity} removeFromCart={cart.removeFromCart} onCheckout={handleCheckout} />;
            case 'AUTH':
                return <AuthView onAuthSuccess={handleAuthSuccess} />;
            case 'CHECKOUT':
                 if (!currentUser) return <AuthView onAuthSuccess={handleAuthSuccess} />; // Should not happen if flow is correct, but a good guard
                return <CheckoutView cartTotal={cart.cartTotal} user={currentUser} onConfirmOrder={() => setCurrentView('GATEWAY')} onBackToCart={() => setCurrentView('CART')} />;
            case 'GATEWAY':
                return <PaymentGatewayView onPaymentSuccess={handlePaymentSuccess} />;
            case 'CONFIRMATION':
                return <ConfirmationView onContinue={() => setCurrentView('PROFILE')} />;
            case 'PROFILE':
                 if (!currentUser) return <AuthView onAuthSuccess={handleAuthSuccess} />; // Protect profile route
                 return <ProfileView 
                    user={currentUser} 
                    onUpdateUser={setCurrentUser} 
                    onToggleRegular={handleToggleRegular} 
                    onAddToCart={cart.addToCart} 
                    initialTab={profileInitialTab}
                    suggestions={suggestions}
                    isLoadingSuggestions={isLoadingSuggestions}
                    onGetSuggestions={handleGetSuggestions}
                    regionalProducts={regionalProducts}
                    recipes={recipes}
                    isLoadingRecipes={isLoadingRecipes}
                    onGenerateRecipes={handleGenerateRecipes}
                    onSelectRecipe={setSelectedRecipe}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header onNavigate={handleNavigate} cartItemCount={cart.totalItems} postalCode={postalCode} onPostalCodeChange={setPostalCode} isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />
            <CountdownTimer deadlineDate={deadlineDate} onDeadlineChange={handleDeadlineChange} selectedDeadline={selectedDeadline} />
            <main>
                {renderContent()}
            </main>
             {selectedRecipe && (
                <RecipeDetailModal 
                    recipe={selectedRecipe} 
                    availableProducts={regionalProducts} // Pass all regional products for recipe matching
                    onClose={() => setSelectedRecipe(null)} 
                    onAddToCart={handleAddRecipeItemsToCart}
                />
            )}
            <footer className="bg-gray-200 text-center p-4 mt-8">
                <p>&copy; 2024 Farm2Flat. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default UserView;
