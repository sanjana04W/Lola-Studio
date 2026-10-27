'use client';

import React, { useState, useEffect } from 'react';
import { getCustomers, getOrders } from '@/services/storeService';
import { Customer } from '@/types';
import {
  Users,
  Search,
  MessageCircle,
  Phone,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await getCustomers();
      // If Firestore customer collection was empty, build from orders
      if (list.length === 0) {
        const orders = await getOrders();
        const map = new Map<string, Customer>();
        for (const o of orders) {
          const phone = o.customer.phone.replace(/\s+/g, '');
          if (map.has(phone)) {
            const existing = map.get(phone)!;
            existing.totalOrders += 1;
            existing.totalSpent += o.total;
            existing.isRepeatCustomer = true;
          } else {
            map.set(phone, {
              id: phone,
              name: o.customer.name,
              phone: o.customer.phone,
              email: o.customer.email,
              address: o.customer.address,
              district: o.customer.district,
              totalOrders: 1,
              totalSpent: o.total,
              lastOrderDate: o.createdAt,
              isRepeatCustomer: false,
            });
          }
        }
        setCustomers(Array.from(map.values()));
      } else {
        setCustomers(list);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCustomerSpend = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const repeatCount = customers.filter((c) => c.isRepeatCustomer).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Customer Directory & CRM
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            Build lasting relationships with customers gained from your social media and website orders.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-soft">
          <span className="text-xs text-brand-500 font-semibold uppercase tracking-wider block">
            Total Unique Customers
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mt-1 block">
            {customers.length} Contacts
          </span>
          <span className="text-[11px] text-brand-600 mt-1 block">
            Acquired via social media & website COD checkout
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-soft">
          <span className="text-xs text-brand-500 font-semibold uppercase tracking-wider block">
            Repeat Buyer Loyalty
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 mt-1 block">
            {repeatCount} Repeat Clients
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            High affinity for new product releases
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-soft">
          <span className="text-xs text-brand-500 font-semibold uppercase tracking-wider block">
            Lifetime Customer Value
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mt-1 block">
            LKR {totalCustomerSpend.toLocaleString()}
          </span>
          <span className="text-[11px] text-brand-600 mt-1 block">
            Average LKR {customers.length > 0 ? Math.round(totalCustomerSpend / customers.length).toLocaleString() : 0} per client
          </span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl bg-white border border-brand-200 shadow-soft flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by customer name, phone, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-brand-50 border border-brand-200 rounded-xl py-2.5 pl-9 pr-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-brand-400 absolute left-3 top-3 pointer-events-none" />
        </div>
        <span className="text-xs text-brand-500 hidden sm:inline">
          {filtered.length} customers listed
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-brand-200 shadow-soft overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-brand-500">
            No customers found in CRM database yet. Orders placed on the website automatically register here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-brand-50/70 border-b border-brand-100 text-brand-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Orders Count</th>
                  <th className="py-3.5 px-4 font-semibold">Total Spent (LKR)</th>
                  <th className="py-3.5 px-4 font-semibold">Last Order Date</th>
                  <th className="py-3.5 px-4 font-semibold">Loyalty Badge</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-950 block">{customer.name}</span>
                      <span className="text-[11px] text-brand-500">{customer.email || 'No email'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-brand-700">
                      <span className="font-medium block">{customer.district} District</span>
                      <span className="text-[10px] text-brand-400 truncate max-w-[150px] block">
                        {customer.address}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brand-950">
                      {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-950">
                      LKR {customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-brand-600">
                      {new Date(customer.lastOrderDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      {customer.isRepeatCustomer ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zen-gold/20 text-brand-950 text-[10px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-zen-gold" />
                          <span>VIP Repeat</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 text-[10px] font-semibold">
                          First-Time
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/94${customer.phone.replace(/^0/, '').replace(/\s/g, '')}?text=${encodeURIComponent(
                          `Hello ${customer.name}, thank you for supporting Lola Studio!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
