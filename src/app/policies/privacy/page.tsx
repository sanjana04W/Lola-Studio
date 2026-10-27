import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-brand-600 mt-2">
          Effective Date: October 2026 • Lola Studio
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-brand-200 p-8 sm:p-10 shadow-soft space-y-6 text-xs sm:text-sm text-brand-700 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-brand-950">1. Information We Collect</h2>
          <p>
            When you complete a Cash on Delivery purchase or reach out via our contact channels, we collect only the essential personal details needed to fulfill your order:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Customer Name</li>
            <li>Contact Phone Number (provided to courier delivery riders)</li>
            <li>Delivery Address, City, and District</li>
            <li>Email address (for order receipts and dispatch updates)</li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-lg font-bold text-brand-950">2. Tracking & Analytics Pixels</h2>
          <p>
            We implement <strong>Meta (Facebook) Pixel</strong> and <strong>TikTok Pixel</strong> scripts on this website. These tracking tags measure page views, cart additions, and order conversions to attribute ad traffic from our official social media channels (@lolastudio21 and @lola_studio_21). These tools collect anonymized browser event data and do not store sensitive payment credentials.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-lg font-bold text-brand-950">3. Data Storage & Protection</h2>
          <p>
            Your order records are securely stored on Google Firebase Firestore infrastructure with strict security rules. We never sell, rent, or trade your personal contact information to unauthorized third parties.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-lg font-bold text-brand-950">4. Privacy Contact</h2>
          <p>
            If you wish to review or delete your customer history from our records, please contact our team at <strong>dili.gamage11@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
