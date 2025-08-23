import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import CartSidebar from '../components/cart-sidebar';
import Home from '../components/pages/home';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Home />
      <Footer />
      <CartSidebar />
    </div>
  );
}