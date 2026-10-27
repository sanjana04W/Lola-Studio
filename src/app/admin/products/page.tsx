'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getProducts, getCategories, saveProduct, deleteProduct } from '@/services/storeService';
import { Product, Category } from '@/types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  X,
  Package,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

// Available pre-loaded images in public directory
const PUBLIC_IMAGE_CHOICES = [
  '/FB_IMG_1793104373311.jpg',
  '/FB_IMG_1793104235916.jpg',
  '/FB_IMG_1793104253266.jpg',
  '/FB_IMG_1793104301992.jpg',
  '/FB_IMG_1793104306301.jpg',
  '/FB_IMG_1793104317733.jpg',
  '/FB_IMG_1793104384214.jpg',
  '/FB_IMG_1793104393820.jpg',
  '/FB_IMG_1793104428414.jpg',
  '/FB_IMG_1793104438698.jpg',
  '/FB_IMG_1793104460174.jpg',
  '/FB_IMG_1793104487177.jpg',
  '/FB_IMG_1793104474800.jpg',
  '/FB_IMG_1793104541251.jpg',
  '/FB_IMG_1793105150456.jpg',
  '/FB_IMG_1793105196985.jpg',
  '/FB_IMG_1793105213986.jpg',
  '/FB_IMG_1793105243097.jpg',
  '/FB_IMG_1793105277900.jpg',
  '/FB_IMG_1793105482154.jpg',
  '/FB_IMG_1793106045070.jpg',
  '/FB_IMG_1793106129719.jpg',
  '/FB_IMG_1793106136742.jpg',
  '/FB_IMG_1793106161699.jpg',
];

function ProductManagementContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');
  const editId = searchParams.get('edit');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    description: '',
    price: 3500,
    categoryId: 'cat-spiritual-zen',
    categoryName: 'Spiritual & Zen',
    subcategoryId: 'sub-buddha-statues',
    subcategoryName: 'Buddha Statues',
    dimensions: '',
    material: 'Handcrafted Mineral Cast Stone',
    color: 'Sandstone Dune',
    weight: '1.2 kg',
    stockQuantity: 10,
    images: ['/FB_IMG_1793104373311.jpg'],
    isPublished: true,
    isFeatured: false,
  });

  const loadData = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([getProducts(false), getCategories()]);
    setProducts(p);
    setCategories(c);
    setLoading(false);

    if (editId) {
      const target = p.find((item) => item.id === editId);
      if (target) {
        setEditingProduct(target);
        setFormData(target);
        setModalOpen(true);
      }
    } else if (initialAction === 'new') {
      handleOpenCreate();
    }
  };

  useEffect(() => {
    loadData();
  }, [editId, initialAction]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      id: `lola-${Date.now().toString().slice(-4)}`,
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      name: '',
      description: '',
      price: 4500,
      categoryId: categories[0]?.id || 'cat-spiritual-zen',
      categoryName: categories[0]?.name || 'Spiritual & Zen',
      subcategoryId: categories[0]?.subcategories[0]?.id || 'sub-buddha-statues',
      subcategoryName: categories[0]?.subcategories[0]?.name || 'Buddha Statues',
      dimensions: '15cm x 10cm x 22cm',
      material: 'Handcrafted Cast Stone',
      color: 'Warm Ivory Patina',
      weight: '1.5 kg',
      stockQuantity: 10,
      images: ['/FB_IMG_1793104373311.jpg'],
      isPublished: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setModalOpen(true);
  };

  const handleTogglePublish = async (p: Product) => {
    const updated = { ...p, isPublished: !p.isPublished };
    await saveProduct(updated);
    setProducts(products.map((item) => (item.id === p.id ? updated : item)));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) return;
    await deleteProduct(id);
    setProducts(products.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const prodToSave = {
      ...(formData as Product),
      id: editingProduct ? editingProduct.id : formData.id || `lola-${Date.now()}`,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
    };

    await saveProduct(prodToSave);
    setModalOpen(false);
    loadData();
  };

  // Filter products
  const filtered = products.filter((p) => {
    if (filterCategory !== 'all' && p.categoryId !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Product Management
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            Create, update, toggle visibility, and monitor stock levels for all {products.length} SKUs.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold flex items-center gap-2 shadow-soft transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-brand-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-brand-50 border border-brand-200 rounded-xl py-2.5 pl-9 pr-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-brand-400 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-brand-50 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-3xl border border-brand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-brand-50/70 border-b border-brand-100 text-brand-500 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Image & Product</th>
                <th className="py-3.5 px-4 font-semibold">SKU</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price (LKR)</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Visibility</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-brand-50/30 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-100 flex-shrink-0 border border-brand-200">
                      <Image
                        src={product.images[0] || '/logo.png'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-950 max-w-[200px] truncate">
                        {product.name}
                      </h4>
                      {product.dimensions && (
                        <span className="text-[10px] text-brand-400 block">{product.dimensions}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-800">{product.sku}</td>
                  <td className="py-3.5 px-4 text-brand-700">
                    <span className="block font-medium">{product.categoryName}</span>
                    <span className="text-[10px] text-brand-400">{product.subcategoryName}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-950">
                    LKR {product.price.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {product.stockQuantity <= 0 ? (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold uppercase">
                        Out of stock (0)
                      </span>
                    ) : product.stockQuantity <= 3 ? (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                        Low ({product.stockQuantity})
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">{product.stockQuantity} in stock</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(product)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        product.isPublished
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                      title="Click to toggle store visibility"
                    >
                      {product.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{product.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 rounded-lg text-brand-700 hover:bg-brand-100 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <h2 className="font-serif text-xl font-bold text-brand-950">
                {editingProduct ? 'Edit Product' : 'Add New Handcrafted Product'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-100 text-brand-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-800 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-800 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-800 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-brand-800 mb-1">Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-800 mb-1">Original Price (Sale)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-800 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity || 0}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-800 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => {
                      const selCat = categories.find((c) => c.id === e.target.value);
                      if (selCat) {
                        setFormData({
                          ...formData,
                          categoryId: selCat.id,
                          categoryName: selCat.name,
                          subcategoryId: selCat.subcategories[0]?.id || '',
                          subcategoryName: selCat.subcategories[0]?.name || '',
                        });
                      }
                    }}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-800 mb-1">Subcategory</label>
                  <select
                    value={formData.subcategoryId}
                    onChange={(e) => {
                      const curCat = categories.find((c) => c.id === formData.categoryId);
                      const sub = curCat?.subcategories.find((s) => s.id === e.target.value);
                      setFormData({
                        ...formData,
                        subcategoryId: e.target.value,
                        subcategoryName: sub?.name || '',
                      });
                    }}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                  >
                    {categories
                      .find((c) => c.id === formData.categoryId)
                      ?.subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-brand-800 mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="18cm x 12cm x 28cm"
                    value={formData.dimensions || ''}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-800 mb-1">Material</label>
                  <input
                    type="text"
                    placeholder="Mineral Cast Stone"
                    value={formData.material || ''}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-800 mb-1">Weight</label>
                  <input
                    type="text"
                    placeholder="1.5 kg"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block font-semibold text-brand-800 mb-1.5">
                  Select Product Image (from Lola Studio Public Gallery)
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-brand-50 rounded-2xl border border-brand-200 max-h-36 overflow-y-auto">
                  {PUBLIC_IMAGE_CHOICES.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [img] })}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        formData.images?.[0] === img
                          ? 'border-brand-900 scale-95 shadow-sm ring-2 ring-brand-800'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="choice" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-brand-900">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-900"
                  />
                  <span>Published on Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-brand-900">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-900"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-brand-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-brand-200 text-brand-700 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-900 text-white font-bold hover:bg-brand-800"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductManagementPage() {
  return (
    <Suspense fallback={<div>Loading product catalog...</div>}>
      <ProductManagementContent />
    </Suspense>
  );
}
