'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('dili.gamage11@gmail.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error || 'Invalid administrator credentials.');
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'owner' | 'staff') => {
    demoLogin(role);
    router.push('/admin');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'linear-gradient(135deg, #2C2A25 0%, #1A1814 50%, #2C2A25 100%)' }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #C5A059 0, #C5A059 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.45)] overflow-hidden">
          {/* Top gold accent strip */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #C5A059, #E8C87A, #C5A059)' }} />

          <div className="px-8 pt-8 pb-9 space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative h-14 w-36">
                <Image
                  src="/logo.png"
                  alt="Lola Studio"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Title block */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5A059]">
                  Admin Panel
                </span>
              </div>
              <h1 className="text-[26px] font-serif font-bold text-[#22201E] leading-tight">
                Sign In
              </h1>
              <p className="text-sm text-[#8E8A80]">Authorised personnel only</p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#4A4640] uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E4DC] bg-[#FDFCFB] text-[#22201E] text-sm placeholder-[#C4C0B8] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#4A4640] uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[#E8E4DC] bg-[#FDFCFB] text-[#22201E] text-sm placeholder-[#C4C0B8] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A09890] hover:text-[#22201E] transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
                style={{
                  background: loading
                    ? '#B89040'
                    : 'linear-gradient(135deg, #C8A252 0%, #D5B560 50%, #C8A252 100%)',
                  color: '#14120E',
                }}
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </form>

            {/* Quick demo access */}
            <div className="pt-1 border-t border-[#F0EDE8]">
              <p className="text-[10px] text-[#B0AC A4] text-center mb-2.5 uppercase tracking-wider text-[#ADA9A0]">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('owner')}
                  className="py-2 rounded-xl border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold hover:bg-[#C5A059]/8 transition-colors"
                >
                  Owner Access
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('staff')}
                  className="py-2 rounded-xl border border-[#E8E4DC] text-[#7A756B] text-xs font-semibold hover:bg-[#F5F2ED] transition-colors"
                >
                  Staff Access
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-[#FDFCFB] border-t border-[#F0EDE8] text-center">
            <p className="text-[11px] text-[#B0AC A4] text-[#ADA9A0]">
              © {new Date().getFullYear()} Lola Studio. All rights reserved.
            </p>
          </div>
        </div>

        {/* Back to store */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[#8E8A80] hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5"
          >
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
