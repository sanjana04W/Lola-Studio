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
                <Image src="/logo.png" alt="Lola Studio" fill className="object-contain object-left" />
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
                className="w-9 h-9 rounded-full bg-brand-900 hover:bg-brand-800 text-brand-200 flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="TikTok"
              >
                TikTok
              </a>
              <a
                href="https://www.facebook.com/share/1BHPwwgVWa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-900 hover:bg-brand-800 text-brand-200 flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href="https://www.instagram.com/lola_studio_21?mdxt=MWozank0YWp1NDgzZg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-900 hover:bg-brand-800 text-brand-200 flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Instagram"
              >
                IG
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
