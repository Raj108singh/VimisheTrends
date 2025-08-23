import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import CartSidebar from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Product, Category, Slider, SiteSetting } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
    retry: false,
  });

  const { data: saleProducts = [], isLoading: saleLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/sale"],
    retry: false,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: false,
  });

  const { data: sliders = [], isLoading: slidersLoading } = useQuery<Slider[]>({
    queryKey: ["/api/sliders"],
    retry: false,
  });

  const { data: siteSettings = [], isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    retry: false,
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
            {sliders.length > 0 ? (
              sliders.map((slider, index) => (
                <div
                  key={slider.id}
                  className="w-full h-full flex-shrink-0 relative cursor-pointer group"
                  onClick={() => window.location.href = slider.linkUrl || "#"}
                  style={{
                    backgroundImage: slider.imageUrl ? `url(${slider.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-2xl">
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4" data-testid={`slider-title-${index}`}>
                        {slider.title || `Kids Fashion Collection`}
                      </h2>
                      <p className="text-lg md:text-xl lg:text-2xl mb-6 opacity-90" data-testid={`slider-description-${index}`}>
                        {slider.description || `Comfortable & Stylish Kids Wear`}
                      </p>
                      {slider.buttonText && (
                        <Button 
                          size="lg"
                          className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                          data-testid={`slider-button-${index}`}
                        >
                          {slider.buttonText || 'Shop Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Default slider when no sliders are available */
              <div
                className="w-full h-full flex-shrink-0 relative cursor-pointer group"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-2xl">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                      Kids Fashion Collection
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl mb-6 opacity-90">
                      Comfortable & Stylish Wear for Growing Kids
                    </p>
                    <Button 
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
                  <p className="text-4xl font-extrabold mb-2" data-testid="text-offer">OVERSIZED T-SHIRTS</p>
                  <p className="text-2xl font-bold mb-4" data-testid="text-price">AT ₹999</p>
                  <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all" data-testid="button-shop-casual">
                    Shop Now
                  </button>
                </div>
                <div className="hidden md:block">
                  <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" alt="T-shirts" className="rounded-lg" />
                </div>
              </div>
            </div>
            
            {/* Side Banner */}
            <div className="relative bg-gradient-to-b from-blue-400 to-cyan-400 rounded-2xl overflow-hidden h-64">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <h3 className="text-2xl font-bold mb-2" data-testid="text-formal-title">BUY 3</h3>
                <p className="text-xl font-bold mb-2" data-testid="text-formal-subtitle">CLASSIC FIT T-SHIRTS</p>
                <p className="text-2xl font-bold mb-4" data-testid="text-formal-price">AT ₹999</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all" data-testid="button-explore-formal">
                  Explore
                </button>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categoriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 5).map((category: any) => (
                <div key={category.id} className="bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-all" data-testid={`category-${category.slug}`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={category.imageUrl || "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400"} 
                      alt={category.name} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid={`img-category-${category.slug}`}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 mb-1" data-testid={`text-category-${category.slug}`}>{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              ))
            ) : (
              /* Default categories when no categories are available */
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                  <div className="relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400" 
                      alt="Kids Fashion" 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 mb-1">Kids Fashion</h3>
                    <p className="text-sm text-gray-600">Stylish collection</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2" data-testid="text-featured-title">FEATURED PRODUCTS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse border">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              /* Default products when no featured products are available */
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-all border">
                  <div className="relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400" 
                      alt="Kids Fashion" 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 mb-1">Kids Fashion Item</h3>
                    <p className="text-sm text-gray-600 mb-2">Comfortable wear for kids</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-primary">₹999</span>
                      <Button size="sm" variant="outline">Add to Cart</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}