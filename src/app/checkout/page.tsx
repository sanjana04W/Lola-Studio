'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Mail,
  RefreshCw,
  Lock,
} from 'lucide-react';

// ── Checkout stages ───────────────────────────────────────────────────────────
type Stage = 'form' | 'otp' | 'placing';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const otpRef = useRef<HTMLDivElement>(null);

  const [stage, setStage] = useState<Stage>('form');
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

  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // General error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (cart.length > 0) trackInitiateCheckout(subtotal, cart.length);
  }, [cart, subtotal]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

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

  const isFreeDelivery = subtotal >= 10000;
  const deliveryFee = isFreeDelivery
    ? 0
    : formData.district === 'Colombo' || formData.district === 'Gampaha'
    ? 350
    : 450;
  const grandTotal = subtotal + deliveryFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ── Step 1: Validate form → send OTP ─────────────────────────────────────
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim()) {
      setErrorMessage('Please fill in all mandatory fields (Name, Phone, Address, City).');
      return;
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 9) {
      setErrorMessage('Please enter a valid phone number so our courier can contact you upon arrival.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address — we will send your verification code there.');
      return;
    }

    await sendOtp();
  };

  const sendOtp = async () => {
    setOtpSending(true);
    setOtpError('');
    setOtpSuccess('');
    setOtpCode('');
    setDevCode(null);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code.');

      setStage('otp');
      // devCode is returned when Gmail isn't configured yet (dev/testing mode)
      if (data.devCode) {
        setDevCode(data.devCode);
        // Store in sessionStorage so it survives dev server restarts
        sessionStorage.setItem('lola_dev_otp', JSON.stringify({ email: formData.email, code: data.devCode }));
        setOtpSuccess('Email not configured — your code is shown below for testing.');
      } else {
        setOtpSuccess(`A 6-digit code was sent to ${formData.email}`);
      }
      setResendCooldown(60);
      setTimeout(() => otpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setOtpSending(false);
    }
  };

  // ── Step 2: Verify OTP → place order ─────────────────────────────────────
  const handleVerifyAndPlace = async () => {
    setOtpError('');
    if (otpCode.trim().length !== 6) {
      setOtpError('Please enter the full 6-digit code.');
      return;
    }

    setStage('placing');

    try {
      // 1. Verify code
      // Fast path: if devCode is present in client state or sessionStorage and matches
      const savedDev = typeof window !== 'undefined' ? sessionStorage.getItem('lola_dev_otp') : null;
      const parsedDev = savedDev ? JSON.parse(savedDev) : null;
      const isClientMatch =
        (devCode && devCode.trim() === otpCode.trim()) ||
        (parsedDev && parsedDev.code === otpCode.trim());

      if (!isClientMatch) {
        // Verify via API route
        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 6000);
          const vRes = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, code: otpCode.trim() }),
            signal: controller.signal,
          });
          clearTimeout(tid);

          const vData = await vRes.json();
          if (!vRes.ok) {
            setOtpError(vData.error || 'Incorrect verification code. Please check and try again.');
            setStage('otp');
            return;
          }
        } catch (fetchErr: any) {
          // If server call fails but code is 6 digits, allow fallback if matching or report error
          console.warn('verify-otp network error:', fetchErr);
          setOtpError('Could not verify code. Please check your connection or retry.');
          setStage('otp');
          return;
        }
      }

      // 2. Place order
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
          email: formData.email.trim(),
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

      trackPurchase({ id: newOrder.id, total: grandTotal, items: orderItems });
      clearCart();

      // Navigate to order success page
      window.location.href = `/order-success/${newOrder.id}`;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setOtpError(err.message || 'Failed to place order. Please retry.');
      setStage('otp');
    }
  };

  const isPlacing = stage === 'placing';

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
        {/* ── Left: Form ── */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handlePlaceOrder}
            className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-soft space-y-6"
          >
            <h2 className="font-serif text-xl font-bold text-brand-950 pb-3 border-b border-brand-100 flex items-center justify-between">
              <span>Shipping &amp; Delivery Address</span>
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
                <label className="block text-xs font-semibold text-brand-800 mb-1">Full Name *</label>
                <input
                  type="text" name="name" required
                  placeholder="e.g. Dilini Gamage"
                  value={formData.name} onChange={handleChange}
                  disabled={stage !== 'form'}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">Contact Phone Number (For Courier) *</label>
                <input
                  type="tel" name="phone" required
                  placeholder="e.g. 077 123 4567"
                  value={formData.phone} onChange={handleChange}
                  disabled={stage !== 'form'}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  Email Address * <span className="text-[#C5A059] font-normal">(Verification code sent here)</span>
                </label>
                <input
                  type="email" name="email" required
                  placeholder="e.g. dilini@gmail.com"
                  value={formData.email} onChange={handleChange}
                  disabled={stage !== 'form'}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">District *</label>
                <select
                  name="district"
                  value={formData.district} onChange={handleChange}
                  disabled={stage !== 'form'}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white disabled:opacity-60"
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
              <label className="block text-xs font-semibold text-brand-800 mb-1">Street Address *</label>
              <input
                type="text" name="address" required
                placeholder="House No, Street Name, Apartment / Landmark"
                value={formData.address} onChange={handleChange}
                disabled={stage !== 'form'}
                className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white disabled:opacity-60"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">City / Town *</label>
                <input
                  type="text" name="city" required
                  placeholder="e.g. Negombo, Dehiwala, Kandy"
                  value={formData.city} onChange={handleChange}
                  disabled={stage !== 'form'}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">Postal Code (Optional)</label>
                <input
                  type="text" name="postalCode"
                  placeholder="e.g. 11500"
                  value={formData.postalCode} onChange={handleChange}
                  disabled={stage !== 'form'}
                  className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-800 mb-1">Special Delivery Notes (Optional)</label>
              <textarea
                name="notes" rows={2}
                placeholder="Gate color, landmark near the house, preferred calling time..."
                value={formData.notes} onChange={handleChange}
                disabled={stage !== 'form'}
                className="w-full text-xs bg-brand-50/60 border border-brand-200 rounded-xl py-2 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white disabled:opacity-60"
              />
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t border-brand-100">
              <h3 className="font-serif text-base font-bold text-brand-950 mb-3">Payment Method</h3>
              <div className="p-4 rounded-2xl border-2 border-brand-800 bg-brand-50/50 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-950 uppercase tracking-wide">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-brand-600 mt-0.5 leading-relaxed">
                    No card or bank transfer required now. Pay the total in Sri Lankan Rupees directly to the delivery rider once your parcel arrives.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit button — only visible in 'form' stage */}
            {stage === 'form' && (
              <button
                type="submit"
                disabled={otpSending}
                className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-all shadow-lifted bg-brand-900 hover:bg-brand-800 active:scale-98 disabled:bg-brand-400 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {otpSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending Verification Code…
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Place Your Order
                  </>
                )}
              </button>
            )}

            {/* Edit details button when in OTP stage */}
            {stage === 'otp' && (
              <button
                type="button"
                onClick={() => { setStage('form'); setOtpError(''); setOtpSuccess(''); }}
                className="w-full py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-brand-700 border border-brand-300 hover:bg-brand-50 transition-all"
              >
                ← Edit Details
              </button>
            )}
          </form>
        </div>

        {/* ── Right: Order Summary + OTP Panel ── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Items card */}
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
                      fill className="object-cover"
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

          {/* ── OTP Verification Panel (appears after "Place Your Order") ── */}
          {(stage === 'otp' || stage === 'placing') && (
            <div
              ref={otpRef}
              className="bg-white rounded-3xl border-2 border-[#C5A059]/40 p-6 shadow-soft space-y-4 animate-fadeIn"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-brand-950">Email Verification</h3>
                  <p className="text-[11px] text-brand-500 leading-snug">
                    Enter the 6-digit code sent to<br />
                    <span className="font-semibold text-brand-800">{formData.email}</span>
                  </p>
                </div>
              </div>

              {/* Success notice */}
              {otpSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>{otpSuccess}</span>
                </div>
              )}

              {/* Dev mode: code shown on-screen when Gmail not yet configured */}
              {devCode && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold uppercase tracking-wide text-[10px] text-amber-700">⚠ Dev Mode — Email not connected</p>
                    <button
                      type="button"
                      onClick={() => setOtpCode(devCode)}
                      className="text-[11px] font-semibold text-amber-800 underline hover:text-amber-950"
                    >
                      Auto-fill Code
                    </button>
                  </div>
                  <p className="text-sm">
                    Verification code: <span className="font-mono font-bold text-xl tracking-widest text-[#22201E] ml-1 bg-white px-2 py-0.5 rounded border border-amber-200">{devCode}</span>
                  </p>
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    To send this code directly to your email inbox, add your Google App Password to <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code>.
                  </p>
                </div>
              )}

              {/* Error notice */}
              {otpError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* Code input */}
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="_ _ _ _ _ _"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  disabled={isPlacing}
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] bg-brand-50/60 border-2 border-brand-200 focus:border-[#C5A059] rounded-xl py-3 px-4 text-brand-950 focus:outline-none transition-colors disabled:opacity-60"
                />
              </div>

              {/* Confirm button */}
              <button
                type="button"
                onClick={handleVerifyAndPlace}
                disabled={isPlacing || otpCode.length < 6}
                className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-all shadow-lifted bg-[#22201E] hover:bg-[#33302C] active:scale-98 disabled:bg-brand-400 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isPlacing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Placing Your Order…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Confirm &amp; Place Order · LKR {grandTotal.toLocaleString()}
                  </>
                )}
              </button>

              {/* Resend */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={resendCooldown > 0 || otpSending || isPlacing}
                  className="text-xs text-brand-500 hover:text-brand-800 disabled:opacity-40 transition-colors inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't receive it? Resend"}
                </button>
              </div>
            </div>
          )}

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
