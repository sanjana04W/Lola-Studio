import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#F7F4EE] pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-brand-100">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-300/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200 shadow-soft text-brand-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-zen-gold" />
              <span>Handcrafted in Negombo, Sri Lanka</span>
              <span className="text-brand-300">•</span>
              <span className="text-brand-600">Cash on Delivery</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-950 leading-[1.12] tracking-tight">
              Bring Timeless <span className="italic font-normal text-brand-700">Zen & Harmony</span> Into Your Home.
            </h1>

            <p className="text-sm sm:text-base text-brand-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Discover artisan-sculpted Buddha statues, organic stone incense sanctuaries, and architectural home decor. Thoughtfully designed to ground contemporary living spaces in mindful serenity.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-900 text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-brand-800 shadow-lifted hover:shadow-floating transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?category=spiritual-zen"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-brand-300 text-brand-900 font-sans text-xs font-bold uppercase tracking-widest hover:bg-brand-50 transition-all flex items-center justify-center"
              >
                Spiritual & Zen
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-brand-200/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div className="space-y-1">
                <span className="font-serif text-xl sm:text-2xl font-bold text-brand-950 block">50+</span>
                <span className="text-[11px] text-brand-600 block leading-tight">Artisan SKUs</span>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-xl sm:text-2xl font-bold text-brand-950 block">100%</span>
                <span className="text-[11px] text-brand-600 block leading-tight">Safe Delivery</span>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-xl sm:text-2xl font-bold text-brand-950 block">COD</span>
                <span className="text-[11px] text-brand-600 block leading-tight">Pay on Arrival</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Collage with Real Lola Studio Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Primary Image */}
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-floating border-4 border-white bg-brand-100">
                <Image
                  src="/FB_IMG_1793104373311.jpg"
                  alt="Lola Studio Buddha Statue"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Overlapping Secondary Card */}
              <div className="absolute -bottom-6 -left-6 w-44 sm:w-52 aspect-square rounded-2xl overflow-hidden shadow-floating border-4 border-white hidden sm:block bg-brand-100">
                <Image
                  src="/FB_IMG_1793104253266.jpg"
                  alt="Lola Studio Incense Burner"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Feature Pill */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lifted border border-brand-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-950 block">Protected Transit</span>
                  <span className="text-[10px] text-brand-500 block">Cushioned Mineral Crating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
