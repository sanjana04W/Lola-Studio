'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/storeService';
import { SRI_LANKA_DISTRICTS } from '@/lib/initialData';
import { trackInitiateCheckout, trackPurchase } from '@/lib/pixel';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: 'Colombo',
    postalCode: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (cart.length > 0) {
      trackInitiateCheckout(subtotal, cart.length);
    }
  }, [cart, subtotal]);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-brand-950">Your Cart is Empty</h2>
        <p className="text-xs text-brand-600 mt-2">Please select items before heading to checkout.</p>
        <Link
          href="/shop"
          className="inline-block mt-6 px-6 py-2.5 rounded-full bg-brand-900 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  // Delivery fee calculation
  const isFreeDelivery = subtotal >= 10000;
  const deliveryFee = isFreeDelivery
    ? 0
    : formData.district === 'Colombo' || formData.district === 'Gampaha'
    ? 350
    : 450;
  const grandTotal = subtotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim()) {
      setErrorMessage('Please fill in all mandatory fields (Name, Phone, Address, City).');
      return;
    }

    // Sri Lankan phone number sanity check
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 9) {
      setErrorMessage('Please enter a valid phone number so our courier can contact you upon arrival.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '/logo.png',
        sku: item.product.sku,
        dimensions: item.product.dimensions,
      }));

      const newOrder = await createOrder({
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || 'not-provided@customer.lk',
          address: formData.address.trim(),
          city: formData.city.trim(),
          district: formData.district,
          postalCode: formData.postalCode.trim(),
          notes: formData.notes.trim(),
        },
        items: orderItems,
        subtotal,
        deliveryFee,
        total: grandTotal,
        status: 'Pending',
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
      });

      // Track conversion
      trackPurchase({
        id: newOrder.id,
        total: grandTotal,
        items: orderItems,
      });

      // Clear Cart
      clearCart();

      // Redirect to Order Confirmation page
      router.push(`/order-success/${newOrder.id}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Failed to submit order. Please retry.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Bag</span>
        </Link>
      </div>

      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Cash on Delivery Guaranteed</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          Complete Your Order
        </h1>
        <p className="text-xs sm:text-sm text-brand-600 mt-2">
          Pay with cash when our trusted courier delivers your package safely to your doorstep.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-bold text-brand-950 pb-3 border-b border-brand-100 flex items-center justify-between">
              <span>Shipping & Delivery Address</span>
              <span className="text-xs font-sans font-normal text-brand-500">* Required</span>
            </h2>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Dilini Gamage"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  Contact Phone Number (For Courier) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 077 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  Email Address (For Order Receipt)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. dilini@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} {d === 'Colombo' || d === 'Gampaha' ? '(1-2 days)' : '(2-4 days)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-800 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="House No, Street Name, Apartment / Landmark"
                value={formData.address}
                onChange={handleChange}
                className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Negombo, Dehiwala, Kandy"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="e.g. 11500"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-800 mb-1">
                Special Delivery Notes (Optional)
              </label>
              <textarea
                name="notes"
                rows={2}
                placeholder="Gate color, landmark near the house, preferred calling time..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            {/* Payment Method Section */}
            <div className="pt-4 border-t border-brand-100">
              <h3 className="font-serif text-base font-bold text-brand-950 mb-3">
                Payment Method
              </h3>
              <div className="p-4 rounded-2xl border-2 border-brand-800 bg-brand-50/50 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-950 uppercase tracking-wide">
                    Cash on Delivery (COD)
                  </h4>
                  <p className="text-[11px] text-brand-600 mt-0.5 leading-relaxed">
                    No card or bank transfer required now. Pay the total in Sri Lankan Rupees directly to the delivery rider once your parcel arrives.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-all shadow-lifted ${
                isSubmitting ? 'bg-brand-400 cursor-wait' : 'bg-brand-900 hover:bg-brand-800 active:scale-98'
              }`}
            >
              {isSubmitting ? 'Placing Your Order...' : `Confirm Order • LKR ${grandTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Order Items Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-200 p-6 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-950 pb-3 border-b border-brand-100">
              Your Items ({cart.length})
            </h3>

            <div className="divide-y divide-brand-100 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-100 flex-shrink-0 border border-brand-200">
                    <Image
                      src={item.product.images[0] || '/logo.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-brand-950 truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-brand-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-950">
                    LKR {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-100 space-y-2 text-xs text-brand-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-950">LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({formData.district})</span>
                <span className="font-semibold text-brand-950">
                  {deliveryFee === 0 ? 'FREE' : `LKR ${deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-brand-100 flex justify-between items-baseline text-sm">
                <span className="font-bold text-brand-900">Total Due on Arrival</span>
                <span className="font-serif text-2xl font-bold text-brand-950">
                  LKR {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Safe Delivery Card */}
          <div className="p-4 rounded-2xl bg-brand-100/40 border border-brand-200 text-xs text-brand-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-brand-950">
              <Truck className="w-4 h-4 text-brand-700" />
              <span>Prompt Islandwide Courier</span>
            </div>
            <p className="text-[11px] leading-relaxed text-brand-700">
              Your parcel is hand-checked, cushioned with multi-layer air cushioning, and handed over to our verified courier within 24 hours of placement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
