'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  // Sample products data
  const products = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `Kids Fashion Item ${i + 1}`,
    price: 299 + (i * 100),
    originalPrice: 399 + (i * 100),
    image: `https://images.unsplash.com/photo-${1503454537195 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400`,
    rating: 4.5,
    category: i % 3 === 0 ? 'Girls' : i % 3 === 1 ? 'Boys' : 'Accessories'
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gray-50 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">All Products</h1>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Girls</Button>
            <Button variant="outline" size="sm">Boys</Button>
            <Button variant="outline" size="sm">Accessories</Button>
            <Button variant="outline" size="sm">New Arrivals</Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all group">
                <div className="relative overflow-hidden">
                  <Image 
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">{product.rating} ★</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-primary">₹{product.price}</span>
                      <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">Add to Cart</Button>
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