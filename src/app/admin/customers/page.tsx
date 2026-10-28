'use client';

import React, { useState, useEffect } from 'react';
import { getCustomers, getOrders } from '@/services/storeService';
import { Customer } from '@/types';
import { Users, Search, MessageCircle, Sparkles } from 'lucide-react';

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await getCustomers();
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
  const repeatCount        = customers.filter((c) => c.isRepeatCustomer).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059] mb-1">CRM</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#22201E]">Customer Directory</h1>
          <p className="text-xs text-[#8E8A80] mt-1">
            Build lasting relationships with customers from social media and website orders.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9A93]">Total Unique Customers</p>
          <p className="font-serif text-2xl font-bold text-[#22201E]">{customers.length} Contacts</p>
          <p className="text-[11px] text-[#8E8A80]">Acquired via social media &amp; website COD</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9A93]">Repeat Buyer Loyalty</p>
          <p className="font-serif text-2xl font-bold text-emerald-700">{repeatCount} Repeat Clients</p>
          <p className="text-[11px] text-[#8E8A80]">High affinity for new product releases</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9A93]">Lifetime Customer Value</p>
          <p className="font-serif text-2xl font-bold text-[#22201E]">LKR {totalCustomerSpend.toLocaleString()}</p>
          <p className="text-[11px] text-[#8E8A80]">Avg LKR {customers.length > 0 ? Math.round(totalCustomerSpend / customers.length).toLocaleString() : 0} per client</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by customer name, phone, or district…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-[#FDFCFB] border border-[#E8E4DC] rounded-xl py-2.5 pl-9 pr-3 text-[#22201E] placeholder-[#C4C0B8] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] transition-all"
          />
          <Search className="w-4 h-4 text-[#C4C0B8] absolute left-3 top-2.5 pointer-events-none" />
        </div>
        <span className="text-xs text-[#A09890] hidden sm:inline">{filtered.length} customers</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-8 h-8 text-[#D8D4CC] mx-auto mb-3" />
            <p className="text-xs text-[#A09890]">No customers yet. Orders placed on the website register here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FDFCFB] border-b border-[#F0EDE8] text-[#A09890] uppercase text-[10px] tracking-widest">
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Orders</th>
                  <th className="py-3 px-4 font-semibold">Total Spent</th>
                  <th className="py-3 px-4 font-semibold">Last Order</th>
                  <th className="py-3 px-4 font-semibold">Loyalty</th>
                  <th className="py-3 px-4 font-semibold text-right">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2ED]">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#22201E]">{customer.name}</p>
                      <p className="text-[10px] text-[#A09890]">{customer.email || 'No email'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#4A4640]">{customer.district} District</p>
                      <p className="text-[10px] text-[#A09890] truncate max-w-[140px]">{customer.address}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#22201E]">
                      {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#22201E]">LKR {customer.totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#7A756B]">
                      {new Date(customer.lastOrderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4">
                      {customer.isRepeatCustomer ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#C5A059]/20"
                          style={{ background: 'rgba(197,160,89,0.1)', color: '#22201E' }}>
                          <Sparkles className="w-3 h-3 text-[#C5A059]" /> VIP Repeat
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#F0EDE8] text-[#7A756B] text-[10px] font-semibold">First-Time</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`https://wa.me/94${customer.phone.replace(/^0/, '').replace(/\s/g, '')}?text=${encodeURIComponent(`Hello ${customer.name}, thank you for supporting Lola Studio!`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors border border-emerald-100"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
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
