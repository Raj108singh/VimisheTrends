import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
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
  const totalSlides = sliders.length || 1;

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

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
    queryKey: ["/api/sliders", { placement: "home" }],
    retry: false,
  });

  const { data: siteSettings = [], isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings", { category: "home" }],
    retry: false,
  });

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
      
      {/* Dynamic Sliders */}
      {sliders.length > 0 && (
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
          <div className="slider-container relative w-full h-full">
            {sliders.map((slider, index) => (
              <div 
                key={slider.id}
                className={`slide absolute inset-0 w-full h-full transition-transform duration-500 ${
                  index === currentSlide ? 'translate-x-0' : 
                  index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                }`}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slider.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-wide">{slider.title}</h1>
                  {slider.description && (
                    <p className="text-lg md:text-xl font-medium mb-6 max-w-2xl">{slider.description}</p>
                  )}
                  {slider.linkUrl && slider.buttonText && (
                    <a 
                      href={slider.linkUrl}
                      className="bg-white text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                      data-testid={`slider-button-${slider.id}`}
                    >
                      {slider.buttonText}
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            {/* Slider Controls */}
            {sliders.length > 1 && (
              <>
                <button 
                  onClick={prevSlide} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  data-testid="slider-prev"
                >
                  ←
                </button>
                <button 
                  onClick={nextSlide} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  data-testid="slider-next"
                >
                  →
                </button>
                
                {/* Slider Dots */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {sliders.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                      data-testid={`slider-dot-${index}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}


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
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">4.5 ★</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 text-sm mb-1" data-testid={`text-category-name-${category.slug}`}>{category.name}</h3>
                    <p className="text-gray-500 text-xs">Starting from ₹999</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg" data-testid="text-no-categories">No categories available</p>
              </div>
            )}
          </div>
          <div className="text-center mt-8">
            <button className="text-primary font-bold hover:underline" data-testid="button-explore-all">
              Explore All
            </button>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2" data-testid="text-sale-title">TRENDING CATEGORIES</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {saleLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden animate-pulse">
                  <div className="w-full h-full bg-gray-200"></div>
                </div>
              ))
            ) : saleProducts.length > 0 ? (
              saleProducts.slice(0, 6).map((product: any) => (
                <div key={product.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                    <h3 className="text-white font-bold text-sm">{product.name || 'Category'}</h3>
                  </div>
                </div>
              ))
            ) : (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                  <img 
                    src={`https://images.unsplash.com/photo-150345453719${5 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300`} 
                    alt="Category" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                    <h3 className="text-white font-bold text-sm">Fashion Category</h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" data-testid="text-featured-title">Featured Products</h2>
            <p className="text-gray-600" data-testid="text-featured-description">Hand-picked favorites for your little ones</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg" data-testid="text-no-featured-products">No featured products available at the moment</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-testimonials-title">Happy Parents, Happy Kids</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md" data-testid="testimonial-1">
              <div className="star-rating mb-4 text-warning">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-600 mb-4" data-testid="text-testimonial-1">"Amazing quality and my daughter loves her new outfits! The fabric is so soft and comfortable."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">P</div>
                <div className="ml-3">
                  <h4 className="font-semibold" data-testid="text-reviewer-name-1">Priya Sharma</h4>
                  <p className="text-gray-500 text-sm" data-testid="text-reviewer-status-1">Verified Buyer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md" data-testid="testimonial-2">
              <div className="star-rating mb-4 text-warning">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-600 mb-4" data-testid="text-testimonial-2">"Fast delivery and excellent customer service. The sizes are accurate and the colors are vibrant."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold">R</div>
                <div className="ml-3">
                  <h4 className="font-semibold" data-testid="text-reviewer-name-2">Rajesh Kumar</h4>
                  <p className="text-gray-500 text-sm" data-testid="text-reviewer-status-2">Verified Buyer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md" data-testid="testimonial-3">
              <div className="star-rating mb-4 text-warning">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="text-gray-600 mb-4" data-testid="text-testimonial-3">"Bought multiple items for my twin boys. Great value for money and they look adorable!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">A</div>
                <div className="ml-3">
                  <h4 className="font-semibold" data-testid="text-reviewer-name-3">Anita Patel</h4>
                  <p className="text-gray-500 text-sm" data-testid="text-reviewer-status-3">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar />
    </div>
  );
}
