'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrders, getProducts, seedDatabase } from '@/services/storeService';
import { Order, Product } from '@/types';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  Database,
  CheckCircle2,
  Phone,
  RefreshCw,
  Package,
  ChevronRight,
} from 'lucide-react';

/* ── Status badge helper ── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending:    'bg-amber-50 text-amber-700 border-amber-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Dispatched: 'bg-purple-50 text-purple-700 border-purple-200',
    Delivered:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled:  'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status] ?? 'bg-stone-50 text-stone-600 border-stone-200'}`}>
      {status}
    </span>
  );
}

/* ── Metric card ── */
function MetricCard({
  label, value, sub, icon: Icon, accent,
}: {
  label: string; value: string; sub?: React.ReactNode;
  icon: React.ElementType; accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9A93]">{label}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="font-serif text-2xl font-bold text-[#22201E] leading-none">{value}</p>
      {sub && <div className="text-[11px] text-[#8E8A80]">{sub}</div>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [seeding,  setSeeding]  = useState(false);
  const [seedMsg,  setSeedMsg]  = useState('');

  const load = async () => {
    setLoading(true);
    const [o, p] = await Promise.all([getOrders(), getProducts()]);
    setOrders(o);
    setProducts(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    if (!confirm('Seed initial 24 products, categories & settings into Firestore?')) return;
    setSeeding(true);
    const r = await seedDatabase();
    setSeedMsg(r.message);
    setSeeding(false);
    load();
    setTimeout(() => setSeedMsg(''), 5000);
  };

  const totalRevenue    = orders.reduce((s, o) => o.status !== 'Cancelled' ? s + o.total : s, 0);
  const pendingOrders   = orders.filter(o => o.status === 'Pending').length;
  const processingOrders= orders.filter(o => o.status === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const lowStock        = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 3);
  const outStock        = products.filter(p => p.stockQuantity <= 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059] mb-1">Lola Studio</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#22201E]">Operations Dashboard</h1>
          <p className="text-xs text-[#8E8A80] mt-1">Real-time sales, fulfilment & inventory overview.</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={load}
            className="p-2.5 rounded-xl bg-white border border-[#E8E4DC] text-[#7A756B] hover:text-[#22201E] hover:border-[#C5A059]/40 transition-all shadow-sm"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E8E4DC] text-[#7A756B] text-xs font-semibold flex items-center gap-1.5 hover:border-[#C5A059]/40 transition-all shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-[#C5A059]" />
            {seeding ? 'Seeding…' : 'Sync / Seed DB'}
          </button>

          <Link
            href="/admin/products?action=new"
            className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm text-[#14120E]"
            style={{ background: 'linear-gradient(135deg, #C8A252, #D5B560)' }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Seed success toast */}
      {seedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {seedMsg}
        </div>
      )}

      {/* ── 4 Metric cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Revenue"
          value={`LKR ${totalRevenue.toLocaleString()}`}
          sub="Cash on Delivery collected"
          icon={TrendingUp}
          accent="bg-emerald-50 text-emerald-700"
        />
        <MetricCard
          label="Total Orders"
          value={`${orders.length}`}
          sub={`${deliveredOrders} delivered · ${processingOrders} processing`}
          icon={ShoppingBag}
          accent="bg-[#C5A059]/10 text-[#C5A059]"
        />
        <MetricCard
          label="Pending Review"
          value={`${pendingOrders}`}
          sub={
            <Link href="/admin/orders?status=Pending" className="text-[#C5A059] font-semibold hover:underline flex items-center gap-1">
              Review now <ArrowRight className="w-3 h-3" />
            </Link>
          }
          icon={Clock}
          accent="bg-amber-50 text-amber-700"
        />
        <MetricCard
          label="Low Stock Alerts"
          value={`${lowStock.length + outStock.length} SKUs`}
          sub={
            <Link href="/admin/categories" className="text-red-600 font-semibold hover:underline flex items-center gap-1">
              View inventory <ArrowRight className="w-3 h-3" />
            </Link>
          }
          icon={AlertTriangle}
          accent="bg-red-50 text-red-600"
        />
      </div>

      {/* ── Two-column: recent orders + stock alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EDE8] flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-[#22201E]">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#C5A059] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="w-8 h-8 text-[#D8D4CC] mx-auto mb-3" />
              <p className="text-xs text-[#A09890]">No orders yet. Place a test order from the storefront!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FDFCFB] border-b border-[#F0EDE8] text-[#A09890] uppercase text-[10px] tracking-widest">
                    <th className="py-3 px-4 font-semibold">Order</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">District</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2ED]">
                  {orders.slice(0, 7).map((order) => (
                    <tr key={order.id} className="hover:bg-[#FDFCFB] transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#22201E] text-[11px]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#22201E]">{order.customer.name}</p>
                        <p className="text-[#A09890] text-[10px]">{order.customer.phone}</p>
                      </td>
                      <td className="py-3 px-4 text-[#7A756B]">{order.customer.district}</td>
                      <td className="py-3 px-4 font-bold text-[#22201E]">
                        LKR {order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders?search=${order.orderNumber}`}
                          className="px-3 py-1.5 rounded-lg bg-[#F5F2ED] hover:bg-[#EDE9E2] text-[#4A4640] text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          Manage <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-4">

          {/* Low Stock Monitor */}
          <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0EDE8] flex items-center justify-between">
              <h2 className="font-serif text-sm font-bold text-[#22201E]">Stock Alerts</h2>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                {lowStock.length + outStock.length} items
              </span>
            </div>

            <div className="p-4">
              {lowStock.length === 0 && outStock.length === 0 ? (
                <div className="py-6 text-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-[#A09890]">All inventory healthy (4+ units).</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {outStock.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#22201E] text-xs truncate">{p.name}</p>
                        <p className="text-[10px] text-red-600 font-bold uppercase">Out of stock</p>
                      </div>
                      <Link href={`/admin/products?edit=${p.id}`}
                        className="text-[11px] font-bold text-red-700 hover:underline flex-shrink-0">
                        Restock
                      </Link>
                    </div>
                  ))}
                  {lowStock.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#22201E] text-xs truncate">{p.name}</p>
                        <p className="text-[10px] text-amber-700 font-bold uppercase">{p.stockQuantity} left</p>
                      </div>
                      <Link href={`/admin/products?edit=${p.id}`}
                        className="text-[11px] font-bold text-amber-800 hover:underline flex-shrink-0">
                        Adjust
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5 space-y-2">
            <h3 className="text-xs font-bold text-[#22201E] uppercase tracking-wider mb-3">Quick Actions</h3>
            {[
              { label: 'Add New Product',  href: '/admin/products?action=new', icon: Package },
              { label: 'Pending Orders',   href: '/admin/orders?status=Pending', icon: Clock },
              { label: 'Customer List',    href: '/admin/customers', icon: ShoppingBag },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F5F2ED] text-xs text-[#4A4640] font-semibold transition-colors group"
              >
                <Icon className="w-3.5 h-3.5 text-[#C5A059]" />
                {label}
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#C4C0B8] group-hover:text-[#C5A059] transition-colors" />
              </Link>
            ))}
          </div>

          {/* Workshop contact */}
          <div className="rounded-2xl p-5 space-y-2 text-white"
               style={{ background: 'linear-gradient(135deg, #22201E 0%, #2C2A25 100%)' }}>
            <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">Workshop Hotline</p>
            <p className="font-serif text-sm font-bold">Lola Studio — Negombo</p>
            <a
              href="https://wa.me/94751483613"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A059] hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              075 148 3613 · WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
