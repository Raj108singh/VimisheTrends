'use client';

import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hero slider data for kids innerwear
  const sliders = [
    {
      id: 1,
      title: "3-Pack Comfort Bras",
      description: "Starting at ₹899 - Perfect for Growing Girls",
      buttonText: "Shop Training Bras",
      linkUrl: "/products?category=training-bras",
    },
    {
      id: 2,
      title: "New Cartoon Prints",
      description: "Fun Camisoles & Underwear Sets",
      buttonText: "Explore Collection",
      linkUrl: "/products?category=camisoles",
    },
    {
      id: 3,
      title: "Boys Comfort Wear",
      description: "Soft Boxers & Night Suits",
      buttonText: "Shop Boys",
      linkUrl: "/products?category=boxers",
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner - Bewakoof Style */}
      <section className="relative bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-yellow-400 text-purple-800 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                  🌟 NEW COLLECTION
                </div>
                <h1 className="text-4xl md:text-7xl font-black leading-tight">
                  First Bras &<br />
                  <span className="text-yellow-300 text-stroke">Comfort</span><br />
                  <span className="text-pink-200">For Kids</span>
                </h1>
                <p className="text-xl md:text-2xl font-medium opacity-95">
                  Premium innerwear collection<br />
                  <span className="text-yellow-200 font-bold">starting at ₹649</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products?category=training-bras">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-yellow-100 hover:scale-105 font-bold px-8 py-4 text-lg w-full sm:w-auto shadow-xl transform transition-all duration-300">
                    Shop Training Bras
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 hover:scale-105 font-bold px-8 py-4 text-lg w-full sm:w-auto transform transition-all duration-300">
                    Browse All
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              <div className="relative">
                <div className="w-80 h-80 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border-4 border-white/30">
                  <span className="text-9xl animate-bounce">👙</span>
                </div>
                <div className="absolute -top-6 -right-6 bg-yellow-400 text-purple-800 px-6 py-3 rounded-full font-black text-lg shadow-xl animate-pulse">
                  Starting ₹649
                </div>
                <div className="absolute -bottom-6 -left-6 bg-pink-300 text-purple-800 px-6 py-3 rounded-full font-bold text-lg shadow-xl">
                  Made in India 🇮🇳
                </div>
                <div className="absolute top-10 -left-10 bg-indigo-300 text-purple-800 px-4 py-2 rounded-full font-bold text-sm shadow-lg rotate-12">
                  100% Cotton
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Offer Banner Row */}
      <section className="py-4 px-4 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center text-white">
            <div className="flex items-center space-x-3 hover:scale-105 transition-transform">
              <span className="text-3xl animate-bounce">🚚</span>
              <span className="font-bold text-lg">FREE Shipping ₹599+</span>
            </div>
            <div className="flex items-center space-x-3 hover:scale-105 transition-transform">
              <span className="text-3xl">💝</span>
              <span className="font-bold text-lg">Buy 2 Get 1 FREE</span>
            </div>
            <div className="flex items-center space-x-3 hover:scale-105 transition-transform">
              <span className="text-3xl">↩️</span>
              <span className="font-bold text-lg">15-Day Returns</span>
            </div>
            <div className="flex items-center space-x-3 hover:scale-105 transition-transform">
              <span className="text-3xl">🇮🇳</span>
              <span className="font-bold text-lg">Made in India</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Banner Grid - Bewakoof Style */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Comfort & Style for Growing Kids</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/products?category=training-bras" className="group">
              <div className="bg-gradient-to-br from-pink-200 to-pink-300 rounded-3xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-pink-100">
                <div className="w-20 h-20 bg-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:animate-bounce">
                  <span className="text-3xl">👙</span>
                </div>
                <h3 className="font-black text-gray-800 mb-2 text-lg">Training Bras</h3>
                <p className="text-pink-700 font-bold">Starting ₹899</p>
                <div className="mt-3 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block">
                  3-Pack Available
                </div>
              </div>
            </Link>
            
            <Link href="/products?category=camisoles" className="group">
              <div className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-3xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-purple-100">
                <div className="w-20 h-20 bg-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:animate-bounce">
                  <span className="text-3xl">👕</span>
                </div>
                <h3 className="font-black text-gray-800 mb-2 text-lg">Camisoles</h3>
                <p className="text-purple-700 font-bold">Starting ₹649</p>
                <div className="mt-3 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block">
                  Fun Prints
                </div>
              </div>
            </Link>
            
            <Link href="/products?category=underwear-packs" className="group">
              <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-blue-100">
                <div className="w-20 h-20 bg-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:animate-bounce">
                  <span className="text-3xl">🩲</span>
                </div>
                <h3 className="font-black text-gray-800 mb-2 text-lg">Underwear</h3>
                <p className="text-blue-700 font-bold">Starting ₹799</p>
                <div className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block">
                  5-Pack Value
                </div>
              </div>
            </Link>
            
            <Link href="/products?category=night-suits" className="group">
              <div className="bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-3xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-indigo-100">
                <div className="w-20 h-20 bg-indigo-400 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:animate-bounce">
                  <span className="text-3xl">🌙</span>
                </div>
                <h3 className="font-black text-gray-800 mb-2 text-lg">Night Suits</h3>
                <p className="text-indigo-700 font-bold">Starting ₹1299</p>
                <div className="mt-3 bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block">
                  Organic Cotton
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Large Promotional Banners */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Main Banner */}
            <div className="relative bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl overflow-hidden h-80 group hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                <div className="text-white">
                  <h3 className="text-4xl font-black mb-4">FIRST BRA</h3>
                  <p className="text-2xl font-bold mb-6">Collection</p>
                  <p className="text-xl mb-6">Perfect comfort for growing girls</p>
                  <Link href="/products?category=training-bras">
                    <Button className="bg-white text-purple-600 hover:bg-yellow-100 font-bold px-8 py-4 text-lg shadow-lg">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Secondary Banner */}
            <div className="relative bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl overflow-hidden h-80 group hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                <div className="text-white">
                  <h3 className="text-4xl font-black mb-4">BOYS WEAR</h3>
                  <p className="text-2xl font-bold mb-6">Comfort Range</p>
                  <p className="text-xl mb-6">Soft boxers & night suits</p>
                  <Link href="/products?category=boxers">
                    <Button className="bg-white text-blue-600 hover:bg-yellow-100 font-bold px-8 py-4 text-lg shadow-lg">
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Bestsellers Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Trending Bestsellers</h2>
            <p className="text-xl text-gray-600">Most loved by our customers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 1, name: "3-Pack Training Bras", price: 899, originalPrice: 1299, rating: 4.8, discount: 31, pack: "3-Pack", emoji: "👙" },
              { id: 2, name: "Cartoon Camisoles", price: 649, originalPrice: 899, rating: 4.6, discount: 28, pack: "2-Pack", emoji: "👕" },
              { id: 3, name: "Cotton Underwear Pack", price: 799, originalPrice: 1199, rating: 4.7, discount: 33, pack: "5-Pack", emoji: "🩲" },
              { id: 4, name: "Cozy Night Suit", price: 1299, originalPrice: 1799, rating: 4.9, discount: 28, pack: "1 Set", emoji: "🌙" }
            ].map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-3xl overflow-hidden group cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-gray-100">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <span className="text-6xl group-hover:animate-bounce">{product.emoji}</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">{product.discount}% OFF</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">{product.rating} ★</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-bold">{product.pack}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-xl text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold shadow-lg">
                    Add to Cart
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-gray-800 mb-6">Made with Love in India</h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              At Vimishe Fashion Trends, we believe every child deserves comfortable, high-quality innerwear. 
              Our products are crafted by women-led manufacturing units across India, ensuring the softest fabrics 
              and most comfortable fits for your growing children.
            </p>
            
            <div className="grid md:grid-cols-3 gap-10 mt-16">
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:animate-bounce">
                  <span className="text-4xl">🇮🇳</span>
                </div>
                <h3 className="font-black text-gray-800 mb-3 text-xl">Made in India</h3>
                <p className="text-gray-600">Supporting local manufacturing & women entrepreneurs</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:animate-bounce">
                  <span className="text-4xl">👩‍💼</span>
                </div>
                <h3 className="font-black text-gray-800 mb-3 text-xl">Women-Led</h3>
                <p className="text-gray-600">Empowering 50+ women-led manufacturing units</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:animate-bounce">
                  <span className="text-4xl">🌟</span>
                </div>
                <h3 className="font-black text-gray-800 mb-3 text-xl">Quality First</h3>
                <p className="text-gray-600">Premium materials, comfort & safety testing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}