'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, Phone, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E4DC] shadow-[0_2px_15px_-3px_rgba(45,30,23,0.04)] transition-all">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#22201E] text-[#F7F4EE] text-[11px] py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
        <span>Islandwide Cash on Delivery (COD) Available | Handcrafted in Negombo, Sri Lanka</span>
        <span className="hidden sm:inline-block text-[#6E6B65]">•</span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[#C5A059]">
          <Phone className="w-3 h-3" /> 075 148 3613
        </span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-brand-900 hover:text-brand-950 hover:bg-brand-100/50 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo - Natural aspect ratio, uncropped and crystal clear */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="block group">
              <div className="relative h-12 sm:h-14 w-28 sm:w-36 transition-transform duration-200 group-hover:scale-102">
                <Image
                  src="/logo.png"
                  alt="Lola Studio"
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links - Neatly arranged & spaced */}
          <div className="hidden lg:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-brand-800">
            <Link
              href="/"
              className="py-1 hover:text-brand-950 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="py-1 hover:text-brand-950 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              All Products
            </Link>
            <Link
              href="/shop?category=spiritual-zen"
              className="py-1 hover:text-brand-950 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              Spiritual & Zen
            </Link>
            <Link
              href="/shop?category=home-decor"
              className="py-1 hover:text-brand-950 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              Home Decor
            </Link>
            <Link
              href="/shop?category=gift-sets"
              className="py-1 hover:text-brand-950 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              Gift Sets
            </Link>
            <Link
              href="/about"
              className="py-1 hover:text-brand-950 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="py-1 hover:text-brand-950 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-700 hover:after:w-full after:transition-all"
            >
              Contact
            </Link>
          </div>

          {/* Right Action Controls: Search + Cart (Admin removed per client instructions) */}
          <div className="flex items-center space-x-3.5">
            {/* Search Input Box */}
            <form onSubmit={handleSearch} className="hidden md:flex relative items-center">
              <input
                type="text"
                placeholder="Search statues, holders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-56 text-xs bg-white/90 border border-brand-200/90 rounded-full py-2 pl-9 pr-4 text-brand-950 placeholder-brand-400 focus:outline-none focus:ring-1.5 focus:ring-brand-700 focus:bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-brand-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-brand-900 hover:text-brand-950 hover:bg-brand-100/50 rounded-full transition-all focus:outline-none"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search statues, incense burners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-brand-200 rounded-full py-2 pl-9 pr-4 text-brand-950 placeholder-brand-400 focus:outline-none focus:ring-1.5 focus:ring-brand-700"
            />
            <Search className="w-4 h-4 text-brand-400 absolute left-3 top-2.5 pointer-events-none" />
          </form>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-brand-100 py-4 space-y-2 bg-white/98 rounded-b-2xl animate-fadeIn">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              All Products
            </Link>
            <Link
              href="/shop?category=spiritual-zen"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Spiritual & Zen
            </Link>
            <Link
              href="/shop?category=home-decor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Home Decor
            </Link>
            <Link
              href="/shop?category=gift-sets"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Gift Sets
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-brand-100 px-3 text-xs text-brand-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span>Negombo, Sri Lanka • Cash on Delivery</span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
