'use client';

import React, { useState, useEffect } from 'react';
import { getStoreSettings, saveStoreSettings, seedDatabase } from '@/services/storeService';
import { StoreSettings } from '@/types';
import { Settings, Save, Database, CheckCircle2, Phone, Share2, Sparkles } from 'lucide-react';

/* ── Reusable labelled input ── */
function Field({
  label, value, onChange, type = 'text', placeholder, mono = false,
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string; mono?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-[#4A4640] uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full text-xs bg-[#FDFCFB] border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 text-[#22201E] placeholder-[#C4C0B8] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] transition-all ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

/* ── Card wrapper ── */
function SettingsCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F0EDE8] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#C5A059]" />
        </div>
        <h2 className="font-serif text-base font-bold text-[#22201E]">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Lola Studio',
    phone: '075 148 3613',
    email: 'dili.gamage11@gmail.com',
    location: 'Negombo, Sri Lanka',
    codFeeColombo: 350,
    codFeeOther: 450,
    freeDeliveryThreshold: 10000,
    isStoreOpen: true,
    announcementText: '✨ Islandwide Cash on Delivery (COD) Available | Free Delivery on Orders Over LKR 10,000! ✨',
    metaPixelId: '',
    tiktokPixelId: '',
  });

  const [loading,      setLoading]      = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [seeding,      setSeeding]      = useState(false);
  const [seedMessage,  setSeedMessage]  = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const s = await getStoreSettings();
      setSettings(s);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStoreSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSeed = async () => {
    if (!confirm('Seed all 24 curated products and 3 categories into Firestore?')) return;
    setSeeding(true);
    const res = await seedDatabase();
    setSeedMessage(res.message);
    setSeeding(false);
    setTimeout(() => setSeedMessage(''), 6000);
  };

  const set = (key: keyof StoreSettings) => (val: string) =>
    setSettings((prev) => ({ ...prev, [key]: key.startsWith('cod') || key === 'freeDelivery' ? Number(val) : val }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059] mb-1">Configuration</p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#22201E]">Store &amp; Tracking Settings</h1>
        <p className="text-xs text-[#8E8A80] mt-1">
          Configure contact coordinates, delivery fees, and marketing attribution pixels.
        </p>
      </div>

      {/* Success toast */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          Store settings saved to Firestore successfully!
        </div>
      )}
      {seedMessage && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
          {seedMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">

        {/* Contact Coordinates */}
        <SettingsCard icon={Phone} title="Store Coordinates &amp; Contact">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Store / Brand Name"     value={settings.storeName}  onChange={set('storeName')} />
            <Field label="Workshop Location"       value={settings.location}   onChange={set('location')} />
            <Field label="Direct Phone Number"     value={settings.phone}      onChange={set('phone')} type="tel" />
            <Field label="Official Email Address"  value={settings.email}      onChange={set('email')} type="email" />
          </div>
          <Field
            label="Announcement Bar Text"
            value={settings.announcementText}
            onChange={set('announcementText')}
            placeholder="e.g. ✨ Islandwide COD Available…"
          />
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FDFCFB] border border-[#E8E4DC]">
            <div>
              <p className="text-xs font-semibold text-[#22201E]">Store Status</p>
              <p className="text-[11px] text-[#8E8A80]">Toggle to temporarily close the storefront</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings((prev) => ({ ...prev, isStoreOpen: !prev.isStoreOpen }))}
              className={`relative w-11 h-6 rounded-full transition-all ${settings.isStoreOpen ? 'bg-emerald-500' : 'bg-[#D8D4CC]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${settings.isStoreOpen ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </SettingsCard>

        {/* Shipping & COD */}
        <SettingsCard icon={Settings} title="Delivery Rates (LKR)">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Colombo &amp; Gampaha COD Fee" value={settings.codFeeColombo}         onChange={(v) => setSettings((p) => ({ ...p, codFeeColombo: Number(v) }))} type="number" />
            <Field label="Outstation Districts COD Fee"  value={settings.codFeeOther}            onChange={(v) => setSettings((p) => ({ ...p, codFeeOther: Number(v) }))} type="number" />
            <Field label="Free Delivery Min. Order"      value={settings.freeDeliveryThreshold}  onChange={(v) => setSettings((p) => ({ ...p, freeDeliveryThreshold: Number(v) }))} type="number" />
          </div>
        </SettingsCard>

        {/* Pixels */}
        <SettingsCard icon={Share2} title="Social Marketing Pixels">
          <p className="text-xs text-[#8E8A80] leading-relaxed">
            Configure your Meta (Facebook) and TikTok Pixel IDs. When populated, conversion events (PageView, AddToCart, InitiateCheckout, Purchase) automatically fire.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Meta / Facebook Pixel ID" value={settings.metaPixelId   || ''} onChange={set('metaPixelId')}   placeholder="e.g. 123456789012345" mono />
            <Field label="TikTok Pixel ID"           value={settings.tiktokPixelId || ''} onChange={set('tiktokPixelId')} placeholder="e.g. C5A1BC2D3EF…"    mono />
          </div>
        </SettingsCard>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl text-[#14120E] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
            style={{ background: 'linear-gradient(135deg, #C8A252, #D5B560)' }}
          >
            <Save className="w-4 h-4" />
            Save All Settings
          </button>
        </div>
      </form>

      {/* Database seeder */}
      <div className="rounded-2xl border border-[#E8E4DC] p-6 space-y-3" style={{ background: 'linear-gradient(135deg, #FDFCFB, #F7F4EF)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#22201E] flex items-center justify-center">
            <Database className="w-4 h-4 text-[#C5A059]" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#22201E]">Firestore Catalog Initializer</h3>
        </div>
        <p className="text-xs text-[#8E8A80] leading-relaxed max-w-2xl">
          Need to sync or re-populate the official 24 items with all 3 parent categories and local images into your Firebase Firestore database? Click below to run the batch seed transaction.
        </p>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-sm disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #22201E, #2C2A25)' }}
        >
          {seeding ? 'Seeding Firestore…' : 'Seed 24 Products & Categories to Firestore'}
        </button>
      </div>
    </div>
  );
}
