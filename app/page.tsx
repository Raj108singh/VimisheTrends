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

  // Modern hero slider data based on ecommerce best practices
  const sliders = [
    {
      id: 1,
      title: "Comfort Everyday",
      subtitle: "Rainbow Collection",
      description: "Starting ₹649",
      buttonText: "Shop Girls",
      linkUrl: "/products?category=girls",
      image: "/attached_assets/generated_images/Colorful_kids_underwear_product_display_cd9656a4.png",
      bgColor: "from-pink-400 to-purple-500"
    },
    {
      id: 2,
      title: "Style & Play",
      subtitle: "Casual Collection", 
      description: "Up to 50% OFF",
      buttonText: "Shop Casuals",
      linkUrl: "/products?category=casuals",
      image: "/attached_assets/generated_images/Kids_casual_wear_flat_lay_f3430e7e.png",
      bgColor: "from-blue-400 to-indigo-500"
    },
    {
      id: 3,
      title: "Bundle & Save",
      subtitle: "Value Packs",
      description: "Free shipping ₹1000+",
      buttonText: "Shop Bundles",
      linkUrl: "/products?category=bundles",
      image: "/attached_assets/generated_images/Kids_innerwear_bundle_packs_683b9bf7.png",
      bgColor: "from-green-400 to-teal-500"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  // Auto-play slider with pause on hover
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000); // 5 seconds based on ecommerce best practices
    return () => clearInterval(interval);
  }, [sliders.length]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Modern Hero Slider */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {sliders.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor} opacity-90`}></div>
            
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image 
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={index === 0}
              />
            </div>
            
            {/* Content Overlay */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  {/* Badge */}
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
                    ✨ {slide.subtitle}
                  </div>
                  
                  {/* Main Title */}
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  
                  {/* Price/Description */}
                  <p className="text-2xl md:text-3xl font-bold text-white/90 mb-8">
                    {slide.description}
                  </p>
                  
                  {/* CTA Button */}
                  <Link href={slide.linkUrl}>
                    <Button 
                      size="lg" 
                      className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-10 py-6 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
                    >
                      {slide.buttonText} →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {sliders.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-200 group"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % sliders.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-200 group"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-pink-100 flex items-center justify-center">
                  <span className="text-4xl">👙</span>
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
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-purple-100 flex items-center justify-center">
                  <span className="text-4xl">👕</span>
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
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center">
                  <span className="text-4xl">🩲</span>
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
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-indigo-100 flex items-center justify-center">
                  <span className="text-4xl">🌙</span>
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