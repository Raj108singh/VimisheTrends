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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link 
                href="/products?category=training-bras" 
                className="text-gray-800 hover:text-pink-500 font-medium transition-colors text-sm"
                data-testid="link-training-bras"
              >
                Training Bras
              </Link>
              <Link 
                href="/products?category=camisoles" 
                className="text-gray-800 hover:text-pink-500 font-medium transition-colors text-sm"
                data-testid="link-camisoles"
              >
                Camisoles
              </Link>
              <Link 
                href="/products?category=underwear-packs" 
                className="text-gray-800 hover:text-pink-500 font-medium transition-colors text-sm"
                data-testid="link-underwear"
              >
                Underwear Packs
              </Link>
              <Link 
                href="/products?category=night-suits" 
                className="text-gray-800 hover:text-pink-500 font-medium transition-colors text-sm"
                data-testid="link-nightwear"
              >
                Night Suits
              </Link>
              <Link 
                href="/products?category=boxers" 
                className="text-gray-800 hover:text-pink-500 font-medium transition-colors text-sm"
                data-testid="link-boxers"
              >
                Boxers
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
                <Link href="/wishlist" className="hover:text-black transition-colors" data-testid="link-wishlist">
                  <i className="far fa-heart text-gray-700 text-xl"></i>
                </Link>
                <Link href="/cart" className="hover:text-black transition-colors relative" data-testid="link-cart">
                  <i className="fas fa-shopping-bag text-gray-700 text-xl"></i>
                  <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center p-0">
                    0
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}>
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="p-4 border-b">
              <button onClick={toggleMobileMenu} className="text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <nav className="p-4">
              <div className="space-y-4">
                <Link href="/products?category=training-bras" className="block py-2 text-gray-800 hover:text-pink-500 font-medium">
                  Training Bras
                </Link>
                <Link href="/products?category=camisoles" className="block py-2 text-gray-800 hover:text-pink-500 font-medium">
                  Camisoles
                </Link>
                <Link href="/products?category=underwear-packs" className="block py-2 text-gray-800 hover:text-pink-500 font-medium">
                  Underwear Packs
                </Link>
                <Link href="/products?category=night-suits" className="block py-2 text-gray-800 hover:text-pink-500 font-medium">
                  Night Suits
                </Link>
                <Link href="/products?category=boxers" className="block py-2 text-gray-800 hover:text-pink-500 font-medium">
                  Boxers
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}