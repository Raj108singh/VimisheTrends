'use client';

import { useState } from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Comfort First Training Bra - 3 Pack",
      price: 899,
      originalPrice: 1299,
      size: "30",
      color: "Pink",
      quantity: 1,
      image: "/api/placeholder/300/400",
      packInfo: "3-Pack"
    },
    {
      id: 2,
      name: "Cartoon Print Camisoles - 2 Pack",
      price: 649,
      originalPrice: 899,
      size: "M",
      color: "Unicorn Print",
      quantity: 2,
      image: "/api/placeholder/300/400",
      packInfo: "2-Pack"
    }
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal >= 599 ? 0 : 49;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Bag</h1>
          
          {/* Empty Cart */}
          <div className="text-center py-16">
            <div className="mb-8">
              <span className="text-6xl">🛍️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your bag is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your bag yet.</p>
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Bag ({cartItems.length} items)</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👙</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full mr-2">{item.packInfo}</span>
                      Size: {item.size} • Color: {item.color}
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="font-bold text-lg">₹{item.price}</span>
                      <span className="text-gray-500 line-through text-sm">₹{item.originalPrice}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>You Save</span>
                  <span>-₹{savings}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-pink-600">Add ₹{599 - subtotal} more for free shipping</p>
                )}
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 mb-4">
                Proceed to Checkout
              </Button>
              
              <div className="text-center">
                <Link href="/products" className="text-pink-500 text-sm hover:underline">
                  Continue Shopping
                </Link>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">🚚</span>
                    <span>Free shipping on orders above ₹599</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">↩️</span>
                    <span>Easy 15-day returns</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🔒</span>
                    <span>100% secure payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}