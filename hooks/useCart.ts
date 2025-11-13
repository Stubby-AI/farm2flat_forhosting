import { useState, useCallback, useMemo } from 'react';
import { CartItem, Product, SubscriptionBox, SubscriptionFrequency } from '../types';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: Product | SubscriptionBox, options: { frequency?: SubscriptionFrequency; isTrial?: boolean } = {}) => {
    const isSubscription = 'size' in item;
    const type = isSubscription ? 'subscription' : 'product';

    const cartId = isSubscription
      ? `sub-${item.id}-${options.frequency}-${!!options.isTrial}`
      : `prod-${item.id}`;

    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.cartId === cartId);
      if (existingItem) {
        return prevItems.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }

      const newItem: CartItem = {
        cartId,
        id: item.id,
        name: isSubscription ? `${item.type} Box (${item.size})` : item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
        type,
        unit: isSubscription ? undefined : item.unit,
        frequency: options.frequency,
        isTrial: !!options.isTrial,
      };

      return [...prevItems, newItem];
    });
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);
  
  const totalItems = useMemo(() => {
      return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);


  return { items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, totalItems };
};