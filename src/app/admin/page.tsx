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
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [fetchedOrders, fetchedProds] = await Promise.all([getOrders(), getProducts()]);
    setOrders(fetchedOrders);
    setProducts(fetchedProds);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    if (!confirm('This will seed the initial categories, 24 products, and store settings into Firestore. Proceed?')) return;
    setSeeding(true);
    const res = await seedDatabase();
    setSeedMessage(res.message);
    setSeeding(false);
    loadData();
    setTimeout(() => setSeedMessage(''), 5000);
  };

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const lowStockProducts = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 3);
  const outOfStockProducts = products.filter((p) => p.stockQuantity <= 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Operations Dashboard
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            Real-time sales, order fulfillment, and inventory analytics for Lola Studio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white border border-brand-200 text-brand-700 hover:text-brand-950 hover:bg-brand-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2.5 rounded-xl bg-brand-100 hover:bg-brand-200 text-brand-900 text-xs font-bold flex items-center gap-1.5 transition-colors border border-brand-200 shadow-sm"
          >
            <Database className="w-4 h-4 text-brand-700" />
            <span>{seeding ? 'Seeding Firestore...' : 'Sync/Seed DB'}</span>
          </button>

          <a
            href="/admin/products?action=new"
            className="px-4 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </a>
        </div>
      </div>

      {seedMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{seedMessage}</span>
        </div>
      )}

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-500 font-semibold uppercase tracking-wider">
            <span>Total Gross Revenue</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 block">
            LKR {totalRevenue.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            Cash on Delivery processed
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-500 font-semibold uppercase tracking-wider">
            <span>Total Orders Placed</span>
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 block">
            {orders.length} Orders
          </span>
          <span className="text-[11px] text-brand-600">
            {deliveredOrders} delivered • {processingOrders} processing
          </span>
        </div>

        {/* Pending Action Orders */}
        <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-500 font-semibold uppercase tracking-wider">
            <span>Pending Review</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 block">
            {pendingOrders} Orders
          </span>
          <a href="/admin/orders?status=Pending" className="text-[11px] text-brand-800 font-bold underline">
            Review awaiting orders →
          </a>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-500 font-semibold uppercase tracking-wider">
            <span>Low Stock Items (&lt; 3)</span>
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-red-600 block">
            {lowStockProducts.length + outOfStockProducts.length} SKUs
          </span>
          <a href="/admin/categories" className="text-[11px] text-red-700 font-bold underline">
            View inventory report →
          </a>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders + Quick Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-100">
            <h2 className="font-serif text-lg font-bold text-brand-950">
              Recent Order Activity
            </h2>
            <a
              href="/admin/orders"
              className="text-xs font-bold uppercase tracking-wider text-brand-800 hover:text-brand-950 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-brand-500">
              No orders received yet. Place a test order through the storefront!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-100 text-brand-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">District</th>
                    <th className="pb-3 font-semibold">Amount (COD)</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {orders.slice(0, 6).map((order) => (
                    <tr key={order.id} className="hover:bg-brand-50/50 transition-colors">
                      <td className="py-3.5 font-mono font-semibold text-brand-950">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5">
                        <span className="font-semibold text-brand-900 block">{order.customer.name}</span>
                        <span className="text-[11px] text-brand-500">{order.customer.phone}</span>
                      </td>
                      <td className="py-3.5 text-brand-700">{order.customer.district}</td>
                      <td className="py-3.5 font-bold text-brand-950">
                        LKR {order.total.toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Dispatched'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <a
                          href={`/admin/orders?search=${order.orderNumber}`}
                          className="px-2.5 py-1.5 rounded-lg bg-brand-100 text-brand-900 hover:bg-brand-200 text-[11px] font-semibold"
                        >
                          Manage
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Inventory Stock Alert Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-200 p-6 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-brand-950 pb-3 border-b border-brand-100 flex items-center justify-between">
              <span>Low-Stock Monitor</span>
              <span className="text-xs text-red-600 font-bold">
                {lowStockProducts.length + outOfStockProducts.length} Need Action
              </span>
            </h2>

            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <p className="text-xs text-brand-500 py-4 text-center">
                All inventory healthy with 4+ units in stock.
              </p>
            ) : (
              <div className="space-y-3">
                {outOfStockProducts.map((p) => (
                  <div key={p.id} className="p-3 rounded-2xl bg-red-50/70 border border-red-200 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-semibold text-brand-950 truncate max-w-[170px]">{p.name}</h4>
                      <span className="text-[10px] text-red-700 font-bold uppercase">OUT OF STOCK (0 units)</span>
                    </div>
                    <a
                      href={`/admin/products?edit=${p.id}`}
                      className="px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-700 text-[11px] font-bold"
                    >
                      Restock
                    </a>
                  </div>
                ))}
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-semibold text-brand-950 truncate max-w-[170px]">{p.name}</h4>
                      <span className="text-[10px] text-amber-800 font-bold uppercase">Only {p.stockQuantity} left</span>
                    </div>
                    <a
                      href={`/admin/products?edit=${p.id}`}
                      className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 text-[11px] font-bold"
                    >
                      Adjust
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Support Card */}
          <div className="p-6 rounded-3xl bg-brand-950 text-white space-y-3">
            <h3 className="font-serif text-base font-bold">Lola Studio Hotline</h3>
            <p className="text-xs text-brand-300">
              Negombo Workshop: 075 148 3613
            </p>
            <a
              href="https://wa.me/94751483613"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zen-gold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Launch Studio WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
