import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Compass, Heart, Feather } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="py-20 bg-white border-y border-brand-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Images Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft bg-brand-100">
                <Image
                  src="/FB_IMG_1793104384214.jpg"
                  alt="Lola Studio Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-soft bg-brand-100">
                <Image
                  src="/FB_IMG_1793104474800.jpg"
                  alt="Lola Studio Gift Bundles"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-soft bg-brand-100">
                <Image
                  src="/FB_IMG_1793104375462.jpg"
                  alt="Buddha Detail Carving"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft bg-brand-100">
                <Image
                  src="/FB_IMG_1793104301992.jpg"
                  alt="Handcrafted Stone Incense Holder"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-600 font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Our Artisan Heritage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 leading-tight">
              Crafted in Negombo with Sacred Intention and Tactile Beauty.
            </h2>

            <p className="text-sm text-brand-700 leading-relaxed font-sans">
              Lola Studio began with a single vision: to create serene, sculptural objects that invite calm reflection into modern fast-paced routines. What started as small clay experiments by our founder has blossomed into a beloved Sri Lankan artisan brand celebrating mindfulness, organic textures, and sacred geometry.
            </p>

            <p className="text-sm text-brand-700 leading-relaxed font-sans">
              Each piece is formulated using high-grade mineral composites, cast stone, and earth pigments. Our artisans hand-sand every curve, inspect every contour, and seal each creation to ensure it graces your altar, shelf, or tabletop for generations.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-950 uppercase tracking-wide">Eco-Conscious Casting</h4>
                  <p className="text-[11px] text-brand-600 mt-0.5">Natural mineral aggregates and zero harsh solvent finishes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-950 uppercase tracking-wide">Handmade Individuality</h4>
                  <p className="text-[11px] text-brand-600 mt-0.5">No two pieces are identical, carrying unique micro-textures.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-900 hover:text-brand-600 group"
              >
                <span>Read Full Brand Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
