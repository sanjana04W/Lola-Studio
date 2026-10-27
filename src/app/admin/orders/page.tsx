'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getOrders, updateOrderStatus } from '@/services/storeService';
import { Order, OrderStatus } from '@/types';
import {
  Search,
  Filter,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Phone,
  Printer,
  ChevronRight,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const STATUS_TABS: Array<{ label: string; value: 'All' | OrderStatus }> = [
  { label: 'All Orders', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Dispatched', value: 'Dispatched' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
];

function OrderManagementContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  // Selected Order for Drawer Detail
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Status Change Dialog
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('Processing');
  const [statusNote, setStatusNote] = useState('');
  const [cancellationReason, setCancellationReason] = useState('Customer requested cancellation via phone');

  const loadData = async () => {
    setLoading(true);
    const fetched = await getOrders();
    setOrders(fetched);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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

    // Update active order in drawer
    const refreshed = await getOrders();
    const updatedTarget = refreshed.find((o) => o.id === activeOrder.id);
    if (updatedTarget) setActiveOrder(updatedTarget);
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'All' && o.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customer.name.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.includes(q);
      const matchCity = o.customer.city.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Order Fulfillment & Tracking
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            Replace manual social media DMs with centralized order statuses from placement to COD collection.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-white border border-brand-200 text-brand-700 hover:text-brand-950 flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Status Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.value === 'All'
              ? orders.length
              : orders.filter((o) => o.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedStatus === tab.value
                  ? 'bg-brand-900 text-white shadow-soft'
                  : 'bg-white text-brand-700 hover:bg-brand-100/60 border border-brand-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedStatus === tab.value ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl bg-white border border-brand-200 shadow-soft flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-brand-50 border border-brand-200 rounded-xl py-2.5 pl-9 pr-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-brand-400 absolute left-3 top-3 pointer-events-none" />
        </div>
        <span className="text-xs text-brand-500 hidden sm:inline">
          Showing {filteredOrders.length} orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-brand-200 shadow-soft overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-brand-500">
            No orders found under &quot;{selectedStatus}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-brand-50/70 border-b border-brand-100 text-brand-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Date Placed</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">District</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total (COD)</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setActiveOrder(order)}
                    className="hover:bg-brand-50/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-950">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-brand-600">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-brand-950 block">{order.customer.name}</span>
                      <span className="text-[11px] text-brand-500">{order.customer.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-brand-700">{order.customer.district}</td>
                    <td className="py-3.5 px-4 font-medium text-brand-800">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-950">
                      LKR {order.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOrder(order);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-100 hover:bg-brand-200 text-brand-900 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer: Order Detail View */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setActiveOrder(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col animate-slideInRight">
              {/* Drawer Header */}
              <div className="p-6 border-b border-brand-100 bg-brand-50/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500 block">
                    Order Details
                  </span>
                  <h3 className="font-mono text-lg font-bold text-brand-950">
                    {activeOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveOrder(null)}
                  className="p-2 text-brand-500 hover:text-brand-950 rounded-full hover:bg-brand-100/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-brand-800">
                {/* Status Switcher Actions */}
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-brand-900">Current Status:</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        activeOrder.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : activeOrder.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : activeOrder.status === 'Dispatched'
                          ? 'bg-purple-100 text-purple-800'
                          : activeOrder.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {activeOrder.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-200/60">
                    {activeOrder.status === 'Pending' && (
                      <button
                        onClick={() => handleOpenStatusModal('Processing')}
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                      >
                        Start Processing
                      </button>
                    )}
                    {(activeOrder.status === 'Pending' || activeOrder.status === 'Processing') && (
                      <button
                        onClick={() => handleOpenStatusModal('Dispatched')}
                        className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                      >
                        Mark Dispatched
                      </button>
                    )}
                    {activeOrder.status === 'Dispatched' && (
                      <button
                        onClick={() => handleOpenStatusModal('Delivered')}
                        className="col-span-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        Mark Delivered & Cash Collected
                      </button>
                    )}
                    {activeOrder.status !== 'Delivered' && activeOrder.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleOpenStatusModal('Cancelled')}
                        className="py-2 px-3 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 font-semibold text-xs"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer Information & WhatsApp */}
                <div className="p-4 rounded-2xl bg-white border border-brand-200 shadow-soft space-y-2">
                  <h4 className="font-serif text-sm font-bold text-brand-950 pb-2 border-b border-brand-100 flex justify-between">
                    <span>Customer & Delivery</span>
                    <a
                      href={`https://wa.me/94${activeOrder.customer.phone.replace(/^0/, '').replace(/\s/g, '')}?text=${encodeURIComponent(
                        `Hello ${activeOrder.customer.name}, this is Lola Studio regarding your order ${activeOrder.orderNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-sans text-xs font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </h4>

                  <div className="space-y-1">
                    <p className="font-semibold text-brand-950 text-sm">{activeOrder.customer.name}</p>
                    <p className="text-brand-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <a href={`tel:${activeOrder.customer.phone}`} className="underline">
                        {activeOrder.customer.phone}
                      </a>
                    </p>
                    <p className="text-brand-600">{activeOrder.customer.email}</p>
                    <p className="text-brand-800 pt-1">
                      {activeOrder.customer.address}, {activeOrder.customer.city}, {activeOrder.customer.district} District
                    </p>
                    {activeOrder.customer.notes && (
                      <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 text-[11px]">
                        <strong>Customer Note:</strong> {activeOrder.customer.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="space-y-3">
                  <h4 className="font-serif text-sm font-bold text-brand-950">
                    Items in Order ({activeOrder.items.length})
                  </h4>
                  <div className="divide-y divide-brand-100 border-y border-brand-100">
                    {activeOrder.items.map((item, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-brand-100 flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-brand-950 block">{item.name}</span>
                            <span className="text-[11px] text-brand-500">
                              Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-brand-950">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-brand-600">
                      <span>Subtotal</span>
                      <span>LKR {activeOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-600">
                      <span>Delivery ({activeOrder.customer.district})</span>
                      <span>{activeOrder.deliveryFee === 0 ? 'FREE' : `LKR ${activeOrder.deliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-brand-950 pt-2 border-t border-brand-200">
                      <span>Grand Total (COD)</span>
                      <span>LKR {activeOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline History */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-serif text-sm font-bold text-brand-950">
                    Status History & Audit Trail
                  </h4>
                  <div className="space-y-2 border-l-2 border-brand-200 pl-3">
                    {activeOrder.statusHistory?.map((h, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-900">{h.status}</span>
                          <span className="text-[10px] text-brand-400">
                            {new Date(h.timestamp).toLocaleDateString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-600">{h.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Transition Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setStatusModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-950">
              Update Order Status to &quot;{targetStatus}&quot;
            </h3>

            {targetStatus === 'Cancelled' ? (
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  Reason for Cancellation *
                </label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full text-xs bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                >
                  <option value="Customer requested cancellation via phone">Customer requested cancellation via phone</option>
                  <option value="Delivery address outside courier service zone">Delivery address outside courier service zone</option>
                  <option value="Customer unreachable by courier">Customer unreachable by courier</option>
                  <option value="Duplicate order placed in error">Duplicate order placed in error</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-brand-800 mb-1">
                  Optional Internal Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Courier tracking code #CR-9821..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full text-xs bg-brand-50 border border-brand-200 rounded-xl p-2.5 text-brand-950"
                />
              </div>
            )}

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-brand-200 text-xs text-brand-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyStatusChange}
                className="px-5 py-2 rounded-xl bg-brand-900 text-white font-bold text-xs hover:bg-brand-800"
              >
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
    <Suspense fallback={<div>Loading orders feed...</div>}>
      <OrderManagementContent />
    </Suspense>
  );
}
