"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "@/src/lib/config";

interface CartContextType {
  cartCount: number;
  refreshCart: () => Promise<void>;
  updateCartCount: (count: number) => void;
  incrementCartCount: (amount?: number) => void;
  decrementCartCount: (amount?: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count from API
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.data?.totalItems !== undefined) {
        setCartCount(data.data.totalItems);
      } else {
        const items = data.data?.items || [];
        const count = items.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setCartCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch cart count", err);
    }
  }, [isAuthenticated, token]);

  // Update cart count directly
  const updateCartCount = useCallback((count: number) => {
    setCartCount(count);
  }, []);

  // Increment cart count
  const incrementCartCount = useCallback((amount: number = 1) => {
    setCartCount((prev) => prev + amount);
  }, []);

  // Decrement cart count
  const decrementCartCount = useCallback((amount: number = 1) => {
    setCartCount((prev) => Math.max(0, prev - amount));
  }, []);

  // Initial fetch on mount and when auth changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        refreshCart,
        updateCartCount,
        incrementCartCount,
        decrementCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
