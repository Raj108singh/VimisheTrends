'use client';

import { useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
    packInfo: string;
  };
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1, size?: string, color?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          size,
          color,
        }),
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart?id=${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
    return false;
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: itemId,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
    return false;
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemCount,
    fetchCart,
  };
}