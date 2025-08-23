'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Bag</h1>
        
        {/* Empty Cart */}
        <div className="text-center py-16">
          <div className="mb-8">
            <i className="fas fa-shopping-bag text-6xl text-gray-300"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your bag is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your bag yet.</p>
          <Button asChild>
            <a href="/products">Continue Shopping</a>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}