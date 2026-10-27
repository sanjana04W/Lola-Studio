import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/initialData';

export default function CategoryShowcase() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-brand-600 font-semibold block mb-2">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
              Sculpted for Mindful Living
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-brand-800 hover:text-brand-600 flex items-center gap-1 group"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-brand-100 shadow-soft hover:shadow-floating transition-all duration-300"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/30 to-transparent" />

              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-[11px] uppercase tracking-widest text-brand-300 font-semibold mb-1">
                  {cat.subcategories.length} Sub-Collections
                </span>
                <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-brand-200 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-brand-200 line-clamp-2 leading-relaxed opacity-90 mb-4">
                  {cat.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                  <span>Explore Collection</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
