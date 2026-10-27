'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  const FREE_SHIPPING_THRESHOLD = 10000;
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-brand-100/60 flex items-center justify-center text-brand-600 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brand-950">Your Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-brand-600 mt-2 max-w-sm mx-auto">
          Explore our handcrafted Buddha statues, organic incense holders, and home decor to begin.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-brand-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-800 transition-colors shadow-soft"
        >
          <span>Explore Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-950">
            Shopping Bag ({totalItems} items)
          </h1>
          <p className="text-xs text-brand-600 mt-1">Review your selections before Cash on Delivery checkout.</p>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Meter */}
          <div className="p-4 rounded-2xl bg-white border border-brand-200 shadow-soft">
            <div className="flex items-center justify-between text-xs font-medium text-brand-800 mb-2">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-600" />
                {amountNeeded === 0
                  ? '🎉 Congratulations! You have unlocked FREE Delivery!'
                  : `Add LKR ${amountNeeded.toLocaleString()} more to unlock FREE Delivery`}
              </span>
              <span className="font-bold">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-brand-100 overflow-hidden">
              <div
                className="h-full bg-brand-700 rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-3xl border border-brand-100 shadow-soft divide-y divide-brand-100 overflow-hidden">
            {cart.map((item) => (
              <div key={item.product.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-brand-100 flex-shrink-0 border border-brand-200">
                    <Image
                      src={item.product.images[0] || '/logo.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-brand-500 font-semibold block">
                      {item.product.categoryName} • {item.product.sku}
                    </span>
                    <Link
                      href={`/product/${item.product.id}`}
                      className="font-serif text-base font-bold text-brand-950 hover:text-brand-700 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.material && (
                      <p className="text-xs text-brand-500 mt-0.5">{item.product.material}</p>
                    )}
                    <p className="text-xs font-semibold text-brand-800 mt-1">
                      LKR {item.product.price.toLocaleString()} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-brand-100">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-brand-200 rounded-xl bg-brand-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 text-brand-700 hover:text-brand-950"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-brand-950">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 text-brand-700 hover:text-brand-950"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-serif text-base font-bold text-brand-950 min-w-[100px] text-right">
                    LKR {(item.product.price * item.quantity).toLocaleString()}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-brand-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-200 p-6 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-950 pb-3 border-b border-brand-100">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-brand-700">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-brand-950">
                  LKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-brand-950">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : 'From LKR 350 (COD)'}
                </span>
              </div>
              <div className="flex justify-between text-brand-500 text-[11px]">
                <span>Payment Mode</span>
                <span className="font-semibold text-brand-800">Cash on Delivery</span>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-100 flex justify-between items-baseline">
              <span className="font-medium text-brand-900">Total Before Delivery</span>
              <span className="font-serif text-2xl font-bold text-brand-950">
                LKR {subtotal.toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 rounded-2xl bg-brand-900 text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-brand-800 transition-all flex items-center justify-center gap-2 shadow-soft hover:shadow-lifted"
            >
              <span>Proceed to COD Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-brand-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Zero upfront payment required. Inspect parcel upon delivery.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
