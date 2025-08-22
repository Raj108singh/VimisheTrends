import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cart";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { toggleCart, getItemCount } = useCartStore();
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: false,
  });

  const cartItemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Top Notification Bar */}
      <div className="notification-bar text-white py-2 text-center text-sm font-medium">
        🎉 Free Shipping on Orders Above ₹1000 | 10% Off on First Order - Use Code: WELCOME10
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-gray-600"
              onClick={toggleMobileMenu}
              data-testid="button-mobile-menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Vimishe Fashion Trends</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/" 
                className={`text-gray-600 hover:text-primary font-medium transition-colors ${location === '/' ? 'text-primary' : ''}`}
                data-testid="link-home-nav"
              >
                Home
              </Link>
              <div className="relative group">
                <Link 
                  href="/products" 
                  className={`text-gray-600 hover:text-primary font-medium transition-colors flex items-center ${location.startsWith('/products') ? 'text-primary' : ''}`}
                  data-testid="link-products"
                >
                  Products <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </Link>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?categoryId=${category.id}`}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                      data-testid={`link-category-${category.slug}`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              {isAuthenticated && (
                <>
                  <Link 
                    href="/profile" 
                    className={`text-gray-600 hover:text-primary font-medium transition-colors ${location === '/profile' ? 'text-primary' : ''}`}
                    data-testid="link-profile"
                  >
                    Profile
                  </Link>
                  {user?.isAdmin && (
                    <Link 
                      href="/admin" 
                      className={`text-gray-600 hover:text-primary font-medium transition-colors ${location === '/admin' ? 'text-primary' : ''}`}
                      data-testid="link-admin"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              {!isMobile && (
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      data-testid="input-search"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </form>
              )}
              
              {/* Account */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="text-gray-600 hover:text-primary transition-colors" data-testid="button-account">
                    <i className="fas fa-user text-xl"></i>
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50" data-testid="link-profile-dropdown">
                      My Profile
                    </Link>
                    <Link href="/profile?tab=orders" className="block px-4 py-3 text-gray-700 hover:bg-gray-50" data-testid="link-orders">
                      My Orders
                    </Link>
                    <Link href="/profile?tab=wishlist" className="block px-4 py-3 text-gray-700 hover:bg-gray-50" data-testid="link-wishlist">
                      Wishlist
                    </Link>
                    <button 
                      onClick={() => window.location.href = "/api/logout"}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50"
                      data-testid="button-logout"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  variant="ghost"
                  data-testid="button-login"
                >
                  Login
                </Button>
              )}

              {/* Cart */}
              <button 
                className="relative text-gray-600 hover:text-primary transition-colors"
                onClick={toggleCart}
                data-testid="button-cart"
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu fixed inset-0 bg-white z-40 lg:hidden ${isMenuOpen ? 'open' : ''}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button onClick={toggleMobileMenu} data-testid="button-close-menu">
              <i className="fas fa-times text-xl text-gray-600"></i>
            </button>
          </div>
          
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
                data-testid="input-search-mobile"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </form>

          <nav className="space-y-4">
            <Link href="/" className="block text-gray-700 text-lg py-2" onClick={toggleMobileMenu} data-testid="link-home-mobile">
              Home
            </Link>
            <Link href="/products" className="block text-gray-700 text-lg py-2" onClick={toggleMobileMenu} data-testid="link-products-mobile">
              All Products
            </Link>
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/products?categoryId=${category.id}`}
                className="block text-gray-600 pl-4 py-2"
                onClick={toggleMobileMenu}
                data-testid={`link-category-mobile-${category.slug}`}
              >
                {category.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="block text-gray-700 text-lg py-2" onClick={toggleMobileMenu} data-testid="link-profile-mobile">
                  Profile
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin" className="block text-gray-700 text-lg py-2" onClick={toggleMobileMenu} data-testid="link-admin-mobile">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={() => window.location.href = "/api/logout"}
                  className="block text-gray-700 text-lg py-2 w-full text-left"
                  data-testid="button-logout-mobile"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => window.location.href = "/api/login"}
                className="block text-gray-700 text-lg py-2 w-full text-left"
                data-testid="button-login-mobile"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
