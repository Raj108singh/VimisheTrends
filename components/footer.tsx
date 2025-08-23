"use client";

import Link from "next/link";

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription would be implemented here
  };

  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <h3 className="text-xl font-bold" data-testid="text-footer-brand">Vimishe Fashion Trends</h3>
            </div>
            <p className="text-gray-300 mb-4" data-testid="text-footer-description">
              Comfortable, safe, and stylish innerwear for growing children. Made with love in India.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary" data-testid="link-facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-primary" data-testid="link-instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-primary" data-testid="link-twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-primary" data-testid="link-pinterest">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4" data-testid="text-shop-title">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=training-bras" className="text-gray-300 hover:text-white" data-testid="link-training-bras">
                  Training Bras
                </Link>
              </li>
              <li>
                <Link href="/products?category=camisoles" className="text-gray-300 hover:text-white" data-testid="link-camisoles">
                  Camisoles
                </Link>
              </li>
              <li>
                <Link href="/products?category=underwear-packs" className="text-gray-300 hover:text-white" data-testid="link-underwear-packs">
                  Underwear Packs
                </Link>
              </li>
              <li>
                <Link href="/products?category=night-suits" className="text-gray-300 hover:text-white" data-testid="link-night-suits">
                  Night Suits
                </Link>
              </li>
              <li>
                <Link href="/products?category=boxers" className="text-gray-300 hover:text-white" data-testid="link-boxers">
                  Boys Boxers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4" data-testid="text-company-title">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white" data-testid="link-about-us">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white" data-testid="link-contact-us">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white" data-testid="link-size-guide">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white" data-testid="link-returns">
                  Returns & Exchange
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white" data-testid="link-privacy">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4" data-testid="text-newsletter-title">Newsletter</h4>
            <p className="text-gray-300 mb-4" data-testid="text-newsletter-description">
              Subscribe for updates and exclusive offers
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-2 rounded-l-full text-gray-800"
                data-testid="input-newsletter-email"
              />
              <button 
                type="submit"
                className="bg-primary px-6 py-2 rounded-r-full hover:bg-primary/90"
                data-testid="button-subscribe"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300" data-testid="text-copyright">
            &copy; 2024 Vimishe Fashion Trends. All rights reserved. Made with ❤️ in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
