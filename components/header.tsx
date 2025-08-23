'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
              <Image 
                src="https://vimishefashiontrends.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-01.02.48_f7a00154.jpg" 
                alt="Vimishe Fashion Trends" 
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Mega Menu Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              {/* Girls Mega Menu */}
              <div className="relative group">
                <Link 
                  href="/products?category=girls" 
                  className="text-gray-800 hover:text-pink-500 font-semibold transition-colors text-sm flex items-center space-x-1 py-2"
                  data-testid="link-girls"
                >
                  <span>Girls</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                {/* Girls Mega Menu Panel */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-5xl bg-white shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] rounded-2xl overflow-hidden">
                  <div className="p-8">
                    <div className="grid grid-cols-4 gap-8">
                      {/* Column 1 */}
                      <div>
                        <h3 className="text-sm font-bold text-pink-600 mb-4 uppercase tracking-wider">Innerwear</h3>
                        <div className="space-y-3">
                          <Link href="/products?category=girl-underwear" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Rainbow Star Underwear
                          </Link>
                          <Link href="/products?category=girl-boxers" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Floral Print Boxers
                          </Link>
                          <Link href="/products?category=girl-bloomers" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Unicorn Bloomers
                          </Link>
                          <Link href="/products?category=girl-trunks" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Animal Print Trunks
                          </Link>
                          <Link href="/products?category=inner-shorts" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Soft Inner Shorts
                          </Link>
                        </div>
                      </div>
                      {/* Column 2 */}
                      <div>
                        <h3 className="text-sm font-bold text-pink-600 mb-4 uppercase tracking-wider">Tops & Camisoles</h3>
                        <div className="space-y-3">
                          <Link href="/products?category=girl-camisoles" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Soft Cotton Camisoles
                          </Link>
                          <Link href="/products?category=padded-camisoles" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Padded Training Camisoles
                          </Link>
                          <Link href="/products?category=tank-tops" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Colorful Tank Tops
                          </Link>
                          <Link href="/products?category=sports-bras" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            First Sports Bras
                          </Link>
                        </div>
                      </div>
                      {/* Column 3 */}
                      <div>
                        <h3 className="text-sm font-bold text-pink-600 mb-4 uppercase tracking-wider">Casual Wear</h3>
                        <div className="space-y-3">
                          <Link href="/products?category=skater-skirts" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Trendy Skater Skirts
                          </Link>
                          <Link href="/products?category=girl-shorts" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Runner & Cycling Shorts
                          </Link>
                          <Link href="/products?category=t-shirt-sets" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            T-shirt & Shorts Sets
                          </Link>
                          <Link href="/products?category=girl-joggers" className="block text-gray-700 hover:text-pink-600 transition-colors text-sm">
                            Cozy Joggers
                          </Link>
                        </div>
                      </div>
                      {/* Column 4 - Featured */}
                      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-pink-600 mb-3 uppercase tracking-wider">Featured</h3>
                        <div className="bg-white rounded-lg p-4 mb-3">
                          <div className="w-full h-20 bg-pink-100 rounded-lg mb-2 flex items-center justify-center">
                            <span className="text-2xl">🦄</span>
                          </div>
                          <h4 className="font-semibold text-xs text-gray-800">Unicorn Collection</h4>
                          <p className="text-xs text-gray-600">Starting ₹649</p>
                        </div>
                        <Link href="/products?category=new-arrivals" className="text-xs font-semibold text-pink-600 hover:text-pink-700">
                          Shop New Arrivals →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boys Mega Menu */}
              <div className="relative group">
                <Link 
                  href="/products?category=boys" 
                  className="text-gray-800 hover:text-blue-500 font-semibold transition-colors text-sm flex items-center space-x-1 py-2"
                  data-testid="link-boys"
                >
                  <span>Boys</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                {/* Boys Mega Menu Panel */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-4xl bg-white shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] rounded-2xl overflow-hidden">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Column 1 */}
                      <div>
                        <h3 className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-wider">Innerwear</h3>
                        <div className="space-y-3">
                          <Link href="/products?category=boy-underwear" className="block text-gray-700 hover:text-blue-600 transition-colors text-sm">
                            Dino Print Underwear
                          </Link>
                          <Link href="/products?category=boy-boxers" className="block text-gray-700 hover:text-blue-600 transition-colors text-sm">
                            Fun Pattern Boxers
                          </Link>
                          <Link href="/products?category=boy-trunks" className="block text-gray-700 hover:text-blue-600 transition-colors text-sm">
                            Check & Stripe Trunks
                          </Link>
                          <Link href="/products?category=sports-briefs" className="block text-gray-700 hover:text-blue-600 transition-colors text-sm">
                            Active Sports Briefs
                          </Link>
                        </div>
                      </div>
                      {/* Column 2 */}
                      <div>
                        <h3 className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-wider">Casual Wear</h3>
                        <div className="space-y-3">
                          <Link href="/products?category=boy-shorts" className="block text-gray-700 hover:text-blue-600 transition-colors text-sm">
                            Casual Shorts
                          </Link>
                          <Link href="/products?category=varsity-sets" className="block text-gray-700 hover:text-blue-600 transition-colors text-sm">
                            Varsity Vest Sets
                          </Link>
                          <Link href="/products?category=boy-joggers" className="block text-gray-700 hover:text-blue-600 transition-colors text-sm">
                            Comfy Joggers
                          </Link>
                          <Link href="/products?category=boy-t-shirts" className="block text-gray-700 hover:text-blue-600 transition-colors text-sm">
                            Cool T-shirts
                          </Link>
                        </div>
                      </div>
                      {/* Column 3 - Featured */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wider">Featured</h3>
                        <div className="bg-white rounded-lg p-4 mb-3">
                          <div className="w-full h-20 bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                            <span className="text-2xl">🦖</span>
                          </div>
                          <h4 className="font-semibold text-xs text-gray-800">Dino Adventure</h4>
                          <p className="text-xs text-gray-600">Starting ₹549</p>
                        </div>
                        <Link href="/products?category=boy-bestsellers" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                          Shop Bestsellers →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Casuals Mega Menu */}
              <div className="relative group">
                <Link 
                  href="/products?category=casuals" 
                  className="text-gray-800 hover:text-purple-500 font-semibold transition-colors text-sm flex items-center space-x-1 py-2"
                  data-testid="link-casuals"
                >
                  <span>Casuals</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                {/* Casuals Mega Menu Panel */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-3xl bg-white shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] rounded-2xl overflow-hidden">
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-8">
                      {/* Column 1 */}
                      <div>
                        <h3 className="text-sm font-bold text-purple-600 mb-4 uppercase tracking-wider">Sets & Combos</h3>
                        <div className="space-y-3">
                          <Link href="/products?category=t-shirt-sets" className="block text-gray-700 hover:text-purple-600 transition-colors text-sm">
                            T-shirt & Shorts Sets
                          </Link>
                          <Link href="/products?category=varsity-sets" className="block text-gray-700 hover:text-purple-600 transition-colors text-sm">
                            Varsity Vest & Jogger Sets
                          </Link>
                          <Link href="/products?category=skirt-sets" className="block text-gray-700 hover:text-purple-600 transition-colors text-sm">
                            Skater Skirt & Top Sets
                          </Link>
                          <Link href="/products?category=casual-coordinates" className="block text-gray-700 hover:text-purple-600 transition-colors text-sm">
                            Matching Coordinates
                          </Link>
                        </div>
                      </div>
                      {/* Column 2 - Sale Highlight */}
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wider flex items-center">
                          <span className="mr-2">🔥</span>
                          Mega Sale
                        </h3>
                        <div className="bg-white rounded-lg p-4 mb-3">
                          <div className="text-center mb-2">
                            <span className="text-3xl font-bold text-red-600">50%</span>
                            <span className="text-sm text-red-600 font-semibold">OFF</span>
                          </div>
                          <p className="text-xs text-gray-600 text-center">On all casual wear</p>
                        </div>
                        <Link href="/products?category=sale" className="text-xs font-semibold text-red-600 hover:text-red-700 block text-center">
                          Shop Sale Items →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bundle Packs */}
              <Link 
                href="/products?category=bundles" 
                className="text-gray-800 hover:text-green-500 font-semibold transition-colors text-sm py-2"
                data-testid="link-bundles"
              >
                Bundle Packs
              </Link>

              {/* Sale Link with Badge */}
              <Link 
                href="/products?category=sale" 
                className="text-red-600 hover:text-red-700 font-bold transition-colors text-sm flex items-center space-x-2 py-2"
                data-testid="link-sale"
              >
                <span>SALE</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold animate-pulse">50% OFF</span>
              </Link>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center">
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
              
              {/* Right Side Actions */}
              <div className="flex items-center space-x-6">
                <Link href="/login" className="text-sm font-semibold text-gray-800 hover:text-black uppercase tracking-wide" data-testid="button-account">
                  LOGIN
                </Link>
                <Link href="/admin" className="text-sm font-semibold text-gray-800 hover:text-black uppercase tracking-wide" data-testid="link-admin">
                  ADMIN
                </Link>
                <Link href="/wishlist" className="hover:text-black transition-colors" data-testid="link-wishlist">
                  <i className="far fa-heart text-gray-700 text-xl"></i>
                </Link>
                <Link href="/cart" className="hover:text-black transition-colors relative" data-testid="link-cart">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center p-0">
                    0
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Mobile Sidebar Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-50 backdrop-blur-sm" onClick={toggleMobileMenu}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Menu</h2>
                <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-white transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Search in mobile */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Navigation */}
            <nav className="p-6">
              <div className="space-y-6">
                {/* Girls Section */}
                <div>
                  <h3 className="text-sm font-bold text-pink-600 mb-3 uppercase tracking-wider flex items-center">
                    <span className="mr-2">🌸</span>
                    Girls
                  </h3>
                  <div className="space-y-1 ml-6">
                    <Link href="/products?category=girl-underwear" className="block py-3 text-gray-700 hover:text-pink-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Rainbow Underwear
                    </Link>
                    <Link href="/products?category=girl-boxers" className="block py-3 text-gray-700 hover:text-pink-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Floral Boxers
                    </Link>
                    <Link href="/products?category=girl-bloomers" className="block py-3 text-gray-700 hover:text-pink-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Unicorn Bloomers
                    </Link>
                    <Link href="/products?category=girl-camisoles" className="block py-3 text-gray-700 hover:text-pink-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Soft Camisoles
                    </Link>
                    <Link href="/products?category=girl-trunks" className="block py-3 text-gray-700 hover:text-pink-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Animal Trunks
                    </Link>
                  </div>
                </div>

                {/* Boys Section */}
                <div>
                  <h3 className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wider flex items-center">
                    <span className="mr-2">⚡</span>
                    Boys
                  </h3>
                  <div className="space-y-1 ml-6">
                    <Link href="/products?category=boy-underwear" className="block py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Dino Underwear
                    </Link>
                    <Link href="/products?category=boy-boxers" className="block py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Fun Boxers
                    </Link>
                    <Link href="/products?category=boy-trunks" className="block py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Check Trunks
                    </Link>
                    <Link href="/products?category=sports-briefs" className="block py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Sports Briefs
                    </Link>
                  </div>
                </div>

                {/* Casuals Section */}
                <div>
                  <h3 className="text-sm font-bold text-purple-600 mb-3 uppercase tracking-wider flex items-center">
                    <span className="mr-2">👕</span>
                    Casuals
                  </h3>
                  <div className="space-y-1 ml-6">
                    <Link href="/products?category=t-shirt-sets" className="block py-3 text-gray-700 hover:text-purple-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      T-shirt Sets
                    </Link>
                    <Link href="/products?category=varsity-sets" className="block py-3 text-gray-700 hover:text-purple-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Varsity Sets
                    </Link>
                    <Link href="/products?category=skater-skirts" className="block py-3 text-gray-700 hover:text-purple-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Skater Skirts
                    </Link>
                    <Link href="/products?category=tank-tops" className="block py-3 text-gray-700 hover:text-purple-600 font-medium transition-colors border-b border-gray-50 last:border-0">
                      Tank Tops
                    </Link>
                  </div>
                </div>

                {/* Sale Section */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4">
                  <Link href="/products?category=sale" className="block">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <h3 className="text-lg font-bold text-red-600">MEGA SALE</h3>
                        <p className="text-sm text-red-500">Up to 50% OFF</p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Account Links */}
                <div className="border-t border-gray-100 pt-4">
                  <Link href="/login" className="block py-3 text-gray-700 hover:text-pink-600 font-medium transition-colors flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Login / Account</span>
                  </Link>
                  <Link href="/cart" className="block py-3 text-gray-700 hover:text-pink-600 font-medium transition-colors flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Cart (0)</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}