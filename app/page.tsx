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

  // Sample slider data
  const sliders = [
    {
      id: 1,
      title: "Kids Fashion Collection",
      description: "Comfortable & Stylish Kids Wear",
      buttonText: "Shop Now",
      linkUrl: "/products",
      imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: 2,
      title: "New Arrivals",
      description: "Latest Trends for Growing Kids",
      buttonText: "Explore",
      linkUrl: "/products",
      imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
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
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">🎉</span>
                <div>
                  <h2 className="text-xl font-bold text-white" data-testid="hero-title">GET 10% CASHBACK</h2>
                  <p className="text-white opacity-90 text-sm" data-testid="hero-subtitle">ON ALL ORDERS</p>
                </div>
              </div>
              <div className="bg-yellow-400 px-4 py-2 rounded-full">
                <span className="font-bold text-gray-800 text-sm" data-testid="promo-code">USE CODE GETCASH10</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Grid */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Banner */}
            <div className="md:col-span-2 relative bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl overflow-hidden h-64">
              <div className="absolute inset-0 flex items-center justify-between p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2" data-testid="text-casual-title">BUY 2</h3>
                  <p className="text-4xl font-extrabold mb-2" data-testid="text-offer">KIDS T-SHIRTS</p>
                  <p className="text-2xl font-bold mb-4" data-testid="text-price">AT ₹999</p>
                  <Link href="/products">
                    <Button className="bg-white text-purple-600 hover:bg-gray-100" data-testid="button-shop-casual">
                      Shop Now
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <Image 
                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                    alt="Kids T-shirts" 
                    width={300}
                    height={200}
                    className="rounded-lg" 
                  />
                </div>
              </div>
            </div>
            
            {/* Side Banner */}
            <div className="relative bg-gradient-to-b from-blue-400 to-cyan-400 rounded-2xl overflow-hidden h-64">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <h3 className="text-2xl font-bold mb-2" data-testid="text-formal-title">BUY 3</h3>
                <p className="text-xl font-bold mb-2" data-testid="text-formal-subtitle">KIDS DRESSES</p>
                <p className="text-2xl font-bold mb-4" data-testid="text-formal-price">AT ₹1499</p>
                <Link href="/products">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100" data-testid="button-explore-formal">
                    Explore
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2" data-testid="text-categories-title">NEW ARRIVALS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Link key={i} href="/products" className="bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                <div className="relative overflow-hidden">
                  <Image 
                    src={`https://images.unsplash.com/photo-${1503454537195 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400`}
                    alt="Kids Fashion" 
                    width={300}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">4.5 ★</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 mb-1">Kids Fashion Item</h3>
                  <p className="text-sm text-gray-600 mb-2">Comfortable wear for kids</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">₹{299 + (i * 100)}</span>
                    <Button size="sm" variant="outline">Add to Cart</Button>
                  </div>
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