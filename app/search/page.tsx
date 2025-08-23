'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Search Products</h1>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-12 py-3 text-lg"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-search"></i>
            </Button>
          </div>
        </div>

        <div className="text-center py-16">
          <div className="mb-8">
            <i className="fas fa-search text-6xl text-gray-300"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Start your search</h2>
          <p className="text-gray-600">Enter a product name or category above to find what you're looking for.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}