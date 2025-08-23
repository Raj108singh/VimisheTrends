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
      
      {/* Hero Banner - Clean Design */}
      <section className="relative bg-pink-500 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-white text-pink-500 px-4 py-2 rounded-full text-sm font-bold">
                  NEW COLLECTION
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  First Bras &<br />
                  Comfort Wear<br />
                  <span className="text-pink-200">For Growing Kids</span>
                </h1>
                <p className="text-xl md:text-2xl font-medium">
                  Premium innerwear collection<br />
                  <span className="font-bold">starting at ₹649</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products?category=training-bras">
                  <Button size="lg" className="bg-white text-pink-500 hover:bg-gray-100 font-bold px-8 py-4 text-lg w-full sm:w-auto">
                    Shop Training Bras
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-pink-500 font-bold px-8 py-4 text-lg w-full sm:w-auto">
                    Browse All
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              <div className="relative">
                <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Image 
                    src="/api/placeholder/300/300" 
                    alt="Kids Training Bras" 
                    width={300} 
                    height={300}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg">
                  Starting ₹649
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-pink-500 px-4 py-2 rounded-lg font-bold shadow-lg">
                  Made in India
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Banner Row */}
      <section className="py-4 px-4 bg-orange-500">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center text-white">
            <div className="flex items-center space-x-2">
              <span className="font-bold">FREE Shipping on ₹599+</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Buy 2 Get 1 FREE</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">15-Day Easy Returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">100% Made in India</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid - Clean Design */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Comfort & Style for Growing Kids</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/products?category=training-bras" className="group">
              <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                  <Image 
                    src="/api/placeholder/200/150" 
                    alt="Training Bras" 
                    width={200} 
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Training Bras</h3>
                <p className="text-pink-600 font-semibold">Starting ₹899</p>
                <div className="mt-3 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  3-Pack Available
                </div>
              </div>
            </Link>
            
            <Link href="/products?category=camisoles" className="group">
              <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                  <Image 
                    src="/api/placeholder/200/150" 
                    alt="Camisoles" 
                    width={200} 
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Camisoles</h3>
                <p className="text-purple-600 font-semibold">Starting ₹649</p>
                <div className="mt-3 bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  Fun Prints
                </div>
              </div>
            </Link>
            
            <Link href="/products?category=underwear-packs" className="group">
              <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                  <Image 
                    src="/api/placeholder/200/150" 
                    alt="Underwear Packs" 
                    width={200} 
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Underwear</h3>
                <p className="text-blue-600 font-semibold">Starting ₹799</p>
                <div className="mt-3 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  5-Pack Value
                </div>
              </div>
            </Link>
            
            <Link href="/products?category=night-suits" className="group">
              <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                  <Image 
                    src="/api/placeholder/200/150" 
                    alt="Night Suits" 
                    width={200} 
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Night Suits</h3>
                <p className="text-indigo-600 font-semibold">Starting ₹1299</p>
                <div className="mt-3 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  Organic Cotton
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Main Banner */}
            <div className="relative bg-pink-500 rounded-2xl overflow-hidden h-80 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 flex items-center justify-between p-8">
                <div className="text-white">
                  <h3 className="text-3xl font-bold mb-2">FIRST BRA</h3>
                  <p className="text-xl font-semibold mb-4">Collection</p>
                  <p className="text-lg mb-6">Perfect comfort for growing girls</p>
                  <Link href="/products?category=training-bras">
                    <Button className="bg-white text-pink-500 hover:bg-gray-100 font-bold px-6 py-3">
                      Shop Now
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <Image 
                    src="/api/placeholder/200/250" 
                    alt="Training Bras Collection" 
                    width={200} 
                    height={250}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Secondary Banner */}
            <div className="relative bg-blue-500 rounded-2xl overflow-hidden h-80 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 flex items-center justify-between p-8">
                <div className="text-white">
                  <h3 className="text-3xl font-bold mb-2">BOYS WEAR</h3>
                  <p className="text-xl font-semibold mb-4">Comfort Range</p>
                  <p className="text-lg mb-6">Soft boxers & night suits</p>
                  <Link href="/products?category=boxers">
                    <Button className="bg-white text-blue-500 hover:bg-gray-100 font-bold px-6 py-3">
                      Explore
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <Image 
                    src="/api/placeholder/200/250" 
                    alt="Boys Comfort Wear" 
                    width={200} 
                    height={250}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Bestsellers Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Trending Bestsellers</h2>
            <p className="text-lg text-gray-600">Most loved by our customers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 1, name: "3-Pack Training Bras", price: 899, originalPrice: 1299, rating: 4.8, discount: 31, pack: "3-Pack" },
              { id: 2, name: "Cartoon Camisoles", price: 649, originalPrice: 899, rating: 4.6, discount: 28, pack: "2-Pack" },
              { id: 3, name: "Cotton Underwear Pack", price: 799, originalPrice: 1199, rating: 4.7, discount: 33, pack: "5-Pack" },
              { id: 4, name: "Cozy Night Suit", price: 1299, originalPrice: 1799, rating: 4.9, discount: 28, pack: "1 Set" }
            ].map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48">
                    <Image 
                      src="/api/placeholder/300/200" 
                      alt={product.name} 
                      width={300} 
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">{product.discount}% OFF</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-lg">{product.rating} ★</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">{product.pack}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold">
                    Add to Cart
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 px-4 bg-pink-50">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Made with Love in India</h2>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              At Vimishe Fashion Trends, we believe every child deserves comfortable, high-quality innerwear. 
              Our products are crafted by women-led manufacturing units across India, ensuring the softest fabrics 
              and most comfortable fits for your growing children.
            </p>
            
            <div className="grid md:grid-cols-3 gap-10 mt-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                  <Image 
                    src="/api/placeholder/60/60" 
                    alt="Made in India" 
                    width={60} 
                    height={60}
                    className="rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Made in India</h3>
                <p className="text-gray-600">Supporting local manufacturing & women entrepreneurs</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                  <Image 
                    src="/api/placeholder/60/60" 
                    alt="Women-Led" 
                    width={60} 
                    height={60}
                    className="rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Women-Led</h3>
                <p className="text-gray-600">Empowering 50+ women-led manufacturing units</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                  <Image 
                    src="/api/placeholder/60/60" 
                    alt="Quality First" 
                    width={60} 
                    height={60}
                    className="rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-gray-800 mb-3">Quality First</h3>
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