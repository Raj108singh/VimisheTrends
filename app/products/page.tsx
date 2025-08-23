'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedFilters, setSelectedFilters] = useState({
    ageGroup: 'all',
    size: 'all',
    fabric: 'all'
  });

  // Products data for kids innerwear
  const products = [
    {
      id: 1,
      name: "Comfort First Training Bra - 3 Pack",
      category: "training-bras",
      price: 899,
      originalPrice: 1299,
      discount: 31,
      packInfo: "3-Pack",
      image: "/api/placeholder/300/400",
      rating: 4.8,
      reviews: 156,
      ageGroup: "8-14",
      fabric: "Cotton Spandex",
      sizes: ["28", "30", "32"],
      tags: ["bestseller", "comfort"]
    },
    {
      id: 2,
      name: "Cartoon Print Camisoles - 2 Pack",
      category: "camisoles",
      price: 649,
      originalPrice: 899,
      discount: 28,
      packInfo: "2-Pack",
      image: "/api/placeholder/300/400",
      rating: 4.6,
      reviews: 89,
      ageGroup: "6-12",
      fabric: "Cotton",
      sizes: ["S", "M", "L"],
      tags: ["cartoon", "colorful"]
    },
    {
      id: 3,
      name: "Premium Cotton Underwear Pack - 5 Pack",
      category: "underwear-packs",
      price: 799,
      originalPrice: 1199,
      discount: 33,
      packInfo: "5-Pack",
      image: "/api/placeholder/300/400",
      rating: 4.7,
      reviews: 234,
      ageGroup: "4-12",
      fabric: "Cotton",
      sizes: ["S", "M", "L"],
      tags: ["value-pack", "essential"]
    },
    {
      id: 4,
      name: "Cozy Night Suit Set",
      category: "night-suits",
      price: 1299,
      originalPrice: 1799,
      discount: 28,
      packInfo: "1 Set",
      image: "/api/placeholder/300/400",
      rating: 4.9,
      reviews: 67,
      ageGroup: "2-10",
      fabric: "Organic Cotton",
      sizes: ["XS", "S", "M"],
      tags: ["organic", "premium"]
    },
    {
      id: 5,
      name: "Boys Comfort Boxers - 4 Pack",
      category: "boxers",
      price: 699,
      originalPrice: 999,
      discount: 30,
      packInfo: "4-Pack",
      image: "/api/placeholder/300/400",
      rating: 4.5,
      reviews: 123,
      ageGroup: "6-14",
      fabric: "Cotton Blend",
      sizes: ["S", "M", "L"],
      tags: ["boys", "active"]
    },
    {
      id: 6,
      name: "Trendy Skater Skirt",
      category: "skater-skirts",
      price: 849,
      originalPrice: 1199,
      discount: 29,
      packInfo: "1 Piece",
      image: "/api/placeholder/300/400",
      rating: 4.4,
      reviews: 78,
      ageGroup: "8-16",
      fabric: "Cotton Poly",
      sizes: ["XS", "S", "M"],
      tags: ["trendy", "casual"]
    }
  ];

  // Filter products based on selected category
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'training-bras', name: 'Training Bras' },
    { id: 'camisoles', name: 'Camisoles' },
    { id: 'underwear-packs', name: 'Underwear Packs' },
    { id: 'night-suits', name: 'Night Suits' },
    { id: 'boxers', name: 'Boxers' },
    { id: 'skater-skirts', name: 'Skater Skirts' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Kids Innerwear Collection</h1>
          <p className="text-gray-600">Comfortable, soft & safe innerwear for growing children</p>
        </div>
      </div>

      {/* Filters & Categories */}
      <div className="bg-white py-6 px-4 border-b">
        <div className="container mx-auto">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-pink-500 hover:bg-pink-600" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Additional Filters */}
          <div className="flex flex-wrap gap-4 text-sm">
            <select 
              value={selectedFilters.ageGroup} 
              onChange={(e) => setSelectedFilters({...selectedFilters, ageGroup: e.target.value})}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Ages</option>
              <option value="2-6">2-6 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10-14">10-14 years</option>
            </select>
            
            <select 
              value={selectedFilters.fabric} 
              onChange={(e) => setSelectedFilters({...selectedFilters, fabric: e.target.value})}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Fabrics</option>
              <option value="cotton">Cotton</option>
              <option value="cotton-spandex">Cotton Spandex</option>
              <option value="organic">Organic Cotton</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-4">
            <p className="text-gray-600">{filteredProducts.length} products found</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-all group">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 md:h-64 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <span className="text-4xl opacity-50">👕</span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">{product.discount}% OFF</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full">{product.rating} ★</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">{product.packInfo}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{product.ageGroup} • {product.fabric}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600 text-white">Add to Cart</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}