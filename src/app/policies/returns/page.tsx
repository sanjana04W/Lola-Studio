import React from 'react';
import { RefreshCw, CheckCircle2, Phone } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-brand-600 font-semibold block mb-2">
          Customer Protection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          Returns & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-brand-600 mt-2">
          Lola Studio • Negombo, Sri Lanka
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-brand-200 p-8 sm:p-10 shadow-soft space-y-6 text-xs sm:text-sm text-brand-700 leading-relaxed font-sans">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-brand-950">
            1. 100% Transit Breakage Guarantee
          </h2>
          <p>
            We take every precaution when packaging mineral composite items. In the unlikely scenario that your statue or decor item arrives cracked or damaged during courier transit:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Please take clear photographs of the damaged product and outer packaging within 24 hours of delivery.</li>
            <li>Send the photos to our WhatsApp at <strong>075 148 3613</strong> along with your Order Reference ID.</li>
            <li>We will dispatch an immediate, brand-new replacement at zero cost to you, with courier charges borne entirely by Lola Studio.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-xl font-bold text-brand-950">
            2. Handcrafted Organic Variation
          </h2>
          <p>
            Please note that each Lola Studio piece is cast and hand-burnished individually. Minor natural pigment gradations, tiny surface air pinholes characteristic of natural cast stone, and slight shade nuances are hallmarks of authentic handmade artisanship and are not considered defects.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-100">
          <h2 className="font-serif text-xl font-bold text-brand-950">
            3. Change of Mind Exchanges
          </h2>
          <p>
            If you wish to exchange an item for a different size or model within 3 days of delivery, the item must remain unused in its original protective packaging. The customer will only be responsible for the courier return and re-dispatch fee.
          </p>
        </section>
      </div>
    </div>
  );
}
