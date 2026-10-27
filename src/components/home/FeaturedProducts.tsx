'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '../product/ProductCard';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'spiritual-zen' | 'home-decor' | 'gift-sets'>('all');

  const filtered = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'spiritual-zen') return p.categoryId === 'cat-spiritual-zen';
    if (activeTab === 'home-decor') return p.categoryId === 'cat-home-decor';
    if (activeTab === 'gift-sets') return p.categoryId === 'cat-gift-sets';
    return true;
  });

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-brand-600 font-semibold block mb-2">
            Selected Masterpieces
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
            Featured Creations
          </h2>
          <p className="text-xs sm:text-sm text-brand-600 mt-3 font-sans">
            Every piece is hand-poured, cured, and hand-finished with reverence in our Negombo workshop.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-brand-900 text-white shadow-soft'
                : 'bg-white text-brand-700 hover:bg-brand-100/60 border border-brand-200'
            }`}
          >
            All Pieces ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('spiritual-zen')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
              activeTab === 'spiritual-zen'
                ? 'bg-brand-900 text-white shadow-soft'
                : 'bg-white text-brand-700 hover:bg-brand-100/60 border border-brand-200'
            }`}
          >
            Spiritual & Zen
          </button>
          <button
            onClick={() => setActiveTab('home-decor')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
              activeTab === 'home-decor'
                ? 'bg-brand-900 text-white shadow-soft'
                : 'bg-white text-brand-700 hover:bg-brand-100/60 border border-brand-200'
            }`}
          >
            Home Decor
          </button>
          <button
            onClick={() => setActiveTab('gift-sets')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
              activeTab === 'gift-sets'
                ? 'bg-brand-900 text-white shadow-soft'
                : 'bg-white text-brand-700 hover:bg-brand-100/60 border border-brand-200'
            }`}
          >
            Gift Bundles
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border border-brand-300 text-brand-900 text-xs font-bold uppercase tracking-widest hover:bg-brand-50 shadow-soft hover:shadow-lifted transition-all"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
