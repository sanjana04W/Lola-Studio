'use client';

import React, { useState, useEffect } from 'react';
import { getStoreSettings, saveStoreSettings, seedDatabase } from '@/services/storeService';
import { StoreSettings } from '@/types';
import {
  Settings,
  Save,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Share2,
} from 'lucide-react';

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

  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

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
    if (!confirm('This will seed the database with all 24 curated products and categories. Proceed?')) return;
    setSeeding(true);
    const res = await seedDatabase();
    setSeedMessage(res.message);
    setSeeding(false);
    setTimeout(() => setSeedMessage(''), 6000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Store & Tracking Settings
          </h1>
          <p className="text-xs text-brand-600 mt-1">
            Configure contact coordinates, delivery fees, and marketing attribution pixels.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Store settings successfully saved to Firestore!</span>
        </div>
      )}

      {seedMessage && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>{seedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs text-brand-900">
        {/* Contact Coordinates */}
        <div className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-soft space-y-4">
          <h2 className="font-serif text-lg font-bold text-brand-950 pb-2 border-b border-brand-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-700" />
            <span>Store Coordinates & Contact</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Store / Brand Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Workshop Location</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Direct Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Official Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Announcement Top Bar Text</label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5"
            />
          </div>
        </div>

        {/* Shipping & COD Parameters */}
        <div className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-soft space-y-4">
          <h2 className="font-serif text-lg font-bold text-brand-950 pb-2 border-b border-brand-100 flex items-center gap-2">
            <span>Delivery Rates (LKR)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Colombo & Gampaha COD Fee</label>
              <input
                type="number"
                value={settings.codFeeColombo}
                onChange={(e) => setSettings({ ...settings, codFeeColombo: Number(e.target.value) })}
                className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Outstation Districts COD Fee</label>
              <input
                type="number"
                value={settings.codFeeOther}
                onChange={(e) => setSettings({ ...settings, codFeeOther: Number(e.target.value) })}
                className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Free Delivery Minimum Order</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Social Tracking Pixels */}
        <div className="bg-white rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-soft space-y-4">
          <h2 className="font-serif text-lg font-bold text-brand-950 pb-2 border-b border-brand-100 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-brand-700" />
            <span>Social Marketing Attribution Pixels</span>
          </h2>

          <p className="text-brand-600 text-xs leading-relaxed">
            Configure your Meta (Facebook) and TikTok Pixel IDs. When populated, conversion events (PageView, AddToCart, InitiateCheckout, Purchase) automatically fire.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Meta / Facebook Pixel ID</label>
              <input
                type="text"
                placeholder="e.g. 123456789012345"
                value={settings.metaPixelId || ''}
                onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">TikTok Pixel ID</label>
              <input
                type="text"
                placeholder="e.g. C5A1BC2D3EF4G5HI67"
                value={settings.tiktokPixelId || ''}
                onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
                className="w-full bg-brand-50 border border-brand-200 rounded-xl p-2.5 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-soft"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>

      {/* Database Seeder Utility Card */}
      <div className="bg-brand-100/40 rounded-3xl border border-brand-200 p-6 sm:p-8 space-y-4">
        <h3 className="font-serif text-base font-bold text-brand-950 flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-700" />
          <span>Firestore Catalog Initializer & Reset Tool</span>
        </h3>
        <p className="text-xs text-brand-700 leading-relaxed">
          Need to sync or re-populate the official 24 items with all 3 parent categories and local images into your Firebase Firestore database? Click below to run the batch seed transaction.
        </p>

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold transition-all shadow-sm"
        >
          {seeding ? 'Seeding Firestore...' : 'Seed 24 Products & Categories to Firestore'}
        </button>
      </div>
    </div>
  );
}
