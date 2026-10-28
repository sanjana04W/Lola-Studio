'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('dili.gamage11@gmail.com');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#22201E] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#C5A059] selection:text-white relative overflow-hidden">
      {/* Subtle organic background ambient accents matching website */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#E7D8C3]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#D6BFA0]/30 blur-3xl pointer-events-none" />

      {/* Top Breadcrumb: Return to Storefront */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-[11px] text-[#7F5940] uppercase tracking-[0.2em] relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-[#22201E] transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Store</span>
        </Link>
        <span className="font-semibold text-[#A0826D]">Lola Studio Negombo</span>
      </div>

      {/* Main Admin Card - Warm Stone / Ivory Luxury Aesthetic */}
      <div className="w-full max-w-md bg-white border border-[#E8E4DC] rounded-3xl p-8 sm:p-10 shadow-[0_15px_40px_-5px_rgba(45,30,23,0.08)] space-y-6 relative z-10">
        {/* Brand Logo & Header Section */}
        <div className="text-center space-y-3">
          <div className="relative h-14 w-36 mx-auto transition-transform hover:scale-102">
            <Image
              src="/logo.png"
              alt="Lola Studio"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-[0.3em] text-[#22201E] uppercase leading-tight">
              L O L A &nbsp; S T U D I O
            </h1>
            <p className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[#7F5940] font-semibold mt-1">
              A D M I N I S T R A T I O N &nbsp; P O R T A L
            </p>
          </div>
        </div>

        {/* Security Pill Banner: Authorized Access Only */}
        <div className="border border-[#E8E4DC] bg-[#FAF7F2] py-2.5 px-4 text-center rounded-xl flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#B48A60]" />
          <span className="text-[10px] tracking-[0.22em] font-bold uppercase text-[#674937]">
            A U T H O R I Z E D &nbsp; A C C E S S &nbsp; O N L Y
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form with Minimalist Underline Style */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-1">
          {/* Admin Email */}
          <div className="space-y-1.5">
            <label className="block text-[#674937] text-[10px] tracking-[0.22em] font-bold uppercase font-sans">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lolastudio.com"
              className="w-full bg-transparent border-0 border-b border-[#D6BFA0] text-[#22201E] placeholder-[#B48A60]/50 focus:border-[#7F5940] focus:outline-none focus:ring-0 text-xs sm:text-sm py-2 px-0 transition-colors font-sans"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[#674937] text-[10px] tracking-[0.22em] font-bold uppercase font-sans">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-0 border-b border-[#D6BFA0] text-[#22201E] placeholder-[#B48A60]/50 focus:border-[#7F5940] focus:outline-none focus:ring-0 text-xs sm:text-sm py-2 px-0 transition-colors tracking-widest font-sans"
            />
          </div>

          {/* Admin Sign In Button - Warm Gold & Dark Charcoal Luxury Styling */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#C5A059] hover:bg-[#B38F46] active:scale-[0.99] text-[#22201E] font-bold text-xs uppercase tracking-[0.25em] transition-all rounded-xl shadow-soft hover:shadow-lifted font-sans"
            >
              {loading ? 'AUTHENTICATING...' : 'A D M I N &nbsp; S I G N &nbsp; I N'}
            </button>
          </div>
        </form>

        {/* Bottom Contact Administrator Notice */}
        <div className="text-center pt-1">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#8A857A] font-sans">
            C O N T A C T &nbsp; Y O U R &nbsp; A D M I N I S T R A T O R &nbsp; F O R &nbsp; A C C E S S
          </p>
        </div>

        {/* Reviewer Quick Access */}
        <div className="pt-4 border-t border-[#E8E4DC] flex items-center justify-between text-[11px] text-[#674937]">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Instant Sign In:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('owner')}
              className="px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#D6BFA0] hover:bg-[#F4EDE1] text-[#674937] font-bold text-[10px] uppercase tracking-wider transition-colors"
            >
              Owner Access
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('staff')}
              className="px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E4DC] hover:bg-[#F4EDE1] text-[#8A857A] font-medium text-[10px] uppercase tracking-wider transition-colors"
            >
              Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
