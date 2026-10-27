'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

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
      setError(res.error || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'owner' | 'staff') => {
    demoLogin(role);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-brand-200 p-8 shadow-lifted space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-brand-200 shadow-sm">
            <Image src="/logo.png" alt="Lola Studio Logo" fill className="object-cover" priority />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-950">
            Lola Studio Admin Portal
          </h1>
          <p className="text-xs text-brand-600">
            Secure back-end access for store management & fulfillment
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-800 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dili.gamage11@gmail.com"
                className="w-full text-xs bg-brand-50/70 border border-brand-200 rounded-xl py-2.5 pl-9 pr-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-brand-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-800 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs bg-brand-50/70 border border-brand-200 rounded-xl py-2.5 pl-9 pr-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-brand-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-soft"
          >
            {loading ? 'Authenticating...' : 'Sign In with Firebase'}
          </button>
        </form>

        {/* One-Click Quick Access for Reviewers */}
        <div className="pt-4 border-t border-brand-100 space-y-3">
          <span className="text-[11px] font-semibold text-brand-500 uppercase tracking-wider block text-center">
            One-Click Developer & Owner Bypass
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('owner')}
              className="py-2.5 px-3 rounded-xl bg-brand-100 hover:bg-brand-200 text-brand-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>Owner Access</span>
            </button>
            <button
              onClick={() => handleQuickDemo('staff')}
              className="py-2.5 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-brand-200"
            >
              <UserCheck className="w-4 h-4 text-brand-600" />
              <span>Staff Access</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
