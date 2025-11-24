'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getRestaurantById, getRestaurantByOwnerId, updateRestaurant, getAllRestaurantsAdmin } from '@/api/api';
import { useAuth } from './auth-context';
import { useToast } from '@/components/ui/toaster';

export interface RestaurantData {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  cuisineTypes?: string[];
  openingTime?: string;
  closingTime?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  isOpen?: boolean;
  offers?: string;
  ownerId: string;
  status: 'approved' | 'pending' | 'rejected' | 'blocked';
  createdAt?: string;
  updatedAt?: string;
}

interface RestaurantContextType {
  restaurant: RestaurantData | null;
  restaurantId: string | null;
  restaurantStatus: 'approved' | 'pending' | 'rejected' | 'blocked' | null;
  loading: boolean;
  fetchRestaurant: () => Promise<void>;
  updateRestaurant: (data: Partial<RestaurantData>) => Promise<boolean>;
  logout: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Find restaurant by ownerId
  const fetchRestaurant = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'restaurant') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Try to get restaurant by ownerId first (if endpoint exists)
      const storedRestaurantId = localStorage.getItem('restaurantId');
      
      if (storedRestaurantId) {
        try {
          const res = await getRestaurantById(storedRestaurantId);
          if (res.data.success && res.data.data) {
            // Verify it belongs to this owner
            if (res.data.data.ownerId === user.id) {
              setRestaurant(res.data.data);
              return;
            }
          }
        } catch (error) {
          // Restaurant not found, continue to search
        }
      }

      // Fallback: Try ownerId endpoint (may not exist yet)
      try {
        const res = await getRestaurantByOwnerId(user.id);
        if (res.data.success && res.data.data) {
          setRestaurant(res.data.data);
          localStorage.setItem('restaurantId', res.data.data._id);
          return;
        }
      } catch (error) {
        // Endpoint doesn't exist, try admin endpoint as fallback
      }

      // Last resort: Get all restaurants and find by ownerId
      // This is inefficient but works if no ownerId endpoint exists
      try {
        const res = await getAllRestaurantsAdmin();
        if (res.data.success && res.data.data) {
          const foundRestaurant = res.data.data.find((r: RestaurantData) => r.ownerId === user.id);
          if (foundRestaurant) {
            setRestaurant(foundRestaurant);
            localStorage.setItem('restaurantId', foundRestaurant._id);
            return;
          }
        }
      } catch (error) {
        // Admin endpoint requires admin role, skip
      }

      // No restaurant found
      console.warn('Restaurant not found for this user. Please create a restaurant first.');
    } catch (error: any) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Auto-fetch restaurant when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role === 'restaurant') {
      fetchRestaurant();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, fetchRestaurant]);

  const updateRestaurantData = async (data: Partial<RestaurantData>): Promise<boolean> => {
    if (!restaurant?._id) {
      toast({ message: 'Restaurant not found', type: 'error' });
      return false;
    }

    try {
      const response = await updateRestaurant(restaurant._id, data);
      if (response.data.success) {
        setRestaurant({ ...restaurant, ...data });
        toast({ message: 'Restaurant updated successfully', type: 'success' });
        return true;
      } else {
        toast({ message: response.data.message || 'Failed to update restaurant', type: 'error' });
        return false;
      }
    } catch (error: any) {
      console.error('Error updating restaurant:', error);
      toast({ message: error.response?.data?.message || 'Error updating restaurant', type: 'error' });
      return false;
    }
  };

  const logout = () => {
    setRestaurant(null);
    localStorage.removeItem('restaurantId');
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        restaurantId: restaurant?._id || null,
        restaurantStatus: restaurant?.status || null,
        loading,
        fetchRestaurant,
        updateRestaurant: updateRestaurantData,
        logout,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    // Return default values if used outside provider (for non-restaurant pages)
    return {
      restaurant: null,
      restaurantId: null,
      restaurantStatus: null,
      loading: false,
      fetchRestaurant: async () => {},
      updateRestaurant: async () => false,
      logout: () => {},
    };
  }
  return context;
}

