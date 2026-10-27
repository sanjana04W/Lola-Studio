'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slideInRight">
          {/* Header */}
          <div className="p-5 border-b border-brand-100 flex items-center justify-between bg-brand-50/50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand-800" />
              <h2 className="text-lg font-serif font-bold text-brand-950">
                Your Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-brand-500 hover:text-brand-900 rounded-full hover:bg-brand-100/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-50 flex items-center justify-center text-brand-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-medium text-brand-900">Your bag is empty</h3>
                <p className="text-xs text-brand-500 max-w-xs mx-auto">
                  Explore our handcrafted statues and zen decor to bring serenity into your home.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-900 transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex space-x-4 p-3 rounded-xl border border-brand-100 bg-brand-50/20 hover:border-brand-200 transition-colors"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-brand-100">
                    <Image
                      src={item.product.images[0] || '/logo.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-brand-950 truncate pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-brand-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-brand-500">{item.product.subcategoryName}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-brand-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-brand-600 hover:text-brand-950 hover:bg-brand-50 rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-brand-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-brand-600 hover:text-brand-950 hover:bg-brand-50 rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-brand-950">
                        LKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-brand-100 bg-brand-50/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-600 font-medium">Subtotal</span>
                <span className="text-lg font-serif font-bold text-brand-950">
                  LKR {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-brand-200 text-xs text-brand-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Cash on Delivery (COD) applied at checkout. Delivery fee calculated next.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl border border-brand-300 text-center text-xs font-bold uppercase tracking-wider text-brand-900 hover:bg-white transition-colors"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-brand-800 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-900 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
