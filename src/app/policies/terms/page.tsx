import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-brand-600 mt-2">
          Effective Date: October 2026 • Lola Studio (Negombo, Sri Lanka)
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-brand-200 p-8 sm:p-10 shadow-soft space-y-6 text-xs sm:text-sm text-brand-700 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-brand-950">1. Acceptance of Terms</h2>
          <p>
            By accessing the Lola Studio website and placing an order via our self-service storefront, you agree to comply with and be bound by the following terms of operation.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-lg font-bold text-brand-950">2. Pricing & Currency</h2>
          <p>
            All prices listed on this website are quoted in Sri Lankan Rupees (LKR) and fetched directly from our official database. We reserve the right to modify prices or discontinue items at our discretion without prior notice.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-lg font-bold text-brand-950">3. Intellectual Property</h2>
          <p>
            All photographs, branding logos, sculptural designs, and textual copy displayed on this website are the intellectual property of Lola Studio. Any unauthorized duplication or commercial reproduction without written consent is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-lg font-bold text-brand-950">4. Contact Information</h2>
          <p>
            For legal notices or questions regarding these terms: Lola Studio, Negombo, Sri Lanka • Phone: 075 148 3613 • Email: dili.gamage11@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
