
import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../hooks/useCart';
import { mockProducts, mockSubscriptionBoxes, mockUser } from '../mock/data';
import { Product, SubscriptionBox, SubscriptionFrequency, User } from '../types';
import { getPersonalizedSuggestions } from '../services/geminiService';
import { ShoppingCartIcon, LeafIcon, UserIcon, TrashIcon, PlusIcon, MinusIcon } from './Icons';

type UserViewType = 'SHOP' | 'SUBSCRIPTIONS' | 'CART' | 'PROFILE';

// Helper Components defined in the same file but outside the main component
const Header: React.FC<{
    onNavigate: (view: UserViewType) => void;
    cartItemCount: number;
}> = ({ onNavigate, cartItemCount }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <button onClick={() => onNavigate('SHOP')} className="flex items-center space-x-2">
                        <LeafIcon className="h-8 w-8 text-green-600" />
                        <span className="text-2xl font-bold text-gray-800">FrescoHub</span>
                    </button>
                    <nav className="hidden md:flex items-center space-x-8">
                        <button onClick={() => onNavigate('SHOP')} className="text-gray-600 hover:text-green-600 transition">Shop</button>
                        <button onClick={() => onNavigate('SUBSCRIPTIONS')} className="text-gray-600 hover:text-green-600 transition">Subscriptions</button>
                        <button onClick={() => onNavigate('PROFILE')} className="text-gray-600 hover:text-green-600 transition">Profile</button>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => onNavigate('CART')} className="relative text-gray-600 hover:text-green-600 transition">
                            <ShoppingCartIcon className="h-7 w-7" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                            )}
                        </button>
                         <button onClick={() => onNavigate('PROFILE')} className="md:hidden text-gray-600 hover:text-green-600 transition">
                            <UserIcon className="h-7 w-7" />
                        </button>
                    </div>
                </div>
            </div>
            <CountdownTimer />
        </header>
    );
};

const CountdownTimer: React.FC = () => {
    const calculateTimeToNextDeadline = () => {
        const now = new Date();
        const wednesdayDeadline = new Date(now);
        wednesdayDeadline.setUTCHours(12, 0, 0, 0);
        wednesdayDeadline.setUTCDate(wednesdayDeadline.getUTCDate() + (3 - wednesdayDeadline.getUTCDay() + 7) % 7);

        const sundayDeadline = new Date(now);
        sundayDeadline.setUTCHours(12, 0, 0, 0);
        sundayDeadline.setUTCDate(sundayDeadline.getUTCDate() + (0 - sundayDeadline.getUTCDay() + 7) % 7);

        if (now > wednesdayDeadline) {
             wednesdayDeadline.setUTCDate(wednesdayDeadline.getUTCDate() + 7);
        }
        if (now > sundayDeadline) {
             sundayDeadline.setUTCDate(sundayDeadline.getUTCDate() + 7);
        }

        return wednesdayDeadline < sundayDeadline ? wednesdayDeadline : sundayDeadline;
    };
    
    const [deadline] = useState(calculateTimeToNextDeadline());
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const total = deadline.getTime() - new Date().getTime();
            const seconds = Math.floor((total / 1000) % 60);
            const minutes = Math.floor((total / 1000 / 60) % 60);
            const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
            const days = Math.floor(total / (1000 * 60 * 60 * 24));
            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(timer);
    }, [deadline]);

    return (
        <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
            Next order deadline: {deadline.getUTCDay() === 3 ? "Wednesday" : "Sunday"} at 12 PM. Time left: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
    );
};


const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void }> = ({ product, onAddToCart }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">from {product.farmer}</p>
            <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)} <span className="text-sm font-normal text-gray-600">/{product.unit}</span></p>
                <button onClick={() => onAddToCart(product)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition">Add</button>
            </div>
        </div>
    </div>
);

const SubscriptionCard: React.FC<{ box: SubscriptionBox; }> = ({ box }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800">{box.type} Box</h3>
            <p className="text-md text-gray-500 mb-2">{box.size}</p>
            {box.ethnicityFocus !== 'Standard' && <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{box.ethnicityFocus} Focus</span>}
            <p className="text-gray-700 my-4 h-20">{box.description}</p>
            <p className="text-sm text-gray-600 mb-2">Includes: {box.contentsSample.join(', ')}</p>
            <p className="text-3xl font-extrabold text-gray-900 mb-4">${box.price.toFixed(2)} <span className="text-base font-medium text-gray-500">/ delivery</span></p>
        </div>
        <div className="mt-auto p-6 bg-gray-50">
            <select className="w-full p-2 border border-gray-300 rounded-md mb-4">
                {Object.values(SubscriptionFrequency).map(freq => <option key={freq} value={freq}>{freq}</option>)}
            </select>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Subscribe Now</button>
            <button className="w-full mt-2 text-center text-green-600 font-semibold hover:underline">Try a one-time box</button>
        </div>
    </div>
);


