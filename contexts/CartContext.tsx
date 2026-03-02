'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  syncCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        return calculateTotals({ ...state, items: newItems });
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: newItems });
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== action.payload.id);
        return calculateTotals({ ...state, items: newItems });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return calculateTotals({ ...state, items: updatedItems });
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0, isLoading: false };
    
    case 'LOAD_CART':
      return calculateTotals({ ...state, items: action.payload });
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
};

const calculateTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...state, total, itemCount };
};

// API functions for database operations
const cartAPI = {
  async get() {
    const response = await fetch('/api/cart');
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  async add(item: Omit<CartItem, 'quantity'>) {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        variant: item.variant,
      }),
    });
    if (!response.ok) throw new Error('Failed to add item');
    return response.json();
  },

  async update(id: string, quantity: number, variant?: string) {
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, quantity, variant }),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  },

  async remove(id: string, variant?: string) {
    const url = new URL('/api/cart', window.location.origin);
    url.searchParams.set('productId', id);
    if (variant) url.searchParams.set('variant', variant);
    
    const response = await fetch(url.toString(), { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to remove item');
    return response.json();
  },

  async clear() {
    const response = await fetch('/api/cart', { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to clear cart');
    return response.json();
  },
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
  });

  // Load cart based on authentication status
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        // Check if there's a localStorage cart to sync
        const localCart = localStorage.getItem('shilajit-cart');
        const hasLocalItems = localCart && JSON.parse(localCart).length > 0;

        // Load from database for authenticated users
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const dbCart = await cartAPI.get();
          
          // If user has local cart items and empty database cart, sync them
          if (hasLocalItems && (!dbCart.items || dbCart.items.length === 0)) {
            await syncCart();
          } else {
            const cartItems = dbCart.items.map((item: any) => ({
              id: item.productId,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
              variant: item.variant,
            }));
            dispatch({ type: 'LOAD_CART', payload: cartItems });
          }
        } catch (error) {
          console.error('Error loading cart from database:', error);
          // Fallback to localStorage if database fails
          loadFromLocalStorage();
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        // Load from localStorage for guests
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const savedCart = localStorage.getItem('shilajit-cart');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartItems });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Save cart to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('shilajit-cart', JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated]);

  // Sync localStorage cart to database when user logs in
  const syncCart = async () => {
    if (!isAuthenticated || state.items.length === 0) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Add each item from localStorage to database
      for (const item of state.items) {
        await cartAPI.add(item);
      }
      
      // Clear localStorage cart
      localStorage.removeItem('shilajit-cart');
      
      // Reload cart from database
      const dbCart = await cartAPI.get();
      const cartItems = dbCart.items.map((item: any) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        variant: item.variant,
      }));
      dispatch({ type: 'LOAD_CART', payload: cartItems });
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addItem = async (item: Omit<CartItem, 'quantity'>) => {
    if (isAuthenticated && user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const dbCart = await cartAPI.add(item);
        const cartItems = dbCart.items.map((item: any) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          variant: item.variant,
        }));
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error adding item to database:', error);
        // Fallback to local state
        dispatch({ type: 'ADD_ITEM', payload: item });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'ADD_ITEM', payload: item });
    }
  };

  const removeItem = async (id: string, variant?: string) => {
    if (isAuthenticated && user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const dbCart = await cartAPI.remove(id, variant);
        const cartItems = dbCart.items.map((item: any) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          variant: item.variant,
        }));
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error removing item from database:', error);
        dispatch({ type: 'REMOVE_ITEM', payload: id });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (isAuthenticated && user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const dbCart = await cartAPI.update(id, quantity);
        const cartItems = dbCart.items.map((item: any) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          variant: item.variant,
        }));
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error updating quantity in database:', error);
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await cartAPI.clear();
        dispatch({ type: 'CLEAR_CART' });
      } catch (error) {
        console.error('Error clearing cart in database:', error);
        dispatch({ type: 'CLEAR_CART' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        syncCart,
        isLoading: state.isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};