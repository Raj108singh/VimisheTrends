import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CartSidebar from '../../components/cart-sidebar';
import Cart from '../../components/pages/cart';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Cart />
      <Footer />
      <CartSidebar />
    </div>
  );
}