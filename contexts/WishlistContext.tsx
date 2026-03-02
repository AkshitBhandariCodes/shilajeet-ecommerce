'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WishlistItem {
    _id?: string;
    productId: string;
    productName: string;
    productPrice: number;
    productImage: string;
    addedAt: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    isInWishlist: (productId: string) => boolean;
    addToWishlist: (product: { id: string; name: string; price: number; image: string }) => Promise<boolean>;
    removeFromWishlist: (productId: string) => Promise<boolean>;
    wishlistCount: number;
    loading: boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();

    // Load wishlist on mount and when authentication changes
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchWishlist();
        } else {
            loadLocalWishlist();
        }
    }, [isAuthenticated, user]);

    // Load wishlist from localStorage for non-authenticated users
    const loadLocalWishlist = () => {
        try {
            const localWishlist = localStorage.getItem('agnishila_wishlist');
            if (localWishlist) {
                const items = JSON.parse(localWishlist);
                setWishlistItems(items);
            } else {
                setWishlistItems([]);
            }
        } catch (error) {
            console.error('Error loading local wishlist:', error);
            setWishlistItems([]);
        }
    };

    // Save wishlist to localStorage for non-authenticated users
    const saveLocalWishlist = (items: WishlistItem[]) => {
        try {
            localStorage.setItem('agnishila_wishlist', JSON.stringify(items));
        } catch (error) {
            console.error('Error saving local wishlist:', error);
        }
    };

    // Sync local wishlist to database when user logs in
    const syncLocalWishlistToDatabase = async () => {
        try {
            const localWishlist = localStorage.getItem('agnishila_wishlist');
            if (localWishlist) {
                const localItems = JSON.parse(localWishlist);
                
                // Add each local item to database
                for (const item of localItems) {
                    await fetch('/api/wishlist', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            productId: item.productId,
                            productName: item.productName,
                            productPrice: item.productPrice,
                            productImage: item.productImage,
                        }),
                    });
                }
                
                // Clear local storage after sync
                localStorage.removeItem('agnishila_wishlist');
                
                // Fetch updated wishlist from database
                await fetchWishlist();
            }
        } catch (error) {
            console.error('Error syncing local wishlist:', error);
        }
    };

    const fetchWishlist = async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        try {
            // First sync any local wishlist items
            await syncLocalWishlistToDatabase();
            
            const response = await fetch('/api/wishlist');
            if (response.ok) {
                const items = await response.json();
                setWishlistItems(items);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product: { id: string; name: string; price: number; image: string }): Promise<boolean> => {
        // Check if item is already in wishlist
        if (isInWishlist(product.id)) {
            return false;
        }

        const newItem: WishlistItem = {
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image,
            addedAt: new Date().toISOString(),
        };

        if (isAuthenticated) {
            // Add to database for authenticated users
            try {
                const response = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productId: product.id,
                        productName: product.name,
                        productPrice: product.price,
                        productImage: product.image,
                    }),
                });

                if (response.ok) {
                    await fetchWishlist(); // Refresh wishlist
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Error adding to wishlist:', error);
                return false;
            }
        } else {
            // Add to localStorage for non-authenticated users
            const updatedItems = [...wishlistItems, newItem];
            setWishlistItems(updatedItems);
            saveLocalWishlist(updatedItems);
            return true;
        }
    };

    const removeFromWishlist = async (productId: string): Promise<boolean> => {
        if (isAuthenticated) {
            // Remove from database for authenticated users
            try {
                const response = await fetch(`/api/wishlist?productId=${productId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    await fetchWishlist(); // Refresh wishlist
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Error removing from wishlist:', error);
                return false;
            }
        } else {
            // Remove from localStorage for non-authenticated users
            const updatedItems = wishlistItems.filter(item => item.productId !== productId);
            setWishlistItems(updatedItems);
            saveLocalWishlist(updatedItems);
            return true;
        }
    };

    const isInWishlist = (productId: string): boolean => {
        return wishlistItems.some(item => item.productId === productId);
    };

    const refreshWishlist = async () => {
        await fetchWishlist();
    };

    const value: WishlistContextType = {
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        wishlistCount: wishlistItems.length,
        loading,
        refreshWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}