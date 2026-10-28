'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard',          href: '/admin',              icon: LayoutDashboard },
  { name: 'Orders',             href: '/admin/orders',       icon: ShoppingBag },
  { name: 'Products',           href: '/admin/products',     icon: Package },
  { name: 'Categories & Stock', href: '/admin/categories',   icon: Layers },
  { name: 'Customers',          href: '/admin/customers',    icon: Users },
  { name: 'Settings & Pixels',  href: '/admin/settings',     icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { isAdmin, role, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!loading && !isAdmin && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAdmin, loading, pathname, router]);

  /* ── Render login page without chrome ── */
  if (pathname === '/admin/login') return <>{children}</>;

  /* ── Loading / auth guard ── */
  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#7A756B] uppercase tracking-widest font-medium">Verifying access…</p>
        </div>
      </div>
    );
  }

  /* ── Shared sidebar content ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo block */}
      <div className="px-6 py-5 border-b border-[#2E2C28]">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-28 flex-shrink-0">
            <Image src="/logo-light.png" alt="Lola Studio" fill className="object-contain object-left" priority />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059] leading-none">
              Admin
            </span>
            <span className="text-[9px] tracking-widest text-[#5A5650] uppercase leading-none mt-0.5">
              Panel
            </span>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-xl bg-[#1E1C18] border border-[#2E2C28] flex items-center justify-between">
        <span className="text-[10px] text-[#6E6B65]">Signed in as</span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            role === 'owner'
              ? 'bg-[#C5A059]/15 text-[#C5A059]'
              : 'bg-[#3A3835]/60 text-[#8E8A80]'
          }`}
        >
          {role === 'owner' ? 'Owner' : 'Staff'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon   = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-[#C5A059]/15 text-[#C5A059]'
                  : 'text-[#9E9A93] hover:text-[#FAF7F2] hover:bg-[#26241F]'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  active ? 'text-[#C5A059]' : 'text-[#5A5650] group-hover:text-[#8E8A80]'
                }`}
              />
              <span className="text-xs leading-none">{item.name}</span>
              {active && (
                <ChevronRight className="w-3 h-3 ml-auto text-[#C5A059]/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-[#2E2C28] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs text-[#7A756B] hover:text-[#FAF7F2] hover:bg-[#26241F] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          <span>View Storefront</span>
          <span className="ml-auto text-[9px] bg-[#1E1C18] border border-[#35322B] text-[#6E6B65] px-1.5 py-0.5 rounded uppercase tracking-wider">Live</span>
        </a>

        <button
          onClick={async () => { await logout(); router.push('/admin/login'); }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs text-[#7A756B] hover:text-red-300 hover:bg-red-950/20 transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex lg:flex-col w-60 bg-[#18161200] flex-shrink-0"
             style={{ background: 'linear-gradient(180deg, #1A1814 0%, #17150F 100%)' }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-60 flex-shrink-0 flex flex-col z-10"
                 style={{ background: 'linear-gradient(180deg, #1A1814 0%, #17150F 100%)' }}>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-[#5A5650] hover:text-white hover:bg-[#26241F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile Topbar */}
        <header className="lg:hidden bg-white border-b border-[#E8E4DC] px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-[#5A5650] hover:text-[#22201E] hover:bg-[#F0EDE8] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative h-8 w-24">
            <Image src="/logo.png" alt="Lola Studio" fill className="object-contain" />
          </div>

          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
            role === 'owner'
              ? 'bg-[#C5A059]/15 text-[#C5A059]'
              : 'bg-[#F0EDE8] text-[#7A756B]'
          }`}>
            {role}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