// Main View Component
const UserView: React.FC = () => {
  const [postalCode, setPostalCode] = useState('');
  const [isPostalCodeSet, setIsPostalCodeSet] = useState(false);
  const [currentView, setCurrentView] = useState<UserViewType>('SHOP');
  const cart = useCart();
  const [user] = useState<User>(mockUser);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handlePostalCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postalCode.trim().length > 3) {
      setIsPostalCodeSet(true);
    }
  };
  
  const handleGetSuggestions = useCallback(async () => {
      setIsLoadingSuggestions(true);
      const purchaseHistoryProducts = user.orderHistory.flatMap(order => order.items.map(item => ({...item} as Product)));
      const result = await getPersonalizedSuggestions(purchaseHistoryProducts);
      setSuggestions(result);
      setIsLoadingSuggestions(false);
  }, [user.orderHistory]);

  const renderContent = () => {
    if (!isPostalCodeSet) {
        return (
            <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/grocery/1600/900')"}}>
                <div className="bg-white/90 p-10 rounded-xl shadow-2xl text-center backdrop-blur-sm">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">Fresh groceries, local prices.</h2>
                    <p className="text-lg text-gray-600 mb-6">Enter your postal code to start shopping.</p>
                    <form onSubmit={handlePostalCodeSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                        <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                            placeholder="e.g., A1A 1A1"
                            className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md">Shop Now</button>
                    </form>
                </div>
            </div>
        );
    }

    switch (currentView) {
        case 'SHOP':
            return (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Available for {postalCode}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {mockProducts.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={cart.addToCart} />
                        ))}
                    </div>
                </div>
            );
        case 'SUBSCRIPTIONS':
            return (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                     <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">Subscription Boxes</h1>
                     <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">The easiest way to get your fresh produce. Set your frequency and enjoy seasonal boxes delivered to your door.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {mockSubscriptionBoxes.map(box => <SubscriptionCard key={box.id} box={box} />)}
                     </div>
                </div>
            );
        case 'CART':
            return (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
                    {cart.items.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <div className="lg:flex lg:gap-8">
                            <div className="flex-grow">
                                {cart.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm mb-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} / {item.unit}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon className="h-4 w-4" /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon className="h-4 w-4" /></button>
                                        </div>
                                        <p className="font-bold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => cart.removeFromCart(item.id)} className="text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                ))}
                            </div>
                            <div className="lg:w-1/3 mt-8 lg:mt-0">
                                <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                                    <div className="flex justify-between mb-2 text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${cart.cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-4 text-gray-600">
                                        <span>Delivery</span>
                                        <span>FREE</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-xl border-t pt-4">
                                        <span>Total</span>
                                        <span>${cart.cartTotal.toFixed(2)}</span>
                                    </div>
                                    {cart.cartTotal < 20 && <p className="text-red-500 text-sm mt-4">Minimum order is $20.00</p>}
                                    <button disabled={cart.cartTotal < 20} className="w-full bg-green-600 text-white py-3 mt-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        case 'PROFILE':
             return (
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                     <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.name}!</h1>
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="lg:col-span-2">
                              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Order History</h2>
                              <div className="space-y-4">
                                  {user.orderHistory.map(order => (
                                      <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
                                          <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold">Order #{order.id}</p>
                                                    <p className="text-sm text-gray-500">{order.date}</p>
                                                </div>
                                                <p className="font-semibold">${order.total.toFixed(2)}</p>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    'bg-orange-100 text-orange-800'
                                                }`}>{order.status}</span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                         </div>
                         <div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-700 mb-4">AI Suggestions</h2>
                                <p className="text-gray-600 mb-4">Based on your purchase history, we think you'll love these:</p>
                                {isLoadingSuggestions ? (
                                    <div className="flex justify-center items-center h-24">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    </div>
                                ) : (
                                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                                        {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                )}
                                <button onClick={handleGetSuggestions} disabled={isLoadingSuggestions} className="w-full bg-green-600 text-white py-2 mt-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400">
                                    {isLoadingSuggestions ? 'Thinking...' : 'Get New Suggestions'}
                                </button>
                            </div>
                         </div>
                     </div>
                 </div>
             );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header onNavigate={setCurrentView} cartItemCount={cart.totalItems} />
      <main>{renderContent()}</main>
    </div>
  );
};

export default UserView;
