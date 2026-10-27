'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCategories, getProducts, saveCategory, saveProduct } from '@/services/storeService';
import { Category, Product, SubCategory } from '@/types';
import {
  Layers,
  Plus,
  AlertTriangle,
  Edit,
  Save,
  Check,
  Package,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function CategoryAndInventoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Stock Adjustments state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);

  const loadData = async () => {
    setLoading(true);
    const [c, p] = await Promise.all([getCategories(), getProducts()]);
    setCategories(c);
    setProducts(p);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveStock = async (product: Product) => {
    const updated = { ...product, stockQuantity: Number(newStockVal) };
    await saveProduct(updated);
    setProducts(products.map((p) => (p.id === product.id ? updated : p)));
    setEditingStockId(null);
  };

  const lowStockItems = products.filter((p) => p.stockQuantity <= 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Category & Inventory Control
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            Organize catalog taxonomy and prevent overselling of limited-run handmade items.
          </p>
        </div>
      </div>

      {/* Critical Low-Stock Warning Panel (< 3 units) */}
      <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif text-base font-bold">
              Low-Stock & Out-of-Stock Attention Report ({lowStockItems.length} SKUs)
            </h2>
          </div>
          <span className="text-[11px] text-amber-800 font-semibold">
            Threshold: &le; 3 units
          </span>
        </div>

        {lowStockItems.length === 0 ? (
          <p className="text-xs text-emerald-800 font-medium">
            ✨ All items have sufficient stock units available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-2xl bg-white border border-amber-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-100 flex-shrink-0">
                    <Image src={prod.images[0] || '/logo.png'} alt={prod.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-950 truncate max-w-[140px]">{prod.name}</h4>
                    <span className="font-mono text-[10px] text-brand-500">{prod.sku}</span>
                    <span
                      className={`block text-[10px] font-bold uppercase mt-0.5 ${
                        prod.stockQuantity <= 0 ? 'text-red-600' : 'text-amber-800'
                      }`}
                    >
                      {prod.stockQuantity <= 0 ? 'Out of stock' : `${prod.stockQuantity} units remaining`}
                    </span>
                  </div>
                </div>

                {editingStockId === prod.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={newStockVal}
                      onChange={(e) => setNewStockVal(Number(e.target.value))}
                      className="w-14 text-xs p-1.5 border border-brand-300 rounded-lg text-center font-bold"
                    />
                    <button
                      onClick={() => handleSaveStock(prod)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white"
                      title="Save"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingStockId(prod.id);
                      setNewStockVal(prod.stockQuantity);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-brand-100 hover:bg-brand-200 text-brand-900 text-[11px] font-bold"
                  >
                    Adjust
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Hierarchy Showcase */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-950">
          Current Category Taxonomy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-brand-200 overflow-hidden shadow-soft flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] w-full bg-brand-100">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="font-serif text-lg font-bold">{cat.name}</h3>
                    <span className="text-[11px] opacity-90">{count} Active Products</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-brand-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="pt-2 border-t border-brand-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 block mb-2">
                      Sub-Categories
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <span
                          key={sub.id}
                          className="px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-medium"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Live Inventory Adjuster Table */}
      <div className="bg-white rounded-3xl border border-brand-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-brand-100 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-brand-950">
            Instant Stock Adjuster ({products.length} Products)
          </h2>
          <span className="text-xs text-brand-500">Always saved directly to Firebase</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-brand-50/70 border-b border-brand-100 text-brand-500 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Current Stock</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-brand-50/30">
                  <td className="py-3 px-4 font-semibold text-brand-950">{prod.name}</td>
                  <td className="py-3 px-4 font-mono text-brand-700">{prod.sku}</td>
                  <td className="py-3 px-4 text-brand-600">{prod.categoryName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        prod.stockQuantity <= 0
                          ? 'text-red-600'
                          : prod.stockQuantity <= 3
                          ? 'text-amber-700'
                          : 'text-brand-950'
                      }`}
                    >
                      {prod.stockQuantity} units
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {editingStockId === prod.id ? (
                      <div className="inline-flex items-center gap-1.5">
                        <input
                          type="number"
                          value={newStockVal}
                          onChange={(e) => setNewStockVal(Number(e.target.value))}
                          className="w-16 p-1 border border-brand-300 rounded text-center text-xs font-bold"
                        />
                        <button
                          onClick={() => handleSaveStock(prod)}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingStockId(prod.id);
                          setNewStockVal(prod.stockQuantity);
                        }}
                        className="px-2.5 py-1 rounded bg-brand-100 hover:bg-brand-200 text-brand-900 text-xs font-semibold"
                      >
                        Edit Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
