'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getOrders, updateOrderStatus } from '@/services/storeService';
import { Order, OrderStatus } from '@/types';
import {
  Search,
  ShoppingBag,
  MessageCircle,
  Phone,
  ChevronRight,
  X,
  RefreshCw,
} from 'lucide-react';

const STATUS_TABS: Array<{ label: string; value: 'All' | OrderStatus }> = [
  { label: 'All Orders',  value: 'All' },
  { label: 'Pending',     value: 'Pending' },
  { label: 'Processing',  value: 'Processing' },
  { label: 'Dispatched',  value: 'Dispatched' },
  { label: 'Delivered',   value: 'Delivered' },
  { label: 'Cancelled',   value: 'Cancelled' },
];

/* ── Brand-aligned status badge ── */
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

function OrderManagementContent() {
  const searchParams   = useSearchParams();
  const initialStatus  = searchParams.get('status') || 'All';
  const initialSearch  = searchParams.get('search') || '';

  const [orders,         setOrders]         = useState<Order[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [searchQuery,    setSearchQuery]    = useState<string>(initialSearch);
  const [activeOrder,    setActiveOrder]    = useState<Order | null>(null);

  const [statusModalOpen,    setStatusModalOpen]    = useState(false);
  const [targetStatus,       setTargetStatus]       = useState<OrderStatus>('Processing');
  const [statusNote,         setStatusNote]         = useState('');
  const [cancellationReason, setCancellationReason] = useState('Customer requested cancellation via phone');

  const loadData = async () => {
    setLoading(true);
    const fetched = await getOrders();
    setOrders(fetched);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenStatusModal = (status: OrderStatus) => {
    setTargetStatus(status);
    setStatusNote('');
    setStatusModalOpen(true);
  };

  const handleApplyStatusChange = async () => {
    if (!activeOrder) return;
    await updateOrderStatus(
      activeOrder.id,
      targetStatus,
      statusNote || `Updated to ${targetStatus} by staff`,
      targetStatus === 'Cancelled' ? cancellationReason : undefined
    );
    setStatusModalOpen(false);
    await loadData();
    const refreshed = await getOrders();
    const updated   = refreshed.find((o) => o.id === activeOrder.id);
    if (updated) setActiveOrder(updated);
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'All' && o.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !o.orderNumber.toLowerCase().includes(q) &&
        !o.customer.name.toLowerCase().includes(q) &&
        !o.customer.phone.includes(q) &&
        !o.customer.city.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059] mb-1">Management</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#22201E]">Order Fulfilment</h1>
          <p className="text-xs text-[#8E8A80] mt-1">
            Track all COD orders from placement through to delivery and collection.
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-white border border-[#E8E4DC] text-[#7A756B] hover:text-[#22201E] hover:border-[#C5A059]/40 transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {STATUS_TABS.map((tab) => {
          const count = tab.value === 'All' ? orders.length : orders.filter((o) => o.status === tab.value).length;
          const active = selectedStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                active ? 'text-[#14120E] shadow-sm' : 'bg-white text-[#7A756B] hover:bg-[#F5F2ED] border border-[#E8E4DC]'
              }`}
              style={active ? { background: 'linear-gradient(135deg, #C8A252, #D5B560)' } : {}}
            >
              {tab.label}
              <span className={`px-1.5 rounded-full text-[10px] font-bold ${active ? 'bg-black/10 text-[#14120E]' : 'bg-[#F0EDE8] text-[#7A756B]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-[#FDFCFB] border border-[#E8E4DC] rounded-xl py-2.5 pl-9 pr-3 text-[#22201E] placeholder-[#C4C0B8] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] transition-all"
          />
          <Search className="w-4 h-4 text-[#C4C0B8] absolute left-3 top-2.5 pointer-events-none" />
        </div>
        <span className="text-xs text-[#A09890] hidden sm:inline">{filteredOrders.length} orders</span>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-8 h-8 text-[#D8D4CC] mx-auto mb-3" />
            <p className="text-xs text-[#A09890]">No orders found for &quot;{selectedStatus}&quot;.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FDFCFB] border-b border-[#F0EDE8] text-[#A09890] uppercase text-[10px] tracking-widest">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">District</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total (COD)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2ED]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} onClick={() => setActiveOrder(order)} className="hover:bg-[#FDFCFB] transition-colors cursor-pointer">
                    <td className="py-3 px-4 font-mono font-bold text-[#22201E] text-[11px]">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-[#7A756B]">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#22201E]">{order.customer.name}</p>
                      <p className="text-[10px] text-[#A09890]">{order.customer.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-[#7A756B]">{order.customer.district}</td>
                    <td className="py-3 px-4 font-medium text-[#4A4640]">{order.items.reduce((a, i) => a + i.quantity, 0)} items</td>
                    <td className="py-3 px-4 font-bold text-[#22201E]">LKR {order.total.toLocaleString()}</td>
                    <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveOrder(order); }}
                        className="px-3 py-1.5 rounded-lg bg-[#F5F2ED] hover:bg-[#EDE9E2] text-[#4A4640] text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        Details <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveOrder(null)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col">

              {/* Drawer header */}
              <div className="px-6 py-5 border-b border-[#F0EDE8] bg-[#FDFCFB] flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-[10px] uppercase font-semibold tracking-widest text-[#C5A059]">Order Details</p>
                  <h3 className="font-mono text-lg font-bold text-[#22201E]">{activeOrder.orderNumber}</h3>
                </div>
                <button onClick={() => setActiveOrder(null)} className="p-2 text-[#A09890] hover:text-[#22201E] rounded-full hover:bg-[#F0EDE8] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#4A4640]">

                {/* Status actions */}
                <div className="p-4 rounded-2xl bg-[#FDFCFB] border border-[#E8E4DC] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#22201E]">Current Status:</span>
                    <StatusBadge status={activeOrder.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EDE8]">
                    {activeOrder.status === 'Pending' && (
                      <button onClick={() => handleOpenStatusModal('Processing')}
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors">
                        Start Processing
                      </button>
                    )}
                    {(activeOrder.status === 'Pending' || activeOrder.status === 'Processing') && (
                      <button onClick={() => handleOpenStatusModal('Dispatched')}
                        className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors">
                        Mark Dispatched
                      </button>
                    )}
                    {activeOrder.status === 'Dispatched' && (
                      <button onClick={() => handleOpenStatusModal('Delivered')}
                        className="col-span-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors">
                        Mark Delivered &amp; Cash Collected
                      </button>
                    )}
                    {activeOrder.status !== 'Delivered' && activeOrder.status !== 'Cancelled' && (
                      <button onClick={() => handleOpenStatusModal('Cancelled')}
                        className="py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition-colors">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer info */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] space-y-2">
                  <div className="flex justify-between items-start pb-2 border-b border-[#F0EDE8]">
                    <h4 className="font-serif text-sm font-bold text-[#22201E]">Customer &amp; Delivery</h4>
                    <a
                      href={`https://wa.me/94${activeOrder.customer.phone.replace(/^0/, '').replace(/\s/g, '')}?text=${encodeURIComponent(`Hello ${activeOrder.customer.name}, this is Lola Studio regarding your order ${activeOrder.orderNumber}.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold text-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                  <p className="font-semibold text-[#22201E] text-sm">{activeOrder.customer.name}</p>
                  <p className="text-[#7A756B] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <a href={`tel:${activeOrder.customer.phone}`} className="hover:underline">{activeOrder.customer.phone}</a>
                  </p>
                  <p className="text-[#7A756B]">{activeOrder.customer.email}</p>
                  <p className="text-[#4A4640] pt-1">{activeOrder.customer.address}, {activeOrder.customer.city}, {activeOrder.customer.district} District</p>
                  {activeOrder.customer.notes && (
                    <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 text-[11px]">
                      <strong>Note:</strong> {activeOrder.customer.notes}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-bold text-[#22201E]">Items ({activeOrder.items.length})</h4>
                  <div className="divide-y divide-[#F0EDE8] border-y border-[#F0EDE8]">
                    {activeOrder.items.map((item, i) => (
                      <div key={i} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#F5F2ED] flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#22201E]">{item.name}</p>
                            <p className="text-[10px] text-[#A09890]">Qty {item.quantity} × LKR {item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#22201E]">LKR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[#7A756B]">
                      <span>Subtotal</span><span>LKR {activeOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#7A756B]">
                      <span>Delivery ({activeOrder.customer.district})</span>
                      <span>{activeOrder.deliveryFee === 0 ? 'FREE' : `LKR ${activeOrder.deliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[#22201E] pt-2 border-t border-[#F0EDE8]">
                      <span>Grand Total (COD)</span><span>LKR {activeOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-bold text-[#22201E]">Status History</h4>
                  <div className="space-y-2 border-l-2 border-[#E8E4DC] pl-4">
                    {activeOrder.statusHistory?.map((h, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#22201E]">{h.status}</span>
                          <span className="text-[10px] text-[#A09890]">
                            {new Date(h.timestamp).toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8E8A80]">{h.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status transition modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setStatusModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#22201E]">
              Update to &quot;{targetStatus}&quot;
            </h3>

            {targetStatus === 'Cancelled' ? (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#4A4640] uppercase tracking-wider">Cancellation Reason *</label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full text-xs bg-[#FDFCFB] border border-[#E8E4DC] rounded-xl p-2.5 text-[#22201E] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059]"
                >
                  <option>Customer requested cancellation via phone</option>
                  <option>Delivery address outside courier service zone</option>
                  <option>Customer unreachable by courier</option>
                  <option>Duplicate order placed in error</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#4A4640] uppercase tracking-wider">Optional Internal Note</label>
                <input
                  type="text"
                  placeholder="e.g. Courier tracking code #CR-9821…"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full text-xs bg-[#FDFCFB] border border-[#E8E4DC] rounded-xl p-2.5 text-[#22201E] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059]"
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E8E4DC] text-xs text-[#7A756B] hover:bg-[#F5F2ED] transition-colors">
                Cancel
              </button>
              <button onClick={handleApplyStatusChange}
                className="px-5 py-2 rounded-xl text-[#14120E] font-bold text-xs transition-all"
                style={{ background: 'linear-gradient(135deg, #C8A252, #D5B560)' }}>
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderManagementPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderManagementContent />
    </Suspense>
  );
}
