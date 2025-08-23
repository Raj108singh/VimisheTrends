'use client';

import { useState } from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const cartItems = [
    {
      id: 1,
      name: "Comfort First Training Bra - 3 Pack",
      price: 899,
      originalPrice: 1299,
      size: "30",
      color: "Pink",
      quantity: 1,
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
      packInfo: "2-Pack"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal >= 599 ? 0 : 49;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order placed successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street, Apartment 4B"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-pink-500"
                    />
                    <label htmlFor="cod" className="flex items-center space-x-2">
                      <span>💰</span>
                      <span>Cash on Delivery (COD)</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-pink-500"
                    />
                    <label htmlFor="upi" className="flex items-center space-x-2">
                      <span>📱</span>
                      <span>UPI Payment</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="wallet"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-pink-500"
                    />
                    <label htmlFor="wallet" className="flex items-center space-x-2">
                      <span>💳</span>
                      <span>Digital Wallet</span>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">👙</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm line-clamp-2">{item.name}</h3>
                      <div className="text-xs text-gray-600">
                        <Badge variant="outline" className="mr-1">{item.packInfo}</Badge>
                        {item.size} • {item.color} • Qty: {item.quantity}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-semibold text-sm">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <hr className="my-4" />
              
              {/* Price Breakdown */}
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
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3"
              >
                Place Order
              </Button>
              
              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">🔒</span>
                    <span>100% secure payments</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">↩️</span>
                    <span>Easy 15-day returns</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🚚</span>
                    <span>Fast delivery within 3-5 days</span>
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