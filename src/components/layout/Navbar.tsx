'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, Shield, Phone, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-brand-100 shadow-sm transition-all">
      {/* Top Notification Bar */}
      <div className="bg-brand-900 text-brand-100 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-300 animate-pulse" />
        <span>Islandwide Cash on Delivery (COD) Available | Handcrafted in Negombo, Sri Lanka</span>
        <span className="hidden sm:inline-block text-brand-400">•</span>
        <span className="hidden sm:inline-flex items-center gap-1 text-brand-300">
          <Phone className="w-3 h-3" /> 075 148 3613
        </span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-800 hover:text-brand-950 hover:bg-brand-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-200 shadow-sm group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="Lola Studio Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-brand-950 group-hover:text-brand-700 transition-colors">
                  LOLA STUDIO
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-brand-600 font-sans font-semibold">
                  Artisanal Zen & Decor
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-brand-800">
            <Link href="/" className="hover:text-brand-600 transition-colors py-1">
              Home
            </Link>
            <Link href="/shop" className="hover:text-brand-600 transition-colors py-1">
              All Products
            </Link>
            <Link
              href="/shop?category=spiritual-zen"
              className="hover:text-brand-600 transition-colors py-1 flex items-center gap-1"
            >
              Spiritual & Zen
            </Link>
            <Link
              href="/shop?category=home-decor"
              className="hover:text-brand-600 transition-colors py-1"
            >
              Home Decor
            </Link>
            <Link
              href="/shop?category=gift-sets"
              className="hover:text-brand-600 transition-colors py-1"
            >
              Gift Sets
            </Link>
            <Link href="/about" className="hover:text-brand-600 transition-colors py-1">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-brand-600 transition-colors py-1">
              Contact
            </Link>
          </div>

          {/* Right Action Icons: Search + Cart + Admin */}
          <div className="flex items-center space-x-4">
            {/* Search Bar Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex relative items-center">
              <input
                type="text"
                placeholder="Search statues, holders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-56 text-xs bg-brand-50/80 border border-brand-200 rounded-full py-2 pl-9 pr-4 text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-brand-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Admin Link Badge */}
            <Link
              href="/admin"
              className="p-2 text-brand-700 hover:text-brand-950 hover:bg-brand-100/60 rounded-full transition-colors flex items-center gap-1 text-xs font-medium"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4 text-brand-600" />
              <span className="hidden xl:inline">Admin</span>
            </Link>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-brand-900 hover:text-brand-700 hover:bg-brand-50 rounded-full transition-all focus:outline-none"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scaleIn shadow-sm">
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
              className="w-full text-xs bg-brand-50 border border-brand-200 rounded-full py-2 pl-9 pr-4 text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-brand-400 absolute left-3 top-2.5 pointer-events-none" />
          </form>
        </div>

        {/* Mobile Nav Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-brand-100 py-4 space-y-3 bg-white animate-fadeIn">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              All Products
            </Link>
            <Link
              href="/shop?category=spiritual-zen"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Spiritual & Zen
            </Link>
            <Link
              href="/shop?category=home-decor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Home Decor
            </Link>
            <Link
              href="/shop?category=gift-sets"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Gift Sets
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              About Lola Studio
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50 rounded-lg"
            >
              Contact Us
            </Link>
            <div className="pt-2 border-t border-brand-100 flex items-center justify-between px-3 text-xs text-brand-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Negombo, Sri Lanka
              </span>
              <Link href="/admin" className="font-semibold text-brand-800 underline">
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
