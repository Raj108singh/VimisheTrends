import React from 'react';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import CartSidebar from '../../../components/cart-sidebar';
import ProductDetail from '../../../components/pages/product-detail';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductDetail slug={params.slug} />
      <Footer />
      <CartSidebar />
    </div>
  );
}