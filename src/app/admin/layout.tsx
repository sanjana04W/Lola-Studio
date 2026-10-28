'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories & Stock', href: '/admin/categories', icon: Layers },
  { name: 'Customers (CRM)', href: '/admin/customers', icon: Users },
  { name: 'Settings & Pixels', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, role, logout, loading } = useAuth();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  React.useEffect(() => {
    if (!loading && !isAdmin && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAdmin, loading, pathname, router]);

  // If on login page, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Prevent flash of admin layout for unauthenticated guests
  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-xs tracking-[0.2em] uppercase text-[#7F5940] font-sans">
        Authenticating Secure Session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-brand-950 text-brand-100 border-r border-brand-900 flex-shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-brand-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-24">
              <Image src="/logo.png" alt="Lola Studio" fill className="object-contain object-left" priority />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* User Role Badge */}
        <div className="px-6 py-3 bg-brand-900/60 border-b border-brand-900 flex items-center justify-between text-xs">
          <span className="text-brand-300">Access Level:</span>
          <span className="px-2 py-0.5 rounded-full bg-zen-gold/20 text-zen-gold font-bold text-[10px] uppercase tracking-wider">
            {role === 'owner' ? 'Super Admin (Owner)' : 'Staff Fulfillment'}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto text-xs">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-brand-800 text-white shadow-soft font-semibold'
                    : 'text-brand-300 hover:text-white hover:bg-brand-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-zen-gold' : 'text-brand-400'}`} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-900 space-y-2 text-xs">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-brand-300 hover:text-white hover:bg-brand-900/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] text-brand-500">Live</span>
          </a>

          <button
            onClick={async () => {
              await logout();
              router.push('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-red-300 hover:text-red-100 hover:bg-red-950/40 transition-colors text-left font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Topbar */}
        <header className="lg:hidden bg-brand-950 text-white px-4 py-3 flex items-center justify-between border-b border-brand-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSidebar(!mobileSidebar)}
              className="p-1.5 rounded-lg text-brand-300 hover:text-white"
            >
              {mobileSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="font-serif text-base font-bold">Lola Admin</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-brand-800 text-brand-200 uppercase font-bold">
            {role}
          </span>
        </header>

        {/* Mobile Drawer Menu */}
        {mobileSidebar && (
          <div className="lg:hidden bg-brand-950 text-white p-4 space-y-2 border-b border-brand-900">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebar(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs ${
                  pathname === item.href ? 'bg-brand-800 text-white font-bold' : 'text-brand-300'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
            <div className="pt-2 border-t border-brand-900 flex justify-between">
              <a href="/" className="text-xs text-brand-300 underline">View Storefront</a>
              <button
                onClick={async () => {
                  await logout();
                  router.push('/admin/login');
                }}
                className="text-xs text-red-300 underline"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
