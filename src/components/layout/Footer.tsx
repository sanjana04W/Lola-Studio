import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100 pt-16 pb-8 border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Banners */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-brand-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center text-brand-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Handcrafted Artistry</h4>
              <p className="text-xs text-brand-300">Individually sculpted & finished</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center text-brand-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Islandwide COD</h4>
              <p className="text-xs text-brand-300">Pay safely upon delivery</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center text-brand-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Always Open</h4>
              <p className="text-xs text-brand-300">Orders processed 24/7 online</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center text-brand-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Safe Transit Packaging</h4>
              <p className="text-xs text-brand-300">Shock-proof mineral wrapping</p>
            </div>
          </div>
        </div>

        {/* Footer Main Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-32">
                <Image src="/logo-light.png" alt="Lola Studio" fill className="object-contain object-left" />
              </div>
            </div>
            <p className="text-xs text-brand-300 leading-relaxed max-w-sm">
              Handcrafted in Negombo, Sri Lanka. Lola Studio sculpts organic spiritual iconography, modern zen accents, and timeless home decor that brings serenity into your living sanctuary.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.tiktok.com/@lolastudio21?_r=1&_t=ZS-9AuDDaKFHC0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-900 hover:bg-brand-800 text-brand-200 hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                aria-label="TikTok"
                title="TikTok @lolastudio21"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46 6.3 6.3 0 0 0 1.94-4.5V8.62a8.21 8.21 0 0 0 4.83 1.57v-3.5z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1BHPwwgVWa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-900 hover:bg-brand-800 text-brand-200 hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/lola_studio_21?mdxt=MWozank0YWp1NDgzZg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-900 hover:bg-brand-800 text-brand-200 hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                aria-label="Instagram"
                title="Instagram @lola_studio_21"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://wa.me/94751483613"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-900 hover:bg-brand-800 text-brand-200 hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                aria-label="WhatsApp"
                title="WhatsApp 075 148 3613"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-300">
              <li>
                <Link href="/shop?category=spiritual-zen" className="hover:text-white transition-colors">
                  Buddha Statues
                </Link>
              </li>
              <li>
                <Link href="/shop?category=spiritual-zen" className="hover:text-white transition-colors">
                  Incense Burners
                </Link>
              </li>
              <li>
                <Link href="/shop?category=home-decor" className="hover:text-white transition-colors">
                  Architectural Wall Art
                </Link>
              </li>
              <li>
                <Link href="/shop?category=home-decor" className="hover:text-white transition-colors">
                  Candle Holders & Vases
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gift-sets" className="hover:text-white transition-colors">
                  Curated Gift Bundles
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care / Policies */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-300">
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition-colors">
                  Shipping & COD Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Workshop & Contact
            </h4>
            <ul className="space-y-3 text-xs text-brand-300">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=Negombo%2C%20Sri%20Lanka&FORM=FBKPL1&mkt=en-GB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Negombo, Sri Lanka (Always Open)
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="tel:0751483613" className="hover:text-white transition-colors">
                  075 148 3613
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:dili.gamage11@gmail.com" className="hover:text-white transition-colors">
                  dili.gamage11@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-900 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-400 gap-4">
          <p>© {new Date().getFullYear()} Lola Studio. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500" /> in Negombo, Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
