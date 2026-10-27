import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MapPin, AlertCircle } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-brand-600 font-semibold block mb-2">
          Transparency & Care
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          Shipping & Cash on Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-brand-600 mt-2">
          Last updated: October 2026 • Handcrafted in Negombo, Sri Lanka
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-brand-200 p-8 sm:p-10 shadow-soft space-y-8 text-xs sm:text-sm text-brand-700 leading-relaxed font-sans">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-brand-950 flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-800" />
            1. Islandwide Delivery Coverage
          </h2>
          <p>
            Lola Studio ships exclusively across all 25 administrative districts of Sri Lanka. We partner with reputable domestic courier services specialized in fragile parcel handling.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100">
              <span className="font-bold text-brand-950 block">Colombo & Gampaha (inc. Negombo)</span>
              <p className="text-xs text-brand-600 mt-1">Estimated delivery: <strong>1 to 2 business days</strong></p>
              <p className="text-xs text-brand-600">Standard COD Fee: LKR 350</p>
            </div>
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100">
              <span className="font-bold text-brand-950 block">All Other Districts (Outstation)</span>
              <p className="text-xs text-brand-600 mt-1">Estimated delivery: <strong>2 to 4 business days</strong></p>
              <p className="text-xs text-brand-600">Standard COD Fee: LKR 450</p>
            </div>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-xl font-bold text-brand-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-800" />
            2. Cash on Delivery (COD) Terms
          </h2>
          <p>
            To provide peace of mind to our valued customers, our primary checkout mode is <strong>Cash on Delivery (COD)</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-700">
            <li>No credit cards, debit cards, or prior bank deposits are required at checkout.</li>
            <li>Customers must ensure an active phone number is provided so the courier rider can call before delivery.</li>
            <li>Payment is made in exact cash (Sri Lankan Rupees) upon receiving the parcel.</li>
            <li>Orders exceeding LKR 10,000 qualify for <strong>FREE Delivery</strong> islandwide.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-xl font-bold text-brand-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-800" />
            3. Packaging & Fragile Stone Protection
          </h2>
          <p>
            Because our Buddha statues and mineral stone decors carry significant weight and fine sculptural detail, we use heavy-duty industrial bubble wrap, corner protectors, and reinforced corrugated cartons. Each parcel is sealed with bold &quot;FRAGILE / HANDLE WITH REVERENCE&quot; security tape.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-xl font-bold text-brand-950 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-brand-800" />
            4. Order Cancellation by Customer
          </h2>
          <p>
            If you need to modify your delivery address or cancel an order, please notify us within 6 hours of placement before the order transitions to &quot;Dispatched&quot;. You can contact our owner via telephone or WhatsApp at <strong>075 148 3613</strong> or email <strong>dili.gamage11@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
