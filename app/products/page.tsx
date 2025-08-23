import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CartSidebar from '../../components/cart-sidebar';
import Products from '../../components/pages/products';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Products />
      <Footer />
      <CartSidebar />
    </div>
  );
}