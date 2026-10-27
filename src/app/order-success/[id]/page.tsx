'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrders } from '@/services/storeService';
import { Order } from '@/types';
import {
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  Phone,
  Mail,
  Home,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#B48A60', '#C5A059', '#7F5940', '#FAF7F2'],
      });
    } catch (e) {
      // ignore
    }

    async function load() {
      if (!orderId) return;
      const orders = await getOrders();
      const found = orders.find((o) => o.id === orderId);
      if (found) {
        setOrder(found);
      }
      setLoading(false);
    }
    load();
  }, [orderId]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const whatsappUrl = order
    ? `https://wa.me/94751483613?text=${encodeURIComponent(
        `Hello Lola Studio, I just placed order ${order.orderNumber} for LKR ${order.total.toLocaleString()} (COD) to ${order.customer.city}, ${order.customer.district}. Please confirm my order.`
      )}`
    : 'https://wa.me/94751483613';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Thank You Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block">
          Order Successfully Received!
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          Thank You for Supporting Lola Studio
        </h1>
        <p className="text-xs sm:text-sm text-brand-600 max-w-md mx-auto">
          Your order has been recorded. Our studio owner in Negombo will prepare your handcrafted pieces with care.
        </p>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-soft space-y-6 print:border-0 print:shadow-none">
        {/* Receipt Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-brand-100 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 block">Order Reference</span>
            <span className="font-mono text-xl font-bold text-brand-950">{orderId}</span>
            <span className="text-xs text-brand-500 block mt-0.5">
              Placed on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Status: Pending Review</span>
            </span>
            <button
              onClick={handlePrint}
              className="p-2 text-brand-600 hover:text-brand-950 hover:bg-brand-50 rounded-lg print:hidden transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Customer & Delivery Summary */}
        {order && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-brand-50/50 border border-brand-100 text-xs text-brand-800">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500 block mb-1">
                Recipient Details
              </span>
              <p className="font-bold text-brand-950 text-sm">{order.customer.name}</p>
              <p className="text-brand-700 mt-0.5">Phone: {order.customer.phone}</p>
              {order.customer.email && <p className="text-brand-600">{order.customer.email}</p>}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500 block mb-1">
                Delivery Address (COD)
              </span>
              <p className="font-semibold text-brand-900">{order.customer.address}</p>
              <p className="text-brand-700">
                {order.customer.city}, {order.customer.district} District
              </p>
              {order.customer.notes && (
                <p className="text-[11px] text-brand-500 italic mt-1">Note: {order.customer.notes}</p>
              )}
            </div>
          </div>
        )}

        {/* Items List */}
        {order && (
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-brand-950">
              Ordered Items
            </h3>
            <div className="divide-y divide-brand-100 border-y border-brand-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-100 flex-shrink-0 border border-brand-200">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-brand-950">{item.name}</h4>
                      <p className="text-[11px] text-brand-500">
                        Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-950">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-2 space-y-1.5 text-xs text-brand-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-950">LKR {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee ({order.customer.district})</span>
                <span className="font-semibold text-brand-950">
                  {order.deliveryFee === 0 ? 'FREE' : `LKR ${order.deliveryFee}`}
                </span>
              </div>
              <div className="pt-3 border-t border-brand-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-brand-950">Total Amount Due (COD)</span>
                <span className="font-serif text-2xl font-bold text-brand-950">
                  LKR {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps Card */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <span className="font-bold uppercase tracking-wide text-[11px] block text-amber-950">
            What Happens Next?
          </span>
          <p className="leading-relaxed">
            1. Our owner will review and pack your items with fragile protective wraps.
          </p>
          <p className="leading-relaxed">
            2. Our courier will dispatch your parcel and call your phone (<span className="font-semibold">{order?.customer.phone || 'provided phone'}</span>) prior to delivery.
          </p>
          <p className="leading-relaxed">
            3. Have exact cash of <span className="font-bold text-amber-950">LKR {order?.total.toLocaleString() || 'the total'}</span> ready for the rider.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 print:hidden">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Owner on WhatsApp</span>
          </a>

          <Link
            href="/shop"
            className="py-3 px-6 rounded-xl border border-brand-300 text-brand-900 hover:bg-brand-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Store</span>
          </Link>
        </div>
      </div>

      {/* Owner Contact Bar */}
      <div className="mt-8 text-center text-xs text-brand-600 space-y-2">
        <p>Need to update your delivery address or cancel this order?</p>
        <div className="flex items-center justify-center gap-4 text-brand-900 font-semibold">
          <a href="tel:0751483613" className="flex items-center gap-1 hover:underline">
            <Phone className="w-3.5 h-3.5" /> 075 148 3613
          </a>
          <span>•</span>
          <a href="mailto:dili.gamage11@gmail.com" className="flex items-center gap-1 hover:underline">
            <Mail className="w-3.5 h-3.5" /> dili.gamage11@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
