'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { trackViewContent } from '@/lib/pixel';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '/logo.png');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  React.useEffect(() => {
    trackViewContent(product);
  }, [product]);

  const isOutOfStock = product.stockQuantity <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-brand-900 shadow-sm z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="p-6 bg-brand-50/50 flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-brand-100 shadow-sm">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img ? 'border-brand-800 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} thumbnail ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-brand-600 uppercase font-semibold tracking-wider">
                <span>{product.categoryName}</span>
                <span>•</span>
                <span>{product.subcategoryName}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-brand-950 mt-1">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold text-brand-950">
                  LKR {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-brand-400 line-through">
                    LKR {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs text-brand-700 leading-relaxed mt-4">
                {product.description}
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3 mt-5 p-3 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-800">
                {product.material && (
                  <div>
                    <span className="text-brand-500 block text-[10px] uppercase">Material</span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <span className="text-brand-500 block text-[10px] uppercase">Dimensions</span>
                    <span className="font-medium">{product.dimensions}</span>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="text-brand-500 block text-[10px] uppercase">Weight</span>
                    <span className="font-medium">{product.weight}</span>
                  </div>
                )}
                <div>
                  <span className="text-brand-500 block text-[10px] uppercase">Availability</span>
                  <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-emerald-700'}`}>
                    {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} in stock`}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-2">
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-brand-800">Quantity:</span>
                  <div className="flex items-center border border-brand-200 rounded-xl bg-brand-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-brand-700 hover:text-brand-950"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-brand-950">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="px-3 py-1.5 text-brand-700 hover:text-brand-950"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-900 text-white hover:bg-brand-800 shadow-md active:scale-98'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag (LKR {(product.price * quantity).toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-brand-600 pt-2 border-t border-brand-100">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-brand-700" /> Islandwide COD
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-700" /> Breakage-Free Packing
                </span>
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="underline font-semibold hover:text-brand-950"
                >
                  Full Page Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
