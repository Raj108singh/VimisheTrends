"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useCartStore } from "../stores/stores/useCartStore";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "../shared/schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useIsMobile } from "../hooks/use-mobile";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { toggleCart, getItemCount } = useCartStore();
  const isMobile = useIsMobile();
  const pathname = usePathname();
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

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-gray-600"
              onClick={toggleMobileMenu}
              data-testid="button-mobile-menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
              <img 
                src="https://vimishefashiontrends.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-01.02.48_f7a00154.jpg" 
                alt="Vimishe Fashion Trends" 
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/products?category=girls" 
                className="text-gray-800 hover:text-pink-500 font-semibold transition-colors uppercase text-sm tracking-wide"
                data-testid="link-girls"
              >
                GIRLS
              </Link>
              <Link 
                href="/products?category=boys" 
                className="text-gray-800 hover:text-pink-500 font-semibold transition-colors uppercase text-sm tracking-wide"
                data-testid="link-boys"
              >
                BOYS
              </Link>
              <Link 
                href="/products?category=accessories" 
                className="text-gray-800 hover:text-pink-500 font-semibold transition-colors uppercase text-sm tracking-wide"
                data-testid="link-accessories"
              >
                ACCESSORIES
              </Link>
              <Link 
                href="/products?category=new-arrivals" 
                className="text-gray-800 hover:text-pink-500 font-semibold transition-colors uppercase text-sm tracking-wide"
                data-testid="link-new-arrivals"
              >
                NEW ARRIVALS
              </Link>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              {!isMobile && (
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search by products"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-4 pr-10 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none w-72 text-sm bg-gray-50"
                      data-testid="input-search"
                    />
                    <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </form>
              )}
              
              {/* Right Side Actions */}
              <div className="flex items-center space-x-6">
                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="text-sm font-semibold text-gray-800 hover:text-black uppercase tracking-wide" data-testid="button-account">
                      {user?.firstName || "ACCOUNT"}
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-testid="link-profile">
                        My Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-testid="link-orders">
                        My Orders
                      </Link>
                      {user?.isAdmin && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-testid="link-admin">
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button 
                        onClick={async () => {
                          try {
                            await fetch("/api/auth/logout", { method: "POST" });
                            window.location.href = "/login";
                          } catch (error) {
                            console.error("Logout error:", error);
                          }
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        data-testid="button-logout"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    className="text-sm font-semibold text-gray-800 hover:text-black uppercase tracking-wide"
                    data-testid="button-login"
                  >
                    LOGIN
                  </Link>
                )}
                <button className="hover:text-black transition-colors" data-testid="button-wishlist">
                  <i className="far fa-heart text-gray-700 text-xl"></i>
                </button>
                <button 
                  className="hover:text-black transition-colors relative"
                  onClick={toggleCart}
                  data-testid="button-bag"
                >
                  <i className="fas fa-shopping-bag text-gray-700 text-xl"></i>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
        
        {/* Secondary Navigation - Hidden on Mobile */}
        <div className="bg-gray-50 border-b border-gray-200 hidden lg:block">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-8 py-3">
              <Link href="/products?category=underwear" className="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors" data-testid="link-underwear">
                UNDERWEAR
              </Link>
              <Link href="/products?category=casual-wear" className="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors" data-testid="link-casual-wear">
                CASUAL WEAR
              </Link>
              <Link href="/products?category=innerwear" className="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors" data-testid="link-innerwear">
                INNERWEAR
              </Link>
              <Link href="/products?category=nightwear" className="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors" data-testid="link-nightwear">
                NIGHTWEAR
              </Link>
              <Link href="/products?sale=true" className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors font-semibold" data-testid="link-sale">
                SALE
              </Link>
              <Link href="/products?category=combo-packs" className="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors" data-testid="link-combo-packs">
                COMBO PACKS
              </Link>
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
              <Link 
                href="/login"
                className="block text-gray-700 text-lg py-2 w-full text-left"
                onClick={toggleMobileMenu}
                data-testid="button-login-mobile"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
