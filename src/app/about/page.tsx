import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, Sparkles, Heart, Award, ArrowRight, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2]">
      {/* Hero */}
      <section className="relative py-20 bg-white border-b border-brand-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-brand-600 font-semibold block">
            The Story of Lola Studio
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-950 leading-tight">
            Mindful Artistry, Sculpted in Negombo.
          </h1>
          <p className="text-sm sm:text-base text-brand-700 leading-relaxed max-w-2xl mx-auto font-sans">
            We are an independent Sri Lankan artisan workshop creating timeless Buddhist iconography, serene mineral stone incense holders, and tactile modern home decor.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="font-serif text-3xl font-bold text-brand-950">
              From Raw Mineral Stone to Sacred Sanctuaries
            </h2>
            <p className="text-xs sm:text-sm text-brand-700 leading-relaxed font-sans">
              Founded in Negombo by a passionate Sri Lankan craftsperson, Lola Studio began with a reverence for classical Buddhist sculpting traditions and modern architectural minimalism. We noticed that contemporary homes were filled with mass-produced plastic replicas that lacked weight, texture, and soul.
            </p>
            <p className="text-xs sm:text-sm text-brand-700 leading-relaxed font-sans">
              We chose a different path: formulating proprietary composite mineral stones blended with quartz sands and earth pigments. Every single statue, incense terrace, and wall relief is hand-cast, slow-cured to achieve geological density, and individually burnished.
            </p>
            <p className="text-xs sm:text-sm text-brand-700 leading-relaxed font-sans">
              When you hold a Lola Studio creation, you immediately feel its substantial heft, cooling stone touch, and subtle organic micro-variations that ensure your piece is one of a kind.
            </p>

            <div className="pt-4 flex items-center gap-3 text-xs text-brand-800 font-semibold">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Workshop based in Negombo, Sri Lanka (Always Open for online orders)</span>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft bg-brand-100">
              <Image src="/FB_IMG_1793104373311.jpg" alt="Artisan Buddha Statue" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft bg-brand-100 mt-8">
              <Image src="/FB_IMG_1793104384214.jpg" alt="Wall Art Sculpture" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Studio Principles */}
        <div className="mt-20 pt-16 border-t border-brand-200 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-brand-100 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-900 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-950">Spiritual Reverence</h3>
            <p className="text-xs text-brand-600 leading-relaxed">
              Every Buddhist sculpture adheres to traditional mudra iconography and anatomical proportions, sculpted with spiritual clarity and mindfulness.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-brand-100 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-900 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-950">Tactile Modernity</h3>
            <p className="text-xs text-brand-600 leading-relaxed">
              We marry traditional Sri Lankan soul with understated Japandi and Nordic minimalism, creating centerpieces that elevate any interior.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-brand-100 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-900 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-950">Reliable Islandwide Delivery</h3>
            <p className="text-xs text-brand-600 leading-relaxed">
              We package every piece with heavy shock-absorbing wrap and deliver islandwide with safe Cash on Delivery (COD) right to your doorstep.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-800 transition-colors shadow-soft"
          >
            <span>Explore Our Creations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
