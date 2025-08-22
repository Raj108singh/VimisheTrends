import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import CartSidebar from "@/components/cart-sidebar";
import { useQuery } from "@tanstack/react-query";
import type { Product, Category } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="hero-title">
            Style Your Little Ones
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="hero-description">
            Discover premium children's fashion with comfort, quality, and style. From casual everyday wear to special occasion outfits.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-primary font-semibold px-8 py-4 rounded-full hover:shadow-lg transform hover:scale-105 transition-all" data-testid="button-shop-collection">
              Shop Collection
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-primary transition-all" data-testid="button-view-lookbook">
              View Lookbook
            </button>
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                alt="Kids in colorful casual wear" 
                className="w-full h-64 object-cover"
                data-testid="img-casual-collection"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="text-white p-8">
                  <h3 className="text-2xl font-bold mb-2" data-testid="text-casual-title">Casual Collection</h3>
                  <p className="mb-4" data-testid="text-casual-description">Comfortable everyday wear</p>
                  <button className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90" data-testid="button-shop-casual">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                alt="Kids in formal attire" 
                className="w-full h-64 object-cover"
                data-testid="img-formal-collection"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="text-white p-8">
                  <h3 className="text-2xl font-bold mb-2" data-testid="text-formal-title">Formal Wear</h3>
                  <p className="mb-4" data-testid="text-formal-description">Special occasion outfits</p>
                  <button className="bg-secondary text-white px-6 py-2 rounded-full font-medium hover:bg-secondary/90" data-testid="button-explore-formal">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-categories-title">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 4).map((category: any) => (
                <div key={category.id} className="text-center group cursor-pointer" data-testid={`category-${category.slug}`}>
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden group-hover:scale-105 transition-transform">
                    <img 
                      src={category.imageUrl || "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"} 
                      alt={category.name} 
                      className="w-full h-full object-cover"
                      data-testid={`img-category-${category.slug}`}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800" data-testid={`text-category-name-${category.slug}`}>{category.name}</h3>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg" data-testid="text-no-categories">No categories available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sale Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-warning/20 to-primary/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" data-testid="text-sale-title">Flash Sale - Up to 50% Off!</h2>
            <p className="text-gray-600" data-testid="text-sale-description">Limited time offer on selected items</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleLoading ? (
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
            ) : saleProducts.length > 0 ? (
              saleProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg" data-testid="text-no-sale-products">No sale products available at the moment</p>
              </div>
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
