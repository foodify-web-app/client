'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem } from '@/types';
import { useToast } from '@/components/ui/toaster';

interface CartContextType {
  items: CartItem[];
  loadCartItem: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  cartRestaurantId: String;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const [items, setItems] = useState<CartItem[]>([]);
  const [cartRestaurantId, setCartRestaurantId] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const loadCartItem = useCallback((newItems: CartItem[]) => {
    const validItems = newItems.filter(item => item && item._id);
    setItems(validItems);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    if (cartRestaurantId == null) {
      setCartRestaurantId(item.restaurantId);
    } else {
      toast ({message : `${item.restaurantId}`, type: "success"})
      if (item.restaurantId != cartRestaurantId) {
        toast({ message: 'All items in an order must be from the same restaurant ', type: 'error' });
        return;
      }
    }
    setItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item._id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(item => (item._id === id ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider value={{ items, loadCartItem, addItem, removeItem, updateQuantity, clearCart, subtotal, cartRestaurantId }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
