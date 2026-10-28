'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCategories, getProducts, saveProduct } from '@/services/storeService';
import { Category, Product } from '@/types';
import { AlertTriangle, Check, CheckCircle2 } from 'lucide-react';

export default function CategoryAndInventoryPage() {
  const [categories,     setCategories]     = useState<Category[]>([]);
  const [products,       setProducts]       = useState<Product[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStockVal,    setNewStockVal]    = useState<number>(0);

  const loadData = async () => {
    setLoading(true);
    const [c, p] = await Promise.all([getCategories(), getProducts()]);
    setCategories(c);
    setProducts(p);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

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
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059] mb-1">Inventory</p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#22201E]">Category &amp; Inventory Control</h1>
        <p className="text-xs text-[#8E8A80] mt-1">Organize catalog taxonomy and prevent overselling of limited-run handmade items.</p>
      </div>

      {/* Low-Stock Warning Panel */}
      <div className={`p-5 rounded-2xl border ${lowStockItems.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'} space-y-4`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${lowStockItems.length > 0 ? 'text-amber-900' : 'text-emerald-800'}`}>
            {lowStockItems.length > 0
              ? <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
              : <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
            }
            <h2 className="font-serif text-base font-bold">
              {lowStockItems.length > 0
                ? `Low-Stock Report — ${lowStockItems.length} SKUs Need Attention`
                : 'All inventory healthy'}
            </h2>
          </div>
          <span className={`text-[11px] font-semibold ${lowStockItems.length > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
            Threshold: ≤ 3 units
          </span>
        </div>

        {lowStockItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((prod) => (
              <div key={prod.id} className="p-3.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#F5F2ED] flex-shrink-0">
                    <Image src={prod.images[0] || '/logo.png'} alt={prod.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-[#22201E] truncate max-w-[130px]">{prod.name}</p>
                    <p className="font-mono text-[10px] text-[#A09890]">{prod.sku}</p>
                    <p className={`text-[10px] font-bold uppercase ${prod.stockQuantity <= 0 ? 'text-red-600' : 'text-amber-700'}`}>
                      {prod.stockQuantity <= 0 ? 'Out of stock' : `${prod.stockQuantity} units left`}
                    </p>
                  </div>
                </div>
                {editingStockId === prod.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number" value={newStockVal}
                      onChange={(e) => setNewStockVal(Number(e.target.value))}
                      className="w-14 text-xs p-1.5 border border-[#E8E4DC] rounded-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30"
                    />
                    <button onClick={() => handleSaveStock(prod)} className="p-1.5 rounded-lg bg-emerald-600 text-white" title="Save">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingStockId(prod.id); setNewStockVal(prod.stockQuantity); }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#F5F2ED] hover:bg-[#EDE9E2] text-[#4A4640] text-[11px] font-bold transition-colors"
                  >
                    Adjust
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories showcase */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#22201E]">Category Taxonomy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col">
                <div className="relative aspect-[16/9] w-full bg-[#F0EDE8]">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="font-serif text-base font-bold">{cat.name}</h3>
                    <span className="text-[11px] opacity-90">{count} Active Products</span>
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1">
                  <p className="text-xs text-[#7A756B] line-clamp-2 leading-relaxed">{cat.description}</p>
                  <div className="pt-2 border-t border-[#F0EDE8]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059] block mb-2">Sub-Categories</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <span key={sub.id} className="px-2.5 py-1 rounded-lg bg-[#F5F2ED] border border-[#E8E4DC] text-[#4A4640] text-[11px] font-medium">
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

      {/* Stock adjuster table */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE8] flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-[#22201E]">
            Live Stock Adjuster <span className="text-xs font-normal text-[#A09890] ml-1">({products.length} products)</span>
          </h2>
          <span className="text-xs text-[#A09890]">Saved directly to Firebase</span>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FDFCFB] border-b border-[#F0EDE8] text-[#A09890] uppercase text-[10px] tracking-widest">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2ED]">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#22201E]">{prod.name}</td>
                    <td className="py-3 px-4 font-mono text-[#7A756B]">{prod.sku}</td>
                    <td className="py-3 px-4 text-[#7A756B]">{prod.categoryName}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        prod.stockQuantity <= 0 ? 'text-red-600' : prod.stockQuantity <= 3 ? 'text-amber-700' : 'text-[#22201E]'
                      }`}>
                        {prod.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingStockId === prod.id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <input
                            type="number" value={newStockVal}
                            onChange={(e) => setNewStockVal(Number(e.target.value))}
                            className="w-16 p-1.5 border border-[#E8E4DC] rounded-lg text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30"
                          />
                          <button onClick={() => handleSaveStock(prod)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors">
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingStockId(prod.id); setNewStockVal(prod.stockQuantity); }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#F5F2ED] hover:bg-[#EDE9E2] text-[#4A4640] text-xs font-semibold transition-colors"
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
        )}
      </div>
    </div>
  );
}
