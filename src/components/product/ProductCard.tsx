'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductModal from './ProductModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 3;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl border border-brand-100/90 overflow-hidden shadow-soft hover:shadow-lifted transition-all duration-300 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-50">
          <Link href={`/product/${product.id}`} className="block w-full h-full">
            <Image
              src={product.images[0] || '/logo.png'}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {isOutOfStock ? (
              <span className="bg-neutral-800/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="bg-amber-600/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                Only {product.stockQuantity} Left
              </span>
            ) : product.originalPrice ? (
              <span className="bg-brand-600/95 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                Sale
              </span>
            ) : null}

            {product.isFeatured && !isOutOfStock && (
              <span className="bg-zen-gold/90 backdrop-blur-sm text-brand-950 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Quick View Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-md text-brand-900 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px] text-brand-500 uppercase tracking-wider mb-1">
              <span>{product.categoryName}</span>
              {product.material && <span className="truncate max-w-[120px]">{product.material}</span>}
            </div>

            <Link href={`/product/${product.id}`}>
              <h3 className="font-serif text-base font-semibold text-brand-950 line-clamp-1 group-hover:text-brand-700 transition-colors">
                {product.name}
              </h3>
            </Link>

            {product.dimensions && (
              <p className="text-xs text-brand-400 mt-0.5">{product.dimensions}</p>
            )}
          </div>

          <div className="pt-2 border-t border-brand-50 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-brand-950">
                LKR {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-brand-400 line-through">
                  LKR {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-900 text-white hover:bg-brand-700 active:scale-95'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && <ProductModal product={product} onClose={() => setModalOpen(false)} />}
    </>
  );
}
