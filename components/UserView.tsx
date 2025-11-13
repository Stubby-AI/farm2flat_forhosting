
import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../hooks/useCart';
import { mockProducts, mockSubscriptionBoxes, mockUser } from '../mock/data';
import { Product, SubscriptionBox, SubscriptionFrequency, User, CartItem } from '../types';
import { getPersonalizedSuggestions } from '../services/geminiService';
import { ShoppingCartIcon, LeafIcon, UserIcon, TrashIcon, PlusIcon, MinusIcon, ArrowRightIcon, MapPinIcon } from './Icons';

type UserViewType = 'SHOP' | 'SUBSCRIPTIONS' | 'CART' | 'PROFILE' | 'CHECKOUT' | 'CONFIRMATION';
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

// Helper Components defined in the same file but outside the main component
const Header: React.FC<{
    onNavigate: (view: UserViewType) => void;
    cartItemCount: number;
    postalCode: string;
    onPostalCodeChange: (