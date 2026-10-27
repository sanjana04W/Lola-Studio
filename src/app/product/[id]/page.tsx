'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { getProductById, getProducts } from '@/services/storeService';
import { useCart } from '@/context/CartContext';
import { trackViewContent } from '@/lib/pixel';
import ProductCard from '@/components/product/ProductCard';
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!productId) return;
      setLoading(true);
      const item = await getProductById(productId);
      if (item) {
        setProduct(item);
        setSelectedImage(item.images[0] || '/logo.png');
        trackViewContent(item);

        const allProds = await getProducts(true);
        const rel = allProds
          .filter((p) => p.id !== item.id && p.categoryId === item.categoryId)
          .slice(0, 4);
        setRelated(rel);
      }
      setLoading(false);
    }
    load();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-300 border-t-brand-900 rounded-full animate-spin mb-4" />
        <p className="text-xs text-brand-600">Loading sacred artifact...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-brand-950">Product Not Found</h2>
        <p className="text-xs text-brand-600 mt-2">The requested creation could not be found or has been retired.</p>
        <Link
          href="/shop"
          className="inline-block mt-6 px-6 py-2.5 rounded-full bg-brand-900 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 3;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappInquiryUrl = `https://wa.me/94751483613?text=${encodeURIComponent(
    `Hello Lola Studio, I am inquiring about "${product.name}" (SKU: ${product.sku}, LKR ${product.price}). Is this currently available for Cash on Delivery delivery?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back breadcrumb */}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-brand-100/60 border border-brand-200/80 shadow-soft">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-brand-900 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-600 uppercase font-semibold tracking-wider">
              <span>{product.categoryName}</span>
              <span>•</span>
              <span>{product.subcategoryName}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 mt-2 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-brand-950">
                LKR {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-brand-400 line-through">
                  LKR {product.originalPrice.toLocaleString()}
                </span>
              )}
              {isOutOfStock ? (
                <span className="px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold uppercase tracking-wider">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                  Only {product.stockQuantity} Left
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  In Stock ({product.stockQuantity})
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-brand-700 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Quantity & Add to Cart */}
          <div className="p-5 rounded-2xl bg-white border border-brand-200 shadow-soft space-y-4">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-800">Select Quantity:</span>
                <div className="flex items-center border border-brand-200 rounded-xl bg-brand-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-brand-700 hover:text-brand-950 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-brand-950">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3.5 py-1.5 text-brand-700 hover:text-brand-950 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                isOutOfStock
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-900 text-white hover:bg-brand-800 shadow-lifted active:scale-98'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Your Bag</span>
                </>
              ) : isOutOfStock ? (
                <span>Currently Out of Stock</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • LKR {(product.price * quantity).toLocaleString()}</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp Chat */}
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>

          {/* Detailed Specifications */}
          <div className="rounded-2xl border border-brand-100 overflow-hidden bg-white">
            <div className="bg-brand-50/70 px-4 py-2.5 border-b border-brand-100 text-xs font-bold uppercase tracking-wider text-brand-800">
              Product Specifications
            </div>
            <dl className="divide-y divide-brand-50 text-xs">
              <div className="px-4 py-2.5 flex justify-between">
                <dt className="text-brand-500">SKU Code</dt>
                <dd className="font-mono font-semibold text-brand-900">{product.sku}</dd>
              </div>
              {product.material && (
                <div className="px-4 py-2.5 flex justify-between">
                  <dt className="text-brand-500">Material Composition</dt>
                  <dd className="font-semibold text-brand-900">{product.material}</dd>
                </div>
              )}
              {product.dimensions && (
                <div className="px-4 py-2.5 flex justify-between">
                  <dt className="text-brand-500">Dimensions</dt>
                  <dd className="font-semibold text-brand-900">{product.dimensions}</dd>
                </div>
              )}
              {product.color && (
                <div className="px-4 py-2.5 flex justify-between">
                  <dt className="text-brand-500">Finish / Color</dt>
                  <dd className="font-semibold text-brand-900">{product.color}</dd>
                </div>
              )}
              {product.weight && (
                <div className="px-4 py-2.5 flex justify-between">
                  <dt className="text-brand-500">Estimated Weight</dt>
                  <dd className="font-semibold text-brand-900">{product.weight}</dd>
                </div>
              )}
              <div className="px-4 py-2.5 flex justify-between">
                <dt className="text-brand-500">Origin</dt>
                <dd className="font-semibold text-brand-900">Negombo, Sri Lanka</dd>
              </div>
            </dl>
          </div>

          {/* Delivery & Assurance */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-brand-700">
              <Truck className="w-4 h-4 text-brand-900 flex-shrink-0" />
              <span>Islandwide Cash on Delivery (COD) with prompt courier dispatch.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-brand-700">
              <ShieldCheck className="w-4 h-4 text-brand-900 flex-shrink-0" />
              <span>Shock-proof air-cushioned transit boxing for fragile stone items.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-24 pt-12 border-t border-brand-200">
          <h3 className="font-serif text-2xl font-bold text-brand-950 mb-8">
            You May Also Admire
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
