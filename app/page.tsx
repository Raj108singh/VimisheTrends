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
      imageUrl: "/api/placeholder/800/600"
    },
    {
      id: 2,
      title: "New Cartoon Prints",
      description: "Fun Camisoles & Underwear Sets",
      buttonText: "Explore Collection",
      linkUrl: "/products?category=camisoles",
      imageUrl: "/api/placeholder/800/600"
    },
    {
      id: 3,
      title: "Boys Comfort Wear",
      description: "Soft Boxers & Night Suits",
      buttonText: "Shop Boys",
      linkUrl: "/products?category=boxers",
      imageUrl: "/api/placeholder/800/600"
    }
  ];

  const totalSlides = sliders.length || 1;

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play slider
  useEffect(() => {
    if (totalSlides > 1) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [totalSlides]);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Single Column Hero Slider Section */}
      <section className="relative w-full h-[300px] md:h-[500px] lg:h-[600px]">
        <div className="relative h-full overflow-hidden">
          {/* Slider Container */}
          <div 
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliders.map((slider, index) => (
              <div
                key={slider.id}
                className="w-full h-full flex-shrink-0 relative cursor-pointer group"
                onClick={() => window.location.href = slider.linkUrl || "#"}
                style={{
                  backgroundImage: `url(${slider.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-2xl">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4" data-testid={`slider-title-${index}`}>
                      {slider.title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl mb-6 opacity-90" data-testid={`slider-description-${index}`}>
                      {slider.description}
                    </p>
                    <Link href={slider.linkUrl || "/products"}>
                      <Button 
                        size="lg"
                        className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                        data-testid={`slider-button-${index}`}
                      >
                        {slider.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Navigation - Only show if multiple slides */}
          {totalSlides > 1 && (
            <>
              {/* Prev/Next Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-3 transition-all duration-200"
                data-testid="button-prev-slide"
              >
                <i className="fas fa-chevron-left text-xl"></i>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-3 transition-all duration-200"
                data-testid="button-next-slide"
              >
                <i className="fas fa-chevron-right text-xl"></i>
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                    data-testid={`slider-indicator-${index}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-4 px-4 bg-white">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">🌟</span>
                <div>
                  <h2 className="text-xl font-bold text-white" data-testid="hero-title">FREE SHIPPING</h2>
                  <p className="text-white opacity-90 text-sm" data-testid="hero-subtitle">ON ORDERS ABOVE ₹599</p>
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-full">
                <span className="font-bold text-pink-600 text-sm" data-testid="promo-code">COMFORT FIRST</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Featured Categories</h2>
            <p className="text-gray-600">Comfortable innerwear for growing kids</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/products?category=training-bras" className="group">
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-pink-300 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">👙</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Training Bras</h3>
                <p className="text-sm text-gray-600">Starting ₹899</p>
              </div>
            </Link>
            <Link href="/products?category=camisoles" className="group">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-purple-300 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">👕</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Camisoles</h3>
                <p className="text-sm text-gray-600">Starting ₹649</p>
              </div>
            </Link>
            <Link href="/products?category=underwear-packs" className="group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🩲</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Underwear Packs</h3>
                <p className="text-sm text-gray-600">Starting ₹799</p>
              </div>
            </Link>
            <Link href="/products?category=night-suits" className="group">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-yellow-300 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🌙</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Night Suits</h3>
                <p className="text-sm text-gray-600">Starting ₹1299</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Bestsellers Section */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2" data-testid="text-categories-title">Trending Bestsellers</h2>
            <p className="text-gray-600">Most loved by our customers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 1, name: "3-Pack Training Bras", price: 899, originalPrice: 1299, rating: 4.8, discount: 31, image: "/api/placeholder/300/400", pack: "3-Pack" },
              { id: 2, name: "Cartoon Camisoles", price: 649, originalPrice: 899, rating: 4.6, discount: 28, image: "/api/placeholder/300/400", pack: "2-Pack" },
              { id: 3, name: "Cotton Underwear Pack", price: 799, originalPrice: 1199, rating: 4.7, discount: 33, image: "/api/placeholder/300/400", pack: "5-Pack" },
              { id: 4, name: "Cozy Night Suit", price: 1299, originalPrice: 1799, rating: 4.9, discount: 28, image: "/api/placeholder/300/400", pack: "1 Set" }
            ].map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                <div className="relative overflow-hidden">
                  <Image 
                    src={product.image}
                    alt={product.name} 
                    width={300}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">{product.discount}% OFF</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full">{product.rating} ★</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">{product.pack}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm">{product.name}</h3>
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

      {/* Brand Story Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Made with Love in India</h2>
            <p className="text-lg text-gray-600 mb-8">
              At Vimishe Fashion Trends, we believe every child deserves comfortable, high-quality innerwear. 
              Our products are crafted by women-led manufacturing units across India, ensuring the softest fabrics 
              and most comfortable fits for your growing children.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🇮🇳</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Made in India</h3>
                <p className="text-gray-600 text-sm">Supporting local manufacturing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👩‍💼</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Women-Led</h3>
                <p className="text-gray-600 text-sm">Empowering women entrepreneurs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Quality First</h3>
                <p className="text-gray-600 text-sm">Premium materials & comfort</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}