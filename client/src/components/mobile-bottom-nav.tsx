"use client";

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cart";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MobileBottomNav() {
  const { isAuthenticated } = useAuth();
  const { getItemCount } = useCartStore();
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const cartItemCount = getItemCount();

  if (!isMobile) return null;

  const navItems = [
    {
      id: 'home',
      href: '/',
      icon: 'fas fa-home',
      label: 'Home',
      isActive: location === '/'
    },
    {
      id: 'categories',
      href: '/products',
      icon: 'fas fa-th-large', 
      label: 'Categories',
      isActive: location.startsWith('/products')
    },
    {
      id: 'search',
      href: '/products',
      icon: 'fas fa-search',
      label: 'Search',
      isActive: false
    },
    {
      id: 'cart',
      href: '/cart',
      icon: 'fas fa-shopping-bag',
      label: 'Bag',
      badge: cartItemCount,
      isActive: location === '/cart'
    },
    {
      id: 'profile',
      href: isAuthenticated ? '/profile' : '/login',
      icon: 'fas fa-user',
      label: isAuthenticated ? 'Profile' : 'Login',
      isActive: location === '/profile' || location === '/login'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
      <div className="grid grid-cols-5 py-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center py-2 px-1 relative ${
              item.isActive ? 'text-pink-500' : 'text-gray-600'
            }`}
          >
            <div className="relative">
              <i className={`${item.icon} text-lg mb-1`}></i>
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
            {item.isActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full"></div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}