'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category } from '@/types';
import { getProducts, getCategories } from '@/services/storeService';
import ProductCard from '@/components/product/ProductCard';
import { Search, Filter, SlidersHorizontal, Sparkles, Check } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(true), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get('search');
    if (search) setSearchTerm(search);
  }, [searchParams]);

  // Current category's subcategories
  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== 'all') {
      const catObj = categories.find((c) => c.slug === selectedCategory);
      if (catObj && product.categoryId !== catObj.id) return false;
    }

    // Subcategory filter
    if (selectedSubcategory !== 'all') {
      if (product.subcategoryId !== selectedSubcategory) return false;
    }

    // In Stock filter
    if (onlyInStock && product.stockQuantity <= 0) return false;

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchCat = product.categoryName.toLowerCase().includes(q);
      const matchSub = product.subcategoryName.toLowerCase().includes(q);
      const matchMat = (product.material || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat && !matchSub && !matchMat) return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default featured: featured first, then stock
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          The Full Artisan Catalogue
        </h1>
        <p className="text-xs sm:text-sm text-brand-600 mt-2 font-sans">
          Browse our complete handcrafted selection of Buddha statues, incense holders, and home decor. Cash on delivery available islandwide.
        </p>
      </div>

      {/* Main Filter & Category Tabs */}
      <div className="space-y-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-900 text-white shadow-soft'
                : 'bg-white text-brand-700 hover:bg-brand-100/60 border border-brand-200'
            }`}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.slug);
                setSelectedSubcategory('all');
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                selectedCategory === c.slug
                  ? 'bg-brand-900 text-white shadow-soft'
                  : 'bg-white text-brand-700 hover:bg-brand-100/60 border border-brand-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Subcategories (if selected category is active) */}
        {currentCategoryObj && currentCategoryObj.subcategories.length > 0 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-1 pb-2">
            <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider mr-1">
              Sub-Category:
            </span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSubcategory === 'all'
                  ? 'bg-brand-200 text-brand-900 font-semibold'
                  : 'bg-white text-brand-600 hover:bg-brand-50 border border-brand-100'
              }`}
            >
              All {currentCategoryObj.name}
            </button>
            {currentCategoryObj.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSubcategory === sub.id
                    ? 'bg-brand-200 text-brand-900 font-semibold'
                    : 'bg-white text-brand-600 hover:bg-brand-50 border border-brand-100'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Search, Sort, and In-Stock Controls Bar */}
        <div className="p-4 rounded-2xl bg-white border border-brand-100 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by name, stone, style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-brand-50 border border-brand-200 rounded-xl py-2 pl-9 pr-3 text-brand-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-brand-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          <div className="flex items-center flex-wrap justify-end gap-4 w-full md:w-auto">
            {/* In-Stock Only Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-brand-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-brand-800 focus:ring-brand-500 border-brand-300"
              />
              <span>In-Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-brand-50 border border-brand-200 rounded-xl py-2 px-3 text-brand-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Results Status */}
      <div className="flex items-center justify-between text-xs text-brand-500 mb-6">
        <span>Showing {sortedProducts.length} handcrafted items</span>
        {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || searchTerm || onlyInStock) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
              setSearchTerm('');
              setOnlyInStock(false);
            }}
            className="text-brand-800 underline font-semibold hover:text-brand-950"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-brand-100/60 aspect-[4/5] animate-pulse" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-brand-100 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-50 flex items-center justify-center text-brand-400 mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-brand-950">No items match your criteria</h3>
          <p className="text-xs text-brand-600 max-w-sm mx-auto mt-2">
            Try adjusting your search terms or reset filters to see our full artisanal collection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
              setSearchTerm('');
              setOnlyInStock(false);
            }}
            className="mt-6 px-6 py-2.5 rounded-full bg-brand-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-brand-600">Loading catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
